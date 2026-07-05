import type { DomainState, ExamRecord } from "./types";

export type QueueFilter =
  | "all" | "exam-required" | "eligibility-not-confirmed" | "not-scheduled" | "scheduled"
  | "passed" | "failed" | "transcript-pending" | "transcript-ordered" | "transcript-received"
  | "application-blocked" | "high-risk" | "overdue" | "ready-next-step" | "closed"
  | "study-readiness-pending";

export const now = () => new Date();
export function isOverdue(date: string | null): boolean {
  if (!date) return false;
  return new Date(date).getTime() < now().getTime();
}
export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function readinessConfirmed(s: DomainState, examId: string): boolean {
  return s.studyPrep.find((sp) => sp.examId === examId)?.candidateReadinessConfirmed ?? false;
}

const PENDING_TRANSCRIPT = ["Needs to be ordered", "Ordered", "Sent", "Not confirmed"];

export function matchesFilter(exam: ExamRecord, f: QueueFilter, s: DomainState): boolean {
  switch (f) {
    case "all": return true;
    case "exam-required": return exam.status === "Exam required" || exam.status === "Eligibility under review";
    case "eligibility-not-confirmed": return exam.eligibilityStatus !== "Eligible" && exam.status !== "Closed";
    case "not-scheduled": return !exam.scheduledDate && exam.resultStatus === "Not taken" && exam.status !== "Closed";
    case "scheduled": return exam.status === "Scheduled";
    case "passed": return exam.resultStatus === "Passed";
    case "failed": return exam.resultStatus === "Failed" || exam.status === "Failed - retake needed";
    case "transcript-pending": return exam.transcriptRequired && PENDING_TRANSCRIPT.includes(exam.transcriptStatus);
    case "transcript-ordered": return exam.transcriptStatus === "Ordered";
    case "transcript-received": return exam.transcriptStatus === "Received by board";
    case "application-blocked": return exam.applicationBlocked;
    case "high-risk": return exam.riskLevel === "High";
    case "overdue": return isOverdue(exam.dueDate) && exam.status !== "Closed";
    case "ready-next-step": return exam.status === "Transcript received" || exam.status === "Application unblocked" || (exam.resultStatus === "Passed" && !exam.applicationBlocked);
    case "closed": return exam.status === "Closed";
    case "study-readiness-pending":
      return (exam.studyStatus === "Readiness pending" || exam.studyStatus === "Not ready") ||
        (!!exam.scheduledDate && exam.resultStatus === "Not taken" && !readinessConfirmed(s, exam.id));
    default: return true;
  }
}

export interface Kpi {
  key: string;
  label: string;
  value: number;
  filter: QueueFilter;
  tone: "blue" | "teal" | "amber" | "coral" | "purple" | "slate";
}

export function computeKpis(s: DomainState): Kpi[] {
  const c = (f: QueueFilter) => s.exams.filter((e) => matchesFilter(e, f, s)).length;
  const blockedApps = s.applications.filter((a) => a.blockedByExam || a.blockedByTranscript).length;
  const overdueTasks = s.tasks.filter((t) => t.status !== "Done" && isOverdue(t.dueDate)).length;
  return [
    { key: "required", label: "Exams Required", value: c("exam-required"), filter: "exam-required", tone: "slate" },
    { key: "not-scheduled", label: "Not Scheduled", value: c("not-scheduled"), filter: "not-scheduled", tone: "blue" },
    { key: "scheduled", label: "Scheduled", value: c("scheduled"), filter: "scheduled", tone: "purple" },
    { key: "passed", label: "Passed", value: c("passed"), filter: "passed", tone: "teal" },
    { key: "failed", label: "Failed / Retake Needed", value: c("failed"), filter: "failed", tone: "coral" },
    { key: "transcripts", label: "Transcripts Pending", value: c("transcript-pending"), filter: "transcript-pending", tone: "amber" },
    { key: "blocked", label: "Applications Blocked", value: blockedApps, filter: "application-blocked", tone: "coral" },
    { key: "high-risk", label: "High-Risk Exam Blockers", value: s.exams.filter((e) => e.riskLevel === "High" && e.applicationBlocked).length, filter: "high-risk", tone: "coral" },
    { key: "overdue", label: "Overdue Follow-Ups", value: overdueTasks, filter: "overdue", tone: "amber" },
    { key: "readiness", label: "Study Readiness Pending", value: c("study-readiness-pending"), filter: "study-readiness-pending", tone: "amber" },
  ];
}

export interface AutoFlag { label: string; tone: "amber" | "coral" | "blue" | "purple"; }

export function examAutomationFlags(exam: ExamRecord, s: DomainState): AutoFlag[] {
  const flags: AutoFlag[] = [];
  if (exam.eligibilityStatus === "Eligible" && !exam.scheduledDate && exam.resultStatus === "Not taken")
    flags.push({ label: "Eligible but not scheduled", tone: "amber" });
  if (exam.scheduledDate && exam.resultStatus === "Not taken" && !readinessConfirmed(s, exam.id))
    flags.push({ label: "Readiness not confirmed before scheduled exam", tone: "coral" });
  if (exam.resultStatus === "Passed" && exam.transcriptRequired && exam.transcriptStatus === "Needs to be ordered")
    flags.push({ label: "Transcript not ordered after pass", tone: "amber" });
  const tr = s.transcripts.find((t) => t.examId === exam.id);
  if (tr?.transcriptStatus === "Ordered" && tr.orderedDate && daysBetween(tr.orderedDate, new Date().toISOString()) > 10)
    flags.push({ label: "Transcript pending too long", tone: "coral" });
  if (exam.resultStatus === "Failed") flags.push({ label: "Retake required", tone: "coral" });
  if (exam.transcriptStatus === "Received by board" && exam.applicationBlocked)
    flags.push({ label: "Applications may be unblocked", tone: "blue" });
  return flags;
}

export const lookup = {
  client: (s: DomainState, id: string) => s.clients.find((c) => c.id === id),
  candidate: (s: DomainState, id: string) => s.candidates.find((c) => c.id === id),
  exam: (s: DomainState, id: string) => s.exams.find((e) => e.id === id),
  transcript: (s: DomainState, examId: string) => s.transcripts.find((t) => t.examId === examId),
  study: (s: DomainState, examId: string) => s.studyPrep.find((sp) => sp.examId === examId),
  requirements: (s: DomainState, examId: string) => s.requirements.filter((r) => r.examId === examId),
  applications: (s: DomainState, examId: string) => s.applications.filter((a) => a.examId === examId),
  tasks: (s: DomainState, examId: string) => s.tasks.filter((t) => t.relatedId === examId || t.relatedType === "exam" && t.relatedId === examId),
  escalations: (s: DomainState, examId: string) => s.escalations.filter((e) => e.examId === examId),
  clientUpdates: (s: DomainState, examId: string) => s.clientUpdates.filter((c) => c.examId === examId),
  audit: (s: DomainState, examId: string) => s.auditEvents.filter((a) => a.recordId === examId || a.recordId.startsWith(examId)),
  documents: (s: DomainState, examId: string) => s.documents.filter((d) => d.relatedId === examId),
};

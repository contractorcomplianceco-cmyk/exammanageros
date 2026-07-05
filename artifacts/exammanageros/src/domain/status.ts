import type {
  ExamStatus, EligibilityStatus, StudyStatus, RegistrationStatus,
  ResultStatus, TranscriptStatus, ClientVisibleStatus, RiskLevel,
} from "./types";

export const EXAM_STATUSES: ExamStatus[] = [
  "Exam required", "Eligibility under review", "Eligible to schedule",
  "Study materials sent", "Study readiness pending", "Ready to schedule",
  "Scheduled", "Completed - result pending", "Passed", "Failed - retake needed",
  "Transcript needs to be ordered", "Transcript ordered", "Transcript sent",
  "Transcript received", "Application unblocked", "Closed", "Escalated",
];

export const ELIGIBILITY_STATUSES: EligibilityStatus[] = [
  "Not started", "Under review", "Missing information", "Eligible",
  "Not eligible", "Expired", "Blocked",
];

export const STUDY_STATUSES: StudyStatus[] = [
  "Not started", "Materials needed", "Materials ordered", "Materials sent",
  "Materials received", "Readiness pending", "Ready", "Not ready",
];

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "Not started", "Provider account needed", "Registration started",
  "Scheduled", "Rescheduled", "Cancelled", "Completed",
];

export const RESULT_STATUSES: ResultStatus[] = [
  "Not taken", "Result pending", "Passed", "Failed", "Retake required",
];

export const TRANSCRIPT_STATUSES: TranscriptStatus[] = [
  "Not required", "Needs to be ordered", "Ordered", "Sent",
  "Received by board", "Issue / mismatch", "Not confirmed",
];

export const CLIENT_VISIBLE_STATUSES: ClientVisibleStatus[] = [
  "Exam requirement under review", "Eligibility being confirmed",
  "Study/prep in progress", "Ready to schedule", "Exam scheduled",
  "Exam completed - result pending", "Exam passed", "Transcript pending",
  "Transcript ordered", "Transcript received", "Application can proceed",
  "Retake planning required", "Internal review needed before client update",
];

export const STATES = ["TX", "FL", "GA", "SC", "OH", "TN", "NC", "VA", "MD"];
export const OWNERS = ["Skylar", "Carmen", "Rose", "Emily", "Alyssa", "Christin"];
export const PROVIDERS = ["PSI", "Pearson VUE", "Prometric", "NASCLA"];

export const TASK_TYPES = [
  "Confirm exam requirement", "Confirm eligibility", "Send study materials",
  "Confirm candidate readiness", "Register for exam", "Confirm scheduled date",
  "Follow up before exam", "Request score report", "Ask client/candidate to order transcript",
  "Confirm transcript sent", "Confirm transcript received", "Create retake plan",
  "Notify application owner", "Update ComplianceConnect draft", "Escalate to Rose",
  "Escalate to department lead", "Escalate to licensing strategist",
];

type Tone = "slate" | "blue" | "teal" | "amber" | "coral" | "purple" | "green" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  neutral: "bg-slate-50 text-slate-500 border-slate-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  coral: "bg-rose-50 text-rose-700 border-rose-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

const EXAM_TONE: Record<ExamStatus, Tone> = {
  "Exam required": "slate",
  "Eligibility under review": "amber",
  "Eligible to schedule": "blue",
  "Study materials sent": "blue",
  "Study readiness pending": "amber",
  "Ready to schedule": "blue",
  "Scheduled": "purple",
  "Completed - result pending": "amber",
  "Passed": "green",
  "Failed - retake needed": "coral",
  "Transcript needs to be ordered": "amber",
  "Transcript ordered": "blue",
  "Transcript sent": "blue",
  "Transcript received": "teal",
  "Application unblocked": "green",
  "Closed": "neutral",
  "Escalated": "coral",
};

export function examStatusTone(s: ExamStatus): string { return TONE_CLASS[EXAM_TONE[s]]; }

export function eligibilityTone(s: EligibilityStatus): string {
  const m: Record<EligibilityStatus, Tone> = {
    "Not started": "slate", "Under review": "amber", "Missing information": "amber",
    "Eligible": "green", "Not eligible": "coral", "Expired": "coral", "Blocked": "coral",
  };
  return TONE_CLASS[m[s]];
}

export function studyTone(s: StudyStatus): string {
  const m: Record<StudyStatus, Tone> = {
    "Not started": "slate", "Materials needed": "amber", "Materials ordered": "blue",
    "Materials sent": "blue", "Materials received": "blue", "Readiness pending": "amber",
    "Ready": "green", "Not ready": "coral",
  };
  return TONE_CLASS[m[s]];
}

export function registrationTone(s: RegistrationStatus): string {
  const m: Record<RegistrationStatus, Tone> = {
    "Not started": "slate", "Provider account needed": "amber", "Registration started": "blue",
    "Scheduled": "purple", "Rescheduled": "amber", "Cancelled": "coral", "Completed": "green",
  };
  return TONE_CLASS[m[s]];
}

export function resultTone(s: ResultStatus): string {
  const m: Record<ResultStatus, Tone> = {
    "Not taken": "slate", "Result pending": "amber", "Passed": "green",
    "Failed": "coral", "Retake required": "coral",
  };
  return TONE_CLASS[m[s]];
}

export function transcriptTone(s: TranscriptStatus): string {
  const m: Record<TranscriptStatus, Tone> = {
    "Not required": "neutral", "Needs to be ordered": "amber", "Ordered": "blue",
    "Sent": "blue", "Received by board": "green", "Issue / mismatch": "coral", "Not confirmed": "amber",
  };
  return TONE_CLASS[m[s]];
}

export function riskTone(s: RiskLevel): string {
  const m: Record<RiskLevel, Tone> = { Low: "teal", Medium: "amber", High: "coral" };
  return TONE_CLASS[m[s]];
}

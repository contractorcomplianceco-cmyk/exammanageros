import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildSeed } from "@/domain/seed";
import type {
  DomainState, ExamRecord, ExamStatus, Task, Escalation, ClientUpdateDraft,
  ExamRequirement, StudyPrepRecord, TranscriptRecord, RelatedApplication, AuditEvent,
} from "@/domain/types";

const STORAGE_KEY = "examsmanageros-v2";
export const CURRENT_USER = "Rose Taylor";

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
const nowIso = () => new Date().toISOString();

type AuditInput = Omit<AuditEvent, "id" | "timestamp" | "user"> & Partial<Pick<AuditEvent, "user">>;

export interface StoreActions {
  addAudit: (e: AuditInput) => void;
  setExamStatus: (examId: string, status: ExamStatus) => { ok: boolean; warning?: string };
  updateExam: (examId: string, patch: Partial<ExamRecord>) => void;
  addNote: (examId: string, text: string) => void;

  confirmEligibility: (examId: string) => void;
  addEligibilityIssue: (examId: string, note: string) => void;
  updateRequirement: (reqId: string, patch: Partial<ExamRequirement>) => void;
  addRequirement: (examId: string, name: string, type: string) => void;

  updateStudyPrep: (examId: string, patch: Partial<StudyPrepRecord>) => void;
  markStudyMaterialsSent: (examId: string) => void;
  confirmMaterialsReceived: (examId: string) => void;
  confirmExamReady: (examId: string) => void;
  flagNotReady: (examId: string) => void;

  markScheduled: (examId: string, data: { date: string; time: string; location: string; confirmation: string }) => void;
  rescheduleExam: (examId: string, data: { date: string; time: string }) => void;
  updateScheduling: (examId: string, patch: Partial<ExamRecord>) => void;

  markPassed: (examId: string) => void;
  markFailed: (examId: string) => void;
  markTranscriptOrdered: (examId: string) => void;
  markTranscriptReceived: (examId: string) => void;
  updateTranscript: (examId: string, patch: Partial<TranscriptRecord>) => void;

  unblockApplication: (appId: string) => void;
  updateApplication: (appId: string, patch: Partial<RelatedApplication>) => void;

  addTask: (t: Partial<Task> & { title: string; type: string; relatedType: Task["relatedType"]; relatedId: string }) => void;
  completeTask: (taskId: string) => void;
  updateTask: (taskId: string, patch: Partial<Task>) => void;

  addEscalation: (e: Partial<Escalation> & { examId: string; reason: string }) => void;
  updateEscalation: (escId: string, patch: Partial<Escalation>) => void;

  addClientUpdate: (examId: string) => void;
  updateClientUpdate: (id: string, patch: Partial<ClientUpdateDraft>) => void;
  submitClientUpdate: (id: string) => void;
  approveClientUpdate: (id: string) => void;
  holdClientUpdate: (id: string) => void;
  returnClientUpdate: (id: string) => void;

  resetDemoData: () => void;
}

export type Store = DomainState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => {
      const audit = (e: AuditInput) => {
        const event: AuditEvent = {
          id: genId("aud"), timestamp: nowIso(), user: e.user ?? CURRENT_USER,
          action: e.action, recordType: e.recordType, recordId: e.recordId,
          previousValue: e.previousValue, newValue: e.newValue,
          clientVisible: e.clientVisible, applicationImpacting: e.applicationImpacting,
          aiAssisted: e.aiAssisted, notes: e.notes,
        };
        set((s) => ({ auditEvents: [event, ...s.auditEvents] }));
      };
      const patchExam = (examId: string, patch: Partial<ExamRecord>) =>
        set((s) => ({ exams: s.exams.map((x) => (x.id === examId ? { ...x, ...patch, updatedAt: nowIso() } : x)) }));

      return {
        ...buildSeed(),

        addAudit: audit,

        setExamStatus: (examId, status) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return { ok: false };
          if (status === "Ready to schedule" && exam.eligibilityStatus !== "Eligible") {
            return { ok: false, warning: "Eligibility must be confirmed before this exam can be marked ready to schedule." };
          }
          const prev = exam.status;
          patchExam(examId, { status });
          audit({ action: "Exam status changed", recordType: "exam", recordId: examId, previousValue: prev, newValue: status, clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: "" });
          return { ok: true };
        },

        updateExam: (examId, patch) => patchExam(examId, patch),

        addNote: (examId, text) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          patchExam(examId, { internalNotes: exam.internalNotes ? `${exam.internalNotes}\n\n${text}` : text });
          audit({ action: "Note added", recordType: "exam", recordId: examId, previousValue: "-", newValue: text.slice(0, 60), clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        confirmEligibility: (examId) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          const patch: Partial<ExamRecord> = { eligibilityStatus: "Eligible" };
          if (exam.status === "Exam required" || exam.status === "Eligibility under review") patch.status = "Eligible to schedule";
          patchExam(examId, patch);
          audit({ action: "Eligibility confirmed", recordType: "exam", recordId: examId, previousValue: exam.eligibilityStatus, newValue: "Eligible", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        addEligibilityIssue: (examId, note) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          patchExam(examId, { eligibilityStatus: "Missing information", blocker: note });
          audit({ action: "Eligibility issue added", recordType: "exam", recordId: examId, previousValue: exam.eligibilityStatus, newValue: "Missing information", clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: note });
        },

        updateRequirement: (reqId, patch) =>
          set((s) => ({ requirements: s.requirements.map((r) => (r.id === reqId ? { ...r, ...patch } : r)) })),

        addRequirement: (examId, name, type) =>
          set((s) => ({ requirements: [...s.requirements, { id: genId("req"), examId, requirementName: name, requirementType: type, required: true, status: "Unknown", source: "Manual entry", notes: "" }] })),

        updateStudyPrep: (examId, patch) =>
          set((s) => ({ studyPrep: s.studyPrep.map((sp) => (sp.examId === examId ? { ...sp, ...patch } : sp)) })),

        markStudyMaterialsSent: (examId) => {
          get().updateStudyPrep(examId, { studyMaterialsOrdered: true });
          patchExam(examId, { studyStatus: "Materials sent", status: "Study materials sent" });
          audit({ action: "Study materials sent", recordType: "exam", recordId: examId, previousValue: "-", newValue: "Materials sent", clientVisible: true, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        confirmMaterialsReceived: (examId) => {
          get().updateStudyPrep(examId, { studyMaterialsReceived: true });
          patchExam(examId, { studyStatus: "Materials received" });
          audit({ action: "Note added", recordType: "exam", recordId: examId, previousValue: "-", newValue: "Materials received", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "Study materials received by candidate." });
        },

        confirmExamReady: (examId) => {
          get().updateStudyPrep(examId, { candidateReadinessConfirmed: true, followUpNeeded: false });
          patchExam(examId, { studyStatus: "Ready" });
          audit({ action: "Candidate readiness confirmed", recordType: "exam", recordId: examId, previousValue: "-", newValue: "Ready", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        flagNotReady: (examId) => {
          get().updateStudyPrep(examId, { candidateReadinessConfirmed: false, followUpNeeded: true });
          patchExam(examId, { studyStatus: "Not ready", riskLevel: "High" });
          audit({ action: "Note added", recordType: "exam", recordId: examId, previousValue: "-", newValue: "Not ready", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "Candidate flagged not ready." });
        },

        markScheduled: (examId, data) => {
          patchExam(examId, { status: "Scheduled", registrationStatus: "Scheduled", scheduledDate: data.date, scheduledTime: data.time, testingLocation: data.location, clientVisibleStatus: "Exam scheduled" });
          get().updateTranscript(examId, {});
          audit({ action: "Exam scheduled", recordType: "exam", recordId: examId, previousValue: "-", newValue: `${data.date} ${data.time}`, clientVisible: true, applicationImpacting: false, aiAssisted: false, notes: data.confirmation ? `Confirmation ${data.confirmation}` : "" });
        },

        rescheduleExam: (examId, data) => {
          patchExam(examId, { registrationStatus: "Rescheduled", scheduledDate: data.date, scheduledTime: data.time });
          audit({ action: "Exam rescheduled", recordType: "exam", recordId: examId, previousValue: "-", newValue: `${data.date} ${data.time}`, clientVisible: true, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        updateScheduling: (examId, patch) => patchExam(examId, patch),

        markPassed: (examId) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          patchExam(examId, { resultStatus: "Passed", completedDate: exam.completedDate ?? nowIso(), registrationStatus: "Completed" });
          audit({ action: "Exam passed", recordType: "exam", recordId: examId, previousValue: exam.resultStatus, newValue: "Passed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" });
          if (exam.transcriptRequired) {
            patchExam(examId, { status: "Transcript needs to be ordered", transcriptStatus: "Needs to be ordered", clientVisibleStatus: "Transcript pending" });
            get().updateTranscript(examId, { transcriptStatus: "Needs to be ordered", transcriptRequired: true });
            get().addTask({ title: `Ask client/candidate to order transcript — ${exam.examName}`, type: "Ask client/candidate to order transcript", relatedType: "transcript", relatedId: examId, owner: exam.owner, priority: "High" });
            audit({ action: "Transcript requested", recordType: "transcript", recordId: examId, previousValue: "-", newValue: "Needs to be ordered", clientVisible: false, applicationImpacting: true, aiAssisted: true, notes: "Auto-created: applications remain blocked until transcript is confirmed." });
          } else {
            patchExam(examId, { status: "Passed", applicationBlocked: false, clientVisibleStatus: "Exam passed" });
            get().applications.filter((a) => a.examId === examId && (a.blockedByExam || a.blockedByTranscript)).forEach((a) => {
              set((s) => ({ applications: s.applications.map((x) => (x.id === a.id ? { ...x, blockedByExam: false, blockedByTranscript: false, applicationStatus: "Ready to proceed" } : x)) }));
              audit({ action: "Application unblocked", recordType: "application", recordId: a.id, previousValue: a.applicationStatus, newValue: "Ready to proceed", clientVisible: true, applicationImpacting: true, aiAssisted: true, notes: "Auto-unblocked after pass (no transcript required)." });
            });
          }
        },

        markFailed: (examId) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          patchExam(examId, { resultStatus: "Failed", status: "Failed - retake needed", completedDate: exam.completedDate ?? nowIso(), clientVisibleStatus: "Retake planning required", riskLevel: "High" });
          get().addTask({ title: `Create retake plan — ${exam.examName}`, type: "Create retake plan", relatedType: "exam", relatedId: examId, owner: exam.owner, priority: "High" });
          audit({ action: "Exam failed", recordType: "exam", recordId: examId, previousValue: exam.resultStatus, newValue: "Failed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "Retake task auto-created." });
        },

        markTranscriptOrdered: (examId) => {
          get().updateTranscript(examId, { transcriptStatus: "Ordered", orderedDate: nowIso(), sentToBoard: true });
          patchExam(examId, { transcriptStatus: "Ordered", status: "Transcript ordered", clientVisibleStatus: "Transcript ordered" });
          audit({ action: "Transcript ordered", recordType: "transcript", recordId: examId, previousValue: "Needs to be ordered", newValue: "Ordered", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" });
        },

        markTranscriptReceived: (examId) => {
          get().updateTranscript(examId, { transcriptStatus: "Received by board", receivedByBoard: true, receivedDate: nowIso() });
          patchExam(examId, { transcriptStatus: "Received by board", status: "Transcript received", clientVisibleStatus: "Transcript received" });
          audit({ action: "Transcript received", recordType: "transcript", recordId: examId, previousValue: "Ordered", newValue: "Received by board", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "Related applications can now be reviewed for unblocking." });
        },

        updateTranscript: (examId, patch) =>
          set((s) => ({ transcripts: s.transcripts.map((t) => (t.examId === examId ? { ...t, ...patch } : t)) })),

        unblockApplication: (appId) => {
          const app = get().applications.find((a) => a.id === appId);
          if (!app) return;
          set((s) => ({ applications: s.applications.map((a) => (a.id === appId ? { ...a, applicationStatus: "Ready to proceed", blockedByExam: false, blockedByTranscript: false } : a)) }));
          audit({ action: "Application unblocked", recordType: "application", recordId: appId, previousValue: app.applicationStatus, newValue: "Ready to proceed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "Human-reviewed unblock." });
          const exam = get().exams.find((x) => x.id === app.examId);
          if (exam) {
            const stillBlocked = get().applications.some((a) => a.examId === exam.id && (a.blockedByExam || a.blockedByTranscript));
            patchExam(exam.id, { applicationBlocked: stillBlocked, status: stillBlocked ? exam.status : "Application unblocked" });
          }
        },

        updateApplication: (appId, patch) =>
          set((s) => ({ applications: s.applications.map((a) => (a.id === appId ? { ...a, ...patch } : a)) })),

        addTask: (t) => {
          const task: Task = {
            id: genId("task"), relatedType: t.relatedType, relatedId: t.relatedId, title: t.title, type: t.type,
            owner: t.owner ?? CURRENT_USER, dueDate: t.dueDate ?? null, priority: t.priority ?? "Medium",
            status: t.status ?? "Open", notes: t.notes ?? "", createdAt: nowIso(), updatedAt: nowIso(),
          };
          set((s) => ({ tasks: [task, ...s.tasks] }));
          audit({ action: "Task created", recordType: t.relatedType, recordId: t.relatedId, previousValue: "-", newValue: t.title, clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        completeTask: (taskId) => {
          const t = get().tasks.find((x) => x.id === taskId);
          set((s) => ({ tasks: s.tasks.map((x) => (x.id === taskId ? { ...x, status: "Done", updatedAt: nowIso() } : x)) }));
          if (t) audit({ action: "Task completed", recordType: t.relatedType, recordId: t.relatedId, previousValue: t.status, newValue: "Done", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: t.title });
        },

        updateTask: (taskId, patch) =>
          set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...patch, updatedAt: nowIso() } : t)) })),

        addEscalation: (e) => {
          const esc: Escalation = {
            id: genId("esc"), examId: e.examId, reason: e.reason, severity: e.severity ?? "High",
            owner: e.owner ?? CURRENT_USER, dueDate: e.dueDate ?? null, decisionNeeded: e.decisionNeeded ?? "",
            clientFacingRisk: e.clientFacingRisk ?? "", applicationBlockingRisk: e.applicationBlockingRisk ?? "",
            boardFacingRisk: e.boardFacingRisk ?? "", status: e.status ?? "Open", notes: e.notes ?? "",
            createdAt: nowIso(), updatedAt: nowIso(),
          };
          set((s) => ({ escalations: [esc, ...s.escalations] }));
          patchExam(e.examId, { status: "Escalated" });
          audit({ action: "Escalation created", recordType: "exam", recordId: e.examId, previousValue: "-", newValue: e.reason.slice(0, 60), clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: "" });
        },

        updateEscalation: (escId, patch) => {
          const esc = get().escalations.find((x) => x.id === escId);
          set((s) => ({ escalations: s.escalations.map((x) => (x.id === escId ? { ...x, ...patch, updatedAt: nowIso() } : x)) }));
          if (esc && patch.status && patch.status !== esc.status)
            audit({ action: "Escalation updated", recordType: "exam", recordId: esc.examId, previousValue: esc.status, newValue: patch.status, clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: esc.reason });
        },

        addClientUpdate: (examId) => {
          const exam = get().exams.find((x) => x.id === examId);
          if (!exam) return;
          const cu: ClientUpdateDraft = {
            id: genId("cu"), examId, clientId: exam.clientId, internalStatus: exam.status,
            proposedClientStatus: exam.clientVisibleStatus, draftMessage: "", requestedBy: CURRENT_USER,
            reviewer: "", approvalStatus: "Draft", approvedAt: null, publishedPreviewAt: null, notes: "",
          };
          set((s) => ({ clientUpdates: [cu, ...s.clientUpdates] }));
          audit({ action: "Client update drafted", recordType: "client", recordId: examId, previousValue: "-", newValue: "Draft", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        updateClientUpdate: (id, patch) =>
          set((s) => ({ clientUpdates: s.clientUpdates.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

        submitClientUpdate: (id) => {
          const cu = get().clientUpdates.find((c) => c.id === id);
          set((s) => ({ clientUpdates: s.clientUpdates.map((c) => (c.id === id ? { ...c, approvalStatus: "Submitted for review" } : c)) }));
          if (cu) audit({ action: "Client update submitted", recordType: "client", recordId: cu.examId, previousValue: cu.approvalStatus, newValue: "Submitted for review", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        approveClientUpdate: (id) => {
          const cu = get().clientUpdates.find((c) => c.id === id);
          set((s) => ({ clientUpdates: s.clientUpdates.map((c) => (c.id === id ? { ...c, approvalStatus: "Approved locally", approvedAt: nowIso(), reviewer: CURRENT_USER } : c)) }));
          if (cu) audit({ action: "Client update approved", recordType: "client", recordId: cu.examId, previousValue: "Submitted for review", newValue: "Approved locally", clientVisible: true, applicationImpacting: false, aiAssisted: false, notes: "Approved locally for ComplianceConnect preview." });
        },

        holdClientUpdate: (id) => {
          const cu = get().clientUpdates.find((c) => c.id === id);
          set((s) => ({ clientUpdates: s.clientUpdates.map((c) => (c.id === id ? { ...c, approvalStatus: "On hold" } : c)) }));
          if (cu) audit({ action: "Client update held", recordType: "client", recordId: cu.examId, previousValue: cu.approvalStatus, newValue: "On hold", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        returnClientUpdate: (id) => {
          const cu = get().clientUpdates.find((c) => c.id === id);
          set((s) => ({ clientUpdates: s.clientUpdates.map((c) => (c.id === id ? { ...c, approvalStatus: "Returned for edit" } : c)) }));
          if (cu) audit({ action: "Client update returned", recordType: "client", recordId: cu.examId, previousValue: cu.approvalStatus, newValue: "Returned for edit", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
        },

        resetDemoData: () => set({ ...buildSeed() }),
      };
    },
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        clients: s.clients, candidates: s.candidates, exams: s.exams, requirements: s.requirements,
        providers: s.providers, applications: s.applications, transcripts: s.transcripts, studyPrep: s.studyPrep,
        tasks: s.tasks, escalations: s.escalations, clientUpdates: s.clientUpdates, auditEvents: s.auditEvents, documents: s.documents,
      }),
    }
  )
);

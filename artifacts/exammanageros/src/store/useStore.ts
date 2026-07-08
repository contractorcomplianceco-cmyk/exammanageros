import { create } from "zustand";
import type {
  DomainState, ExamRecord, ExamStatus, Task, Escalation, ClientUpdateDraft,
  ExamRequirement, StudyPrepRecord, TranscriptRecord, RelatedApplication, AuditEvent,
} from "@/domain/types";
import { api } from "@/lib/api";

type AuditInput = Omit<AuditEvent, "id" | "timestamp" | "user"> & Partial<Pick<AuditEvent, "user">>;

export interface StoreActions {
  load: () => Promise<void>;
  loading: boolean;
  error: string | null;
  currentUserName: string;
  setCurrentUserName: (name: string) => void;
  mutate: (mutation: Record<string, unknown>) => Promise<{ ok: boolean; warning?: string }>;

  addAudit: (e: AuditInput) => void;
  setExamStatus: (examId: string, status: ExamStatus) => Promise<{ ok: boolean; warning?: string }>;
  updateExam: (examId: string, patch: Partial<ExamRecord>) => Promise<void>;
  addNote: (examId: string, text: string) => Promise<void>;
  confirmEligibility: (examId: string) => Promise<void>;
  addEligibilityIssue: (examId: string, note: string) => Promise<void>;
  updateRequirement: (reqId: string, patch: Partial<ExamRequirement>) => Promise<void>;
  addRequirement: (examId: string, name: string, type: string) => Promise<void>;
  updateStudyPrep: (examId: string, patch: Partial<StudyPrepRecord>) => Promise<void>;
  markStudyMaterialsSent: (examId: string) => Promise<void>;
  confirmMaterialsReceived: (examId: string) => Promise<void>;
  confirmExamReady: (examId: string) => Promise<void>;
  flagNotReady: (examId: string) => Promise<void>;
  markScheduled: (examId: string, data: { date: string; time: string; location: string; confirmation: string }) => Promise<void>;
  rescheduleExam: (examId: string, data: { date: string; time: string }) => Promise<void>;
  updateScheduling: (examId: string, patch: Partial<ExamRecord>) => Promise<void>;
  markPassed: (examId: string) => Promise<void>;
  markFailed: (examId: string) => Promise<void>;
  markTranscriptOrdered: (examId: string) => Promise<void>;
  markTranscriptReceived: (examId: string) => Promise<void>;
  updateTranscript: (examId: string, patch: Partial<TranscriptRecord>) => Promise<void>;
  unblockApplication: (appId: string) => Promise<void>;
  updateApplication: (appId: string, patch: Partial<RelatedApplication>) => Promise<void>;
  addTask: (t: Partial<Task> & { title: string; type: string; relatedType: Task["relatedType"]; relatedId: string }) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void>;
  addEscalation: (e: Partial<Escalation> & { examId: string; reason: string }) => Promise<void>;
  updateEscalation: (escId: string, patch: Partial<Escalation>) => Promise<void>;
  addClientUpdate: (examId: string) => Promise<void>;
  updateClientUpdate: (id: string, patch: Partial<ClientUpdateDraft>) => Promise<void>;
  submitClientUpdate: (id: string) => Promise<void>;
  approveClientUpdate: (id: string) => Promise<void>;
  holdClientUpdate: (id: string) => Promise<void>;
  returnClientUpdate: (id: string) => Promise<void>;
}

export type Store = DomainState & StoreActions;

const emptyState: DomainState = {
  clients: [], candidates: [], exams: [], requirements: [], providers: [],
  applications: [], transcripts: [], studyPrep: [], tasks: [], escalations: [],
  clientUpdates: [], auditEvents: [], documents: [],
};

export const useStore = create<Store>()((set, get) => ({
  ...emptyState,
  loading: true,
  error: null,
  currentUserName: "",
  setCurrentUserName: (name) => set({ currentUserName: name }),

  load: async () => {
    set({ loading: true, error: null });
    try {
      const state = await api.getDomain() as DomainState;
      set({ ...state, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Failed to load" });
    }
  },

  mutate: async (mutation) => {
    const result = await api.mutate(mutation) as { state: DomainState; warning?: string };
    set({ ...result.state });
    return { ok: !result.warning, warning: result.warning };
  },

  addAudit: () => { /* server-side only */ },

  setExamStatus: (examId, status) => get().mutate({ action: "setExamStatus", examId, status }),
  updateExam: async (examId, patch) => { await get().mutate({ action: "updateExam", examId, patch }); },
  addNote: async (examId, text) => { await get().mutate({ action: "addNote", examId, text }); },
  confirmEligibility: async (examId) => { await get().mutate({ action: "confirmEligibility", examId }); },
  addEligibilityIssue: async (examId, note) => { await get().mutate({ action: "addEligibilityIssue", examId, note }); },
  updateRequirement: async (reqId, patch) => { await get().mutate({ action: "updateRequirement", reqId, patch }); },
  addRequirement: async (examId, name, type) => { await get().mutate({ action: "addRequirement", examId, name, type }); },
  updateStudyPrep: async (examId, patch) => { await get().mutate({ action: "updateStudyPrep", examId, patch }); },
  markStudyMaterialsSent: async (examId) => { await get().mutate({ action: "markStudyMaterialsSent", examId }); },
  confirmMaterialsReceived: async (examId) => { await get().mutate({ action: "confirmMaterialsReceived", examId }); },
  confirmExamReady: async (examId) => { await get().mutate({ action: "confirmExamReady", examId }); },
  flagNotReady: async (examId) => { await get().mutate({ action: "flagNotReady", examId }); },
  markScheduled: async (examId, data) => { await get().mutate({ action: "markScheduled", examId, data }); },
  rescheduleExam: async (examId, data) => { await get().mutate({ action: "rescheduleExam", examId, data }); },
  updateScheduling: async (examId, patch) => { await get().mutate({ action: "updateScheduling", examId, patch }); },
  markPassed: async (examId) => { await get().mutate({ action: "markPassed", examId }); },
  markFailed: async (examId) => { await get().mutate({ action: "markFailed", examId }); },
  markTranscriptOrdered: async (examId) => { await get().mutate({ action: "markTranscriptOrdered", examId }); },
  markTranscriptReceived: async (examId) => { await get().mutate({ action: "markTranscriptReceived", examId }); },
  updateTranscript: async (examId, patch) => { await get().mutate({ action: "updateTranscript", examId, patch }); },
  unblockApplication: async (appId) => { await get().mutate({ action: "unblockApplication", appId }); },
  updateApplication: async (appId, patch) => { await get().mutate({ action: "updateApplication", appId, patch }); },
  addTask: async (t) => { await get().mutate({ action: "addTask", task: t }); },
  completeTask: async (taskId) => { await get().mutate({ action: "completeTask", taskId }); },
  updateTask: async (taskId, patch) => { await get().mutate({ action: "updateTask", taskId, patch }); },
  addEscalation: async (e) => { await get().mutate({ action: "addEscalation", escalation: e }); },
  updateEscalation: async (escId, patch) => { await get().mutate({ action: "updateEscalation", escId, patch }); },
  addClientUpdate: async (examId) => { await get().mutate({ action: "addClientUpdate", examId }); },
  updateClientUpdate: async (id, patch) => { await get().mutate({ action: "updateClientUpdate", id, patch }); },
  submitClientUpdate: async (id) => { await get().mutate({ action: "submitClientUpdate", id }); },
  approveClientUpdate: async (id) => { await get().mutate({ action: "approveClientUpdate", id }); },
  holdClientUpdate: async (id) => { await get().mutate({ action: "holdClientUpdate", id }); },
  returnClientUpdate: async (id) => { await get().mutate({ action: "returnClientUpdate", id }); },
}));

export type DomainState = {
  clients: Record<string, unknown>[];
  candidates: Record<string, unknown>[];
  exams: Record<string, unknown>[];
  requirements: Record<string, unknown>[];
  providers: Record<string, unknown>[];
  applications: Record<string, unknown>[];
  transcripts: Record<string, unknown>[];
  studyPrep: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  escalations: Record<string, unknown>[];
  clientUpdates: Record<string, unknown>[];
  auditEvents: Record<string, unknown>[];
  documents: Record<string, unknown>[];
};

export type MutationRequest =
  | { action: "setExamStatus"; examId: string; status: string }
  | { action: "updateExam"; examId: string; patch: Record<string, unknown> }
  | { action: "addNote"; examId: string; text: string }
  | { action: "confirmEligibility"; examId: string }
  | { action: "addEligibilityIssue"; examId: string; note: string }
  | { action: "updateRequirement"; reqId: string; patch: Record<string, unknown> }
  | { action: "addRequirement"; examId: string; name: string; type: string }
  | { action: "updateStudyPrep"; examId: string; patch: Record<string, unknown> }
  | { action: "markStudyMaterialsSent"; examId: string }
  | { action: "confirmMaterialsReceived"; examId: string }
  | { action: "confirmExamReady"; examId: string }
  | { action: "flagNotReady"; examId: string }
  | { action: "markScheduled"; examId: string; data: { date: string; time: string; location: string; confirmation: string } }
  | { action: "rescheduleExam"; examId: string; data: { date: string; time: string } }
  | { action: "updateScheduling"; examId: string; patch: Record<string, unknown> }
  | { action: "markPassed"; examId: string }
  | { action: "markFailed"; examId: string }
  | { action: "markTranscriptOrdered"; examId: string }
  | { action: "markTranscriptReceived"; examId: string }
  | { action: "updateTranscript"; examId: string; patch: Record<string, unknown> }
  | { action: "unblockApplication"; appId: string }
  | { action: "updateApplication"; appId: string; patch: Record<string, unknown> }
  | { action: "addTask"; task: Record<string, unknown> }
  | { action: "completeTask"; taskId: string }
  | { action: "updateTask"; taskId: string; patch: Record<string, unknown> }
  | { action: "addEscalation"; escalation: Record<string, unknown> }
  | { action: "updateEscalation"; escId: string; patch: Record<string, unknown> }
  | { action: "addClientUpdate"; examId: string }
  | { action: "updateClientUpdate"; id: string; patch: Record<string, unknown> }
  | { action: "submitClientUpdate"; id: string }
  | { action: "approveClientUpdate"; id: string }
  | { action: "holdClientUpdate"; id: string }
  | { action: "returnClientUpdate"; id: string };

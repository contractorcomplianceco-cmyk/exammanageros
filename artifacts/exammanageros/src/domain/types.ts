export type RiskLevel = "Low" | "Medium" | "High";

export type ExamStatus =
  | "Exam required"
  | "Eligibility under review"
  | "Eligible to schedule"
  | "Study materials sent"
  | "Study readiness pending"
  | "Ready to schedule"
  | "Scheduled"
  | "Completed - result pending"
  | "Passed"
  | "Failed - retake needed"
  | "Transcript needs to be ordered"
  | "Transcript ordered"
  | "Transcript sent"
  | "Transcript received"
  | "Application unblocked"
  | "Closed"
  | "Escalated";

export type EligibilityStatus =
  | "Not started"
  | "Under review"
  | "Missing information"
  | "Eligible"
  | "Not eligible"
  | "Expired"
  | "Blocked";

export type StudyStatus =
  | "Not started"
  | "Materials needed"
  | "Materials ordered"
  | "Materials sent"
  | "Materials received"
  | "Readiness pending"
  | "Ready"
  | "Not ready";

export type RegistrationStatus =
  | "Not started"
  | "Provider account needed"
  | "Registration started"
  | "Scheduled"
  | "Rescheduled"
  | "Cancelled"
  | "Completed";

export type ResultStatus =
  | "Not taken"
  | "Result pending"
  | "Passed"
  | "Failed"
  | "Retake required";

export type TranscriptStatus =
  | "Not required"
  | "Needs to be ordered"
  | "Ordered"
  | "Sent"
  | "Received by board"
  | "Issue / mismatch"
  | "Not confirmed";

export type ClientVisibleStatus =
  | "Exam requirement under review"
  | "Eligibility being confirmed"
  | "Study/prep in progress"
  | "Ready to schedule"
  | "Exam scheduled"
  | "Exam completed - result pending"
  | "Exam passed"
  | "Transcript pending"
  | "Transcript ordered"
  | "Transcript received"
  | "Application can proceed"
  | "Retake planning required"
  | "Internal review needed before client update";

export interface Client {
  id: string;
  name: string;
  entityName: string;
  accountManager: string;
  contactName: string;
  contactEmail: string;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  qualifierType: string;
  statesAssociated: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamRecord {
  id: string;
  clientId: string;
  candidateId: string;
  relatedApplicationIds: string[];
  examName: string;
  examType: string;
  jurisdiction: string;
  state: string;
  boardAgency: string;
  provider: string;
  status: ExamStatus;
  eligibilityStatus: EligibilityStatus;
  studyStatus: StudyStatus;
  registrationStatus: RegistrationStatus;
  scheduledDate: string | null;
  scheduledTime: string | null;
  testingLocation: string | null;
  completedDate: string | null;
  resultStatus: ResultStatus;
  transcriptStatus: TranscriptStatus;
  transcriptRequired: boolean;
  applicationBlocked: boolean;
  owner: string;
  reviewer: string;
  nextAction: string;
  dueDate: string | null;
  riskLevel: RiskLevel;
  blocker: string;
  clientVisibleStatus: ClientVisibleStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamRequirement {
  id: string;
  examId: string;
  requirementName: string;
  requirementType: string;
  required: boolean;
  status: "Met" | "Not met" | "Unknown";
  source: string;
  notes: string;
}

export interface ExamProvider {
  id: string;
  providerName: string;
  website: string;
  schedulingMethod: string;
  transcriptMethod: string;
  supportNotes: string;
}

export interface RelatedApplication {
  id: string;
  clientId: string;
  examId: string;
  applicationName: string;
  applicationNumber: string;
  state: string;
  licenseClassification: string;
  applicationStatus: string;
  blockedByExam: boolean;
  blockedByTranscript: boolean;
  dependencyType: string;
  whatCanProceedAfterPass: string;
  whatCanProceedAfterTranscript: string;
  owner: string;
  nextStepAfterUnblocked: string;
}

export interface TranscriptRecord {
  id: string;
  examId: string;
  candidateId: string;
  transcriptRequired: boolean;
  transcriptStatus: TranscriptStatus;
  orderedDate: string | null;
  provider: string;
  deliveryMethod: string;
  sentToBoard: boolean;
  sentToState: boolean;
  receivedByBoard: boolean;
  receivedDate: string | null;
  confirmationNumber: string;
  followUpDueDate: string | null;
  issueNotes: string;
}

export interface StudyPrepRecord {
  id: string;
  examId: string;
  studyMaterialsRequired: boolean;
  studyMaterialsOrdered: boolean;
  studyMaterialsReceived: boolean;
  studyProvider: string;
  prepCourseStatus: string;
  candidateReadinessConfirmed: boolean;
  practiceExamCompleted: boolean;
  followUpNeeded: boolean;
  followUpDueDate: string | null;
  notes: string;
}

export type TaskStatus = "Open" | "In progress" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  relatedType: "exam" | "application" | "transcript" | "client";
  relatedId: string;
  title: string;
  type: string;
  owner: string;
  dueDate: string | null;
  priority: Priority;
  status: TaskStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Escalation {
  id: string;
  examId: string;
  reason: string;
  severity: Severity;
  owner: string;
  dueDate: string | null;
  decisionNeeded: string;
  clientFacingRisk: string;
  applicationBlockingRisk: string;
  boardFacingRisk: string;
  status: "Open" | "In review" | "Resolved";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalStatus =
  | "Draft"
  | "Submitted for review"
  | "Approved locally"
  | "On hold"
  | "Returned for edit";

export interface ClientUpdateDraft {
  id: string;
  examId: string;
  clientId: string;
  internalStatus: string;
  proposedClientStatus: ClientVisibleStatus;
  draftMessage: string;
  requestedBy: string;
  reviewer: string;
  approvalStatus: ApprovalStatus;
  approvedAt: string | null;
  publishedPreviewAt: string | null;
  notes: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  recordType: string;
  recordId: string;
  previousValue: string;
  newValue: string;
  clientVisible: boolean;
  applicationImpacting: boolean;
  aiAssisted: boolean;
  notes: string;
}

export interface DocumentAttachmentPlaceholder {
  id: string;
  relatedType: "exam" | "candidate" | "application" | "transcript";
  relatedId: string;
  documentName: string;
  documentType: string;
  sourceSystem: string;
  status: "Missing" | "Requested" | "Received" | "Preview only";
  notes: string;
}

export interface DomainState {
  clients: Client[];
  candidates: Candidate[];
  exams: ExamRecord[];
  requirements: ExamRequirement[];
  providers: ExamProvider[];
  applications: RelatedApplication[];
  transcripts: TranscriptRecord[];
  studyPrep: StudyPrepRecord[];
  tasks: Task[];
  escalations: Escalation[];
  clientUpdates: ClientUpdateDraft[];
  auditEvents: AuditEvent[];
  documents: DocumentAttachmentPlaceholder[];
}

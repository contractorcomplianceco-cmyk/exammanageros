import { pgTable, text, boolean, jsonb } from "drizzle-orm/pg-core";

export const clientsTable = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  entityName: text("entity_name").notNull(),
  accountManager: text("account_manager").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  riskLevel: text("risk_level").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const candidatesTable = pgTable("candidates", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull(),
  qualifierType: text("qualifier_type").notNull(),
  statesAssociated: jsonb("states_associated").$type<string[]>().notNull(),
  notes: text("notes").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const examsTable = pgTable("exams", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  candidateId: text("candidate_id").notNull(),
  relatedApplicationIds: jsonb("related_application_ids").$type<string[]>().notNull(),
  examName: text("exam_name").notNull(),
  examType: text("exam_type").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  state: text("state").notNull(),
  boardAgency: text("board_agency").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull(),
  eligibilityStatus: text("eligibility_status").notNull(),
  studyStatus: text("study_status").notNull(),
  registrationStatus: text("registration_status").notNull(),
  scheduledDate: text("scheduled_date"),
  scheduledTime: text("scheduled_time"),
  testingLocation: text("testing_location"),
  completedDate: text("completed_date"),
  resultStatus: text("result_status").notNull(),
  transcriptStatus: text("transcript_status").notNull(),
  transcriptRequired: boolean("transcript_required").notNull(),
  applicationBlocked: boolean("application_blocked").notNull(),
  owner: text("owner").notNull(),
  reviewer: text("reviewer").notNull(),
  nextAction: text("next_action").notNull(),
  dueDate: text("due_date"),
  riskLevel: text("risk_level").notNull(),
  blocker: text("blocker").notNull(),
  clientVisibleStatus: text("client_visible_status").notNull(),
  internalNotes: text("internal_notes").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const examRequirementsTable = pgTable("exam_requirements", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull(),
  requirementName: text("requirement_name").notNull(),
  requirementType: text("requirement_type").notNull(),
  required: boolean("required").notNull(),
  status: text("status").notNull(),
  source: text("source").notNull(),
  notes: text("notes").notNull(),
});

export const examProvidersTable = pgTable("exam_providers", {
  id: text("id").primaryKey(),
  providerName: text("provider_name").notNull(),
  website: text("website").notNull(),
  schedulingMethod: text("scheduling_method").notNull(),
  transcriptMethod: text("transcript_method").notNull(),
  supportNotes: text("support_notes").notNull(),
});

export const relatedApplicationsTable = pgTable("related_applications", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  examId: text("exam_id").notNull(),
  applicationName: text("application_name").notNull(),
  applicationNumber: text("application_number").notNull(),
  state: text("state").notNull(),
  licenseClassification: text("license_classification").notNull(),
  applicationStatus: text("application_status").notNull(),
  blockedByExam: boolean("blocked_by_exam").notNull(),
  blockedByTranscript: boolean("blocked_by_transcript").notNull(),
  dependencyType: text("dependency_type").notNull(),
  whatCanProceedAfterPass: text("what_can_proceed_after_pass").notNull(),
  whatCanProceedAfterTranscript: text("what_can_proceed_after_transcript").notNull(),
  owner: text("owner").notNull(),
  nextStepAfterUnblocked: text("next_step_after_unblocked").notNull(),
});

export const transcriptRecordsTable = pgTable("transcript_records", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull(),
  candidateId: text("candidate_id").notNull(),
  transcriptRequired: boolean("transcript_required").notNull(),
  transcriptStatus: text("transcript_status").notNull(),
  orderedDate: text("ordered_date"),
  provider: text("provider").notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  sentToBoard: boolean("sent_to_board").notNull(),
  sentToState: boolean("sent_to_state").notNull(),
  receivedByBoard: boolean("received_by_board").notNull(),
  receivedDate: text("received_date"),
  confirmationNumber: text("confirmation_number").notNull(),
  followUpDueDate: text("follow_up_due_date"),
  issueNotes: text("issue_notes").notNull(),
});

export const studyPrepRecordsTable = pgTable("study_prep_records", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull(),
  studyMaterialsRequired: boolean("study_materials_required").notNull(),
  studyMaterialsOrdered: boolean("study_materials_ordered").notNull(),
  studyMaterialsReceived: boolean("study_materials_received").notNull(),
  studyProvider: text("study_provider").notNull(),
  prepCourseStatus: text("prep_course_status").notNull(),
  candidateReadinessConfirmed: boolean("candidate_readiness_confirmed").notNull(),
  practiceExamCompleted: boolean("practice_exam_completed").notNull(),
  followUpNeeded: boolean("follow_up_needed").notNull(),
  followUpDueDate: text("follow_up_due_date"),
  notes: text("notes").notNull(),
});

export const tasksTable = pgTable("tasks", {
  id: text("id").primaryKey(),
  relatedType: text("related_type").notNull(),
  relatedId: text("related_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  owner: text("owner").notNull(),
  dueDate: text("due_date"),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  notes: text("notes").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const escalationsTable = pgTable("escalations", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull(),
  reason: text("reason").notNull(),
  severity: text("severity").notNull(),
  owner: text("owner").notNull(),
  dueDate: text("due_date"),
  decisionNeeded: text("decision_needed").notNull(),
  clientFacingRisk: text("client_facing_risk").notNull(),
  applicationBlockingRisk: text("application_blocking_risk").notNull(),
  boardFacingRisk: text("board_facing_risk").notNull(),
  status: text("status").notNull(),
  notes: text("notes").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const clientUpdateDraftsTable = pgTable("client_update_drafts", {
  id: text("id").primaryKey(),
  examId: text("exam_id").notNull(),
  clientId: text("client_id").notNull(),
  internalStatus: text("internal_status").notNull(),
  proposedClientStatus: text("proposed_client_status").notNull(),
  draftMessage: text("draft_message").notNull(),
  requestedBy: text("requested_by").notNull(),
  reviewer: text("reviewer").notNull(),
  approvalStatus: text("approval_status").notNull(),
  approvedAt: text("approved_at"),
  publishedPreviewAt: text("published_preview_at"),
  externalPublishId: text("external_publish_id"),
  notes: text("notes").notNull(),
});

export const auditEventsTable = pgTable("audit_events", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  recordType: text("record_type").notNull(),
  recordId: text("record_id").notNull(),
  previousValue: text("previous_value").notNull(),
  newValue: text("new_value").notNull(),
  clientVisible: boolean("client_visible").notNull(),
  applicationImpacting: boolean("application_impacting").notNull(),
  aiAssisted: boolean("ai_assisted").notNull(),
  notes: text("notes").notNull(),
});

export const documentsTable = pgTable("documents", {
  id: text("id").primaryKey(),
  relatedType: text("related_type").notNull(),
  relatedId: text("related_id").notNull(),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(),
  sourceSystem: text("source_system").notNull(),
  status: text("status").notNull(),
  notes: text("notes").notNull(),
});

export const appSettingsTable = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

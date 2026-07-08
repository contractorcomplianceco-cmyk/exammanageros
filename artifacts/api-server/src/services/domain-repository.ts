import {
  db,
  clientsTable,
  candidatesTable,
  examsTable,
  examRequirementsTable,
  examProvidersTable,
  relatedApplicationsTable,
  transcriptRecordsTable,
  studyPrepRecordsTable,
  tasksTable,
  escalationsTable,
  clientUpdateDraftsTable,
  auditEventsTable,
  documentsTable,
  appSettingsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { DomainState } from "../types/domain";
import {
  rowToClient, rowToCandidate, rowToExam, rowToRequirement, rowToProvider,
  rowToApplication, rowToTranscript, rowToStudyPrep, rowToTask, rowToEscalation,
  rowToClientUpdate, clientToRow, candidateToRow, examToRow, requirementToRow,
  providerToRow, applicationToRow, transcriptToRow, studyPrepToRow, taskToRow,
  escalationToRow, clientUpdateToRow,
} from "./mappers";

export async function loadDomainState(): Promise<DomainState> {
  const [clients, candidates, exams, requirements, providers, applications, transcripts, studyPrep, tasks, escalations, clientUpdates, auditEvents, documents] = await Promise.all([
    db.select().from(clientsTable), db.select().from(candidatesTable), db.select().from(examsTable),
    db.select().from(examRequirementsTable), db.select().from(examProvidersTable), db.select().from(relatedApplicationsTable),
    db.select().from(transcriptRecordsTable), db.select().from(studyPrepRecordsTable), db.select().from(tasksTable),
    db.select().from(escalationsTable), db.select().from(clientUpdateDraftsTable), db.select().from(auditEventsTable),
    db.select().from(documentsTable),
  ]);
  return {
    clients: clients.map(rowToClient), candidates: candidates.map(rowToCandidate), exams: exams.map(rowToExam),
    requirements: requirements.map(rowToRequirement), providers: providers.map(rowToProvider),
    applications: applications.map(rowToApplication), transcripts: transcripts.map(rowToTranscript),
    studyPrep: studyPrep.map(rowToStudyPrep), tasks: tasks.map(rowToTask), escalations: escalations.map(rowToEscalation),
    clientUpdates: clientUpdates.map(rowToClientUpdate),
    auditEvents: auditEvents.map((r) => ({ id: r.id, timestamp: r.timestamp, user: r.user, action: r.action, recordType: r.recordType, recordId: r.recordId, previousValue: r.previousValue, newValue: r.newValue, clientVisible: r.clientVisible, applicationImpacting: r.applicationImpacting, aiAssisted: r.aiAssisted, notes: r.notes })),
    documents: documents.map((d) => ({ id: d.id, relatedType: d.relatedType, relatedId: d.relatedId, documentName: d.documentName, documentType: d.documentType, sourceSystem: d.sourceSystem, status: d.status, notes: d.notes })),
  };
}

export async function insertDomainState(state: DomainState): Promise<void> {
  if (state.clients.length) await db.insert(clientsTable).values(state.clients.map(clientToRow));
  if (state.candidates.length) await db.insert(candidatesTable).values(state.candidates.map(candidateToRow));
  if (state.exams.length) await db.insert(examsTable).values(state.exams.map(examToRow));
  if (state.requirements.length) await db.insert(examRequirementsTable).values(state.requirements.map(requirementToRow));
  if (state.providers.length) await db.insert(examProvidersTable).values(state.providers.map(providerToRow));
  if (state.applications.length) await db.insert(relatedApplicationsTable).values(state.applications.map(applicationToRow));
  if (state.transcripts.length) await db.insert(transcriptRecordsTable).values(state.transcripts.map(transcriptToRow));
  if (state.studyPrep.length) await db.insert(studyPrepRecordsTable).values(state.studyPrep.map(studyPrepToRow));
  if (state.tasks.length) await db.insert(tasksTable).values(state.tasks.map(taskToRow));
  if (state.escalations.length) await db.insert(escalationsTable).values(state.escalations.map(escalationToRow));
  if (state.clientUpdates.length) await db.insert(clientUpdateDraftsTable).values(state.clientUpdates.map(clientUpdateToRow));
  if (state.auditEvents.length) await db.insert(auditEventsTable).values(state.auditEvents.map((e) => ({ id: String(e.id), timestamp: String(e.timestamp), user: String(e.user), action: String(e.action), recordType: String(e.recordType), recordId: String(e.recordId), previousValue: String(e.previousValue), newValue: String(e.newValue), clientVisible: Boolean(e.clientVisible), applicationImpacting: Boolean(e.applicationImpacting), aiAssisted: Boolean(e.aiAssisted), notes: String(e.notes) })));
  if (state.documents.length) await db.insert(documentsTable).values(state.documents.map((d) => ({ id: String(d.id), relatedType: String(d.relatedType), relatedId: String(d.relatedId), documentName: String(d.documentName), documentType: String(d.documentType), sourceSystem: String(d.sourceSystem), status: String(d.status), notes: String(d.notes) })));
}

export async function isSeeded(): Promise<boolean> {
  const [row] = await db.select().from(appSettingsTable).where(eq(appSettingsTable.key, "seeded")).limit(1);
  return row?.value === "true";
}

export async function markSeeded(): Promise<void> {
  await db.insert(appSettingsTable).values({ key: "seeded", value: "true" }).onConflictDoUpdate({ target: appSettingsTable.key, set: { value: "true" } });
}

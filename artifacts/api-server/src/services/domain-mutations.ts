import { db, auditEventsTable, examsTable, examRequirementsTable, studyPrepRecordsTable, transcriptRecordsTable, relatedApplicationsTable, tasksTable, escalationsTable, clientUpdateDraftsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { DomainState, MutationRequest } from "../types/domain";
import { loadDomainState, insertDomainState } from "./domain-repository";
import { examToRow, requirementToRow, studyPrepToRow, transcriptToRow, applicationToRow, taskToRow, escalationToRow, clientUpdateToRow } from "./mappers";
import { publishClientUpdate } from "../lib/integrations/compliance-connect";
import { syncExamStatusToZoho } from "../lib/integrations/zoho";

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
const nowIso = () => new Date().toISOString();

type AuditInput = Omit<DomainState["auditEvents"][number], "id" | "timestamp"> & { user: string };

export async function executeMutation(mutation: MutationRequest, operatorName: string): Promise<{ state: DomainState; warning?: string }> {
  const state = await loadDomainState();
  let warning: string | undefined;

  const audit = (e: AuditInput) => {
    state.auditEvents.unshift({
      id: genId("aud"), timestamp: nowIso(), user: e.user, action: String(e.action), recordType: String(e.recordType),
      recordId: String(e.recordId), previousValue: String(e.previousValue), newValue: String(e.newValue),
      clientVisible: Boolean(e.clientVisible), applicationImpacting: Boolean(e.applicationImpacting),
      aiAssisted: Boolean(e.aiAssisted), notes: String(e.notes),
    });
  };

  const exam = (id: string) => state.exams.find((x) => x.id === id);
  const patchExam = (examId: string, patch: Record<string, unknown>) => {
    const i = state.exams.findIndex((x) => x.id === examId);
    if (i >= 0) state.exams[i] = { ...state.exams[i], ...patch, updatedAt: nowIso() };
  };

  switch (mutation.action) {
    case "setExamStatus": {
      const e = exam(mutation.examId);
      if (!e) break;
      if (mutation.status === "Ready to schedule" && e.eligibilityStatus !== "Eligible") {
        return { state, warning: "Eligibility must be confirmed before this exam can be marked ready to schedule." };
      }
      audit({ user: operatorName, action: "Exam status changed", recordType: "exam", recordId: mutation.examId, previousValue: String(e.status), newValue: mutation.status, clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: "" });
      patchExam(mutation.examId, { status: mutation.status });
      await syncExamStatusToZoho(mutation.examId, mutation.status);
      break;
    }
    case "updateExam": patchExam(mutation.examId, mutation.patch); break;
    case "addNote": {
      const e = exam(mutation.examId);
      if (!e) break;
      patchExam(mutation.examId, { internalNotes: e.internalNotes ? `${e.internalNotes}\n\n${mutation.text}` : mutation.text });
      audit({ user: operatorName, action: "Note added", recordType: "exam", recordId: mutation.examId, previousValue: "-", newValue: mutation.text.slice(0, 60), clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
      break;
    }
    case "confirmEligibility": {
      const e = exam(mutation.examId);
      if (!e) break;
      const patch: Record<string, unknown> = { eligibilityStatus: "Eligible" };
      if (e.status === "Exam required" || e.status === "Eligibility under review") patch.status = "Eligible to schedule";
      patchExam(mutation.examId, patch);
      audit({ user: operatorName, action: "Eligibility confirmed", recordType: "exam", recordId: mutation.examId, previousValue: String(e.eligibilityStatus), newValue: "Eligible", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" });
      break;
    }
    case "addEligibilityIssue": {
      const e = exam(mutation.examId);
      if (!e) break;
      patchExam(mutation.examId, { eligibilityStatus: "Missing information", blocker: mutation.note });
      audit({ user: operatorName, action: "Eligibility issue added", recordType: "exam", recordId: mutation.examId, previousValue: String(e.eligibilityStatus), newValue: "Missing information", clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: mutation.note });
      break;
    }
    case "updateRequirement": {
      const i = state.requirements.findIndex((r) => r.id === mutation.reqId);
      if (i >= 0) state.requirements[i] = { ...state.requirements[i], ...mutation.patch };
      break;
    }
    case "addRequirement":
      state.requirements.push({ id: genId("req"), examId: mutation.examId, requirementName: mutation.name, requirementType: mutation.type, required: true, status: "Unknown", source: "Manual entry", notes: "" });
      break;
    case "updateStudyPrep": {
      const i = state.studyPrep.findIndex((x) => x.examId === mutation.examId);
      if (i >= 0) state.studyPrep[i] = { ...state.studyPrep[i], ...mutation.patch };
      break;
    }
    case "markStudyMaterialsSent":
      { const i = state.studyPrep.findIndex((x) => x.examId === mutation.examId); if (i >= 0) state.studyPrep[i] = { ...state.studyPrep[i], studyMaterialsOrdered: true }; patchExam(mutation.examId, { studyStatus: "Materials sent", status: "Study materials sent" }); break; }
    case "confirmMaterialsReceived":
      { const i = state.studyPrep.findIndex((x) => x.examId === mutation.examId); if (i >= 0) state.studyPrep[i] = { ...state.studyPrep[i], studyMaterialsReceived: true }; patchExam(mutation.examId, { studyStatus: "Materials received" }); break; }
    case "confirmExamReady":
      { const i = state.studyPrep.findIndex((x) => x.examId === mutation.examId); if (i >= 0) state.studyPrep[i] = { ...state.studyPrep[i], candidateReadinessConfirmed: true, followUpNeeded: false }; patchExam(mutation.examId, { studyStatus: "Ready" }); break; }
    case "flagNotReady":
      { const i = state.studyPrep.findIndex((x) => x.examId === mutation.examId); if (i >= 0) state.studyPrep[i] = { ...state.studyPrep[i], candidateReadinessConfirmed: false, followUpNeeded: true }; patchExam(mutation.examId, { studyStatus: "Not ready", riskLevel: "High" }); break; }
    case "markScheduled":
      patchExam(mutation.examId, { status: "Scheduled", registrationStatus: "Scheduled", scheduledDate: mutation.data.date, scheduledTime: mutation.data.time, testingLocation: mutation.data.location, clientVisibleStatus: "Exam scheduled" });
      break;
    case "rescheduleExam":
      patchExam(mutation.examId, { registrationStatus: "Rescheduled", scheduledDate: mutation.data.date, scheduledTime: mutation.data.time });
      break;
    case "updateScheduling": patchExam(mutation.examId, mutation.patch); break;
    case "markPassed": {
      const e = exam(mutation.examId);
      if (!e) break;
      patchExam(mutation.examId, { resultStatus: "Passed", completedDate: e.completedDate ?? nowIso(), registrationStatus: "Completed" });
      if (e.transcriptRequired) {
        patchExam(mutation.examId, { status: "Transcript needs to be ordered", transcriptStatus: "Needs to be ordered", clientVisibleStatus: "Transcript pending" });
        const ti = state.transcripts.findIndex((t) => t.examId === mutation.examId);
        if (ti >= 0) state.transcripts[ti] = { ...state.transcripts[ti], transcriptStatus: "Needs to be ordered", transcriptRequired: true };
        state.tasks.unshift({ id: genId("task"), relatedType: "transcript", relatedId: mutation.examId, title: `Ask client/candidate to order transcript — ${e.examName}`, type: "Ask client/candidate to order transcript", owner: String(e.owner), dueDate: null, priority: "High", status: "Open", notes: "", createdAt: nowIso(), updatedAt: nowIso() });
      } else {
        patchExam(mutation.examId, { status: "Passed", applicationBlocked: false, clientVisibleStatus: "Exam passed" });
        state.applications.forEach((a, i) => {
          if (a.examId === mutation.examId && (a.blockedByExam || a.blockedByTranscript)) {
            state.applications[i] = { ...a, blockedByExam: false, blockedByTranscript: false, applicationStatus: "Ready to proceed" };
          }
        });
      }
      await syncExamStatusToZoho(mutation.examId, "Passed");
      break;
    }
    case "markFailed": {
      const e = exam(mutation.examId);
      if (!e) break;
      patchExam(mutation.examId, { resultStatus: "Failed", status: "Failed - retake needed", completedDate: e.completedDate ?? nowIso(), clientVisibleStatus: "Retake planning required", riskLevel: "High" });
      state.tasks.unshift({ id: genId("task"), relatedType: "exam", relatedId: mutation.examId, title: `Create retake plan — ${e.examName}`, type: "Create retake plan", owner: String(e.owner), dueDate: null, priority: "High", status: "Open", notes: "", createdAt: nowIso(), updatedAt: nowIso() });
      break;
    }
    case "markTranscriptOrdered": {
      const ti = state.transcripts.findIndex((t) => t.examId === mutation.examId);
      if (ti >= 0) state.transcripts[ti] = { ...state.transcripts[ti], transcriptStatus: "Ordered", orderedDate: nowIso(), sentToBoard: true };
      patchExam(mutation.examId, { transcriptStatus: "Ordered", status: "Transcript ordered", clientVisibleStatus: "Transcript ordered" });
      break;
    }
    case "markTranscriptReceived": {
      const ti = state.transcripts.findIndex((t) => t.examId === mutation.examId);
      if (ti >= 0) state.transcripts[ti] = { ...state.transcripts[ti], transcriptStatus: "Received by board", receivedByBoard: true, receivedDate: nowIso() };
      patchExam(mutation.examId, { transcriptStatus: "Received by board", status: "Transcript received", clientVisibleStatus: "Transcript received" });
      break;
    }
    case "updateTranscript": {
      const ti = state.transcripts.findIndex((t) => t.examId === mutation.examId);
      if (ti >= 0) state.transcripts[ti] = { ...state.transcripts[ti], ...mutation.patch };
      break;
    }
    case "unblockApplication": {
      const ai = state.applications.findIndex((a) => a.id === mutation.appId);
      if (ai >= 0) state.applications[ai] = { ...state.applications[ai], applicationStatus: "Ready to proceed", blockedByExam: false, blockedByTranscript: false };
      break;
    }
    case "updateApplication": {
      const ai = state.applications.findIndex((a) => a.id === mutation.appId);
      if (ai >= 0) state.applications[ai] = { ...state.applications[ai], ...mutation.patch };
      break;
    }
    case "addTask":
      state.tasks.unshift({ id: genId("task"), relatedType: String(mutation.task.relatedType), relatedId: String(mutation.task.relatedId), title: String(mutation.task.title), type: String(mutation.task.type), owner: String(mutation.task.owner ?? operatorName), dueDate: (mutation.task.dueDate as string) ?? null, priority: String(mutation.task.priority ?? "Medium"), status: String(mutation.task.status ?? "Open"), notes: String(mutation.task.notes ?? ""), createdAt: nowIso(), updatedAt: nowIso() });
      break;
    case "completeTask": {
      const ti = state.tasks.findIndex((t) => t.id === mutation.taskId);
      if (ti >= 0) state.tasks[ti] = { ...state.tasks[ti], status: "Done", updatedAt: nowIso() };
      break;
    }
    case "updateTask": {
      const ti = state.tasks.findIndex((t) => t.id === mutation.taskId);
      if (ti >= 0) state.tasks[ti] = { ...state.tasks[ti], ...mutation.patch, updatedAt: nowIso() };
      break;
    }
    case "addEscalation": {
      const esc = { id: genId("esc"), examId: String(mutation.escalation.examId), reason: String(mutation.escalation.reason), severity: String(mutation.escalation.severity ?? "High"), owner: String(mutation.escalation.owner ?? operatorName), dueDate: (mutation.escalation.dueDate as string) ?? null, decisionNeeded: String(mutation.escalation.decisionNeeded ?? ""), clientFacingRisk: String(mutation.escalation.clientFacingRisk ?? ""), applicationBlockingRisk: String(mutation.escalation.applicationBlockingRisk ?? ""), boardFacingRisk: String(mutation.escalation.boardFacingRisk ?? ""), status: String(mutation.escalation.status ?? "Open"), notes: String(mutation.escalation.notes ?? ""), createdAt: nowIso(), updatedAt: nowIso() };
      state.escalations.unshift(esc);
      patchExam(esc.examId, { status: "Escalated" });
      break;
    }
    case "updateEscalation": {
      const ei = state.escalations.findIndex((x) => x.id === mutation.escId);
      if (ei >= 0) state.escalations[ei] = { ...state.escalations[ei], ...mutation.patch, updatedAt: nowIso() };
      break;
    }
    case "addClientUpdate": {
      const e = exam(mutation.examId);
      if (!e) break;
      state.clientUpdates.unshift({ id: genId("cu"), examId: mutation.examId, clientId: String(e.clientId), internalStatus: String(e.status), proposedClientStatus: String(e.clientVisibleStatus), draftMessage: "", requestedBy: operatorName, reviewer: "", approvalStatus: "Draft", approvedAt: null, publishedPreviewAt: null, externalPublishId: null, notes: "" });
      break;
    }
    case "updateClientUpdate": {
      const ci = state.clientUpdates.findIndex((c) => c.id === mutation.id);
      if (ci >= 0) state.clientUpdates[ci] = { ...state.clientUpdates[ci], ...mutation.patch };
      break;
    }
    case "submitClientUpdate": {
      const ci = state.clientUpdates.findIndex((c) => c.id === mutation.id);
      if (ci >= 0) state.clientUpdates[ci] = { ...state.clientUpdates[ci], approvalStatus: "Submitted for review" };
      break;
    }
    case "approveClientUpdate": {
      const ci = state.clientUpdates.findIndex((c) => c.id === mutation.id);
      if (ci < 0) break;
      const cu = { ...state.clientUpdates[ci], approvalStatus: "Approved locally", approvedAt: nowIso(), reviewer: operatorName };
      const publishId = await publishClientUpdate(cu);
      state.clientUpdates[ci] = publishId ? { ...cu, approvalStatus: "Published", externalPublishId: publishId, publishedPreviewAt: nowIso() } : cu;
      break;
    }
    case "holdClientUpdate": {
      const ci = state.clientUpdates.findIndex((c) => c.id === mutation.id);
      if (ci >= 0) state.clientUpdates[ci] = { ...state.clientUpdates[ci], approvalStatus: "On hold" };
      break;
    }
    case "returnClientUpdate": {
      const ci = state.clientUpdates.findIndex((c) => c.id === mutation.id);
      if (ci >= 0) state.clientUpdates[ci] = { ...state.clientUpdates[ci], approvalStatus: "Returned for edit" };
      break;
    }
    default: break;
  }

  await persistDomainState(state);
  return { state, warning };
}

async function persistDomainState(state: DomainState): Promise<void> {
  for (const e of state.exams) await db.update(examsTable).set(examToRow(e)).where(eq(examsTable.id, String(e.id)));
  for (const r of state.requirements) await db.update(examRequirementsTable).set(requirementToRow(r)).where(eq(examRequirementsTable.id, String(r.id)));
  for (const s of state.studyPrep) await db.update(studyPrepRecordsTable).set(studyPrepToRow(s)).where(eq(studyPrepRecordsTable.examId, String(s.examId)));
  for (const t of state.transcripts) await db.update(transcriptRecordsTable).set(transcriptToRow(t)).where(eq(transcriptRecordsTable.examId, String(t.examId)));
  for (const a of state.applications) await db.update(relatedApplicationsTable).set(applicationToRow(a)).where(eq(relatedApplicationsTable.id, String(a.id)));
  for (const t of state.tasks) {
    await db.insert(tasksTable).values(taskToRow(t)).onConflictDoUpdate({ target: tasksTable.id, set: taskToRow(t) });
  }
  for (const e of state.escalations) {
    await db.insert(escalationsTable).values(escalationToRow(e)).onConflictDoUpdate({ target: escalationsTable.id, set: escalationToRow(e) });
  }
  for (const c of state.clientUpdates) {
    await db.insert(clientUpdateDraftsTable).values(clientUpdateToRow(c)).onConflictDoUpdate({ target: clientUpdateDraftsTable.id, set: clientUpdateToRow(c) });
  }
  const newAudits = state.auditEvents.filter((a) => String(a.id).startsWith("aud-"));
  if (newAudits.length) {
    await db.insert(auditEventsTable).values(newAudits.map((e) => ({
      id: String(e.id), timestamp: String(e.timestamp), user: String(e.user), action: String(e.action),
      recordType: String(e.recordType), recordId: String(e.recordId), previousValue: String(e.previousValue),
      newValue: String(e.newValue), clientVisible: Boolean(e.clientVisible), applicationImpacting: Boolean(e.applicationImpacting),
      aiAssisted: Boolean(e.aiAssisted), notes: String(e.notes),
    })));
  }
}

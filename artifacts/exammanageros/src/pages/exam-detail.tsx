import { useState, type ReactNode } from "react";
import { Link, useRoute } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup, examAutomationFlags } from "@/domain/derive";
import {
  EXAM_STATUSES, examStatusTone, eligibilityTone, studyTone, registrationTone,
  resultTone, transcriptTone, riskTone,
} from "@/domain/status";
import { Card, Badge, Field, fmtDate, PreviewBanner } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft, AlertTriangle, CheckCircle2, Plus, ShieldAlert, Bot,
} from "lucide-react";

const TABS = [
  "Overview", "Eligibility & Requirements", "Study / Prep", "Scheduling & Registration",
  "Results & Transcripts", "Related Applications", "Client Updates", "Tasks & Escalations", "Audit History",
];

function Btn({ onClick, children, variant = "default", disabled, testid }: {
  onClick?: () => void; children: ReactNode; variant?: "default" | "outline" | "danger" | "ghost"; disabled?: boolean; testid?: string;
}) {
  const styles = {
    default: "bg-sky-600 text-white hover:bg-sky-700",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "text-slate-600 hover:bg-slate-100",
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} data-testid={testid}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles}`}>
      {children}
    </button>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
      <span className="text-slate-700">{label}</span>
      <span className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${value ? "bg-teal-500 justify-end" : "bg-slate-200 justify-start"}`}>
        <span className="h-4 w-4 rounded-full bg-white shadow" />
      </span>
    </button>
  );
}

export default function ExamDetail() {
  const [, params] = useRoute("/exam/:id");
  const s = useStore();
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const exam = params ? lookup.exam(s, params.id) : undefined;

  if (!exam) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Exam record not found.</p>
        <Link href="/queue" className="mt-3 inline-block text-sm text-sky-600">← Back to queue</Link>
      </div>
    );
  }

  const cli = lookup.client(s, exam.clientId);
  const cand = lookup.candidate(s, exam.candidateId);
  const tr = lookup.transcript(s, exam.id);
  const sp = lookup.study(s, exam.id);
  const reqs = lookup.requirements(s, exam.id);
  const apps = lookup.applications(s, exam.id);
  const tasks = s.tasks.filter((t) => t.relatedId === exam.id || apps.some((a) => a.id === t.relatedId));
  const escs = lookup.escalations(s, exam.id);
  const updates = lookup.clientUpdates(s, exam.id);
  const audit = s.auditEvents.filter((a) => a.recordId === exam.id || apps.some((ap) => ap.id === a.recordId) || a.recordId === exam.id);
  const flags = examAutomationFlags(exam, s);

  const setStatus = (status: string) => {
    const res = s.setExamStatus(exam.id, status as typeof exam.status);
    if (!res.ok && res.warning) toast({ title: "Eligibility required", description: res.warning, variant: "destructive" });
    else toast({ title: "Status updated", description: `Now: ${status}` });
  };

  return (
    <div>
      <Link href="/queue" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft className="h-4 w-4" /> Back to Exam Queue
      </Link>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{exam.examName}</h1>
          <p className="text-sm text-slate-500">{cli?.name} · {cand?.fullName} · {exam.state} · {exam.boardAgency}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={examStatusTone(exam.status)}>{exam.status}</Badge>
          <Badge className={riskTone(exam.riskLevel)}>{exam.riskLevel} risk</Badge>
        </div>
      </div>

      {flags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {flags.map((f, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
              f.tone === "coral" ? "border-rose-200 bg-rose-50 text-rose-700" :
              f.tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-700" :
              f.tone === "purple" ? "border-violet-200 bg-violet-50 text-violet-700" :
              "border-sky-200 bg-sky-50 text-sky-700"}`}>
              <Bot className="h-3.5 w-3.5" /> {f.label}
            </span>
          ))}
        </div>
      )}

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} data-testid={`tab-${i}`}
            className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === i ? "border-sky-500 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Exam status</h3>
              <select value={exam.status} onChange={(e) => setStatus(e.target.value)} data-testid="select-status"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none focus:border-sky-300">
                {EXAM_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Candidate / qualifier">{cand?.fullName}</Field>
              <Field label="Client / account">{cli?.name}</Field>
              <Field label="Related application">{apps[0]?.applicationNumber ?? "—"}</Field>
              <Field label="Exam type">{exam.examType}</Field>
              <Field label="State / jurisdiction">{exam.state} · {exam.jurisdiction}</Field>
              <Field label="Board / agency">{exam.boardAgency}</Field>
              <Field label="Exam provider">{exam.provider}</Field>
              <Field label="Owner">{exam.owner}</Field>
              <Field label="Reviewer">{exam.reviewer}</Field>
              <Field label="Next action">{exam.nextAction}</Field>
              <Field label="Next due date">{fmtDate(exam.dueDate)}</Field>
              <Field label="Client-visible status">{exam.clientVisibleStatus}</Field>
              <Field label="Current blocker">{exam.blocker || "None"}</Field>
              <Field label="Application dependency">{exam.applicationBlocked ? "Blocking application(s)" : "Not blocking"}</Field>
              <Field label="Risk level">{exam.riskLevel}</Field>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Internal notes</h3>
            <p className="whitespace-pre-wrap text-sm text-slate-600">{exam.internalNotes || "No notes yet."}</p>
            <NoteAdder examId={exam.id} />
          </Card>
        </div>
      )}

      {tab === 1 && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Requirements</h3>
              <Badge className={eligibilityTone(exam.eligibilityStatus)}>{exam.eligibilityStatus}</Badge>
            </div>
            <div className="space-y-2">
              {reqs.length ? reqs.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{r.requirementName}</div>
                    <div className="text-xs text-slate-400">{r.requirementType}{r.notes ? ` · ${r.notes}` : ""}</div>
                  </div>
                  <select value={r.status} onChange={(e) => s.updateRequirement(r.id, { status: e.target.value as typeof r.status })}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                    <option>Met</option><option>Not met</option><option>Unknown</option>
                  </select>
                </div>
              )) : <p className="text-sm text-slate-400">No requirements recorded.</p>}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Actions</h3>
            <div className="flex flex-col gap-2">
              <Btn testid="btn-confirm-eligibility" onClick={() => { s.confirmEligibility(exam.id); toast({ title: "Eligibility confirmed" }); }}><CheckCircle2 className="h-3.5 w-3.5" /> Mark eligibility confirmed</Btn>
              <Btn variant="outline" onClick={() => { s.addEligibilityIssue(exam.id, "Eligibility issue flagged for review"); toast({ title: "Issue added" }); }}><AlertTriangle className="h-3.5 w-3.5" /> Add eligibility issue</Btn>
              <Btn variant="outline" onClick={() => { s.addTask({ title: "Collect missing eligibility item", type: "Confirm eligibility", relatedType: "exam", relatedId: exam.id, owner: exam.owner, priority: "High" }); toast({ title: "Task created" }); }}><Plus className="h-3.5 w-3.5" /> Create missing item task</Btn>
              <Btn variant="outline" onClick={() => { s.addClientUpdate(exam.id); toast({ title: "Draft created", description: "Request for missing candidate info drafted." }); }}>Request missing candidate info draft</Btn>
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <span className="font-medium">Gating:</span> "Ready to schedule" is blocked until eligibility = Eligible.
            </div>
          </Card>
        </div>
      )}

      {tab === 2 && sp && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Study / prep tracking</h3>
              <Badge className={studyTone(exam.studyStatus)}>{exam.studyStatus}</Badge>
            </div>
            <div className="space-y-2">
              <Toggle label="Study materials ordered" value={sp.studyMaterialsOrdered} onChange={(v) => s.updateStudyPrep(exam.id, { studyMaterialsOrdered: v })} />
              <Toggle label="Study materials received by candidate" value={sp.studyMaterialsReceived} onChange={(v) => s.updateStudyPrep(exam.id, { studyMaterialsReceived: v })} />
              <Toggle label="Practice exam completed" value={sp.practiceExamCompleted} onChange={(v) => s.updateStudyPrep(exam.id, { practiceExamCompleted: v })} />
              <Toggle label="Candidate readiness confirmed" value={sp.candidateReadinessConfirmed} onChange={(v) => s.updateStudyPrep(exam.id, { candidateReadinessConfirmed: v })} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Study provider">{sp.studyProvider}</Field>
              <Field label="Prep course status">{sp.prepCourseStatus}</Field>
              <Field label="Follow-up needed">{sp.followUpNeeded ? "Yes" : "No"}</Field>
              <Field label="Follow-up due">{fmtDate(sp.followUpDueDate)}</Field>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Actions</h3>
            <div className="flex flex-col gap-2">
              <Btn onClick={() => { s.markStudyMaterialsSent(exam.id); toast({ title: "Materials sent" }); }}>Mark study materials sent</Btn>
              <Btn variant="outline" onClick={() => { s.confirmMaterialsReceived(exam.id); toast({ title: "Materials received" }); }}>Confirm materials received</Btn>
              <Btn variant="outline" onClick={() => { s.confirmExamReady(exam.id); toast({ title: "Marked exam-ready" }); }}>Confirm exam-ready</Btn>
              <Btn variant="outline" onClick={() => { s.addTask({ title: "Study follow-up", type: "Confirm candidate readiness", relatedType: "exam", relatedId: exam.id, owner: exam.owner }); toast({ title: "Follow-up created" }); }}><Plus className="h-3.5 w-3.5" /> Create study follow-up</Btn>
              <Btn variant="danger" onClick={() => { s.flagNotReady(exam.id); toast({ title: "Flagged not ready" }); }}>Flag candidate not ready</Btn>
              <Btn variant="outline" onClick={() => { s.addClientUpdate(exam.id); toast({ title: "Reminder drafted" }); }}>Draft candidate reminder</Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === 3 && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Scheduling & registration</h3>
              <Badge className={registrationTone(exam.registrationStatus)}>{exam.registrationStatus}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Exam provider">{exam.provider}</Field>
              <Field label="Scheduled date">{fmtDate(exam.scheduledDate)}</Field>
              <Field label="Scheduled time">{exam.scheduledTime}</Field>
              <Field label="Testing location">{exam.testingLocation}</Field>
              <Field label="Confirmation number">{tr?.confirmationNumber || "—"}</Field>
              <Field label="Owner">{exam.owner}</Field>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Actions</h3>
            <ScheduleForm examId={exam.id} />
          </Card>
        </div>
      )}

      {tab === 4 && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Results & transcripts</h3>
              <div className="flex gap-2">
                <Badge className={resultTone(exam.resultStatus)}>{exam.resultStatus}</Badge>
                <Badge className={transcriptTone(exam.transcriptStatus)}>{exam.transcriptStatus}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Exam completed date">{fmtDate(exam.completedDate)}</Field>
              <Field label="Transcript required">{exam.transcriptRequired ? "Yes" : "No"}</Field>
              <Field label="Transcript ordered date">{fmtDate(tr?.orderedDate ?? null)}</Field>
              <Field label="Transcript provider">{tr?.provider}</Field>
              <Field label="Delivery method">{tr?.deliveryMethod}</Field>
              <Field label="Received by board">{tr?.receivedByBoard ? "Yes" : "No"}</Field>
              <Field label="Received date">{fmtDate(tr?.receivedDate ?? null)}</Field>
              <Field label="Confirmation">{tr?.confirmationNumber || "—"}</Field>
              <Field label="Follow-up due">{fmtDate(tr?.followUpDueDate ?? null)}</Field>
            </div>
            {exam.resultStatus === "Passed" && exam.transcriptRequired && exam.transcriptStatus !== "Received by board" && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Exam passed, but related applications remain blocked until the official transcript is confirmed received by the board.
              </div>
            )}
            {exam.transcriptStatus === "Received by board" && exam.applicationBlocked && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Transcript received. You can now review related applications for unblocking (see Related Applications tab).
              </div>
            )}
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Actions</h3>
            <div className="flex flex-col gap-2">
              <Btn testid="btn-mark-passed" onClick={() => { s.markPassed(exam.id); toast({ title: "Marked passed", description: exam.transcriptRequired ? "Transcript task auto-created." : undefined }); }}><CheckCircle2 className="h-3.5 w-3.5" /> Mark passed</Btn>
              <Btn variant="danger" onClick={() => { s.markFailed(exam.id); toast({ title: "Marked failed", description: "Retake task created." }); }}>Mark failed</Btn>
              <Btn variant="outline" onClick={() => { s.addTask({ title: "Request score report", type: "Request score report", relatedType: "exam", relatedId: exam.id, owner: exam.owner }); toast({ title: "Score report requested" }); }}>Request score report</Btn>
              <Btn variant="outline" onClick={() => { s.markTranscriptOrdered(exam.id); toast({ title: "Transcript ordered" }); }}>Mark transcript ordered</Btn>
              <Btn variant="outline" onClick={() => { s.markTranscriptReceived(exam.id); toast({ title: "Transcript received" }); }}>Mark transcript received</Btn>
              <Btn variant="outline" onClick={() => { s.addTask({ title: "Transcript follow-up", type: "Confirm transcript received", relatedType: "transcript", relatedId: exam.id, owner: exam.owner }); toast({ title: "Follow-up created" }); }}><Plus className="h-3.5 w-3.5" /> Create transcript follow-up</Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === 5 && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Related applications</h3>
            <span className="text-xs text-slate-400">Human review required to mark officially unblocked</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {["Application", "State", "Classification", "Status", "Dependency", "After pass", "After transcript", "Owner", ""].map((c) => <th key={c} className="px-3 py-2.5 whitespace-nowrap">{c}</th>)}
              </tr></thead>
              <tbody>
                {apps.length ? apps.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50">
                    <td className="px-3 py-2.5"><div className="font-medium text-slate-700">{a.applicationName}</div><div className="text-xs text-slate-400">{a.applicationNumber}</div></td>
                    <td className="px-3 py-2.5 text-slate-600">{a.state}</td>
                    <td className="px-3 py-2.5 text-slate-600">{a.licenseClassification}</td>
                    <td className="px-3 py-2.5"><Badge className={a.blockedByExam || a.blockedByTranscript ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200"}>{a.applicationStatus}</Badge></td>
                    <td className="px-3 py-2.5 text-slate-600">{a.dependencyType}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 max-w-[160px]">{a.whatCanProceedAfterPass}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 max-w-[160px]">{a.whatCanProceedAfterTranscript}</td>
                    <td className="px-3 py-2.5 text-slate-600">{a.owner}</td>
                    <td className="px-3 py-2.5">
                      <Btn variant="outline" disabled={!a.blockedByExam && !a.blockedByTranscript} onClick={() => { s.unblockApplication(a.id); toast({ title: "Application unblocked" }); }}>Mark unblocked</Btn>
                    </td>
                  </tr>
                )) : <tr><td colSpan={9} className="px-3 py-8 text-center text-slate-400">No related applications linked.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 6 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <PreviewBanner className="flex-1" />
          </div>
          <div className="mb-3"><Btn testid="btn-draft-update" onClick={() => { s.addClientUpdate(exam.id); toast({ title: "Draft created" }); }}><Plus className="h-3.5 w-3.5" /> Draft client update</Btn></div>
          <div className="space-y-3">
            {updates.length ? updates.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge className={
                    c.approvalStatus === "Approved locally" ? "bg-teal-50 text-teal-700 border-teal-200" :
                    c.approvalStatus === "Submitted for review" ? "bg-violet-50 text-violet-700 border-violet-200" :
                    c.approvalStatus === "On hold" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"}>{c.approvalStatus}</Badge>
                  <span className="text-xs text-slate-400">Proposed client status: {c.proposedClientStatus}</span>
                </div>
                <textarea defaultValue={c.draftMessage} onBlur={(e) => s.updateClientUpdate(c.id, { draftMessage: e.target.value })}
                  placeholder="Draft client-facing message…" className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-300" rows={2} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Btn variant="outline" onClick={() => { s.submitClientUpdate(c.id); toast({ title: "Submitted for review" }); }}>Submit for review</Btn>
                  <Btn onClick={() => { s.approveClientUpdate(c.id); toast({ title: "Approved locally", description: "Ready for ComplianceConnect preview." }); }}>Approve for preview</Btn>
                  <Btn variant="ghost" onClick={() => { s.holdClientUpdate(c.id); toast({ title: "On hold" }); }}>Hold</Btn>
                  <Btn variant="ghost" onClick={() => { s.returnClientUpdate(c.id); toast({ title: "Returned for edit" }); }}>Return for edit</Btn>
                </div>
                {c.approvalStatus === "Approved locally" && <p className="mt-2 text-xs text-teal-700">Approved locally for ComplianceConnect preview. External publishing is disabled in this build.</p>}
              </Card>
            )) : <p className="text-sm text-slate-400">No client update drafts yet.</p>}
          </div>
        </div>
      )}

      {tab === 7 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Tasks</h3>
              <Btn variant="outline" onClick={() => { s.addTask({ title: "Follow up on exam", type: "Follow up before exam", relatedType: "exam", relatedId: exam.id, owner: exam.owner }); toast({ title: "Task created" }); }}><Plus className="h-3.5 w-3.5" /> Add task</Btn>
            </div>
            <div className="space-y-2">
              {tasks.length ? tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                  <div><div className={`text-sm ${t.status === "Done" ? "text-slate-400 line-through" : "text-slate-700"}`}>{t.title}</div><div className="text-xs text-slate-400">{t.owner} · due {fmtDate(t.dueDate)} · {t.priority}</div></div>
                  {t.status !== "Done" ? <Btn variant="outline" onClick={() => { s.completeTask(t.id); toast({ title: "Task completed" }); }}>Complete</Btn> : <Badge className="bg-teal-50 text-teal-700 border-teal-200">Done</Badge>}
                </div>
              )) : <p className="text-sm text-slate-400">No tasks.</p>}
            </div>
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Escalations</h3>
              <Btn variant="danger" onClick={() => { s.addEscalation({ examId: exam.id, reason: "Escalated for review", severity: "High", owner: "Rose", decisionNeeded: "Review needed", applicationBlockingRisk: exam.applicationBlocked ? "Applications blocked" : "" }); toast({ title: "Escalation created" }); }}><ShieldAlert className="h-3.5 w-3.5" /> Escalate</Btn>
            </div>
            <div className="space-y-2">
              {escs.length ? escs.map((e) => (
                <div key={e.id} className="rounded-lg border border-slate-200 px-3 py-2">
                  <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-700">{e.reason}</span><Badge className={e.severity === "Critical" || e.severity === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{e.severity}</Badge></div>
                  <div className="mt-1 text-xs text-slate-400">Decision: {e.decisionNeeded || "—"} · Owner {e.owner} · {e.status}</div>
                </div>
              )) : <p className="text-sm text-slate-400">No escalations.</p>}
            </div>
          </Card>
        </div>
      )}

      {tab === 8 && (
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Audit history</h3>
          <div className="space-y-3">
            {audit.length ? audit.map((a) => (
              <div key={a.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.applicationImpacting ? "bg-rose-400" : a.clientVisible ? "bg-sky-400" : "bg-slate-300"}`} />
                <div className="flex-1">
                  <div className="text-sm text-slate-700"><span className="font-medium">{a.action}</span>{a.previousValue !== "-" && <span className="text-slate-500"> · {a.previousValue} → {a.newValue}</span>}</div>
                  <div className="text-xs text-slate-400">{a.user} · {new Date(a.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}{a.aiAssisted ? " · automation" : ""}{a.clientVisible ? " · client-visible" : ""}</div>
                  {a.notes && <div className="mt-0.5 text-xs text-slate-500">{a.notes}</div>}
                </div>
              </div>
            )) : <p className="text-sm text-slate-400">No audit events yet.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}

function NoteAdder({ examId }: { examId: string }) {
  const s = useStore();
  const { toast } = useToast();
  const [v, setV] = useState("");
  return (
    <div className="mt-4">
      <textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="Add an internal note…" rows={2}
        className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-300" />
      <Btn testid="btn-add-note" onClick={() => { if (v.trim()) { s.addNote(examId, v.trim()); setV(""); toast({ title: "Note added" }); } }}><Plus className="h-3.5 w-3.5" /> Add note</Btn>
    </div>
  );
}

function ScheduleForm({ examId }: { examId: string }) {
  const s = useStore();
  const { toast } = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loc, setLoc] = useState("");
  const [conf, setConf] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs" />
      <input placeholder="Time (e.g. 9:00 AM)" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs" />
      <input placeholder="Location / online" value={loc} onChange={(e) => setLoc(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs" />
      <input placeholder="Confirmation number" value={conf} onChange={(e) => setConf(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs" />
      <Btn testid="btn-mark-scheduled" onClick={() => { if (date) { s.markScheduled(examId, { date: new Date(date).toISOString(), time, location: loc, confirmation: conf }); toast({ title: "Exam scheduled" }); } else toast({ title: "Pick a date first", variant: "destructive" }); }}>Mark scheduled</Btn>
      <Btn variant="outline" onClick={() => { if (date) { s.rescheduleExam(examId, { date: new Date(date).toISOString(), time }); toast({ title: "Rescheduled" }); } }}>Reschedule</Btn>
      <Btn variant="outline" onClick={() => { s.addTask({ title: "Exam reminder", type: "Follow up before exam", relatedType: "exam", relatedId: examId }); toast({ title: "Reminder created" }); }}><Plus className="h-3.5 w-3.5" /> Create reminder</Btn>
    </div>
  );
}

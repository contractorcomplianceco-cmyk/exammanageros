import { useState } from "react";
import { Link } from "wouter";
import { useStore, type Store } from "@/store/useStore";
import { lookup, isOverdue } from "@/domain/derive";
import { PageHeader, Card, Badge, fmtDate } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

function examLabel(s: Store, examId: string): { label: string; href: string } | null {
  const exam = lookup.exam(s, examId);
  if (exam) return { label: `${lookup.client(s, exam.clientId)?.name} · ${exam.examName}`, href: `/exam/${exam.id}` };
  const app = s.applications.find((a) => a.id === examId);
  if (app) return { label: app.applicationName, href: `/exam/${app.examId}` };
  return null;
}

export default function Tasks() {
  const s = useStore();
  const { toast } = useToast();
  const [showDone, setShowDone] = useState(false);
  const tasks = s.tasks
    .filter((t) => (showDone ? true : t.status !== "Done"))
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));

  return (
    <div>
      <PageHeader
        title="Tasks & Escalations"
        subtitle="Operational to-dos and escalated exam issues across the team. Completing a task keeps the audit trail intact."
        actions={
          <button onClick={() => setShowDone((v) => !v)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            {showDone ? "Hide completed" : "Show completed"}
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Tasks</h3>
          <div className="space-y-2">
            {tasks.length ? tasks.map((t) => {
              const ref = examLabel(s, t.relatedId);
              const overdue = t.status !== "Done" && isOverdue(t.dueDate);
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className={`text-sm ${t.status === "Done" ? "text-slate-400 line-through" : "text-slate-700"}`}>{t.title}</div>
                    <div className="text-xs text-slate-400">
                      {ref ? <Link href={ref.href} className="hover:text-sky-600">{ref.label}</Link> : t.relatedType} · {t.owner}
                      {" · "}<span className={overdue ? "font-medium text-rose-600" : ""}>due {fmtDate(t.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={t.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : t.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}>{t.priority}</Badge>
                    {t.status !== "Done" ? (
                      <button onClick={() => { s.completeTask(t.id); toast({ title: "Task completed" }); }} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-50">Complete</button>
                    ) : <Badge className="bg-teal-50 text-teal-700 border-teal-200">Done</Badge>}
                  </div>
                </div>
              );
            }) : <p className="text-sm text-slate-400">No open tasks.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Escalations</h3>
          <div className="space-y-2">
            {s.escalations.length ? s.escalations.map((e) => {
              const exam = lookup.exam(s, e.examId);
              return (
                <div key={e.id} className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/exam/${e.examId}`} className="text-sm font-medium text-slate-700 hover:text-sky-600">{lookup.client(s, exam?.clientId ?? "")?.name ?? "Exam"}</Link>
                    <Badge className={e.severity === "Critical" || e.severity === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{e.severity}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{e.reason}</div>
                  <div className="mt-1 text-xs text-slate-400">Decision: {e.decisionNeeded || "—"} · {e.owner} · due {fmtDate(e.dueDate)}</div>
                  <div className="mt-2 flex gap-1.5">
                    {e.status !== "Resolved" && <button onClick={() => { s.updateEscalation(e.id, { status: "Resolved" }); toast({ title: "Escalation resolved" }); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Resolve</button>}
                    <Badge className="bg-slate-100 text-slate-600 border-slate-200">{e.status}</Badge>
                  </div>
                </div>
              );
            }) : <p className="text-sm text-slate-400">No escalations.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

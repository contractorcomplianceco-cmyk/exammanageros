import { useState } from "react";
import { Link } from "wouter";
import { useStore, type Store } from "@/store/useStore";
import { lookup, isOverdue } from "@/domain/derive";
import { PageHeader, Card, Badge, fmtDate, EmptyState } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

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
          <button onClick={() => setShowDone((v) => !v)} className="rounded-xl border border-white bg-white/60 px-4 py-2 text-[13px] font-bold text-purple-900 hover:bg-white hover:border-purple-200 shadow-sm transition-all">
            {showDone ? "Hide completed" : "Show completed"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-8 lg:col-span-2">
          <h3 className="mb-6 text-lg font-bold text-purple-950 pb-4 border-b border-purple-100/50">Tasks</h3>
          <div className="space-y-3">
            {tasks.length ? tasks.map((t) => {
              const ref = examLabel(s, t.relatedId);
              const overdue = t.status !== "Done" && isOverdue(t.dueDate);
              return (
                <div key={t.id} className="flex items-center justify-between gap-4 rounded-xl border border-white bg-white/60 px-5 py-4 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="min-w-0">
                    <div className={`text-[15px] font-bold ${t.status === "Done" ? "text-slate-400 line-through decoration-slate-300" : "text-purple-950 group-hover:text-purple-700 transition-colors"}`}>{t.title}</div>
                    <div className="text-[13px] font-medium text-slate-500 mt-0.5">
                      {ref ? <Link href={ref.href} className="text-purple-900/60 hover:text-purple-700 font-bold">{ref.label}</Link> : <span className="font-bold text-purple-900/60">{t.relatedType}</span>} <span className="text-slate-300 mx-1">•</span> {t.owner}
                      <span className="text-slate-300 mx-1">•</span><span className={overdue ? "font-bold text-rose-600" : ""}>Due {fmtDate(t.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={t.priority === "High" ? "bg-rose-50/80 text-rose-700 border-rose-200" : t.priority === "Medium" ? "bg-amber-50/80 text-amber-700 border-amber-200" : "bg-slate-50/80 text-slate-600 border-slate-200"}>{t.priority}</Badge>
                    {t.status !== "Done" ? (
                      <button onClick={() => { s.completeTask(t.id); toast({ title: "Task completed" }); }} className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 text-[13px] font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all"><CheckCircle2 className="h-4 w-4" /> Complete</button>
                    ) : <Badge className="bg-teal-50/80 text-teal-700 border-teal-200">Done</Badge>}
                  </div>
                </div>
              );
            }) : <EmptyState message="No open tasks." />}
          </div>
        </Card>

        <Card className="p-8 border-rose-100/50 bg-gradient-to-b from-white to-rose-50/30">
          <h3 className="mb-6 text-lg font-bold text-rose-950 pb-4 border-b border-rose-100/50">Escalations</h3>
          <div className="space-y-4">
            {s.escalations.length ? s.escalations.map((e) => {
              const exam = lookup.exam(s, e.examId);
              return (
                <div key={e.id} className="rounded-xl border border-rose-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Link href={`/exam/${e.examId}`} className="text-[15px] font-bold text-slate-800 hover:text-purple-700 transition-colors">{lookup.client(s, exam?.clientId ?? "")?.name ?? "Exam"}</Link>
                    <Badge className={e.severity === "Critical" || e.severity === "High" ? "bg-rose-50/80 text-rose-700 border-rose-200" : "bg-amber-50/80 text-amber-700 border-amber-200"}>{e.severity}</Badge>
                  </div>
                  <div className="text-[14px] font-medium text-slate-700 mb-2">{e.reason}</div>
                  <div className="text-[12px] font-medium text-slate-500">Decision: <span className="font-semibold text-slate-600">{e.decisionNeeded || "—"}</span></div>
                  <div className="text-[12px] font-medium text-slate-500 mt-0.5">{e.owner} <span className="text-slate-300 mx-1">•</span> Due {fmtDate(e.dueDate)}</div>
                  <div className="mt-4 flex items-center gap-2">
                    {e.status !== "Resolved" && <button onClick={() => { s.updateEscalation(e.id, { status: "Resolved" }); toast({ title: "Escalation resolved" }); }} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</button>}
                    <Badge className="bg-slate-50/80 text-slate-600 border-slate-200">{e.status}</Badge>
                  </div>
                </div>
              );
            }) : <EmptyState message="No escalations." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

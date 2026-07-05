import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup, isOverdue } from "@/domain/derive";
import { transcriptTone } from "@/domain/status";
import { PageHeader, Card, Badge, PreviewBanner, fmtDate } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

export default function Transcripts() {
  const s = useStore();
  const { toast } = useToast();
  const rows = s.transcripts.filter((t) => t.transcriptRequired);

  return (
    <div>
      <PageHeader
        title="Transcripts & Score Reports"
        subtitle="Official transcript pipeline. Applications stay blocked until transcripts are confirmed received by the board — even after a pass."
      />
      <PreviewBanner className="mb-6" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {["Client", "Candidate", "Exam", "Provider", "Status", "Ordered", "Received", "Follow-up due", "Confirmation", "Actions"].map((c) => <th key={c} className="px-3 py-2.5 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((t) => {
                const exam = lookup.exam(s, t.examId);
                if (!exam) return null;
                const cli = lookup.client(s, exam.clientId);
                const cand = lookup.candidate(s, exam.candidateId);
                const overdue = isOverdue(t.followUpDueDate) && t.transcriptStatus !== "Received by board";
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-sky-50/40">
                    <td className="px-3 py-2.5"><Link href={`/exam/${exam.id}`} className="font-medium text-slate-800 hover:text-sky-700">{cli?.name}</Link></td>
                    <td className="px-3 py-2.5 text-slate-600">{cand?.fullName}</td>
                    <td className="px-3 py-2.5 max-w-[220px] truncate text-slate-600" title={exam.examName}>{exam.examName}</td>
                    <td className="px-3 py-2.5 text-slate-600">{t.provider}</td>
                    <td className="px-3 py-2.5"><Badge className={transcriptTone(t.transcriptStatus)}>{t.transcriptStatus}</Badge></td>
                    <td className="px-3 py-2.5 text-slate-600">{fmtDate(t.orderedDate)}</td>
                    <td className="px-3 py-2.5 text-slate-600">{fmtDate(t.receivedDate)}</td>
                    <td className={`px-3 py-2.5 ${overdue ? "font-medium text-rose-600" : "text-slate-600"}`}>{fmtDate(t.followUpDueDate)}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-400">{t.confirmationNumber || "—"}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5">
                        {t.transcriptStatus === "Needs to be ordered" && <button onClick={() => { s.markTranscriptOrdered(exam.id); toast({ title: "Transcript ordered" }); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Mark ordered</button>}
                        {t.transcriptStatus !== "Received by board" && <button onClick={() => { s.markTranscriptReceived(exam.id); toast({ title: "Transcript received" }); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Mark received</button>}
                        <button onClick={() => { s.addTask({ title: `Transcript follow-up — ${exam.examName}`, type: "Confirm transcript received", relatedType: "transcript", relatedId: exam.id, owner: exam.owner }); toast({ title: "Follow-up created" }); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Follow up</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div className="py-10 text-center text-sm text-slate-400">No transcripts required.</div>}
        </div>
      </Card>
    </div>
  );
}

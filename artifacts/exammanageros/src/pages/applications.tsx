import { useState } from "react";
import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner, EmptyState } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export default function Applications() {
  const s = useStore();
  const { toast } = useToast();
  const [onlyBlocked, setOnlyBlocked] = useState(true);
  const apps = s.applications.filter((a) => (onlyBlocked ? a.blockedByExam || a.blockedByTranscript : true));

  return (
    <div>
      <PageHeader
        title="Applications Blocked by Exam"
        subtitle="License, reciprocity, and qualifier applications whose progress depends on an exam result or official transcript."
        actions={
          <button onClick={() => setOnlyBlocked((v) => !v)} className="rounded-xl border border-white bg-white/60 px-4 py-2 text-[13px] font-bold text-purple-900 hover:bg-white hover:border-purple-200 shadow-sm transition-all">
            {onlyBlocked ? "Show all applications" : "Show blocked only"}
          </button>
        }
      />
      <PreviewBanner className="mb-8" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead><tr className="border-b border-purple-100/50 bg-white/40 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {["Application", "Client", "State", "Classification", "Status", "Blocked by", "What proceeds after", "Owner", "Action"].map((c) => <th key={c} className="px-5 py-4 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {apps.map((a) => {
                const cli = lookup.client(s, a.clientId);
                const blockedBy = a.blockedByTranscript ? "Transcript" : a.blockedByExam ? "Exam" : "—";
                return (
                  <tr key={a.id} className="border-b border-white/50 bg-white/20 hover:bg-purple-50/40 transition-colors group">
                    <td className="px-5 py-4"><Link href={`/exam/${a.examId}`} className="font-bold text-purple-900 group-hover:text-purple-600 transition-colors">{a.applicationName}</Link><div className="text-[13px] font-medium text-slate-500 mt-0.5">{a.applicationNumber}</div></td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{cli?.name}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{a.state}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{a.licenseClassification}</td>
                    <td className="px-5 py-4"><Badge className={a.blockedByExam || a.blockedByTranscript ? "bg-rose-50/80 text-rose-700 border-rose-200" : "bg-teal-50/80 text-teal-700 border-teal-200"}>{a.applicationStatus}</Badge></td>
                    <td className="px-5 py-4"><Badge className={blockedBy === "Transcript" ? "bg-amber-50/80 text-amber-700 border-amber-200" : blockedBy === "Exam" ? "bg-rose-50/80 text-rose-700 border-rose-200" : "bg-slate-50/80 text-slate-500 border-slate-200"}>{blockedBy}</Badge></td>
                    <td className="px-5 py-4 max-w-[220px] text-[13px] text-slate-500 font-medium leading-relaxed">{a.blockedByTranscript ? a.whatCanProceedAfterTranscript : a.whatCanProceedAfterPass}</td>
                    <td className="px-5 py-4 text-slate-600 font-bold">{a.owner}</td>
                    <td className="px-5 py-4">
                      <button disabled={!a.blockedByExam && !a.blockedByTranscript} onClick={() => { s.unblockApplication(a.id); toast({ title: "Application unblocked" }); }}
                        className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 text-[13px] font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Unblock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {apps.length === 0 && <EmptyState message="No applications to show." />}
        </div>
      </Card>
    </div>
  );
}

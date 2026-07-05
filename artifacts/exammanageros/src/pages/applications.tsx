import { useState } from "react";
import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

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
          <button onClick={() => setOnlyBlocked((v) => !v)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            {onlyBlocked ? "Show all applications" : "Show blocked only"}
          </button>
        }
      />
      <PreviewBanner className="mb-6" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {["Application", "Client", "State", "Classification", "Status", "Blocked by", "What proceeds after", "Owner", ""].map((c) => <th key={c} className="px-3 py-2.5 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {apps.map((a) => {
                const cli = lookup.client(s, a.clientId);
                const blockedBy = a.blockedByTranscript ? "Transcript" : a.blockedByExam ? "Exam" : "—";
                return (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-sky-50/40">
                    <td className="px-3 py-2.5"><Link href={`/exam/${a.examId}`} className="font-medium text-slate-800 hover:text-sky-700">{a.applicationName}</Link><div className="text-xs text-slate-400">{a.applicationNumber}</div></td>
                    <td className="px-3 py-2.5 text-slate-600">{cli?.name}</td>
                    <td className="px-3 py-2.5 text-slate-600">{a.state}</td>
                    <td className="px-3 py-2.5 text-slate-600">{a.licenseClassification}</td>
                    <td className="px-3 py-2.5"><Badge className={a.blockedByExam || a.blockedByTranscript ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200"}>{a.applicationStatus}</Badge></td>
                    <td className="px-3 py-2.5"><Badge className={blockedBy === "Transcript" ? "bg-amber-50 text-amber-700 border-amber-200" : blockedBy === "Exam" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-500 border-slate-200"}>{blockedBy}</Badge></td>
                    <td className="px-3 py-2.5 max-w-[220px] text-xs text-slate-500">{a.blockedByTranscript ? a.whatCanProceedAfterTranscript : a.whatCanProceedAfterPass}</td>
                    <td className="px-3 py-2.5 text-slate-600">{a.owner}</td>
                    <td className="px-3 py-2.5">
                      <button disabled={!a.blockedByExam && !a.blockedByTranscript} onClick={() => { s.unblockApplication(a.id); toast({ title: "Application unblocked" }); }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">Mark unblocked</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {apps.length === 0 && <div className="py-10 text-center text-sm text-slate-400">No applications to show.</div>}
        </div>
      </Card>
    </div>
  );
}

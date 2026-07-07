import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner, EmptyState } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

const STATUS_TONE: Record<string, string> = {
  "Draft": "bg-white text-slate-600 border-slate-200",
  "Submitted for review": "bg-violet-50/80 text-violet-700 border-violet-200",
  "Approved locally": "bg-teal-50/80 text-teal-700 border-teal-200",
  "On hold": "bg-amber-50/80 text-amber-700 border-amber-200",
  "Returned for edit": "bg-rose-50/80 text-rose-700 border-rose-200",
};

export default function ClientUpdates() {
  const s = useStore();
  const { toast } = useToast();
  const updates = [...s.clientUpdates].sort((a, b) => {
    const order = { "Submitted for review": 0, "Draft": 1, "Returned for edit": 2, "On hold": 3, "Approved locally": 4 };
    return (order[a.approvalStatus] ?? 5) - (order[b.approvalStatus] ?? 5);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Client Updates Review"
        subtitle="Human-in-the-loop review of client-facing status updates before they would sync to ComplianceConnect. Nothing is sent externally in this build."
      />
      <PreviewBanner className="mb-8" />

      <div className="space-y-4">
        {updates.length ? updates.map((c) => {
          const cli = lookup.client(s, c.clientId);
          const exam = lookup.exam(s, c.examId);
          return (
            <Card key={c.id} className="p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Link href={`/exam/${c.examId}`} className="text-lg font-bold text-purple-950 hover:text-purple-700 transition-colors">{cli?.name}</Link>
                  <div className="text-[13px] font-medium text-slate-500 mt-1">{exam?.examName}</div>
                </div>
                <Badge className={STATUS_TONE[c.approvalStatus]}>{c.approvalStatus}</Badge>
              </div>
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white bg-white/60 px-4 py-3 shadow-sm"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Internal status</span> <span className="font-bold text-slate-700">{c.internalStatus}</span></div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-3 shadow-sm"><span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">Proposed client status</span> <span className="font-bold text-purple-900">{c.proposedClientStatus}</span></div>
              </div>
              <textarea defaultValue={c.draftMessage} onBlur={(e) => s.updateClientUpdate(c.id, { draftMessage: e.target.value })}
                placeholder="Draft client-facing message…" rows={3}
                className="mb-6 w-full rounded-xl border border-white bg-white/60 p-4 text-[15px] font-medium text-purple-950 placeholder:text-slate-400 outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all resize-y" />
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => { s.submitClientUpdate(c.id); toast({ title: "Submitted for review" }); }} className="rounded-xl border border-purple-200 bg-white/80 px-4 py-2 text-[13px] font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all">Submit for review</button>
                <button onClick={() => { s.approveClientUpdate(c.id); toast({ title: "Approved locally", description: "Ready for ComplianceConnect preview." }); }} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-[13px] font-bold text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-pink-600 transition-all">Approve for preview</button>
                <div className="h-6 w-px bg-purple-100/50 mx-1 hidden sm:block"></div>
                <button onClick={() => { s.holdClientUpdate(c.id); toast({ title: "On hold" }); }} className="rounded-xl px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-white hover:text-purple-700 transition-all">Hold</button>
                <button onClick={() => { s.returnClientUpdate(c.id); toast({ title: "Returned for edit" }); }} className="rounded-xl px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-white hover:text-purple-700 transition-all">Return for edit</button>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-100/50 text-[12px] font-medium text-slate-400">
                Requested by <span className="font-bold text-slate-500">{c.requestedBy}</span>{c.reviewer ? <><span className="text-slate-300 mx-1">•</span> Reviewed by <span className="font-bold text-slate-500">{c.reviewer}</span></> : ""} <span className="text-slate-300 mx-1">•</span> Sync-ready preview — external publishing is disabled.
              </div>
            </Card>
          );
        }) : <EmptyState message="No client updates yet." />}
      </div>
    </div>
  );
}

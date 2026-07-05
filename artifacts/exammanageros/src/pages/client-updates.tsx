import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

const STATUS_TONE: Record<string, string> = {
  "Draft": "bg-slate-100 text-slate-600 border-slate-200",
  "Submitted for review": "bg-violet-50 text-violet-700 border-violet-200",
  "Approved locally": "bg-teal-50 text-teal-700 border-teal-200",
  "On hold": "bg-amber-50 text-amber-700 border-amber-200",
  "Returned for edit": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ClientUpdates() {
  const s = useStore();
  const { toast } = useToast();
  const updates = [...s.clientUpdates].sort((a, b) => {
    const order = { "Submitted for review": 0, "Draft": 1, "Returned for edit": 2, "On hold": 3, "Approved locally": 4 };
    return (order[a.approvalStatus] ?? 5) - (order[b.approvalStatus] ?? 5);
  });

  return (
    <div>
      <PageHeader
        title="Client Updates Review"
        subtitle="Human-in-the-loop review of client-facing status updates before they would sync to ComplianceConnect. Nothing is sent externally in this build."
      />
      <PreviewBanner className="mb-6" />

      <div className="space-y-3">
        {updates.length ? updates.map((c) => {
          const cli = lookup.client(s, c.clientId);
          const exam = lookup.exam(s, c.examId);
          return (
            <Card key={c.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link href={`/exam/${c.examId}`} className="text-sm font-semibold text-slate-800 hover:text-sky-700">{cli?.name}</Link>
                  <div className="text-xs text-slate-400">{exam?.examName}</div>
                </div>
                <Badge className={STATUS_TONE[c.approvalStatus]}>{c.approvalStatus}</Badge>
              </div>
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="text-slate-400">Internal status:</span> <span className="font-medium text-slate-700">{c.internalStatus}</span></div>
                <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs"><span className="text-slate-400">Proposed client status:</span> <span className="font-medium text-sky-700">{c.proposedClientStatus}</span></div>
              </div>
              <textarea defaultValue={c.draftMessage} onBlur={(e) => s.updateClientUpdate(c.id, { draftMessage: e.target.value })}
                placeholder="Draft client-facing message…" rows={2}
                className="mb-3 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-sky-300" />
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { s.submitClientUpdate(c.id); toast({ title: "Submitted for review" }); }} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Submit for review</button>
                <button onClick={() => { s.approveClientUpdate(c.id); toast({ title: "Approved locally", description: "Ready for ComplianceConnect preview." }); }} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700">Approve for preview</button>
                <button onClick={() => { s.holdClientUpdate(c.id); toast({ title: "On hold" }); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Hold</button>
                <button onClick={() => { s.returnClientUpdate(c.id); toast({ title: "Returned for edit" }); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Return for edit</button>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Requested by {c.requestedBy}{c.reviewer ? ` · reviewed by ${c.reviewer}` : ""}. Sync-ready preview — external
                ComplianceConnect publishing is disabled in this build.
              </p>
            </Card>
          );
        }) : <Card className="p-10 text-center text-sm text-slate-400">No client updates yet.</Card>}
      </div>
    </div>
  );
}

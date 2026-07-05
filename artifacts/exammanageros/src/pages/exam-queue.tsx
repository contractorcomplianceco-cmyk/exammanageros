import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { useStore } from "@/store/useStore";
import { matchesFilter, lookup, isOverdue, type QueueFilter } from "@/domain/derive";
import {
  examStatusTone, eligibilityTone, studyTone, registrationTone, resultTone, transcriptTone, riskTone,
} from "@/domain/status";
import { PageHeader, Badge, Card, fmtDate } from "@/components/shared";
import { Search } from "lucide-react";

const FILTERS: { key: QueueFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "exam-required", label: "Exam required" },
  { key: "eligibility-not-confirmed", label: "Eligibility not confirmed" },
  { key: "not-scheduled", label: "Not scheduled" },
  { key: "scheduled", label: "Scheduled" },
  { key: "passed", label: "Passed" },
  { key: "failed", label: "Failed / retake" },
  { key: "transcript-pending", label: "Transcript pending" },
  { key: "transcript-ordered", label: "Transcript ordered" },
  { key: "transcript-received", label: "Transcript received" },
  { key: "application-blocked", label: "Application blocked" },
  { key: "high-risk", label: "High risk" },
  { key: "overdue", label: "Overdue" },
  { key: "ready-next-step", label: "Ready for next step" },
  { key: "study-readiness-pending", label: "Study readiness pending" },
  { key: "closed", label: "Closed" },
];

const COLS = [
  "Client", "Candidate / Qualifier", "Related application", "State", "Board / Agency", "Exam name",
  "Provider", "Exam status", "Eligibility", "Study / prep", "Registration", "Scheduled",
  "Result", "Transcript", "Owner", "Next action", "Due date", "Risk",
];

export default function ExamQueue() {
  const s = useStore();
  const search = useSearch();
  const initial = (new URLSearchParams(search).get("filter") as QueueFilter) || "all";
  const [filter, setFilter] = useState<QueueFilter>(FILTERS.some((f) => f.key === initial) ? initial : "all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const f = new URLSearchParams(search).get("filter") as QueueFilter | null;
    if (f && FILTERS.some((x) => x.key === f)) setFilter(f);
  }, [search]);

  const rows = useMemo(() => {
    return s.exams.filter((e) => {
      if (!matchesFilter(e, filter, s)) return false;
      if (!q.trim()) return true;
      const cand = lookup.candidate(s, e.candidateId);
      const cli = lookup.client(s, e.clientId);
      const hay = `${e.examName} ${e.state} ${e.boardAgency} ${cand?.fullName ?? ""} ${cli?.name ?? ""} ${e.owner}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [s, filter, q]);

  return (
    <div>
      <PageHeader
        title="Exam Queue"
        subtitle="Complete operational view of every exam across the lifecycle. Click any row to open its full workspace."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            data-testid={`filter-${f.key}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.key
                ? "border-sky-300 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search client, candidate, exam, state…"
          data-testid="input-search"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1700px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                {COLS.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const cand = lookup.candidate(s, e.candidateId);
                const cli = lookup.client(s, e.clientId);
                const app = lookup.applications(s, e.id)[0];
                return (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-sky-50/40">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <Link href={`/exam/${e.id}`} className="font-medium text-slate-800 hover:text-sky-700" data-testid={`row-exam-${e.id}`}>
                        {cli?.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{cand?.fullName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-500">{app ? app.applicationNumber : "—"}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{e.state}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{e.boardAgency}</td>
                    <td className="px-3 py-2.5 max-w-[220px] truncate text-slate-700" title={e.examName}>{e.examName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{e.provider}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={examStatusTone(e.status)}>{e.status}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={eligibilityTone(e.eligibilityStatus)}>{e.eligibilityStatus}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={studyTone(e.studyStatus)}>{e.studyStatus}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={registrationTone(e.registrationStatus)}>{e.registrationStatus}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{fmtDate(e.scheduledDate)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={resultTone(e.resultStatus)}>{e.resultStatus}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={transcriptTone(e.transcriptStatus)}>{e.transcriptStatus}</Badge></td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{e.owner}</td>
                    <td className="px-3 py-2.5 max-w-[200px] truncate text-slate-600" title={e.nextAction}>{e.nextAction}</td>
                    <td className={`px-3 py-2.5 whitespace-nowrap ${isOverdue(e.dueDate) && e.status !== "Closed" ? "font-medium text-rose-600" : "text-slate-600"}`}>{fmtDate(e.dueDate)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><Badge className={riskTone(e.riskLevel)}>{e.riskLevel}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div className="py-10 text-center text-sm text-slate-400">No exams match this view.</div>}
        </div>
      </Card>
    </div>
  );
}

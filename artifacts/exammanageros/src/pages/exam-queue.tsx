import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { useStore } from "@/store/useStore";
import { matchesFilter, lookup, isOverdue, type QueueFilter } from "@/domain/derive";
import {
  examStatusTone, eligibilityTone, studyTone, registrationTone, resultTone, transcriptTone, riskTone,
} from "@/domain/status";
import { PageHeader, Badge, Card, fmtDate, EmptyState } from "@/components/shared";
import { Search, SlidersHorizontal } from "lucide-react";

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

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  data-testid={`filter-${f.key}`}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-all duration-200 ${
                    filter === f.key
                      ? "border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-sm"
                      : "border-white bg-white/50 text-slate-500 hover:border-purple-200 hover:bg-white hover:text-purple-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative min-w-[300px]">
            <Search className="absolute left-4 top-3 h-4 w-4 text-purple-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search client, candidate, exam…"
              data-testid="input-search"
              className="w-full rounded-[14px] border border-white bg-white/60 py-2.5 pl-11 pr-4 text-sm font-medium text-purple-950 placeholder:text-slate-400 outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1700px] text-sm">
            <thead>
              <tr className="border-b border-purple-100/50 bg-white/40 text-left">
                {COLS.map((c) => (
                  <th key={c} className="whitespace-nowrap px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const cand = lookup.candidate(s, e.candidateId);
                const cli = lookup.client(s, e.clientId);
                const app = lookup.applications(s, e.id)[0];
                return (
                  <tr key={e.id} className="border-b border-white/50 bg-white/20 hover:bg-purple-50/40 transition-colors group">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/exam/${e.id}`} className="font-bold text-purple-900 group-hover:text-purple-600 transition-colors" data-testid={`row-exam-${e.id}`}>
                        {cli?.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-600">{cand?.fullName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-medium">{app ? app.applicationNumber : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">{e.state}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">{e.boardAgency}</td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-slate-700 font-semibold" title={e.examName}>{e.examName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">{e.provider}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={examStatusTone(e.status)}>{e.status}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={eligibilityTone(e.eligibilityStatus)}>{e.eligibilityStatus}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={studyTone(e.studyStatus)}>{e.studyStatus}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={registrationTone(e.registrationStatus)}>{e.registrationStatus}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-purple-900">{fmtDate(e.scheduledDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={resultTone(e.resultStatus)}>{e.resultStatus}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={transcriptTone(e.transcriptStatus)}>{e.transcriptStatus}</Badge></td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-600">{e.owner}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-slate-600 font-medium" title={e.nextAction}>{e.nextAction}</td>
                    <td className={`px-4 py-3 whitespace-nowrap font-semibold ${isOverdue(e.dueDate) && e.status !== "Closed" ? "text-rose-600" : "text-slate-600"}`}>{fmtDate(e.dueDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><Badge className={riskTone(e.riskLevel)}>{e.riskLevel}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <EmptyState message="No exams match this view." />}
        </div>
      </Card>
    </div>
  );
}

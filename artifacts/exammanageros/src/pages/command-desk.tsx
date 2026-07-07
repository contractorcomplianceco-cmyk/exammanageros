import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { computeKpis, lookup, isOverdue, matchesFilter } from "@/domain/derive";
import { examStatusTone, transcriptTone, riskTone } from "@/domain/status";
import { PageHeader, KpiCard, SectionCard, Badge, PreviewBanner, EmptyState, fmtDate } from "@/components/shared";
import { CalendarClock, ArrowRight } from "lucide-react";

function ExamLine({ examId }: { examId: string }) {
  const s = useStore();
  const e = lookup.exam(s, examId);
  if (!e) return null;
  const cli = lookup.client(s, e.clientId);
  const cand = lookup.candidate(s, e.candidateId);
  return (
    <Link href={`/exam/${e.id}`} className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100" data-testid={`desk-exam-${e.id}`}>
      <div className="min-w-0">
        <div className="truncate text-[15px] font-bold text-purple-950 group-hover:text-purple-700 transition-colors">{cli?.name} <span className="text-purple-300 mx-1">•</span> <span className="text-purple-900/60 font-medium">{cand?.fullName}</span></div>
        <div className="truncate text-xs font-medium text-slate-500 mt-0.5">{e.examName}</div>
      </div>
      <Badge className={examStatusTone(e.status)}>{e.status}</Badge>
    </Link>
  );
}

export default function CommandDesk() {
  const s = useStore();
  const kpis = computeKpis(s);

  const priority = [...s.exams]
    .filter((e) => e.status !== "Closed")
    .sort((a, b) => {
      const r = { High: 0, Medium: 1, Low: 2 };
      if (r[a.riskLevel] !== r[b.riskLevel]) return r[a.riskLevel] - r[b.riskLevel];
      return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
    })
    .slice(0, 6);

  const upcoming = s.exams
    .filter((e) => e.scheduledDate && e.resultStatus === "Not taken")
    .sort((a, b) => (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? ""));

  const blockedApps = s.applications.filter((a) => a.blockedByExam || a.blockedByTranscript);
  const transcriptFollowUps = s.exams.filter((e) => matchesFilter(e, "transcript-pending", s));
  const readiness = s.exams.filter((e) => matchesFilter(e, "study-readiness-pending", s));
  const highRisk = s.exams.filter((e) => e.riskLevel === "High" && e.status !== "Closed");
  const recent = s.auditEvents.slice(0, 8);
  const pendingUpdates = s.clientUpdates.filter((c) => c.approvalStatus === "Draft" || c.approvalStatus === "Submitted for review");

  return (
    <div>
      <PageHeader
        title="Command Desk"
        subtitle="Live operational picture of every exam, transcript, and blocked application across Contractor Compliance Authority."
      />
      <PreviewBanner className="mb-8" />

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} tone={k.tone} href={`/queue?filter=${k.filter}`} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Priority Exam Queue" action={<Link href="/queue" className="text-[11px] font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors">Open queue →</Link>}>
          <div className="space-y-1 -mx-2">
            {priority.length ? priority.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="Nothing in the queue." />}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Exam Dates">
          <div className="space-y-1 -mx-2">
            {upcoming.length ? upcoming.map((e) => {
              const cli = lookup.client(s, e.clientId);
              return (
                <Link key={e.id} href={`/exam/${e.id}`} className="group flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 shadow-sm border border-purple-200/50 group-hover:scale-105 transition-transform"><CalendarClock className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-bold text-purple-950 group-hover:text-purple-700 transition-colors">{cli?.name}</div>
                    <div className="truncate text-xs font-medium text-slate-500 mt-0.5">{e.examName}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-purple-900">{fmtDate(e.scheduledDate)}</div>
                    <div className="text-slate-400 font-medium mt-0.5">{e.scheduledTime}</div>
                  </div>
                </Link>
              );
            }) : <EmptyState message="No upcoming scheduled exams." />}
          </div>
        </SectionCard>

        <SectionCard title="Applications Blocked by Exam" action={<Link href="/applications" className="text-[11px] font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors">View all →</Link>}>
          <div className="space-y-1 -mx-2">
            {blockedApps.length ? blockedApps.slice(0, 6).map((a) => (
              <Link key={a.id} href={`/exam/${a.examId}`} className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-bold text-purple-950 group-hover:text-purple-700 transition-colors">{a.applicationName}</div>
                  <div className="truncate text-xs font-medium text-slate-500 mt-0.5"><span className="text-slate-700 font-semibold">{a.applicationNumber}</span> <span className="text-slate-300 mx-1">•</span> {a.state}</div>
                </div>
                <Badge className={a.blockedByTranscript ? transcriptTone("Ordered") : examStatusTone("Failed - retake needed")}>
                  {a.blockedByTranscript ? "Awaiting transcript" : "Awaiting exam"}
                </Badge>
              </Link>
            )) : <EmptyState message="No blocked applications." />}
          </div>
        </SectionCard>

        <SectionCard title="Transcript / Score Report Follow-Ups" action={<Link href="/transcripts" className="text-[11px] font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors">View all →</Link>}>
          <div className="space-y-1 -mx-2">
            {transcriptFollowUps.length ? transcriptFollowUps.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="No transcript follow-ups." />}
          </div>
        </SectionCard>

        <SectionCard title="Study Readiness Follow-Ups">
          <div className="space-y-1 -mx-2">
            {readiness.length ? readiness.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="All candidates confirmed ready." />}
          </div>
        </SectionCard>

        <SectionCard title="High-Risk Exam Issues">
          <div className="space-y-1 -mx-2">
            {highRisk.length ? highRisk.map((e) => {
              const cli = lookup.client(s, e.clientId);
              return (
                <Link key={e.id} href={`/exam/${e.id}`} className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-rose-950 group-hover:text-rose-700 transition-colors">{cli?.name}</div>
                    <div className="truncate text-xs font-medium text-slate-500 mt-0.5">{e.blocker || e.examName}</div>
                  </div>
                  <Badge className={riskTone("High")}>High</Badge>
                </Link>
              );
            }) : <EmptyState message="No high-risk issues." />}
          </div>
        </SectionCard>

        <SectionCard title="Client Updates Awaiting Review" action={<Link href="/client-updates" className="text-[11px] font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors">Review →</Link>}>
          <div className="space-y-1 -mx-2">
            {pendingUpdates.length ? pendingUpdates.map((c) => {
              const cli = lookup.client(s, c.clientId);
              return (
                <Link key={c.id} href="/client-updates" className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-purple-950 group-hover:text-purple-700 transition-colors">{cli?.name}</div>
                    <div className="truncate text-xs font-medium text-slate-500 mt-0.5">Proposed: <span className="text-slate-700 font-semibold">{c.proposedClientStatus}</span></div>
                  </div>
                  <Badge className={c.approvalStatus === "Submitted for review" ? "bg-violet-50/80 text-violet-700 border-violet-200" : "bg-slate-50/80 text-slate-600 border-slate-200"}>{c.approvalStatus}</Badge>
                </Link>
              );
            }) : <EmptyState message="No client updates awaiting review." />}
          </div>
        </SectionCard>

        <SectionCard title="Recent Exam Activity">
          <div className="space-y-4">
            {recent.length ? recent.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <ArrowRight className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-purple-900">{a.action}</span>
                  {a.newValue !== "-" && <span className="text-purple-900/60 font-medium"> → <span className="text-purple-950 font-bold">{a.newValue}</span></span>}
                  <div className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">{a.user} <span className="text-slate-300 mx-1">•</span> {fmtDate(a.timestamp)}{a.aiAssisted ? " • automation" : ""}</div>
                </div>
              </div>
            )) : <EmptyState message="No activity yet." />}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

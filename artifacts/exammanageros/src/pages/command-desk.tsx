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
    <Link href={`/exam/${e.id}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50" data-testid={`desk-exam-${e.id}`}>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-slate-800">{cli?.name} · <span className="text-slate-500 font-normal">{cand?.fullName}</span></div>
        <div className="truncate text-xs text-slate-400">{e.examName}</div>
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
      <PreviewBanner className="mb-6" />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} tone={k.tone} href={`/queue?filter=${k.filter}`} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Priority Exam Queue" action={<Link href="/queue" className="text-xs font-medium text-sky-600 hover:text-sky-700">Open queue →</Link>}>
          <div className="space-y-0.5">
            {priority.length ? priority.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="Nothing in the queue." />}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Exam Dates">
          <div className="space-y-1">
            {upcoming.length ? upcoming.map((e) => {
              const cli = lookup.client(s, e.clientId);
              return (
                <Link key={e.id} href={`/exam/${e.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><CalendarClock className="h-4.5 w-4.5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-800">{cli?.name}</div>
                    <div className="truncate text-xs text-slate-400">{e.examName}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-medium text-slate-700">{fmtDate(e.scheduledDate)}</div>
                    <div className="text-slate-400">{e.scheduledTime}</div>
                  </div>
                </Link>
              );
            }) : <EmptyState message="No upcoming scheduled exams." />}
          </div>
        </SectionCard>

        <SectionCard title="Applications Blocked by Exam" action={<Link href="/applications" className="text-xs font-medium text-sky-600 hover:text-sky-700">View all →</Link>}>
          <div className="space-y-1">
            {blockedApps.length ? blockedApps.slice(0, 6).map((a) => (
              <Link key={a.id} href={`/exam/${a.examId}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">{a.applicationName}</div>
                  <div className="truncate text-xs text-slate-400">{a.applicationNumber} · {a.state}</div>
                </div>
                <Badge className={a.blockedByTranscript ? transcriptTone("Ordered") : examStatusTone("Failed - retake needed")}>
                  {a.blockedByTranscript ? "Awaiting transcript" : "Awaiting exam"}
                </Badge>
              </Link>
            )) : <EmptyState message="No blocked applications." />}
          </div>
        </SectionCard>

        <SectionCard title="Transcript / Score Report Follow-Ups" action={<Link href="/transcripts" className="text-xs font-medium text-sky-600 hover:text-sky-700">View all →</Link>}>
          <div className="space-y-0.5">
            {transcriptFollowUps.length ? transcriptFollowUps.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="No transcript follow-ups." />}
          </div>
        </SectionCard>

        <SectionCard title="Study Readiness Follow-Ups">
          <div className="space-y-0.5">
            {readiness.length ? readiness.map((e) => <ExamLine key={e.id} examId={e.id} />) : <EmptyState message="All candidates confirmed ready." />}
          </div>
        </SectionCard>

        <SectionCard title="High-Risk Exam Issues">
          <div className="space-y-1">
            {highRisk.length ? highRisk.map((e) => {
              const cli = lookup.client(s, e.clientId);
              return (
                <Link key={e.id} href={`/exam/${e.id}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800">{cli?.name}</div>
                    <div className="truncate text-xs text-slate-400">{e.blocker || e.examName}</div>
                  </div>
                  <Badge className={riskTone("High")}>High</Badge>
                </Link>
              );
            }) : <EmptyState message="No high-risk issues." />}
          </div>
        </SectionCard>

        <SectionCard title="Client Updates Awaiting Review" action={<Link href="/client-updates" className="text-xs font-medium text-sky-600 hover:text-sky-700">Review →</Link>}>
          <div className="space-y-1">
            {pendingUpdates.length ? pendingUpdates.map((c) => {
              const cli = lookup.client(s, c.clientId);
              return (
                <Link key={c.id} href="/client-updates" className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800">{cli?.name}</div>
                    <div className="truncate text-xs text-slate-400">Proposed: {c.proposedClientStatus}</div>
                  </div>
                  <Badge className={c.approvalStatus === "Submitted for review" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-slate-100 text-slate-600 border-slate-200"}>{c.approvalStatus}</Badge>
                </Link>
              );
            }) : <EmptyState message="No client updates awaiting review." />}
          </div>
        </SectionCard>

        <SectionCard title="Recent Exam Activity">
          <div className="space-y-2.5">
            {recent.length ? recent.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 text-sm">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
                <div className="min-w-0">
                  <span className="font-medium text-slate-700">{a.action}</span>
                  {a.newValue !== "-" && <span className="text-slate-500"> → {a.newValue}</span>}
                  <div className="text-xs text-slate-400">{a.user} · {fmtDate(a.timestamp)}{a.aiAssisted ? " · automation" : ""}</div>
                </div>
              </div>
            )) : <EmptyState message="No activity yet." />}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

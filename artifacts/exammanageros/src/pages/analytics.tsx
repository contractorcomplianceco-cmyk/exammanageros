import { useStore } from "@/store/useStore";
import { computeKpis } from "@/domain/derive";
import { PageHeader, Card, PreviewBanner } from "@/components/shared";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const PALETTE = ["#d946ef", "#ec4899", "#8b5cf6", "#a855f7", "#c084fc", "#e879f9"];

export default function Analytics() {
  const s = useStore();
  const kpis = computeKpis(s);

  const resultData = ["Passed", "Failed", "Not taken", "Pending"].map((r) => ({
    name: r, value: s.exams.filter((e) => e.resultStatus === r).length,
  })).filter((d) => d.value > 0);

  const transcriptData = ["Needs to be ordered", "Ordered", "Received by board", "Not required"].map((t) => ({
    name: t.replace("Needs to be ordered", "To order").replace("Received by board", "Received"),
    value: s.transcripts.filter((x) => x.transcriptStatus === t).length + (t === "Not required" ? s.exams.filter((e) => !e.transcriptRequired).length : 0),
  })).filter((d) => d.value > 0);

  const riskData = ["High", "Medium", "Low"].map((r) => ({ name: r, value: s.exams.filter((e) => e.riskLevel === r).length }));

  const ownerMap = new Map<string, number>();
  s.exams.forEach((e) => { if (e.status !== "Closed") ownerMap.set(e.owner, (ownerMap.get(e.owner) ?? 0) + 1); });
  const ownerData = [...ownerMap.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Operational metrics across the exam lifecycle. Representative data for preview only."
      />
      <PreviewBanner className="mb-8" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.slice(0, 5).map((k) => (
          <Card key={k.key} className="p-6 hover:-translate-y-0.5 transition-transform"><div className="text-4xl font-black text-purple-950 tracking-tight">{k.value}</div><div className="text-[13px] font-bold uppercase tracking-wider text-slate-400 mt-1">{k.label}</div></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8">
          <h3 className="mb-6 text-lg font-bold text-purple-950">Exam results</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={resultData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(e) => `${e.name}: ${e.value}`}>
                {resultData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />)}
              </Pie>
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-8">
          <h3 className="mb-6 text-lg font-bold text-purple-950">Transcript pipeline</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={transcriptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,180,240,0.2)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(200,180,240,0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#d946ef" maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-8">
          <h3 className="mb-6 text-lg font-bold text-purple-950">Risk distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,180,240,0.2)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(200,180,240,0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {riskData.map((_, i) => <Cell key={i} fill={["#ec4899", "#d946ef", "#a855f7"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-8">
          <h3 className="mb-6 text-lg font-bold text-purple-950">Active exams by owner</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ownerData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,180,240,0.2)" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12, fill: "#8b5cf6", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(200,180,240,0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#8b5cf6" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

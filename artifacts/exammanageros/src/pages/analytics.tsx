import { useStore } from "@/store/useStore";
import { computeKpis } from "@/domain/derive";
import { PageHeader, Card, PreviewBanner } from "@/components/shared";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const PALETTE = ["#0ea5e9", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#64748b"];

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
      <PreviewBanner className="mb-6" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.slice(0, 5).map((k) => (
          <Card key={k.key} className="p-4"><div className="text-3xl font-semibold text-slate-800">{k.value}</div><div className="text-xs text-slate-500 mt-0.5">{k.label}</div></Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Exam results</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={resultData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}: ${e.value}`}>
                {resultData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Transcript pipeline</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={transcriptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Risk distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {riskData.map((_, i) => <Cell key={i} fill={["#f43f5e", "#f59e0b", "#14b8a6"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Active exams by owner</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ownerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

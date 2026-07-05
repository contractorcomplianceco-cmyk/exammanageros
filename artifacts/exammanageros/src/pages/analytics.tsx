import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, Award, Timer, Target, CheckCircle2 } from "lucide-react";
import { MOCK_ANALYTICS } from "@/data/mock-data";

const PIE_COLORS = ["#246BFE", "#7C3AED", "#E633FF", "#20C7C7"];
const PASS_COLORS = ["#20C7C7", "#FF7C7C", "#FF4FA3"];

export default function Analytics() {
  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Leadership view — outcomes, throughput, and team performance.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={CheckCircle2} label="Pass Rate" value="84%" trend="+3% vs last mo" color="text-emerald-600" bg="bg-emerald-100" />
          <KpiCard icon={Timer} label="Avg Days to Schedule" value="4.2" trend="-0.6 days" color="text-[#246BFE]" bg="bg-[#246BFE]/10" />
          <KpiCard icon={Target} label="On-Time Exam Rate" value="92%" trend="+2%" color="text-[#7C3AED]" bg="bg-[#7C3AED]/10" />
          <KpiCard icon={Award} label="Exams This Quarter" value="177" trend="+18%" color="text-[#E633FF]" bg="bg-[#E633FF]/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base text-[#07184A]">Exam Throughput</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_ANALYTICS.monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#246BFE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passed" name="Passed" fill="#20C7C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base text-[#07184A]">Exam Outcomes</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_ANALYTICS.passFail} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                      {MOCK_ANALYTICS.passFail.map((_, i) => <Cell key={i} fill={PASS_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base text-[#07184A]">Pass Rate Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_ANALYTICS.monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                    <Line type="monotone" dataKey="passed" name="Passed" stroke="#E633FF" strokeWidth={3} dot={{ r: 4, fill: "#E633FF" }} />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#246BFE" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader><CardTitle className="text-base text-[#07184A]">Vendor Split</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_ANALYTICS.vendorSplit} dataKey="value" nameKey="name" outerRadius={90} label={{ fontSize: 11 }}>
                      {MOCK_ANALYTICS.vendorSplit.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base text-[#07184A]">Scheduler Workload</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_ANALYTICS.schedulerWorkload} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} width={80} />
                  <Tooltip cursor={{ fill: "#f7faff" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                  <Bar dataKey="load" name="Active exams" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function KpiCard({ icon: Icon, label, value, trend, color, bg }: { icon: React.ElementType; label: string; value: string; trend: string; color: string; bg: string }) {
  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
      <CardContent className="p-5">
        <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-[#07184A]">{value}</h3>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs"><TrendingUp className="h-3 w-3 mr-1" />{trend}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

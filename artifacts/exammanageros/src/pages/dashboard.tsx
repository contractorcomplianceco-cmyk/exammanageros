import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_EXAM_QUEUE, MOCK_RECORD_DETAIL } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Filter, Download, Plus, ArrowUpRight, TrendingUp, AlertCircle, Clock, CalendarDays, UserX, FileWarning, ListTodo, Search } from "lucide-react";

function getStatusColor(status: string) {
  if (status.includes("Scheduled") || status.includes("Approved")) return "bg-green-100 text-green-800 border-green-200";
  if (status.includes("At Risk") || status.includes("Failed")) return "bg-red-100 text-red-800 border-red-200";
  if (status.includes("Waiting on Exam Date")) return "bg-orange-100 text-orange-800 border-orange-200";
  if (status.includes("Prep In Progress") || status.includes("In Progress")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (status.includes("Waiting on Docs") || status.includes("Prep Docs")) return "bg-purple-100 text-purple-800 border-purple-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
}

const pipelineData = [
  { name: 'Qual', value: 480 },
  { name: 'Prop', value: 760 },
  { name: 'Neg', value: 820 },
  { name: 'Won', value: 420 },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F7FAFF] to-[#EEE7FF] p-8 border border-white/40 shadow-sm">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#FF4FA3]/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-64 h-64 bg-[#38A3FF]/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-[#07184A] mb-2 tracking-tight">Good morning, Rose 👋</h1>
            <p className="text-lg text-[#07184A]/80 font-medium">Lead with clarity. Deliver with confidence.</p>
            <p className="text-[#7C3AED] font-semibold mt-1">Excellence is scheduled.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-3">
                <ListTodo className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Exams Needing Scheduling</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">32</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> 5</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-[#246BFE]/10 text-[#246BFE] flex items-center justify-center mb-3">
                <CalendarDays className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Exams Coming Up</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">18</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> 4</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-[#FF7C7C]/10 text-[#FF7C7C] flex items-center justify-center mb-3">
                <AlertCircle className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Missed Exams</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">3</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> 1</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Approaching Deadlines</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">21</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> 6</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-[#20C7C7]/10 text-[#20C7C7] flex items-center justify-center mb-3">
                <UserX className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Client Not Responding</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">14</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center">↓ 2</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform duration-200 shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
            <CardContent className="p-5">
              <div className="w-8 h-8 rounded-lg bg-[#FF4FA3]/10 text-[#FF4FA3] flex items-center justify-center mb-3">
                <FileWarning className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Prep Not Delivered</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-[#07184A]">7</h3>
                <span className="text-xs font-medium text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> 2</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          
          {/* Table */}
          <div className="flex-1 w-full min-w-0 space-y-4">
            <Card className="border-border/50 shadow-sm overflow-hidden bg-white">
              <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 bg-white/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#07184A]">Exam Queue</h2>
                  <Badge className="bg-[#E633FF] hover:bg-[#E633FF]/90">16</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="h-9 pl-9 bg-muted/30" placeholder="Search queue..." />
                  </div>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                  <Button size="sm" className="h-9 bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] hover:opacity-90 border-0 shadow-md">
                    <Plus className="h-4 w-4 mr-1" /> New Exam
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7FAFF]">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Client / Company</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">State</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">License / Application</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Status</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_EXAM_QUEUE.map((row) => (
                      <TableRow key={row.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-[#07184A]">{row.client}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-muted/50">{row.state}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="text-sm">{row.license}</div>
                          <div className="text-xs opacity-70">{row.examType}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-medium border ${getStatusColor(row.status)}`}>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{row.deadline}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground bg-gray-50/50">
                <span>Showing 1 to 8 of 16 results</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </Card>
            
            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Activity Feed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#246BFE] mt-1.5"></div><p>New exam scheduled for <span className="font-medium">Blue Ridge</span></p></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5"></div><p>Prep documents received from <span className="font-medium">Pinnacle</span></p></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#E633FF] mt-1.5"></div><p>Email sent to <span className="font-medium">Summit Builders</span></p></div>
                  <div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#20C7C7] mt-1.5"></div><p>Payment confirmed from <span className="font-medium">Coastal Pros</span></p></div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Strategic Focus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-muted-foreground">On-time exam rate</span><span className="text-[#07184A]">92%</span></div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#20C7C7] w-[92%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-muted-foreground">Client response time</span><span className="text-[#07184A]">68%</span></div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#7C3AED] w-[68%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-muted-foreground">Prep delivery</span><span className="text-[#07184A]">85%</span></div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#FF4FA3] w-[85%]"></div></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Team Pulse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Capacity</p>
                      <p className="text-2xl font-bold text-[#07184A]">78%</p>
                    </div>
                    <div className="text-right text-sm space-y-1">
                      <p><span className="text-emerald-600 font-medium">26</span> On Track</p>
                      <p><span className="text-[#FF7C7C] font-medium">6</span> At Risk</p>
                      <p><span className="text-[#7C3AED] font-medium">3</span> Overloaded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Pipeline Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#07184A] mb-2">$2.48M</p>
                  <div className="h-[80px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="value" fill="#246BFE" radius={[4, 4, 4, 4]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full xl:w-[380px] flex-shrink-0 xl:sticky xl:top-4">
            <Card className="shadow-lg border-border bg-white rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#07184A] to-[#246BFE] p-5 text-white">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm shadow-none">Exam Record</Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 border-emerald-400/30">Scheduled</Badge>
                </div>
                <h3 className="text-xl font-bold leading-tight">{MOCK_RECORD_DETAIL.clientName}</h3>
                <p className="text-white/80 text-sm mt-1">{MOCK_RECORD_DETAIL.licenseName} • {MOCK_RECORD_DETAIL.state}</p>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-5 pt-4 border-b border-border">
                  <TabsList className="w-full bg-muted/50 h-10">
                    <TabsTrigger value="overview" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Notes</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-5 space-y-6 m-0 focus-visible:outline-none">
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client Details</h4>
                    <div className="bg-[#F7FAFF] rounded-xl p-3 border border-blue-100/50">
                      <p className="text-sm font-semibold text-[#07184A]">{MOCK_RECORD_DETAIL.overview.contact}</p>
                      <p className="text-sm text-muted-foreground mt-1">{MOCK_RECORD_DETAIL.overview.email}</p>
                      <p className="text-sm text-muted-foreground">{MOCK_RECORD_DETAIL.overview.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exam Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Date / Time</span><span className="font-medium text-[#07184A] text-right">{MOCK_RECORD_DETAIL.overview.dateTime}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Exam</span><span className="font-medium text-[#07184A]">{MOCK_RECORD_DETAIL.overview.exam}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium text-[#07184A]">{MOCK_RECORD_DETAIL.overview.vendor}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Conf #</span><span className="font-medium text-[#07184A]">{MOCK_RECORD_DETAIL.overview.confirmation}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">App Status</span><span className="font-medium text-[#07184A]">{MOCK_RECORD_DETAIL.overview.appStatus}</span></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</h4>
                    <div className="relative border-l-2 border-muted ml-2 space-y-4 pb-2">
                      {MOCK_RECORD_DETAIL.overview.timeline.map((item, i) => (
                        <div key={i} className="relative pl-4">
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${i === MOCK_RECORD_DETAIL.overview.timeline.length - 1 ? 'bg-[#7C3AED] ring-4 ring-[#7C3AED]/20' : 'bg-muted-foreground'}`}></div>
                          <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                          <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-[#F7FAFF] text-[#246BFE] hover:bg-blue-50 border border-blue-100 shadow-sm font-semibold" variant="outline">
                      Open Full Record <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}

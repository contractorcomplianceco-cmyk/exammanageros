import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ShieldCheck, ArrowRight, CheckCircle2, Users, Bell } from "lucide-react";
import { MOCK_AUDIT_RULES, OWNERS } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";

const ZOHO_FLOW = [
  "Invoice Paid",
  "Exam Scheduling item detected",
  "Record created",
  "QA queue created",
  "Default owner: Skylar",
];

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">Settings & Integrations</h1>
          <p className="text-muted-foreground mt-1">Automation, compliance rules, and team configuration.</p>
        </div>

        <Tabs defaultValue="integrations">
          <TabsList>
            <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
            <TabsTrigger value="audit" data-testid="tab-audit">AuditEngine Rules</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="pt-6 space-y-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#246BFE]/10 text-[#246BFE] flex items-center justify-center"><Zap className="h-5 w-5" /></div>
                  <div>
                    <CardTitle className="text-base text-[#07184A]">Zoho Books</CardTitle>
                    <p className="text-xs text-muted-foreground">Auto-create exam records when invoices are paid</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center flex-wrap gap-2 p-4 rounded-xl bg-[#F7FAFF] border border-border/50">
                  {ZOHO_FLOW.map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white border-blue-100 text-[#07184A] font-medium py-1.5">{step}</Badge>
                      {i < ZOHO_FLOW.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50">
                    <Label htmlFor="zoho-auto">Auto-create records</Label>
                    <Switch id="zoho-auto" defaultChecked data-testid="switch-zoho-auto" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50">
                    <Label htmlFor="zoho-qa">Auto-create QA queue</Label>
                    <Switch id="zoho-qa" defaultChecked data-testid="switch-zoho-qa" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Default owner</Label>
                    <Select defaultValue="Skylar">
                      <SelectTrigger data-testid="select-default-owner"><SelectValue /></SelectTrigger>
                      <SelectContent>{OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Trigger keyword</Label>
                    <Input defaultValue="Exam Scheduling" data-testid="input-trigger-keyword" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="pt-6">
            <Card className="shadow-sm border-border/50 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>
                  <div>
                    <CardTitle className="text-base text-[#07184A]">AuditEngine Rules</CardTitle>
                    <p className="text-xs text-muted-foreground">State + license requirements powering the queue</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" data-testid="button-add-rule">Add Rule</Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7FAFF]">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">License</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">State</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Required Exams</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Pre-Approval</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Deadline</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Vendor</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Cost</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Passing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_AUDIT_RULES.map((rule, i) => (
                      <TableRow key={i} className="hover:bg-muted/30" data-testid={`rule-${i}`}>
                        <TableCell className="font-medium text-[#07184A]">{rule.license}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-muted/50">{rule.state}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{rule.requiredExams}</TableCell>
                        <TableCell><Badge variant="outline" className={`border ${getStatusColor(rule.preApproval === "Required" ? "pre-approval" : "complete")}`}>{rule.preApproval}</Badge></TableCell>
                        <TableCell className="text-sm">{rule.deadline}</TableCell>
                        <TableCell className="text-sm">{rule.vendor}</TableCell>
                        <TableCell className="text-sm font-medium">{rule.cost}</TableCell>
                        <TableCell className="text-sm">{rule.passingScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="pt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E633FF]/10 text-[#E633FF] flex items-center justify-center"><Users className="h-5 w-5" /></div>
                <CardTitle className="text-base text-[#07184A]">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {OWNERS.map((name) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-[#F7FAFF]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#246BFE] to-[#E633FF] text-white flex items-center justify-center text-sm font-semibold">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#07184A]">{name}</p>
                        <p className="text-xs text-muted-foreground">Exam Scheduler</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="pt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20C7C7]/10 text-[#20C7C7] flex items-center justify-center"><Bell className="h-5 w-5" /></div>
                <CardTitle className="text-base text-[#07184A]">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Deadline approaching alerts", true],
                  ["Client not responding alerts", true],
                  ["New exam record created", true],
                  ["Prep not delivered reminders", false],
                  ["Weekly leadership digest", true],
                ].map(([label, on]) => (
                  <div key={label as string} className="flex items-center justify-between p-3 rounded-xl border border-border/50">
                    <Label>{label as string}</Label>
                    <Switch defaultChecked={on as boolean} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

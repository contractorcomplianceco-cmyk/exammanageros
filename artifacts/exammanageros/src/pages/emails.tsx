import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Sparkles, Send, Check, RefreshCw, AlertTriangle } from "lucide-react";
import { MOCK_EMAIL_DRAFTS, DRAFT_TYPES } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";
import type { EmailDraft } from "@/data/mock-data";

export default function Emails() {
  const [selected, setSelected] = useState<EmailDraft>(MOCK_EMAIL_DRAFTS[0]);

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">Email Drafts</h1>
            <p className="text-muted-foreground mt-1">AI-assisted drafts, reviewed by a human before anything goes out.</p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 py-1.5 px-3">
            <AlertTriangle className="h-3.5 w-3.5" /> Prototype only — no real email is sent
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <Card className="w-full lg:w-[380px] flex-shrink-0 border-border/50 shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#07184A]">Drafts</h2>
              <Badge className="bg-[#E633FF]">{MOCK_EMAIL_DRAFTS.length}</Badge>
            </div>
            <div className="divide-y divide-border/50 max-h-[70vh] overflow-y-auto">
              {MOCK_EMAIL_DRAFTS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className={`w-full text-left p-4 transition-colors ${selected.id === d.id ? "bg-[#EEE7FF]/60" : "hover:bg-muted/30"}`}
                  data-testid={`draft-${d.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-[#07184A]">{d.client}</p>
                    <span className="text-xs text-muted-foreground">{d.updated}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{d.type}</p>
                  <Badge variant="outline" className={`text-xs font-medium border ${getStatusColor(d.status)}`}>{d.status}</Badge>
                </button>
              ))}
            </div>
          </Card>

          <div className="flex-1 min-w-0 space-y-4">
            <Card className="border-border/50 shadow-sm bg-white">
              <div className="bg-gradient-to-r from-[#07184A] to-[#246BFE] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selected.client}</h3>
                    <p className="text-white/80 text-sm mt-1">{selected.record}</p>
                  </div>
                  <Badge variant="outline" className={`font-medium border ${getStatusColor(selected.status)}`}>{selected.status}</Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Draft Type</Label>
                    <Select defaultValue={DRAFT_TYPES[0]}>
                      <SelectTrigger data-testid="select-draft-type"><SelectValue /></SelectTrigger>
                      <SelectContent>{DRAFT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Recipient</Label>
                    <Input defaultValue={`${selected.client.split(" ")[0].toLowerCase()}@client.com`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Input defaultValue={`${selected.type} — Contractor Compliance Authority`} data-testid="input-subject" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Message</Label>
                    <Button variant="ghost" size="sm" className="text-[#7C3AED] h-7" data-testid="button-regenerate">
                      <Sparkles className="h-3.5 w-3.5 mr-1" /> Regenerate with AI
                    </Button>
                  </div>
                  <Textarea
                    className="min-h-[240px] font-normal leading-relaxed"
                    data-testid="textarea-message"
                    defaultValue={`Hi ${selected.client.split(" ")[0]} team,\n\n${selected.preview}\n\nOur team is here to guide you through every step of the exam process. If you have any questions, simply reply to this message and one of our specialists will follow up.\n\nManage. Prepare. Succeed.\n\nWarm regards,\nRose Taylor\nContractor Compliance Authority`}
                  />
                </div>
              </CardContent>
              <div className="p-4 border-t border-border/50 flex items-center justify-between bg-gray-50/50">
                <Button variant="ghost" className="text-muted-foreground" data-testid="button-regen-footer">
                  <RefreshCw className="h-4 w-4 mr-2" /> Reset draft
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" data-testid="button-approve"><Check className="h-4 w-4 mr-2" /> Approve</Button>
                  <Button className="bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] border-0" data-testid="button-mark-sent">
                    <Send className="h-4 w-4 mr-2" /> Mark as Sent
                  </Button>
                </div>
              </div>
            </Card>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Mail className="h-3.5 w-3.5" /> Drafts are stored locally in this prototype and never delivered.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

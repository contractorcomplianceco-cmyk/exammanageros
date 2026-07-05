import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import CommandDesk from "@/pages/command-desk";
import ExamQueue from "@/pages/exam-queue";
import ExamDetail from "@/pages/exam-detail";
import Applications from "@/pages/applications";
import Transcripts from "@/pages/transcripts";
import Tasks from "@/pages/tasks";
import ClientUpdates from "@/pages/client-updates";
import DocCollect from "@/pages/doc-collect";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={CommandDesk} />
      <Route path="/queue" component={ExamQueue} />
      <Route path="/exam/:id" component={ExamDetail} />
      <Route path="/applications" component={Applications} />
      <Route path="/transcripts" component={Transcripts} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/client-updates" component={ClientUpdates} />
      <Route path="/doc-collect" component={DocCollect} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Layout>
          <Routes />
        </Layout>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

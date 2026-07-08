import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/context/auth";
import { Layout } from "@/components/layout";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";

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

function AuthenticatedApp() {
  const { user, loading: authLoading } = useAuth();
  const load = useStore((s) => s.load);
  const setCurrentUserName = useStore((s) => s.setCurrentUserName);
  const domainLoading = useStore((s) => s.loading);

  useEffect(() => {
    if (user) {
      setCurrentUserName(user.name);
      void load();
    }
  }, [user, load, setCurrentUserName]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  }
  if (!user) return <LoginPage />;
  if (domainLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading exam data…</div>;
  }

  return (
    <Layout>
      <Routes />
    </Layout>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthenticatedApp />
        </WouterRouter>
      </AuthProvider>
      <Toaster />
    </TooltipProvider>
  );
}

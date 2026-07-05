import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Queue from "@/pages/queue";
import Records from "@/pages/records";
import Emails from "@/pages/emails";
import ComplianceConnect from "@/pages/compliance-connect";
import DocCollect from "@/pages/doc-collect";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/queue" component={Queue} />
      <Route path="/records" component={Records} />
      <Route path="/emails" component={Emails} />
      <Route path="/compliance-connect" component={ComplianceConnect} />
      <Route path="/doc-collect" component={DocCollect} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

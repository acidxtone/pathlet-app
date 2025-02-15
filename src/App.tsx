import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import BirthDetailsPage from "@/pages/birth-details-page";
import InsightsPage from "@/pages/insights-page";
import AIChatPage from "@/pages/ai-chat-page";
import { withProtection } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";
import { InsightsProvider } from "@/context/insights-context";

function AppContent() {
  return (
    <InsightsProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/birth-details" component={withProtection(BirthDetailsPage)} />
        <Route path="/insights" component={withProtection(InsightsPage)} />
        <Route path="/ai-chat" component={withProtection(AIChatPage)} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </InsightsProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
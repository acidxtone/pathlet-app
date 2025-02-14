import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ReadingPage from "@/pages/reading-page";
import { withProtection } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";

function AppContent() {
  return (
    <>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={withProtection(HomePage)} />
        <Route path="/reading" component={withProtection(ReadingPage)} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
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
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ReadingPage from "@/pages/reading-page";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/home" component={HomePage} />
        <ProtectedRoute path="/reading" component={ReadingPage} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
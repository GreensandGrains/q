import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Tickets from "@/pages/Tickets";
import PolicyPage from "@/pages/PolicyPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});

function TokenCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("nexaro_token", token);
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
      queryClient.invalidateQueries();
    }
  }, []);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <GalaxyBackground />
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plans" component={Plans} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/privacy">{() => <PolicyPage type="privacy" />}</Route>
      <Route path="/terms">{() => <PolicyPage type="terms" />}</Route>
      <Route path="/security">{() => <PolicyPage type="security" />}</Route>
      <Route path="/cookies">{() => <PolicyPage type="cookies" />}</Route>
      <Route path="/dmca">{() => <PolicyPage type="dmca" />}</Route>
      <Route path="/sla">{() => <PolicyPage type="sla" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <TokenCapture />
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

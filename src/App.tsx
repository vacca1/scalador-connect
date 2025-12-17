import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InfiniteGridBackground } from "@/components/ui/the-infinite-grid";
import Landing from "./pages/Landing";
import LandingCapta from "./pages/LandingCapta";
import LandingScalador from "./pages/LandingScalador";
import Login from "./pages/Login";
import EmpresaPortal from "./pages/EmpresaPortal";
import FreelancerPortal from "./pages/FreelancerPortal";
import ProfissionalPortal from "./pages/ProfissionalPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <InfiniteGridBackground>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/empregos" element={<LandingCapta />} />
            <Route path="/scalador" element={<LandingScalador />} />
            <Route path="/profissional" element={<ProfissionalPortal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/empresa" element={<EmpresaPortal />} />
            <Route path="/freelancer" element={<FreelancerPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InfiniteGridBackground>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

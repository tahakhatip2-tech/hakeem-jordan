import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import QueueDisplay from "./pages/QueueDisplay";
import { ScrollToTop } from "./components/ScrollToTop";

import { ClinicProvider } from "./context/ClinicContext";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <ClinicProvider>
                <Toaster />
                <Sonner />
                <HashRouter>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/queue" element={<QueueDisplay />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </HashRouter>
            </ClinicProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

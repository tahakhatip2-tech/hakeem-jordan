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

// Patient Portal Pages
import PatientLogin from "./pages/patient/PatientLogin";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientLayout from "./pages/patient/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientClinics from "./pages/patient/PatientClinics";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientNotifications from "./pages/patient/PatientNotifications";

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

                        {/* Patient Portal Routes */}
                        <Route path="/patient/login" element={<PatientLogin />} />
                        <Route path="/patient/register" element={<PatientRegister />} />
                        <Route path="/patient" element={<PatientLayout />}>
                            <Route path="dashboard" element={<PatientDashboard />} />
                            <Route path="clinics" element={<PatientClinics />} />
                            <Route path="appointments" element={<PatientAppointments />} />
                            <Route path="notifications" element={<PatientNotifications />} />
                        </Route>

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </HashRouter>
            </ClinicProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

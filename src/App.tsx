import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Login, Register } from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Residents from "./pages/Residents.tsx";
import Billing from "./pages/Billing.tsx";
import Complaints from "./pages/Complaints.tsx";
import Visitors from "./pages/Visitors.tsx";
import Notices from "./pages/Notices.tsx";
import Amenities from "./pages/Amenities.tsx";
import Vehicles from "./pages/Vehicles.tsx";
import Staff from "./pages/Staff.tsx";
import Reports from "./pages/Reports.tsx";
import Settings from "./pages/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Public Routes (Redirect to dashboard if logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Management Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

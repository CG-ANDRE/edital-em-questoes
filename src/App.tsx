import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/public/LoginPage";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import QuestionPage from "./pages/QuestionPage";
import Performance from "./pages/Performance";
import Contact from "./pages/Contact";
import Materials from "./pages/Materials";
import Plans from "./pages/Plans";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";
import StudySession from "./pages/StudySession";
import SignupPage from "./pages/public/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStudentDetail from "./pages/admin/AdminStudentDetail";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminContests from "./pages/admin/AdminContests";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminReports from "./pages/admin/AdminReports";
import AdminMonitoring from "./pages/admin/AdminMonitoring";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/practice" element={<Practice />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/study-session" element={<StudySession />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/contests" element={<AdminContests />} />
          <Route path="/admin/materials" element={<AdminMaterials />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/monitoring" element={<AdminMonitoring />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

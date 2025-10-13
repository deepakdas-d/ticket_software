import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==================== Context Providers ==================== //
import { AdminAuthProvider } from "./superadmin/context/AuthContext";
import { SupporterAuthProvider } from "./support/context/SupporterAuthProvider";
import { AuthProvider } from "./users/context/authcontext";

// ==================== SuperAdmin Pages ==================== //
import SignIn from "./superadmin/pages/SuperAdmin_SignIn";
import Dashboard from "./superadmin/pages/Dashboard";
import Tickets from "./superadmin/pages/Tickets";
import SupportTeam from "./superadmin/pages/Supports";
import Users from "./superadmin/pages/Users";

// ==================== Supporter Pages ==================== //
import SupporterLogin from "./support/pages/SupporterLogin";
import SupporterDashboard from "./support/pages/SupporterDashboard";
import SupporterProfile from "./support/pages/SupporterProfile";
import ComplaintTable from "./support/pages/SupportTickets";
import MessagesPage from "./support/pages/MessagesPage";
import SupporterProtectedRoute from "./support/components/other/SupporterProtectedRoute";
import SupporterLayout from "./support/components/Layout/SupporterLayout";

// ==================== User Pages ==================== //
import Login from "./users/pages/login/login";
import Register from "./users/pages/register/register";
import ForgotPassword from "./users/pages/forgotpassword/request_otp";
import HelpdeskDashboard from "./users/pages/dashboard/dashboard";
import RaiseTicket from "./users/pages/guest_tickets/raise_ticket";
import ProfilePage from "./users/pages/profile/profilepage";
import TicketFormPage from "./users/pages/ticket_form/ticketformpages";
import TicketsPage from "./users/pages/ticket_form/ticketpage";
import TicketDetailPage from "./users/pages/ticket_detials/ticket_details";
import DashboardLayout from "./users/pages/dashboard/dashboard";
import ProtectedRoute from "./users/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <SupporterAuthProvider>
            <Routes>
              {/* ==================== SUPPORTER ROUTES ==================== */}
              <Route path="/supportsignin" element={<SupporterLogin />} />
              <Route
                path="/supportsignin"
                element={
                 
                    <SupporterLogin />
                  
                }
              />

              {/* Persistent Sidebar Layout for all supporter pages */}
              <Route
                element={
                  <SupporterProtectedRoute>
                    <SupporterLayout />
                  </SupporterProtectedRoute>
                }
              >
                <Route
                  path="/supportdashboard"
                  element={<SupporterDashboard />}
                />
                <Route path="/supportprofile" element={<SupporterProfile />} />
                <Route path="/supportertickets" element={<ComplaintTable />} />
                <Route path="/messages/:ticket_id" element={<MessagesPage />} />
              </Route>

              {/* ==================== SUPERADMIN ROUTES ==================== */}
              <Route path="/adminsignin" element={<SignIn />} />
              <Route path="/admindashboard" element={<Dashboard />} />
              <Route path="/admintickets" element={<Tickets />} />
              <Route path="/supports" element={<SupportTeam />} />
              <Route path="/users" element={<Users />} />

              {/* ==================== USER ROUTES ==================== */}
                  
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/raise-ticket" element={<RaiseTicket />} />
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ticket/new" element={<TicketFormPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/ticket-details" element={<TicketDetailPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        </Route>

        {/* Optional old route */}
        <Route path="/helpdesk-dashboard" element={<HelpdeskDashboard />} />
            </Routes>
          </SupporterAuthProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

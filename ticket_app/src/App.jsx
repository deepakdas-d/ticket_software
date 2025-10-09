import { BrowserRouter, Routes, Route } from "react-router-dom";
{
  /* //==================== SuperAdmin Routes ====================// */
}

import { AdminAuthProvider } from "./superadmin/context/AuthContext";
import { SupporterAuthProvider } from "./support/context/SupporterAuthProvider";
import SignIn from "./superadmin/pages/SuperAdmin_SignIn";
import Dashboard from "./superadmin/pages/Dashboard";
import Tickets from "./superadmin/pages/Tickets";
import SupportTeam from "./superadmin/pages/Supports";
import Users from "./superadmin/pages/Users";
{
  /* //==================== Supporter Routes ====================// */
}

import SupporterLogin from "./support/pages/SupporterLogin";
import SupporterDashboard from "./support/pages/SupporterDashboard";
import SupporterProfile from "./support/pages/SupporterProfile";
import ComplaintTable from "./support/pages/SupportTickets";
import SupporterProtectedRoute from "./support/components/other/SupporterProtectedRoute";
{
  /* //==================== User Routes ====================// */
}

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
import { AuthProvider } from "./users/context/authcontext";


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <AdminAuthProvider>
        <SupporterAuthProvider>
          <Routes>
            {/* //==================== Supporter Routes ====================// */}
            <Route path="/supportsignin" element={<SupporterLogin />} />
            <Route
              path="/supportdashboard"
              element={
                <SupporterProtectedRoute>
                  <SupporterDashboard />
                </SupporterProtectedRoute>
              }
            />

            <Route
              path="/supportprofile"
              element={
                <SupporterProtectedRoute>
                  <SupporterProfile />
                </SupporterProtectedRoute>
              }
            />
            <Route
              path="/supportertickets"
              element={
                <SupporterProtectedRoute>
                  <ComplaintTable />
                </SupporterProtectedRoute>
              }
            />

            {/* //==================== SuperAdmin Routes ====================// */}
            <Route path="/users" element={<Users />} />
            <Route path="/admintickets" element={<Tickets />} />
            <Route path="/supports" element={<SupportTeam />} />
            <Route path="/adminsignin" element={<SignIn />} />
            <Route path="/admindashboard" element={<Dashboard />} />
            {/* //==================== User Routes ====================// */}
           
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* Old dashboard route (if you still need it) */}
              <Route
                path="/helpdesk-dashboard"
                element={<HelpdeskDashboard />}
              />
              <Route path="/raise-ticket" element={<RaiseTicket />} />
              {/* Protected routes with Sidebar layout */}
              <Route element={<DashboardLayout />}>
                <Route path="/ProfilePage" element={<ProfilePage />} />
                <Route path="/ticket/new" element={<TicketFormPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/ticketdetials" element={<TicketDetailPage />} />
                <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
              </Route>
              {/* Default route */}
              <Route path="/" element={<Login />} />
           
          </Routes>
        </SupporterAuthProvider>
      </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

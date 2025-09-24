import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./superadmin/context/AuthContext";
import { SupporterAuthProvider } from './support/context/SupporterAuthProvider';
import SignIn from './superadmin/pages/SuperAdmin_SignIn';
import Dashboard from './superadmin/pages/Dashboard';
import SupportTeam from './superadmin/pages/Supports';
import SupporterLogin from './support/pages/SupporterLogin';
import SupporterDashboard from './support/pages/SupporterDashboard';
import SupporterProfile from './support/pages/SupporterProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
<SupporterAuthProvider>
        <Routes>
          {/* //==================== Supporter Routes ====================// */}
          <Route path="/supportsignin" element={<SupporterLogin />} />
          <Route path="/supportdashboard" element={<SupporterDashboard />} />
          <Route path="/supportprofile" element={<SupporterProfile />} />

          {/* //==================== SuperAdmin Routes ====================// */}
          <Route path="/supports" element={<SupportTeam />} />
          <Route path="/adminsignin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
        </SupporterAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

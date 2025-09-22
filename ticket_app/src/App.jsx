import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./superadmin/context/AuthContext";

import SignIn from './superadmin/pages/SignIn';
import Dashboard from './superadmin/pages/Dashboard';
import SupportTeam from './superadmin/pages/Supports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/supports" element={<SupportTeam />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

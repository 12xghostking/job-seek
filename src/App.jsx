import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import EmpDash from './components/EmployerDash/EmpDash';
import SeekerDashboard from './components/SaDash/SaDash';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer" element={<EmpDash />} />
          <Route path="/seeker" element={<SeekerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

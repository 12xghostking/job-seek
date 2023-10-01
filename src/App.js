import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.js'
import SignUp from './components/SignUp/SignUp.js';
import Login from './components/Login/Login.js';
import EmpDash from './components/EmployerDash/EmpDash.js';
import SeekerDashboard from './components/SaDash/SaDash.js';
function App() {
  return (
   <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
     <Route path="/login" element={<Login />} />
      <Route path="/employer" element={<EmpDash />} />
       <Route path="/seeker" element={<SeekerDashboard />} />
   </Routes>
  );
}

export default App;

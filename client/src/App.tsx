import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import Insights from './pages/Insights';
import Login from './pages/Login';
import AsthmaAttackGuide from './pages/AsthmaAttackGuide';
import RiskAlert from './pages/RiskAlert';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen max-w-md mx-auto bg-[#F6F8F9] shadow-md overflow-hidden relative font-sans text-slate-900 border-x border-slate-100">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/astma-attack" element={<AsthmaAttackGuide />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/risk-alert" element={<RiskAlert />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

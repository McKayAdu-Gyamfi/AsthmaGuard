import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AsthmaAttackGuide from './pages/AsthmaAttackGuide';
import RiskAlert from './pages/RiskAlert';
import { AppLayout } from './components/layout/AppLayout';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import AISupport from './pages/AISupport';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/asthma-attack" element={<AsthmaAttackGuide />} />
        
        {/* Wrapped routes */}
        <Route path="/" element={<AppLayout><HomeDashboard /></AppLayout>} />
        <Route path="/insights" element={<AppLayout><Insights /></AppLayout>} />
        <Route path="/plan" element={<AppLayout><Plan /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/ai-support" element={<AppLayout><AISupport /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/risk-alert" element={<AppLayout><RiskAlert /></AppLayout>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

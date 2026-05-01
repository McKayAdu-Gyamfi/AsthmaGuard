import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AsthmaAttackGuide from './pages/AsthmaAttackGuide';
import RiskAlert from './pages/RiskAlert';
import { AppLayout } from './components/layout/AppLayout';
import Profile from './pages/Profile';
import Health from './pages/Health';
import AISupport from './pages/AISupport';
import Settings from './pages/Settings';
import EmergencyContacts from './pages/EmergencyContacts';
import AlertsHistory from './pages/AlertsHistory';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Loader from './components/Loader';

import { authClient } from './lib/auth-client';

const AppContent = () => {
  const { data: session, isPending } = authClient.useSession();
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('hasShownSplash');
  });
  const navigate = useNavigate();

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('hasShownSplash', 'true');
    
    // Smart navigation: if logged in, go to home, else signup
    if (session) {
      navigate('/');
    } else {
      navigate('/signup');
    }
  };

  if (showLoader) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/asthma-attack" element={<AsthmaAttackGuide />} />
      
      {/* Wrapped routes */}
      <Route path="/" element={<AppLayout><HomeDashboard /></AppLayout>} />
      <Route path="/insights" element={<AppLayout><Insights /></AppLayout>} />
      <Route path="/health" element={<AppLayout><Health /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
      <Route path="/ai-support" element={<AppLayout><AISupport /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/emergency-contacts" element={<AppLayout><EmergencyContacts /></AppLayout>} />
      <Route path="/alerts-history" element={<AppLayout><AlertsHistory /></AppLayout>} />
      <Route path="/risk-alert" element={<AppLayout><RiskAlert /></AppLayout>} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AsthmaAttackGuide from './pages/AsthmaAttackGuide';
import RiskAlert from './pages/RiskAlert';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen max-w-md mx-auto bg-[#F6F8F9] shadow-md overflow-hidden relative font-sans text-slate-900 border-x border-slate-100">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/astma-attack" element={<AsthmaAttackGuide />} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/risk-alert" element={<ProtectedRoute><RiskAlert /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

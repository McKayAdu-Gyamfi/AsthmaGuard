import { useState, useEffect } from 'react';
import { Bell, MapPin, Wind, ShieldCheck, Activity, Zap, Info, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@/components/CircularProgress';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [latestAlert, setLatestAlert] = useState<null | { id: string; risk_level: string; message: string; created_at: string; location?: string }>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch session data first to get the user's name
        const sessionRes = await fetch('/api/auth/get-session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.user) {
            setUserData(sessionData.user);
          }
        }

        const [alertsRes, riskRes, weeklyRes] = await Promise.all([
          fetch('/api/v1/alerts'),
          fetch('/api/v1/risk'),
          fetch('/api/v1/history/weekly')
        ]);

        if (alertsRes.ok) {
          const alerts = await alertsRes.json();
          if (alerts.success && alerts.data.length > 0) setLatestAlert(alerts.data[0]);
        }

        if (riskRes.ok) {
          const risk = await riskRes.json();
          if (risk.success) setRiskData(risk.data);
        }


        if (weeklyRes.ok) {
          const weekly = await weeklyRes.json();
          if (weekly.success) setWeeklyData(weekly.data);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F8F9] to-white flex flex-col relative pb-24 font-sans overflow-x-hidden">
      
      {/* Header Profile Section */}
      <div className="flex items-center justify-between px-6 py-5 mt-2">
        <div className="flex flex-col">
          <p className="text-[13px] text-[#475569]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h1 className="text-[18px] font-bold text-[#0F172A] tracking-tight">
            Good Morning, {userData?.name?.split(' ')[0] || 'User'}
          </h1>
        </div>
        <button 
          onClick={() => navigate('/alerts-history')}
          className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 relative"
        >
          <Bell className="w-5 h-5 fill-slate-700" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></div>
        </button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-4">
        {/* Quick Actions Base */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => navigate('/health')}
            className="flex-1 h-14 bg-[#0A5D64] hover:bg-[#07474E] text-white font-semibold rounded-xl text-[15px] shadow-sm flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Track Symptoms
          </Button>
          <Button 
            onClick={() => navigate('/asthma-attack')}
            className="flex-1 h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold rounded-xl text-[15px] shadow-sm flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-current" />
            Emergency Mode
          </Button>
        </div>

        {/* Dynamic Risk Display */}
        <div className="bg-[#EAF1F2] rounded-[32px] p-8 mb-6 relative overflow-hidden shadow-sm border border-white">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#0A5D64]/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
             <span className="text-[14px] font-bold text-[#0A5D64] tracking-wide uppercase opacity-70">Personal Risk Score</span>
             <Info className="w-4 h-4 text-[#0A5D64]/50" />
          </div>
          <div className="flex justify-center mb-6 pt-2">
            <CircularProgress 
              value={riskData ? Math.round(riskData.mlProbability * 100) : 0} 
              text={riskData ? `${Math.round(riskData.mlProbability * 100)}%` : '--'} 
              subtext={riskData?.overallRisk || '...'} 
              size={130} 
              strokeWidth={10} 
              color={riskData?.overallRisk === 'LOW' ? '#10B981' : riskData?.overallRisk === 'MODERATE' ? '#F59E0B' : '#EF4444'} 
              backgroundColor="#D1E0E1" 
            />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
            <p className="text-[13px] text-[#64748B] mb-0.5">Outdoor Air Quality</p>
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-4">
              {riskData?.overallRisk === 'LOW' ? 'Excellent conditions today' : 
               riskData?.overallRisk === 'MODERATE' ? 'Moderate conditions detected' : 
               'High risk - exercise caution'}
            </h3>
            <Wind className="absolute right-5 top-5 w-6 h-6 text-[#0A5D64]" />
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
               <span className="text-[12px] text-[#475569]">Based on current location in {riskData?.location || 'Accra'}</span>
               <Button 
                 variant="secondary" 
                 onClick={() => navigate('/insights')}
                 className="h-8 px-4 text-[12px] font-bold bg-[#EAF1F2] text-[#0A5D64] hover:bg-[#D1E0E1]"
               >
                 Details
               </Button>
            </div>
          </div>
        </div>

        {/* Smart Recommendations Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
             <h4 className="text-[16px] font-bold text-slate-900">Today's Recommendations</h4>
             <ShieldCheck className="w-5 h-5 text-[#0A5D64]" />
          </div>
          <div className="space-y-3">
             {riskData?.advice?.actions?.length > 0 ? (
               riskData.advice.actions.map((action: string, idx: number) => (
                 <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F2] flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-5 h-5 text-[#0A5D64]" />
                    </div>
                    <p className="text-[14px] text-slate-600 font-medium leading-tight">{action}</p>
                 </div>
               ))
             ) : (
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-[#EAF1F2] flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-[#0A5D64]" />
                 </div>
                 <p className="text-[14px] text-slate-600 font-medium">Enjoy your day! Conditions are stable.</p>
               </div>
             )}
          </div>
        </div>

        {/* Weekly Trend Preview */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4 px-1">
              <h4 className="text-[16px] font-bold text-slate-900">Weekly Forecast</h4>
              <button onClick={() => navigate('/insights')} className="text-[12px] font-bold text-[#0A5D64] flex items-center gap-0.5">
                 VIEW CHART <ChevronRight className="w-4 h-4" />
              </button>
           </div>
           <div className="flex justify-between bg-white p-6 rounded-[32px] shadow-sm border border-slate-50">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                     weeklyData[i]?.risk_level === 'HIGH' ? 'bg-red-100 text-red-600' : 
                     weeklyData[i]?.risk_level === 'MODERATE' ? 'bg-orange-100 text-orange-600' :
                     'bg-[#EAF1F2] text-[#0A5D64]'
                   }`}>
                      {day}
                   </div>
                   <div className={`w-1.5 rounded-full ${
                     weeklyData[i]?.risk_level === 'HIGH' ? 'h-8 bg-red-400' : 
                     weeklyData[i]?.risk_level === 'MODERATE' ? 'h-6 bg-orange-300' :
                     'h-4 bg-[#0A5D64]/40'
                   }`}></div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for CheckCircle2 (missing in imports in original but used in loop)
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default HomeDashboard;

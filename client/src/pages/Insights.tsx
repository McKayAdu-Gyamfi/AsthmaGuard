import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MapPin, TrendingUp, Calendar, Clock, Activity, Wind, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@/components/CircularProgress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Insights = () => {
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsightsData = async (lat?: number, lon?: number) => {
      try {
        const queryParams = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
        const [riskRes, weeklyRes] = await Promise.all([
          fetch(`/api/v1/risk${queryParams}`),
          fetch('/api/v1/history/weekly')
        ]);

        if (riskRes.ok) {
          const risk = await riskRes.json();
          if (risk.success) setRiskData(risk.data);
        }

        if (weeklyRes.ok) {
          const weekly = await weeklyRes.json();
          if (weekly.success) setWeeklyData(weekly.data);
        }
      } catch (error) {
        console.error('Insights fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchInsightsData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchInsightsData(); // Fallback to default
        }
      );
    } else {
      fetchInsightsData();
    }
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Map weekly data to chart format
  const trendData = days.map((day, i) => ({
    day,
    value: weeklyData[i]?.risk_score || 20,
    risk: weeklyData[i]?.risk_level?.toLowerCase() || 'low'
  }));

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="w-9 h-9" />
        <h1 className="text-[20px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Environmental Insights
        </h1>
        <button className="p-2 -mr-2 text-slate-800 relative" onClick={() => navigate('/alerts-history')}>
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
        {/* Current Status Overview */}
        <div className="flex flex-col items-center mb-10">
           <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E8EFF0] border border-[#D1E0E1] text-[#2F5E60] text-sm font-bold mb-8 shadow-sm">
             <MapPin className="w-3.5 h-3.5 fill-current" />
             {riskData?.location || 'Accra, Ghana'}
           </div>

           <div className="relative mb-2">
             <CircularProgress 
               value={riskData ? Math.round(riskData.mlProbability * 100) : 0} 
               text={riskData ? `${Math.round(riskData.mlProbability * 100)}` : '--'} 
               subtext={riskData?.overallRisk || '...'} 
               size={180} 
               strokeWidth={14} 
               color={riskData?.overallRisk === 'LOW' ? '#10B981' : riskData?.overallRisk === 'MODERATE' ? '#F59E0B' : '#EF4444'} 
               backgroundColor="#F1F5F9" 
             />
           </div>
           <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mt-4">Current Risk Index</p>
        </div>

        {/* 7-Day Trend Chart */}
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white mb-6">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0A5D64]" />
                7-Day Trend
              </h3>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Risk History</span>
           </div>

           <div className="flex items-end justify-between h-40 gap-2 mb-6">
              {trendData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-3">
                   <div 
                     className={cn(
                       "w-full rounded-t-xl transition-all duration-500",
                       d.risk === 'high' ? "bg-red-400" : d.risk === 'moderate' ? "bg-orange-300" : "bg-[#0A5D64]"
                     )} 
                     style={{ height: `${Math.max(10, (d.value / 100) * 100)}%` }} 
                   />
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-400" />
                 <span className="text-[12px] font-bold text-slate-800">Status: <span className={riskData?.overallRisk === 'LOW' ? 'text-green-500' : 'text-orange-500'}>{riskData?.overallRisk || 'Loading...'}</span></span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
           </div>
        </Card>

        {/* Dynamic Environmental Factors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <Card className="p-5 rounded-[24px] border-none shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                 <Wind className="w-4 h-4 text-blue-500" />
                 <span className="text-[12px] font-bold text-slate-400 uppercase">Humidity</span>
              </div>
              <p className="text-[24px] font-bold text-slate-900">{riskData?.raw?.humidity || '--'}%</p>
           </Card>
           <Card className="p-5 rounded-[24px] border-none shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                 <Activity className="w-4 h-4 text-red-500" />
                 <span className="text-[12px] font-bold text-slate-400 uppercase">Temp</span>
              </div>
              <p className="text-[24px] font-bold text-slate-900">{riskData?.raw?.temperatureC || '--'}°C</p>
           </Card>
        </div>

        {/* Personalized Recommendations */}
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-[#0A5D64] text-white mb-6 relative overflow-hidden">
           <Info className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
           <div className="relative z-10">
              <h4 className="text-[14px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider">
                Recommendation
              </h4>
              <p className="text-[18px] font-bold leading-snug">
                {riskData?.advice?.summary || 'Analyzing environmental conditions for your specific profile...'}
              </p>
           </div>
        </Card>

        {/* Interactive Map Placeholder */}
        <div className="w-full h-40 bg-slate-200 rounded-[32px] overflow-hidden relative shadow-inner border border-white">
           <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] pointer-events-none"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                 <MapPin className="w-8 h-8 text-[#0A5D64] fill-white animate-bounce" />
                 <span className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Live Map View</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;

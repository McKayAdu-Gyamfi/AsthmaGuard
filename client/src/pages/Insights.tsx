import { ArrowLeft, Bell, MapPin, CheckCircle2, TrendingUp, Calendar, Clock, Activity, Wind, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@/components/CircularProgress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Insights = () => {
  const navigate = useNavigate();

  const trendData = [
    { day: 'Mon', value: 45, risk: 'low' },
    { day: 'Tue', value: 52, risk: 'low' },
    { day: 'Wed', value: 110, risk: 'high' },
    { day: 'Thu', value: 85, risk: 'moderate' },
    { day: 'Fri', value: 140, risk: 'high' },
    { day: 'Sat', value: 60, risk: 'moderate' },
    { day: 'Sun', value: 38, risk: 'low' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="w-9 h-9" />
        <h1 className="text-[20px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Environmental Insights
        </h1>
        <button className="p-2 -mr-2 text-slate-800 relative">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
        {/* Current Status Overview */}
        <div className="flex flex-col items-center mb-10">
           <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E8EFF0] border border-[#D1E0E1] text-[#2F5E60] text-sm font-bold mb-8 shadow-sm">
             <MapPin className="w-3.5 h-3.5 fill-current" />
             Accra, Ghana
           </div>

           <div className="relative mb-2">
             <CircularProgress 
               value={42} 
               text="42" 
               subtext="Good" 
               size={180} 
               strokeWidth={14} 
               color="#2F5E60" 
               backgroundColor="#F1F5F9" 
             />
           </div>
           <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mt-4">Current AQI Index</p>
        </div>

        {/* 7-Day Trend Chart (Screen 10 requirement) */}
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
                     style={{ height: `${(d.value / 150) * 100}%` }} 
                   />
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-400" />
                 <span className="text-[12px] font-bold text-slate-800">Worst Day: <span className="text-red-500">Friday</span></span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
           </div>
        </Card>

        {/* Best Time of Day (Screen 10 requirement) */}
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-[#0A5D64] text-white mb-6 relative overflow-hidden">
           <Clock className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
           <div className="relative z-10">
              <h4 className="text-[14px] font-bold mb-4 flex items-center gap-2 opacity-80 uppercase tracking-wider">
                Best time to go out
              </h4>
              <div className="flex items-center gap-6">
                 <div>
                    <p className="text-[32px] font-bold">06:00 AM</p>
                    <p className="text-[13px] opacity-70">Lowest pollen & pollution</p>
                 </div>
                 <div className="h-10 w-px bg-white/20" />
                 <div>
                    <p className="text-[32px] font-bold">08:00 PM</p>
                    <p className="text-[13px] opacity-70">Cool evening air</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Correlation: Symptoms vs AQI (Screen 10 requirement) */}
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white mb-6">
           <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5 text-[#E0633C]" />
             Symptom Correlation
           </h3>
           <div className="space-y-5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-orange-500" />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between mb-1">
                       <span className="text-[13px] font-bold text-slate-800">AQI Correlation</span>
                       <span className="text-[13px] font-bold text-orange-500">High (0.82)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500 w-[82%]" />
                    </div>
                 </div>
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                Your logs show a strong link between high AQI days and wheezing episodes. Avoid the city center on 'Red' alert days.
              </p>
           </div>
        </Card>

        {/* Map Placeholder/Preview */}
        <div className="w-full h-40 bg-slate-200 rounded-[32px] overflow-hidden relative shadow-inner border border-white">
           <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] pointer-events-none"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                 <MapPin className="w-8 h-8 text-[#0A5D64] fill-white animate-bounce" />
                 <span className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Interactive Map</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;

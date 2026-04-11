import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';

const RiskAlert = () => {
  const navigate = useNavigate();

  // Simple countdown timer logic
  const [timeLeft, setTimeLeft] = useState(3 * 3600 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n) => n.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-4">
        <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Risk Alert
        </h1>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-4">
        
        {/* Banner with Cityscape Background approximation */}
        <div className="w-full aspect-[2/1] rounded-2xl mb-8 relative overflow-hidden bg-gradient-to-br from-[#F5D7D1] via-[#E4BDB2] to-[#CAA096] shadow-sm">
           {/* Faux cityscape back */}
           <div className="absolute inset-x-0 bottom-0 top-1/3 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiPjxyZWN0IHg9IjEwIiB5PSIyMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIi8+PHJlY3QgeD0iMzAiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iNDAiLz48cmVjdCB4PSI2MCIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIyNSIvPjxyZWN0IHg9IjgwIiB5PSI1IiB3aWR0aD0iMTIiIGhlaWdodD0iNDUiLz48L3N2Zz4=')] bg-repeat-x bg-bottom bg-[length:120px_120px]"></div>
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-[#303E48]">
              <AlertTriangle className="w-10 h-10 text-[#E85B5B] fill-white mb-2 shadow-sm" />
              <h2 className="text-[24px] font-bold mb-1 tracking-tight">Moderate Risk Alert</h2>
              <p className="text-[13px] opacity-80">Conditions are changing in your area</p>
           </div>
        </div>

        {/* Countdown Timer */}
        <p className="text-center text-[13px] text-slate-500 font-medium mb-3">Risk peak expected in:</p>
        <div className="flex gap-3 mb-10 w-full justify-center px-4">
          <div className="flex-1 max-w-[90px] bg-[#E8F1F2] rounded-xl flex flex-col items-center justify-center py-4 border border-[#D5E4E6] shadow-sm">
            <span className="text-[28px] font-bold text-[#0A5D64] leading-tight font-mono">{pad(hours)}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1">HOURS</span>
          </div>
          <div className="flex-1 max-w-[90px] bg-[#E8F1F2] rounded-xl flex flex-col items-center justify-center py-4 border border-[#D5E4E6] shadow-sm">
            <span className="text-[28px] font-bold text-[#0A5D64] leading-tight font-mono">{pad(minutes)}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1">MINUTES</span>
          </div>
          <div className="flex-1 max-w-[90px] bg-[#E8F1F2] rounded-xl flex flex-col items-center justify-center py-4 border border-[#D5E4E6] shadow-sm">
            <span className="text-[28px] font-bold text-[#0A5D64] leading-tight font-mono">{pad(seconds)}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1">SECONDS</span>
          </div>
        </div>

        {/* Observed Triggers */}
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">OBSERVED TRIGGERS</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
           <Card className="p-4 rounded-2xl border-none shadow-sm flex flex-col items-center text-center">
             <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-2">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/><path d="M14 2h4"/><path d="M14 6h3"/></svg>
             </div>
             <p className="text-[11px] text-slate-500 mb-1">Temperature</p>
             <p className="text-[15px] font-bold text-slate-900">Rising (+4°C)</p>
           </Card>
           <Card className="p-4 rounded-2xl border-none shadow-sm flex flex-col items-center text-center">
             <div className="w-8 h-8 rounded-full bg-[#Eaf1f2] flex items-center justify-center mb-2">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 10h-2"/><path d="M15 10H9"/><path d="M5 10H3"/><path d="M19 14h-2"/><path d="M15 14H9"/><path d="M5 14H3"/><path d="M19 18h-2"/><path d="M15 18H9"/><path d="M5 18H3"/></svg>
             </div>
             <p className="text-[11px] text-slate-500 mb-1">Pollution (AQI)</p>
             <p className="text-[15px] font-bold text-slate-900">Unhealthy (112)</p>
           </Card>
        </div>

        {/* Smart Recommendations */}
        <Card className="bg-[#EAF1F2] border-[#D1E0E1] rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A5D64" stroke="#0A5D64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 1 0 5 5c0 2-2.5 3-3 4H10c-.5-1-3-2-3-4a5 5 0 0 1 5-5z"/></svg>
            <h3 className="font-bold text-[#0A5D64] text-[15px]">Smart Recommendations</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#0A5D64] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">Limit intense outdoor activities between <span className="font-bold">2:00 PM and 5:00 PM</span>.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#0A5D64] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">Keep your <span className="font-bold text-[#EF4444]">rescue inhaler</span> within immediate reach.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#0A5D64] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">Close windows to prevent outdoor pollutants from entering your home.</p>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full h-14 bg-[#326062] hover:bg-[#254A4C] text-white text-[15px] font-semibold rounded-xl">
            Remind Me Later
          </Button>
          <Button variant="outline" className="w-full h-14 bg-white border-slate-200 text-[#475569] text-[15px] font-semibold rounded-xl">
            Dismiss Alert
          </Button>
        </div>

      </div>

      <BottomNav items={['Home', 'Alerts', 'History', 'Profile']} />
    </div>
  );
};

export default RiskAlert;

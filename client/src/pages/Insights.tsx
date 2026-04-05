import React from 'react';
import { ArrowLeft, Bell, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@/components/CircularProgress';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';

const Insights = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F8F9] to-white flex flex-col relative pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Breathe Easy Insights
        </h1>
        <button className="p-2 -mr-2 text-slate-800 relative">
          <Bell className="w-5 h-5 fill-current" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 flex flex-col items-center">
        {/* Location Chip */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E8EFF0] border border-[#D1E0E1] text-[#2F5E60] text-sm font-medium mb-8">
          <MapPin className="w-3.5 h-3.5 fill-current" />
          Accra, Ghana
        </div>

        {/* Circular Ring Gauge */}
        <div className="relative mb-8">
          <CircularProgress 
            value={42} 
            text="42" 
            subtext="Good" 
            size={190} 
            strokeWidth={12} 
            color="#2F5E60" 
            backgroundColor="#F2F6F7" 
          />
        </div>

        {/* Metric Cards grid */}
        <div className="w-full grid grid-cols-1 gap-4 mb-4">
          <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#2F5E60]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14a2 2 0 1 0 0-4m16 8a2 2 0 1 1 0-4M2 8a2 2 0 1 0 0-4m18 8a2 2 0 1 0 0-4" />
                  <path d="M22 14c-2 0-3-2-3-2M4 6c0 0 1-2 3-2M4 14c0 0 1 2 3 2M22 6c-2 0-3 2-3 2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="4" x2="16" y2="4" />
                  <line x1="8" y1="20" x2="16" y2="20" />
                </svg>
                <span className="font-semibold text-slate-800 text-[15px]">Air Quality Index</span>
              </div>
              <span className="text-slate-500 text-sm">42/100</span>
            </div>
            {/* Horizontal progress bar matching the screenshot */}
            <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#356566] w-[42%] rounded-full"></div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Air quality is satisfactory, and air pollution poses little or no risk.
            </p>
          </Card>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mb-4">
          {/* Temperature */}
          <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 relative overflow-hidden">
            <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-[#22C55E] fill-white" />
            <div className="mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#2F5E60]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                <path d="M14 9A4 4 0 0 0 14 1" />
                <path d="M14 5A2 2 0 0 0 14 1" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-500 mb-0.5">Temperature</p>
            <p className="text-[20px] font-bold text-slate-900">24°C</p>
          </Card>

          {/* Humidity */}
          <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 relative overflow-hidden">
            <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-[#22C55E] fill-white" />
            <div className="mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#2F5E60] fill-current" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-500 mb-0.5">Humidity</p>
            <p className="text-[20px] font-bold text-slate-900">45%</p>
          </Card>

          {/* Pollen Count */}
          <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 relative overflow-hidden">
            <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-[#22C55E] fill-white" />
            <div className="mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#2F5E60] fill-current" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M16 16c2 0 3-1 3-3" />
                <path d="M8 8c-2 0-3 1-3 3" />
                <path d="M16 8c2 0 3 1 3 3" />
                <path d="M8 16c-2 0-3-1-3-3" />
                <path d="M12 4v4" />
                <path d="M12 16v4" />
                <path d="M4 12h4" />
                <path d="M16 12h4" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-500 mb-0.5">Pollen Count</p>
            <p className="text-[20px] font-bold text-slate-900">Low</p>
          </Card>

          {/* Pollution */}
          <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 relative overflow-hidden">
            <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-[#22C55E] fill-white" />
            <div className="mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-[#2F5E60] fill-current" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 10h-2" />
                <path d="M15 10H9" />
                <path d="M5 10H3" />
                <path d="M19 6h-2" />
                <path d="M15 6H9" />
                <path d="M5 6H3" />
                <path d="M19 14h-2" />
                <path d="M15 14H9" />
                <path d="M5 14H3" />
                <path d="M19 18h-2" />
                <path d="M15 18H9" />
                <path d="M5 18H3" />
                <path d="M3 2v20h18V2z" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-500 mb-0.5">Pollution</p>
            <p className="text-[20px] font-bold text-slate-900">Low</p>
          </Card>
        </div>

        {/* Map preview */}
        <div className="w-full h-32 bg-[#D1DFE1] rounded-2xl overflow-hidden relative border border-[#E2E8F0]">
           {/* Faux map background logic */}
           <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPHBhdGggZD0iTTAgMGwyMCAyMHpNMCUyMGwwIDIwek0yMCwwbDAlMjAwaDIweiIgc3Ryb2tlPSIjZmZmIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] z-0 bg-cover"></div>
           <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-10 bg-[#2F5E60] rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-none transform rotate-45 flex items-center justify-center shadow-md">
                <div className="w-2.5 h-2.5 bg-white rounded-full transform -rotate-45 mb-1" />
              </div>
           </div>
        </div>

      </div>
      <BottomNav items={['Insights', 'Plan', 'Map', 'Profile']} />
    </div>
  );
};

export default Insights;

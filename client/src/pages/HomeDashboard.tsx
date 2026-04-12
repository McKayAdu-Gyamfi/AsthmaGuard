import React from 'react';
import { Bell, Activity, AlertCircle, Wind, Thermometer, Droplets, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/CircularProgress';
import { BottomNav } from '@/components/BottomNav';

const HomeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F8F9] to-white flex flex-col relative pb-24 font-sans">
      
      {/* Header Profile Section */}
      <div className="flex items-center justify-between px-6 py-5 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#D1E0E1]">
             {/* Mock avatar from SVG */}
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect width="100" height="100" fill="#E8D1C5"/>
               {/* hair */}
               <path d="M50 15C30 15 20 35 25 60C30 85 70 85 75 60C80 35 70 15 50 15Z" fill="#1e293b"/>
               {/* face */}
               <circle cx="50" cy="50" r="22" fill="#FCE7D9"/>
             </svg>
          </div>
          <div>
            <p className="text-[13px] text-[#475569]">Tuesday, Oct 24</p>
            <h1 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Good Morning, Sarah</h1>
          </div>
        </div>
        <button className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 relative">
          <Bell className="w-5 h-5 fill-slate-700" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></div>
        </button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-4">
        {/* Quick Actions Base */}
        <div className="flex gap-3 mb-6">
          <Button 
            className="flex-1 h-14 bg-[#0A5D64] hover:bg-[#07474E] text-white font-semibold rounded-xl text-[15px] shadow-sm flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Track Symptoms
          </Button>
          <Button 
            onClick={() => navigate('/astma-attack')}
            className="flex-1 h-14 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] font-bold rounded-xl text-[15px] shadow-sm flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            Emergency
          </Button>
        </div>

        {/* Big Air Quality Card */}
        <div className="bg-[#EAF1F2] rounded-3xl p-6 mb-6">
          <div className="flex justify-center mb-6 pt-2">
            <CircularProgress 
              value={85} 
              text="85%" 
              subtext="Good" 
              size={130} 
              strokeWidth={10} 
              color="#0A5D64" 
              backgroundColor="#D1E0E1" 
            />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
            <p className="text-[13px] text-[#64748B] mb-0.5">Outdoor Air Quality</p>
            <h3 className="text-[17px] font-bold text-[#0F172A] mb-4">Excellent conditions today</h3>
            <Wind className="absolute right-5 top-5 w-6 h-6 text-[#0A5D64]" />
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
               <span className="text-[12px] text-[#475569]">Based on your current location in Seattle</span>
               <Button variant="secondary" className="h-8 px-4 text-[12px] font-bold bg-[#EAF1F2] text-[#0A5D64] hover:bg-[#D1E0E1]">Details</Button>
            </div>
          </div>
        </div>

        {/* Small Metrics grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="rounded-2xl border-none shadow-sm p-4 relative bg-white">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-[11px] font-semibold text-slate-400">TEMP</span>
            </div>
            <p className="text-[22px] font-bold text-slate-900 mb-0.5">24°C</p>
            <p className="text-[12px] text-slate-500">Indoor Comfort</p>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm p-4 relative bg-white">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-[11px] font-semibold text-slate-400">HUMIDITY</span>
            </div>
            <p className="text-[22px] font-bold text-slate-900 mb-0.5">45%</p>
            <p className="text-[12px] text-slate-500">Optimal Level</p>
          </Card>
        </div>

        {/* Risk Level Banner */}
        <Card className="rounded-3xl border-none shadow-sm p-5 mb-6 bg-white flex items-center justify-between gap-4">
           <div>
             <div className="flex items-center gap-2 mb-2">
               <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
               <h4 className="text-[15px] font-bold text-slate-900 tracking-wide">LOW RISK (15%)</h4>
             </div>
             <p className="text-[13px] text-slate-500 leading-relaxed max-w-[240px]">
               Your personalized asthma trigger risk is currently low. Great day for outdoor activities!
             </p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-[#EAF1F2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0A5D64]" />
           </div>
        </Card>

        {/* Weekly Progress */}
        <Card className="rounded-3xl border-none shadow-sm p-5 mb-2 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[16px] font-bold text-slate-900">Weekly Progress</h4>
            <button className="text-[12px] font-bold text-[#0A5D64]">View Trends</button>
          </div>
          
          <div className="flex items-end justify-between h-[100px] gap-2">
            {[
              { day: 'MON', h: '30%', color: 'bg-slate-100' },
              { day: 'TUE', h: '40%', color: 'bg-slate-100' },
              { day: 'WED', h: '25%', color: 'bg-[#82A8A9]' },
              { day: 'THU', h: '35%', color: 'bg-[#679697]' },
              { day: 'FRI', h: '55%', color: 'bg-[#0A5D64]' },
              { day: 'SAT', h: '45%', color: 'bg-[#3C7B7C]' },
              { day: 'SUN', h: '65%', color: 'bg-[#0A5D64]' }
            ].map(col => (
              <div key={col.day} className="flex flex-col items-center gap-3 flex-1">
                 <div className={`w-full ${col.color} rounded-sm transition-all`} style={{ height: col.h }}></div>
                 <span className="text-[10px] font-semibold text-slate-400">{col.day}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
      <BottomNav items={['Home', 'Insights', 'Community', 'Profile']} />
    </div>
  );
};

export default HomeDashboard;

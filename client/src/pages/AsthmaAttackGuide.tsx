import React from 'react';
import { X, Mic, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AsthmaAttackGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative">
      {/* Top Header */}
      <div className="flex items-center justify-center px-6 pt-6 pb-6 relative">
        <button className="absolute left-6 p-2 -ml-2" onClick={() => navigate(-1)}>
          <X className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[16px] font-bold text-slate-900 tracking-wider">
          ASTHMA ATTACK GUIDE
        </h1>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-[#2F5E60]"></div>
        <div className="w-2 h-2 rounded-full bg-[#CEDEE0]"></div>
        <div className="w-2 h-2 rounded-full bg-[#CEDEE0]"></div>
        <div className="w-2 h-2 rounded-full bg-[#CEDEE0]"></div>
        <div className="w-2 h-2 rounded-full bg-[#CEDEE0]"></div>
        <div className="w-2 h-2 rounded-full bg-[#CEDEE0]"></div>
      </div>

      <div className="px-6 flex flex-col flex-1 pb-8">
        {/* Step Progress Top */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-bold shadow-sm text-slate-900">Tackling Asthma</span>
          <span className="text-[14px] font-medium text-slate-500 tracking-widest">Step 1 of 6</span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-[#E2E8F0] rounded-full mb-8 relative overflow-hidden border border-[#D1DFE1]">
          <div className="absolute top-0 left-0 h-full w-[16.6%] bg-[#2F5E60] rounded-full"></div>
        </div>

        {/* Big Illustration Card */}
        <div className="w-full aspect-[4/3] bg-[#7D9E8F] rounded-xl flex items-center justify-center mb-8 shadow-sm border border-slate-200/50">
          <svg viewBox="0 0 200 150" className="w-[140px] h-[105px]">
            {/* Table */}
            <rect x="25" y="110" width="150" height="10" rx="3" fill="#678A7A" />
            {/* Person Head */}
            <circle cx="100" cy="50" r="15" fill="#F4D9C3" />
            {/* Person Torso / Shoulders supported on table */}
            <path d="M48 110C48 85 70 65 100 65C130 65 152 85 152 110" fill="#F4D9C3" />
            <path d="M50 110 L55 100 L65 100 L70 110 Z" fill="#2d3748" /> {/* left hand */}
            <path d="M130 110 L135 100 L145 100 L150 110 Z" fill="#2d3748" /> {/* right hand */}
          </svg>
        </div>

        <h2 className="text-[28px] font-bold text-[#0F172A] text-center uppercase mb-4 tracking-tighter">
          Help them sit upright
        </h2>
        
        <p className="text-[17px] text-[#475569] text-center leading-relaxed mb-8">
          Gently help the person sit in an upright position with arms supported on a table. This makes breathing easier.
        </p>

        <div className="mt-auto space-y-4">
          <Button 
            className="w-full h-14 bg-[#E8EFF1] hover:bg-[#D5E4E6] text-[#2F5E60] font-semibold text-[15px] rounded-xl flex gap-2 border border-[#CEDEE0]"
          >
            <Mic className="w-4 h-4 fill-current" />
            VOICE GUIDE
          </Button>

          <div className="flex gap-4">
            <Button 
              className="flex-1 h-14 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-500 font-semibold text-[15px] rounded-xl"
            >
              BACK
            </Button>
            <Button 
              className="flex-1 h-14 bg-[#2F5E60] hover:bg-[#254A4C] text-white font-semibold text-[15px] rounded-xl shadow-md"
            >
              NEXT STEP
            </Button>
          </div>

          <Button 
            className="w-full h-16 bg-[#F49999] hover:bg-[#E58888] text-white font-bold text-[17px] rounded-xl shadow-md flex gap-2 tracking-wide mt-4"
          >
            <AlertCircle className="w-5 h-5 fill-current" />
            CALL EMERGENCY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AsthmaAttackGuide;

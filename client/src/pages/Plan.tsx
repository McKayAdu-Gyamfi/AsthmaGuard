import React from 'react';

const Plan = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center text-center max-w-lg mx-auto mt-10">
      <div className="w-20 h-20 bg-[#EAF1F2] rounded-full flex items-center justify-center mb-6">
         <span className="text-3xl text-[#0A5D64]">📅</span>
      </div>
      <h2 className="text-[22px] font-bold text-slate-800 mb-3">Your Asthma Care Plan</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Stay on top of your medications and upcoming appointments to keep your breathing under control.
      </p>
      <button className="bg-[#0A5D64] hover:bg-[#07474E] text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition-colors">
        Create New Plan
      </button>
    </div>
  );
};

export default Plan;

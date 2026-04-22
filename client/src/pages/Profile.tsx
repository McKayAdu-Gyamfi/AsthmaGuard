import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Robert Foxer',
    condition: 'Chronic Asthma Sufferer'
  });
  
  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 relative border border-slate-100 shadow-sm mt-4">
       
       <div className="flex justify-between items-center mb-10">
         <h2 className="text-[20px] font-bold text-[#0F172A]">Patient Details</h2>
         {!isEditing ? (
           <button 
             onClick={() => setIsEditing(true)}
             className="w-10 h-10 rounded-full bg-[#EAF1F2] text-[#0A5D64] hover:bg-[#D1E0E1] flex items-center justify-center transition-colors"
           >
             <Edit2 className="w-4 h-4" />
           </button>
         ) : (
           <div className="flex gap-2">
             <button 
               onClick={handleCancel}
               className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
             <button 
               onClick={handleSave}
               className="w-10 h-10 rounded-full bg-[#0A5D64] text-white hover:bg-[#07474E] flex items-center justify-center transition-colors shadow-sm"
             >
               <Check className="w-5 h-5" />
             </button>
           </div>
         )}
       </div>

       <div className="flex flex-col items-center mb-10 pt-4">
         {/* Avatar with primary color background */}
         <div className="w-24 h-24 rounded-full bg-[#D1E0E1] flex items-center justify-center mb-5 relative shadow-inner border-2 border-white">
           <div className="w-20 h-20 rounded-full bg-[#E5BDBA] overflow-hidden shadow-sm">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20C30 20 20 40 25 65C30 90 70 90 75 65C80 40 70 20 50 20Z" fill="#2E1A11"/>
                <circle cx="50" cy="55" r="22" fill="#FCE7D9"/>
                {/* primary colored shirt */}
                <path d="M30 100 L30 85 C30 75 70 75 70 85 L70 100 Z" fill="#0A5D64"/>
                <path d="M45 85 L45 100 L55 100 L55 85 Z" fill="#FCE7D9"/>
              </svg>
           </div>
         </div>
         
         {isEditing ? (
           <div className="w-full flex flex-col gap-3 px-4">
             <Input 
               value={tempData.name}
               onChange={(e) => setTempData({...tempData, name: e.target.value})}
               className="text-center font-bold text-lg bg-[#F6F8F9] border-transparent"
               placeholder="Full Name"
             />
             <Input 
               value={tempData.condition}
               onChange={(e) => setTempData({...tempData, condition: e.target.value})}
               className="text-center text-sm font-medium text-slate-500 bg-[#F6F8F9] border-transparent"
               placeholder="Medical Condition"
             />
           </div>
         ) : (
           <>
             <h3 className="text-[24px] font-bold text-[#0F172A] mb-1">{profileData.name}</h3>
             <p className="text-[14px] text-slate-500 font-medium">{profileData.condition}</p>
           </>
         )}
       </div>

       {/* Upcoming Schedule Blocks */}
       <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <div className="flex-1 bg-[#EAF1F2] rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-md">
             <div className="flex gap-2 items-baseline mb-4 relative z-10">
               <span className="text-[22px] font-bold text-[#0A5D64]">04</span>
               <span className="text-[13px] font-bold text-[#2F5E60]">Tuesday</span>
             </div>
             <div className="flex gap-3 mb-5 relative z-10">
               <span className="text-[#0A5D64] text-[18px] leading-none mt-0.5">-</span>
               <p className="text-[15px] font-bold text-[#0F172A] leading-tight">Periodic<br/>Inspection</p>
             </div>
             <button className="text-[12px] font-bold text-[#0A5D64] relative z-10 hover:underline flex items-center gap-1">
               See Details
             </button>
             {/* Decorative background shape */}
             <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/40 rounded-full"></div>
          </div>

          <div className="flex-1 bg-[#F1F5F9] rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-md">
             <div className="flex gap-2 items-baseline mb-4 relative z-10">
               <span className="text-[22px] font-bold text-[#0F172A]">07</span>
               <span className="text-[13px] font-bold text-slate-500">Friday</span>
             </div>
             <div className="flex gap-3 mb-5 relative z-10">
               <span className="text-slate-400 text-[18px] leading-none mt-0.5">-</span>
               <p className="text-[15px] font-bold text-[#0F172A] leading-tight">Pulmonary<br/>Test</p>
             </div>
             <button className="text-[12px] font-bold text-slate-500 relative z-10 hover:underline flex items-center gap-1">
               See Details
             </button>
          </div>
       </div>

       {/* Mental Analysis Chart */}
       <div>
          <h3 className="text-[17px] font-bold text-[#0F172A] mb-8">Weekly Symptom Stability</h3>
          
          <div className="flex gap-5 justify-end items-center mb-6 text-[12px] font-semibold text-slate-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A5D64] rounded-sm"></div> Stable</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#D1E0E1] rounded-sm"></div> Uncontrollable</div>
          </div>

          <div className="h-[160px] flex items-end justify-between px-2 gap-4">
            {/* Y Axis */}
            <div className="h-full flex flex-col justify-between items-end text-[12px] font-bold text-slate-400 py-1 mr-2 opacity-50">
               <span>100</span><span>50</span><span>0</span>
            </div>
            
            {/* Bars */}
            {[
              { label: 'Week 1', stable: '30%', unc: '70%' },
              { label: 'Week 2', stable: '55%', unc: '45%' },
              { label: 'Week 3', stable: '75%', unc: '25%' },
              { label: 'Week 4', stable: '90%', unc: '10%' }
            ].map(item => (
              <div key={item.label} className="flex-1 flex flex-col items-center">
                 <div className="flex items-end gap-1.5 w-full justify-center h-full pb-3">
                    <div className="w-[16px] bg-[#0A5D64] rounded-t-md transition-all hover:opacity-80" style={{ height: item.stable }}></div>
                    <div className="w-[16px] bg-[#D1E0E1] rounded-t-md transition-all hover:opacity-80" style={{ height: item.unc }}></div>
                 </div>
                 <span className="text-[12px] font-bold text-slate-400 mt-2">{item.label}</span>
              </div>
            ))}
          </div>
       </div>

    </div>
  );
};

export default Profile;

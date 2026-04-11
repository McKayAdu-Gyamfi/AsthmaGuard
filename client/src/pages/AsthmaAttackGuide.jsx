import { X, Mic, AlertCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AsthmaAttackGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 flex flex-col relative font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-6 relative">
        <button 
          className="p-3 bg-white hover:bg-slate-100 rounded-full shadow-sm z-10" 
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <X className="w-8 h-8 text-slate-800" />
        </button>
        <h1 className="text-[20px] font-bold text-red-700 tracking-wider absolute w-full text-center left-0 z-0">
          EMERGENCY GUIDE
        </h1>
      </div>

      <div className="px-6 flex flex-col flex-1 pb-8 justify-center">
        {/* Big Warning Tag */}
        <div className="flex items-center justify-center mb-6">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-[22px] tracking-widest flex items-center gap-2">
                <AlertCircle className="w-6 h-6 fill-red-800 text-white" />
                ASTHMA ATTACK
            </span>
        </div>

        {/* Action Directives */}
        <h2 className="text-[42px] font-black text-slate-900 text-center uppercase mb-6 leading-tight tracking-tighter">
          Help Them Sit Upright
        </h2>
        
        <p className="text-[24px] font-bold text-slate-700 text-center leading-snug mb-10 bg-white/60 p-6 rounded-2xl border border-red-100 shadow-sm">
          Gently help the person sit upright and lean completely forward on a table.<br/><br/>Loosen any tight clothing.
        </p>

        {/* Emergency Call Button */}
        <div className="mt-auto flex flex-col gap-4">
          <a href="tel:193" className="w-full">
            <Button 
                className="w-full h-24 bg-red-600 hover:bg-red-700 text-white font-black text-[32px] rounded-2xl shadow-xl flex gap-4 animate-pulse border-4 border-red-200"
            >
                <Phone className="w-10 h-10 fill-current" />
                CALL 193
            </Button>
          </a>
          <p className="text-center font-bold text-red-800 text-[18px]">Ghana Emergency Ambulance</p>

          <div className="flex gap-4 mt-8">
            <Button 
              className="flex-1 h-20 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-[22px] rounded-xl"
            >
              PREV
            </Button>
            <Button 
              className="flex-1 h-20 bg-[#2F5E60] hover:bg-[#254A4C] text-white font-black text-[22px] rounded-xl shadow-md"
            >
              NEXT STEP
            </Button>
          </div>
          
          <Button 
            className="w-full h-16 bg-white hover:bg-slate-100 text-[#2F5E60] font-black text-[20px] rounded-xl border-2 border-[#2F5E60] mt-4 flex gap-3 shadow-sm"
          >
            <Mic className="w-6 h-6 fill-current" />
            PLAY AUDIO INSTRUCTIONS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AsthmaAttackGuide;

import { useState, useEffect } from 'react';
import { X, Mic, AlertCircle, ChevronRight, ChevronLeft, Phone, BellRing, Play, Pause, RefreshCw, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 1,
    title: "Stay calm and sit upright",
    description: "Lean slightly forward with hands on knees. Do NOT lie down — upright position opens the airways. Take slow, steady breaths.",
    instruction: "Sit up straight",
    timer: null,
    illustration: (
      <svg viewBox="0 0 200 150" className="w-[140px] h-[105px]">
        <rect x="25" y="110" width="150" height="10" rx="3" fill="#678A7A" />
        <circle cx="100" cy="50" r="15" fill="#F4D9C3" />
        <path d="M48 110C48 85 70 65 100 65C130 65 152 85 152 110" fill="#F4D9C3" />
        <path d="M50 110 L55 100 L65 100 L70 110 Z" fill="#2d3748" />
        <path d="M130 110 L135 100 L145 100 L150 110 Z" fill="#2d3748" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Use your reliever inhaler",
    description: "Take 1 puff of your blue reliever (e.g. Salbutamol). Wait 60 seconds. Repeat up to 10 puffs if needed.",
    instruction: "1 puff every 60 seconds",
    timer: 60,
    illustration: (
      <svg viewBox="0 0 200 150" className="w-[140px] h-[105px]">
         <rect x="80" y="40" width="40" height="70" rx="5" fill="#3B82F6" />
         <rect x="75" y="100" width="50" height="20" rx="4" fill="#1D4ED8" />
         <circle cx="100" cy="30" r="8" fill="#DBEAFE" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Controlled breathing",
    description: "Breathe in through nose for 4 seconds — hold 2 seconds — breathe out through pursed lips for 6 seconds.",
    instruction: "Follow the animation",
    timer: 120, // 2 minutes
    illustration: (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-white/20 animate-ping" />
        <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center animate-pulse">
           <div className="w-16 h-16 rounded-full bg-white/50" />
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Call emergency services",
    description: "If there is no improvement after 15 minutes or 10 puffs — call immediately. Stay calm, help is on the way.",
    instruction: "Dial 193 or 112",
    timer: null,
    illustration: (
       <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-bounce">
         <Phone className="w-12 h-12 text-red-500 fill-red-500" />
       </div>
    )
  },
  {
    id: 5,
    title: "While waiting for help",
    description: "Continue using your inhaler every 15 minutes. Loosen tight clothing. Stay with the person — do not leave them alone.",
    instruction: "Keep talking calmly",
    timer: 900, // 15 minutes
    illustration: (
      <div className="flex gap-2">
        <BellRing className="w-12 h-12 text-white animate-ring" />
        <Heart className="w-12 h-12 text-white fill-white" />
      </div>
    )
  }
];

const AsthmaAttackGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const step = steps[currentStep];
    if (step.timer) {
      setTimeLeft(step.timer);
      setIsActive(false);
    } else {
      setTimeLeft(null);
    }
  }, [currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => (t !== null ? t - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative transition-colors duration-500",
      currentStep === 3 ? "bg-red-500 text-white" : "bg-[#F6F8F9] text-slate-900"
    )}>
      {/* Top Header */}
      <div className="flex items-center justify-center px-6 pt-8 pb-6 relative">
        <button 
          className="absolute left-6 p-2 -ml-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors" 
          onClick={() => navigate('/')}
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-[14px] font-bold tracking-[0.2em] uppercase opacity-70">
          Emergency Guide
        </h1>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === currentStep ? "w-8 bg-current" : "w-1.5 bg-current opacity-20"
            )}
          />
        ))}
      </div>

      <div className="px-6 flex flex-col flex-1 pb-10">
        {/* Step Counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-bold opacity-60">Step {currentStep + 1} of 5</span>
          <span className="text-[13px] font-bold uppercase tracking-wider">{step.instruction}</span>
        </div>

        {/* Illustration Card */}
        <div className={cn(
          "w-full aspect-square rounded-[40px] flex flex-col items-center justify-center mb-10 shadow-xl transition-all duration-500",
          currentStep === 3 ? "bg-red-600" : "bg-[#2F5E60]"
        )}>
          {step.illustration}
          
          {timeLeft !== null && (
            <div className="mt-8 flex flex-col items-center">
              <div className="text-[48px] font-mono font-bold text-white mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isActive ? <Pause className="text-white fill-white" /> : <Play className="text-white fill-white ml-1" />}
                </button>
                <button 
                  onClick={() => { setTimeLeft(step.timer); setIsActive(false); }}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <RefreshCw className="text-white w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold leading-tight mb-4 px-2">
            {step.title}
          </h2>
          <p className={cn(
            "text-[17px] leading-relaxed opacity-80",
            currentStep === 3 ? "text-white" : "text-slate-600"
          )}>
            {step.description}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          {currentStep === 3 && (
            <Button 
              className="w-full h-18 bg-white text-red-600 hover:bg-slate-50 font-black text-[20px] rounded-[24px] shadow-2xl flex gap-3 animate-pulse"
              onClick={() => window.open('tel:193')}
            >
              <Phone className="w-6 h-6 fill-current" />
              CALL 193 NOW
            </Button>
          )}

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button 
                onClick={handleBack}
                className={cn(
                  "flex-1 h-16 rounded-[24px] font-bold text-[16px] transition-all",
                  currentStep === 3 ? "bg-red-600 text-white border-2 border-white/20" : "bg-white text-slate-500 border border-slate-200"
                )}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                BACK
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                className={cn(
                  "flex-1 h-16 rounded-[24px] font-bold text-[16px] shadow-lg",
                  currentStep === 3 ? "bg-white text-red-600" : "bg-[#2F5E60] text-white"
                )}
              >
                NEXT STEP
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 h-16 bg-white text-[#2F5E60] font-bold text-[16px] rounded-[24px] shadow-lg"
              >
                FINISHED
              </Button>
            )}
          </div>

          <Button 
            className={cn(
              "w-full h-16 rounded-[24px] font-bold text-[15px] flex gap-2 transition-all",
              currentStep === 3 ? "bg-white/20 text-white" : "bg-white text-[#0A5D64] border border-slate-200"
            )}
          >
            <BellRing className="w-5 h-5" />
            NOTIFY EMERGENCY CONTACTS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AsthmaAttackGuide;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative overflow-y-auto">
      <div className="px-6 py-10 flex-1 flex flex-col items-center">
        {/* Header section with icons */}
        <div className="w-full flex justify-end gap-3 mb-6 relative z-10">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
        </div>

        {/* Info Header */}
        <div className="w-16 h-16 rounded-2xl bg-[#D2EFF0] flex items-center justify-center mb-4 shadow-sm">
          {/* Medical Bag SVG */}
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2F5E60] fill-[#2F5E60]">
            <path d="M12 21.5c-1.5-2.5-4-4.5-7-4.5-2.5 0-4-1.5-4-4s1.5-4 4-4c2 0 3 1.5 4 3 1 1 2 1.5 3 1.5M12 21.5c1.5-2.5 4-4.5 7-4.5 2.5 0 4-1.5 4-4s-1.5-4-4-4c-2 0-3 1.5-4 3-1 1-2 1.5-3 1.5" />
            <path d="M7.5 13C6 13 5 12 5 10.5S6 8 7.5 8c1.25 0 2 1 2.5 2M16.5 13c1.5 0 2.5-1 2.5-2.5S18 8 16.5 8c-1.25 0-2 1-2.5 2" />
            <path d="M12 3v10" />
          </svg>
        </div>

        <h2 className="text-[28px] font-bold text-[#0F172A] mb-1 text-center font-sans tracking-tight">
          AsthmaCare
        </h2>
        <p className="text-[14px] text-slate-500 mb-8 text-center px-4">
          Start your journey to better breathing
        </p>

        {/* Signup Form */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider uppercase text-slate-600 ml-1">
              FULL NAME
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
              <Input 
                type="text" 
                placeholder="John Doe" 
                className="h-12 bg-[#EEF2F4] border-transparent shadow-none text-[15px] placeholder:text-slate-400 rounded-xl pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider uppercase text-slate-600 ml-1">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                className="h-12 bg-[#EEF2F4] border-transparent shadow-none text-[15px] placeholder:text-slate-400 rounded-xl pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider uppercase text-slate-600 ml-1">
              PASSWORD
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 8 characters" 
                className="h-12 bg-[#EEF2F4] border-transparent shadow-none text-[15px] placeholder:text-slate-400 rounded-xl pl-12 pr-12"
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-2">
            <div className="flex items-center h-5 mt-0.5">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2F5E60] focus:ring-[#2F5E60] bg-white" />
            </div>
            <div className="text-[13px] leading-tight text-slate-500">
              I agree to the <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Privacy Policy</a>
            </div>
          </div>

          <Button 
            className="w-full h-14 bg-[#2F5E60] hover:bg-[#254A4C] text-[16px] font-semibold text-white rounded-xl shadow-sm mt-4" 
            onClick={() => navigate('/')}
          >
            Sign Up
          </Button>

          {/* Divider */}
          <div className="relative w-full py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-wider">
              <span className="px-4 bg-[#F6F8F9] text-slate-400">OR</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-14 bg-[#E5E7EB] hover:bg-[#D1D5DB] border-transparent text-slate-700 text-[15px] font-semibold rounded-xl flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.079 -13.134 58.529 -14.754 58.529 C -17.884 58.529 -20.544 56.419 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.949 C -12.984 43.949 -11.404 44.559 -10.154 45.749 L -6.744 42.339 C -8.804 40.419 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.544 46.059 -17.884 43.949 -14.754 43.949 Z"/>
              </g>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
      
      {/* Grey Bottom Section */}
      <div className="bg-[#EAEFF0] py-6 text-center shadow-inner mt-auto">
        <p className="text-[14px] text-slate-500 font-medium">
          Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-[#1E293B] hover:underline">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;

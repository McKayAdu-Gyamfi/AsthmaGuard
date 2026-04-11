import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authClient';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    
    setLoading(true);
    setError(null);
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: fullName
    });
    
    if (signUpError) {
      setError(signUpError.message || "An error occurred during sign up.");
      setLoading(false);
      return;
    }
    
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:5173/"
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col justify-center px-6 py-6 pb-12 overflow-y-auto">
      <div className="flex flex-col items-center flex-1 mt-8">
        {/* Logo / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#D2DFE0] flex items-center justify-center mb-6 shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F5E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            <path d="M12 11v4"/>
            <path d="M10 13h4"/>
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-[28px] font-bold text-[#2F5E60] mb-2 text-center tracking-tight">
          AsthmaCare
        </h2>
        <p className="text-[14px] text-slate-500 mb-8 text-center">
          Start your journey to better breathing
        </p>

        {error && (
            <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              FULL NAME
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <Input 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-14 pl-12 bg-[#F1F5F9] border-none shadow-none text-[15px] placeholder:text-slate-400 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 pl-12 bg-[#F1F5F9] border-none shadow-none text-[15px] placeholder:text-slate-400 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-14 pl-12 pr-12 bg-[#F1F5F9] border-none shadow-none text-[15px] placeholder:text-slate-400 rounded-xl"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3 mt-4 mb-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-slate-300 rounded text-[#2F5E60] focus:ring-[#2F5E60]"
              />
            </div>
            <label htmlFor="terms" className="text-[13px] text-slate-500 leading-relaxed">
              I agree to the <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Privacy Policy</a>
            </label>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#2F5E60] hover:bg-[#254A4C] text-[16px] font-semibold text-white rounded-xl shadow-sm mt-4 disabled:opacity-70" 
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative w-full my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[12px] font-bold">
            <span className="px-4 bg-[#F6F8F9] text-slate-400 uppercase tracking-widest">Or</span>
          </div>
        </div>

        <Button 
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline" 
          className="w-full h-14 bg-[#E2E8F0] hover:bg-slate-300 border-none text-[#1E293B] text-[15px] font-semibold rounded-xl shadow-none flex items-center justify-center gap-3"
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

        <p className="mt-8 text-[14px] text-slate-500">
          Already have an account? <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[#2F5E60] hover:underline">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;

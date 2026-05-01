import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TygerAvatar } from 'tyger-avatar';
import 'tyger-avatar/lib/bundle/styles.css';

const AVATAR_OPTIONS = [
  { seed: 'TrAlex',     color: '#5B8FF9' },
  { seed: 'TrFelix',    color: '#E96D6D' },
  { seed: 'TrSamantha',  color: '#F4A261' },
  { seed: 'TrEnrique',  color: '#2A9D8F' },
  { seed: 'TrSophia',    color: '#6A4C93' },
  { seed: 'TrHarry',    color: '#264653' },
  { seed: 'TrMaria',  color: '#E76F51' },
  { seed: 'TrTorsten', color: '#457B9D' },
  { seed: 'TrIggy',   color: '#A8DADC' },
  { seed: 'TrStu',      color: '#8ecae6' },
  { seed: 'TrChelsea',  color: '#1D3557' },
  { seed: 'TrEric',     color: '#0A5D64' },
  { seed: 'TrFranklin', color: '#34A853' },
  { seed: 'TrImran',    color: '#FBBC05' },
  { seed: 'TrRachel',   color: '#EA4335' },
  { seed: 'TrShamila',  color: '#6A5AE0' },
  { seed: 'TrHelen',    color: '#FF6B6B' },
  { seed: 'TrNancy',    color: '#4ECDC4' },
  { seed: 'TrChad',     color: '#FFD93D' },
];

const PREDEFINED_SEEDS = AVATAR_OPTIONS.map((a) => a.seed);
const seedColor = (seed: string) => AVATAR_OPTIONS.find((a) => a.seed === seed)?.color ?? '#0A5D64';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [severity, setSeverity] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(PREDEFINED_SEEDS[0]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return setError('Please fill out all required fields.');
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          image: avatarSeed // Save the seed to the 'image' field in better-auth
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed. Please try again.');
      } else {
        // Store local preferences — better-auth doesn't accept these as signup fields
        if (severity) localStorage.setItem('asthma_severity', severity);
        if (avatarSeed) localStorage.setItem('avatar_seed', avatarSeed);
        window.location.href = '/';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch('/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google', callbackURL: window.location.origin }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Google login is not configured. Check server environment variables.');
      }
    } catch (err) {
      setError('Failed to initiate Google login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative overflow-y-auto">
      <div className="px-6 py-10 flex-1 flex flex-col items-center max-w-sm mx-auto w-full">
        {/* Spacer */}
        <div className="h-6 mb-4"></div>

        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/favicon.png" alt="AsthmaGuard Icon" className="w-12 h-12 object-contain" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[26px] font-bold text-[#044E45] leading-none tracking-tight">AsthmaGuard</h1>
            <p className="text-[13px] text-slate-500 font-medium leading-tight mt-1">Breathe easy. Stay protected.</p>
          </div>
        </div>

        <h2 className="text-[26px] font-bold text-[#0F172A] mb-1 text-center tracking-tight">
          Create Account
        </h2>
        <p className="text-[14px] text-slate-500 mb-8 text-center px-4">
          Start your journey to better breathing
        </p>

        {error && (
          <div className="w-full bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <div className="w-full space-y-4">
          
          {/* Avatar Selection */}
          <div className="space-y-3 mb-6">
            <label className="text-[12px] font-bold tracking-wider uppercase text-slate-600 ml-1 block">
              CHOOSE YOUR AVATAR
            </label>
            <div className="grid grid-cols-4 gap-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-none pb-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {PREDEFINED_SEEDS.map((seed) => (
                <button
                  key={seed}
                  type="button"
                  onClick={() => setAvatarSeed(seed)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 bg-slate-50 ${
                    avatarSeed === seed
                      ? 'ring-4 ring-[#2F5E60] ring-offset-2 scale-105 z-10'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <div className="w-full h-full p-4 flex items-center justify-center overflow-hidden">
                    <TygerAvatar 
                      name={seed} 
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-[#EEF2F4] border-transparent shadow-none text-[15px] placeholder:text-slate-400 rounded-xl pl-12 pr-12"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold tracking-wider uppercase text-slate-600 ml-1">
              ASTHMA SEVERITY
            </label>
            <div className="flex gap-2">
              {['Mild', 'Moderate', 'Severe'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`flex-1 py-3 rounded-xl text-[13px] font-bold border transition-all ${
                    severity === sev
                      ? "bg-[#EAF1F2] text-[#2F5E60] border-[#2F5E60]"
                      : "bg-white border-slate-200 text-slate-400 hover:border-[#2F5E60] hover:text-[#2F5E60]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-2">
            <div className="flex items-center h-5 mt-0.5">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#2F5E60] focus:ring-[#2F5E60] bg-white cursor-pointer" 
              />
            </div>
            <div className="text-[13px] leading-tight text-slate-500">
              I agree to the <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#2F5E60] hover:underline">Privacy Policy</a>
            </div>
          </div>

          <Button 
            className={`w-full h-14 text-[16px] font-semibold text-white rounded-xl shadow-sm mt-4 transition-all ${
              (!name || !email || !password || !agreed || isLoading) 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-[#2F5E60] hover:bg-[#254A4C]"
            }`} 
            onClick={handleSignup}
            disabled={!name || !email || !password || !agreed || isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
            onClick={handleGoogleLogin}
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

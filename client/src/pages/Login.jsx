import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authClient';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({
        email,
        password
    });

    if (signInError) {
        setError(signInError.message || "Invalid credentials.");
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
    <div className="min-h-screen bg-white flex flex-col px-6 py-6 pb-12 relative overflow-y-auto">
      <div className="flex flex-col items-center flex-1 mt-12">
        {/* Logo / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#2F5E60] flex items-center justify-center mb-6 shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            <path d="M12 11v4"/>
            <path d="M10 13h4"/>
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-[20px] font-bold text-[#2F5E60] mb-6 text-center tracking-tight">
          AsthmaCare
        </h2>
        <h2 className="text-[32px] md:text-[34px] font-bold text-[#0F172A] mb-3 text-center tracking-tight leading-tight">
          Welcome Back
        </h2>
        <p className="text-[15px] text-[#475569] mb-10 text-center max-w-[280px]">
          Manage your respiratory health with ease.
        </p>

        {error && (
            <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">
              Email or Phone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <Input 
                type="text" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 pl-12 bg-white border border-[#E2E8F0] shadow-sm text-[15px] placeholder:text-slate-400 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold text-slate-700">
                Password
                </label>
                <button type="button" className="text-[13px] font-semibold text-[#2F5E60] hover:underline">
                Forgot password?
                </button>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 pl-12 pr-12 bg-white border border-[#E2E8F0] shadow-sm text-[15px] placeholder:text-slate-400 rounded-xl"
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

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#2F5E60] hover:bg-[#254A4C] text-[16px] font-semibold text-white rounded-xl shadow-sm mt-4 disabled:opacity-70" 
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative w-full my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="px-4 bg-white text-slate-400">Or</span>
          </div>
        </div>

        <Button 
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline" 
          className="w-full h-14 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[15px] font-semibold rounded-xl flex items-center justify-center gap-3 shadow-none"
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

        <p className="mt-8 text-[15px] text-slate-500">
          New to the app? <button type="button" onClick={() => navigate('/signup')} className="font-semibold text-[#2F5E60] hover:underline">Create Account</button>
        </p>

        {/* Footer Links */}
        <div className="mt-auto pt-16 pb-4 w-full text-center">
            <div className="flex justify-center gap-6 text-[12px] font-semibold text-slate-400 mb-4">
                <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                <a href="#" className="hover:text-slate-600">Terms of Service</a>
                <a href="#" className="hover:text-slate-600">Contact Support</a>
            </div>
            <p className="text-[11px] text-slate-400">
                © 2024 AsthmaCare Respiratory Systems. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

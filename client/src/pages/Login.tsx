import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please enter both email and password.');
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed. Please check your credentials.');
      } else {
        // Force reload to get updated session state in App.tsx / ProtectedRoutes
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
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col px-6 py-6 pb-12 relative overflow-y-auto">
      {/* Spacer to replace top bar */}
      <div className="h-10 mb-6"></div>

      <div className="flex flex-col items-center flex-1 w-full max-w-sm mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/favicon.png" alt="AsthmaGuard Icon" className="w-12 h-12 object-contain" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[26px] font-bold text-[#044E45] leading-none tracking-tight">AsthmaGuard</h1>
            <p className="text-[13px] text-slate-500 font-medium leading-tight mt-1">Breathe easy. Stay protected.</p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[28px] font-bold text-[#0F172A] mb-3 text-center tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[14px] text-[#475569] mb-8 text-center">
          Log in to manage your respiratory health.
        </p>

        {error && (
          <div className="w-full bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="w-full space-y-5">
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
                placeholder="Enter your password"
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
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              className="text-[13px] font-medium text-[#2F5E60] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button 
            className="w-full h-14 bg-[#2F5E60] hover:bg-[#254A4C] text-[16px] font-semibold text-white rounded-xl shadow-sm mt-2" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative w-full my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#F6F8F9] text-slate-400">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-[15px] font-semibold rounded-xl shadow-sm flex items-center justify-center gap-3"
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

        <p className="mt-8 mb-4 text-[15px] text-slate-500">
          New to the app? <button onClick={() => navigate('/signup')} className="font-semibold text-[#2F5E60] hover:underline">Create Account</button>
        </p>
      </div>

      {/* Footer Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#E8EFF0] py-4 text-center text-[10px] sm:text-[11px] text-slate-500 mt-auto border-t border-[#D2DFE0]">
        <div className="flex justify-center gap-4 mb-2 font-medium">
          <a href="#" className="hover:text-slate-800">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800">Terms of Service</a>
          <a href="#" className="hover:text-slate-800">Contact Support</a>
        </div>
        <p>© 2026 AsthmaCare Respiratory Systems. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;

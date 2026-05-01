import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');
    
    setIsPending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          redirectTo: window.location.origin + '/reset-password' 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send reset email. Please try again.');
      } else {
        setIsSent(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col px-6 py-12 relative overflow-y-auto">
      <div className="flex flex-col items-center flex-1 w-full max-w-sm mx-auto pt-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/favicon.png" alt="AsthmaGuard Icon" className="w-10 h-10 object-contain" />
          <h1 className="text-[22px] font-bold text-[#044E45] tracking-tight">AsthmaGuard</h1>
        </div>

        {!isSent ? (
          <>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-3 text-center tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-[14px] text-[#475569] mb-10 text-center leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="w-full bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-6 border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleResetRequest} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500 ml-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white border-slate-200 shadow-sm text-[15px] placeholder:text-slate-400 rounded-2xl pl-12 focus:ring-2 focus:ring-[#0A5D64] transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-[#0A5D64] hover:bg-[#084b51] text-[16px] font-bold text-white rounded-2xl shadow-lg shadow-[#0A5D64]/10 transition-all active:scale-[0.98]" 
              >
                {isPending ? 'Sending Link...' : 'Send Reset Link'}
              </Button>

              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors py-2 text-sm font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <div className="text-center w-full">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-3 tracking-tight">
              Check Your Email
            </h2>
            <p className="text-[14px] text-[#475569] mb-10 leading-relaxed">
              We've sent a password reset link to <br/>
              <span className="font-bold text-slate-800">{email}</span>
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-14 bg-[#0A5D64] hover:bg-[#084b51] text-[16px] font-bold text-white rounded-2xl"
            >
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

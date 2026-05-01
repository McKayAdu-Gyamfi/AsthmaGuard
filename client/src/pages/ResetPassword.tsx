import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError('Invalid or missing reset token.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    
    setIsPending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newPassword: password, 
          token 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to reset password. The link may have expired.');
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F6F8F9] flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center max-w-sm w-full">
           <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Link</h2>
           <p className="text-slate-500 text-sm mb-6">This password reset link is invalid or has expired.</p>
           <Button onClick={() => navigate('/forgot-password')} className="w-full bg-[#0A5D64] h-12 rounded-xl">Request New Link</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col px-6 py-12 relative overflow-y-auto">
      <div className="flex flex-col items-center flex-1 w-full max-w-sm mx-auto pt-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/favicon.png" alt="AsthmaGuard Icon" className="w-10 h-10 object-contain" />
          <h1 className="text-[22px] font-bold text-[#044E45] tracking-tight">AsthmaGuard</h1>
        </div>

        {!isSuccess ? (
          <>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-3 text-center tracking-tight">
              Reset Password
            </h2>
            <p className="text-[14px] text-[#475569] mb-10 text-center leading-relaxed">
              Create a new, strong password for your account.
            </p>

            {error && (
              <div className="w-full bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-6 border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500 ml-1">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white border-slate-200 shadow-sm text-[15px] placeholder:text-slate-400 rounded-2xl pl-12 focus:ring-2 focus:ring-[#0A5D64] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500 ml-1">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isPending ? 'Resetting...' : 'Update Password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center w-full">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-[26px] font-bold text-[#0F172A] mb-3 tracking-tight">
              Password Reset!
            </h2>
            <p className="text-[14px] text-[#475569] mb-10 leading-relaxed">
              Your password has been updated successfully. You can now log in with your new credentials.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-14 bg-[#0A5D64] hover:bg-[#084b51] text-[16px] font-bold text-white rounded-2xl"
            >
              Sign In Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

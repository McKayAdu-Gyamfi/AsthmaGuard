import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setIsPending(true);
    setStatus(null);

    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to change password' });
    } else {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 space-y-6 px-4">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <h2 className="text-[22px] font-bold text-slate-800 mb-8">Settings</h2>
        
        <div className="space-y-10">
          <div>
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-wider mb-6">Security</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Current Password</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-200 pl-11"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">New Password</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-200 pl-11"
                    placeholder="Min. 8 characters"
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-200 pl-11"
                    placeholder="Confirm new password"
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-bold">{status.message}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-14 bg-[#0A5D64] hover:bg-[#084b51] rounded-2xl text-white font-bold text-[16px] shadow-lg shadow-[#0A5D64]/10 transition-all active:scale-[0.98]"
              >
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-wider mb-4">Account Actions</h3>
            <button className="text-rose-500 hover:text-rose-600 font-bold py-2 text-[15px] flex items-center gap-2">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

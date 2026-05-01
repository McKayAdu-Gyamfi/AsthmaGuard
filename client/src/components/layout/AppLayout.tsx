import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Activity, User, Settings, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';
import { NotificationPopover } from '@/components/notifications/NotificationPopover';
import { TygerAvatar } from 'tyger-avatar';

/** TygerAvatar-based user avatar */
const UserAvatar = ({ seed }: { seed?: string }) => {
  const validName = (!seed || !seed.startsWith('Tr')) ? 'TrFelix' : seed;
  return (
    <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden">
      <TygerAvatar 
        name={validName} 
      />
    </div>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState<any>(null);
  const [localAvatar, setLocalAvatar] = React.useState(() => localStorage.getItem('avatar_seed'));

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/get-session');
      if (!res.ok) return;
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // Backend not running
    }
  };

  React.useEffect(() => {
    fetchSession();

    // Listen for avatar changes
    const handleAvatarChange = () => {
      setLocalAvatar(localStorage.getItem('avatar_seed'));
      fetchSession();
    };

    window.addEventListener('avatarChanged', handleAvatarChange);
    return () => window.removeEventListener('avatarChanged', handleAvatarChange);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Health', path: '/health', icon: Activity },
    { name: 'AI Support', path: '/ai-support', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-slate-900 w-full overflow-x-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[250px] bg-white border-r border-[#E5E7EB] shrink-0 h-screen sticky top-0 relative z-20">
        {/* User Card */}
        <div className="p-6 md:p-8 mb-2">
          <div className="bg-[#F0F5F5] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#E6EDED] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shadow-sm">
                <UserAvatar seed={user?.image || localAvatar || undefined} />
              </div>
              <span className="text-[14px] font-semibold text-slate-800">
                {user?.name || 'Guest User'}
              </span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-[15px]",
                  isActive
                    ? "bg-[#F0F5F5] text-[#044E45] shadow-sm relative after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-1 after:bg-[#044E45] after:rounded-l-full"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#044E45]" : "text-slate-400")} />
                {item.name}
              </button>
            );
          })}

          <div className="pt-6 pb-2 px-4">
            <div className="border-t border-slate-100"></div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-[15px] text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-x-hidden w-full relative">
        {/* Top Header */}
        <header className="h-[80px] bg-white border-b border-[#E5E7EB] shrink-0 px-6 flex items-center justify-end md:justify-between sticky top-0 z-50 w-full transition-all">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 ml-2">
            <img src="/favicon.png" alt="AsthmaGuard Icon" className="w-9 h-9 object-contain" />
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] font-bold text-[#044E45] leading-none tracking-tight">AsthmaGuard</h1>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Breathe easy. Stay protected.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPopover />

            {/* Mobile User Avatar */}
            {!location.pathname.startsWith('/profile') && (
              <div
                className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-white shadow-md md:hidden ml-2 cursor-pointer flex items-center justify-center"
                onClick={() => navigate('/profile')}
              >
                <UserAvatar seed={user?.image || localAvatar || undefined} />
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 relative w-full h-full md:p-8">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

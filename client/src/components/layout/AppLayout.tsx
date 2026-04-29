import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Activity, User, Search, Settings, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';
import { NotificationPopover } from '@/components/notifications/NotificationPopover';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Health', path: '/health', icon: Activity },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-slate-900 w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[250px] bg-white border-r border-[#E5E7EB] shrink-0 h-screen sticky top-0 relative z-20">
        <div className="p-6 md:p-8 flex items-center gap-3">
          {/* Logo mock matching image */}
          <div className="relative">
             <div className="w-8 h-8 rounded-full border-4 border-[#044E45] flex items-center justify-center relative">
               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#044E45] transform rotate-45"></div>
             </div>
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#044E45] leading-tight tracking-tight">AsthmaCare</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Health Solution</p>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 mb-8">
          <div className="bg-[#F0F5F5] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#E6EDED] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E5BDBA] overflow-hidden">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 20C30 20 20 40 25 65C30 90 70 90 75 65C80 40 70 20 50 20Z" fill="#2E1A11"/>
                  <circle cx="50" cy="55" r="22" fill="#FCE7D9"/>
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-slate-800">Robert Foxer</span>
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
            )
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Top Header */}
        <header className="h-[80px] bg-white border-b border-[#E5E7EB] shrink-0 px-6 flex items-center justify-end md:justify-between sticky top-0 z-50 w-full transition-all">
           {/* Desktop search is visible, mobile hidden */}
           <div className="hidden md:block">
             <h2 className="text-[24px] font-bold text-slate-800 ml-2">Overview</h2>
           </div>

           <div className="flex items-center gap-3">
             <button className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5F1] text-[#E0633C] text-[13px] font-bold shadow-sm whitespace-nowrap">
               ✨ Upgrade plan
             </button>
             
             <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors">
                <Search className="w-5 h-5" />
             </button>
             
             <NotificationPopover />
             
             {/* Mobile User Avatar in top right */}
             <div className="w-10 h-10 rounded-full bg-[#E5BDBA] overflow-hidden border-2 border-white shadow-sm md:hidden ml-2 cursor-pointer" onClick={() => navigate('/profile')}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 20C30 20 20 40 25 65C30 90 70 90 75 65C80 40 70 20 50 20Z" fill="#2E1A11"/>
                  <circle cx="50" cy="55" r="22" fill="#FCE7D9"/>
                </svg>
             </div>
           </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 relative w-full h-full p-4 md:p-8">
           {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

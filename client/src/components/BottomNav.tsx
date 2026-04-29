import React from 'react';
import { Home, LayoutDashboard, LineChart, CalendarDays, User, Map, History, Bell, MessageSquare, Activity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Health', path: '/health', icon: Activity },
    { name: 'AI Support', path: '/ai-support', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-colors duration-200",
              isActive ? "text-[#044E45]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-current opacity-10" : ""} />
            <span className={cn("text-[11px] font-medium tracking-wide", isActive ? "text-[#044E45]" : "text-slate-500")}>
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

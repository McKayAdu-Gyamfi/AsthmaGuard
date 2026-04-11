import React from 'react';
import { Home, LineChart, Users, User, Map, History, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getIcon = (type) => {
    switch (type) {
      case 'Home': return Home;
      case 'Insights': return LineChart;
      case 'Plan': return Bell; // or some calendar icon
      case 'Map': return Map;
      case 'Profile': return User;
      case 'Alerts': return Bell;
      case 'History': return History;
      case 'Community': return Users;
      default: return Home;
    }
  };

  const getPath = (type) => {
    switch (type) {
      case 'Home': return '/';
      case 'Insights': return '/insights';
      case 'Alerts': return '/risk-alert';
      default: return '#';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-6 py-4 pb-8 flex justify-between items-center z-50">
      {items.map((item) => {
        const Icon = getIcon(item);
        const path = getPath(item);
        const isActive = location.pathname === path || (path === '#' && false);

        return (
          <button
            key={item}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-colors duration-200",
              isActive ? "text-[#286061]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-current opacity-20" : ""} />
            <span className={cn("text-[11px] font-medium", isActive ? "text-[#286061]" : "text-slate-500")}>
              {item}
            </span>
          </button>
        );
      })}
    </div>
  );
};

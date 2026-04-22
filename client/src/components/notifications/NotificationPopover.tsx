import React, { useState } from 'react';
import { Bell, Check, Wind, Activity, Pill, UserRound, Filter } from 'lucide-react';

type Notification = {
  id: string;
  type: 'alert' | 'update' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'High Pollen Warning',
    message: 'Pollen levels are peaking today in your location. Bring your rescue inhaler if you go outside.',
    time: '10 min ago',
    unread: true
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Medication Reminder',
    message: 'Time to take your maintenance inhaler (Symbicort) - 2 puffs.',
    time: '2 hours ago',
    unread: true
  },
  {
    id: '3',
    type: 'update',
    title: 'Weekly Report',
    message: 'Great job! Your symptoms were 20% less frequent this week compared to last week.',
    time: 'Yesterday',
    unread: false
  },
  {
    id: '4',
    type: 'system',
    title: 'Dr. Sarah commented',
    message: '"Your peak flow readings look stable. Let\'s continue the current plan."',
    time: '2 days ago',
    unread: false
  }
];

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const displayedNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.unread);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <Wind className="w-5 h-5 text-orange-500" />;
      case 'reminder': return <Pill className="w-5 h-5 text-blue-500" />;
      case 'update': return <Activity className="w-5 h-5 text-green-500" />;
      default: return <UserRound className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-500" />
        {notifications.some(n => n.unread) && (
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E0633C] border border-white"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 w-[420px] bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden font-sans pt-2">
           <div className="px-5 py-3 flex items-center justify-between">
             <h3 className="font-bold text-slate-900 text-[17px]">Notifications</h3>
             <button 
               onClick={handleMarkAllAsRead}
               className="text-[#044E45] font-semibold text-[12px] flex items-center gap-1.5 hover:underline"
             >
               <Check className="w-3.5 h-3.5" strokeWidth={3} />
               Mark all as read
             </button>
           </div>
           
           <div className="px-5 flex items-center gap-6 border-b border-slate-100 mb-2">
             <button 
               onClick={() => setActiveTab('all')}
               className={`font-bold text-[14px] pb-3 px-1 transition-colors ${activeTab === 'all' ? 'text-[#044E45] border-b-2 border-[#044E45]' : 'text-slate-500 mb-[2px]'}`}
             >
               All Notifications
             </button>
             <button 
               onClick={() => setActiveTab('unread')}
               className={`font-bold text-[14px] pb-3 px-1 transition-colors ${activeTab === 'unread' ? 'text-[#044E45] border-b-2 border-[#044E45]' : 'text-slate-500 mb-[2px]'}`}
             >
               Unread
             </button>
           </div>
           
           <div className="max-h-[420px] overflow-y-auto">
             {displayedNotifications.length === 0 ? (
               <div className="px-5 py-10 text-center text-slate-500 text-sm">
                 No {activeTab === 'unread' ? 'unread ' : ''}notifications here.
               </div>
             ) : (
               displayedNotifications.map((notif) => (
                 <div key={notif.id} className="px-5 py-4 hover:bg-slate-50 transition-colors flex gap-4 border-b border-slate-50">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                         {getIcon(notif.type)}
                      </div>
                      {notif.unread && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0A5D64] border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-start">
                        <p className="text-[13px] text-slate-700 leading-tight">
                          <span className="font-bold text-slate-900">{notif.title}</span>
                        </p>
                      </div>
                      <p className="text-[12px] text-slate-600 mt-1 mb-1.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">{notif.time}</p>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>
      )}
    </div>
  );
};

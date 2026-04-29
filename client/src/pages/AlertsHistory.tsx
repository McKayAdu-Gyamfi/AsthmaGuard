import { useState } from 'react';
import { ArrowLeft, Wind, AlertTriangle, CheckCircle2, Trash2, Filter, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AlertsHistory = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'critical', title: 'Critical AQI Alert', message: 'AQI has crossed 200. Please stay indoors and keep your inhaler ready.', time: '10:30 AM', date: 'Today', unread: true },
    { id: '2', type: 'high', title: 'High Pollen Count', message: 'Conditions are favorable for asthma triggers. Limit outdoor activities.', time: '08:15 AM', date: 'Today', unread: true },
    { id: '3', type: 'low', title: 'Conditions Improved', message: 'Risk level has dropped to LOW. It is safe to go outside.', time: '04:00 PM', date: 'Yesterday', unread: false },
    { id: '4', type: 'high', title: 'Sudden Humidity Spike', message: 'High humidity detected. This may cause breathing difficulties.', time: '02:30 PM', date: 'Oct 22', unread: false }
  ]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, unread: false } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'low': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Wind className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[20px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Alerts History
        </h1>
        <button className="p-2 text-slate-400">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pt-4 pb-6">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Wind className="w-16 h-16 text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold">No alerts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <Card 
                key={alert.id} 
                onClick={() => markAsRead(alert.id)}
                className={cn(
                  "p-5 rounded-3xl border-none shadow-sm transition-all relative overflow-hidden",
                  alert.unread ? "bg-white ring-2 ring-[#0A5D64]/10 shadow-md" : "bg-white/70"
                )}
              >
                {alert.unread && (
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-[#0A5D64] border-2 border-white shadow-sm" />
                )}
                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    alert.type === 'critical' ? "bg-red-50" : alert.type === 'high' ? "bg-orange-50" : "bg-green-50"
                  )}>
                    {getIcon(alert.type)}
                  </div>
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        alert.type === 'critical' ? "text-red-500" : alert.type === 'high' ? "text-orange-500" : "text-green-600"
                      )}>
                        {alert.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-bold text-slate-400">{alert.time} • {alert.date}</span>
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-900 mb-1">{alert.title}</h4>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{alert.message}</p>
                    
                    <div className="flex gap-4 mt-4 pt-4 border-t border-slate-50">
                       <button className="text-[12px] font-bold text-[#0A5D64] hover:underline">View Details</button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteAlert(alert.id); }}
                         className="text-[12px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                       >
                         Delete
                       </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsHistory;

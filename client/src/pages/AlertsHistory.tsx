import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, CheckCircle2, AlertTriangle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Alert = {
  id: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';
  message: string;
  created_at: string;
  is_read: boolean;
  location?: string;
};

const AlertsHistory = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setAlerts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/v1/alerts/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !currentStatus })
      });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: !currentStatus } : a));
      }
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'MODERATE': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
  };

  const getBgColor = (level: string) => {
    switch (level) {
      case 'EMERGENCY': return 'bg-red-50 border-red-100';
      case 'HIGH': return 'bg-orange-50 border-orange-100';
      case 'MODERATE': return 'bg-blue-50 border-blue-100';
      default: return 'bg-green-50 border-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      <div className="flex items-center justify-between px-6 pt-8 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[18px] font-bold text-slate-900">Alerts History</h1>
        <button className="p-2 -mr-2">
          <Filter className="w-5 h-5 text-slate-800" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
             <div className="w-8 h-8 border-4 border-[#0A5D64] border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-sm font-medium">Loading history...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <Bell className="w-12 h-12 mb-4 opacity-20" />
             <p className="text-sm font-medium">No alerts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => toggleReadStatus(alert.id, alert.is_read)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${getBgColor(alert.risk_level)} ${alert.is_read ? 'opacity-60 grayscale-[0.5]' : 'shadow-sm active:scale-[0.98]'}`}
              >
                <div className="flex gap-4">
                   <div className="shrink-0 mt-1">
                      {getIcon(alert.risk_level)}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <span className={`text-[11px] font-bold uppercase tracking-wider ${
                           alert.risk_level === 'EMERGENCY' ? 'text-red-600' : 
                           alert.risk_level === 'HIGH' ? 'text-orange-600' : 
                           'text-slate-500'
                         }`}>
                           {alert.risk_level} • {alert.location || 'Current Location'}
                         </span>
                         <span className="text-[10px] text-slate-400 font-bold">
                           {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <p className="text-[14px] text-slate-700 font-semibold leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {new Date(alert.created_at).toLocaleDateString()}
                         </span>
                         {!alert.is_read && (
                           <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Missing import fix
const Bell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

export default AlertsHistory;

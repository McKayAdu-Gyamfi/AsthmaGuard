import { useState } from 'react';
import { Edit2, Check, X, MapPin, Shield, Bell, LogOut, Trash2, ChevronRight, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Mensah',
    email: 'sarah.m@example.com',
    severity: 'Moderate',
    location: 'Accra, Ghana'
  });
  
  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] pb-24">
       {/* Profile Header Card */}
       <div className="bg-[#0A5D64] pt-12 pb-20 px-6 rounded-b-[40px] relative shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-[24px] font-bold">Profile</h1>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full bg-white/10 text-white"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-5">
             <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-white overflow-hidden shadow-xl">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="#E8D1C5"/>
                  <path d="M50 15C30 15 20 35 25 60C30 85 70 85 75 60C80 35 70 15 50 15Z" fill="#1e293b"/>
                  <circle cx="50" cy="50" r="22" fill="#FCE7D9"/>
                </svg>
             </div>
             <div className="flex-1">
                {isEditing ? (
                  <Input 
                    value={tempData.name}
                    onChange={(e) => setTempData({...tempData, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10 mb-2"
                  />
                ) : (
                  <h2 className="text-white text-[22px] font-bold">{profileData.name}</h2>
                )}
                <p className="text-white/70 text-[14px]">{profileData.email}</p>
             </div>
             {!isEditing ? (
               <button 
                 onClick={() => setIsEditing(true)}
                 className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
               >
                 <Edit2 className="w-5 h-5" />
               </button>
             ) : (
               <div className="flex gap-2">
                 <button onClick={handleCancel} className="p-2 rounded-full bg-red-500/20 text-white"><X className="w-5 h-5" /></button>
                 <button onClick={handleSave} className="p-2 rounded-full bg-green-500/20 text-white"><Check className="w-5 h-5" /></button>
               </div>
             )}
          </div>
       </div>

       <div className="px-6 -mt-10 space-y-6">
          {/* Severity & Location Settings */}
          <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white">
             <h3 className="text-[15px] font-bold text-slate-900 mb-5">Medical Settings</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                         <Activity className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Severity</p>
                         <p className="text-[14px] font-bold text-slate-800">{profileData.severity}</p>
                      </div>
                   </div>
                   <button className="text-[12px] font-bold text-[#0A5D64]">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                         <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                         <p className="text-[14px] font-bold text-slate-800">{profileData.location}</p>
                      </div>
                   </div>
                   <button className="text-[12px] font-bold text-[#0A5D64]">Update</button>
                </div>
             </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
             <button 
               onClick={() => navigate('/emergency-contacts')}
               className="w-full p-5 bg-white rounded-3xl shadow-sm flex items-center justify-between group transition-all hover:bg-slate-50"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                      <Shield className="w-6 h-6" />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-slate-900">Emergency Contacts</p>
                      <p className="text-[12px] text-slate-500 font-medium">Manage your safety circle</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
             </button>

             <button 
               onClick={() => navigate('/alerts-history')}
               className="w-full p-5 bg-white rounded-3xl shadow-sm flex items-center justify-between group transition-all hover:bg-slate-50"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Bell className="w-6 h-6" />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-slate-900">Alert History</p>
                      <p className="text-[12px] text-slate-500 font-medium">View past environmental alerts</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
             </button>
          </div>

          {/* Account Actions */}
          <div className="pt-4 space-y-3">
             <Button 
               variant="outline" 
               className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold flex gap-2"
               onClick={() => navigate('/login')}
             >
               <LogOut className="w-5 h-5" />
               Sign Out
             </Button>
             <Button 
               variant="ghost" 
               className="w-full h-14 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 font-bold flex gap-2"
             >
               <Trash2 className="w-5 h-5" />
               Delete Account
             </Button>
          </div>
       </div>

       {/* Small branding footer */}
       <p className="text-center text-slate-300 text-[11px] font-bold mt-10 tracking-widest uppercase">
          Smart Asthma v1.0.4
       </p>
    </div>
  );
};

export default Profile;

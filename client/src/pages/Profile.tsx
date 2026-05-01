import { useState, useEffect } from 'react';
import { Edit2, X, MapPin, Shield, Bell, Settings, LogOut, Trash2, ChevronRight, Activity, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/** Palette for avatar color circles in the picker */
const AVATAR_OPTIONS = [
  { seed: 'Alex',     color: '#5B8FF9' },
  { seed: 'Cathy',    color: '#E96D6D' },
  { seed: 'Chelsea',  color: '#F4A261' },
  { seed: 'Enrique',  color: '#2A9D8F' },
  { seed: 'Felix',    color: '#6A4C93' },
  { seed: 'Harry',    color: '#264653' },
  { seed: 'Maria',    color: '#E76F51' },
  { seed: 'Samantha', color: '#457B9D' },
  { seed: 'Sophia',   color: '#A8DADC' },
  { seed: 'Stu',      color: '#F1FAEE' },
  { seed: 'Torsten',  color: '#1D3557' },
  { seed: 'Iggy',     color: '#0A5D64' },
];

/** Returns background colour for a given avatar seed */
const seedColor = (seed: string) =>
  AVATAR_OPTIONS.find((a) => a.seed === seed)?.color ?? '#0A5D64';

/** Initials extracted from a display name */
const getInitials = (name?: string) =>
  name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'G';

/** Full-size avatar used on the profile header */
const ProfileAvatar = ({ name, seed }: { name?: string; seed?: string }) => (
  <div
    className="w-full h-full flex items-center justify-center text-white text-[28px] font-bold select-none"
    style={{ background: seedColor(seed ?? '') }}
  >
    {getInitials(name)}
  </div>
);

/** Small avatar circle used in the picker grid */
const PickerAvatar = ({ seed, selected, onClick }: { seed: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
      selected ? 'ring-4 ring-[#0A5D64] ring-offset-2 scale-105 z-10' : 'hover:scale-105 hover:shadow-md'
    }`}
  >
    <div
      className="w-full h-full flex items-center justify-center text-white text-[15px] font-bold"
      style={{ background: seedColor(seed) }}
    >
      {seed.slice(0, 2).toUpperCase()}
    </div>
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    name: 'Sarah Mensah',
    email: 'sarah.m@example.com',
    severity: 'Moderate',
    location: 'Accra, Ghana',
  });

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatarSeed, setTempAvatarSeed] = useState('Felix');

  const [isEditingSeverity, setIsEditingSeverity] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/get-session');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setProfileData((prev: any) => ({ ...prev, name: data.user.name, email: data.user.email }));
          setTempName(data.user.name);
          setTempAvatarSeed(data.user.image || 'Felix');
        }
      } catch {
        // Backend offline — silently ignore
      }
    };
    fetchSession();

    const storedSev = localStorage.getItem('asthma_severity');
    const storedLoc = localStorage.getItem('asthma_location');
    if (storedSev) setProfileData((prev: any) => ({ ...prev, severity: storedSev }));
    if (storedLoc) setProfileData((prev: any) => ({ ...prev, location: storedLoc }));
  }, []);

  const openEditPopup = () => {
    setTempName(profileData.name);
    setTempAvatarSeed(user?.image || 'Felix');
    setShowEditPopup(true);
  };

  const handleSaveProfile = () => {
    setProfileData((prev: any) => ({ ...prev, name: tempName }));
    setUser((prev: any) => ({ ...prev, name: tempName, image: tempAvatarSeed }));
    setShowEditPopup(false);
  };

  const updateLocation = (e: any) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingLocation(false);
      localStorage.setItem('asthma_location', profileData.location);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] pb-24">
      {/* Edit Popup Modal */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setShowEditPopup(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[12px] font-bold text-slate-500 mb-2 tracking-wider block">FULL NAME</label>
                <Input value={tempName} onChange={(e) => setTempName(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
              </div>

              <div>
                <label className="text-[12px] font-bold text-slate-500 mb-2 tracking-wider block">CHOOSE AVATAR</label>
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {AVATAR_OPTIONS.map(({ seed }) => (
                    <PickerAvatar
                      key={seed}
                      seed={seed}
                      selected={tempAvatarSeed === seed}
                      onClick={() => setTempAvatarSeed(seed)}
                    />
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-14 bg-[#0A5D64] hover:bg-[#07474c] rounded-xl text-white text-[16px] font-bold mt-2"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-[#0A5D64] pt-12 pb-20 px-6 rounded-b-[40px] relative shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-[24px] font-bold">Profile</h1>
          <button onClick={() => navigate('/settings')} className="p-2 rounded-full bg-white/10 text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-xl">
            <ProfileAvatar name={user?.name || profileData.name} seed={user?.image || tempAvatarSeed} />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-[22px] font-bold">{profileData.name}</h2>
            <p className="text-white/70 text-[14px]">{profileData.email}</p>
          </div>
          <button
            onClick={openEditPopup}
            className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors shadow-sm"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Medical Settings */}
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white">
          <h3 className="text-[15px] font-bold text-slate-900 mb-5">Medical Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Severity</p>
                  <p className="text-[14px] font-bold text-slate-800">{profileData.severity}</p>
                </div>
              </div>
              {!isEditingSeverity ? (
                <button onClick={() => setIsEditingSeverity(true)} className="text-[12px] font-bold text-[#0A5D64] hover:underline">Change</button>
              ) : (
                <div className="flex gap-1">
                  {['Mild', 'Moderate', 'Severe'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setProfileData({ ...profileData, severity: s }); localStorage.setItem('asthma_severity', s); setIsEditingSeverity(false); }}
                      className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-md font-bold hover:border-[#0A5D64] hover:text-[#0A5D64] transition-colors shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  {!isEditingLocation ? (
                    <p className="text-[14px] font-bold text-slate-800">{profileData.location}</p>
                  ) : (
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      onBlur={updateLocation}
                      onKeyDown={updateLocation}
                      autoFocus
                      className="h-7 w-32 text-[13px] px-2 py-0 border-slate-300 mt-0.5 rounded-md shadow-sm"
                    />
                  )}
                </div>
              </div>
              {!isEditingLocation && (
                <button onClick={() => setIsEditingLocation(true)} className="text-[12px] font-bold text-[#0A5D64] hover:underline">Update</button>
              )}
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

      <p className="text-center text-slate-300 text-[11px] font-bold mt-10 tracking-widest uppercase">
        Smart Asthma v1.0.4
      </p>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Phone, Mail, Trash2, Heart, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', relation: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/v1/users/me');
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
        setContacts(result.data.emergency_contacts || []);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Could not load your profile. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!formData.name || !formData.email) {
      return setError('Name and Email are required.');
    }
    
    // Basic email validation
    if (!formData.email.includes('@')) {
      return setError('Please enter a valid email address.');
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const updatedContacts = [...contacts, { ...formData }];
      
      // We send the full profile back to avoid overwriting other fields with defaults
      const res = await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...profile,
          emergency_contacts: updatedContacts 
        })
      });
      
      const result = await res.json();
      if (result.success) {
        setContacts(result.data.emergency_contacts);
        setProfile(result.data);
        setShowAddForm(false);
        setFormData({ name: '', relation: '', phone: '', email: '' });
      } else {
        setError(result.error || 'Failed to save contact.');
      }
    } catch (error) {
      console.error('Failed to add contact:', error);
      setError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteContact = async (email: string) => {
    setError('');
    try {
      const res = await fetch(`/api/v1/users/emergency-contacts/${email}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setContacts(result.data);
        // Sync profile state
        setProfile((prev: any) => ({ ...prev, emergency_contacts: result.data }));
      } else {
        setError(result.error || 'Failed to delete contact.');
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setError('Could not delete the contact. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Header */}
      <div className="flex items-center px-6 pt-8 pb-4">
        <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-[20px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
          Emergency Contacts
        </h1>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pt-4 pb-6">
        <div className="mb-8">
           <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
             <Shield className="w-8 h-8 text-red-500 fill-red-100" />
           </div>
           <h2 className="text-[24px] font-bold text-slate-900 mb-2">Your Safety Circle</h2>
           <p className="text-[14px] text-slate-500 leading-relaxed">
             These contacts will be notified immediately if you trigger the emergency guide during an attack.
           </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0A5D64] animate-spin" />
            <p className="mt-4 text-slate-400 font-medium">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 opacity-50">
               <UserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[16px] font-bold text-slate-400 mb-2">No contacts yet</p>
            <p className="text-[13px] text-slate-400 max-w-[200px] mb-8">Add your first emergency contact to ensure your safety.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {contacts.map((contact, idx) => (
              <Card key={contact.email || idx} className="p-5 rounded-3xl border-none shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#EAF1F2] flex items-center justify-center text-[#0A5D64] font-bold text-lg">
                      {contact.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-slate-900">{contact.name}</h4>
                      <p className="text-[12px] text-[#0A5D64] font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" />
                        {contact.relation}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteContact(contact.email)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-50">
                   <div className="flex items-center gap-3 text-slate-600">
                     <Phone className="w-4 h-4 text-slate-400" />
                     <span className="text-[13px] font-medium">{contact.phone}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-600">
                     <Mail className="w-4 h-4 text-slate-400" />
                     <span className="text-[13px] font-medium">{contact.email}</span>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showAddForm ? (
          <Card className="p-6 rounded-3xl border-none shadow-lg bg-white mb-8 border-t-4 border-t-[#0A5D64]">
            <h3 className="font-bold text-slate-900 mb-6">Add Contact</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                <Input 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12 bg-slate-50 border-transparent rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Relation</label>
                <Input 
                  placeholder="e.g. Spouse, Brother, Doctor" 
                  value={formData.relation}
                  onChange={(e) => setFormData({...formData, relation: e.target.value})}
                  className="h-12 bg-slate-50 border-transparent rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                <Input 
                  placeholder="+233..." 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-12 bg-slate-50 border-transparent rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <Input 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 bg-slate-50 border-transparent rounded-xl" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12 rounded-xl border-slate-100 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddContact}
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="flex-1 h-12 rounded-xl bg-[#0A5D64] hover:bg-[#07474E] text-white font-bold"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Contact'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full h-16 bg-white hover:bg-slate-50 text-[#0A5D64] font-bold rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add New Contact
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;

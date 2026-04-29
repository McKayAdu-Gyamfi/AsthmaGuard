import { useState } from 'react';
import { ArrowLeft, UserPlus, Phone, Mail, Trash2, Heart, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', relation: 'Husband', phone: '+233 24 123 4567', email: 'john.doe@example.com' },
    { id: '2', name: 'Mary Smith', relation: 'Doctor', phone: '+233 20 987 6543', email: 'dr.mary@health.gh' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
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

        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 opacity-50">
               <UserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[16px] font-bold text-slate-400 mb-2">No contacts yet</p>
            <p className="text-[13px] text-slate-400 max-w-[200px] mb-8">Add your first emergency contact to ensure your safety.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {contacts.map(contact => (
              <Card key={contact.id} className="p-5 rounded-3xl border-none shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#EAF1F2] flex items-center justify-center text-[#0A5D64] font-bold text-lg">
                      {contact.name.charAt(0)}
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
                    onClick={() => deleteContact(contact.id)}
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
                <Input placeholder="Full Name" className="h-12 bg-slate-50 border-transparent rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Relation</label>
                <Input placeholder="e.g. Spouse, Brother, Doctor" className="h-12 bg-slate-50 border-transparent rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                <Input placeholder="+233..." className="h-12 bg-slate-50 border-transparent rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <Input placeholder="email@example.com" className="h-12 bg-slate-50 border-transparent rounded-xl" />
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
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12 rounded-xl bg-[#0A5D64] hover:bg-[#07474E] text-white font-bold"
                >
                  Add Contact
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

import { useState, useEffect } from 'react';
import { Pill, Activity, Plus, Clock, CheckCircle2, ChevronRight, History, Heart, X, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SymptomLog {
  id: string;
  type: string;
  severity: string;
  notes: string;
  created_at: string;
}

interface Medication {
  id: string;
  name: string;
  type: string;
  dose: string;
  frequency: string;
  last_taken: string | null;
}

const Health = () => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'medications'>('symptoms');
  
  // Symptoms State
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inhalerUsed, setInhalerUsed] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [isSavingSymptom, setIsSavingSymptom] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SymptomLog | null>(null);

  // Medications State
  const [meds, setMeds] = useState<Medication[]>([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', type: 'Preventer', dose: '', frequency: '' });
  const [isSavingMed, setIsSavingMed] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchSymptoms = async () => {
    try {
      const res = await fetch('/api/v1/symptoms', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSymptomLogs(data.data || []);
      }
    } catch (e) { console.error('Failed to fetch symptoms', e); }
  };

  const fetchMeds = async () => {
    try {
      const res = await fetch('/api/v1/medications', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMeds(data.data || []);
      }
    } catch (e) { console.error('Failed to fetch medications', e); }
  };

  useEffect(() => {
    fetchSymptoms();
    fetchMeds();
  }, []);

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const handleSaveLog = async () => {
    if (symptoms.length === 0) return alert('Please select at least one symptom.');
    setIsSavingSymptom(true);
    try {
      // Map severity to integer for database
      const severityInt = severity === 'severe' ? 5 : severity === 'moderate' ? 3 : 1;
      
      const res = await fetch('/api/v1/symptoms', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          severity: severityInt,
          type: symptoms.join(', '),
          notes: inhalerUsed ? 'Reliever inhaler used.' : 'No inhaler used.'
        })
      });
      if (res.ok) {
        setSymptoms([]);
        setSeverity('mild');
        setInhalerUsed(false);
        fetchSymptoms();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save log.');
    } finally {
      setIsSavingSymptom(false);
    }
  };

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dose || !newMed.frequency) return alert('Please fill all fields');
    setIsSavingMed(true);
    try {
      const res = await fetch('/api/v1/medications', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: newMed.name,
          type: newMed.type,
          dosage: newMed.dose,
          frequency: newMed.frequency
        })
      });
      if (res.ok) {
        setShowAddMed(false);
        setNewMed({ name: '', type: 'Preventer', dose: '', frequency: '' });
        fetchMeds();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingMed(false);
    }
  };

  const handleMarkTaken = async (id: string) => {
    try {
      // Optimistic update
      setMeds(prev => prev.map(m => m.id === id ? { ...m, last_taken: new Date().toISOString() } : m));
      await fetch(`/api/v1/medications/${id}/taken`, {
        method: 'POST',
        headers: getHeaders()
      });
      fetchMeds();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getSeverityString = (sev: string | number) => {
    if (sev === 5 || sev === '5' || sev === 'severe') return 'severe';
    if (sev === 3 || sev === '3' || sev === 'moderate') return 'moderate';
    return 'mild';
  };

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col relative pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-[24px] font-bold text-[#0F172A] mb-1">Health Tracker</h1>
        <p className="text-[14px] text-slate-500 font-medium">Log symptoms and manage medications</p>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('symptoms')}
          className={cn(
            "flex-1 py-3.5 rounded-2xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm border",
            activeTab === 'symptoms' 
              ? "bg-[#0A5D64] text-white border-[#0A5D64]" 
              : "bg-white text-slate-500 border-slate-100"
          )}
        >
          <Activity className="w-4 h-4" />
          Symptoms
        </button>
        <button 
          onClick={() => setActiveTab('medications')}
          className={cn(
            "flex-1 py-3.5 rounded-2xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm border",
            activeTab === 'medications' 
              ? "bg-[#0A5D64] text-white border-[#0A5D64]" 
              : "bg-white text-slate-500 border-slate-100"
          )}
        >
          <Pill className="w-4 h-4" />
          Medications
        </button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-6">
        {activeTab === 'symptoms' ? (
          <div className="space-y-6">
            {/* Symptom Logger Form */}
            <Card className="p-6 rounded-3xl border-none shadow-sm bg-white">
              <h3 className="text-[16px] font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0A5D64]" />
                Log New Episode
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Severity Level</p>
                  <div className="flex gap-2">
                    {(['mild', 'moderate', 'severe'] as const).map(lev => (
                      <button
                        key={lev}
                        onClick={() => setSeverity(lev)}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[13px] font-bold capitalize transition-all border",
                          severity === lev 
                            ? (lev === 'severe' ? "bg-red-50 text-red-600 border-red-100" : "bg-[#EAF1F2] text-[#0A5D64] border-[#D1E0E1]")
                            : "bg-slate-50 text-slate-400 border-transparent"
                        )}
                      >
                        {lev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {['Wheezing', 'Coughing', 'Tight Chest', 'Short of Breath', 'Mucus'].map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={cn(
                          "px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border",
                          symptoms.includes(s)
                            ? "bg-[#0A5D64] text-white border-[#0A5D64]"
                            : "bg-white text-slate-600 border-slate-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[#E0633C]/10 flex items-center justify-center">
                       <Pill className="w-5 h-5 text-[#E0633C]" />
                     </div>
                     <div>
                       <p className="text-[14px] font-bold text-slate-800">Reliever Inhaler Used?</p>
                       <p className="text-[12px] text-slate-400 font-medium">Ventolin / Salbutamol</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => setInhalerUsed(!inhalerUsed)}
                     className={cn(
                       "w-12 h-6 rounded-full relative transition-colors",
                       inhalerUsed ? "bg-[#0A5D64]" : "bg-slate-200"
                     )}
                   >
                     <div className={cn(
                       "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                       inhalerUsed ? "right-1" : "left-1"
                     )} />
                   </button>
                </div>

                <Button 
                  onClick={handleSaveLog}
                  disabled={isSavingSymptom}
                  className="w-full h-14 bg-[#0A5D64] hover:bg-[#07474E] text-white font-bold rounded-2xl shadow-sm text-[15px]"
                >
                  {isSavingSymptom ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Log Entry'}
                </Button>
              </div>
            </Card>

            {/* History List */}
            <div>
               <div className="flex items-center justify-between mb-4 px-1">
                 <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                   <History className="w-5 h-5 text-slate-400" />
                   Recent History
                 </h3>
                 <button className="text-[12px] font-bold text-[#0A5D64]">View All</button>
               </div>
               <div className="space-y-3">
                 {symptomLogs.length === 0 ? (
                   <p className="text-sm text-slate-400 text-center py-4">No recent logs found.</p>
                 ) : (
                   symptomLogs.map(log => (
                     <Card 
                       key={log.id} 
                       onClick={() => setSelectedLog(log)}
                       className="p-4 rounded-2xl border-none shadow-sm bg-white flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                     >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0",
                          getSeverityString(log.severity) === 'severe' ? "bg-red-50" : getSeverityString(log.severity) === 'moderate' ? "bg-orange-50" : "bg-green-50"
                        )}>
                          <Activity className={cn(
                            "w-5 h-5",
                            getSeverityString(log.severity) === 'severe' ? "text-red-500" : getSeverityString(log.severity) === 'moderate' ? "text-orange-500" : "text-green-500"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-[14px] font-bold text-slate-800 capitalize">{getSeverityString(log.severity)} Episode</p>
                            <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-2 whitespace-nowrap">
                              {formatDate(log.created_at).split(', ')[1]}
                            </span>
                          </div>
                          <p className="text-[12px] text-slate-500 font-medium truncate">{log.type}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                     </Card>
                   ))
                 )}
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Medications List */}
            <div className="grid grid-cols-1 gap-4">
              {meds.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No medications added yet.</p>
              ) : (
                meds.map(med => (
                  <Card key={med.id} className="p-5 rounded-3xl border-none shadow-sm bg-white relative overflow-hidden">
                     <div className={cn("absolute top-0 left-0 w-1.5 h-full", med.type === 'Preventer' ? 'bg-blue-500' : 'bg-[#E0633C]')} />
                     <div className="flex items-start justify-between mb-6">
                       <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                           <Pill className="w-6 h-6 text-slate-400" />
                         </div>
                         <div>
                           <h4 className="text-[17px] font-bold text-slate-900">{med.name}</h4>
                           <p className="text-[13px] text-slate-500 font-medium">{med.dose} • {med.frequency}</p>
                         </div>
                       </div>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                         med.type === 'Preventer' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-[#E0633C]/10 text-[#E0633C] border-[#E0633C]/20"
                       )}>
                         {med.type}
                       </span>
                     </div>
  
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium">Last: {formatDate(med.last_taken)}</span>
                       </div>
                       <button 
                          onClick={() => handleMarkTaken(med.id)}
                          className="flex items-center gap-1.5 text-[#0A5D64] font-bold text-[13px] hover:underline bg-[#EAF1F2] px-3 py-1.5 rounded-xl"
                       >
                         <CheckCircle2 className="w-4 h-4" />
                         Taken
                       </button>
                     </div>
                  </Card>
                ))
              )}
            </div>

            <Button 
              onClick={() => setShowAddMed(true)}
              className="w-full h-16 bg-white hover:bg-slate-50 text-[#0A5D64] font-bold rounded-3xl shadow-sm text-[15px] border-2 border-dashed border-slate-200 flex gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Medication
            </Button>

            {/* Daily Adherence Hint */}
            <Card className="p-5 rounded-3xl bg-[#0A5D64] border-none shadow-md text-white overflow-hidden relative">
               <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
               <div className="relative z-10">
                 <h4 className="text-[16px] font-bold mb-1">Consistency is key!</h4>
                 <p className="text-[13px] opacity-80 leading-relaxed max-w-[200px]">
                   Taking your preventer regularly reduces your risk of an attack by up to 60%.
                 </p>
               </div>
            </Card>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <Card className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4 capitalize">{getSeverityString(selectedLog.severity)} Episode</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time Logged</p>
                <p className="text-sm font-medium text-slate-800">{formatDate(selectedLog.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Symptoms Experienced</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLog.type.split(', ').map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedLog.notes || 'No additional notes provided.'}
                </p>
              </div>
            </div>
            
            <Button onClick={() => setSelectedLog(null)} className="w-full mt-6 bg-[#0A5D64] hover:bg-[#07474E] text-white rounded-xl h-12 font-bold">
              Close Details
            </Button>
          </Card>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6 pb-0">
          <Card className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add Medication</h3>
              <button onClick={() => setShowAddMed(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddMed} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Medication Name</label>
                <input 
                  type="text" 
                  value={newMed.name}
                  onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0A5D64] focus:ring-1 focus:ring-[#0A5D64]"
                  placeholder="e.g. Ventolin"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Type</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setNewMed({...newMed, type: 'Reliever'})} className={cn("flex-1 h-10 rounded-lg text-xs font-bold border transition-colors", newMed.type === 'Reliever' ? "bg-[#E0633C]/10 text-[#E0633C] border-[#E0633C]/30" : "bg-slate-50 text-slate-500 border-slate-200")}>Reliever</button>
                  <button type="button" onClick={() => setNewMed({...newMed, type: 'Preventer'})} className={cn("flex-1 h-10 rounded-lg text-xs font-bold border transition-colors", newMed.type === 'Preventer' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200")}>Preventer</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dosage</label>
                <input 
                  type="text" 
                  value={newMed.dose}
                  onChange={(e) => setNewMed({...newMed, dose: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0A5D64] focus:ring-1 focus:ring-[#0A5D64]"
                  placeholder="e.g. 2 puffs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Frequency</label>
                <input 
                  type="text" 
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0A5D64] focus:ring-1 focus:ring-[#0A5D64]"
                  placeholder="e.g. As needed"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isSavingMed} className="w-full h-14 bg-[#0A5D64] hover:bg-[#07474E] text-white font-bold rounded-2xl shadow-sm text-[15px]">
                  {isSavingMed ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Medication'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Health;

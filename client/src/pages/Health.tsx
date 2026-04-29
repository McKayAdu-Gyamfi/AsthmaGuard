import { useState } from 'react';
import { Pill, Activity, Plus, Clock, CheckCircle2, ChevronRight, History, Trash2, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Health = () => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'medications'>('symptoms');
  
  // Symptoms State
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inhalerUsed, setInhalerUsed] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState([
    { id: '1', date: 'Oct 24, 2024', time: '10:30 AM', severity: 'moderate', symptoms: ['Wheezing', 'Shortness of breath'] },
    { id: '2', date: 'Oct 23, 2024', time: '08:15 PM', severity: 'mild', symptoms: ['Coughing'] }
  ]);

  // Medications State
  const [meds, setMeds] = useState([
    { id: '1', name: 'Symbicort', type: 'Preventer', dose: '2 puffs', frequency: 'Daily', lastTaken: '08:00 AM Today', color: 'bg-blue-500' },
    { id: '2', name: 'Ventolin', type: 'Reliever', dose: '1-2 puffs', frequency: 'As needed', lastTaken: 'Yesterday, 04:30 PM', color: 'bg-[#E0633C]' }
  ]);

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const handleMarkTaken = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, lastTaken: 'Just now' } : m));
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

                <Button className="w-full h-14 bg-[#0A5D64] hover:bg-[#07474E] text-white font-bold rounded-2xl shadow-sm text-[15px]">
                  Save Log Entry
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
                 {symptomLogs.map(log => (
                   <Card key={log.id} className="p-4 rounded-2xl border-none shadow-sm bg-white flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0",
                        log.severity === 'severe' ? "bg-red-50" : log.severity === 'moderate' ? "bg-orange-50" : "bg-green-50"
                      )}>
                        <Activity className={cn(
                          "w-5 h-5",
                          log.severity === 'severe' ? "text-red-500" : log.severity === 'moderate' ? "text-orange-500" : "text-green-500"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-[14px] font-bold text-slate-800 capitalize">{log.severity} Episode</p>
                          <span className="text-[11px] font-bold text-slate-400">{log.time}</span>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium">{log.symptoms.join(', ')}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                   </Card>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Medications List */}
            <div className="grid grid-cols-1 gap-4">
              {meds.map(med => (
                <Card key={med.id} className="p-5 rounded-3xl border-none shadow-sm bg-white relative overflow-hidden">
                   <div className={cn("absolute top-0 left-0 w-1.5 h-full", med.color)} />
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
                        <span className="text-[12px] font-medium">Last taken: {med.lastTaken}</span>
                     </div>
                     <button 
                        onClick={() => handleMarkTaken(med.id)}
                        className="flex items-center gap-1.5 text-[#0A5D64] font-bold text-[13px] hover:underline"
                     >
                       <CheckCircle2 className="w-4 h-4" />
                       Mark Taken
                     </button>
                   </div>
                </Card>
              ))}
            </div>

            <Button className="w-full h-16 bg-white hover:bg-slate-50 text-[#0A5D64] font-bold rounded-3xl shadow-sm text-[15px] border-2 border-dashed border-slate-200 flex gap-2">
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
    </div>
  );
};

export default Health;

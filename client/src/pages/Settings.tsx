import React from 'react';

const Settings = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 max-w-2xl mx-auto mt-4">
      <h2 className="text-[22px] font-bold text-slate-800 mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Account Overview</h3>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600">Email Notifications</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600">Push Notifications</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Privacy & Security</h3>
          <button className="text-[#0A5D64] hover:underline font-medium block py-2">Change Password</button>
          <button className="text-[#0A5D64] hover:underline font-medium block py-2">Data Export</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

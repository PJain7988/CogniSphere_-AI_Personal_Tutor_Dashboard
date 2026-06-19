import React, { useState, useEffect } from 'react';
import { Save, User, Sliders, Shield, Bell, Key, Download } from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useApp } from '../lib/AppContext';

export default function Settings() {
  const { profile, updateProfile, showToast } = useApp();

  // Local form states initialized with profile data
  const [name, setName] = useState(profile.name);
  const [difficulty, setDifficulty] = useState(profile.difficulty);
  const [goals, setGoals] = useState(profile.goals);
  
  const [reminders, setReminders] = useState(profile.notifications.reminders);
  const [streaks, setStreaks] = useState(profile.notifications.streaks);
  const [rec, setRec] = useState(profile.notifications.recommendations);
  const [rep, setRep] = useState(profile.notifications.reports);

  // Re-sync form whenever the global profile changes (e.g. after onboarding or reset)
  useEffect(() => {
    setName(profile.name);
    setDifficulty(profile.difficulty);
    setGoals(profile.goals);
    setReminders(profile.notifications.reminders);
    setStreaks(profile.notifications.streaks);
    setRec(profile.notifications.recommendations);
    setRep(profile.notifications.reports);
  }, [profile]);

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Name field cannot be left blank', 'info');
      return;
    }
    
    updateProfile({
      name: name.trim(),
      difficulty: difficulty as any,
      goals: goals.trim(),
      notifications: {
        reminders,
        streaks,
        recommendations: rec,
        reports: rep
      }
    });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile, timestamp: new Date() }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cognisphere_profile_${profile.name.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Student learning data exported successfully!', 'success');
  };

  const handleChangePassword = () => {
    const newPass = prompt("Enter your new password:");
    if (newPass) {
      showToast('Password updated successfully!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Preferences Section */}
      <Card className="bg-white border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <User className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">User Preferences</h3>
            <p className="text-[10px] text-slate-400 font-medium">Update your public credentials and difficulty track</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="name">
              Display name
            </label>
            <Input 
              id="name" 
              placeholder="Your name" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="py-2 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="level">
              Preferred difficulty
            </label>
            <select 
              id="level" 
              className="input select py-2 text-sm font-medium" 
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as any)}
            >
              {['Auto', 'Beginner', 'Intermediate', 'Advanced'].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="goals">
              Learning goals
            </label>
            <textarea 
              id="goals" 
              className="input min-h-[100px] py-2.5 text-sm resize-none font-medium leading-relaxed" 
              placeholder="Describe your learning objectives..." 
              value={goals}
              onChange={e => setGoals(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave}
            className="btn-primary text-xs font-bold px-5 py-2.5 gap-2 flex items-center shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </Card>

      {/* Notifications Configuration */}
      <Card className="bg-white border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Notification Alerts</h3>
            <p className="text-[10px] text-slate-400 font-medium">Manage how you receive activity and syllabus reminders</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="h-4.5 w-4.5 accent-primary rounded cursor-pointer" 
              checked={reminders}
              onChange={e => setReminders(e.target.checked)}
              aria-label="Lesson reminders" 
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 block">Lesson reminders</span>
              <span className="text-[10px] text-slate-400 font-medium">Get notifications prior to your booked sessions.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="h-4.5 w-4.5 accent-primary rounded cursor-pointer" 
              checked={streaks}
              onChange={e => setStreaks(e.target.checked)}
              aria-label="Streak updates" 
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 block">Streak updates</span>
              <span className="text-[10px] text-slate-400 font-medium">Warnings before streak thresholds lapse.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="h-4.5 w-4.5 accent-primary rounded cursor-pointer" 
              checked={rec}
              onChange={e => setRec(e.target.checked)}
              aria-label="New recommendations" 
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 block">New recommendations</span>
              <span className="text-[10px] text-slate-400 font-medium">Weekly AI generated custom learning cards.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="h-4.5 w-4.5 accent-primary rounded cursor-pointer" 
              checked={rep}
              onChange={e => setRep(e.target.checked)}
              aria-label="Weekly report" 
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 block">Weekly progress reports</span>
              <span className="text-[10px] text-slate-400 font-medium">In-depth statistical reports emailed on Sundays.</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Account actions */}
      <Card className="bg-white border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Account Credentials</h3>
            <p className="text-[10px] text-slate-400 font-medium">Update system configurations and backup syllabus profiles</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleChangePassword} 
            variant="outline"
            className="text-xs font-bold gap-1.5 flex items-center py-2 border-slate-200"
          >
            <Key className="h-4 w-4 text-slate-400" />
            <span>Change password</span>
          </Button>

          <Button 
            onClick={handleExport} 
            variant="outline"
            className="text-xs font-bold gap-1.5 flex items-center py-2 border-slate-200"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export database profile</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

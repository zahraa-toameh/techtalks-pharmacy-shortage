import { Settings as SettingsIcon, Bell } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
        <div>
            <h1 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Settings
            </h1>
            <p className="text-slate-400 mt-2">Manage your preferences and account settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
            {/* Notification Settings */}
            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
                {['Email Alerts', 'SMS Alerts', 'Push Notifications', 'Weekly Digest'].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-white font-medium">{pref}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
                ))}
            </div>
            </div>

            {/* Account Settings */}
            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-teal-400" />
                <h2 className="text-xl font-bold text-white">Account Settings</h2>
            </div>
            <div className="space-y-4">
                <div>
                <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                <input type="email" defaultValue="pharmacist@mediAlert.pro" className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none transition" />
                </div>
                <div>
                <label className="block text-sm text-slate-400 mb-2">Pharmacy Name</label>
                <input type="text" defaultValue="Central Pharmacy" className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none transition" />
                </div>
            </div>
            </div>
        </div>

        <button className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg font-bold transition">
            Save Changes
        </button>
        </div>
    );
}
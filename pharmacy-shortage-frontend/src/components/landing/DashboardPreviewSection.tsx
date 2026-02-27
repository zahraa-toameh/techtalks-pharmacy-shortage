import { useState } from 'react';

// --- DUMMY DATA DEFINITIONS ---
const KPI_DATA = [
    { label: 'Active Shortages', value: '12', color: 'text-red-400' },
    { label: 'Predictions', value: '47', color: 'text-amber-400' },
    { label: 'Pharmacies Alerted', value: '328', color: 'text-emerald-400' },
    { label: 'Prediction Accuracy', value: '99.2%', color: 'text-blue-400' }
];

const RISK_MEDICATIONS = [
    { name: 'Amoxicillin 500mg', risk: 95 },
    { name: 'Metformin 1000mg', risk: 87 },
    { name: 'Lisinopril 10mg', risk: 72 },
    { name: 'Albuterol Inhaler', risk: 68 }
];

const ANALYTICS_MONTHS = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 55 }
];

const RECENT_ALERTS = [
    { med: 'Amoxicillin', severity: 'CRITICAL', time: '2 hours ago', bg: 'bg-red-500/20', text: 'text-red-300' },
    { med: 'Metformin', severity: 'HIGH', time: '5 hours ago', bg: 'bg-orange-500/20', text: 'text-orange-300' },
    { med: 'Lisinopril', severity: 'MEDIUM', time: '12 hours ago', bg: 'bg-yellow-500/20', text: 'text-yellow-300' }
];

// --- COMPONENT ---
export default function DashboardPreview() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <section id="dashboard" className="relative z-10 container py-24">
            <h2 className="text-5xl font-black mb-4 bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent text-center ">
            Intelligent Dashboard
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                {/* Dashboard Header/Tabs */}
                <div className="border-b border-slate-800 p-6 flex justify-between items-center bg-slate-900/50">
                    <div className="flex gap-4">
                        {['dashboard', 'analytics', 'alerts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                            activeTab === tab 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                </div>

                <div className="p-8">
                {/* TAB 1: DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {KPI_DATA.map((kpi, i) => (
                            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-2">{kpi.label}</div>
                                <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
                            </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                            <h4 className="font-bold mb-6 text-emerald-400">Shortage Trend (30 days)</h4>
                            <div className="h-48 relative">
                                <svg viewBox="0 0 400 200" className="w-full h-full">
                                <polyline
                                    points="0,150 50,130 100,110 150,140 200,90 250,70 300,95 350,65 400,80"
                                    fill="none"
                                    stroke="url(#dashGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#14b8a6" />
                                    </linearGradient>
                                </defs>
                                </svg>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                            <h4 className="font-bold mb-6 text-emerald-400">Top Risk Medications</h4>
                            <div className="space-y-4">
                                {RISK_MEDICATIONS.map((med, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">{med.name}</span>
                                    <span className="text-emerald-400 font-bold">{med.risk}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                                        style={{ width: `${med.risk}%` }}
                                    />
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* TAB 2: ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6 animate-fadeIn">
                    <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                        <h4 className="font-bold mb-8 text-emerald-400">Monthly Demand Pattern Analysis</h4>
                        <div className="grid grid-cols-4 gap-8">
                        {ANALYTICS_MONTHS.map((item) => (
                            <div key={item.month} className="text-center group">
                            <div className="h-40 bg-slate-800/50 rounded-xl mb-4 relative overflow-hidden flex items-end">
                                <div
                                className="w-full bg-linear-to-t from-emerald-600/40 to-teal-400/20 group-hover:from-emerald-500/60 transition-all duration-500"
                                style={{ height: `${item.value}%` }}
                                />
                            </div>
                            <div className="text-sm font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                                {item.month}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                )}

                {/* TAB 3: ALERTS */}
                {activeTab === 'alerts' && (
                    <div className="space-y-4 animate-fadeIn">
                    {RECENT_ALERTS.map((alert, i) => (
                        <div 
                        key={i} 
                        className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex justify-between items-center hover:border-emerald-500/40 transition-all group"
                        >
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-10 rounded-full ${alert.bg.replace('/20', '')}`} />
                            <div>
                            <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{alert.med}</div>
                            <div className="text-xs text-slate-500 font-medium">{alert.time}</div>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 ${alert.bg} ${alert.text} rounded-full font-black text-xs tracking-widest`}>
                            {alert.severity}
                        </span>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
        </section>
    );
}
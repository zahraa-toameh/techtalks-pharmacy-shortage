//2
// src/components/pages/DashboardHome.tsx
import { TrendingUp, AlertTriangle, Package, Clock, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardHome() {
  // Sample data
  const metrics = [
    {
      title: 'Active Shortages',
      value: '12',
      change: '+3',
      isNegative: true,
      icon: AlertTriangle,
      color: 'red',
      description: 'Medications running low'
    },
    {
      title: 'Stock Alerts',
      value: '27',
      change: '+5',
      isNegative: true,
      icon: Package,
      color: 'amber',
      description: 'Need attention'
    },
    {
      title: 'Prediction Accuracy',
      value: '99.2%',
      change: '+0.3%',
      isNegative: false,
      icon: TrendingUp,
      color: 'emerald',
      description: 'vs last month'
    },
    {
      title: 'Avg Lead Time',
      value: '4.2d',
      change: '-0.5d',
      isNegative: false,
      icon: Clock,
      color: 'blue',
      description: 'From suppliers'
    },
  ];

  const recentAlerts = [
    { id: 1, drug: 'Amoxicillin 500mg', severity: 'CRITICAL', time: '2 hours ago', status: 'active' },
    { id: 2, drug: 'Metformin 1000mg', severity: 'HIGH', time: '4 hours ago', status: 'active' },
    { id: 3, drug: 'Lisinopril 10mg', severity: 'MEDIUM', time: '6 hours ago', status: 'acknowledged' },
    { id: 4, drug: 'Albuterol Inhaler', severity: 'LOW', time: '1 day ago', status: 'resolved' },
  ];

  const topMedications = [
    { name: 'Amoxicillin 500mg', risk: 95, demand: 120, stock: 15 },
    { name: 'Metformin 1000mg', risk: 87, demand: 98, stock: 32 },
    { name: 'Lisinopril 10mg', risk: 72, demand: 85, stock: 48 },
    { name: 'Aspirin 100mg', risk: 45, demand: 65, stock: 150 },
    { name: 'Ibuprofen 400mg', risk: 38, demand: 45, stock: 200 },
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-400';
    if (risk >= 60) return 'text-amber-400';
    if (risk >= 40) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  // const getRiskBgColor = (risk: number) => {
  //   if (risk >= 80) return 'bg-red-500/10 border-red-500/30';
  //   if (risk >= 60) return 'bg-amber-500/10 border-amber-500/30';
  //   if (risk >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
  //   return 'bg-emerald-500/10 border-emerald-500/30';
  // };

  return (
    <div className="space-y-6 overflow-y-auto h-full bg-slate-950 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-2">Welcome back, John! Here's what's happening today.</p>
        </div>
        <button className="mt-4 md:mt-0 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg font-semibold transition shadow-lg hover:shadow-emerald-500/50">
          Generate Report
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            red: 'from-red-500/20 to-red-600/10 border-red-500/30',
            amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
            emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
            blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
          };

          const textClasses = {
            red: 'text-red-400',
            amber: 'text-amber-400',
            emerald: 'text-emerald-400',
            blue: 'text-blue-400',
          };

          return (
            <div
              key={index}
              className={`group p-6 bg-linear-to-br ${colorClasses[metric.color as keyof typeof colorClasses]} border rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-${metric.color}-500/20 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${metric.color}-500/20 border border-${metric.color}-500/50`}>
                  <Icon className={`w-6 h-6 ${textClasses[metric.color as keyof typeof textClasses]}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${metric.isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                  {metric.isNegative ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-sm text-slate-400 font-semibold">{metric.title}</h3>
              <p className="text-3xl font-black text-white mt-2">{metric.value}</p>
              <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="lg:col-span-2 p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Recent Alerts
            </h2>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 transition font-semibold">
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'CRITICAL' ? 'bg-red-500' :
                    alert.severity === 'HIGH' ? 'bg-amber-500' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-sm">{alert.drug}</p>
                    <p className="text-xs text-slate-400">{alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                    alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className={`text-xs font-semibold ${
                    alert.status === 'active' ? 'text-red-400' :
                    alert.status === 'acknowledged' ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            Quick Stats
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-sm text-slate-400">Medications Monitored</p>
              <p className="text-2xl font-black text-emerald-400 mt-2">847</p>
              <p className="text-xs text-emerald-400/70 mt-1">+12 this week</p>
            </div>

            <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <p className="text-sm text-slate-400">Total Pharmacies</p>
              <p className="text-2xl font-black text-teal-400 mt-2">24</p>
              <p className="text-xs text-teal-400/70 mt-1">All connected</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-slate-400">Avg Response Time</p>
              <p className="text-2xl font-black text-amber-400 mt-2">2.3h</p>
              <p className="text-xs text-amber-400/70 mt-1">To restocks</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-slate-400">Data Sync Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm font-bold text-emerald-400">Real-time</p>
              </div>
              <p className="text-xs text-blue-400/70 mt-1">Last sync: now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Risk Medications */}
      <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Risk Medications
          </h2>
          <button className="text-sm text-emerald-400 hover:text-emerald-300 transition font-semibold">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-400">Medication</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-400">Risk Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-400">Daily Demand</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-400">Current Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {topMedications.map((med, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-4 font-semibold">{med.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden max-w-xs">
                        <div
                          className={`h-full rounded-full ${
                            med.risk >= 80 ? 'bg-linear-to-r from-red-500 to-red-600' :
                            med.risk >= 60 ? 'bg-linear-to-r from-amber-500 to-amber-600' :
                            'bg-linear-to-r from-yellow-500 to-yellow-600'
                          }`}
                          style={{ width: `${med.risk}%` }}
                        />
                      </div>
                      <span className={`font-bold ${getRiskColor(med.risk)}`}>{med.risk}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{med.demand} units</td>
                  <td className={`px-4 py-4 font-bold ${med.stock < 30 ? 'text-red-400' : med.stock < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {med.stock}
                  </td>
                  <td className="px-4 py-4">
                    <button className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition text-xs font-semibold">
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
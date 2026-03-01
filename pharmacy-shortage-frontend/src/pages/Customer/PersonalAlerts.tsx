// src/pages/customer/PersonalAlerts.tsx
/**
 * Personal Alerts Component
 * - User's tracked medications
 * - Shortage notifications
 * - Back-in-stock alerts
 * - Price change alerts
 */

import { Trash2, Bell, Check, Plus } from 'lucide-react';

export default function PersonalAlerts() {
  const alerts = [
    {
      id: 1,
      medication: 'Amoxicillin 500mg',
      type: 'shortage_warning',
      message: 'Expected low stock in 12 days',
      severity: 'high',
      region: 'Central',
      createdAt: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      medication: 'Lisinopril 10mg',
      type: 'stock_alert',
      message: 'Will be out of stock soon',
      severity: 'critical',
      region: 'North',
      createdAt: '6 hours ago',
      status: 'active',
    },
    {
      id: 3,
      medication: 'Metformin 1000mg',
      type: 'price_change',
      message: 'Price dropped by $2.50',
      severity: 'info',
      region: 'All Regions',
      createdAt: '1 day ago',
      status: 'read',
    },
    {
      id: 4,
      medication: 'Aspirin 500mg',
      type: 'back_in_stock',
      message: 'Now available at 3 pharmacies',
      severity: 'medium',
      region: 'South',
      createdAt: '2 days ago',
      status: 'read',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent mb-2">
          My Alerts
        </h2>
        <p className="text-slate-400">Stay informed about medications you're tracking</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              alert.status === 'active'
                ? 'bg-linear-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50'
                : 'bg-slate-900/30 border-slate-800/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{alert.medication}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-2">{alert.message}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Region: {alert.region}</span>
                  <span>•</span>
                  <span>{alert.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {alert.status === 'active' && (
                  <Bell className="w-5 h-5 text-emerald-400 animate-pulse" />
                )}
                {alert.status === 'read' && (
                  <Check className="w-5 h-5 text-slate-600" />
                )}
                <button className="p-2 hover:bg-red-500/10 rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full px-6 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-bold transition flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Add New Alert
      </button>
    </div>
  );
}
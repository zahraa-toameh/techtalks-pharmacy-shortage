//2
// src/components/pages/AlertsPage.tsx
import { useState } from 'react';
import { AlertTriangle, Search, Filter, Clock, Eye } from 'lucide-react';

type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'all';
type StatusType = 'active' | 'acknowledged' | 'resolved' | 'all';

export default function AlertsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityType>('all');
    const [statusFilter, setStatusFilter] = useState<StatusType>('all');
    const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);

    // Sample alert data
    const alerts = [
        {
        id: 1,
        medication: 'Amoxicillin 500mg',
        severity: 'CRITICAL' as const,
        status: 'active' as const,
        pharmacy: 'Central Medical Center',
        daysUntilOut: 3,
        currentStock: 45,
        dailyUsage: 15,
        predictedOutDate: '2024-02-28',
        confidence: 99.2,
        createdAt: '2024-02-25 14:30',
        lastUpdated: '2024-02-25 16:45',
        },
        {
        id: 2,
        medication: 'Metformin 1000mg',
        severity: 'HIGH' as const,
        status: 'active' as const,
        pharmacy: 'Downtown Pharmacy',
        daysUntilOut: 5,
        currentStock: 87,
        dailyUsage: 18,
        predictedOutDate: '2024-03-01',
        confidence: 95.8,
        createdAt: '2024-02-24 09:15',
        lastUpdated: '2024-02-25 15:20',
        },
        {
        id: 3,
        medication: 'Lisinopril 10mg',
        severity: 'MEDIUM' as const,
        status: 'acknowledged' as const,
        pharmacy: 'Westside Medical',
        daysUntilOut: 8,
        currentStock: 156,
        dailyUsage: 20,
        predictedOutDate: '2024-03-04',
        confidence: 92.1,
        createdAt: '2024-02-23 11:45',
        lastUpdated: '2024-02-25 10:10',
        },
        {
        id: 4,
        medication: 'Aspirin 100mg',
        severity: 'LOW' as const,
        status: 'resolved' as const,
        pharmacy: 'North Plaza Pharmacy',
        daysUntilOut: 12,
        currentStock: 234,
        dailyUsage: 19,
        predictedOutDate: '2024-03-08',
        confidence: 88.5,
        createdAt: '2024-02-22 08:30',
        lastUpdated: '2024-02-25 09:00',
        },
        {
        id: 5,
        medication: 'Ibuprofen 400mg',
        severity: 'CRITICAL' as const,
        status: 'active' as const,
        pharmacy: 'East Side Health',
        daysUntilOut: 2,
        currentStock: 28,
        dailyUsage: 14,
        predictedOutDate: '2024-02-27',
        confidence: 98.9,
        createdAt: '2024-02-25 12:00',
        lastUpdated: '2024-02-25 17:30',
        },
        {
        id: 6,
        medication: 'Omeprazole 20mg',
        severity: 'MEDIUM' as const,
        status: 'acknowledged' as const,
        pharmacy: 'Central Medical Center',
        daysUntilOut: 10,
        currentStock: 198,
        dailyUsage: 20,
        predictedOutDate: '2024-03-06',
        confidence: 91.3,
        createdAt: '2024-02-21 14:15',
        lastUpdated: '2024-02-25 11:45',
        },
    ];

    // Filter alerts
    const filteredAlerts = alerts.filter((alert) => {
        const matchesSearch =
        alert.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.pharmacy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
        case 'CRITICAL':
            return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/30 text-red-300' };
        case 'HIGH':
            return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/30 text-amber-300' };
        case 'MEDIUM':
            return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/30 text-yellow-300' };
        case 'LOW':
            return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/30 text-emerald-300' };
        default:
            return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400', badge: 'bg-slate-500/30 text-slate-300' };
        }
    };

    const toggleAlert = (id: number) => {
        setSelectedAlerts((prev) =>
        prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
        );
    };

    const toggleAllAlerts = () => {
        if (selectedAlerts.length === filteredAlerts.length) {
        setSelectedAlerts([]);
        } else {
        setSelectedAlerts(filteredAlerts.map((a) => a.id));
        }
    };

    return (
        <div className="space-y-6 overflow-y-auto h-full bg-slate-950 no-scrollbar">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
            <h1 className="text-4xl font-black bg-linear-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                Shortage Alerts
            </h1>
            <p className="text-slate-400 mt-2">Manage and monitor medication shortage predictions</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-slate-600 hover:border-emerald-500/50 text-sm font-semibold transition">
                Export
            </button>
            <button className="px-4 py-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-sm font-semibold transition">
                Mark as Read
            </button>
            </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Critical', value: '2', color: 'red' },
            { label: 'High', value: '1', color: 'amber' },
            { label: 'Medium', value: '2', color: 'yellow' },
            { label: 'Low', value: '1', color: 'emerald' },
            ].map((stat) => (
            <div
                key={stat.label}
                className={`p-4 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
            >
                <p className={`text-sm text-${stat.color}-400`}>{stat.label} Alerts</p>
                <p className={`text-2xl font-black text-${stat.color}-400 mt-2`}>{stat.value}</p>
            </div>
            ))}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder="Search medications or pharmacies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none transition"
            />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Severity:</span>
            </div>
            {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((severity) => (
                <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    severityFilter === severity
                    ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-800/30 text-slate-300 border border-slate-700/50 hover:border-slate-600/50'
                }`}
                >
                {severity === 'all' ? 'All' : severity}
                </button>
            ))}

            <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-slate-400">Status:</span>
            </div>
            {(['all', 'active', 'acknowledged', 'resolved'] as const).map((status) => (
                <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    statusFilter === status
                    ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-800/30 text-slate-300 border border-slate-700/50 hover:border-slate-600/50'
                }`}
                >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
            ))}
            </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
            {/* Header with Select All */}
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400">
            <input
                type="checkbox"
                checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                onChange={toggleAllAlerts}
                className="w-4 h-4 rounded border-slate-600 cursor-pointer"
            />
            <span>Select all {filteredAlerts.length} alerts</span>
            </div>

            {/* Alert Items */}
            {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
                const colors = getSeverityColor(alert.severity);
                const isSelected = selectedAlerts.includes(alert.id);

                return (
                <div
                    key={alert.id}
                    className={`group p-5 bg-linear-to-r ${colors.bg} border ${colors.border} rounded-xl hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer ${
                    isSelected ? 'ring-2 ring-emerald-500/50' : ''
                    }`}
                    onClick={() => toggleAlert(alert.id)}
                >
                    <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                        e.stopPropagation();
                        toggleAlert(alert.id);
                        }}
                        className="w-5 h-5 rounded border-slate-600 cursor-pointer mt-1"
                    />

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-lg">{alert.medication}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                            {alert.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.status === 'active' ? 'bg-red-500/20 text-red-300' :
                            alert.status === 'acknowledged' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-emerald-500/20 text-emerald-300'
                        }`}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-slate-400">Pharmacy</p>
                            <p className="font-semibold text-sm mt-1">{alert.pharmacy}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Days Until Out</p>
                            <p className={`font-black text-lg mt-1 ${alert.daysUntilOut <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {alert.daysUntilOut}d
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Current Stock</p>
                            <p className="font-semibold text-sm mt-1">{alert.currentStock} units</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Prediction Confidence</p>
                            <p className="font-semibold text-sm mt-1 text-emerald-400">{alert.confidence}%</p>
                        </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-slate-400">Days remaining until shortage</p>
                            <p className="text-xs font-semibold">Out: {alert.predictedOutDate}</p>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                            className={`h-full rounded-full transition-all ${
                                alert.daysUntilOut <= 3 ? 'bg-linear-to-r from-red-500 to-red-600' :
                                alert.daysUntilOut <= 7 ? 'bg-linear-to-r from-amber-500 to-amber-600' :
                                'bg-linear-to-r from-yellow-500 to-yellow-600'
                            }`}
                            style={{ width: `${(alert.daysUntilOut / 30) * 100}%` }}
                            />
                        </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created: {alert.createdAt}
                            </span>
                            <span>Updated: {alert.lastUpdated}</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition text-xs font-semibold">
                            Reorder
                            </button>
                            <button className="px-3 py-1 rounded bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 transition text-xs font-semibold flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Details
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                );
            })
            ) : (
            <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400">No alerts match your filters</p>
            </div>
            )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedAlerts.length > 0 && (
            <div className="sticky bottom-0 p-4 bg-slate-900/95 border-t border-slate-700/50 rounded-t-lg flex items-center justify-between">
            <p className="text-sm font-semibold">{selectedAlerts.length} alert(s) selected</p>
            <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-sm font-semibold transition">
                Mark as Acknowledged
                </button>
                <button className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-semibold transition">
                Create Reorder
                </button>
            </div>
            </div>
        )}
        </div>
    );
}
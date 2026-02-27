//2
// src/pages/dashboard/MedicalStockPage.tsx
/**
 * Medical Stock Management Page - Inventory tracking and management
 */

import { useState } from 'react';
import {
    Pill,
    Plus,
    Search,
    Download,
    Edit,
    Trash2,
    ChevronDown,
    AlertTriangle,
} from 'lucide-react';

interface StockItem {
    id: number;
    medication: string;
    dosage: string;
    strength: string;
    quantity: number;
    reorderPoint: number;
    dailyUsage: number;
    daysRemaining: number;
    status: 'optimal' | 'low' | 'critical';
    lastRestocked: string;
    supplier: string;
    expiryDate: string;
}

export default function MedicalStockPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const stockItems: StockItem[] = [
        {
        id: 1,
        medication: 'Amoxicillin',
        dosage: 'Tablet',
        strength: '500mg',
        quantity: 450,
        reorderPoint: 500,
        dailyUsage: 45,
        daysRemaining: 10,
        status: 'critical',
        lastRestocked: '2024-02-28',
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        },
        {
        id: 2,
        medication: 'Metformin',
        dosage: 'Tablet',
        strength: '1000mg',
        quantity: 1200,
        reorderPoint: 800,
        dailyUsage: 30,
        daysRemaining: 40,
        status: 'low',
        lastRestocked: '2024-02-15',
        supplier: 'GenericMeds Inc',
        expiryDate: '2025-11-15',
        },
        {
        id: 3,
        medication: 'Lisinopril',
        dosage: 'Tablet',
        strength: '10mg',
        quantity: 2500,
        reorderPoint: 1000,
        dailyUsage: 25,
        daysRemaining: 100,
        status: 'optimal',
        lastRestocked: '2024-03-01',
        supplier: 'HealthCare Supplies',
        expiryDate: '2025-09-30',
        },
        {
        id: 4,
        medication: 'Albuterol',
        dosage: 'Inhaler',
        strength: '100mcg',
        quantity: 180,
        reorderPoint: 200,
        dailyUsage: 15,
        daysRemaining: 12,
        status: 'low',
        lastRestocked: '2024-02-20',
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2024-08-15',
        },
        {
        id: 5,
        medication: 'Aspirin',
        dosage: 'Tablet',
        strength: '500mg',
        quantity: 3500,
        reorderPoint: 1500,
        dailyUsage: 50,
        daysRemaining: 70,
        status: 'optimal',
        lastRestocked: '2024-02-25',
        supplier: 'GenericMeds Inc',
        expiryDate: '2026-01-20',
        },
        {
        id: 6,
        medication: 'Ibuprofen',
        dosage: 'Tablet',
        strength: '400mg',
        quantity: 2800,
        reorderPoint: 1200,
        dailyUsage: 40,
        daysRemaining: 70,
        status: 'optimal',
        lastRestocked: '2024-02-22',
        supplier: 'HealthCare Supplies',
        expiryDate: '2025-06-30',
        },
    ];

    const filteredItems = stockItems.filter((item) => {
        const matchesSearch =
        item.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.strength.includes(searchTerm);
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'critical':
            return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'low':
            return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        default:
            return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage < 30) return 'bg-red-500';
        if (percentage < 60) return 'bg-orange-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
                Medical Stock
            </h1>
            <p className="text-slate-400 mt-2">Manage inventory and reorder medications</p>
            </div>
            <button className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg font-semibold transition flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Stock
            </button>
        </div>

        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Total Items</p>
            <p className="text-3xl font-black text-white">{stockItems.length}</p>
            <p className="text-xs text-slate-500 mt-2">Medications in stock</p>
            </div>

            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Critical Items</p>
            <p className="text-3xl font-black text-red-400">
                {stockItems.filter((i) => i.status === 'critical').length}
            </p>
            <p className="text-xs text-red-400 mt-2">Require immediate action</p>
            </div>

            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Low Stock</p>
            <p className="text-3xl font-black text-orange-400">
                {stockItems.filter((i) => i.status === 'low').length}
            </p>
            <p className="text-xs text-orange-400 mt-2">Monitor closely</p>
            </div>

            <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Optimal Stock</p>
            <p className="text-3xl font-black text-emerald-400">
                {stockItems.filter((i) => i.status === 'optimal').length}
            </p>
            <p className="text-xs text-emerald-400 mt-2">Sufficient supply</p>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder="Search by medication name or strength..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none transition"
            />
            </div>

            <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-emerald-500/50 focus:outline-none transition"
            >
            <option value="all">All Status</option>
            <option value="optimal">Optimal</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
            </select>

            <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl text-slate-300 font-semibold transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
            </button>
        </div>

        {/* Stock Table */}
        <div className="space-y-3">
            {filteredItems.map((item) => (
            <div
                key={item.id}
                className="border border-slate-700/50 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300"
            >
                {/* Collapsed View */}
                <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full p-6 flex items-center justify-between"
                >
                {/* Medication Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getStatusColor(
                        item.status
                    )}`}
                    >
                    <Pill className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                    <h3 className="font-bold text-white">{item.medication}</h3>
                    <p className="text-sm text-slate-400">
                        {item.strength} • {item.dosage}
                    </p>
                    </div>
                </div>

                {/* Stock Level */}
                <div className="hidden md:flex items-center gap-8 mx-6 shrink-0">
                    <div className="text-right">
                    <p className="text-xs text-slate-400">Current Stock</p>
                    <p className="text-lg font-bold text-white">{item.quantity}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-xs text-slate-400">Daily Usage</p>
                    <p className="text-lg font-bold text-emerald-400">{item.dailyUsage}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-xs text-slate-400">Days Left</p>
                    <p
                        className={`text-lg font-bold ${
                        item.daysRemaining < 30 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                    >
                        {item.daysRemaining}d
                    </p>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                    className={`px-3 py-1 text-xs font-bold rounded-lg border ${getStatusColor(
                        item.status
                    )}`}
                    >
                    {item.status === 'critical'
                        ? 'CRITICAL'
                        : item.status === 'low'
                        ? 'LOW'
                        : 'OPTIMAL'}
                    </span>
                    <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedId === item.id ? 'rotate-180' : ''
                    }`}
                    />
                </div>
                </button>

                {/* Expanded View */}
                {expandedId === item.id && (
                <div className="px-6 pb-6 border-t border-slate-700/50 pt-6 space-y-6">
                    {/* Stock Progress Bar */}
                    <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-white">Stock Level</span>
                        <span className="text-sm text-slate-400">
                        {item.quantity} / {item.reorderPoint} (Reorder Point)
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                        className={`h-full transition-all duration-300 ${getProgressColor(
                            (item.quantity / item.reorderPoint) * 100
                        )}`}
                        style={{
                            width: `${Math.min(
                            (item.quantity / item.reorderPoint) * 100,
                            100
                            )}%`,
                        }}
                        />
                    </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Current Stock</p>
                        <p className="font-bold text-white text-lg">{item.quantity}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Reorder Point</p>
                        <p className="font-bold text-orange-400 text-lg">{item.reorderPoint}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Daily Usage</p>
                        <p className="font-bold text-emerald-400 text-lg">{item.dailyUsage}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Days Remaining</p>
                        <p
                        className={`font-bold text-lg ${
                            item.daysRemaining < 30 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                        >
                        {item.daysRemaining}d
                        </p>
                    </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Last Restocked</p>
                        <p className="text-sm font-semibold text-white">{item.lastRestocked}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Expiry Date</p>
                        <p className="text-sm font-semibold text-white">{item.expiryDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Supplier</p>
                        <p className="text-sm font-semibold text-white">{item.supplier}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Status</p>
                        <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${getStatusColor(
                            item.status
                        )}`}
                        >
                        {item.status === 'critical'
                            ? 'CRITICAL'
                            : item.status === 'low'
                            ? 'LOW'
                            : 'OPTIMAL'}
                        </span>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                    <button className="flex-1 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Stock
                    </button>
                    <button className="flex-1 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </div>

                    {/* Alert if critical */}
                    {item.status === 'critical' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                        <p className="font-semibold text-red-300 mb-1">Critical Stock Level</p>
                        <p className="text-sm text-red-300/80">
                            This medication is below the reorder point. Contact supplier immediately to prevent stockout.
                        </p>
                        </div>
                    </div>
                    )}
                </div>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}
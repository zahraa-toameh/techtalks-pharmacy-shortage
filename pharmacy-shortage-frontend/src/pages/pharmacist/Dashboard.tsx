
//2
// src/pages/Dashboard.tsx
import { useState } from 'react';
import "../../index.css";
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHome from './DashboardHome';
import AlertsPage from './AlertsPage';
import MedicalStockPage from './MedicalstockPage';
import AnalyticsPage from './AnalyticsPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
// import ProfilePage from './';

type PageType = 'home' | 'alerts' | 'stock' | 'analytics' | 'reports' | 'settings' | 'profile';

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const renderPage = () => {
        switch (currentPage) {
        case 'home':
            return <DashboardHome />;
        case 'alerts':
            return <AlertsPage />;
        case 'stock':
            return <MedicalStockPage />;
        case 'analytics':
            return <AnalyticsPage />;
        case 'reports':
            return <ReportsPage />;
        case 'settings':
            return <SettingsPage />;
        //   case 'profile':
        //     return <ProfilePage />;
        default:
            return <DashboardHome />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden no-scrollbar">
        {/* Sidebar */}
        <Sidebar 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden no-scrollbar">
            {/* Top Bar */}
            <div className="h-16 bg-linear-to-r from-slate-900/95 to-slate-800/95 border-b border-slate-700/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition lg:hidden"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>
                <h1 className="text-xl font-bold">MediAlert</h1>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-700/50 rounded-lg transition group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {/* Notification Badge */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-4 border-b border-slate-700/50">
                    <h3 className="font-bold text-sm">Notifications (3)</h3>
                    </div>
                    <div className="divide-y divide-slate-700/30">
                    <div className="p-3 hover:bg-slate-700/30 transition">
                        <p className="text-sm text-emerald-400">✓ Amoxicillin restocked</p>
                        <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 hover:bg-slate-700/30 transition">
                        <p className="text-sm text-red-400">⚠ Metformin low stock</p>
                        <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                    </div>
                    <div className="p-3 hover:bg-slate-700/30 transition">
                        <p className="text-sm text-amber-400">⚡ New prediction available</p>
                        <p className="text-xs text-slate-400 mt-1">30 min ago</p>
                    </div>
                    </div>
                </div>
                </button>

                {/* User Profile */}
                <button 
                onClick={() => setCurrentPage('profile')}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition"
                >
                <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center font-bold text-slate-950 text-sm">
                JD
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold">John Doe</p>
                    <p className="text-xs text-slate-400">Pharmacist</p>
                </div>
                </button>
            </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 container py-8 overflow-auto no-scrollbar">
            {renderPage()}
            </div>
        </div>
        </div>
    );
}
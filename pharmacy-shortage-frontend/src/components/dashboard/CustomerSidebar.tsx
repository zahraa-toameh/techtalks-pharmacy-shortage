// src/components/dashboard/CustomerSidebar.tsx
import { Search, MapPin, TrendingDown, Bell, LogOut, ChevronLeft, ChevronRight, Pill, Settings } from 'lucide-react';

export type CustomerPageType = 'search' | 'availability' | 'predictions' | 'alerts' | 'settings';

interface CustomerSidebarProps {
    currentPage: CustomerPageType;
    onPageChange: (page: CustomerPageType) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export default function CustomerSidebar({ currentPage, onPageChange, isOpen, onToggle }: CustomerSidebarProps) {
    const navItems = [
        { id: 'search', label: 'Find Medicine', icon: Search, description: 'Search & availability' },
        { id: 'availability', label: 'Availability', icon: MapPin, description: 'Regional availability' },
        { id: 'predictions', label: 'Predictions', icon: TrendingDown, description: 'Supply gap forecasts' },
        { id: 'alerts', label: 'My Alerts', icon: Bell, description: 'Personal notifications', badge: 3 },
        { id: 'settings', label: 'Settings', icon: Settings, description: 'Profile & regions' },
    ];

    return (
        <>
        <div className={`fixed lg:relative z-50 h-screen bg-linear-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden lg:overflow-visible flex flex-col`}>
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 shrink-0">
            {isOpen && (
                <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                    <Pill className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                    <h2 className="font-bold text-white text-sm">MediAlert</h2>
                    <p className="text-xs text-emerald-400">Pharmacist Portal</p>
                </div>
                </div>
            )}
            <button onClick={onToggle} className="hidden lg:block p-1 hover:bg-slate-700/50 rounded transition text-slate-400">
                {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 no-scrollbar">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                <button
                    key={item.id}
                    onClick={() => {
                    onPageChange(item.id as CustomerPageType);
                    if (isOpen && window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group relative ${
                    isActive 
                        ? 'bg-linear-to-r from-emerald-500/30 to-teal-600/20 border border-emerald-500/50 text-emerald-400' 
                        : 'text-slate-300 hover:bg-slate-700/30 border border-transparent hover:border-slate-600/50'
                    }`}
                >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && (
                    <div className="text-left flex-1">
                        <p className="font-semibold text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    )}
                    {item.badge && <span className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                </button>
                );
            })}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-700/50 p-4 space-y-2 shrink-0">
            <button className="w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 text-sm font-medium">
                <LogOut className="w-4 h-4" />
                {isOpen && 'Logout'}
            </button>
            </div>
        </div>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs" onClick={onToggle} />}
        </>
    );
}
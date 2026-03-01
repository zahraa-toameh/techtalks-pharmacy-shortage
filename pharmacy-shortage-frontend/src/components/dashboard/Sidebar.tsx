import '../../index.css';
import { Home, AlertTriangle, Package, TrendingUp, FileText, Settings, LogOut, ChevronLeft, ChevronRight, Pill } from 'lucide-react';

export type PageType = 'home' | 'alerts' | 'stock' | 'analytics' | 'reports' | 'settings' | 'profile';

interface NavItem {
    id: PageType; // This forces the IDs to match PageType
    label: string;
    icon: React.ElementType;
    description: string;
    badge?: number;
}

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {

    const navItems: NavItem[] = [
        { id: 'home', label: 'Dashboard', icon: Home, description: 'Overview & Analytics' },
        { id: 'alerts', label: 'Alerts', icon: AlertTriangle, description: 'Shortage Predictions', badge: 3 },
        { id: 'stock', label: 'Medical Stock', icon: Package, description: 'Inventory Management' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Demand & Trends' },
        { id: 'reports', label: 'Reports', icon: FileText, description: 'Generated Reports' },
        { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration' },
    ];

    return (
        <>
        <div className={`fixed lg:relative z-50 h-screen bg-linear-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden lg:overflow-visible flex flex-col`}>
            
            {/* Logo */}
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
                    onPageChange(item.id);
                    if (isOpen && window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group relative ${
                    isActive 
                        ? 'bg-linear-to-r from-emerald-500/30 to-teal-600/20 border border-emerald-500/50 text-emerald-400' 
                        : 'text-slate-300 hover:bg-slate-700/30 border border-transparent hover:border-slate-600/50'
                    }`}
                >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen ? (
                    <>
                        <div className="text-left flex-1">
                        <p className="font-semibold text-sm">{item.label}</p>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300">{item.description}</p>
                        </div>
                        {item.badge && <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold">{item.badge}</span>}
                    </>
                    ) : (
                    item.badge && <span className="absolute right-1 top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                    {isActive && !isOpen && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-emerald-400 to-teal-600 rounded-r" />}
                </button>
                );
            })}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-700/50 p-4 space-y-2 shrink-0">
            <div className={`p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 ${!isOpen && 'hidden lg:block'}`}>
                {isOpen ? (
                <>
                    <p className="text-xs font-semibold text-slate-300">Pharmacy</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter text-[10px]">Central Medical Center</p>
                    <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active
                    </p>
                </>
                ) : (
                <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto animate-pulse shadow-sm shadow-emerald-500/50" />
                )}
            </div>
            <button className="w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 text-sm font-medium">
                <LogOut className="w-4 h-4" />
                {isOpen && 'Logout'}
            </button>
            </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs" onClick={onToggle} />}
        </>
    );
}
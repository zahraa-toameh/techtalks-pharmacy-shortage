//2
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
        <div>
            <h1 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Analytics & Trends
            </h1>
            <p className="text-slate-400 mt-2">Analyze medication shortage patterns and trends</p>
        </div>

        {/* Placeholder Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
            { title: 'Shortage Frequency', icon: BarChart3 },
            { title: 'Demand Trends', icon: TrendingUp },
            { title: 'Regional Analysis', icon: Activity },
            { title: 'Supplier Performance', icon: BarChart3 },
            ].map((item, i) => (
            <div key={i} className="p-8 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center min-h-80">
                <item.icon className="w-12 h-12 text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-slate-400 text-center">Chart visualization will be displayed here</p>
            </div>
            ))}
        </div>
        </div>
    );
}

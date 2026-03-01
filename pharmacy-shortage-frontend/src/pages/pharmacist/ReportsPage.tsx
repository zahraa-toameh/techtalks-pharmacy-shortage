//2
import { FileText, Download} from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
        <div>
            <h1 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Reports
            </h1>
            <p className="text-slate-400 mt-2">Generate and view comprehensive shortage reports</p>
        </div>

        {/* Report Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
            { title: 'Monthly Summary', description: 'Overview of shortages and predictions for the month' },
            { title: 'Regional Analysis', description: 'Breakdown by geographic regions' },
            { title: 'Supplier Performance', description: 'Supplier reliability and delivery metrics' },
            { title: 'Inventory Forecast', description: '90-day inventory and shortage forecast' },
            ].map((report, i) => (
            <div key={i} className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                <FileText className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{report.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{report.description}</p>
                </div>
                </div>
                <button className="w-full px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Generate Report
                </button>
            </div>
            ))}
        </div>
        </div>
    );
}

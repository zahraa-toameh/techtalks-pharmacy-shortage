interface HistoricalDataPoint {
    day: number;
    stock: number;
    usage: number;
    demand: number;
}

interface Medication {
    id: number;
    name: string;
    currentStock: number;
    minThreshold: number;
    maxThreshold: number;
    avgDailyUsage: number;
    category: string;
    historicalData: HistoricalDataPoint[];
    riskLevel: string;
}

interface TrackingPageProps {
    medications: Medication[];
    getStockStatus: (med: Medication) => { status: string; color: string };
    setSelectedMed: (med: Medication) => void;
    setCurrentPage: (page: string) => void;
}

export default function TrackingPage({ 
    medications, 
    getStockStatus, 
    setSelectedMed, 
    setCurrentPage 
}: TrackingPageProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Medication Inventory</h2>
                    <p className="text-slate-500 text-sm">Real-time stock monitoring and distribution</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <input 
                        type="text" 
                        placeholder="Search inventory..." 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map((med: Medication) => {
                    const status = getStockStatus(med);
                    const percentage = Math.min(100, (med.currentStock / med.maxThreshold) * 100);
                    const isLowStock = percentage < 25;
                    
                    return (
                        <div 
                            key={med.id} 
                            onClick={() => {
                                setSelectedMed(med); 
                                setCurrentPage('analysis');
                            }} 
                            className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 cursor-pointer"
                        >
                            {/* Header with status gradient */}
                            <div className={`p-6 bg-linear-to-r ${status.color}`}>
                                <h3 className="text-white font-bold text-lg">{med.name}</h3>
                                <p className="text-white/80 text-[10px] uppercase tracking-widest font-black">{med.category}</p>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Stock Level</span>
                                        <span className="text-2xl font-black text-slate-800">
                                            {med.currentStock} <span className="text-sm font-medium text-slate-400">units</span>
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                        isLowStock ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {Math.round(percentage)}%
                                    </span>
                                </div>

                                {/* Progress Bar Container */}
                                <div className="space-y-2">
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                                                isLowStock ? 'bg-red-500' : 'bg-blue-500'
                                            }`} 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span>Min: {med.minThreshold}</span>
                                        <span>Max: {med.maxThreshold}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
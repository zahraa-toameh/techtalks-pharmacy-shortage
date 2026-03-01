// 1. Define Interfaces
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

interface ShortagePrediction {
    prediction: string; // 'HIGH RISK', 'MODERATE RISK', 'LOW RISK'
    daysToThreshold: number;
    confidence: number;
}

interface PredictionPageProps {
    medications: Medication[];
    predictShortage: (med: Medication) => ShortagePrediction;
    getStockStatus: (med: Medication) => { status: string; color: string };
}

export default function PredictionPage({ 
    medications, 
    predictShortage, 
    getStockStatus 
}: PredictionPageProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Shortage Predictions</h2>
                <p className="text-slate-500 text-sm">AI-driven forecasting based on current consumption rates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {medications.map((med: Medication) => {
                    const prediction = predictShortage(med);
                    const status = getStockStatus(med);
                    
                    return (
                        <div key={med.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className={`p-6 bg-linear-to-r ${status.color}`}>
                                <h3 className="text-white font-bold text-lg">{med.name}</h3>
                                <p className="text-white/80 text-sm font-medium">{med.category}</p>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className={`rounded-xl p-4 border ${
                                    prediction.prediction === 'HIGH RISK' 
                                        ? 'bg-red-50 border-red-100' 
                                        : prediction.prediction === 'MODERATE RISK' 
                                        ? 'bg-amber-50 border-amber-100' 
                                        : 'bg-emerald-50 border-emerald-100'
                                }`}>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">AI Risk Assessment</p>
                                    <p className={`text-2xl font-black ${
                                        prediction.prediction === 'HIGH RISK' ? 'text-red-600' : 
                                        prediction.prediction === 'MODERATE RISK' ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                        {prediction.prediction}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <PredictRow label="Predicted Days to Shortage" value={prediction.daysToThreshold} color="text-blue-600" />
                                    <PredictRow label="Current Stock" value={med.currentStock} />
                                    <PredictRow label="Avg Daily Usage" value={med.avgDailyUsage} />
                                    
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-slate-500 text-sm font-medium">Prediction Confidence</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-linear-to-r from-blue-500 to-cyan-400" 
                                                    style={{ width: `${prediction.confidence}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">
                                                {prediction.confidence}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-all text-white font-bold text-sm shadow-lg shadow-slate-200">
                                    Place Reorder Request
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 2. Sub-component
interface PredictRowProps {
    label: string;
    value: string | number;
    color?: string;
}

function PredictRow({ label, value, color }: PredictRowProps) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
            <span className="text-slate-500 text-sm font-medium">{label}</span>
            <span className={`text-base font-bold ${color || "text-slate-800"}`}>{value}</span>
        </div>
    );
}
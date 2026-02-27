// 1. Define the interface for the props
interface AnalysisCardProps {
    label: string;
    value: string | number;
    unit?: string; // Optional since you have a conditional check for it
    icon: string | React.ReactNode;
}

export function AnalysisCard({ label, value, unit, icon }: AnalysisCardProps) {
    return (
        <div className="rounded-xl border backdrop-blur-sm bg-slate-800/50 border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-400">{label}</h4>
            <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        {unit && <p className="text-sm text-slate-400 mt-1">{unit}</p>}
        </div>
    );
}
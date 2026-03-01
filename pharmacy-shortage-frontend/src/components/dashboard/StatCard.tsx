import { type LucideIcon } from 'lucide-react';

// 1. Define specific types for the props
interface StatCardProps {
    icon: LucideIcon | React.ElementType; // Supports both Lucide icons and general components
    label: string;
    value: string | number;
    subtext?: string; // Optional field
    color: string;
}

export const StatCard = ({ icon: Icon, label, value, subtext, color }: StatCardProps) => (
  // 2. Updated bg-gradient-to-br to bg-linear-to-br
    <div className={`relative p-6 rounded-2xl bg-linear-to-br ${color} text-white shadow-lg overflow-hidden`}>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <Icon className="w-6 h-6 mb-4 opacity-80" />
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-bold">{label}</h4>
        <p className="text-3xl font-black mt-1">{value}</p>
        {subtext && <p className="text-white/60 text-xs mt-1">{subtext}</p>}
    </div>
);
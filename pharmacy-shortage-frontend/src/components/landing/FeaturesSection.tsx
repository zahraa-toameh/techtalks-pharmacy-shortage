import { TrendingUp, MapPin, Clock, BarChart3, Shield, Zap } from 'lucide-react';

// 1. Define the data outside the function
const FEATURES_DATA = [
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Predictive Analytics',
        desc: 'Machine learning models analyze 18+ months of historical data to predict shortages 2-4 weeks in advance'
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        title: 'Regional Intelligence',
        desc: 'Understand shortage patterns by region, dosage, and medication type for targeted planning'
    },
    {
        icon: <Clock className="w-8 h-8" />,
        title: 'Real-Time Alerts',
        desc: 'Get instant notifications via SMS, email, and dashboard when shortages are predicted'
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: 'Demand Analysis',
        desc: 'Track seasonal trends, demographic patterns, and supply chain delays automatically'
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'HIPAA Compliant',
        desc: 'Enterprise-grade security with encrypted data, role-based access, and audit trails'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Integration Ready',
        desc: 'Connect to your POS system, inventory management, and supplier platforms seamlessly'
    }
];

// 2. The Component
export default function FeaturesSection() {
    return (
        <section id="features" className="relative z-10 container py-24">
        <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
            Powerful Prediction Engine
            </h2>
            <p className="text-xl text-slate-300">Advanced analytics meet healthcare innovation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_DATA.map((feature, i) => (
            <div
                key={i}
                className="group p-6 md:p-8 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl transition duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
                <div className="w-12 h-12 bg-linear-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition mb-4">
                {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition">
                {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
                </p>
            </div>
            ))}
        </div>
        </section>
    );
}
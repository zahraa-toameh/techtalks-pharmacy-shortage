import { AlertTriangle, ArrowDown, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const HeroSection = () => {

    return (
        <section id="hero" className="relative z-10 container py-24 lg:py-30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Section - Takes up 7/12 of the space (~60%) */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-6">
                        

                        <h1 className="animate-fade-in opacity-0 text-6xl xl:text-7xl font-black leading-[1.1] bg-linear-to-br from-emerald-200 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                            Stop Medication <br /> Shortages.
                        </h1>
                        <p className="animate-fade-in-delay-1 opacity-0 text-xl text-slate-300 leading-relaxed max-w-2xl">
                            Predict medication shortages before they happen. Real-time alerts, regional analysis, and intelligent inventory planning for modern pharmacies.
                        </p>
                    </div>

                    <div className="animate-fade-in-delay-2 opacity-0 flex flex-wrap gap-4">
                        <Link to="/auth" className="px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl font-bold text-lg transition shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-2 group">
                            Start Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </Link>
                        <button className="px-8 py-4 border-2 border-slate-700 hover:border-emerald-500/50 rounded-xl font-bold text-lg transition hover:bg-emerald-500/5">
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats with a softer separator */}
                    <div className="animate-fade-in-delay-3 opacity-0 grid grid-cols-3 gap-8 border-t border-slate-800/60">
                        {[
                            { num: '99.2%', label: 'Prediction Accuracy' },
                            { num: '2-4 weeks', label: 'Advance Notice' },
                            { num: '500+', label: 'Pharmacies' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-black text-emerald-400">{stat.num}</div>
                                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Takes up 5/12 of the space (~40%) */}
                <div className="animate-fade-in-delay-4 opacity-0 lg:col-span-5 relative">
                    {/* The Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-600/20 to-teal-600/20 rounded-3xl blur-3xl" />
                    
                    {/* The Preview Card */}
                    <div className="relative bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-white text-lg">Critical Shortages</h3>
                                <p className="text-xs text-slate-500">Live regional tracking</p>
                            </div>
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { drug: 'Amoxicillin', risk: 'CRITICAL', regions: 5, color: 'red' },
                                { drug: 'Metformin', risk: 'HIGH', regions: 3, color: 'orange' },
                                { drug: 'Lisinopril', risk: 'MEDIUM', regions: 2, color: 'yellow' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition group">
                                    <div>
                                        <div className="font-bold text-sm text-slate-200">{item.drug}</div>
                                        <div className="text-xs text-slate-500">{item.regions} regions affected</div>
                                    </div>
                                    {/* Fixed dynamic color issue by using a manual check or full class names */}
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter 
                                        ${item.color === 'red' ? 'bg-red-500/10 text-red-400' : ''}
                                        ${item.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : ''}
                                        ${item.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                                    `}>
                                        {item.risk}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Centered Scroll indicator */}
            <div className={`absolute hidden lg:flex lg:bottom-34 lg:left-[56%] transform -translate-x-1/2 flex-col items-center animate-bounce opacity-50 transition-opacity duration-300`}>
                <span className="text-[10px] uppercase tracking-widest font-bold mb-2">Scroll</span>
                <ArrowDown className="h-4 w-4 text-emerald-500" />
            </div>
        </section>
    )
}

export default HeroSection
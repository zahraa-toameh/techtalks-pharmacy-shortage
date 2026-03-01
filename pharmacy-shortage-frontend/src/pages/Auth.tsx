import { useState } from 'react';
import { Pill, User, Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false); // false = Signup, true = Login
    const [role, setRole] = useState<'customer' | 'pharmacist'>('customer');
    const navigate = useNavigate();

    // DUMMY LOGIN HANDLER
    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Redirect logic for dummy login
        if (role === 'pharmacist') {
            navigate('/pharmacist/dashboard');
        } else {
            navigate('/customer/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-y-auto">
        {/* Visual Background Orbs from your theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 w-full max-w-md animate-fadeIn">
            {/* Logo linking back home */}
            <Link to="/" className="flex items-center gap-3 justify-center mb-8 group">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">MediAlert Pro</span>
            </Link>

            <div className="animate-fade-in bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400 text-sm">
                {isLogin 
                    ? 'Enter your credentials to access your dashboard' 
                    : 'Join the network and start predicting shortages'
                }
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleAuth} /*onSubmit={(e) => e.preventDefault()}*/ >
                {/* 1. ROLE SELECTOR */}
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Join As</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('customer')}
                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                                    role === 'customer' 
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                                    : 'border-slate-800 bg-slate-950/30 text-slate-500'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm font-bold">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('pharmacist')}
                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                                    role === 'pharmacist' 
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                                    : 'border-slate-800 bg-slate-950/30 text-slate-500'
                                }`}
                            >
                                <Building2 className="w-4 h-4" />
                                <span className="text-sm font-bold">Pharmacist</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. EMAIL - Using autoComplete="username" to link with password */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            id="email"
                            name="email"
                            type="email" 
                            autoComplete="username"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600" 
                            placeholder="name@pharmacy.com" 
                            required
                        />
                    </div>
                </div>

                {/* 3. PASSWORD */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center ml-1">
                        <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                        {isLogin && <button type="button" className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase">Forgot?</button>}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            id="password"
                            name="password"
                            type="password" 
                            autoComplete={isLogin ? "current-password" : "new-password"} 
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600" 
                            placeholder="••••••••" 
                            required
                        />
                    </div>
                </div>

                {/* 5. FULL NAME (Moved to bottom to maintain Email+Password connection) */}
                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label htmlFor="full-name" className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                            id="full-name"
                            name="name"
                            type="text" 
                            autoComplete="name"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600" 
                            placeholder="John Doe" 
                        />
                    </div>
                )}

                {/* 4. PHARMACIST SPECIFIC DETAILS (Hidden if Login or Customer) */}
                {!isLogin && role === 'pharmacist' && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                        <div className="space-y-1">
                            <label htmlFor="pharmacy-name" className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Pharmacy Name</label>
                            <input 
                                id="pharmacy-name"
                                name="pharmacyName"
                                type="text" 
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-600" 
                                placeholder="Central Care Pharmacy" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="region" className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Operating Region</label>
                            <select 
                                id="region"
                                name="region"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-white appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-slate-900">Select Region</option>
                                {/* Dummy data */}
                                <option value="north" className="bg-slate-900">North Region</option>
                                <option value="south" className="bg-slate-900">South Region</option>
                                <option value="east" className="bg-slate-900">East Region</option>
                                <option value="west" className="bg-slate-900">West Region</option>
                            </select>
                        </div>
                    </div>
                )}

                

                <button type="submit" className="w-full py-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2 group mt-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
            </form>

            {/* TOGGLE LINK SECTION */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-slate-400 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-all"
                >
                    {isLogin ? "Sign up for free" : "Log in here"}
                </button>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}


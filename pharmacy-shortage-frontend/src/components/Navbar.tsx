import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';
const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                
                <a href='#hero' className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">MediAlert Pro</span>
                </a>
                <div className="hidden md:flex gap-8 items-center">
                    <a href="#features" className="text-slate-300 hover:text-emerald-400 transition text-sm font-medium">Features</a>
                    <a href="#dashboard" className="text-slate-300 hover:text-emerald-400 transition text-sm font-medium">Dashboard</a>
                    <a href="#join" className="text-slate-300 hover:text-emerald-400 transition text-sm font-medium"> Join</a>
                    <Link to="/auth" className="px-6 py-2 inline-flex items-center justify-center bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg font-semibold text-sm transition shadow-lg hover:shadow-emerald-500/50">
                    Get Started
                    </Link>
                </div>
                </div>
            </nav>
        
    )
}

export default Navbar
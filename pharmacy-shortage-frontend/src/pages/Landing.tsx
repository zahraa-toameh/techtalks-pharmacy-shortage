import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import CTASection from '../components/landing/CTASection';


export default function PharmacyShortageWebsite() {

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-y-auto no-scrollbar">
        {/* Animated background grid */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
            <div 
            className="absolute inset-0"
            style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(17, 94, 89, .05) 25%, rgba(17, 94, 89, .05) 26%, transparent 27%, transparent 74%, rgba(17, 94, 89, .05) 75%, rgba(17, 94, 89, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(17, 94, 89, .05) 25%, rgba(17, 94, 89, .05) 26%, transparent 27%, transparent 74%, rgba(17, 94, 89, .05) 75%, rgba(17, 94, 89, .05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
            }}
            />
        </div>

        {/* Gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Dashboard Preview Section */}
        <DashboardPreviewSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />

        <style>{`
            @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
            }
        `}</style>
        </div>
    );
}
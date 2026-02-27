const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-4 gap-8 mb-8">
                <div>
                <h4 className="font-bold mb-4 text-emerald-400">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-emerald-400 transition">Features</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Pricing</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Security</a></li>
                </ul>
                </div>
                <div>
                <h4 className="font-bold mb-4 text-emerald-400">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-emerald-400 transition">About</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Blog</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Careers</a></li>
                </ul>
                </div>
                <div>
                <h4 className="font-bold mb-4 text-emerald-400">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-emerald-400 transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Terms</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition">Compliance</a></li>
                </ul>
                </div>
                <div>
                <h4 className="font-bold mb-4 text-emerald-400">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="mailto:support@mediAlert.pro" className="hover:text-emerald-400 transition">support@mediAlert.pro</a></li>
                    <li><a href="tel:+18885551234" className="hover:text-emerald-400 transition">+1 (888) 555-1234</a></li>
                </ul>
                </div>
            </div>
            <div className="border-t border-slate-800/50 pt-8 text-center text-sm text-slate-500">
                <p>&copy; 2024 MediAlert Pro. All rights reserved. HIPAA Compliant.</p>
            </div>
            </div>
        </footer>
    )
}

export default Footer
import { Link } from "react-router-dom";

const CTASection = () => {
    return (
        <section id="join" className="relative z-10 container py-24 text-center">
            <h2 className="text-5xl font-black mb-6 bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
                Ready to predict the future of pharmacy?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
                Join hundreds of pharmacies already preventing stockouts and improving patient care.
            </p>
            <Link to="/auth" className="px-10 py-5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl font-bold text-lg transition shadow-2xl hover:shadow-emerald-500/50">
                Start Your Free Trial Today
            </Link>
        </section>
    )
}

export default CTASection
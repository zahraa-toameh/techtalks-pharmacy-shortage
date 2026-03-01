/**
 * Detailed Medication Information
 * - Full medication info
 * - Regional availability
 * - Price comparison
 * - User reviews
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, AlertCircle } from 'lucide-react';

// FIX: Point to the new central types file instead of MedicationSearch
import { MEDICATIONS } from '../../types/medication';
import type { Medication } from '../../types/medication';

export default function MedicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the medication based on the URL ID
  const medication = MEDICATIONS.find((m: Medication) => m.id === Number(id));

  // Handle case where medication isn't found
  if (!medication) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Medication Not Found</h2>
        <p className="text-slate-400 mb-6">The medication you are looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/dashboard/search')}
          className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
        Back to Results
      </button>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="p-8 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-black text-white mb-2">{medication.name}</h1>
              <p className="text-lg text-slate-400">
                {medication.dosage} • {medication.format}
              </p>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-700/50">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Status</p>
                <p className={`font-bold ${medication.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {medication.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Price</p>
                <p className="font-bold text-white">${medication.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Availability</p>
                <p className="font-bold text-white">{medication.stock} units</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Rating</p>
                <div className="flex items-center gap-1 text-white font-bold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {medication.rating}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-3">About This Medication</h3>
              <p className="text-slate-400 leading-relaxed">{medication.description}</p>
            </div>

            {/* Nearby Pharmacies */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-4">Nearby Pharmacies</h3>
              <div className="space-y-3">
                {[
                  { name: 'Central Medical Pharmacy', distance: 2.5, stock: 156, hours: '08:00 - 22:00' },
                  { name: 'HealthCare Plus', distance: 3.1, stock: 89, hours: '09:00 - 21:00' },
                ].map((pharmacy, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 rounded-lg flex items-center justify-between border border-transparent hover:border-slate-700 transition">
                    <div>
                      <p className="font-semibold text-white">{pharmacy.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{pharmacy.hours}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-300">{pharmacy.distance} km</p>
                      <p className="text-xs text-emerald-400">{pharmacy.stock} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-bold transition">
                Add to Watch List
              </button>
              <button className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-bold transition">
                View All Regions
              </button>
            </div>
          </div>

          <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Regional Availability</h3>
            <div className="space-y-3">
              {['Central', 'North', 'East'].map((region) => (
                <div key={region} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{region}</span>
                    <span className="text-slate-300">40%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
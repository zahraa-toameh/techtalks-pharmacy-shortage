// src/pages/customer/RegionalAvailability.tsx
/**
 * Regional Availability Component
 * - Display availability across regions
 * - Interactive region selection
 * - Heatmap visualization
 * - Pharmacy listings by region
 */

import { useState } from 'react';
import { Phone, Clock, Star, Navigation as NavIcon, TrendingUp } from 'lucide-react';

interface RegionalAvailabilityProps {
  userLocation: string;
}

export default function RegionalAvailability({ userLocation }: RegionalAvailabilityProps) {
  // 1. Keep track of the LAST location we saw from props
  const [prevLocation, setPrevLocation] = useState(userLocation);

  // 2. State for the region currently being viewed
  const [selectedRegion, setSelectedRegion] = useState(userLocation === 'All Regions' ? 'Central' : userLocation);

  // 3. Manual Sync: If the prop changed, update the internal state
  if (userLocation !== prevLocation) {
    setPrevLocation(userLocation);
    // Only auto-switch the view if it's a specific region, not 'All Regions'
    if (userLocation !== 'All Regions') {
      setSelectedRegion(userLocation);
    }
  }

  // const [selectedMedication, setSelectedMedication] = useState('Amoxicillin');
  
  // Regional data with availability
  const regions = [
    {
      id: 'Central',
      name: 'Central District',
      availability: 85,
      pharmacies: 15,
      mainMeds: ['Amoxicillin', 'Metformin', 'Omeprazole'],
      shortages: ['Aspirin', 'Lisinopril'],
    },
    {
      id: 'North',
      name: 'North Zone',
      availability: 62,
      pharmacies: 8,
      mainMeds: ['Metformin', 'Omeprazole'],
      shortages: ['Amoxicillin', 'Albuterol', 'Aspirin'],
    },
    {
      id: 'South',
      name: 'South Region',
      availability: 45,
      pharmacies: 6,
      mainMeds: ['Albuterol'],
      shortages: ['Amoxicillin', 'Metformin', 'Lisinopril', 'Aspirin'],
    },
    {
      id: 'East',
      name: 'East Valley',
      availability: 78,
      pharmacies: 12,
      mainMeds: ['Amoxicillin', 'Lisinopril', 'Omeprazole'],
      shortages: ['Aspirin'],
    },
    {
      id: 'West',
      name: 'West Park',
      availability: 55,
      pharmacies: 7,
      mainMeds: ['Metformin', 'Albuterol'],
      shortages: ['Amoxicillin', 'Lisinopril', 'Aspirin', 'Omeprazole'],
    },
  ];

  // Pharmacy data
  const pharmacies = [
    {
      id: 1,
      name: 'Central Medical Pharmacy',
      region: 'Central',
      distance: 2.5,
      rating: 4.8,
      stock: 'Amoxicillin (156), Metformin (245)',
      hours: '08:00 - 22:00',
      phone: '(555) 123-4567',
    },
    {
      id: 2,
      name: 'HealthCare Plus',
      region: 'Central',
      distance: 3.1,
      rating: 4.6,
      stock: 'Amoxicillin (89), Omeprazole (167)',
      hours: '09:00 - 21:00',
      phone: '(555) 234-5678',
    },
    {
      id: 3,
      name: 'North Star Pharmacy',
      region: 'North',
      distance: 5.8,
      rating: 4.7,
      stock: 'Lisinopril (28), Metformin (145)',
      hours: '08:30 - 20:00',
      phone: '(555) 345-6789',
    },
    {
      id: 4,
      name: 'Valley Health Store',
      region: 'East',
      distance: 4.2,
      rating: 4.9,
      stock: 'Amoxicillin (201), Lisinopril (67)',
      hours: '07:00 - 23:00',
      phone: '(555) 456-7890',
    },
  ];

  const currentRegion = regions.find((r) => r.id === selectedRegion);
  const regionalPharmacies = pharmacies.filter((p) => p.region === selectedRegion);

  const getAvailabilityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getAvailabilityBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500/20 border-emerald-500/50';
    if (percentage >= 60) return 'bg-amber-500/20 border-amber-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent mb-2">
          Regional Availability
        </h2>
        <p className="text-slate-400">Check medication availability across different regions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Region Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">Regions</h3>
          <div className="space-y-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                  selectedRegion === region.id
                    ? 'bg-linear-to-r from-emerald-500/20 to-teal-600/20 border-emerald-500/50'
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition">
                    {region.name}
                  </h4>
                  <span className="text-xs font-bold text-slate-400">{region.pharmacies} pharmacies</span>
                </div>

                {/* Availability Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getAvailabilityColor(region.availability)}`}
                      style={{ width: `${region.availability}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{region.availability}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs text-slate-400">Good (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-xs text-slate-400">Moderate (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-slate-400">Limited (&lt;60%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Regional Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Region Overview */}
          {currentRegion && (
            <div className={`p-6 rounded-2xl border ${getAvailabilityBgColor(currentRegion.availability)}`}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Availability */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Overall Availability</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-emerald-400">{currentRegion.availability}%</p>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                {/* Available Medications */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Available</p>
                  <p className="font-bold text-white">{currentRegion.mainMeds.length} medications</p>
                  <p className="text-xs text-slate-400 mt-1">{currentRegion.mainMeds.join(', ')}</p>
                </div>

                {/* In Shortage */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">In Shortage</p>
                  <p className="font-bold text-red-400">{currentRegion.shortages.length} medications</p>
                  <p className="text-xs text-slate-400 mt-1">{currentRegion.shortages.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pharmacies in Region */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Pharmacies in {currentRegion?.name}</h3>

            {regionalPharmacies.length > 0 ? (
              <div className="space-y-4">
                {regionalPharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{pharmacy.name}</h4>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          {/* Distance */}
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <NavIcon className="w-4 h-4 text-teal-400" />
                            {pharmacy.distance} km away
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-slate-300">{pharmacy.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="p-3 bg-slate-900/50 rounded-lg mb-4">
                      <p className="text-xs text-slate-500 mb-1">Current Stock</p>
                      <p className="text-sm text-emerald-400 font-semibold">{pharmacy.stock}</p>
                    </div>

                    {/* Footer Info */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Hours */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        <div>
                          <p className="text-xs text-slate-500">Hours</p>
                          <p className="text-sm text-white font-semibold">{pharmacy.hours}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs text-slate-500">Call</p>
                          <p className="text-sm text-white font-semibold">{pharmacy.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-semibold transition">
                      Get Directions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400">No pharmacies found in this region</p>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap Visualization */}
      {/* <div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Availability Heatmap</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedRegion === region.id
                  ? 'border-emerald-500 scale-105'
                  : 'border-slate-700/50 hover:border-emerald-500/50'
              }`}
              style={{
                backgroundColor: `rgba(${
                  region.availability >= 80
                    ? '16, 185, 129'
                    : region.availability >= 60
                      ? '245, 158, 11'
                      : '239, 68, 68'
                }, 0.1)`,
              }}
              onClick={() => setSelectedRegion(region.id)}
            >
              <p className="text-sm font-bold text-white text-center">{region.name}</p>
              <p className="text-2xl font-black text-center mt-2 text-white">{region.availability}%</p>
            </div>
          ))}
        </div>
      </div> */}


      {/* Heatmap Visualization */}
<div className="p-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
    <NavIcon className="w-5 h-5 text-emerald-400" />
    Availability Heatmap
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {regions.map((region) => {
      // Logic to determine which Pharmacist-style color to use
      const isEmerald = region.availability >= 80;
      const isAmber = region.availability >= 60 && region.availability < 80;
      
      const colorClasses = isEmerald 
        ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' 
        : isAmber 
          ? 'from-amber-500/20 to-amber-600/10 border-amber-500/30' 
          : 'from-red-500/20 to-red-600/10 border-red-500/30';

      const activeShadow = isEmerald 
        ? 'shadow-emerald-500/20' 
        : isAmber 
          ? 'shadow-amber-500/20' 
          : 'shadow-red-500/20';

      return (
        <div
          key={region.id}
          onClick={() => setSelectedRegion(region.id)}
          className={`group p-5 rounded-xl border bg-linear-to-br transition-all duration-300 cursor-pointer text-center
            ${colorClasses}
            ${selectedRegion === region.id 
              ? `scale-105 ring-2 ring-offset-2 ring-offset-slate-950 shadow-xl ${activeShadow} ${isEmerald ? 'ring-emerald-500/50' : isAmber ? 'ring-amber-500/50' : 'ring-red-500/50'}` 
              : 'hover:scale-102 hover:shadow-lg'
            }
          `}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">
            {region.name}
          </p>
          <p className="text-3xl font-black text-white">
            {region.availability}%
          </p>
          <div className="mt-3 flex justify-center">
             <div className={`h-1 w-12 rounded-full ${isEmerald ? 'bg-emerald-500' : isAmber ? 'bg-amber-500' : 'bg-red-500'}`} />
          </div>
        </div>
      );
    })}
  </div>
</div>
    </div>
  );
}
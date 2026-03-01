import { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, Star } from 'lucide-react';
// Import types using 'import type' for verbatimModuleSyntax compatibility
import type { Medication, FilterType, AvailabilityStatus } from '../../types/medication';
// Import the data constant
import { MEDICATIONS } from '../../types/medication';

interface MedicationSearchProps {
  userLocation: string;
  onSelectMedication: (medication: Medication) => void;
}

export default function MedicationSearch({ userLocation, onSelectMedication }: MedicationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Filter logic
  const filtered = useMemo(() => {
    return MEDICATIONS.filter((med) => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            med.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || med.availability === selectedFilter;
      const matchesPrice = med.price >= priceRange[0] && med.price <= priceRange[1];
      const matchesLocation = userLocation === 'All Regions' || med.region === userLocation;
      
      return matchesSearch && matchesFilter && matchesPrice && matchesLocation;
    });
  }, [searchTerm, selectedFilter, priceRange, userLocation]);

  const getAvailabilityColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'low': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'out': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-700/50 text-slate-300';
    }
  };

  const getAvailabilityText = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'In Stock';
      case 'low': return 'Low Stock';
      case 'out': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent mb-2">
          Find Your Medication
        </h2>
        <p className="text-slate-400">Searching in <span className="text-emerald-400 font-bold">{userLocation}</span></p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search medications (e.g., Amoxicillin, fever, pain)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none transition"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-2 flex-wrap">
          {([
            { id: 'all', label: 'All' },
            { id: 'available', label: 'In Stock' },
            { id: 'low', label: 'Low Stock' },
            { id: 'out', label: 'Out of Stock' },
          ] as { id: FilterType; label: string }[]).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-emerald-500/30'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="md:ml-auto">
          <label className="text-sm text-slate-400 mb-2 block">Max Price: ${priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="500"
            step="5"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((med) => (
            <button
              key={med.id}
              onClick={() => onSelectMedication(med)}
              className="p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                    {med.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {med.dosage} • {med.format}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getAvailabilityColor(med.availability)}`}>
                  {getAvailabilityText(med.availability)}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{med.description}</p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Price</p>
                  <div className="flex items-center gap-1 text-white">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">{med.price.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{med.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nearby</p>
                  <div className="flex items-center gap-1 text-white">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span className="font-bold">{med.nearbyPharmacies}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {med.availability === 'out' ? (
                    <span className="text-red-400 font-medium">Restocking Soon</span>
                  ) : (
                    <span>{med.stock} units • {med.distance} away</span>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  View Details →
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
          <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No results found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
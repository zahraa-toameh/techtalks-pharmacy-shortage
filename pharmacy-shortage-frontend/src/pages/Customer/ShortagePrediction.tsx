/**
 * Shortage Predictions Component
 * Restyled to match Pharmacist Dashboard visual language
 */

import { useState } from 'react';
import {  AlertTriangle, Clock, Zap, BarChart3, ShieldCheck } from 'lucide-react';

type Timeframe = '1w' | '2w' | '1m' | '3m';
type RiskLevel = 'all' | 'high' | 'medium' | 'low' | 'critical';

interface ShortagePredictionsProps {
  userLocation: string;
}

export default function ShortagePredictions({ userLocation }: ShortagePredictionsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1m');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  
  const predictions = [
    {
      id: 1,
      medication: 'Amoxicillin 500mg',
      currentStatus: 'available',
      predictedStatus: 'low_stock',
      riskLevel: 'high',
      daysUntilShortage: 12,
      confidence: 97.8,
      reason: 'High demand + Supply chain delays from manufacturer',
      trend: 'declining',
      regions: ['Central', 'North', 'East'],
    },
    {
      id: 2,
      medication: 'Aspirin 500mg',
      currentStatus: 'out',
      predictedStatus: 'out',
      riskLevel: 'critical',
      daysUntilShortage: 0,
      confidence: 100,
      reason: 'Currently out of stock. Expected restock in 18 days',
      trend: 'unavailable',
      regions: ['South', 'West'],
    },
    {
      id: 3,
      medication: 'Lisinopril 10mg',
      currentStatus: 'low',
      predictedStatus: 'low_stock',
      riskLevel: 'high',
      daysUntilShortage: 8,
      confidence: 95.2,
      reason: 'Seasonal demand increase expected',
      trend: 'declining',
      regions: ['North', 'South'],
    },
    {
      id: 4,
      medication: 'Metformin 1000mg',
      currentStatus: 'available',
      predictedStatus: 'available',
      riskLevel: 'low',
      daysUntilShortage: 45,
      confidence: 89.5,
      reason: 'Stable supply. No major demand changes expected',
      trend: 'stable',
      regions: ['All Regions'],
    },
  ];

  const filtered = predictions.filter((pred) => {
    if (riskFilter === 'all') return true;
    return pred.riskLevel === riskFilter;
  });

  const isLocallyAffected = (regions: string[]) => 
    regions.includes(userLocation) || regions.includes('All Regions');

  // Unified color mapping for risk levels
  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          card: 'from-red-500/20 to-red-600/10 border-red-500/30 shadow-red-500/5',
          text: 'text-red-400',
          badge: 'bg-red-500/20 border-red-500/50 text-red-300'
        };
      case 'high':
        return {
          card: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 shadow-orange-500/5',
          text: 'text-orange-400',
          badge: 'bg-orange-500/20 border-orange-500/50 text-orange-300'
        };
      case 'medium':
        return {
          card: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 shadow-amber-500/5',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 border-amber-500/50 text-amber-300'
        };
      default:
        return {
          card: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 shadow-emerald-500/5',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
        };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Unified Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent mb-2">
            Supply Forecast
          </h2>
          <p className="text-slate-400 max-w-lg">AI-driven predictive analysis for regional supply trends.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex gap-1">
            {(['1w', '2w', '1m'] as Timeframe[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedTimeframe(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTimeframe === p ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          
          <select 
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2 outline-none focus:border-emerald-500/50"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel)}
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
          </select>
        </div>
      </div>

      {/* Predictions List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((pred) => {
          const styles = getRiskStyles(pred.riskLevel);
          return (
            <div
              key={pred.id}
              className={`group relative p-6 bg-linear-to-br ${styles.card} border rounded-2xl transition-all duration-300 hover:shadow-2xl`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white">{pred.medication}</h3>
                    {isLocallyAffected(pred.regions) && (
                      <span className="animate-pulse flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black uppercase rounded border border-red-500/30">
                        <AlertTriangle className="w-3 h-3" /> Area Impact
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{pred.reason}</p>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Confidence</p>
                  <p className={`text-xl font-black ${styles.text}`}>{pred.confidence}%</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">ETA Impact</span>
                  </div>
                  <p className="text-lg font-bold text-white">{pred.daysUntilShortage === 0 ? 'CRITICAL' : `${pred.daysUntilShortage}d`}</p>
                </div>
                <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Risk</span>
                  </div>
                  <p className={`text-lg font-bold ${styles.text} uppercase`}>{pred.riskLevel}</p>
                </div>
                <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Trend</span>
                  </div>
                  <p className="text-lg font-bold text-white capitalize">{pred.trend}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-1.5">
                  {pred.regions.slice(0, 2).map(r => (
                    <span key={r} className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-md">{r}</span>
                  ))}
                  {pred.regions.length > 2 && <span className="text-[10px] font-bold text-slate-500">+{pred.regions.length - 2} more</span>}
                </div>
                <button className="px-5 py-2 bg-white text-slate-950 text-xs font-black rounded-xl hover:bg-emerald-400 transition-colors uppercase tracking-tight">
                  Track Medicine
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accuracy Banner - Styled like a Pharmacist Footer Metric */}
      <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/40">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold text-white mb-2">High-Precision AI Forecasting</h4>
          <p className="text-slate-400 text-sm max-w-2xl">
            Our predictive models currently maintain a <span className="text-emerald-400 font-bold">94.3% accuracy rate</span> across 247 verified shortage events this month. Data is refreshed every 6 hours via global supply chain telemetry.
          </p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase">Avg Notice</p>
            <p className="text-3xl font-black text-white">14.2d</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase">Precision</p>
            <p className="text-3xl font-black text-emerald-400">94%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
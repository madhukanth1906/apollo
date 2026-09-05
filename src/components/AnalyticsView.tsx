'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  Download
} from 'lucide-react';
import { PORTAL_STATS } from '@/services/mockData';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Legal Metrology National Compliance Analytics</h2>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-400 font-mono">
                  Enforcement KPIs
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time compliance monitoring, violation trends, and turn-around metrics across state directorates.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Exporting monthly compliance dataset (CSV)...')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Enforcement Dataset</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            National Compliance Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-emerald-700">78.7%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +3.2% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target benchmark: ≥ 85.0%</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            LabelTruth™ Inconsistencies
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-red-700">42</span>
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
              Dual MRP Flagged
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Show-cause notices issued</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Inspection Time
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-blue-900">3.4 min</span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
              -65% vs Manual
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From upload to verified report</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Multispectral Anomalies
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-amber-700">16</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              Lab Referred
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">UV/NIR spectral signals</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Most Common PCR Declaration Violations */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Most Common Declaration Violations (PCR 2011)
              </h3>
              <p className="text-[11px] text-slate-500">Distribution of 183 detected infractions</p>
            </div>
            <span className="text-[10px] font-mono bg-red-50 text-red-800 px-2 py-0.5 rounded font-bold">
              YTD 2026
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Unit Sale Price (USP) Missing or Miscalculated (Rule 6(1)(e))', count: 68, pct: 37, color: 'bg-red-600' },
              { label: 'Dual MRP / Higher Sticker Overwrite (Rule 18(2))', count: 47, pct: 26, color: 'bg-red-500' },
              { label: 'Minimum Numeral / Font Height Non-Compliance (Rule 9)', count: 35, pct: 19, color: 'bg-amber-500' },
              { label: 'Incomplete Manufacturer / Packer Address (Rule 6(1)(a))', count: 18, pct: 10, color: 'bg-blue-600' },
              { label: 'Country of Origin Omission (Rule 6(1)(f))', count: 15, pct: 8, color: 'bg-slate-600' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate pr-2">{bar.label}</span>
                  <span className="font-mono font-bold text-slate-900">{bar.count} ({bar.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Compliance Breakdown by Commodity Sector */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Compliance Rate by Packaged Commodity Category
              </h3>
              <p className="text-[11px] text-slate-500">Benchmark across 6 statutory sectors</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">
              Field Audit
            </span>
          </div>

          <div className="space-y-3">
            {[
              { category: 'Packaged Food & Staples (Atta, Rice, Salt)', compliant: 88, violations: 12 },
              { category: 'Edible Oils & Fats (Mustard, Sunflower)', compliant: 81, violations: 19 },
              { category: 'Personal Care & Cosmetics (Shampoos, Creams)', compliant: 74, violations: 26 },
              { category: 'Cleaning & Detergents (Soaps, Powders)', compliant: 82, violations: 18 },
              { category: 'Packaged Confectionery & Biscuits', compliant: 66, violations: 34 },
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{cat.category}</span>
                  <span className="font-mono text-emerald-700 font-bold">{cat.compliant}% Compliant</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${cat.compliant}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${cat.violations}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded" />
              <span>Compliant (Pass)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded" />
              <span>Non-Compliant (Violation)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

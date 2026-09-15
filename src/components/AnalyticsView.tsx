'use client';

import React from 'react';
import { 
  BarChart3, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  Home as HomeIcon,
  ChevronDown,
  ShieldCheck,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  MapPin,
  PenTool,
  Wand2,
  AlertCircle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-6 bg-slate-100 flex-1 space-y-4">
      {/* 1. Breadcrumb Bar */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <HomeIcon className="w-3.5 h-3.5" /> 
        <span>Home</span> 
        <span>/</span> 
        <span className="text-slate-800 font-medium">Reports & Analytics</span>
      </div>

      {/* 2. Top Header Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-50 border border-indigo-200/80 rounded-xl p-5 flex items-center justify-between relative overflow-hidden shadow-xs">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Legal Metrology National Compliance Analytics</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-indigo-200">
                Enforcement KPIs
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Real-time compliance monitoring, violation trends, and turn-around metrics across state directorates.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 flex items-center gap-3 shadow-sm hover:border-slate-400 transition-colors text-left">
              <Calendar className="text-slate-500 w-4 h-4" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Last 6 Months</span>
                <span className="text-[10px] text-slate-500 block">Mar 2026 – Sep 2026</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Enforcement Dataset</span>
            </button>
          </div>
          <span className="text-indigo-900/70 font-serif italic text-xs font-semibold block text-right mt-1.5">
            “Fair Trade Stronger India”
          </span>
        </div>
      </div>

      {/* 3. Top 4 Metric Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: National Compliance Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase ml-3">
              NATIONAL COMPLIANCE RATE
            </h3>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-2xl font-black text-slate-900">78.7%</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2 inline-flex items-center">
              ↑ +3.2% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Target benchmark: ≥ 85.0%</p>
        </div>

        {/* Card 2: LabelTruth™ Inconsistencies */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase ml-3">
                LABELTRUTH™ INCONSISTENCIES
              </h3>
            </div>
            <div className="flex items-center mt-3">
              <span className="text-2xl font-black text-slate-900">42</span>
              <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-md ml-2 inline-block">
                Dual MRP Flagged
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">Show-cause notices issued</span>
            <span className="text-emerald-600 font-bold text-xs">↑ +12%</span>
          </div>
        </div>

        {/* Card 3: Average Inspection Time */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase ml-3">
                AVERAGE INSPECTION TIME
              </h3>
            </div>
            <div className="flex items-center mt-3">
              <span className="text-2xl font-black text-slate-900">3.4 min</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md ml-2 inline-block border border-blue-100">
                ↓ -65% vs Manual
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">From upload to verified report</p>
        </div>

        {/* Card 4: Multispectral Anomalies */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase ml-3">
                MULTISPECTRAL ANOMALIES
              </h3>
            </div>
            <div className="flex items-center mt-3">
              <span className="text-2xl font-black text-slate-900">16</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-md ml-2 inline-block">
                Lab Referred
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">UV/NIR spectral signals detected</span>
            <span className="text-emerald-600 font-bold text-xs">↑ +6%</span>
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Two Wide Chart/Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Card: Most Common Declaration Violations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-rose-600 bg-rose-50 p-2 rounded-lg inline-block mr-2.5">
                  <BarChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                    MOST COMMON DECLARATION VIOLATIONS (PCR 2011)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Distribution of 183 detected infractions</p>
                </div>
              </div>
              <div className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                YTD 2026
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { title: 'Unit Sale Price (USP) Missing or Miscalculated (Rule 6(1)(e))', value: 68, pct: 37, color: 'bg-blue-600' },
                { title: 'Dual MRP / Higher Sticker Overwrite (Rule 18(2))', value: 47, pct: 26, color: 'bg-rose-500' },
                { title: 'Minimum Numeral / Font Height Non-Compliance (Rule 9)', value: 35, pct: 19, color: 'bg-sky-500' },
                { title: 'Incomplete Manufacturer / Packer Address (Rule 6(1)(a))', value: 18, pct: 10, color: 'bg-purple-500' },
                { title: 'Country of Origin Not Declared (Rule 6(1)(f))', value: 15, pct: 8, color: 'bg-indigo-500' },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1.5">
                    <span>{row.title}</span>
                    <span>{row.value} ({row.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-5 cursor-pointer">
            View Detailed Violation Report →
          </button>
        </div>

        {/* Right Card: Compliance Rate by Packaged Commodity Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-blue-600 bg-blue-50 p-2 rounded-lg inline-block mr-2.5">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                    COMPLIANCE RATE BY PACKAGED COMMODITY CATEGORY
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Benchmark across 6 statutory sectors</p>
                </div>
              </div>
              <button className="bg-white border border-blue-200 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:bg-blue-50 transition">
                Field Audit
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { title: 'Packaged Food & Staples (Atta, Rice, Salt)', val: 88, stat: 'Compliant', statClass: 'bg-emerald-100 text-emerald-800', compW: 88, incW: 12 },
                { title: 'Edible Oils & Fats (Mustard, Sunflower)', val: 81, stat: 'Compliant', statClass: 'bg-emerald-100 text-emerald-800', compW: 81, incW: 19 },
                { title: 'Personal Care & Cosmetics (Shampoos, Creams)', val: 74, stat: 'Compliant', statClass: 'bg-emerald-100 text-emerald-800', compW: 74, incW: 26 },
                { title: 'Cleaning & Detergents (Soaps, Powders)', val: 82, stat: 'Compliant', statClass: 'bg-emerald-100 text-emerald-800', compW: 82, incW: 18 },
                { title: 'Spices & Condiments', val: 69, stat: 'Needs Attention', statClass: 'bg-amber-100 text-amber-800', compW: 69, incW: 31 },
                { title: 'Beverages (Juices, Soft Drinks)', val: 76, stat: 'Compliant', statClass: 'bg-emerald-100 text-emerald-800', compW: 76, incW: 24 },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-medium text-slate-800">{row.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono">{row.val}%</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.statClass}`}>{row.stat}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    <div className={`h-full ${row.val >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${row.compW}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${row.incW}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4 text-[10px] font-medium text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span> Compliant (≥ 75%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span> Needs Attention (50% - 75%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span> Non-Compliant (&lt; 50%)</span>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
              View Category-wise Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: 3 Columns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column 1: Compliance Trend (Last 6 Months) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center mb-6">
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg mr-2 inline-block">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
              COMPLIANCE TREND (LAST 6 MONTHS)
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-end relative mt-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <path 
                d="M 2,55 L 20,43 L 40,28 L 60,23 L 80,20 L 98,16" 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <path 
                d="M 2,55 L 20,43 L 40,28 L 60,23 L 80,20 L 98,16 L 98,100 L 2,100 Z" 
                fill="url(#indigo-grad)" 
              />
              <defs>
                <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* SVG Data Points & Labels Overlay (positioned precisely relative to viewBox) */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20">
              {/* Points */}
              <circle cx="2" cy="55" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
              <circle cx="20" cy="43" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
              <circle cx="40" cy="28" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
              <circle cx="60" cy="23" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
              <circle cx="80" cy="20" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
              <circle cx="98" cy="16" r="1.5" fill="#4F46E5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
              <div className="absolute" style={{ left: '2%', top: '45%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-2">72.1%</div>
              </div>
              <div className="absolute" style={{ left: '20%', top: '33%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-2">74.3%</div>
              </div>
              <div className="absolute" style={{ left: '40%', top: '18%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-2">76.8%</div>
              </div>
              <div className="absolute" style={{ left: '60%', top: '13%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-2">77.5%</div>
              </div>
              <div className="absolute" style={{ left: '80%', top: '10%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-2">78.1%</div>
              </div>
              <div className="absolute" style={{ left: '98%', top: '6%' }}>
                 <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-1 rounded -mt-5 -ml-6">78.7%</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 px-2 border-t border-slate-100 pt-2 z-10">
              <span>Mar'26</span>
              <span>Apr'26</span>
              <span>May'26</span>
              <span>Jun'26</span>
              <span>Jul'26</span>
              <span>Sep'26</span>
            </div>
          </div>
        </div>

        {/* Column 2: Inspections by State (Top 5) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center mb-6">
            <div className="text-blue-600 bg-blue-50 p-2 rounded-lg mr-2 inline-block">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
              INSPECTIONS BY STATE (TOP 5)
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { state: 'Uttar Pradesh', count: '1,248', width: '85%' },
              { state: 'Maharashtra', count: '932', width: '65%' },
              { state: 'Tamil Nadu', count: '876', width: '55%' },
              { state: 'Karnataka', count: '654', width: '42%' },
              { state: 'Gujarat', count: '612', width: '38%' },
            ].map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{st.state}</span>
                  <span className="font-bold text-slate-900">{st.count}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-md overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-md" style={{ width: st.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: AI-Powered Insights */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center mb-6">
            <div className="text-amber-500 bg-amber-50 p-2 rounded-lg mr-2 inline-block">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
              AI-POWERED INSIGHTS
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-full shrink-0">
                <PenTool className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                <strong className="text-slate-900">12%</strong> increase in LabelTruth™ violations in Food & Beverages category.
              </p>
              <div className="text-slate-400 group-hover:text-blue-600 font-bold ml-auto shrink-0 mt-0.5">&gt;</div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full shrink-0">
                <Wand2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Average inspection time reduced by <strong className="text-slate-900">65%</strong> using AI-assisted OCR & extraction.
              </p>
              <div className="text-slate-400 group-hover:text-blue-600 font-bold ml-auto shrink-0 mt-0.5">&gt;</div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Packaged Spices showing highest label inconsistencies (<strong className="text-slate-900">31%</strong> of samples).
              </p>
              <div className="text-slate-400 group-hover:text-blue-600 font-bold ml-auto shrink-0 mt-0.5">&gt;</div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
              <div className="bg-orange-50 text-orange-600 p-2 rounded-full shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Recommend focused enforcement drive in 3 high-risk states.
              </p>
              <div className="text-slate-400 group-hover:text-blue-600 font-bold ml-auto shrink-0 mt-0.5">&gt;</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

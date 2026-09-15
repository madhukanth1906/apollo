'use client';

import React, { useState } from 'react';
import { 
  Database,
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Fingerprint
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';

interface ProductsViewProps {
  onNavigateToFingerprint?: (sku: string) => void;
  onNavigateToInspection?: (sku: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onNavigateToFingerprint,
  onNavigateToInspection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Hardcoded UI spec product display
  const displayProducts = [
    {
      sku: 'SKU-FNT-001',
      name: 'Organic Green Tea 250g',
      brand: 'Tea Co Ltd.',
      category: 'Food & Beverages',
      date: '9/15/2026',
      status: 'VIOLATION',
      statusClass: 'bg-rose-50 text-rose-700 border-rose-300',
      statusIcon: XCircle,
      verification: '✓ Verified',
      verClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH']?.sampleImages?.front || ''
    },
    {
      sku: 'SB-AT-5KG-01',
      name: 'Shaktibhog Chakki Fresh Atta',
      brand: 'Shaktibhog',
      category: 'Packaged Staples',
      date: '9/15/2026',
      status: 'COMPLIANT',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      statusIcon: CheckCircle2,
      verification: '✓ Verified',
      verClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-COMPLIANT']?.sampleImages?.front || ''
    },
    {
      sku: 'CM-BG-200G',
      name: 'Crispy Munch Butter Gold Biscuits',
      brand: 'Crispy Munch',
      category: 'Food & Beverages',
      date: '9/15/2026',
      status: 'VIOLATION',
      statusClass: 'bg-rose-50 text-rose-700 border-rose-300',
      statusIcon: XCircle,
      verification: '⏱ Under Review',
      verClass: 'bg-amber-50 text-amber-700 border-amber-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH']?.sampleImages?.front || ''
    },
    {
      sku: 'RP-MNS-30ML',
      name: 'Revolution Pro Miracle Night Serum',
      brand: 'Revolution Pro',
      category: 'Personal Care & Cosmetics',
      date: '9/15/2026',
      status: 'REQUIRES REVIEW',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-300',
      statusIcon: AlertTriangle,
      verification: '✓ Verified',
      verClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-ACTIVE-INSPECTION']?.sampleImages?.front || ''
    },
    {
      sku: 'HG-SH-350ML',
      name: 'Herbal Glow Ayurvedic Anti-Dandruff Shampoo',
      brand: 'Herbal Glow',
      category: 'Personal Care & Cosmetics',
      date: '9/15/2026',
      status: 'REQUIRES REVIEW',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-300',
      statusIcon: AlertTriangle,
      verification: '✓ Verified',
      verClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-FINGERPRINT']?.sampleImages?.front || ''
    },
    {
      sku: 'HP-RS-1KG',
      name: 'Himalayan Pure Pink Rock Salt',
      brand: 'Himalayan Pure',
      category: 'Spices & Condiments',
      date: '9/15/2026',
      status: 'REQUIRES REVIEW',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-300',
      statusIcon: AlertTriangle,
      verification: '✓ Verified',
      verClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      thumb: SAMPLE_PRODUCTS['SAMPLE-SPECTRA']?.sampleImages?.front || ''
    }
  ];

  return (
    <div className="p-6 bg-[#F3F6FA] flex-1 space-y-6">
      {/* 1. Hero Banner Header Card */}
      <div className="bg-gradient-to-r from-[#E0E7FF] via-[#EEF2FF] to-[#DBEAFE] rounded-2xl border border-blue-100 p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <div className="bg-[#2563EB] p-3.5 rounded-xl shadow-md text-white flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="ml-4 z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-slate-900 font-extrabold text-xl tracking-tight">National Packaged Commodity SKU Master Database</h2>
              <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                Master Registry
              </span>
            </div>
            <p className="text-slate-600 text-sm mt-1">
              Centralized registry of verified packaged goods, historical packaging baselines, and manufacturer profiles.
            </p>
          </div>
        </div>

        <div className="bg-[#0F172A] rounded-xl p-3.5 text-white flex items-center gap-3 shadow-md border border-slate-700 z-10 shrink-0">
          <div className="bg-amber-400/10 text-amber-400 p-2 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Active Catalog</div>
            <div className="text-xs font-bold text-white">6 Sample Benchmarks</div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 bottom-0 w-1/3 pointer-events-none opacity-30 bg-gradient-to-l from-orange-100 via-transparent to-green-100">
          <div className="absolute right-10 bottom-2 text-indigo-900/30 font-serif italic text-lg font-bold">
            “Authentic Data Fair Markets Stronger India”
          </div>
        </div>
      </div>

      {/* 2. Summary / Metrics Stat Cards (5 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: 'Total Products', val: '12,480', iconClass: 'bg-blue-50 text-blue-600', trend: '↑ 12% vs last month', trendClass: 'text-emerald-600' },
          { title: 'Compliant Products', val: '8,942', iconClass: 'bg-emerald-50 text-emerald-600 rounded-full', trend: '↑ 18%', trendClass: 'text-emerald-600' },
          { title: 'Requires Review', val: '2,341', iconClass: 'bg-amber-50 text-amber-500', trend: '↓ 6%', trendClass: 'text-red-500' },
          { title: 'Violations', val: '1,197', iconClass: 'bg-rose-50 text-rose-500 rounded-full', trend: '↓ 9%', trendClass: 'text-red-500' },
          { title: 'Categories', val: '24', iconClass: 'bg-purple-50 text-purple-600', trend: '+3 new', trendClass: 'text-blue-600' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{card.title}</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">{card.val}</span>
              <span className={`text-[10px] font-bold ${card.trendClass} mt-1 block`}>{card.trend}</span>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${card.iconClass}`}>
              <Database className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search Bar, Filter Controls & View Toggle Row */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px]">
            <input 
              type="text" 
              placeholder="Search commodities by name, brand, SKU or barcode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <button className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition">
            <Filter className="w-4 h-4" /> Filter
          </button>
          
          <button className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition">
            Category <ChevronDown className="w-4 h-4" />
          </button>
          
          <button className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition">
            Sort By <ChevronDown className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 ml-auto">
            <button className="bg-[#2563EB] text-white p-2 rounded-xl shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="bg-white border border-slate-200 text-slate-600 p-2 rounded-xl shadow-sm hover:bg-slate-50 transition">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Food & Beverages', 'Personal Care & Cosmetics', 'Spices & Condiments', 'Cleaning & Detergents', 'Edible Oils & Fats', 'Packaged Staples'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs transition ${
                activeCategory === cat 
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold'
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="bg-white border border-slate-200 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1 transition shadow-sm">
            More <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Product Grid Layout & Cards Anatomy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayProducts.map((prod, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
            {/* Top Row Header */}
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                {prod.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={prod.thumb} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Database className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{prod.sku}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border ${prod.verClass}`}>
                    {prod.verification}
                  </span>
                </div>
                <h3 className="text-slate-900 font-bold text-sm leading-tight mt-1 line-clamp-1" title={prod.name}>
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  {prod.brand} • {prod.category}
                </p>
              </div>
            </div>

            {/* Middle Metadata Block */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Last Inspection
                </span>
                <span className="text-slate-800 text-xs font-bold">{prod.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                  <Database className="w-3.5 h-3.5" /> Statutory Status
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border shadow-xs ${prod.statusClass}`}>
                  <prod.statusIcon className="w-3 h-3" />
                  {prod.status}
                </span>
              </div>
            </div>

            {/* Card Bottom Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button 
                onClick={() => onNavigateToInspection?.(prod.sku)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/70 rounded-xl py-2 px-3 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition"
              >
                View Profile
              </button>
              <button 
                onClick={() => onNavigateToFingerprint?.(prod.sku)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 rounded-xl py-2 px-3 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition"
              >
                <Fingerprint className="w-3.5 h-3.5" /> Fingerprint
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Product Database Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 shadow-sm mt-6">
        <span>Showing 6 of 12,480 products</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <button className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white font-medium flex items-center gap-1">
              6 <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">&lt;</button>
            <button className="bg-[#2563EB] text-white font-bold rounded-lg px-3 py-1.5 shadow-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition">2</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition">3</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition">4</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition">2,080</button>
            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

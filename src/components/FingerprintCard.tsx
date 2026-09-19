'use client';

import React, { useState } from 'react';
import { 
  Fingerprint, 
  History, 
  ArrowRight, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Scale
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { ProductFingerprint } from '@/types/inspection';
import { ComplianceBadge } from './ComplianceBadge';

export const FingerprintCard: React.FC = () => {
  const sample = SAMPLE_PRODUCTS['SAMPLE-FINGERPRINT'];

  const [activeSku, setActiveSku] = useState<'HG-SH-350ML' | 'CM-BG-200G'>('HG-SH-350ML');

  const diffs = sample.fingerprintDiffs || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-xl border border-slate-700 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30 backdrop-blur-sm shadow-sm">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">Compliance Fingerprint™ — Packaging Evolution Ledger</h2>
                <span className="text-[10px] bg-red-500/20 text-red-200 px-2 py-0.5 rounded border border-red-500/30 font-bold tracking-wider uppercase">
                  Temporal Audit
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Detects shrinkflation, stealth quantity drops, label layout alterations, and historical price shifts across inspection batches.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SKU Reference</span>
            <span className="text-xs font-mono font-bold text-amber-400">{sample.sku}</span>
          </div>
        </div>
      </div>

      {/* Target Product Profile Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.sampleImages.front}
                alt={sample.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{sample.productName}</h3>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {sample.category}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span>Brand: <strong className="text-slate-700">{sample.brand}</strong></span>
                <span>Barcode: <strong className="font-mono text-slate-700">{sample.barcode}</strong></span>
                <span>Current Inspection: <strong className="text-slate-700">{sample.date}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-right">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Audit Status</span>
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              Historical Change Detected
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3 text-xs text-slate-800">
        <Info className="w-4 h-4 text-[#8b1515] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">
            LEGAL METROLOGY NOTICE (Statutory Interpretation):
          </strong>
          <span>
            A historical change detected in pricing, layout, or quantity is <strong>not automatically illegal</strong>. 
            Manufacturers are permitted commercial modifications provided they remain in strict compliance with 
            Rule 6 (mandatory declarations) and Rule 9 (minimum font height). Inspectors must verify that changes do not constitute deceptive packaging.
          </span>
        </div>
      </div>

      {/* Historical Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Batch Fingerprint Diff (Previous vs Current Inspection)
            </h4>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-4">
            <span>Previous: <strong>15 Jan 2026</strong></span>
            <span>→</span>
            <span>Current: <strong>05 Sep 2026</strong></span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {diffs.map((diff, idx) => {
            const isShrink = diff.changeType === 'SHRINKFLATION';
            const isPrice = diff.changeType === 'PRICE_CHANGE';

            return (
              <div
                key={idx}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Field & Type */}
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{diff.fieldName}</span>
                    {isShrink && (
                      <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded uppercase">
                        Shrinkflation
                      </span>
                    )}
                    {isPrice && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">
                        Price Shift
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Category: {diff.changeType.replace('_', ' ')}
                  </span>
                </div>

                {/* Values Diff */}
                <div className="w-full md:w-2/5 flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200 text-xs font-mono">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 block font-sans">Previous</span>
                    <span className="text-slate-700 font-semibold">{diff.previousValue}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />

                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 block font-sans">Current</span>
                    <span className={`font-bold ${isShrink ? 'text-red-700' : isPrice ? 'text-amber-700' : 'text-slate-900'}`}>
                      {diff.currentValue}
                    </span>
                  </div>
                </div>

                {/* Legal Note */}
                <div className="w-full md:w-1/3 text-xs text-slate-600">
                  <p className="line-clamp-2 leading-relaxed">{diff.ruleNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Declarations Baseline Grid */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Fingerprint Declaration Baseline Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'MRP (Inclusive of Taxes)', val: '₹ 225.00', status: 'PRICE_REVISED' },
            { label: 'Net Quantity', val: '350 ml', status: 'VOLUME_DROPPED' },
            { label: 'Manufacturer', val: 'AyurVeda Naturals Pvt Ltd', status: 'UNALTERED' },
            { label: 'Packer', val: 'Haridwar Packaging Works', status: 'UNALTERED' },
            { label: 'Importer', val: 'N/A (Domestic)', status: 'DOMESTIC' },
            { label: 'Country of Origin', val: 'India', status: 'CONFIRMED' },
            { label: 'Generic Name', val: 'Herbal Anti-Dandruff Shampoo', status: 'COMPLIANT' },
            { label: 'Consumer Care Cell', val: '1800-44-9988', status: 'ACTIVE' },
          ].map((item, i) => (
            <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">{item.label}</span>
              <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block truncate">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

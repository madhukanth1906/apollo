'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  AlertCircle, 
  Info, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  Activity,
  Maximize2,
  FileCheck
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';

export const SpectraShieldViewer: React.FC = () => {
  const [activeBand, setActiveBand] = useState<'RGB' | 'UV' | 'NIR'>('UV');
  const [filterIntensity, setFilterIntensity] = useState<number>(80);

  const sample = SAMPLE_PRODUCTS['SAMPLE-SPECTRA'];
  const finding = sample.spectraFindings?.[0];

  return (
    <div className="space-y-6">
      {/* Module Title Banner with Mandatory "Advanced Prototype" Tag */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-xl border border-slate-700 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30 backdrop-blur-sm shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">SpectraShield™ — Multispectral Optical Inspection</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase tracking-wider">
                  Advanced Prototype (R&D)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Evaluates label substrate luminescence and ink absorption across RGB (Visible), UV (365nm), and NIR (850nm) spectral bands.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inspected Item</span>
            <span className="text-xs font-bold text-white">{sample.productName}</span>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-full text-amber-800 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-amber-950">
            <h3 className="font-bold tracking-tight uppercase text-[11px] text-amber-900">
              Statutory Disclaimer — Standard Operating Procedure
            </h3>
            <p className="leading-relaxed">
              Optical spectral signatures provide non-destructive evidence signals only. 
              <strong> The system never confirms counterfeiting or fraud based solely on UV/NIR readings.</strong> Findings 
              are classified as <em>&ldquo;Potential anomaly — requires inspector review&rdquo;</em> and require 
              referral to a certified testing laboratory (RRSL/NPL) for chemical chromatography confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Spectral Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Multi-Band Image Viewer */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Spectral Tab Switcher */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Spectral Band:
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-300">
                {(['RGB', 'UV', 'NIR'] as const).map((band) => (
                  <button
                    key={band}
                    onClick={() => setActiveBand(band)}
                    className={`px-3 py-1 text-xs font-bold rounded transition ${
                      activeBand === band
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {band === 'RGB' && 'RGB Visible'}
                    {band === 'UV' && 'UV 365nm (Fluorescence)'}
                    {band === 'NIR' && 'NIR 850nm (Reflectance)'}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              {activeBand === 'RGB' && 'Visible Spectrum (380-700nm)'}
              {activeBand === 'UV' && 'Long-wave Ultraviolet (UVA)'}
              {activeBand === 'NIR' && 'Near-Infrared Sensor'}
            </span>
          </div>

          {/* Spectral Viewport */}
          <div className="relative aspect-16/10 bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
            {/* Filtered image rendering based on active band */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sample.sampleImages.labelCloseUp}
              alt="Spectral View"
              className={`max-h-full max-w-full object-contain rounded transition-all duration-300 ${
                activeBand === 'UV'
                  ? 'filter hue-rotate-180 invert brightness-125 saturate-200'
                  : activeBand === 'NIR'
                  ? 'filter grayscale contrast-200 brightness-110'
                  : 'filter contrast-105'
              }`}
            />

            {/* Simulated Anomaly Heatmap Overlay (when in UV or NIR mode) */}
            {activeBand !== 'RGB' && (
              <div className="absolute inset-x-24 inset-y-16 border-2 border-dashed border-amber-400 bg-amber-500/20 rounded pointer-events-none flex items-start justify-start p-2">
                <div className="bg-slate-950/90 text-amber-300 text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-amber-400">
                  ⚠ Anomaly Signal Zone: Batch Ink Non-Uniformity
                </div>
              </div>
            )}

            {/* Bottom Spectral Status Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] px-3 py-1 rounded border border-white/20 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  activeBand === 'UV' ? 'bg-purple-400' : activeBand === 'NIR' ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
              />
              <span>Band: <strong>{activeBand}</strong></span>
              <span className="text-slate-400">•</span>
              <span>Exposure: Calibrated Baseline</span>
            </div>
          </div>

          {/* Spectral Observations Description */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
              Active Band Technical Observation:
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {activeBand === 'RGB' && finding?.spectralBands.rgbDescription}
              {activeBand === 'UV' && finding?.spectralBands.uvFluorescence}
              {activeBand === 'NIR' && finding?.spectralBands.nirReflectance}
            </p>
          </div>
        </div>

        {/* Right Col: Anomaly Signal & Review Actions */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Anomaly Signal Card */}
          <div className="bg-white rounded-lg border-2 border-amber-300 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Potential Anomaly Region Detected
              </h3>
            </div>

            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-semibold block">{finding?.anomalySignal}</span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Optical brightener emission at 520nm detected in batch coding zone deviates from registered manufacturer formulation.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Recommended Action
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {finding?.inspectorAdvisory}
              </p>
            </div>

            <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-800 border border-slate-200">
              <strong>Routing Protocol:</strong> LMO may impound sample under Form LM-4 for laboratory spectroscopic chromatography.
            </div>
          </div>

          {/* Standard Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-2">
            <button
              onClick={() => alert('Sample flagged for Reference Standard Laboratory testing.')}
              className="w-full py-2.5 px-3 bg-[#a81c1c] hover:bg-[#8e1717] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Flag for Regional Lab (RRSL)</span>
            </button>

            <button
              onClick={() => alert('Marked as within acceptable industrial ink batch tolerance.')}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
            >
              Accept Within Batch Tolerance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

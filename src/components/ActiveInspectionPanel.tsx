'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Maximize2,
  ScanEye
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ComplianceBadge } from './ComplianceBadge';

export const ActiveInspectionPanel: React.FC = () => {
  const [resolved, setResolved] = useState(false);
  const [isSimulatingCapture, setIsSimulatingCapture] = useState(false);

  const handleResolveEvidence = () => {
    setIsSimulatingCapture(true);
    setTimeout(() => {
      setIsSimulatingCapture(false);
      setResolved(true);
    }, 1200);
  };

  const handleReset = () => {
    setResolved(false);
  };

  const product = SAMPLE_PRODUCTS['SAMPLE-ACTIVE-INSPECTION'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50/70 via-stone-50 to-red-50/40 border border-red-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#a81c1c] to-[#881313] text-white shadow-md shadow-red-900/20 shrink-0">
              <ScanEye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Active Inspection — Adaptive Evidence Resolver</h2>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-mono font-semibold">
                  Human-in-the-Loop AI
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Automatically triggers when OCR or declaration confidence falls below statutory inspection thresholds.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Sample</span>
            <span className="text-xs font-bold text-slate-900">{product.productName}</span>
          </div>
        </div>
      </div>

      {/* Main Resolution Workspace */}
      {!resolved ? (
        <div className="space-y-4">
          {/* Amber Warning Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-full text-amber-800 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    Additional Evidence Required — Ambiguous Region Detected
                  </h3>
                  <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Confidence: 42%
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  MRP declaration could not be read confidently from the uploaded image due to specular bottle glare and packaging curvature.
                </p>
              </div>
            </div>
          </div>

          {/* Region of Interest & Recommended Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ambiguous Image Crop Preview */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Highlighted Ambiguous Region (Current Crop)
                </span>
                <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  OCR Confidence: 42%
                </span>
              </div>

              <div className="relative aspect-4/3 bg-slate-900 flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.sampleImages.front}
                  alt="Glare on bottle"
                  className="max-h-full max-w-full object-contain filter contrast-125 brightness-90"
                />

                {/* Glare bounding box indicator */}
                <div className="absolute inset-x-12 inset-y-16 border-2 border-dashed border-amber-400 bg-amber-400/20 rounded pointer-events-none flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-1 rounded">
                    Glare / Reflection Obstruction
                  </span>
                  <span className="text-[9px] text-white mt-1">
                    Detected: &ldquo;₹ 1??.??&rdquo; (Uncertain digits)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t text-xs text-slate-600">
                <span>Field: <strong>Maximum Retail Price (MRP)</strong> • Rule 6(1)(c)</span>
              </div>
            </div>

            {/* Recommended Action & Trigger Controls */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recommended Inspector Action
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Please capture or upload a closer, glare-free image of the highlighted MRP declaration region on the back panel. Ensure orthogonal angle with diffused illumination.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                    <span className="text-slate-600">Target Resolution:</span>
                    <span className="font-semibold text-slate-900">Minimum 600 x 400 Macro</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                    <span className="text-slate-600">Statutory Acceptance Threshold:</span>
                    <span className="font-semibold text-slate-900">≥ 85% Confidence</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                    <span className="text-slate-600">Current Confidence:</span>
                    <ConfidenceMeter confidence={42} size="sm" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={handleResolveEvidence}
                  disabled={isSimulatingCapture}
                  className="w-full py-2.5 px-4 bg-[#a81c1c] hover:bg-[#8e1717] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>
                    {isSimulatingCapture ? 'Capturing Macro Frame...' : 'Capture Closer Image (Simulate)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleResolveEvidence}
                    className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Macro Crop</span>
                  </button>
                  <button
                    onClick={() => alert('Continued with current uncertainty. Flagged for Senior LMO manual review.')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-semibold"
                  >
                    Continue Without
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Resolved Evidence State */
        <div className="bg-white rounded-lg border-2 border-emerald-300 p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-950">
                  Evidence Resolved — High-Confidence Verification Complete
                </h3>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded uppercase">
                  Status: Resolved
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                New macro capture successfully eliminated optical glare. The mandatory declaration has been unambiguously transcribed.
              </p>
            </div>
          </div>

          {/* Before & After Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Original Capture (With Glare)
              </span>
              <div className="relative h-28 bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.sampleImages.front}
                  alt="Original with glare"
                  className="max-h-full max-w-full object-contain filter contrast-125 brightness-90"
                />
                <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
                    Glare Occluded
                  </span>
                </div>
              </div>
              <div className="text-sm font-mono text-slate-700">
                Value: <strong>₹ 1??.?? (Partial)</strong>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">Previous Confidence:</span>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  42%
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Macro Re-Capture (Resolved)
              </span>
              <div className="relative h-28 bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.sampleImages.back}
                  alt="Macro re-capture resolved"
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                    ✓ Clear Macro
                  </span>
                </div>
              </div>
              <div className="text-sm font-mono text-emerald-950">
                Value: <strong>₹ 1,450.00 (Incl. of all taxes)</strong>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-emerald-800">New Confidence:</span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  96% (High Precision)
                </span>
              </div>
            </div>
          </div>

          {/* Action to reset or advance */}
          <div className="flex items-center justify-between border-t pt-4">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-test Uncertainty Scenario</span>
            </button>

            <button
              onClick={() => alert('Updated declaration table with resolved value: ₹ 175.00')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Commit Resolved Evidence to Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

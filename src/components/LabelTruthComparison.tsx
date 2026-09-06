'use client';

import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Layers, 
  CheckCircle2, 
  Scale, 
  FileWarning, 
  Eye, 
  ArrowRight, 
  Info,
  ShieldAlert,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { LabelTruthFinding } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { ComplianceBadge } from './ComplianceBadge';
import { ConfidenceMeter } from './ConfidenceMeter';

interface LabelTruthComparisonProps {
  finding?: LabelTruthFinding;
  onNavigateToRule?: (ruleId: string) => void;
}

export const LabelTruthComparison: React.FC<LabelTruthComparisonProps> = ({
  finding = SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'].labelTruthFindings?.[0],
  onNavigateToRule,
}) => {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [ruleEvaluationActive, setRuleEvaluationActive] = useState(false);

  if (!finding) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-200 text-center">
        <Layers className="w-12 h-12 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">No Cross-View Inconsistencies Detected</h3>
        <p className="text-xs text-slate-500 mt-1">
          Multi-angle cross-verification shows congruent declarations across packaging panels.
        </p>
      </div>
    );
  }

  const sampleImages = SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'].sampleImages;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">LabelTruth™ — Cross-View Verification</h2>
                <span className="text-[10px] bg-red-500/30 text-red-200 px-2 py-0.5 rounded border border-red-400 font-mono">
                  Multi-Angle Conflict
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated multi-angle comparison detecting dual MRP, discrepancies between promotional stickers and legal panels.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Target Commodity</span>
            <span className="text-xs font-bold text-white">Crispy Munch Butter Gold 200g</span>
          </div>
        </div>
      </div>

      {/* Prominent Warning Callout */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-full text-red-700 flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-900 tracking-tight">
              Declaration Inconsistency Detected Across Packaging Views
            </h3>
            <p className="text-xs text-red-800 leading-relaxed">
              Optical verification detected mutually conflicting values for <strong>{finding.field}</strong> between the 
              promotional display panel and the registered manufacturer legal panel.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-red-900 font-medium">
              <span>Overall AI Inconsistency Confidence:</span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-red-200">
                {finding.confidence}%
              </span>
              <span className="text-red-700">• Status:</span>
              <ComplianceBadge status="INCONSISTENT" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Viewport Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* View A Card */}
        <div className="bg-white rounded-lg border-2 border-amber-300 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-amber-50/80 px-4 py-2.5 border-b border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
              View A: {finding.viewA.name}
            </span>
            <span className="text-[10px] font-mono font-semibold bg-white text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              Front Promotional Area
            </span>
          </div>

          <div className="relative aspect-16/10 bg-slate-900 p-2 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sampleImages.front}
              alt="Front View Crop"
              className="max-h-full max-w-full object-contain rounded"
            />
            {/* Simulated bounding crop callout */}
            <div className="absolute top-4 right-4 bg-slate-950/90 text-white p-2.5 rounded-md border border-amber-400 shadow-xl max-w-[200px]">
              <span className="text-[9px] text-amber-300 uppercase tracking-wide block font-mono">
                Detected MRP Sticker
              </span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {finding.viewA.value}
              </div>
              <div className="text-[10px] text-slate-300">
                Confidence: {finding.viewA.confidence}%
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Extracted Field Value:</span>
              <span className="font-mono font-bold text-base text-slate-900">{finding.viewA.value}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Affixed on front packaging corner via fluorescent adhesive price sticker.
            </p>
          </div>
        </div>

        {/* View B Card */}
        <div className="bg-white rounded-lg border-2 border-red-300 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-red-50/80 px-4 py-2.5 border-b border-red-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-950">
              View B: {finding.viewB.name}
            </span>
            <span className="text-[10px] font-mono font-semibold bg-white text-red-900 px-2 py-0.5 rounded border border-red-300">
              Back Manufacturer Panel
            </span>
          </div>

          <div className="relative aspect-16/10 bg-slate-900 p-2 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sampleImages.back}
              alt="Back View Crop"
              className="max-h-full max-w-full object-contain rounded"
            />
            {/* Simulated bounding crop callout */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 text-white p-2.5 rounded-md border border-red-400 shadow-xl max-w-[200px]">
              <span className="text-[9px] text-red-300 uppercase tracking-wide block font-mono">
                Original Pre-Printed MRP
              </span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {finding.viewB.value}
              </div>
              <div className="text-[10px] text-slate-300">
                Confidence: {finding.viewB.confidence}%
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Extracted Field Value:</span>
              <span className="font-mono font-bold text-base text-slate-900">{finding.viewB.value}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Screen-printed by registered manufacturer alongside batch timestamp.
            </p>
          </div>
        </div>
      </div>

      {/* Discrepancy Breakdown Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Cross-Angle Inconsistency Ledger
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
              <tr>
                <th className="p-2.5">Field</th>
                <th className="p-2.5">Value A (Front)</th>
                <th className="p-2.5">Value B (Back)</th>
                <th className="p-2.5">Price Delta</th>
                <th className="p-2.5">Detection Confidence</th>
                <th className="p-2.5">Consistency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono">
              <tr>
                <td className="p-2.5 font-bold font-sans text-slate-900">{finding.field}</td>
                <td className="p-2.5 font-bold text-amber-700">{finding.viewA.value}</td>
                <td className="p-2.5 font-bold text-blue-700">{finding.viewB.value}</td>
                <td className="p-2.5 font-bold text-red-600">+ ₹ 1.00 (+11.1%)</td>
                <td className="p-2.5 text-slate-800">{finding.confidence}%</td>
                <td className="p-2.5">
                  <ComplianceBadge status="INCONSISTENT" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Statutory Rule Evaluation Callout & Buttons */}
        <div className="mt-4 p-3 bg-blue-50/70 rounded-lg border border-blue-200 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950">
              <strong className="block font-semibold">
                IMPORTANT LEGAL NOTICE (Legal Metrology Framework):
              </strong>
              <span>
                The automated system treats visual inconsistency as an <strong>evidence signal</strong>. 
                Under the Legal Metrology (Packaged Commodities) Rules, 2011, the configured statutory rules 
                determine the final compliance ruling and enforcement outcome.
              </span>
            </div>
          </div>

          {ruleEvaluationActive && (
            <div className="p-3 bg-white rounded border border-blue-300 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-700" />
                  Statutory Rule Evaluation Matrix
                </span>
                <span className="text-[10px] font-mono text-slate-500">{finding.ruleReference}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong>Legal Rule 18(2) Ruling:</strong> &ldquo;No person shall alter, obliterate or smudge the retail sale price printed on the package or sell at a price higher than the retail sale price indicated on the package.&rdquo;
              </p>
              <div className="p-2 bg-red-50 rounded border border-red-200 text-red-900 font-medium">
                <strong>Enforcement Recommendation:</strong> {finding.recommendedAction}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Review High-Res Crop Evidence</span>
            </button>

            <button
              onClick={() => setRuleEvaluationActive(!ruleEvaluationActive)}
              className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{ruleEvaluationActive ? 'Hide Rule Evaluation' : 'Perform Rule Evaluation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Res Comparison Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-4 border border-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Cross-Angle Evidence Crops (Side-by-Side Micro-Inspection)
              </h3>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  Front View Bounding Box (₹10 Sticker)
                </span>
                <div className="aspect-video bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-amber-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sampleImages.front}
                    alt="Front crop"
                    className="object-cover w-full h-full filter contrast-125"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">
                  Back View Bounding Box (₹9 Printed)
                </span>
                <div className="aspect-video bg-slate-900 rounded overflow-hidden flex items-center justify-center border border-blue-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sampleImages.back}
                    alt="Back crop"
                    className="object-cover w-full h-full filter contrast-125"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-slate-100 rounded text-xs text-slate-700 flex justify-between items-center">
              <span>Levenshtein OCR Distance: 0.88 • Optical Overlap Mismatch Confirmed</span>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-semibold"
              >
                Close Micro-View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

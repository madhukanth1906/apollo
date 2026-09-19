'use client';

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Fingerprint,
  ZoomIn
} from 'lucide-react';
import { DeclarationItem } from '@/types/inspection';
import { ComplianceBadge } from './ComplianceBadge';
import { ConfidenceMeter } from './ConfidenceMeter';

interface EvidenceViewerProps {
  item: DeclarationItem | null;
  onClose: () => void;
  onOverrideStatus?: (id: string, newStatus: 'PASS' | 'FAIL') => void;
  fullImageUrl?: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ item, onClose, onOverrideStatus, fullImageUrl }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#a81c1c] to-[#881313] text-white px-4 py-3 flex items-center justify-between border-b border-[#781010]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold">
                Evidence Crop & Legal Verification: {item.field}
              </h3>
              <p className="text-[10px] text-red-100">
                Legal Metrology (Packaged Commodities) Rules, 2011 • {item.pcrRuleClause}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-100 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Top Status & Confidence */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Rule Evaluation Result
              </span>
              <div className="mt-1">
                <ComplianceBadge status={item.status} size="md" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                OCR Token Confidence
              </span>
              <div className="mt-1">
                <ConfidenceMeter confidence={item.confidence} size="md" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Source Angle
              </span>
              <span className="mt-1 inline-block text-xs font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {item.viewSource}
              </span>
            </div>
          </div>

          {/* Evidence Crop Visualizer */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
              <span>Cropped Region of Interest (ROI)</span>
              <span className="font-mono text-[10px] text-[#8b1515] font-normal">
                Bounding Box: x={item.boundingBox?.x || 15}%, y={item.boundingBox?.y || 35}%, w={item.boundingBox?.width || 40}%, h={item.boundingBox?.height || 12}%
              </span>
            </label>

            <div className="relative aspect-16/7 bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-300 flex items-center justify-center p-3">
              {fullImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fullImageUrl}
                  alt={item.field}
                  className="max-h-full max-w-full object-contain filter contrast-125"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <Fingerprint className="w-8 h-8 mx-auto mb-1 text-slate-500" />
                  <p className="text-[11px]">Calibrated Evidence Crop</p>
                </div>
              )}

              {/* Bounding box visual overlay */}
              <div className="absolute inset-x-8 inset-y-4 border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none rounded flex items-start justify-start p-1">
                <span className="bg-emerald-700 text-white text-[9px] font-mono px-1 rounded">
                  {item.confidence}% Match
                </span>
              </div>
            </div>
          </div>

          {/* Extracted OCR Tokens vs Standard Requirement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Raw Extracted OCR Text
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1 bg-slate-100 p-2 rounded border border-slate-200">
                &ldquo;{item.extractedValue}&rdquo;
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Mandatory PCR 2011 Requirement
              </span>
              <p className="text-xs text-slate-800 mt-1 p-2 bg-red-50/40 rounded border border-red-100">
                {item.standardRequirement}
              </p>
            </div>
          </div>

          {/* Legal Reference & Notes */}
          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
            <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              Statutory Basis & Legal Reference
            </h4>
            <p className="text-xs text-amber-900">
              Clause: <strong>{item.pcrRuleClause}</strong> — All pre-packaged commodities distributed in India must bear unambiguous, non-misleading declarations with approved minimum font heights.
            </p>
            {item.inspectorNote && (
              <p className="text-xs text-slate-700 mt-1.5 border-t border-amber-200 pt-1">
                <strong>Inspector Remark:</strong> {item.inspectorNote}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Evidence Cryptographically Fingerprinted • SIH-PCR2011
          </span>
          <div className="flex items-center gap-3">
            {item.status === 'REVIEW' && onOverrideStatus && (
              <div className="flex items-center gap-2 mr-2 border-r border-slate-300 pr-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Override:</span>
                <button
                  onClick={() => { onOverrideStatus(item.id, 'PASS'); onClose(); }}
                  className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded border border-emerald-300 text-[11px] font-bold shadow-xs transition cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => { onOverrideStatus(item.id, 'FAIL'); onClose(); }}
                  className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded border border-rose-300 text-[11px] font-bold shadow-xs transition cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#a81c1c] hover:bg-[#8e1717] text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

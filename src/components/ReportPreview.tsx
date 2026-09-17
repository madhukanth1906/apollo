'use client';

import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  FileCheck, 
  ShieldAlert, 
  Scale, 
  Calendar, 
  User, 
  Building2, 
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { InspectionRecord } from '@/types/inspection';
import { CURRENT_INSPECTOR, SAMPLE_PRODUCTS } from '@/services/mockData';
import { ComplianceBadge } from './ComplianceBadge';
import { OfficialChecklistForm } from './OfficialChecklistForm';

interface ReportPreviewProps {
  record?: InspectionRecord;
  onClose?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  record = SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'],
  onClose,
}) => {
  const [inspectorNotes, setInspectorNotes] = useState<string>(
    'Representative retail packaged samples inspected on-site. Dual MRP discrepancy verified across Front Promotional Panel (₹250) and Back Pre-printed Legal Panel (₹200). Show-Cause Notice recommended under Legal Metrology Act, 2009 Section 36(1) read with Rule 18(2).'
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      portal: 'PAKSHYA — Legal Metrology Inspection Prototype (SIH26034)',
      inspectionId: record.id,
      timestamp: record.timestamp,
      inspector: CURRENT_INSPECTOR,
      product: {
        name: record.productName,
        sku: record.sku,
        barcode: record.barcode,
        category: record.category,
      },
      overallStatus: record.overallStatus,
      declarations: record.declarations,
      labelTruthFindings: record.labelTruthFindings,
      inspectorComments: inspectorNotes,
      certificationHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.id}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a9d93e80009b82fad0f';
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const verificationUrl = `${endpoint}/storage/buckets/reports-bucket/files/${record.id}-pdf/view?project=${projectId}`;

  return (
    <div className="space-y-6" id="printable-report">
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print bg-[#0a1f44] text-white p-4 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            Official Legal Metrology Inspection Report Generator
          </h2>
          <p className="text-xs text-slate-300">
            Form LM-INSP/2026 • Certified Digital Record • Verification ID: {record.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-300" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Certificate (PDF)</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Page 1 & 2: Official Form (Editable by Officer) */}
      <OfficialChecklistForm />

      {/* Page 3: Official Printable Government Sheet (AI Report) */}
      <div className="gov-print-certificate bg-white p-8 rounded-lg border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-800 space-y-6 page-break-before">
        {/* National Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
          {/* Ashoka Stambh / Chakra Emblem */}
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-serif text-slate-800 font-bold">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold tracking-wider uppercase text-slate-700">
            भारत सरकार | Government of India
          </p>
          <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">
            उपभोक्ता मामले विभाग | Department of Consumer Affairs
          </h1>
          <p className="text-xs font-medium text-slate-600">
            Ministry of Consumer Affairs, Food & Public Distribution • Legal Metrology Division
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold tracking-widest uppercase font-mono">
              PAKSHYA — Statutory Inspection Report (Form LM-2026/01)
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 p-3 bg-slate-50/70 rounded">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Inspection Reference ID
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs">{record.id}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Date & Time Stamp
            </span>
            <span className="font-mono text-slate-900 text-xs">{record.date} • {record.timestamp}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Inspecting Officer
            </span>
            <span className="font-bold text-slate-900 text-xs">{CURRENT_INSPECTOR.name}</span>
            <span className="text-[10px] text-slate-500 block font-mono">({CURRENT_INSPECTOR.id})</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Regional Jurisdiction
            </span>
            <span className="text-slate-900 text-xs">{CURRENT_INSPECTOR.region}</span>
          </div>
        </div>

        {/* Product Identity */}
        <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
          <div className="flex flex-wrap justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">{record.productName}</h3>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded border">
              SKU: {record.sku}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-600 text-xs pt-1">
            <span>Commodity Category: <strong>{record.category}</strong></span>
            <span>GTIN / Barcode: <strong className="font-mono">{record.barcode}</strong></span>
            <span>Verification Method: <strong>Multi-Angle Optical Scan (AI-Assisted)</strong></span>
          </div>
        </div>

        {/* Overall Compliance Verdict Banner */}
        <div
          className={`p-4 rounded-lg border-2 flex items-center justify-between gap-4 ${
            record.overallStatus === 'PASS'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : record.overallStatus === 'FAIL'
              ? 'bg-red-50 border-red-400 text-red-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              Statutory Compliance Determination:
            </span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">
              {record.overallStatus === 'PASS' && 'FULLY COMPLIANT WITH PCR 2011'}
              {record.overallStatus === 'FAIL' && 'NON-COMPLIANT — STATUTORY VIOLATION CONFIRMED'}
              {record.overallStatus === 'REVIEW' && 'ACTION REQUIRED — EVIDENCE INCONCLUSIVE'}
            </h2>
            <p className="text-xs mt-1">
              Evaluated against Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009.
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <ComplianceBadge status={record.overallStatus} size="lg" />
            <span className="text-[11px] font-mono font-bold block mt-1">
              Score: {record.overallScore}/100
            </span>
          </div>
        </div>

        {/* Declarations Ledger Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Mandatory Declarations Audit Summary (Rule 6)
          </h4>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
              <tr>
                <th className="p-2 border-r">Mandatory Declaration</th>
                <th className="p-2 border-r">Statutory Rule</th>
                <th className="p-2 border-r">Extracted Value</th>
                <th className="p-2 border-r text-center">Confidence</th>
                <th className="p-2 text-center">Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {record.declarations.map((d) => (
                <tr key={d.id}>
                  <td className="p-2 border-r font-medium text-slate-900">{d.field}</td>
                  <td className="p-2 border-r font-mono text-[11px] text-slate-600">{d.pcrRuleClause}</td>
                  <td className="p-2 border-r font-mono text-[11px] text-slate-800">{d.extractedValue}</td>
                  <td className="p-2 border-r text-center font-mono">
                    {d.isManualOverride ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        Manual Override
                      </span>
                    ) : (
                      `${d.confidence}%`
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <ComplianceBadge status={d.status} size="sm" showIcon={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LabelTruth Finding Section (if present) */}
        {record.labelTruthFindings && record.labelTruthFindings.length > 0 && (
          <div className="p-3 bg-red-50/70 rounded border border-red-200 text-xs space-y-2">
            <h4 className="font-bold text-red-950 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              2. LabelTruth™ Cross-View Inconsistency Finding
            </h4>
            {record.labelTruthFindings.map((lt) => (
              <div key={lt.id} className="space-y-1">
                <p className="text-red-900 leading-relaxed">
                  <strong>Conflict Detected:</strong> {lt.field} declared as{' '}
                  <span className="font-mono font-bold text-red-800">{lt.viewA.value}</span> on {lt.viewA.name} and{' '}
                  <span className="font-mono font-bold text-red-800">{lt.viewB.value}</span> on {lt.viewB.name}.
                </p>
                <p className="text-slate-700">
                  <strong>Statutory Basis:</strong> {lt.ruleReference} — {lt.legalExplanation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Inspector Comments & Legal Recommendation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. Inspecting Officer Formal Observations & Notice
          </h4>
          <textarea
            value={inspectorNotes}
            onChange={(e) => setInspectorNotes(e.target.value)}
            rows={3}
            className="w-full text-xs p-2.5 rounded border border-slate-300 font-sans leading-relaxed focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* 4. Photographic Evidence / Proof of Violation */}
        {(record.sampleImages?.front || record.sampleImages?.back || record.declarations.some(d => d.evidenceCrop)) && (
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Attached Photographic Evidence (Proof of Violation)
            </h4>
            <div className="flex flex-wrap gap-4">
              {record.sampleImages?.front && (
                <div className="w-1/2 max-w-[200px]">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Front View (PDP)</p>
                  <div className="h-48 border border-slate-300 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={record.sampleImages.front} alt="Front View Evidence" className="w-full h-full object-contain bg-slate-50" />
                  </div>
                </div>
              )}
              {record.sampleImages?.back && (
                <div className="w-1/2 max-w-[200px]">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Back View (Legal Panel)</p>
                  <div className="h-48 border border-slate-300 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={record.sampleImages.back} alt="Back View Evidence" className="w-full h-full object-contain bg-slate-50" />
                  </div>
                </div>
              )}
              {record.declarations.filter(d => d.evidenceCrop).map((d, i) => (
                <div key={d.id} className="w-1/2 max-w-[200px]">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">CV Measurement ({d.viewSource})</p>
                  <div className="h-48 border border-slate-300 rounded overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.evidenceCrop} alt={`CV Evidence ${i}`} className="w-full h-full object-contain bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Signature and Stamp Box */}
        <div className="border-t-2 border-slate-800 pt-6 mt-8 flex justify-between items-end text-xs">
          <div className="space-y-2">
            <a 
              href={verificationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-28 h-28 border border-slate-300 rounded p-2 bg-white hover:border-blue-500 hover:shadow-md transition cursor-pointer"
              title="Click to view digital certificate"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(verificationUrl)}&size=100x100&margin=0`} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </a>
            <p className="text-[9px] font-mono text-slate-500">
              Cryptographic Token: PAKSHYA-SIG-2026-X9
            </p>
            <p className="text-[9px] text-slate-500">
              Scan or click the link above to view digital certificate on Appwrite Cloud
            </p>
            <p className="text-[8px] text-slate-400 mt-1">
              (QR generated via goqr.me API - No API Key Required)
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="font-serif italic text-base text-slate-900 font-bold">
              {CURRENT_INSPECTOR.name}
            </div>
            <div className="h-0.5 w-48 bg-slate-800 ml-auto" />
            <p className="font-bold text-slate-900">{CURRENT_INSPECTOR.designation}</p>
            <p className="text-slate-600 text-[10px]">
              Legal Metrology Division • Government of India
            </p>
            <p className="text-slate-500 text-[9px]">Digitally signed via e-Sign NIC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

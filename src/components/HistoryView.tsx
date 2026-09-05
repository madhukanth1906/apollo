'use client';

import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  FileCheck, 
  Download, 
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Printer,
  FileText,
  Building2,
  Scale
} from 'lucide-react';
import { RECENT_INSPECTIONS, CURRENT_INSPECTOR } from '@/services/mockData';
import { ComplianceStatus, InspectionRecord } from '@/types/inspection';
import { ComplianceBadge } from './ComplianceBadge';

interface HistoryViewProps {
  onSelectRecord?: (record: InspectionRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeDrawerRecord, setActiveDrawerRecord] = useState<InspectionRecord | null>(null);

  const filtered = RECENT_INSPECTIONS.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.overallStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (rec: InspectionRecord) => {
    setActiveDrawerRecord(rec);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Central Inspection Log & Digital Repository</h2>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-400 font-mono">
                  1,248 Records Stored
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Audit trail of all field inspections logged under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Exporting complete inspection repository audit log (CSV/Excel)...')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product name, inspection ID (e.g. INSP-2026-08491), brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          {['ALL', 'PASS', 'FAIL', 'REVIEW'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                statusFilter === st
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Responsive Split Grid (Table on Left, Contained Drawer on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inspection History Table */}
        <div className={`transition-all duration-300 ${activeDrawerRecord ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Inspection ID</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Product / Commodity</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filtered.map((rec) => {
                    const isSelected = activeDrawerRecord?.id === rec.id;

                    return (
                      <tr 
                        key={rec.id} 
                        onClick={() => handleRowClick(rec)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-blue-900">{rec.id}</td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {rec.date} <span className="text-[10px] text-slate-400 font-mono">({rec.timestamp})</span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{rec.productName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{rec.sku}</div>
                        </td>
                        <td className="p-3 text-slate-600">{rec.category}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900">
                          {rec.overallScore}%
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <ComplianceBadge status={rec.overallStatus} size="sm" />
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(rec);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition inline-flex items-center gap-1 ${
                              isSelected
                                ? 'bg-blue-900 text-white border-blue-900'
                                : 'text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border-blue-200'
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isSelected ? 'Viewing' : 'View Report'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filtered.length} inspected commodity records</span>
              <span className="font-mono text-[11px]">Click any row to view its report panel</span>
            </div>
          </div>
        </div>

        {/* Contained Report Side-Panel (Never covers full screen!) */}
        {activeDrawerRecord && (
          <div className="lg:col-span-5 bg-white rounded-lg border-2 border-blue-300 shadow-lg overflow-hidden flex flex-col max-h-[800px] animate-in fade-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="bg-[#0a1f44] text-white p-3.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Inspection Report Summary
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    {activeDrawerRecord.id} • {activeDrawerRecord.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {onSelectRecord && (
                  <button
                    onClick={() => onSelectRecord(activeDrawerRecord)}
                    className="text-[10px] bg-blue-800 hover:bg-blue-700 text-white px-2 py-1 rounded font-semibold transition"
                    title="Open Print Dialog"
                  >
                    Print Certificate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveDrawerRecord(null)}
                  className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition"
                  title="Close side panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
              {/* Product Info & Status */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{activeDrawerRecord.productName}</h4>
                  <ComplianceBadge status={activeDrawerRecord.overallStatus} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>SKU: <strong className="font-mono text-slate-800">{activeDrawerRecord.sku}</strong></div>
                  <div>Category: <strong className="text-slate-800">{activeDrawerRecord.category}</strong></div>
                  <div>Score: <strong className="font-mono text-blue-900">{activeDrawerRecord.overallScore}/100</strong></div>
                  <div>Inspector: <strong className="text-slate-800">{activeDrawerRecord.inspectorName}</strong></div>
                </div>
              </div>

              {/* Declarations List (if any) */}
              {activeDrawerRecord.declarations && activeDrawerRecord.declarations.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    Mandatory Declarations Checked (Rule 6)
                  </h5>
                  <div className="divide-y divide-slate-200 border rounded overflow-hidden">
                    {activeDrawerRecord.declarations.map((d) => (
                      <div key={d.id} className="p-2.5 bg-white flex items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="font-semibold text-slate-900">{d.field}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{d.extractedValue}</div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500">{d.confidence}%</span>
                          <ComplianceBadge status={d.status} size="sm" showIcon={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50/60 rounded border border-blue-200 text-xs text-blue-900">
                  All standard statutory declarations verified compliant with Legal Metrology (Packaged Commodities) Rules, 2011.
                </div>
              )}

              {/* Inconsistencies or Notes */}
              {activeDrawerRecord.labelTruthFindings && activeDrawerRecord.labelTruthFindings.length > 0 && (
                <div className="p-3 bg-red-50 rounded border border-red-200 space-y-1 text-xs text-red-900">
                  <div className="font-bold uppercase tracking-wide text-[10px] text-red-800">
                    Dual MRP / Packaging Inconsistency
                  </div>
                  <p className="text-[11px] leading-snug">
                    {activeDrawerRecord.labelTruthFindings[0].field}: {activeDrawerRecord.labelTruthFindings[0].viewA.value} vs {activeDrawerRecord.labelTruthFindings[0].viewB.value}
                  </p>
                  <div className="text-[10px] text-slate-600 pt-1">
                    Reference: Rule 18(2) & Section 36(1)
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Inspector Observation
                </span>
                <p className="text-[11px] text-slate-700 italic leading-relaxed">
                  {activeDrawerRecord.overallStatus === 'PASS'
                    ? 'All packaging declarations compliant with Schedule II font height norms and metric standards.'
                    : activeDrawerRecord.overallStatus === 'FAIL'
                    ? 'Statutory non-compliance detected. Show-cause notice recommended under Section 36(1).'
                    : 'Ambiguous declaration region flagged for further laboratory verification.'}
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setActiveDrawerRecord(null)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
              >
                Close Panel
              </button>

              {onSelectRecord && (
                <button
                  type="button"
                  onClick={() => onSelectRecord(activeDrawerRecord)}
                  className="px-3 py-1.5 bg-[#0a1f44] hover:bg-blue-900 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Full Official Form</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

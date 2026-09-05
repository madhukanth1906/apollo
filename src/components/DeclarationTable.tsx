'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  HelpCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { DeclarationItem, ComplianceStatus } from '@/types/inspection';
import { ComplianceBadge } from './ComplianceBadge';
import { ConfidenceMeter } from './ConfidenceMeter';

interface DeclarationTableProps {
  declarations: DeclarationItem[];
  onInspectEvidence: (item: DeclarationItem) => void;
  onStatusChange?: (id: string, newStatus: ComplianceStatus) => void;
  selectedId?: string;
}

export const DeclarationTable: React.FC<DeclarationTableProps> = ({
  declarations,
  onInspectEvidence,
  onStatusChange,
  selectedId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL' | 'REVIEW'>('ALL');

  const filteredItems = declarations.filter((item) => {
    const matchesSearch = 
      item.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extractedValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pcrRuleClause.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: declarations.length,
    pass: declarations.filter((d) => d.status === 'PASS').length,
    fail: declarations.filter((d) => d.status === 'FAIL').length,
    review: declarations.filter((d) => d.status === 'REVIEW').length,
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-700" />
            Mandatory Declarations Audit (PCR 2011 Schedule II)
          </h3>
          <p className="text-[11px] text-slate-500">
            Legal Metrology compliance verification across Principal Display Panel & Legal Area
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('PASS')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              statusFilter === 'PASS'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Pass ({counts.pass})
          </button>
          <button
            onClick={() => setStatusFilter('FAIL')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              statusFilter === 'FAIL'
                ? 'bg-red-700 text-white'
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            Violation ({counts.fail})
          </button>
          <button
            onClick={() => setStatusFilter('REVIEW')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              statusFilter === 'REVIEW'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Review ({counts.review})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search declaration (e.g. MRP, Net Quantity, Manufacturer, Rule 6)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Mandatory Declaration</th>
              <th className="py-2.5 px-3">Extracted Value (OCR)</th>
              <th className="py-2.5 px-3">Rule Clause</th>
              <th className="py-2.5 px-3">AI Confidence</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Evidence Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No declarations matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-blue-50/50 ${
                      isSelected ? 'bg-amber-50/80 font-medium' : ''
                    }`}
                  >
                    {/* Declaration Name */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.field}</div>
                      {item.hindiLabel && (
                        <div className="text-[10px] text-slate-500">{item.hindiLabel}</div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Source: {item.viewSource}
                      </div>
                    </td>

                    {/* Extracted Value */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <div
                        className={`text-xs font-mono font-medium ${
                          item.status === 'FAIL'
                            ? 'text-red-700 font-semibold'
                            : item.status === 'REVIEW'
                            ? 'text-amber-800'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.extractedValue}
                      </div>
                      {item.inspectorNote && (
                        <p className="text-[10px] text-slate-500 mt-0.5 italic line-clamp-2">
                          Note: {item.inspectorNote}
                        </p>
                      )}
                    </td>

                    {/* PCR Rule Clause */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.pcrRuleClause}
                      </span>
                    </td>

                    {/* Confidence Meter */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <ConfidenceMeter confidence={item.confidence} size="sm" />
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <ComplianceBadge status={item.status} size="sm" />
                    </td>

                    {/* Evidence Button */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectEvidence(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Crop</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span>
          Showing {filteredItems.length} of {declarations.length} evaluated Legal Metrology declarations.
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> All mandatory fields verified
          </span>
        </div>
      </div>
    </div>
  );
};

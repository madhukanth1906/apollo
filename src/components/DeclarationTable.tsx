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
  onOverrideStatus?: (id: string, newStatus: ComplianceStatus) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export const DeclarationTable: React.FC<DeclarationTableProps> = ({
  declarations,
  onInspectEvidence,
  onStatusChange,
  onOverrideStatus,
  selectedId,
  isLoading = false,
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

  const counts = isLoading ? { all: 0, pass: 0, fail: 0, review: 0 } : {
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B2852] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0B2852]" />
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
            className={`px-2.5 py-1 rounded-md font-semibold transition shadow-sm ${
              statusFilter === 'ALL'
                ? 'bg-[#0B2852] text-white border border-[#0B2852]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-2.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-5 bg-slate-200 rounded-full w-16 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="h-6 bg-slate-200 rounded w-20 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredItems.length === 0 ? (
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
                      isSelected ? 'bg-[#F5F7FB] shadow-inner shadow-blue-900/5' : ''
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
                      {item.isManualOverride ? (
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded">
                          Manual Override
                        </span>
                      ) : (
                        <ConfidenceMeter confidence={item.confidence} size="sm" />
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1.5">
                        <ComplianceBadge status={item.status} size="sm" />
                        {item.status === 'REVIEW' && onOverrideStatus && (
                          <div className="flex justify-center gap-1.5 mt-0.5">
                            <button 
                              onClick={() => onOverrideStatus(item.id, 'PASS')} 
                              className="text-[9px] font-bold bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.5 rounded shadow-sm hover:bg-emerald-100 transition"
                            >
                              APPROVE
                            </button>
                            <button 
                              onClick={() => onOverrideStatus(item.id, 'FAIL')} 
                              className="text-[9px] font-bold bg-rose-50 border border-rose-300 text-rose-700 px-1.5 py-0.5 rounded shadow-sm hover:bg-rose-100 transition"
                            >
                              REJECT
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Evidence Button */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectEvidence(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#0B2852] hover:text-white bg-white hover:bg-[#2563EB] rounded-md border border-slate-300 hover:border-[#2563EB] transition shadow-sm"
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

'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Info,
  ShieldCheck,
  History
} from 'lucide-react';
import { PCRRule } from '@/types/inspection';
import { PCR_RULES } from '@/services/mockData';

export const RulesDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<PCRRule | null>(null);

  const filteredRules = PCR_RULES.filter((rule) => {
    return (
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.ruleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.applicability.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Legal Metrology (Packaged Commodities) Rules, 2011</h2>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-400 font-mono">
                  Official Statutory Handbook
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Central regulatory framework for mandatory declarations, metric standards, unit sale pricing, and prohibited packaging practices.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Act Reference</span>
            <span className="text-xs font-bold text-white">Legal Metrology Act, 2009 (No. 1 of 2010)</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search rules by section, title or keywords (e.g. MRP, Unit Sale Price, Rule 6, Net Qty)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredRules.length}</strong> active PCR clauses
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.ruleId}
            className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b pb-2 mb-2.5">
                <div>
                  <span className="text-xs font-bold text-blue-900 font-mono">
                    {rule.ruleNumber}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {rule.title}
                  </h3>
                </div>
                <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                  {rule.status}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Applicability:
                  </span>
                  <p className="text-[11px] text-slate-700 line-clamp-2">{rule.applicability}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Regulatory Summary:
                  </span>
                  <p className="text-[11px] text-slate-700 line-clamp-3">{rule.summary}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Evidence Requirement:
                  </span>
                  <p className="text-[11px] text-slate-600 italic line-clamp-2">
                    {rule.mandatoryEvidence}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setSelectedRule(rule)}
                className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
              >
                View Full Rule
              </button>

              <button
                onClick={() => alert(`Showing configured evidence requirement for ${rule.ruleNumber}`)}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition"
              >
                Evidence Specs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Rule Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-5 border border-slate-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-800" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedRule.ruleNumber} — {selectedRule.title}</h3>
                  <p className="text-[10px] text-slate-500">{selectedRule.version}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded border">
                <h4 className="font-bold text-slate-900 mb-1">Full Statutory Clause Text</h4>
                <p className="italic font-serif leading-relaxed text-slate-800">&ldquo;{selectedRule.fullClauseText}&rdquo;</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Penalty Section for Non-Compliance</h4>
                <p className="p-2 bg-red-50 text-red-900 rounded border border-red-200 font-mono">
                  {selectedRule.penaltySection}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Mandatory Physical & Digital Evidence Standard</h4>
                <p className="p-2 bg-blue-50 text-blue-900 rounded border border-blue-200">
                  {selectedRule.mandatoryEvidence}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-4 py-1.5 bg-[#0a1f44] text-white rounded text-xs font-semibold"
              >
                Close Clause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter,
  ChevronDown,
  FileText,
  List,
  LayoutGrid,
  AlignJustify,
  FileBox,
  CreditCard,
  Hash,
  Tag,
  Ban,
  UserCheck,
  ShieldCheck,
  FileDown,
  Info,
  Scale,
  History,
  Calendar,
  X
} from 'lucide-react';
import { PCR_RULES } from '@/services/mockData';

export const RulesDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<any>(null);

  // We are hardcoding the display cards as per the UI spec for the demo
  const displayRules = [
    { id: '6-1-a', num: 'Rule 6(1)(a)', title: 'Generic Name / Common Description', tag: 'MANDATORY', tagClass: 'bg-emerald-100 text-emerald-700', icon: FileText, iconClass: 'bg-slate-100 text-slate-700', app: 'All packaged commodities intended for retail sale', sum: 'Every package must bear the common or generic name of the commodity contained within it.', ev: 'Visible text extraction of product name' },
    { id: '6-1-b', num: 'Rule 6(1)(b)', title: 'Net Quantity Declaration in Standard...', tag: 'MANDATORY', tagClass: 'bg-emerald-100 text-emerald-700', icon: FileBox, iconClass: 'bg-emerald-100 text-emerald-600', app: 'All commodities sold by weight, measure or number', sum: 'Must declare net quantity in standard units of weight, measure or number.', ev: 'OCR of net weight/volume numeral + unit' },
    { id: '6-1-c', num: 'Rule 6(1)(c)', title: 'Maximum Retail Price (MRP)', tag: 'MANDATORY', tagClass: 'bg-emerald-100 text-emerald-700', icon: CreditCard, iconClass: 'bg-rose-100 text-rose-600', app: 'All retail packages', sum: 'Declaration of retail sale price inclusive of all taxes.', ev: 'OCR of MRP text and numeric value' },
    { id: '6-1-g', num: 'Rule 6(1)(g)', title: 'Consumer Care & Grievance Redressal', tag: 'MANDATORY', tagClass: 'bg-emerald-100 text-emerald-700', icon: UserCheck, iconClass: 'bg-amber-100 text-amber-600', app: 'All retail packages', sum: 'Must declare name, address, phone number, and email of person/office to be contacted in case of consumer complaints.', ev: 'OCR extraction of contact details' },
    { id: '9-sch-2', num: 'Rule 9 / Schedule II', title: 'Manner of Declaration & Minimum...', tag: 'ACTIVE', tagClass: 'bg-red-100 text-[#8b1515]', icon: Scale, iconClass: 'bg-red-50 text-[#8b1515]', app: 'All mandatory declarations on PDP', sum: 'Specifies the minimum height of numerals and letters for declarations based on the net quantity / area of the principal display panel.', ev: 'Macro dimension estimation of text height' },
    { id: '18-2', num: 'Rule 18(2)', title: 'Prohibition Against Dual MRP', tag: 'MANDATORY', tagClass: 'bg-emerald-100 text-emerald-700', icon: Ban, iconClass: 'bg-rose-100 text-rose-600', app: 'All retail packages', sum: 'No manufacturer or packer shall alter the price once printed or print dual MRPs on the package.',LabelTruth: 'Cross-reference multiple MRP print zones' },
  ];

  return (
    <div className="p-6 bg-slate-100 flex-1 space-y-4">
      {/* 1. Hero Header Banner */}
      <div className="bg-gradient-to-r from-red-50/70 via-stone-50 to-red-50/40 border border-red-200/80 rounded-xl p-5 flex items-center justify-between relative overflow-hidden shadow-xs">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-[#a81c1c] text-white flex items-center justify-center shadow-md shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Legal Metrology (Packaged Commodities) Rules, 2011</h2>
              <span className="bg-red-50 text-[#8b1515] text-xs font-bold px-2.5 py-0.5 rounded-md border border-red-200">
                Official Statutory Handbook
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Central regulatory framework for mandatory declarations, metric standards, unit sale pricing, and prohibited packaging practices.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Act Reference</span>
          <span className="text-sm font-bold text-slate-900 block leading-tight">Legal Metrology Act, 2009</span>
          <span className="text-xs font-semibold text-slate-700 block">(No. 1 of 2010)</span>
        </div>
      </div>

      {/* 2. Search & Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-[#a81c1c]">
          <Search className="text-slate-400 w-4 h-4 mr-2" />
          <input 
            type="text" 
            placeholder="Search rules by section, title or keywords (e.g. MRP, Net Quantity, Rule 6, Label, etc.)"
            className="w-full bg-transparent text-sm outline-hidden text-slate-800 placeholder-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="bg-white border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>

        <button className="bg-white border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
          All Sections <ChevronDown className="w-4 h-4" />
        </button>

        <button className="bg-white border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
          Sort By <ChevronDown className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-white border border-slate-300 p-1 rounded-lg shadow-sm">
          <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-700"><FileText className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-700"><List className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-md bg-[#a81c1c] text-white shadow-xs"><LayoutGrid className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-700"><AlignJustify className="w-4 h-4" /></button>
        </div>
      </div>

      {/* 3. Filter Category Chips / Tabs */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button className="bg-[#a81c1c] text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer">
          All Rules
          <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">35</span>
        </button>
        {[
          { label: 'Packaging Declarations', count: 12 },
          { label: 'MRP & Pricing', count: 6 },
          { label: 'Net Quantity', count: 5 },
          { label: 'Labels & Markings', count: 4 },
          { label: 'Prohibitions', count: 4 },
          { label: 'Consumer Rights', count: 4 },
        ].map((chip, idx) => (
          <button key={idx} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-1.5 rounded-lg text-xs border border-slate-200 flex items-center gap-1.5 transition">
            {chip.label}
            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[11px] font-bold">{chip.count}</span>
          </button>
        ))}
      </div>

      {/* 4. Main Body: Rule Cards Grid & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Left Grid: 6 Rule Cards */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg p-2.5 flex items-center justify-center shrink-0 ${rule.iconClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{rule.num}</span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{rule.title}</h3>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase ml-2 shrink-0 ${rule.tagClass}`}>
                      {rule.tag}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">APPLICABILITY:</span>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{rule.app}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">REGULATORY SUMMARY:</span>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{rule.sum}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">EVIDENCE REQUIREMENT:</span>
                      <p className="text-xs text-slate-600 italic mt-0.5 line-clamp-1">{rule.ev}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setSelectedRule(rule)} className="bg-[#a81c1c] hover:bg-[#8e1717] text-white text-xs font-bold px-3 py-2 rounded-lg flex-1 flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer">
                    View Full Rule
                  </button>
                  <button onClick={() => setSelectedRule(rule)} className="bg-red-50 hover:bg-red-100 text-[#8b1515] text-xs font-bold px-3 py-2 rounded-lg flex-1 flex items-center justify-center gap-1.5 border border-red-200 transition cursor-pointer">
                    Evidence Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Box 1: Rulebook Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Rulebook Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-red-50 text-[#8b1515] p-2 rounded-lg"><FileText className="w-4 h-4" /></div>
                  <span className="text-xs text-slate-500 font-medium">Total Rules</span>
                </div>
                <span className="text-lg font-bold text-slate-900">35</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><ShieldCheck className="w-4 h-4" /></div>
                  <span className="text-xs text-slate-500 font-medium">Mandatory Rules</span>
                </div>
                <span className="text-lg font-bold text-slate-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 text-amber-600 p-2 rounded-lg"><BookOpen className="w-4 h-4" /></div>
                  <span className="text-xs text-slate-500 font-medium">Active Sections</span>
                </div>
                <span className="text-lg font-bold text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 text-slate-700 p-2 rounded-lg"><Calendar className="w-4 h-4" /></div>
                  <span className="text-xs text-slate-500 font-medium">Last Updated</span>
                </div>
                <span className="text-sm font-bold text-slate-900">15 Sept 2026</span>
              </div>
            </div>
          </div>

          {/* Box 2: Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center mb-3">
              <BookOpen className="text-[#8b1515] w-5 h-5 mr-2" />
              <h3 className="text-base font-bold text-slate-900">Quick Links</h3>
            </div>
            <div className="flex flex-col">
              {[
                'Download Full Rulebook (PDF)',
                'Legal Metrology Act, 2009',
                'Packaged Commodities Rules, 2011',
                'Amendments & Notifications',
                'Implementation Guidelines',
                'FAQ for Inspectors'
              ].map((link, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2 text-xs font-semibold text-slate-800 hover:text-[#8b1515] cursor-pointer border-b border-slate-100 last:border-b-0 transition">
                  <FileDown className="w-4 h-4 text-slate-400" />
                  <span>{link}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Bottom Promotional Banner */}
          <div className="bg-gradient-to-br from-red-50/60 via-stone-50 to-red-50/30 rounded-xl border border-red-200 p-4 relative overflow-hidden shadow-xs">
            <span className="text-[#8b1515] font-serif italic text-sm font-bold leading-snug relative z-10 block pr-8">
              “Fair Measurement Builds a Fair Nation”
            </span>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-orange-100/40 via-white/20 to-red-100/40 opacity-40 z-0"></div>
          </div>
        </div>
      </div>

      {/* 5. Full Rule Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-300 overflow-hidden relative">
            <button
              onClick={() => setSelectedRule(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase mb-2 inline-block ${selectedRule.tagClass}`}>
                {selectedRule.tag}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{selectedRule.num}</h3>
              <h4 className="text-sm font-semibold text-slate-700 mt-1">{selectedRule.title}</h4>
            </div>
            <div className="p-6 space-y-4 text-sm text-slate-800">
              <div>
                <span className="font-bold block mb-1">Applicability:</span>
                {selectedRule.app}
              </div>
              <div>
                <span className="font-bold block mb-1">Regulatory Summary:</span>
                {selectedRule.sum}
              </div>
              <div>
                <span className="font-bold block mb-1">Evidence Requirement:</span>
                {selectedRule.ev}
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="px-4 py-1.5 bg-[#a81c1c] text-white rounded-lg font-bold text-xs hover:bg-[#8e1717] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

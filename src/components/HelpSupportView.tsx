'use client';

import React, { useState } from 'react';
import { 
  Headphones, 
  PhoneCall, 
  Building2, 
  Search, 
  FileDown, 
  PlaySquare, 
  HelpCircle, 
  MessageSquare,
  ChevronDown,
  FolderOpen
} from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "What is the minimum font size for MRP as per Schedule II?", a: "For a principal display panel area up to 50 sq cm, the minimum height is 1mm. For 50-100 sq cm, it is 1.5mm. For 100-500 sq cm, it is 2.5mm. For 500-2500 sq cm, it is 4mm. For >2500 sq cm, it is 6mm." },
    { q: "Is dual MRP allowed on packaged commodities?", a: "No. As per Rule 18(2) of the Legal Metrology (Packaged Commodities) Rules, 2011, no manufacturer or packer or importer shall declare different maximum retail prices on an identical pre-packaged commodity." },
    { q: "What details are mandatory on the principal display panel (PDP)?", a: "The PDP must prominently display the common/generic name of the commodity, net quantity in standard units, and the retail sale price (MRP). Other declarations like manufacturer address can be elsewhere." },
    { q: "How to report a violation or file a complaint?", a: "Consumers can file complaints through the National Consumer Helpline (1915), the integrated umang app, or directly to the State Legal Metrology Controller's office." },
    { q: "Where can I get the latest amendments to the Rules, 2011?", a: "You can download the latest amendments and notifications directly from the 'Key Resources' section on this page, or visit the official consumeraffairs.nic.in portal." }
  ];

  return (
    <div className="p-6 bg-slate-100 flex-1 space-y-6">
      {/* 1. Hero Header Banner */}
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-50 border border-indigo-200/80 rounded-xl p-6 flex items-center justify-between relative overflow-hidden shadow-xs">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Headphones className="w-7 h-7" />
          </div>
          <div className="ml-4">
            <span className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase block">WE ARE HERE TO HELP</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">Help & Statutory Guidance</h2>
            <p className="text-xs font-semibold text-slate-700 mt-1">Legal Metrology Inspection Operating Standards & Toll-Free Assistance</p>
            <p className="text-xs text-slate-500 mt-0.5">Get support, guidance and resources for compliance with the Legal Metrology (Packaged Commodities) Rules, 2011.</p>
          </div>
        </div>
        <div className="shrink-0 pl-8">
          <span className="text-indigo-900 font-serif italic text-base font-bold block">“Fair Measurement Builds a Fair Nation”</span>
        </div>
      </div>

      {/* 2. Top Primary Assistance Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        {/* Left Card: National Consumer Helpline */}
        <div className="bg-rose-50/60 rounded-xl border border-rose-200/70 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="z-10">
            <div className="flex items-center">
              <h3 className="text-sm font-bold text-slate-900">National Consumer Helpline (NCH)</h3>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full ml-2">Toll Free</span>
            </div>
            <div className="text-2xl font-black text-blue-900 tracking-tight mt-1">
              1915 <span className="text-blue-900/40">|</span> 1800-11-4000
            </div>
            <div className="flex items-center mt-1">
              <span className="font-semibold text-slate-700 text-xs mr-1">Operation Hours</span>
              <span className="text-slate-500 text-xs">Monday to Saturday, 9:30 AM to 5:30 PM (IST)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Field Inspection Guidance */}
        <div className="bg-blue-50/60 rounded-xl border border-blue-200/70 p-5 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="z-10 w-full pr-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Field Inspection Guidance (From LM)</h3>
            <p className="text-xs text-slate-600 max-w-md mt-1">
              For doubts regarding minimum numeral height under Schedule II, dual MRP enforcement, refer to the Rules & Guidelines module.
            </p>
            <button className="bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3.5 py-2 rounded-lg mt-3 inline-flex items-center gap-1.5 shadow-sm transition">
              Browse Rules & Guidelines →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Search Bar Section & Quick Action Cards Row */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">How can we help you?</h2>
        <p className="text-xs text-slate-500 mt-0.5">Find quick answers, access important resources, or contact the right authority.</p>
        
        <div className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 flex items-center shadow-sm mt-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <Search className="text-slate-400 w-5 h-5 mr-3" />
          <input 
            type="text" 
            placeholder="Search help topics (e.g. MRP, label requirements, inspection, rules...)" 
            className="w-full bg-transparent text-sm outline-hidden text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Download Documents</h4>
                <p className="text-[11px] text-blue-600 mt-0.5">Rules, circulars, templates</p>
              </div>
            </div>
            <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </div>
          
          <div className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-lg shrink-0">
                <PlaySquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Video Guides</h4>
                <p className="text-[11px] text-emerald-600 mt-0.5">Step-by-step tutorials</p>
              </div>
            </div>
            <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </div>
          
          <div className="bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">FAQs</h4>
                <p className="text-[11px] text-purple-600 mt-0.5">Common questions</p>
              </div>
            </div>
            <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Main Section: FAQs & Key Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Card: Frequently Asked Questions */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-blue-600 bg-blue-50 p-2 rounded-lg inline-block mr-2.5">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All →</button>
            </div>
            
            <div className="space-y-2.5">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border ${openFaq === i ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'} rounded-lg transition-colors overflow-hidden`}
                >
                  <div className="p-3.5 flex items-center justify-between cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className={`text-xs font-semibold ${openFaq === i ? 'text-blue-700' : 'text-slate-800'}`}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === i ? 'text-blue-600 rotate-180' : 'text-slate-400'}`} />
                  </div>
                  {openFaq === i && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Key Resources */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-blue-600 bg-blue-50 p-2 rounded-lg inline-block mr-2.5">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Key Resources</h3>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All →</button>
            </div>
            
            <div className="mt-2">
              {[
                { title: 'Legal Metrology (Packaged Commodities) Rules, 2011', iconClass: 'bg-rose-50 text-rose-600', size: '2.4 MB' },
                { title: 'Amendments & Notifications', iconClass: 'bg-amber-50 text-amber-600', size: '1.1 MB' },
                { title: 'Implementation Guidelines', iconClass: 'bg-emerald-50 text-emerald-600', size: '3.2 MB' },
                { title: 'Inspection Checklist (Field Use)', iconClass: 'bg-purple-50 text-purple-600', size: '1.5 MB' },
                { title: 'Complaint Registration Form', iconClass: 'bg-fuchsia-50 text-fuchsia-600', size: '0.8 MB' },
              ].map((res, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${res.iconClass}`}>
                      <FileDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{res.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">PDF • {res.size}</p>
                    </div>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                    <FileDown className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

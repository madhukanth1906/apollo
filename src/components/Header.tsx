'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  UserCheck, 
  LogOut, 
  Building2, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { 
  EmblemOfIndia, 
  PakshyaLogo, 
  IndiaGateWatermark, 
  TricolorFlourish 
} from './BrandAssets';
import { CURRENT_INSPECTOR } from '@/services/mockData';

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs relative z-40 select-none overflow-hidden">
      {/* Top micro Indian Tricolor bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-4 relative">
        {/* Left Section: Official State Emblem & Department Titles */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <div className="text-slate-800 flex-shrink-0">
            <EmblemOfIndia className="w-10 h-14" />
          </div>

          <div className="border-l border-slate-300 pl-3 leading-tight">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Department of Consumer Affairs
            </h1>
            <p className="text-[11px] text-slate-600 font-medium">
              Ministry of Consumer Affairs, Food & Public Distribution
            </p>
            <p className="text-[10px] text-slate-500">
              Government of India
            </p>
          </div>
        </div>

        {/* Center Section: PAKSHYA Brand & National Slogan */}
        <div className="flex items-center gap-3.5 my-1 lg:my-0">
          <PakshyaLogo className="w-11 h-11 flex-shrink-0" />

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0f3460] tracking-tight font-sans">
                PAKSHYA
              </span>
            </div>
            <p className="text-[10.5px] text-slate-600 font-medium tracking-tight">
              Packaged-commodity AI Knowledge System for Holistic Yield-evidence Analysis
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#15803d] mt-0.5">
              <span>Safer Markets</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>Fair Trade</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>Stronger India</span>
            </div>
          </div>
        </div>

        {/* Right Section: India Gate / Viksit Bharat Motif & Inspector Profile */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Subtle India Gate + Tricolor Graphic with Slogan */}
          <div className="hidden xl:flex items-center gap-3 relative pr-2">
            <div className="relative w-24 h-12 flex items-center justify-center">
              <IndiaGateWatermark className="w-24 h-12 text-amber-700/25 absolute left-0 top-0" />
              <TricolorFlourish className="w-24 h-12 absolute -top-1 -right-2 opacity-80" />
            </div>

            <div className="text-right leading-tight text-[10px] font-serif">
              <div className="font-bold text-slate-800">Viksit</div>
              <div className="font-bold text-[#ff9933]">Bharat</div>
              <div className="font-bold text-[#0f3460]">Vishwasniya</div>
              <div className="font-bold text-[#138808]">Bazaar</div>
              <div className="text-[8px] text-slate-500 font-sans">सत्यमेव जयते</div>
            </div>
          </div>

          <div className="h-9 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              title="Notifications & Circulars"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-slate-200 p-3 z-50 text-xs">
                <div className="font-bold text-slate-900 border-b pb-1.5 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Legal Metrology Alerts
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="font-bold text-amber-900 text-[11px]">Special Drive: Dual MRP Stamping</p>
                    <p className="text-[10px] text-amber-800">Rule 18(2) compliance verification active across retail sector.</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="font-bold text-blue-900 text-[11px]">Unit Sale Price (USP) Notice</p>
                    <p className="text-[10px] text-blue-800">Mandatory declaration required on packages exceeding 100g.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Inspector Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition text-left"
            >
              {/* Circular Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#0f2e5a] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="leading-tight hidden sm:block">
                <div className="text-xs font-bold text-slate-900">
                  Inspector
                </div>
                <div className="text-[10px] text-slate-500">
                  Delhi Region
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                  <span className="font-bold text-slate-900">Rajesh Varma</span>
                  <p className="text-[11px] text-slate-600">Legal Metrology Officer (Class-I)</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: GOI-LMO-DL-0482</p>
                </div>

                <div className="px-2 pt-1">
                  <button
                    onClick={() => {
                      alert('Signed in as Senior Legal Metrology Officer (Delhi Region)');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Officer Credentials</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Session closed.');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

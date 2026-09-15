'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  UserCheck, 
  LogOut, 
  Building2, 
  FileCheck2,
  AlertCircle,
  ShieldCheck,
  CheckCheck,
  MapPin,
  Award,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles
} from 'lucide-react';
import { 
  EmblemOfIndia, 
  PakshyaLogo, 
  IndiaGateWatermark, 
  TricolorFlourish,
  DigitalIndiaLogo
} from './BrandAssets';
import { CURRENT_INSPECTOR } from '@/services/mockData';

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  onSignOut?: () => void;
}

interface NotificationItem {
  id: string;
  type: 'urgent' | 'gazette' | 'advisory' | 'system';
  title: string;
  description: string;
  timestamp: string;
  tag: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    title: 'Special Drive: Rule 18(2) Dual MRP Stamping',
    description: 'NCT Delhi retail blitz active. Inspect multi-layer barcode stickers and altered price stamps across cosmetics and edible items.',
    timestamp: '15 mins ago',
    tag: 'Enforcement Priority',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'gazette',
    title: 'Gazette Circular: Unit Sale Price (USP) Compliance',
    description: 'Rule 6(1)(e) requires conspicuous USP per 100g/100ml on all packages exceeding 100g or 100ml. Mandatory for retail audits.',
    timestamp: '2 hours ago',
    tag: 'Statutory Rule',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'advisory',
    title: 'Shrinkflation Advisory: Tolerance Limit Check',
    description: 'Automated warnings active when net quantity drops by >5% while maintaining legacy MRP pricing tiers.',
    timestamp: '5 hours ago',
    tag: 'Advisory Note',
    isRead: false
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'National Packaging Master Database Synced',
    description: 'Over 2.4 million commodity SKUs, QR registries, and EAN records synchronized with the Central Metrology Repository.',
    timestamp: 'Today, 06:00 IST',
    tag: 'Repository Sync',
    isRead: true
  }
];

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotifOpen(false);
        setCredentialsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  return (
    <>
      {/* Invisible backdrop to dismiss open dropdowns when clicking outside */}
      {(profileOpen || notifOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setProfileOpen(false);
            setNotifOpen(false);
          }}
        />
      )}

      {/* Outer Header: DO NOT put overflow-hidden here so popups display cleanly */}
      <header className="bg-white border-b border-slate-200 shadow-xs relative z-40 select-none">
        {/* Top micro Indian Tricolor bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

        <div className="max-w-[1780px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 xl:gap-4 relative">
          {/* Left Section: Official State Emblem & Department Titles */}
          <div className="flex items-center gap-2 xl:gap-3.5 flex-shrink-0">
            <div className="text-slate-800 flex-shrink-0">
              <EmblemOfIndia className="w-8 h-12 xl:w-10 xl:h-14" />
            </div>

            <div className="border-l border-slate-300 pl-2 xl:pl-3 leading-tight hidden sm:block">
              <h1 className="text-sm xl:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Department of Consumer Affairs
              </h1>
              <p className="hidden xl:block text-[11px] text-slate-600 font-medium whitespace-nowrap">
                Ministry of Consumer Affairs, Food & Public Distribution
              </p>
              <p className="hidden lg:flex text-[10px] text-slate-500 items-center gap-1 whitespace-nowrap">
                <span>Government of India</span>
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[9.5px] font-semibold text-emerald-700">Legal Metrology Division</span>
              </p>
            </div>
          </div>

          {/* Center Section: PAKSHYA Brand & National Slogan */}
          <div className="flex items-center gap-2 xl:gap-3.5 flex-shrink">
            <div className="bg-teal-600 text-white p-2 rounded-full flex items-center justify-center shrink-0 shadow-sm">
               <span className="font-extrabold text-lg leading-none">₹</span>
            </div>

            <div className="text-left hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-xl xl:text-3xl font-black text-slate-900 tracking-tight font-sans">
                  PAKSHYA
                </span>
                <span className="text-[9px] xl:text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                  Portal v2.6
                </span>
              </div>
              <p className="hidden 2xl:block text-[10.5px] text-slate-500 font-medium tracking-tight whitespace-nowrap">
                Packaged-commodity AI Knowledge System for Holistic Yield-evidence Analysis
              </p>
            </div>
          </div>

          {/* Right Section: India Gate Motif & Interactive Inspector Controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Digital India Logo */}
            <div className="hidden md:block mr-2">
              <DigitalIndiaLogo />
            </div>

            {/* Subtle India Gate + Tricolor Graphic with Slogan (overflow-hidden scoped to box) */}
            <div className="hidden xl:flex items-center gap-3 relative pr-2">
              <div className="relative w-24 h-12 flex items-center justify-center overflow-hidden rounded">
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

            {/* Notifications Bell Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className={`relative p-2 rounded-full transition-colors ${
                  notifOpen 
                    ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Directives & Legal Metrology Alerts"
                aria-expanded={notifOpen}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Window */}
              {notifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header */}
                  <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs tracking-tight">Statutory Directives & Alerts</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500/90 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 transition"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleRead(item.id)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer text-xs ${
                          !item.isRead ? 'bg-amber-50/40' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ${
                            item.type === 'urgent'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : item.type === 'gazette'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : item.type === 'advisory'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {item.tag}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {item.timestamp}
                          </span>
                        </div>

                        <p className={`text-[12px] font-semibold text-slate-900 leading-snug ${!item.isRead ? 'font-bold' : ''}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Source: Central Metrology Gazette</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[#0f3460] font-bold hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Inspector Profile Pill & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className={`flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-full transition-all border ${
                  profileOpen 
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                aria-expanded={profileOpen}
              >
                {/* Circular Officer Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f2e5a] to-[#1e3a8a] text-white font-bold flex items-center justify-center text-xs shadow-xs ring-1 ring-white">
                  {CURRENT_INSPECTOR.avatarInitials}
                </div>

                <div className="leading-tight hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{CURRENT_INSPECTOR.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Duty" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {CURRENT_INSPECTOR.id}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* Inspector Profile Dropdown Window */}
              {profileOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Officer Header Card */}
                  <div className="p-4 bg-gradient-to-br from-[#081e3e] via-[#0f2e5a] to-[#1e3a8a] text-white relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-base text-amber-300 shadow-inner">
                          {CURRENT_INSPECTOR.avatarInitials}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                            <span>{CURRENT_INSPECTOR.name}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-[11px] text-blue-200 font-medium leading-tight">
                            {CURRENT_INSPECTOR.designation}
                          </p>
                          <span className="inline-block mt-1 font-mono text-[9.5px] bg-white/15 px-2 py-0.5 rounded text-amber-200 font-bold border border-white/10">
                            ID: {CURRENT_INSPECTOR.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/15 text-[10.5px] text-blue-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                      <span className="truncate">{CURRENT_INSPECTOR.region}</span>
                    </div>
                  </div>

                  {/* Active Duty & Field Authority Summary */}
                  <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Field Authority:</span>
                      <span className="font-semibold text-slate-800">Sec. 15 & 28 LM Act</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Posting Station:</span>
                      <span className="font-semibold text-slate-800">Krishi Bhawan, New Delhi</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Today's Audits</div>
                        <div className="text-base font-black text-[#0f3460]">
                          {CURRENT_INSPECTOR.activeInspectionsToday} <span className="text-xs font-semibold text-slate-500">Inspections</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 text-[10px] font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800" title="Compliant">
                          9 OK
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800" title="Non-Compliant / Seizure">
                          4 Violations
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800" title="Review Pending">
                          1 Lab
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Menu Items */}
                  <div className="p-2 space-y-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setCredentialsModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-slate-800">View Official Digital Warrant</span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Verify &rarr;
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        if (onSignOut) {
                          onSignOut();
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-red-700">Sign Out of Field Duty</span>
                      </div>
                      <span className="text-[10px] text-red-500 font-semibold">End Shift</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Govt of India • NIC Secured</span>
                    <span>Session: Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Official Government Officer Digital Credentials & Warrant Modal */}
      {credentialsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-300 overflow-hidden relative">
            {/* National Tricolor Top Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

            {/* Modal Close Button */}
            <button
              onClick={() => setCredentialsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Close Warrant Card"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 text-center relative">
              <div className="flex justify-center mb-2">
                <EmblemOfIndia className="w-12 h-16 text-slate-800" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                GOVERNMENT OF INDIA
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Department of Consumer Affairs • Legal Metrology Division
              </p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold tracking-wide uppercase border border-blue-200">
                Official Digital Inspector Warrant
              </div>
            </div>

            {/* Officer Details Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-[#0f2e5a] text-amber-300 font-bold text-2xl flex items-center justify-center shadow-md flex-shrink-0 border-2 border-amber-400/40">
                  {CURRENT_INSPECTOR.avatarInitials}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">{CURRENT_INSPECTOR.name}</div>
                  <div className="text-xs font-semibold text-blue-900">{CURRENT_INSPECTOR.designation}</div>
                  <div className="font-mono text-[11px] text-slate-600">ID No: <span className="font-bold text-slate-900">{CURRENT_INSPECTOR.id}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Jurisdiction Zone:</span>
                  <span className="font-bold text-slate-800">North Zone (NCT Delhi)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Station:</span>
                  <span className="font-bold text-slate-800">Krishi Bhawan, New Delhi</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Statutory Power:</span>
                  <span className="font-bold text-emerald-700">Sec 15 & 28 (LM Act 2009)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">PKI Signature:</span>
                  <span className="font-mono text-slate-700 font-bold">SHA256: 4F92...B81A</span>
                </div>
              </div>

              {/* Warrant Statement */}
              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-[10.5px] text-amber-900 leading-relaxed">
                <p className="font-semibold mb-0.5 flex items-center gap-1 text-amber-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Statutory Field Enforcement Authority:
                </p>
                The bearer is empowered under Section 15 of the Legal Metrology Act, 2009 to enter, inspect, verify declarations, sample pre-packaged commodities, and seize non-compliant goods violating PCR 2011 provisions across all commercial and e-commerce fulfillment establishments.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px]">Portal Authenticated • Central Metrology Grid</span>
              <button
                type="button"
                onClick={() => setCredentialsModalOpen(false)}
                className="px-4 py-1.5 bg-[#0f3460] text-white rounded-lg font-bold text-xs hover:bg-[#1a4a84] transition"
              >
                Close Warrant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


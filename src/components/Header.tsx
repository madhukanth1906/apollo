'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  UserCheck, 
  LogOut, 
  Building2, 
  AlertCircle,
  ShieldCheck,
  CheckCheck,
  Clock,
  X,
  Menu,
  Home,
  ScanLine,
  History,
  Database,
  BookOpen,
  BarChart3,
  Scale,
  Layers,
  Camera,
  Fingerprint,
  Shield,
  Settings,
  HelpCircle
} from 'lucide-react';
import { 
  EmblemOfIndia, 
  PakshyaLogo, 
  DigitalIndiaLogo,
  JagoGrahakJagoLogo,
  NCHHelplineLogo
} from './BrandAssets';
import { CURRENT_INSPECTOR } from '@/services/mockData';
import { NavigationTab } from './Sidebar';

export interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  onSignOut?: () => void;
  activeTab?: NavigationTab;
  userRole?: 'admin' | 'inspector' | null;
  onSelectTab?: (tab: NavigationTab) => void;
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

export const Header: React.FC<HeaderProps> = ({ 
  onSignOut,
  activeTab = 'dashboard',
  userRole,
  onSelectTab
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotifOpen(false);
        setMoreToolsOpen(false);
        setCredentialsModalOpen(false);
        setMobileNavOpen(false);
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

  const handleNavClick = (tab: NavigationTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    setMoreToolsOpen(false);
    setMobileNavOpen(false);
  };

  const primaryNavLinksBase: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-inspection', label: 'New Inspection', icon: ScanLine },
    { id: 'history', label: 'Inspection History', icon: History },
    { id: 'products', label: 'Product Database', icon: Database },
    { id: 'rules', label: 'Acts & Rules', icon: BookOpen },
    { id: 'font-size', label: 'Metrology Station', icon: Scale },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'help', label: 'Help & Resources', icon: HelpCircle },
  ];

  const primaryNavLinks = userRole === 'admin' 
    ? primaryNavLinksBase.filter(link => !['new-inspection', 'font-size'].includes(link.id))
    : primaryNavLinksBase;

  const secondaryNavLinksBase: { id: NavigationTab; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'labeltruth', label: 'LabelTruth™ Cross-View', desc: 'Rule 18(2) Dual MRP verification', icon: Layers },
    { id: 'active-inspection', label: 'Active Inspection', desc: 'Glare & curved label resolution', icon: Camera },
    { id: 'fingerprint', label: 'Compliance Fingerprint', desc: 'Shrinkflation & historic diff', icon: Fingerprint },
    { id: 'spectrashield', label: 'SpectraShield™ UV/NIR', desc: 'Tamper & overlay forensics', icon: Shield },
    { id: 'settings', label: 'Officer Settings', desc: 'Jurisdiction & device preferences', icon: Settings },
  ];

  const secondaryNavLinks = userRole === 'admin'
    ? secondaryNavLinksBase.filter(link => ['settings'].includes(link.id))
    : secondaryNavLinksBase;

  const isSecondaryActive = secondaryNavLinks.some(link => link.id === activeTab);

  return (
    <>
      {/* Invisible backdrop to dismiss open dropdowns when clicking outside */}
      {(profileOpen || notifOpen || moreToolsOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setProfileOpen(false);
            setNotifOpen(false);
            setMoreToolsOpen(false);
          }}
        />
      )}

      {/* Main Header Container */}
      <header className="bg-white border-b border-slate-200 relative z-40 select-none">
        
        {/* National Tricolor Top Stripe */}
        <div className="h-[3.5px] w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

        {/* Top White Section: Department of Consumer Affairs Branding */}
        <div className="max-w-[1780px] mx-auto px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 md:gap-4">
          
          {/* LEFT: National Emblem + Department of Consumer Affairs Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-shrink-0">
            <div className="flex-shrink-0">
              <EmblemOfIndia className="w-8 h-12 sm:w-10 sm:h-14 object-contain" />
            </div>

            <div className="border-l border-slate-300 pl-2.5 sm:pl-3.5 leading-tight min-w-0">
              {/* Hindi Department Title */}
              <div className="text-[13px] sm:text-[15px] font-bold text-slate-900 tracking-tight leading-none font-sans">
                उपभोक्ता मामले विभाग
              </div>
              {/* English Department Title */}
              <div className="text-[12px] sm:text-[14px] lg:text-[15px] font-extrabold text-slate-900 tracking-tight leading-snug font-sans uppercase">
                DEPARTMENT OF CONSUMER AFFAIRS
              </div>
              {/* Ministry & Legal Metrology Division */}
              <div className="hidden md:flex items-center gap-1.5 text-[10px] lg:text-[11px] text-slate-600 font-medium leading-none mt-0.5">
                <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-[#8b1515]">Legal Metrology Division</span>
              </div>
            </div>
          </div>

          {/* CENTER: PAKSHYA Portal Identity Badge */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0">
            <PakshyaLogo className="w-8 h-8" />
            <div className="text-left leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 font-sans">
                  PAKSHYA
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-[#8b1515] text-white rounded">
                  PORTAL V2.6
                </span>
              </div>
              <p className="text-[9.5px] text-slate-500 font-medium tracking-tight mt-0.5">
                Legal Metrology Enforcement System
              </p>
            </div>
          </div>

          {/* RIGHT: Jago Grahak Jago + Prominent NCH 1915 + Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Jago Grahak Jago Logo */}
            <div className="hidden sm:block flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/jago-grahak-logo.png" 
                alt="जागो ग्राहक जागो - Jago Grahak Jago" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </div>

            {/* National Consumer Helpline (NCH) 1915 Prominent Identity */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-amber-50/90 border border-amber-300/80 rounded-lg text-left shadow-2xs flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/nch-logo.png" 
                alt="National Consumer Helpline" 
                className="h-8 sm:h-9 w-auto object-contain" 
              />
              <div className="leading-tight">
                <div className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-700 uppercase tracking-wide">
                  National Consumer Helpline
                </div>
                <div className="text-base sm:text-lg font-black text-[#8b1515] tracking-tight flex items-baseline gap-1">
                  <span className="font-mono">1915</span>
                  <span className="text-[9px] font-bold text-slate-500 font-sans hidden sm:inline">(Toll-Free)</span>
                </div>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Notifications Bell Button & Interactive Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                  setMoreToolsOpen(false);
                }}
                className={`relative p-2 rounded-full transition-colors ${
                  notifOpen 
                    ? 'bg-red-50 text-[#8b1515] ring-2 ring-red-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Directives & Legal Metrology Alerts"
                aria-expanded={notifOpen}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-[#b91c1c] text-white text-[9.5px] font-bold rounded-full ring-2 ring-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Window */}
              {notifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 bg-[#0a1f44] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs tracking-tight">Statutory Directives & Alerts</span>
                      {unreadCount > 0 && (
                        <span className="bg-[#b91c1c] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-amber-200 hover:text-white flex items-center gap-1 transition"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
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
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
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

                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Source: Central Metrology Gazette</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[#8b1515] font-bold hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Inspector Profile Pill & Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                  setMoreToolsOpen(false);
                }}
                className={`flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1 sm:py-1.5 rounded-full transition-all border ${
                  profileOpen 
                    ? 'bg-red-50/80 border-red-300 ring-2 ring-red-500/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                aria-expanded={profileOpen}
              >
                {/* Officer Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8b1515] text-white font-bold flex items-center justify-center text-xs shadow-xs ring-1 ring-white">
                  {CURRENT_INSPECTOR.avatarInitials}
                </div>

                <div className="leading-tight hidden sm:block text-left min-w-0">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1 truncate">
                    <span>{CURRENT_INSPECTOR.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Duty" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {CURRENT_INSPECTOR.id}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180 text-[#8b1515]' : ''}`} />
              </button>

              {/* Inspector Profile Dropdown Window */}
              {profileOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-4 bg-gradient-to-br from-[#7f1414] via-[#8b1515] to-[#991b1b] text-white relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-base text-amber-200 shadow-inner">
                          {CURRENT_INSPECTOR.avatarInitials}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                            <span>{CURRENT_INSPECTOR.name}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                          </div>
                          <p className="text-[11px] text-red-100 font-medium leading-tight">
                            {CURRENT_INSPECTOR.designation}
                          </p>
                          <span className="inline-block mt-1 font-mono text-[9.5px] bg-white/15 px-2 py-0.5 rounded text-amber-200 font-bold border border-white/10">
                            ID: {CURRENT_INSPECTOR.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/15 text-[10.5px] text-red-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                      <span className="truncate">{CURRENT_INSPECTOR.region}</span>
                    </div>
                  </div>

                  {/* Active Duty Summary */}
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
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
                        <div className="text-base font-black text-slate-900">
                          {CURRENT_INSPECTOR.activeInspectionsToday} <span className="text-xs font-semibold text-slate-500">Inspections</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 text-[10px] font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          9 OK
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                          4 Violations
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          1 Lab
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Actions */}
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
                        <UserCheck className="w-4 h-4 text-[#8b1515] group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-slate-800">View Official Digital Warrant</span>
                      </div>
                      <span className="text-[10px] text-[#8b1515] font-semibold group-hover:translate-x-0.5 transition-transform">
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

                  <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Govt of India • NIC Secured</span>
                    <span>Session: Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle (for screens < 1024px) */}
            <div className="lg:hidden flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* RED GOVERNMENT NAVIGATION BAR (Inspired by Department of Consumer Affairs Website) */}
        <nav className="bg-[#a81c1c] text-white shadow-md relative z-30">
          <div className="max-w-[1780px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            {/* Desktop Navigation Links - STRICTLY ONE LINE (flex-nowrap) */}
            <div className="hidden lg:flex items-center flex-nowrap shrink-0 gap-0.5 py-0.5">
              {primaryNavLinks.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2 xl:px-3 py-2 xl:py-2.5 text-[11.5px] xl:text-[12.5px] font-bold tracking-wide transition-all flex items-center gap-1.5 relative whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#7f1414] text-amber-300 shadow-inner'
                        : 'text-white/90 hover:bg-[#8e1717] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-amber-300' : 'text-white/80'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400" />
                    )}
                  </button>
                );
              })}

              {/* More Tools Dropdown Button */}
              {secondaryNavLinks.length > 0 && (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreToolsOpen(!moreToolsOpen);
                      setProfileOpen(false);
                      setNotifOpen(false);
                    }}
                    className={`px-2 xl:px-3 py-2 xl:py-2.5 text-[11.5px] xl:text-[12.5px] font-bold tracking-wide transition-all flex items-center gap-1.5 relative whitespace-nowrap shrink-0 ${
                      isSecondaryActive || moreToolsOpen
                        ? 'bg-[#7f1414] text-amber-300'
                        : 'text-white/90 hover:bg-[#8e1717] hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                    <span>More Tools</span>
                    <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform ${moreToolsOpen ? 'rotate-180 text-amber-300' : ''}`} />
                    {isSecondaryActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-400" />
                    )}
                  </button>

                  {/* More Tools Dropdown Window */}
                  {moreToolsOpen && (
                    <div className="absolute left-0 mt-0.5 w-72 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 z-50 overflow-hidden py-1">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Specialized Metrology Labs
                      </div>
                      {secondaryNavLinks.map((sec) => {
                        const Icon = sec.icon;
                        const isActive = activeTab === sec.id;

                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => handleNavClick(sec.id)}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition text-xs ${
                              isActive ? 'bg-red-50 text-[#8b1515] font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-[#8b1515]' : 'text-slate-400'}`} />
                            <div>
                              <div className="font-semibold text-slate-900">{sec.label}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{sec.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile / Tablet Current Active View Label (Visible when nav links are collapsed) */}
            <div className="lg:hidden py-2 px-2 flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
                <span className="text-amber-300 uppercase text-[10px]">CURRENT:</span>
                <span className="truncate">
                  {primaryNavLinks.find(l => l.id === activeTab)?.label || 
                   secondaryNavLinks.find(l => l.id === activeTab)?.label || 
                   'Dashboard'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded text-white flex items-center gap-1"
              >
                <span>Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileNavOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Right Slogan / Gazette tag (Only shown on extra-large screens to never force a wrap) */}
            <div className="hidden 2xl:flex items-center gap-2 py-2 text-[11px] font-semibold text-white/90 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PCR 2011 Active</span>
            </div>
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileNavOpen && (
            <div className="lg:hidden bg-[#881313] border-t border-red-800/60 px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] uppercase font-bold text-amber-200/80 tracking-wider pb-1">
                Main Portal Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {primaryNavLinks.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-bold flex items-center gap-2.5 transition ${
                        isActive
                          ? 'bg-[#6b0f0f] text-amber-300 border-l-3 border-amber-400'
                          : 'text-white hover:bg-[#780e0e]'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] uppercase font-bold text-amber-200/80 tracking-wider pt-2.5 pb-1 border-t border-red-800/60">
                Specialized Metrology Labs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {secondaryNavLinks.map((sec) => {
                  const isActive = activeTab === sec.id;
                  const Icon = sec.icon;

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleNavClick(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition ${
                        isActive
                          ? 'bg-[#6b0f0f] text-amber-300 border-l-3 border-amber-400 font-bold'
                          : 'text-white/90 hover:bg-[#780e0e]'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
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
                <EmblemOfIndia className="w-12 h-16 text-slate-800 object-contain" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                GOVERNMENT OF INDIA
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Department of Consumer Affairs • Legal Metrology Division
              </p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-red-100 text-red-900 text-[11px] font-bold tracking-wide uppercase border border-red-200">
                Official Digital Inspector Warrant
              </div>
            </div>

            {/* Officer Details Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-[#8b1515] text-amber-200 font-bold text-2xl flex items-center justify-center shadow-md flex-shrink-0 border-2 border-amber-300/40">
                  {CURRENT_INSPECTOR.avatarInitials}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">{CURRENT_INSPECTOR.name}</div>
                  <div className="text-xs font-semibold text-slate-800">{CURRENT_INSPECTOR.designation}</div>
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
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[10.5px] text-amber-900 leading-relaxed">
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
                className="px-4 py-1.5 bg-[#8b1515] hover:bg-[#780e0e] text-white rounded-lg font-bold text-xs transition"
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

'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LoginView } from '@/components/LoginView';
import { Sidebar, NavigationTab } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { NewInspectionWorkspace } from '@/components/NewInspectionWorkspace';
import { LabelTruthComparison } from '@/components/LabelTruthComparison';
import { ActiveInspectionPanel } from '@/components/ActiveInspectionPanel';
import { FingerprintCard } from '@/components/FingerprintCard';
import { SpectraShieldViewer } from '@/components/SpectraShieldViewer';
import { RulesDirectory } from '@/components/RuleCard';
import { AnalyticsView } from '@/components/AnalyticsView';
import { HistoryView } from '@/components/HistoryView';
import { ProductsView } from '@/components/ProductsView';
import { SettingsView } from '@/components/SettingsView';
import { ReportPreview } from '@/components/ReportPreview';
import { InspectionRecord } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { Menu, X, Scale, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [selectedReportRecord, setSelectedReportRecord] = useState<InspectionRecord | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReportRecord(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenReport = (record: InspectionRecord) => {
    setSelectedReportRecord(record);
  };

  const handleCloseReport = () => {
    setSelectedReportRecord(null);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col text-slate-800">
      {/* 1. Official Government Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => setCurrentLanguage(lang)}
        onSignOut={() => setIsAuthenticated(false)}
      />

      {/* Mobile Navigation Toggle Bar */}
      <div className="md:hidden bg-[#07152b] text-white px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded bg-white/10"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? 'Close Menu' : 'Navigation Menu'}</span>
        </button>
        <span className="text-xs font-bold text-amber-400 font-mono">
          PAKSHYA • PCR 2011
        </span>
      </div>

      {/* 2. Main Workspace Layout (Sidebar + Content Viewport) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1720px] w-full mx-auto">
        {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
        <div
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block z-30 md:static fixed inset-0 top-[105px] md:top-auto`}
        >
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
          />
        </div>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-130px)]">
          {/* Active View Routing */}
          {activeTab === 'dashboard' && (
            <DashboardView
              onStartNewInspection={() => setActiveTab('new-inspection')}
              onOpenLabelTruth={() => setActiveTab('labeltruth')}
              onOpenActiveInspection={() => setActiveTab('active-inspection')}
              onOpenRules={() => setActiveTab('rules')}
              onOpenReport={handleOpenReport}
              onOpenHistory={() => setActiveTab('history')}
              onOpenProducts={() => setActiveTab('products')}
            />
          )}

          {activeTab === 'new-inspection' && (
            <NewInspectionWorkspace
              onOpenLabelTruth={() => setActiveTab('labeltruth')}
              onOpenActiveInspection={() => setActiveTab('active-inspection')}
              onOpenReport={handleOpenReport}
            />
          )}

          {activeTab === 'labeltruth' && (
            <LabelTruthComparison
              onNavigateToRule={() => setActiveTab('rules')}
            />
          )}

          {activeTab === 'active-inspection' && (
            <ActiveInspectionPanel />
          )}

          {activeTab === 'fingerprint' && (
            <FingerprintCard />
          )}

          {activeTab === 'spectrashield' && (
            <SpectraShieldViewer />
          )}

          {activeTab === 'history' && (
            <HistoryView onSelectRecord={handleOpenReport} />
          )}

          {activeTab === 'products' && (
            <ProductsView
              onNavigateToFingerprint={() => setActiveTab('fingerprint')}
              onNavigateToInspection={(rec) => {
                setActiveTab('new-inspection');
              }}
            />
          )}

          {activeTab === 'rules' && (
            <RulesDirectory />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'help' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4 max-w-4xl mx-auto">
              <div className="border-b pb-3">
                <h2 className="text-base font-bold text-slate-900">Help & Statutory Guidance</h2>
                <p className="text-xs text-slate-500">Legal Metrology Inspection Operating Standards & Toll-Free Assistance</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded border space-y-2">
                  <h3 className="font-bold text-slate-900">National Consumer Helpline (NCH)</h3>
                  <p className="text-slate-600">Toll-free number: <strong>1915</strong> or <strong>1800-11-4000</strong></p>
                  <p className="text-slate-500 text-[11px]">Operational Monday to Saturday 9:30 AM to 5:30 PM</p>
                </div>
                <div className="p-4 bg-blue-50 rounded border border-blue-200 space-y-2">
                  <h3 className="font-bold text-blue-950">Field Inspector Guidance (Form LM)</h3>
                  <p className="text-blue-800">For doubts regarding minimum numeral height under Schedule II or dual MRP enforcement, refer to the Rules & Guidelines module.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Official Government Inspection Report Modal (Contained, dismissible on click-outside or ESC) */}
      {selectedReportRecord && (
        <div 
          onClick={handleCloseReport}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-auto relative rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Quick floating close button */}
            <button
              onClick={handleCloseReport}
              className="absolute top-3 right-3 z-50 p-1.5 bg-slate-800/80 hover:bg-red-600 text-white rounded-full transition shadow-md flex items-center gap-1 text-xs px-2.5"
              title="Close Report (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span className="font-semibold text-[10px]">Close</span>
            </button>

            <ReportPreview
              record={selectedReportRecord}
              onClose={handleCloseReport}
            />
          </div>
        </div>
      )}

      {/* 4. Official Government Footer Bar */}
      <footer className="no-print bg-[#0a1f44] text-slate-300 text-xs border-t border-slate-700 py-4 px-6 mt-auto">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="font-semibold text-white text-[11px]">
              PAKSHYA — Packaged-commodity AI Knowledge System for Holistic Yield-evidence Analysis
            </p>
            <p className="text-[10px] text-slate-400">
              Department of Consumer Affairs • Ministry of Consumer Affairs, Food & Public Distribution • Government of India
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400">
            <span>Legal Metrology Act, 2009</span>
            <span>•</span>
            <span>Packaged Commodities Rules, 2011</span>
            <span>•</span>
            <span className="text-amber-400 font-mono">Smart India Hackathon 2026 (SIH26034)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

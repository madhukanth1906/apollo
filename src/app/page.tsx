'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
import { HelpSupportView } from '@/components/HelpSupportView';
import { MetrologyStationView } from '@/components/MetrologyStationView';
import { InspectionRecord } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { Menu, X, Scale, ExternalLink } from 'lucide-react';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>(
    (searchParams.get('tab') as NavigationTab) || 'dashboard'
  );
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

  // Sync state -> URL
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', activeTab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [activeTab, pathname, router, searchParams]);

  // Sync URL -> state (for back/forward browser buttons)
  useEffect(() => {
    const currentTab = searchParams.get('tab') as NavigationTab;
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

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
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col text-slate-800">
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
              onOpenAnalytics={() => setActiveTab('analytics')}
            />
          )}

          {activeTab === 'new-inspection' && (
            <NewInspectionWorkspace
              onOpenLabelTruth={() => setActiveTab('labeltruth')}
              onOpenActiveInspection={() => setActiveTab('active-inspection')}
              onOpenReport={handleOpenReport}
              onOpenRules={() => setActiveTab('rules')}
              onOpenHelp={() => setActiveTab('help')}
            />
          )}

          {activeTab === 'font-size' && (
            <MetrologyStationView />
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
            <HelpSupportView />
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
              className="no-print absolute top-3 right-3 z-50 p-1.5 bg-slate-800/80 hover:bg-red-600 text-white rounded-full transition shadow-md flex items-center gap-1 text-xs px-2.5"
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
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07152b] flex items-center justify-center text-white">Loading PAKSHYA Workspace...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

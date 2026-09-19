'use client';

import React from 'react';
import { 
  Home, 
  ScanLine, 
  History, 
  Database, 
  BookOpen, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Layers,
  Camera,
  Fingerprint,
  Shield,
  Scale,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { EmblemOfIndia } from './BrandAssets';

export type NavigationTab = 
  | 'dashboard'
  | 'new-inspection'
  | 'history'
  | 'products'
  | 'rules'
  | 'analytics'
  | 'settings'
  | 'help'
  | 'labeltruth'
  | 'active-inspection'
  | 'fingerprint'
  | 'spectrashield'
  | 'font-size';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const coreInspectionTools = [
    { id: 'dashboard' as NavigationTab, label: 'Inspector Dashboard', icon: Home },
    { id: 'new-inspection' as NavigationTab, label: 'New Inspection', icon: ScanLine },
    { id: 'history' as NavigationTab, label: 'Inspection History', icon: History },
    { id: 'products' as NavigationTab, label: 'Product Master DB', icon: Database },
  ];

  const specializedMetrologyLabs = [
    { id: 'font-size' as NavigationTab, label: 'Metrology Station (Rule 9)', icon: Scale },
    { id: 'labeltruth' as NavigationTab, label: 'LabelTruth™ (Dual MRP)', icon: Layers },
    { id: 'active-inspection' as NavigationTab, label: 'Active Inspection (Glare)', icon: Camera },
    { id: 'fingerprint' as NavigationTab, label: 'Compliance Fingerprint', icon: Fingerprint },
    { id: 'spectrashield' as NavigationTab, label: 'SpectraShield™ (Forensics)', icon: Shield },
  ];

  const statutoryAndAdminTools = [
    { id: 'rules' as NavigationTab, label: 'Acts & PCR Rules', icon: BookOpen },
    { id: 'analytics' as NavigationTab, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings' as NavigationTab, label: 'Officer Settings', icon: Settings },
    { id: 'help' as NavigationTab, label: 'Help & Resources', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-120px)] select-none z-10 relative">
      <div className="py-4 px-3 space-y-1 overflow-y-auto flex-1">
        
        {/* Section 1: Core Operations */}
        <div className="px-3 pb-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Operational Duties
          </span>
        </div>

        {coreInspectionTools.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs ${
                isActive
                  ? 'bg-red-50 text-[#8b1515] font-extrabold border-r-4 border-[#8b1515]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#8b1515] font-medium border-r-4 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#8b1515]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Section 2: Specialized Metrology Labs */}
        <div className="pt-4 pb-1.5 px-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Verification Labs
          </span>
        </div>

        {specializedMetrologyLabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs ${
                isActive
                  ? 'bg-red-50 text-[#8b1515] font-extrabold border-r-4 border-[#8b1515]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#8b1515] font-medium border-r-4 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#8b1515]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Section 3: Statutory & Admin */}
        <div className="pt-4 pb-1.5 px-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Statutory & Admin
          </span>
        </div>

        {statutoryAndAdminTools.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs ${
                isActive
                  ? 'bg-red-50 text-[#8b1515] font-extrabold border-r-4 border-[#8b1515]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#8b1515] font-medium border-r-4 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#8b1515]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Authority Seal (Clean, Government Aesthetic) */}
      <div className="p-3.5 m-3 bg-slate-50 rounded-xl border border-slate-200 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-1 text-[#8b1515]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-tight">Enforcement Authority</span>
        </div>
        <p className="text-[9.5px] text-slate-500 leading-tight">
          Sec. 15 Legal Metrology Act, 2009<br/>
          Government of India
        </p>
        <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          <span>Active Inspection Duty</span>
        </div>
      </div>
    </aside>
  );
};

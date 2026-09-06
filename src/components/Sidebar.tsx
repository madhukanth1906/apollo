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
  Sparkles,
  Ruler
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
  const primaryNavItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'new-inspection' as NavigationTab,
      label: 'New Inspection',
      icon: ScanLine,
    },
    {
      id: 'history' as NavigationTab,
      label: 'Inspection History',
      icon: History,
    },
    {
      id: 'products' as NavigationTab,
      label: 'Product Database',
      icon: Database,
    },
    {
      id: 'rules' as NavigationTab,
      label: 'Rules & Guidelines',
      icon: BookOpen,
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'help' as NavigationTab,
      label: 'Help & Support',
      icon: HelpCircle,
    },
  ];

  const advancedModules = [
    { id: 'labeltruth' as NavigationTab, label: 'LabelTruth™ (Dual MRP)', icon: Layers },
    { id: 'active-inspection' as NavigationTab, label: 'Active Inspection (Glare)', icon: Camera },
    { id: 'fingerprint' as NavigationTab, label: 'Compliance Fingerprint', icon: Fingerprint },
    { id: 'spectrashield' as NavigationTab, label: 'SpectraShield™ (UV/NIR)', icon: Sparkles },
  ];

  return (
    <aside className="w-56 lg:w-60 bg-[#0c2a52] text-white flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-76px)] shadow-md select-none">
      {/* Navigation List */}
      <div className="py-4 px-2.5 space-y-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-left transition-colors text-xs font-medium ${
                isActive
                  ? 'bg-[#1b487e] text-white font-semibold shadow-xs'
                  : 'text-slate-200 hover:bg-[#143663] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-slate-200 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Subtle separator for hackathon advanced prototype tabs */}
        <div className="pt-3 pb-1 px-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Advanced AI Labs
          </div>
        </div>

        {advancedModules.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded text-left transition-colors text-[11px] ${
                isActive
                  ? 'bg-[#1b487e] text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-[#143663] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Subtle Ashoka Stambh outline & Digital India */}
      <div className="p-4 text-center border-t border-[#143663]/60 bg-[#092243]">
        <div className="text-blue-300/40 mx-auto flex justify-center mb-1">
          <EmblemOfIndia className="w-10 h-14" />
        </div>

        <div className="text-sm font-bold text-white tracking-wide mt-1">
          Digital India
        </div>
        <p className="text-[10px] text-blue-200/70 font-light mt-0.5 leading-tight">
          for a Fair and Transparent Marketplace
        </p>
      </div>
    </aside>
  );
};

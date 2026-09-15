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
  Plus
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
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: Home },
    { id: 'new-inspection' as NavigationTab, label: 'New Inspection', icon: ScanLine },
    { id: 'history' as NavigationTab, label: 'Inspection History', icon: History },
    { id: 'products' as NavigationTab, label: 'Product Database', icon: Database },
    { id: 'rules' as NavigationTab, label: 'Rules & Guidelines', icon: BookOpen },
    { id: 'analytics' as NavigationTab, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
    { id: 'help' as NavigationTab, label: 'Help & Support', icon: HelpCircle },
  ];

  const advancedModules = [
    { id: 'labeltruth' as NavigationTab, label: 'LabelTruth™ (Dual MRP)', icon: Layers },
    { id: 'active-inspection' as NavigationTab, label: 'Active Inspection (Glare)', icon: Camera },
    { id: 'fingerprint' as NavigationTab, label: 'Compliance Fingerprint', icon: Fingerprint },
    { id: 'spectrashield' as NavigationTab, label: 'SpectraShield™ (UV/NIR)', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-76px)] select-none z-10 relative">
      <div className="py-6 px-4 space-y-1.5 flex-1 overflow-y-auto">

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all text-sm ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold border-r-4 border-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium border-r-4 border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Subtle separator for advanced modules */}
        <div className="pt-6 pb-2 px-4">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all text-sm ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold border-r-4 border-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-medium border-r-4 border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Subtle Ashoka Stambh outline & Digital India */}
      <div className="p-5 text-center bg-[#0A182E] border-t border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <EmblemOfIndia className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10">
          <div className="text-xs font-bold text-white tracking-wide">
            Digital India
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">
            for a Fair and Transparent Marketplace
          </p>
        </div>
      </div>
    </aside>
  );
};

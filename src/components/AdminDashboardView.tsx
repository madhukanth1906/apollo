'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Map, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Building2, 
  Users,
  Search,
  Filter
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { databases } from '@/services/appwrite';
import { InspectionRecord } from '@/types/inspection';
import { GovernmentBannerCarousel } from './GovernmentBannerCarousel';

// Dynamically import map to prevent SSR window errors
const AdminMap = dynamic(() => import('./AdminMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse text-slate-400 font-bold text-xs">Loading OpenStreetMap...</div>
});



interface AdminDashboardViewProps {
  onOpenReport: (record: InspectionRecord) => void;
  onOpenHistory: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onOpenReport,
  onOpenHistory,
}) => {
  const [recentRecords, setRecentRecords] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock markers for violation hotspots (Leaflet uses [lat, lng])
  const markers = [
    { markerOffset: -15, name: "New Delhi", coordinates: [28.6139, 77.209] as [number, number], color: "#b91c1c", violations: 124 },
    { markerOffset: 15, name: "Mumbai", coordinates: [19.0760, 72.8777] as [number, number], color: "#b91c1c", violations: 89 },
    { markerOffset: -15, name: "Bangalore", coordinates: [12.9716, 77.5946] as [number, number], color: "#f59e0b", violations: 45 },
    { markerOffset: 15, name: "Kolkata", coordinates: [22.5726, 88.3639] as [number, number], color: "#f59e0b", violations: 32 },
  ];

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await databases.listDocuments('pakshya-db', 'inspections');
        if (response && response.documents && response.documents.length > 0) {
          const parsedRecords = response.documents.map((doc: any) => ({
            id: doc.$id,
            date: doc.date,
            timestamp: doc.timestamp,
            inspectorName: 'Appwrite Inspector',
            inspectorId: doc.inspectorId || 'LMI-001',
            inspectorRegion: 'HQ',
            productName: doc.productName,
            brand: doc.brand,
            sku: doc.sku,
            barcode: doc.barcode || 'N/A',
            category: doc.category,
            overallStatus: doc.overallStatus,
            overallScore: doc.overallScore,
            sampleImages: {},
            declarations: doc.declarations ? JSON.parse(doc.declarations) : [],
            inspectorRemarks: doc.inspectorRemarks,
          }));
          setRecentRecords(parsedRecords);
        }
      } catch (err) {
        console.error("Failed to fetch records", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 select-none font-sans w-full min-w-0">
      
      {/* 0. Full-Width Floating Government Banner Slider */}
      <GovernmentBannerCarousel />

      {/* 1. Official Government Dashboard Hero */}
      <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-xl shadow-md relative overflow-hidden text-white">
        <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
        
        <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-center">
          <div className="md:col-span-8 lg:col-span-8 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded border border-amber-300/30 bg-amber-900/30">
                CENTRAL COMMAND
              </span>
              <span className="text-[10px] text-slate-500 font-bold">•</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ADMINISTRATIVE OVERVIEW
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              National Metrology Grid
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
              Monitor nationwide inspection activities, analyze violation hotspots, and enforce the Legal Metrology (Packaged Commodities) Rules, 2011 from the central registry.
            </p>
          </div>

          <div className="md:col-span-4 lg:col-span-4 flex justify-start md:justify-end min-w-0">
             <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-3 flex items-center gap-3 shadow-2xs w-full sm:w-auto min-w-[190px]">
                <div className="bg-blue-900/50 text-blue-400 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    HQ Jurisdiction
                  </div>
                  <div className="text-sm font-extrabold text-white truncate">
                    All India View
                  </div>
                  <div className="text-[9.5px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time Telemetry</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL INSPECTIONS (YTD)</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">12,480</h4>
              <span className="text-[11px] font-bold text-emerald-600">↑ 18%</span>
            </div>
          </div>
          <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">COMPLIANCE RATE</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">81.4%</h4>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ACTIVE VIOLATIONS</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-[#8b1515] leading-none">2,320</h4>
              <span className="text-[11px] font-bold text-red-600">Sec 36(1)</span>
            </div>
          </div>
          <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ACTIVE INSPECTORS</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">142</h4>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid (Map + Ledger) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        
        {/* Left Col: Map */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 min-h-[500px]">
          <div className="flex items-center gap-2.5 mb-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <Map className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                National Violation Hotspots
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time geographic distribution of Rule 18(2) and Rule 9 infractions.
              </p>
            </div>
          </div>
          
          <div className="flex-1 bg-[#eef2f6] rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center z-0 min-h-[400px]">
            <AdminMap markers={markers} />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold z-[1000]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]"></span>
                <span className="text-slate-700">High Concentration (&gt;100)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                <span className="text-slate-700">Moderate Concentration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: All Inspection Ledger */}
        <div className="xl:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-3.5 h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Global Inspection Ledger
            </h2>
            <button 
              onClick={onOpenHistory} 
              className="text-xs font-bold text-[#8b1515] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3 h-3 absolute left-2.5 top-2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search case ID..." 
                className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 pl-7 pr-2 text-[11px] focus:outline-none focus:border-slate-400"
              />
            </div>
            <button className="bg-slate-100 p-1.5 rounded border border-slate-200 text-slate-600">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 mt-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-3 bg-slate-50 animate-pulse h-20" />
              ))
            ) : recentRecords.length > 0 ? (
              recentRecords.map((rec, i) => (
                <div 
                  key={rec.id + i} 
                  onClick={() => onOpenReport(rec)}
                  className="border border-slate-200 rounded-lg p-3 hover:border-slate-300 hover:shadow-2xs transition bg-white flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      rec.overallStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 
                      rec.overallStatus === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.overallStatus === 'PASS' ? 'Compliant' : 'Violation'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      ID: {rec.id.substring(0, 8)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs truncate mt-1">
                    {rec.productName}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[120px]">By: {rec.inspectorName}</span>
                    <span>{rec.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No inspections found in the database.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

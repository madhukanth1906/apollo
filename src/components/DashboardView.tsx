'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Scan, 
  FileText, 
  Scale, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  BarChart2, 
  Calendar, 
  Camera, 
  FolderOpen, 
  Lightbulb, 
  Layers, 
  AlertCircle, 
  CheckCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { GenericPackageIcon } from './BrandAssets';
import { GovernmentBannerCarousel } from './GovernmentBannerCarousel';
import { InspectionRecord } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { databases } from '@/services/appwrite';
import { Query } from 'appwrite';

interface DashboardViewProps {
  onStartNewInspection: () => void;
  onOpenLabelTruth: () => void;
  onOpenActiveInspection: () => void;
  onOpenRules: () => void;
  onOpenReport: (record: InspectionRecord) => void;
  onOpenHistory: () => void;
  onOpenProducts: () => void;
  onOpenAnalytics: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartNewInspection,
  onOpenLabelTruth,
  onOpenActiveInspection,
  onOpenRules,
  onOpenReport,
  onOpenHistory,
  onOpenProducts,
  onOpenAnalytics,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentRecords, setRecentRecords] = useState<InspectionRecord[]>([]);

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
        } else {
          setRecentRecords([
            SAMPLE_PRODUCTS['SAMPLE-COMPLIANT'],
            SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'],
            SAMPLE_PRODUCTS['SAMPLE-NONCOMPLIANT'] || SAMPLE_PRODUCTS['SAMPLE-COMPLIANT']
          ]);
        }
      } catch (err) {
        setRecentRecords([
          SAMPLE_PRODUCTS['SAMPLE-COMPLIANT'], 
          SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'],
          SAMPLE_PRODUCTS['SAMPLE-NONCOMPLIANT'] || SAMPLE_PRODUCTS['SAMPLE-COMPLIANT']
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onStartNewInspection();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onStartNewInspection();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 select-none font-sans w-full min-w-0">
      
      {/* 0. Full-Width Floating Government Banner Slider / Carousel */}
      <GovernmentBannerCarousel />

      {/* 1. Official Government Dashboard Hero (Compact 3-Column Layout, No Purple) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs relative overflow-hidden">
        {/* Subtle Top Red Accent Stripe */}
        <div className="h-1 w-full bg-[#8b1515]" />

        <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-center">
          
          {/* Column 1: Welcome & Mission Statement (Span 6 on desktop) */}
          <div className="md:col-span-6 lg:col-span-6 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-[#8b1515] uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                LEGAL METROLOGY DIVISION
              </span>
              <span className="text-[10px] text-slate-400 font-bold">•</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                FIELD INSPECTOR PORTAL
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back, Inspector!
            </h1>

            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xl">
              Scan, verify and ensure statutory compliance of packaged commodities under the 
              <strong className="text-slate-800"> Legal Metrology (Packaged Commodities) Rules, 2011</strong>.
            </p>
          </div>

          {/* Column 2: Dignified Government Slogan (Span 3 on desktop) */}
          <div className="md:col-span-3 lg:col-span-3 border-y md:border-y-0 md:border-l border-slate-200 py-3 md:py-0 md:px-4 text-center md:text-left flex flex-col justify-center min-w-0">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              NATIONAL ENFORCEMENT MOTTO
            </span>
            <div className="font-serif italic font-bold text-base sm:text-lg text-[#8b1515] leading-snug">
              "Fair Measurement Builds a Fair Nation"
            </div>
            <span className="text-[9px] text-slate-500 mt-1 font-sans">
              Department of Consumer Affairs • Govt. of India
            </span>
          </div>

          {/* Column 3: Official Date & Duty Card (Span 3 on desktop) */}
          <div className="md:col-span-3 lg:col-span-3 flex justify-start md:justify-end min-w-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs w-full sm:w-auto min-w-[190px]">
              <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-lg w-10 h-10 flex items-center justify-center border border-red-200/60 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-sm font-extrabold text-slate-900 truncate">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-[9.5px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>On Duty • Live Sync</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Stat KPI Cards Row (4 Columns - Clean Government Palette, No Purple) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Card 1: Total Inspections */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL INSPECTIONS</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">248</h4>
              <span className="text-[11px] font-bold text-emerald-600">↑ 12%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">National Registry Count</p>
          </div>
          <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center border border-slate-200 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        
        {/* Card 2: Compliant Products */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">COMPLIANT PACKAGES</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">196</h4>
              <span className="text-[11px] font-bold text-emerald-600">79.0%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">PCR 2011 Certified</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Non-Compliant / Violations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">NON-COMPLIANT / SEIZURE</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-[#8b1515] leading-none">52</h4>
              <span className="text-[11px] font-bold text-red-600">21.0%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Notices Issued Sec 36(1)</p>
          </div>
          <div className="bg-red-50 text-[#8b1515] p-2.5 rounded-xl w-11 h-11 flex items-center justify-center border border-red-200 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Verification Accuracy */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">METROLOGY CONFIDENCE</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 leading-none">94.8%</h4>
              <span className="text-[11px] font-bold text-emerald-600">High</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">OCR & ArUco Homography</p>
          </div>
          <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center border border-amber-200 shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Workflow Steps Row (4 Cards, Clean Government Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        <div 
          onClick={onStartNewInspection} 
          className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center border border-emerald-200/60 shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">1. Scan Package</h3>
              <p className="text-[10px] text-slate-500 font-medium truncate">Multi-view PDP capture</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        <div 
          onClick={onStartNewInspection} 
          className="bg-white border border-slate-200 hover:border-red-300 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-slate-100 text-slate-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">2. AI Extraction</h3>
              <p className="text-[10px] text-slate-500 font-medium truncate">7 mandatory declarations</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        <div 
          onClick={onOpenRules} 
          className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-amber-50 text-amber-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center border border-amber-200 shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">3. Rule Audit</h3>
              <p className="text-[10px] text-slate-500 font-medium truncate">Check PCR 2011 clauses</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        <div 
          onClick={onOpenAnalytics} 
          className="bg-white border border-slate-200 hover:border-red-300 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-red-50 text-[#8b1515] p-2 rounded-lg w-9 h-9 flex items-center justify-center border border-red-200 shrink-0 group-hover:scale-105 transition-transform">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">4. Official Dossier</h3>
              <p className="text-[10px] text-slate-500 font-medium truncate">Form LM-1 PDF export</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#8b1515] group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

      </div>

      {/* 4. Main Middle Grid Area (Upload Ingestion + Recent Audits) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Upload Product Images (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#8b1515] border border-red-200 flex items-center justify-center shrink-0">
              <Scan className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Upload Commodity Package Images
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload multi-angle high-resolution photographs (Front PDP, Back Legal, Side, Macro Close-up) for statutory verification.
              </p>
            </div>
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleBrowseFiles}
            className="bg-slate-50/60 border-2 border-dashed border-slate-300 hover:border-[#8b1515] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2.5 transition cursor-pointer min-h-[200px]"
          >
            <UploadCloud className="w-12 h-12 text-slate-400" />
            <p className="text-sm font-bold text-slate-800">
              Drag & drop package photographs here
            </p>
            <p className="text-xs text-slate-400 font-medium">or</p>
            <button 
              type="button"
              className="bg-[#8b1515] hover:bg-[#780e0e] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <FolderOpen className="w-4 h-4" /> 
              <span>Browse Local Files</span>
            </button>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Supports: JPEG, PNG, WEBP • Max 15 MB per evidence photograph
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200">
              ✓ Front PDP (Name & Net Qty)
            </span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200">
              ✓ Back Legal Panel (MRP & Dates)
            </span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200">
              ✓ Side (Consumer Care & Barcode)
            </span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200">
              ✓ Macro (Numeral Font Height)
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <strong>Inspector Tip:</strong> Ensure adequate illumination and minimize surface glare. For Rule 9 numeral font verification, place the certified ArUco reference marker in the same plane.
            </div>
          </div>
        </div>

        {/* Right: Recent Inspection Records (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Recent Inspection Ledger
            </h2>
            <button 
              onClick={onOpenHistory} 
              className="text-xs font-bold text-[#8b1515] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-3 bg-slate-50 animate-pulse h-24" />
              ))
            ) : (
              recentRecords.map((rec, i) => (
                <div 
                  key={rec.id + i} 
                  onClick={() => onOpenReport(rec)}
                  className="border border-slate-200 rounded-xl p-3 hover:border-slate-300 hover:shadow-2xs transition bg-white flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-11 h-13 flex-shrink-0 relative">
                    <GenericPackageIcon 
                      variant={rec.overallStatus === 'PASS' ? 'compliant' : rec.overallStatus === 'FAIL' ? 'violation' : 'neutral'} 
                      className="w-11 h-13" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        rec.overallStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 
                        rec.overallStatus === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.overallStatus === 'PASS' ? 'Compliant' : 
                         rec.overallStatus === 'FAIL' ? 'Violation' : 'Review'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {rec.date || 'Sep 2026'}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-[#8b1515] transition-colors">
                      {rec.productName}
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate">
                      {rec.category} • SKU: {rec.sku}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-shrink-0 text-center">
                    <span className="text-xs font-black text-slate-900">
                      {rec.overallScore || 85}%
                    </span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">
                      Score
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. Bottom System Status Bar (Official Clean Banner) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-2.5 shadow-2xs">
          <div className="bg-emerald-100 text-emerald-800 rounded-full p-1.5 w-6 h-6 flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Portal Operational</h4>
            <p className="text-[9.5px] text-slate-400 truncate">AI Vision & OCR Active</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Cataloged SKUs</span>
            <span className="text-emerald-600">↑ 6%</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">12,480</h4>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Active Field Inspectors</span>
            <span className="text-emerald-600">Active</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">142 Officers</h4>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Seizure Notices Issued</span>
            <span className="text-red-700">Sec 36(1)</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">1,263 Notices</h4>
        </div>
      </div>
      
    </div>
  );
};

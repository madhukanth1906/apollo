'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Scan, 
  FileText, 
  Scale, 
  UploadCloud, 
  Plus, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  BarChart2,
  Calendar,
  Camera,
  FolderOpen,
  Lightbulb,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { GenericPackageIcon } from './BrandAssets';
import { InspectionRecord } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { databases } from '@/services/appwrite';
import { Query } from 'appwrite';

interface DashboardViewProps {
  onStartNewInspection: (files?: FileList) => void;
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentRecords, setRecentRecords] = useState<InspectionRecord[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await databases.listDocuments('pakshya-db', 'inspections', [
            Query.orderDesc('$createdAt'),
            Query.limit(3) // Top 3 as per screenshot
        ]);
        if (response.documents.length > 0) {
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
        console.error('Appwrite fetch failed on dashboard:', err);
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

  const handleOpenCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onStartNewInspection(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onStartNewInspection(files);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-[1600px] mx-auto">
      
      {/* 1. Welcome Greeting Header */}
      <div className="bg-gradient-to-r from-indigo-100/90 via-blue-50/80 to-indigo-100/90 border border-indigo-200/80 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center shadow-sm">
        <div className="relative z-10 flex flex-col">
          <span className="text-xs font-bold tracking-wider text-indigo-900 uppercase mb-1">GOOD MORNING,</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">
            Welcome back, Inspector!
          </h1>
          <p className="text-xs font-medium text-slate-600 max-w-xl">
            Scan, verify and ensure compliance of packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>
        
        <div className="relative z-10 hidden md:block">
          <div className="font-serif italic font-bold text-xl text-indigo-900 text-center leading-tight max-w-xs relative z-10">
            "Fair Measurement Builds a Fair Nation"
          </div>
        </div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm min-w-[180px]">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center border border-indigo-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat KPI Cards Row (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL INSPECTIONS</p>
            <div className="flex items-end gap-3">
              <h4 className="text-3xl font-extrabold text-slate-900 leading-none">248</h4>
              <span className="text-xs font-bold text-emerald-600 mb-1">↑ 12% vs last week</span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-12 h-12 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">COMPLIANT PRODUCTS</p>
            <div className="flex items-end gap-3">
              <h4 className="text-3xl font-extrabold text-slate-900 leading-none">196</h4>
              <span className="text-xs font-bold text-emerald-600 mb-1">↑ 20% vs last week</span>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl w-12 h-12 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">NON-COMPLIANT</p>
            <div className="flex items-end gap-3">
              <h4 className="text-3xl font-extrabold text-slate-900 leading-none">52</h4>
              <span className="text-xs font-bold text-rose-600 mb-1">↑ 8% vs last week</span>
            </div>
          </div>
          <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl w-12 h-12 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">AI CONFIDENCE</p>
            <div className="flex items-end gap-3">
              <h4 className="text-3xl font-extrabold text-slate-900 leading-none">87%</h4>
              <span className="text-xs font-bold text-emerald-600 mb-1">↑ 5% vs last week</span>
            </div>
          </div>
          <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl w-12 h-12 flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Workflow Steps Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div onClick={() => onStartNewInspection()} className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Scan Product</h3>
              <p className="text-[10px] text-slate-500 font-medium">Upload images to analyze</p>
            </div>
          </div>
          <div className="bg-emerald-200/60 text-emerald-800 p-1.5 rounded-full w-7 h-7 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div onClick={() => onStartNewInspection()} className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">AI Analysis</h3>
              <p className="text-[10px] text-slate-500 font-medium">OCR, detection & extraction</p>
            </div>
          </div>
          <div className="bg-blue-200/60 text-blue-800 p-1.5 rounded-full w-7 h-7 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div onClick={onOpenRules} className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Rule Validation</h3>
              <p className="text-[10px] text-slate-500 font-medium">Check against legal rules</p>
            </div>
          </div>
          <div className="bg-amber-200/60 text-amber-800 p-1.5 rounded-full w-7 h-7 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div onClick={onOpenAnalytics} className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Compliance Report</h3>
              <p className="text-[10px] text-slate-500 font-medium">Get detailed results with evidence</p>
            </div>
          </div>
          <div className="bg-purple-200/60 text-purple-800 p-1.5 rounded-full w-7 h-7 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. Main Middle Grid Area */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Panel: Upload Product Images (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Upload Product Images</h2>
                <p className="text-xs text-slate-500 mt-0.5">Upload clear images of the product (front, back, sides, or label) for AI analysis. You can upload multiple images.</p>
              </div>
            </div>
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="bg-blue-50/30 border-2 border-dashed border-blue-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:border-blue-400 transition min-h-[220px]"
          >
            <UploadCloud className="w-14 h-14 text-blue-400" />
            <p className="text-base font-bold text-slate-800">Drag & drop images here</p>
            <p className="text-xs text-slate-400 font-medium">or</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenCamera(); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
              >
                <Camera className="w-4 h-4" /> Use Camera
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleBrowseFiles(); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
              >
                <FolderOpen className="w-4 h-4" /> Browse Files
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Supported formats: JPG, PNG, JPEG, WEBP | Max size: 10 MB per image</p>
            <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">✓ Front view (PDP)</div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">✓ Back view (Legal Panel)</div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">✓ Side view (Nutritional/USP)</div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">✓ Label close-up (Macro)</div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-900 font-medium">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <strong>Tip:</strong> Use clear, well-lit images. Avoid blur, glare or shadows for better accuracy.
          </div>
        </div>

        {/* Right Panel: Recent Inspection Results (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Recent Inspection Results</h2>
            <button onClick={onOpenHistory} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-white animate-pulse h-28"></div>
              ))
            ) : (
              recentRecords.map((rec, i) => (
                <div key={rec.id + i} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition bg-white flex gap-4 relative overflow-hidden group cursor-pointer" onClick={() => onOpenReport(rec)}>
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                  
                  <div className="w-12 h-14 flex-shrink-0 relative">
                     <GenericPackageIcon variant={rec.overallStatus === 'PASS' ? 'compliant' : rec.overallStatus === 'FAIL' ? 'violation' : 'neutral'} className="w-12 h-14" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit mb-1 ${
                      rec.overallStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 
                      rec.overallStatus === 'FAIL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.overallStatus === 'PASS' ? 'Compliant' : 
                       rec.overallStatus === 'FAIL' ? 'Non-Compliant' : 'Review Needed'}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-xs truncate mb-1">{rec.productName}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Batch: {rec.sku} • {rec.category}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">ID: {rec.id}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-shrink-0">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={rec.overallStatus === 'PASS' ? "text-[#059669]" : rec.overallStatus === 'FAIL' ? "text-[#EF4444]" : "text-[#F59E0B]"} strokeDasharray={`${rec.overallScore || 0}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute font-bold text-slate-900 text-[10px]">{rec.overallScore}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Bottom System Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
          <div className="bg-emerald-500 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-emerald-700">All Systems Operational</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">AI Engine | OCR | DB | Live Scanner</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center shadow-sm">
           <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Products</span>
              <span className="text-emerald-600 text-[10px] font-bold">↑ 6%</span>
           </div>
           <h4 className="text-base font-extrabold text-slate-900">12,480</h4>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center shadow-sm">
           <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Inspectors</span>
              <span className="text-emerald-600 text-[10px] font-bold">↑ 3%</span>
           </div>
           <h4 className="text-base font-extrabold text-slate-900">142</h4>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center shadow-sm">
           <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reports Generated</span>
              <span className="text-emerald-600 text-[10px] font-bold">↑ 18%</span>
           </div>
           <h4 className="text-base font-extrabold text-slate-900">1,263</h4>
        </div>
      </div>
      
    </div>
  );
};

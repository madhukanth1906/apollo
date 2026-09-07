'use client';

import React, { useState, useRef } from 'react';
import { 
  Scan, 
  FileText, 
  Scale, 
  ShieldCheck, 
  UploadCloud, 
  Plus, 
  X, 
  ArrowRight, 
  Search, 
  Clock, 
  BookOpen, 
  Globe, 
  AlertTriangle, 
  Phone, 
  Flag, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { 
  GenericPackageIcon,
  MakeInIndiaLogo 
} from './BrandAssets';
import { InspectionRecord } from '@/types/inspection';
import { SAMPLE_PRODUCTS } from '@/services/mockData';

interface DashboardViewProps {
  onStartNewInspection: () => void;
  onOpenLabelTruth: () => void;
  onOpenActiveInspection: () => void;
  onOpenRules: () => void;
  onOpenReport: (record: InspectionRecord) => void;
  onOpenHistory: () => void;
  onOpenProducts: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartNewInspection,
  onOpenLabelTruth,
  onOpenActiveInspection,
  onOpenRules,
  onOpenReport,
  onOpenHistory,
  onOpenProducts,
}) => {
  const [thumbnails, setThumbnails] = useState<Array<{ id: string; label: string; url: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveThumbnail = (id: string) => {
    setThumbnails((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const viewNames = ['Front View', 'Back View', 'Side View', 'Label Close-up'];
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setThumbnails((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${index}`,
                label: viewNames[prev.length % viewNames.length] || `View ${prev.length + 1}`,
                url: event.target?.result as string,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const viewNames = ['Front View', 'Back View', 'Side View', 'Label Close-up'];
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setThumbnails((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${index}`,
                label: viewNames[prev.length % viewNames.length] || `View ${prev.length + 1}`,
                url: event.target?.result as string,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. Welcome Greeting Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Welcome, Inspector!
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Scan, verify and ensure compliance of packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
        </p>
      </div>

      {/* 2. Top 4 Action Cards in Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Scan Product */}
        <div
          onClick={onStartNewInspection}
          className="bg-[#eefaf3] border border-[#c6eed8] rounded-lg p-3.5 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <Scan className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Scan Product</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Upload images to analyze
            </p>
          </div>
        </div>

        {/* Card 2: AI Analysis */}
        <div
          onClick={onStartNewInspection}
          className="bg-[#edf5fc] border border-[#cbe2f9] rounded-lg p-3.5 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">AI Analysis</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              OCR, detection & extraction
            </p>
          </div>
        </div>

        {/* Card 3: Rule Validation */}
        <div
          onClick={onOpenRules}
          className="bg-[#fef5ec] border border-[#fcdbc5] rounded-lg p-3.5 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Rule Validation</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Check against legal rules
            </p>
          </div>
        </div>

        {/* Card 4: Compliance Report */}
        <div
          onClick={() => onOpenReport(SAMPLE_PRODUCTS['SAMPLE-COMPLIANT'])}
          className="bg-[#f6effc] border border-[#e3d4f5] rounded-lg p-3.5 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Compliance Report</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Get detailed results with evidence
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Upload Area, 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-5">
            {/* Upload Header */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Upload Product Images
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Upload clear images of the product (front, back, sides, or label) for AI analysis. You can upload multiple images.
                </p>
              </div>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-6 sm:p-8 text-center space-y-2 hover:border-blue-400 transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto stroke-1" />
              <div className="text-xs font-medium text-slate-700">
                Drag & drop images here
              </div>
              <div className="text-[11px] text-slate-400">or</div>
              <div>
                <button
                  type="button"
                  onClick={handleBrowseFiles}
                  className="px-5 py-1.5 bg-[#0f2e5a] hover:bg-blue-900 text-white rounded text-xs font-semibold shadow-xs transition"
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Supported formats: JPG, PNG, JPEG | Max size: 10 MB per image
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Loaded Packaging Images ({thumbnails.length})
                </span>
                {thumbnails.length > 0 && (
                  <button
                    onClick={() => setThumbnails([])}
                    className="text-red-600 hover:text-red-800 text-[11px]"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                {/* Add More button */}
                <button
                  type="button"
                  onClick={handleBrowseFiles}
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600 flex flex-col items-center justify-center gap-1 transition text-xs font-medium"
                >
                  <Plus className="w-5 h-5 text-slate-400" />
                  <span className="text-[11px]">Add Images</span>
                </button>

                {/* Uploaded Thumbnails */}
                {thumbnails.map((thumb) => (
                  <div key={thumb.id} className="space-y-1">
                    <div className="relative aspect-square rounded-lg border border-slate-200 bg-slate-100 overflow-hidden shadow-2xs group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb.url}
                        alt={thumb.label}
                        className="w-full h-full object-cover"
                      />

                      {/* Close button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveThumbnail(thumb.id)}
                        className="absolute top-1 right-1 w-4 h-4 bg-slate-900/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] font-medium text-slate-600 text-center truncate">
                      {thumb.label}
                    </div>
                  </div>
                ))}

                {/* Empty State message when no images uploaded */}
                {thumbnails.length === 0 && (
                  <div className="col-span-1 sm:col-span-4 rounded-lg border border-slate-200 bg-slate-50/70 p-3 flex items-center gap-3 text-slate-500">
                    <div className="p-2 rounded bg-slate-200/60 text-slate-400 flex-shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] leading-snug">
                      <span className="font-semibold text-slate-700 block">
                        No product images uploaded yet.
                      </span>
                      Click Browse Files or drag images to capture Principal Display Panel (PDP), back label, and price declarations.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={onStartNewInspection}
                className="px-7 py-2.5 bg-[#0f2e5a] hover:bg-blue-950 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition group"
              >
                <Search className="w-4 h-4 text-blue-300" />
                <span>Analyze Product</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Recent Results, Quick Actions, Useful Links) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card: Recent Inspection Result */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Recent Inspection Result
              </h3>
              <span className="text-[9px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">
                COMPLIANT
              </span>
            </div>

            {/* Result Item 1: Generic Salt Commodity (Compliant) */}
            <div className="bg-slate-50/60 rounded-lg p-3 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <GenericPackageIcon variant="compliant" className="w-11 h-13 flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Compliant</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Shaktibhog Chakki Fresh Atta 5kg
                  </h4>
                  <div className="text-[10px] text-slate-500">Batch SBAF23J15 • Retail Pack</div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Inspection ID: INSP20250123-001
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Date: 23 Jan 2025, 11:24 AM
                  </div>
                  <button
                    onClick={() => onOpenReport(SAMPLE_PRODUCTS['SAMPLE-COMPLIANT'])}
                    className="text-[10.5px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 pt-0.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Circular Score Gauge: 95% */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="95, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-900 font-mono">
                    95%
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-medium text-center mt-0.5">
                  Compliance Score
                </span>
              </div>
            </div>

            {/* Result Item 2: Generic Noodles Commodity (Non-Compliant) */}
            <div className="bg-slate-50/60 rounded-lg p-3 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <GenericPackageIcon variant="violation" className="w-11 h-13 flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-red-700">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span>Non-Compliant</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Packaged Instant Noodles 70 g
                  </h4>
                  <div className="text-[10px] text-slate-500">Batch N-2025 • Retail Pack</div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Inspection ID: INSP20250122-015
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Date: 22 Jan 2025, 04:18 PM
                  </div>
                  <button
                    onClick={() => onOpenReport(SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'])}
                    className="text-[10.5px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 pt-0.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Circular Score Gauge: 42% */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-red-500"
                      strokeDasharray="42, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-900 font-mono">
                    42%
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-medium text-center mt-0.5">
                  Compliance Score
                </span>
              </div>
            </div>
          </div>

          {/* Card: Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenHistory}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-center transition group flex flex-col items-center justify-center"
              >
                <Clock className="w-5 h-5 text-blue-700 mb-1 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-900 leading-tight">
                  View Inspection History
                </span>
              </button>

              <button
                onClick={onOpenProducts}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-center transition group flex flex-col items-center justify-center"
              >
                <Search className="w-5 h-5 text-blue-700 mb-1 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-900 leading-tight">
                  Search Product Database
                </span>
              </button>

              <button
                onClick={onOpenRules}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-center transition group flex flex-col items-center justify-center"
              >
                <BookOpen className="w-5 h-5 text-blue-700 mb-1 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-900 leading-tight">
                  Legal Metrology Rules
                </span>
              </button>

              <button
                onClick={() => onOpenReport(SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'])}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-center transition group flex flex-col items-center justify-center"
              >
                <FileText className="w-5 h-5 text-blue-700 mb-1 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-900 leading-tight">
                  Generate Report
                </span>
              </button>
            </div>
          </div>

          {/* Card: Useful Links */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight mb-2">
              Useful Links
            </h3>

            <div className="space-y-1.5">
              <button
                onClick={onOpenRules}
                className="w-full flex items-center gap-2.5 p-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded transition text-left text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>Legal Metrology Rules, 2011</span>
              </button>

              <a
                href="https://consumeraffairs.nic.in"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-2.5 p-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded transition text-left text-[11px]"
              >
                <Globe className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>Department of Consumer Affairs</span>
              </a>

              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-2.5 p-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded transition text-left text-[11px]"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>BIS Standards</span>
              </a>

              <a
                href="tel:1915"
                className="w-full flex items-center gap-2.5 p-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded transition text-left text-[11px]"
              >
                <Phone className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>Consumer Helpline (1915)</span>
              </a>

              <button
                onClick={() => alert('Report Violation form initiated.')}
                className="w-full flex items-center gap-2.5 p-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded transition text-left text-[11px]"
              >
                <Flag className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>Report Violation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Footer Quote & Make in India Banner */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Quote */}
        <div className="flex items-center gap-2 text-slate-600 font-serif italic text-xs sm:text-sm">
          <span className="text-xl font-bold text-slate-400 not-italic">“</span>
          <span>Fair Measurement. Honest Declarations. Empowered Consumers.</span>
          <span className="text-xl font-bold text-slate-400 not-italic">”</span>
          <span className="text-[11px] font-sans not-italic font-medium text-slate-500 ml-1">
            — Government of India
          </span>
        </div>

        {/* Make in India Banner */}
        <MakeInIndiaLogo className="flex-shrink-0" />
      </div>
    </div>
  );
};

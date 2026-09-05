'use client';

import React, { useState } from 'react';
import { 
  ScanLine, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  FileText, 
  Eye, 
  ArrowRight, 
  Camera, 
  Scale, 
  Check, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { DeclarationItem, InspectionRecord } from '@/types/inspection';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { DeclarationTable } from './DeclarationTable';
import { EvidenceViewer } from './EvidenceViewer';
import { ComplianceBadge } from './ComplianceBadge';

interface NewInspectionWorkspaceProps {
  onOpenLabelTruth: () => void;
  onOpenActiveInspection: () => void;
  onOpenReport: (record: InspectionRecord) => void;
}

export const NewInspectionWorkspace: React.FC<NewInspectionWorkspaceProps> = ({
  onOpenLabelTruth,
  onOpenActiveInspection,
  onOpenReport,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('SAMPLE-LABELTRUTH');
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({
    front: '',
    back: '',
    side: '',
    labelCloseUp: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [selectedDeclaration, setSelectedDeclaration] = useState<DeclarationItem | null>(null);
  const [highlightedDecId, setHighlightedDecId] = useState<string | undefined>();

  const currentRecord = SAMPLE_PRODUCTS[selectedPresetKey] || SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'];

  const handleStartAnalysis = (images: Record<string, string>, presetKey: string = 'SAMPLE-LABELTRUTH') => {
    setUploadedImages(images);
    setSelectedPresetKey(presetKey);
    setIsAnalyzing(true);
    setCurrentStep(2);
    setAnalysisProgress(15);

    // Simulate progressive AI pipeline execution
    setTimeout(() => setAnalysisProgress(40), 500);
    setTimeout(() => setAnalysisProgress(70), 1000);
    setTimeout(() => setAnalysisProgress(95), 1500);
    setTimeout(() => {
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      setCurrentStep(3);
    }, 1800);
  };

  const steps = [
    { num: 1, label: 'Capture & Upload', sublabel: 'Multi-view angles' },
    { num: 2, label: 'AI Inference', sublabel: 'OCR & Segmentation' },
    { num: 3, label: 'Declaration Verify', sublabel: 'PCR 2011 Schedule II' },
    { num: 4, label: 'Inspection Report', sublabel: 'Certificate generation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">New Product Inspection Workspace</h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400 font-mono">
                  Live Scanner
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Scan, verify and ensure compliance of packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>

          {/* Quick Step Indicator */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-700">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
                    currentStep === s.num
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : currentStep > s.num
                      ? 'text-emerald-400 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                    {currentStep > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: Upload & Capture Section */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Upload Product Images</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload clear images of the front, back, sides, or label areas of the packaged commodity.
            </p>
          </div>

          <ImageUploader onAnalyze={handleStartAnalysis} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {/* STEP 2: AI Analysis Progression Screen */}
      {currentStep === 2 && (
        <div className="bg-white p-8 rounded-lg border border-slate-200 text-center shadow-xs space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto border-2 border-blue-200">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">AI Legal Metrology Inference in Progress</h3>
            <p className="text-xs text-slate-500 mt-1">
              Executing YOLOv8 label segmentation, OCR text extraction, and PCR 2011 rule validation...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
              <span>Pipeline Stage: {analysisProgress < 50 ? 'Optical Recognition' : 'Statutory Rule Matching'}</span>
              <span>{analysisProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-800 h-full rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>

          {/* Live pipeline checkmarks */}
          <div className="bg-slate-50 p-4 rounded-lg border text-left text-xs space-y-2 text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${analysisProgress >= 25 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Product packaging detected & oriented</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${analysisProgress >= 50 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Principal Display Panel (PDP) and Legal Panels isolated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${analysisProgress >= 75 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>OCR transcribed with calibrated font height assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${analysisProgress >= 95 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Legal Metrology (Packaged Commodities) Rules, 2011 matched</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: Dual Panel Workspace (Left: Image + Right: AI Declarations Table) */}
      {(currentStep === 3 || currentStep === 4) && (
        <div className="space-y-6">
          {/* Top Status Summary Bar */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 font-bold text-xs">
                {currentRecord.sku}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{currentRecord.productName}</h3>
                  <ComplianceBadge status={currentRecord.overallStatus} size="sm" />
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                  <span>Category: <strong>{currentRecord.category}</strong></span>
                  <span>Barcode: <strong className="font-mono">{currentRecord.barcode}</strong></span>
                  <span>Compliance Score: <strong className="font-mono text-blue-900">{currentRecord.overallScore}/100</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* If Dual MRP issue detected, offer quick jump to LabelTruth */}
              {currentRecord.labelTruthFindings && currentRecord.labelTruthFindings.length > 0 && (
                <button
                  onClick={onOpenLabelTruth}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded text-xs font-bold border border-red-200 flex items-center gap-1.5 transition"
                >
                  <Layers className="w-3.5 h-3.5 text-red-600" />
                  <span>Dual MRP Conflict Detected (Open LabelTruth)</span>
                </button>
              )}

              {/* If low confidence detected, offer quick jump to Active Inspection */}
              {currentRecord.activeInspectionRequired && (
                <button
                  onClick={onOpenActiveInspection}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-xs font-bold border border-amber-300 flex items-center gap-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                  <span>Resolve Ambiguity (Active Inspection)</span>
                </button>
              )}

              <button
                onClick={() => onOpenReport(currentRecord)}
                className="px-4 py-1.5 bg-[#0a1f44] hover:bg-blue-900 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate Official Report</span>
              </button>
            </div>
          </div>

          {/* Dual Panel Layout: Left Image Preview, Right Declarations & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Image Preview with Bounding Boxes */}
            <div className="lg:col-span-5 flex flex-col">
              <ImagePreview
                images={uploadedImages}
                declarations={currentRecord.declarations}
                highlightedDeclarationId={highlightedDecId}
                onSelectDeclaration={(id) => {
                  setHighlightedDecId(id);
                  const dec = currentRecord.declarations.find((d) => d.id === id);
                  if (dec) setSelectedDeclaration(dec);
                }}
              />
            </div>

            {/* Right: AI Pipeline Summary & Declarations Table */}
            <div className="lg:col-span-7 space-y-4">
              {/* AI Detection Summary Pills */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ Product Detected
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ Label Regions (PDP/Back)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ OCR Completed
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Engine: PaddleOCR + TrOCR India
                </div>
              </div>

              {/* Declarations Compliance Table */}
              <DeclarationTable
                declarations={currentRecord.declarations}
                selectedId={highlightedDecId}
                onInspectEvidence={(item) => setSelectedDeclaration(item)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Evidence Viewer Modal */}
      {selectedDeclaration && (
        <EvidenceViewer
          item={selectedDeclaration}
          onClose={() => setSelectedDeclaration(null)}
          fullImageUrl={
            selectedDeclaration.viewSource === 'Front View'
              ? uploadedImages.front
              : selectedDeclaration.viewSource === 'Back View'
              ? uploadedImages.back
              : uploadedImages.side || uploadedImages.front
          }
        />
      )}
    </div>
  );
};

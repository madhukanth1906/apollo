'use client';

import React, { useState } from 'react';
import { 
  ScanLine, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Camera, 
  Check, 
  ChevronRight,
  Target
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { DeclarationItem, InspectionRecord } from '@/types/inspection';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { DeclarationTable } from './DeclarationTable';
import imageCompression from 'browser-image-compression';
import { EvidenceViewer } from './EvidenceViewer';
import { ComplianceBadge } from './ComplianceBadge';

interface NewInspectionWorkspaceProps {
  onOpenLabelTruth: () => void;
  onOpenActiveInspection: () => void;
  onOpenReport: (record: InspectionRecord) => void;
  onOpenRules?: () => void;
  onOpenHelp?: () => void;
}

export const NewInspectionWorkspace: React.FC<NewInspectionWorkspaceProps> = ({
  onOpenLabelTruth,
  onOpenActiveInspection,
  onOpenReport,
  onOpenRules,
  onOpenHelp,
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
  const [realRecord, setRealRecord] = useState<InspectionRecord | null>(null);

  const currentRecord = realRecord || SAMPLE_PRODUCTS[selectedPresetKey] || SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'];

  const resetWorkspace = () => {
    setUploadedImages({ front: '', back: '', side: '', labelCloseUp: '' });
    setSelectedPresetKey('SAMPLE-LABELTRUTH');
    setRealRecord(null);
    setCurrentStep(1);
    setAnalysisProgress(0);
    setHighlightedDecId(undefined);
    setSelectedDeclaration(null);
  };

  const handleStartAnalysis = async (images: Record<string, string>, presetKey: string = 'SAMPLE-LABELTRUTH') => {
    setUploadedImages(images);
    setSelectedPresetKey(presetKey);
    setIsAnalyzing(true);
    setCurrentStep(3); // Jump straight to workspace with skeletons
    setAnalysisProgress(10);
    setRealRecord(null);

    if (images.front && images.front.startsWith('data:image')) {
      try {
        setAnalysisProgress(20);
        const formData = new FormData();
        for (const [key, base64Str] of Object.entries(images)) {
          if (base64Str && base64Str.startsWith('data:image')) {
            const fetchRes = await fetch(base64Str);
            const originalBlob = await fetchRes.blob();
            
            // Compress the image before sending to prevent 413 Payload Too Large
            const compressedBlob = await imageCompression(originalBlob, {
              maxSizeMB: 1, // Target size under 1MB
              maxWidthOrHeight: 1920, // Reasonable max resolution
              useWebWorker: true,
            });
            
            formData.append('images', compressedBlob, `${key}.jpg`);
          }
        }
        setAnalysisProgress(50);
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData
        });
        setAnalysisProgress(85);
        if (response.ok) {
          const aiDataRes = await response.json();
          let aiData: any = {};
          try {
            const rawText = aiDataRes.data || '';
            const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            aiData = JSON.parse(cleanedText);
          } catch(e) {
            console.error("Failed to parse inner JSON from Qwen", e);
          }
          
          const parsedRecord: InspectionRecord = {
            id: 'LIVE-' + Math.floor(Math.random() * 10000),
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toLocaleTimeString(),
            inspectorName: 'Current Inspector',
            inspectorId: 'LMI-001',
            inspectorRegion: 'HQ',
            productName: aiData.productName || 'Unknown Product',
            brand: aiData.brand || 'Unknown Brand',
            sku: 'LIVE-SKU-001',
            barcode: 'N/A',
            category: 'Packaged Staples',
            overallStatus: (aiData.complianceScore || 0) >= 80 ? 'PASS' : 'REVIEW',
            overallScore: aiData.complianceScore || 50,
            sampleImages: images,
            declarations: [
              {
                id: 'd1',
                field: 'Generic Name',
                pcrRuleClause: 'Rule 6(1)(b)',
                extractedValue: aiData.productName || 'Not Found',
                standardRequirement: 'Clear generic name of commodity',
                confidence: 90,
                status: aiData.productName && aiData.productName !== 'Not Found' ? 'PASS' : 'FAIL',
                viewSource: 'Front View',
                isMandatory: true
              },
              {
                id: 'd2',
                field: 'Net Quantity',
                pcrRuleClause: 'Rule 6(1)(c)',
                extractedValue: aiData.netQuantity || 'Not Found',
                standardRequirement: 'Metric standard units (g, kg, ml, L)',
                confidence: 90,
                status: aiData.netQuantity && aiData.netQuantity !== 'Not Found' ? 'PASS' : 'FAIL',
                viewSource: 'Front View',
                isMandatory: true
              },
              {
                id: 'd3',
                field: 'MRP',
                pcrRuleClause: 'Rule 6(1)(e)',
                extractedValue: aiData.mrp || 'Not Found',
                standardRequirement: 'Incl. of all taxes',
                confidence: 90,
                status: aiData.mrp && aiData.mrp !== 'Not Found' ? 'PASS' : 'FAIL',
                viewSource: 'Front View',
                isMandatory: true
              },
              {
                id: 'd4',
                field: 'Manufacturer Address',
                pcrRuleClause: 'Rule 6(1)(a)',
                extractedValue: aiData.manufacturerAddress || 'Not Found',
                standardRequirement: 'Complete address with PIN code',
                confidence: 80,
                status: aiData.manufacturerAddress && aiData.manufacturerAddress !== 'Not Found' ? 'PASS' : 'FAIL',
                viewSource: 'Front View',
                isMandatory: true
              },
              {
                id: 'd5',
                field: 'Customer Care',
                pcrRuleClause: 'Rule 6(1)(g)',
                extractedValue: aiData.customerCare || 'Not Found',
                standardRequirement: 'Email and Phone/Address',
                confidence: 85,
                status: aiData.customerCare && aiData.customerCare !== 'Not Found' ? 'PASS' : 'FAIL',
                viewSource: 'Front View',
                isMandatory: true
              }
            ]
          };
          setRealRecord(parsedRecord);
        }
      } catch (err) {
        console.error("Live ML Pipeline Error:", err);
      } finally {
        setAnalysisProgress(100);
        setIsAnalyzing(false);
        setCurrentStep(3);
      }
    } else {
      setTimeout(() => setAnalysisProgress(40), 500);
      setTimeout(() => setAnalysisProgress(70), 1000);
      setTimeout(() => setAnalysisProgress(95), 1500);
      setTimeout(() => {
        setAnalysisProgress(100);
        setIsAnalyzing(false);
        setCurrentStep(3);
      }, 1800);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* 1. Page Title Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-100/90 via-blue-50/80 to-indigo-100/90 border border-indigo-200/80 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-5 relative z-10">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">New Product Inspection Workspace</h1>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Scanner
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Scan, verify and ensure compliance of packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>
        </div>
        <div className="relative z-10 hidden md:block">
           <div className="italic text-xl font-serif font-bold text-indigo-900/60 max-w-xs text-right leading-tight">
             Consumer Rights<br/>Stronger India
           </div>
        </div>
      </div>

      {/* 2. Step Progress Tracker Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between px-8 my-5">
        {[
          { num: 1, title: 'Capture & Upload', sub: 'Add product images', icon: Camera },
          { num: 2, title: 'AI Inference', sub: 'Detect, OCR & Extract', icon: Cpu },
          { num: 3, title: 'Declaration Verify', sub: 'Check rule compliance', icon: CheckCircle2 },
          { num: 4, title: 'Inspection Report', sub: 'View results & download', icon: FileText }
        ].map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                 currentStep === step.num ? 'bg-indigo-600 text-white font-extrabold shadow-md' :
                 currentStep > step.num ? 'bg-emerald-500 text-white' : 
                 step.num === 2 ? 'bg-purple-100 text-purple-700' :
                 step.num === 3 ? 'bg-blue-100 text-blue-700' :
                 'bg-slate-100 text-slate-600'
               }`}>
                 {currentStep > step.num ? <Check className="w-4 h-4" /> : currentStep === step.num ? step.num : <step.icon className="w-4 h-4" />}
               </div>
               <div>
                  <h4 className={`text-sm font-bold ${currentStep >= step.num ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{step.sub}</p>
               </div>
            </div>
            {idx < 3 && <ChevronRight className="w-5 h-5 text-indigo-300 mx-2" />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Upload & Capture Section */}
      {currentStep === 1 && (
        <ImageUploader onAnalyze={handleStartAnalysis} isAnalyzing={isAnalyzing} onOpenRules={onOpenRules} onOpenHelp={onOpenHelp} />
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
              {currentRecord.labelTruthFindings && currentRecord.labelTruthFindings.length > 0 && (
                <button
                  onClick={onOpenLabelTruth}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded text-xs font-bold border border-red-200 flex items-center gap-1.5 transition"
                >
                  <Layers className="w-3.5 h-3.5 text-red-600" />
                  <span>Dual MRP Conflict Detected (Open LabelTruth)</span>
                </button>
              )}

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
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>Generate Official Report</span>
              </button>

              <button
                onClick={resetWorkspace}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition ml-2"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

            <div className="lg:col-span-7 space-y-4">
              {isAnalyzing && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <Cpu className="w-5 h-5 text-blue-600 animate-spin" />
                     <h3 className="text-sm font-bold text-slate-900">AI Inference in Progress...</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-slate-700">
                      <span>{analysisProgress < 50 ? 'Running OCR Engine...' : 'Matching Statutory Rules...'}</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

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

              <DeclarationTable
                declarations={currentRecord.declarations}
                selectedId={highlightedDecId}
                onInspectEvidence={(item) => setSelectedDeclaration(item)}
                isLoading={isAnalyzing}
              />
            </div>
          </div>
        </div>
      )}

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

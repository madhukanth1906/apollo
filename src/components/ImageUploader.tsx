'use client';

import React, { useState } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  Zap,
  FolderOpen,
  Lightbulb,
  BookOpen,
  HeadphonesIcon,
  RefreshCw,
  Cpu,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';

interface ImageSlot {
  key: 'front' | 'back' | 'side' | 'labelCloseUp';
  label: string;
  sublabel: string;
  required: boolean;
}

interface ImageUploaderProps {
  onAnalyze: (images: Record<string, string>, selectedSampleKey?: string, runMetrology?: boolean, markerSize?: string) => void;
  isAnalyzing: boolean;
  onOpenRules?: () => void;
  onOpenHelp?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isAnalyzing, onOpenRules, onOpenHelp }) => {
  const [images, setImages] = useState<Record<string, string>>({
    front: '',
    back: '',
    side: '',
    labelCloseUp: '',
  });

  const [activePreset, setActivePreset] = useState<string>('');
  const [runMetrology, setRunMetrology] = useState<boolean>(true);
  const [markerSize, setMarkerSize] = useState<string>('40.0');

  const slots: ImageSlot[] = [
    { key: 'front', label: 'Front View (PDP)', sublabel: 'Principal Display Panel, Generic Name & Net Qty', required: true },
    { key: 'back', label: 'Back View (Legal Panel)', sublabel: 'MRP, USP, Manufacturer Address & Batch', required: true },
    { key: 'side', label: 'Side View (Nutritional/USP)', sublabel: 'Unit Sale Price, Barcode & Storage Details', required: false },
    { key: 'labelCloseUp', label: 'Label Close-up (Macro)', sublabel: 'High-res macro crop for numeral font height, etc.', required: false },
  ];

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    const product = SAMPLE_PRODUCTS[presetKey];
    if (product && product.sampleImages) {
      setImages({
        front: product.sampleImages.front || '',
        back: product.sampleImages.back || '',
        side: product.sampleImages.side || '',
        labelCloseUp: product.sampleImages.labelCloseUp || '',
      });
    }
  };

  const handleFileChange = (slotKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => ({ ...prev, [slotKey]: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartAnalysis = () => {
    onAnalyze(images, activePreset, runMetrology, markerSize);
  };

  const hasMinimumImages = Boolean(images.front && images.back);

  return (
    <div className="space-y-6">
      
      {/* Quick Test Cases Presets */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-[#8b1515] w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-sm">Quick Test Cases</h3>
            <span className="text-[10px] font-bold text-[#8b1515] bg-red-50 px-2 py-0.5 rounded border border-red-200 ml-2">
              SIH 2026 LEGAL METROLOGY EVALUATION PRESETS
            </span>
          </div>
          <button className="border border-red-200 bg-white hover:bg-red-50 text-[#8b1515] font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer">
            View All Test Cases →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: 'SAMPLE-LABELTRUTH', label: 'Crispy Munch Biscuits', tag: 'Dual MRP Mismatch', tagColor: 'text-rose-600 bg-rose-50' },
            { key: 'SAMPLE-COMPLIANT', label: 'Shaktibhog Atta 5kg', tag: '100% PCR Compliant', tagColor: 'text-emerald-600 bg-emerald-50' },
            { key: 'SAMPLE-ACTIVE-INSPECTION', label: 'Revolution Pro Serum', tag: 'Low OCR Glare', tagColor: 'text-amber-700 bg-amber-50' },
            { key: 'SAMPLE-FINGERPRINT', label: 'Herbal Glow Shampoo', tag: 'Shrinkflation Alert', tagColor: 'text-amber-600 bg-amber-50' },
            { key: 'SAMPLE-SPECTRA', label: 'Himalayan Rock Salt', tag: 'UV Anomaly Ink', tagColor: 'text-purple-600 bg-purple-50' },
          ].map((item) => {
            const thumb = SAMPLE_PRODUCTS[item.key]?.sampleImages?.front;
            const isActive = activePreset === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handlePresetSelect(item.key)}
                className={`bg-white border ${isActive ? 'border-[#a81c1c] ring-2 ring-red-200' : 'border-slate-200 hover:border-red-300'} rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition shadow-xs`}
              >
                <div className="w-12 h-12 rounded-md border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={item.label} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{item.label}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-1 inline-block ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left: 4-Slot Image Upload Grid (Span 8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Upload Product Images</h2>
              <p className="text-xs text-slate-500 font-medium">Upload clear images of the front, back, sides, or label areas of the packaged commodity.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {slots.map((slot) => {
              const imgUrl = images[slot.key];
              return (
                <div key={slot.key} className={`h-full rounded-2xl p-4 flex flex-col transition relative group ${
                  imgUrl ? 'border border-emerald-300 shadow-sm bg-white' : 'bg-slate-50/70 border-2 border-dashed border-slate-300 hover:border-[#8b1515]'
                }`}>
                  <div className="flex-1 flex flex-col items-center justify-start text-center">
                  {imgUrl ? (
                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden border border-slate-200 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={slot.label} className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImages(prev => ({...prev, [slot.key]: ''})) }}
                        className="absolute top-1.5 right-1.5 bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white p-1 rounded-md shadow-sm transition opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <ImageIcon className="text-slate-400 w-8 h-8 mb-2" />
                  )}
                  
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900">{slot.label}</span>
                    {slot.required && !imgUrl && <span className="text-[10px] text-rose-500 font-bold">*</span>}
                  </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-auto pt-3">
                    <label className="cursor-pointer flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] px-2 py-2 rounded-lg shadow-xs transition flex items-center justify-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> Camera
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handleFileChange(slot.key, e)} className="hidden" />
                    </label>
                    <label className="cursor-pointer flex-1 bg-[#8b1515] hover:bg-[#780e0e] text-white font-bold text-[11px] px-2 py-2 rounded-lg shadow-xs transition flex items-center justify-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" /> Files
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(slot.key, e)} className="hidden" />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mt-2">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 flex-grow justify-center xl:justify-start">
               <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
               <span className="text-center xl:text-left">{hasMinimumImages ? 'Images ready for analysis.' : 'Please upload at least Front and Back views of the commodity to continue.'}</span>
            </div>
            
            {hasMinimumImages && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={runMetrology} 
                    onChange={(e) => setRunMetrology(e.target.checked)}
                    className="w-4 h-4 text-[#8b1515] rounded border-slate-300 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Run Physical Measurement</span>
                </label>
                {runMetrology && (
                  <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
                    <span className="text-[10px] font-bold text-slate-500">ArUco Size (mm):</span>
                    <input 
                      type="number" 
                      value={markerSize} 
                      onChange={(e) => setMarkerSize(e.target.value)}
                      className="w-16 h-7 text-xs border border-slate-300 rounded px-2 font-semibold focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
               <button onClick={() => { setImages({ front: '', back: '', side: '', labelCloseUp: ''}); setActivePreset(''); }} className="justify-center border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-sm cursor-pointer">
                 <RefreshCw className="w-4 h-4" /> Reset
               </button>
               <button onClick={handleStartAnalysis} disabled={!hasMinimumImages || isAnalyzing} className={`justify-center font-extrabold text-sm px-6 py-3 rounded-xl flex items-center gap-2.5 transition cursor-pointer ${
                 !hasMinimumImages || isAnalyzing ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#a81c1c] to-[#881313] hover:from-[#8e1717] hover:to-[#780e0e] text-white shadow-md shadow-red-900/20'
               }`}>
                 <Cpu className="w-4 h-4 text-white" /> {isAnalyzing ? 'Analyzing...' : 'Analyze Product (AI Engine)'} <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Context Stack (Span 4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-[#8b1515] w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Inspection Tips</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Use clear, well-lit images',
                'Capture all sides and label areas',
                'Include close-ups of text (MRP, Net Qty)',
                'Avoid blur, glare or shadows',
                'Supported formats: JPG, PNG, WEBP',
                'Max file size: 10 MB per image'
              ].map((tip, i) => (
                <li key={i} className="text-xs font-semibold text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="text-[#8b1515] w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Applicable Rules</h3>
            </div>
            <p className="text-xs font-medium text-slate-600">Legal Metrology (Packaged Commodities) Rules, 2011</p>
            <button onClick={onOpenRules} className="w-full bg-red-50 hover:bg-red-100 text-[#8b1515] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition border border-red-200 mt-1 cursor-pointer">
              View Guidelines →
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
             <div className="flex items-center gap-2">
              <HeadphonesIcon className="text-[#8b1515] w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Need Help?</h3>
            </div>
            <p className="text-xs font-medium text-slate-600">Check our user guide or contact support for assistance.</p>
            <button onClick={onOpenHelp} className="w-full bg-red-50 hover:bg-red-100 text-[#8b1515] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition border border-red-200 mt-1 cursor-pointer">
              Help & Support →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

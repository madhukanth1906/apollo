'use client';

import React, { useState } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  Cpu, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/services/mockData';
import { InspectionRecord } from '@/types/inspection';

interface ImageSlot {
  key: 'front' | 'back' | 'side' | 'labelCloseUp';
  label: string;
  sublabel: string;
  required: boolean;
}

interface ImageUploaderProps {
  onAnalyze: (images: Record<string, string>, selectedSampleKey?: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const [images, setImages] = useState<Record<string, string>>({
    front: '',
    back: '',
    side: '',
    labelCloseUp: '',
  });

  const [activePreset, setActivePreset] = useState<string>('');
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [activeSlotForCamera, setActiveSlotForCamera] = useState<'front' | 'back' | 'side' | 'labelCloseUp'>('front');

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  React.useEffect(() => {
    if (cameraModalOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera', err);
          alert('Could not access camera. Please check permissions.');
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [cameraModalOpen]);

  const slots: ImageSlot[] = [
    {
      key: 'front',
      label: 'Front View (PDP)',
      sublabel: 'Principal Display Panel, Generic Name & Net Qty',
      required: true,
    },
    {
      key: 'back',
      label: 'Back View (Legal Panel)',
      sublabel: 'MRP, USP, Manufacturer Address & Batch',
      required: true,
    },
    {
      key: 'side',
      label: 'Side View (Nutritional/USP)',
      sublabel: 'Unit Sale Price, Barcode & Storage Details',
      required: false,
    },
    {
      key: 'labelCloseUp',
      label: 'Label Close-up (Macro)',
      sublabel: 'High-res macro crop for numeral font height check',
      required: false,
    },
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

  const handleRemoveImage = (slotKey: string) => {
    setImages((prev) => ({ ...prev, [slotKey]: '' }));
  };

  const handleStartAnalysis = () => {
    onAnalyze(images, activePreset);
  };

  const hasMinimumImages = Boolean(images.front || images.back);

  return (
    <div className="space-y-6">
      {/* SIH Hackathon Demo Presets Quick-Selector */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-600 text-white">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
              SIH 2026 Legal Metrology Evaluation Presets
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
              Quick Test Cases
            </span>
          </div>
          <span className="text-[11px] text-blue-700">Click any preset to load real commodity test images:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { key: 'SAMPLE-LABELTRUTH', label: 'Crispy Munch Biscuits', tag: 'Dual MRP Mismatch' },
            { key: 'SAMPLE-COMPLIANT', label: 'Shaktibhog Atta 5kg', tag: '100% PCR Compliant' },
            { key: 'SAMPLE-ACTIVE-INSPECTION', label: 'Revolution Pro Serum', tag: 'Low OCR Glare' },
            { key: 'SAMPLE-FINGERPRINT', label: 'Herbal Glow Shampoo', tag: 'Shrinkflation Alert' },
            { key: 'SAMPLE-SPECTRA', label: 'Himalayan Rock Salt', tag: 'UV Anomaly Ink' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handlePresetSelect(item.key)}
              className={`p-2 rounded text-left border transition-all text-xs flex flex-col justify-between ${
                activePreset === item.key
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <span className="font-semibold truncate">{item.label}</span>
              <span className={`text-[10px] mt-1 ${activePreset === item.key ? 'text-amber-300' : 'text-slate-500'}`}>
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload / Camera Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const imgUrl = images[slot.key];

          return (
            <div
              key={slot.key}
              className={`bg-white rounded-lg border-2 p-3 flex flex-col justify-between relative transition-all ${
                imgUrl
                  ? 'border-emerald-300 shadow-xs'
                  : 'border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{slot.label}</span>
                    {slot.required && (
                      <span className="text-[10px] text-red-600 font-bold">*Mandatory</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{slot.sublabel}</p>
                </div>

                {imgUrl && (
                  <button
                    onClick={() => handleRemoveImage(slot.key)}
                    className="text-slate-400 hover:text-red-600 p-0.5 rounded transition"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Image Area or Dropzone */}
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                {imgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgUrl}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-[11px] font-medium text-slate-600">Drag & Drop Image</p>
                    <p className="text-[10px] text-slate-400">or browse from device</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                <label className="cursor-pointer flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition font-medium text-[11px]">
                  <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                  <span>Browse</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(slot.key, e)}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    setActiveSlotForCamera(slot.key);
                    setCameraModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 transition font-medium text-[11px]"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-700" />
                  <span>Capture</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {hasMinimumImages ? (
              <strong className="text-slate-900">
                Packaging views loaded. Ready for AI Legal Metrology extraction.
              </strong>
            ) : (
              'Upload at least Front and Back views of the commodity to continue.'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handlePresetSelect('SAMPLE-LABELTRUTH')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleStartAnalysis}
            disabled={!hasMinimumImages || isAnalyzing}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-white transition shadow-sm w-full sm:w-auto ${
              !hasMinimumImages || isAnalyzing
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#0a1f44] hover:bg-blue-900 border border-amber-500'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>{isAnalyzing ? 'Analyzing Declarations...' : 'Analyze Product (AI Engine)'}</span>
          </button>
        </div>
      </div>

      {/* Real Live Camera Capture Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 border border-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Camera Scanner — {slots.find((s) => s.key === activeSlotForCamera)?.label}
                </h3>
              </div>
              <button
                onClick={() => setCameraModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-4/3 bg-slate-900 rounded overflow-hidden flex items-center justify-center text-white">
              {/* Viewfinder crosshairs */}
              <div className="absolute inset-4 border-2 border-dashed border-white/40 pointer-events-none rounded z-10" />
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setCameraModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (videoRef.current && canvasRef.current) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                      const imgData = canvas.toDataURL('image/jpeg');
                      setImages((prev) => ({ ...prev, [activeSlotForCamera]: imgData }));
                    }
                  }
                  setCameraModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded flex items-center gap-1.5 shadow"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap Picture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

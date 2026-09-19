'use client';

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';
import { BoundingBox, DeclarationItem } from '@/types/inspection';

interface ImagePreviewProps {
  images: Record<string, string>;
  declarations?: DeclarationItem[];
  highlightedDeclarationId?: string;
  onSelectDeclaration?: (id: string) => void;
  showBoundingBoxes?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  declarations = [],
  highlightedDeclarationId,
  onSelectDeclaration,
  showBoundingBoxes = true,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side' | 'labelCloseUp'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentImage = images[activeView] || images.front || '';

  const viewLabels: Record<string, string> = {
    front: 'Front (PDP)',
    back: 'Back (Legal)',
    side: 'Side (USP)',
    labelCloseUp: 'Close-up (Macro)',
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(1, Number((prev + delta).toFixed(1)))));
  };

  // Filter declarations that belong to the active view or have bounding boxes
  const activeDeclarations = declarations.filter((d) => {
    if (activeView === 'front') return d.viewSource === 'Front View';
    if (activeView === 'back') return d.viewSource === 'Back View';
    if (activeView === 'side') return d.viewSource === 'Side View';
    return d.viewSource === 'Label Close-up';
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Top Bar: View Tabs & Zoom Controls */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {(['front', 'back', 'side', 'labelCloseUp'] as const).map((viewKey) => {
            const hasImg = Boolean(images[viewKey]);
            if (!hasImg && viewKey !== 'front') return null;

            return (
              <button
                key={viewKey}
                onClick={() => {
                  setActiveView(viewKey);
                  setZoomLevel(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition flex items-center gap-1.5 ${
                  activeView === viewKey
                    ? 'bg-[#0a1f44] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{viewLabels[viewKey]}</span>
                {hasImg && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-slate-600">
          <button
            onClick={() => handleZoom(-0.2)}
            disabled={zoomLevel <= 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 font-semibold">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoom(0.2)}
            disabled={zoomLevel >= 2.5}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 rounded hover:bg-slate-200 ml-1 text-[10px] font-medium"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Bounding Box Layer */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center min-h-[360px] p-2">
        {currentImage ? (
          <div
            className="relative transition-transform duration-200 max-h-[500px] flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="Packaged commodity inspection preview"
              className="max-h-[480px] w-auto max-w-full rounded object-contain shadow-2xl"
            />

            {/* AI Bounding Box Overlays */}
            {showBoundingBoxes &&
              activeDeclarations.map((dec) => {
                if (!dec.boundingBox) return null;
                const isSelected = highlightedDeclarationId === dec.id;

                let borderClass = 'border-emerald-500 bg-emerald-500/15';
                if (dec.status === 'FAIL') borderClass = 'border-red-500 bg-red-500/20';
                if (dec.status === 'REVIEW') borderClass = 'border-amber-400 bg-amber-500/20';
                if (isSelected) borderClass = 'border-amber-300 ring-2 ring-amber-400 bg-amber-400/30';

                return (
                  <div
                    key={dec.id}
                    onClick={() => onSelectDeclaration?.(dec.id)}
                    className={`absolute cursor-pointer border-2 transition-all group ${borderClass}`}
                    style={{
                      left: `${dec.boundingBox.x}%`,
                      top: `${dec.boundingBox.y}%`,
                      width: `${dec.boundingBox.width}%`,
                      height: `${dec.boundingBox.height}%`,
                    }}
                    title={`${dec.field}: ${dec.extractedValue}`}
                  >
                    {/* Bounding box label tag */}
                    <div className="absolute -top-5 left-0 bg-slate-950/90 text-white text-[9px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap shadow flex items-center gap-1">
                      <span className="font-bold text-amber-300">{dec.field}</span>
                      <span>{dec.confidence}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center text-slate-400 p-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center border border-slate-700">
              <Eye className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-xs font-semibold text-slate-300">No image loaded for this view</p>
            <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
              Please upload or capture a photo in the Capture step to preview this angle and view AI bounding boxes.
            </p>
          </div>
        )}

        {/* View Indicator Overlay */}
        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded border border-white/15 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OCR Bounding Boxes: Active</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-300">{activeDeclarations.length} Detected in View</span>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 text-[11px] text-slate-600 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#8b1515]" />
          Click any highlighted box to inspect OCR token confidence & Legal Metrology clause.
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          Resolution: 300 DPI Calibrated
        </span>
      </div>
    </div>
  );
};

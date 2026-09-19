'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Maximize2, 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  Layers, 
  FileText,
  Camera,
  Compass,
  ArrowRight
} from 'lucide-react';

interface MetrologyReport {
  timestamp: string;
  processing_time_ms: number;
  camera_calibrated: boolean;
  marker: {
    detected: boolean;
    marker_id: number;
    known_size_mm: number;
    measured_size_mm: number;
    error_mm: number;
    error_percentage: number;
    pixels_per_mm: number;
    mm_per_pixel: number;
  };
  product: {
    detected: boolean;
    width_mm: number;
    height_mm: number;
    area_cm2: number;
    pixel_width: number;
    pixel_height: number;
    orientation_degrees: number;
  };
  text: {
    detected: boolean;
    reliable: boolean;
    status_message: string;
    regions_count: number;
    regions: Array<{
      region_id: number;
      width_mm: number;
      height_mm: number;
      estimated_char_height_mm: number;
      width_px: number;
      height_px: number;
    }>;
  };
  warnings: string[];
}

export const MetrologyStationView: React.FC = () => {
  const [markerSizeMm, setMarkerSizeMm] = useState<number>(40.0);
  const [markerId, setMarkerId] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<MetrologyReport | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [rectifiedImage, setRectifiedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'annotated' | 'rectified'>('annotated');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-run initial evaluation preset on load
  useEffect(() => {
    executeMeasurement(null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const executeMeasurement = async (fileToUpload: File | null = selectedFile) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (fileToUpload) {
        formData.append('image', fileToUpload);
      }
      formData.append('markerSize', markerSizeMm.toString());
      formData.append('markerId', markerId.toString());

      const res = await fetch('/api/metrology', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process measurement');
      }

      setReport(data.report);
      setAnnotatedImage(data.annotatedImage);
      setRectifiedImage(data.rectifiedImage);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during measurement.');
    } finally {
      setIsLoading(false);
    }
  };

  // Statutory Rule 9 Schedule II minimum font height calculation
  const getStatutoryFontRequirement = (areaCm2: number) => {
    if (areaCm2 <= 50) {
      return { minHeight: 1.0, blownHeight: 1.5, label: 'A ≤ 50 cm²' };
    } else if (areaCm2 <= 100) {
      return { minHeight: 1.5, blownHeight: 2.0, label: '50 cm² < A ≤ 100 cm²' };
    } else if (areaCm2 <= 500) {
      return { minHeight: 2.0, blownHeight: 2.5, label: '100 cm² < A ≤ 500 cm²' };
    } else if (areaCm2 <= 2500) {
      return { minHeight: 4.0, blownHeight: 6.0, label: '500 cm² < A ≤ 2500 cm²' };
    } else {
      return { minHeight: 6.0, blownHeight: 6.0, label: 'A > 2500 cm²' };
    }
  };

  const statReq = report && report.product.detected ? getStatutoryFontRequirement(report.product.area_cm2) : null;
  const primaryCharHeight = report?.text?.regions?.[0]?.estimated_char_height_mm ?? 0;
  const isRule9Compliant = statReq ? primaryCharHeight >= statReq.minHeight : false;

  const downloadReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pakshya_metrology_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Official Government Header Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Physical Metrology Station — Rule 9 & Schedule II</h2>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded border border-amber-400 font-mono">
                  PCR 2011 Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                ArUco planar homography scale reference for automated package dimensioning and statutory numeral height verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-white/10 px-3 py-1.5 rounded text-slate-200 border border-white/10">
              Python OpenCV Engine: <strong className="text-emerald-400">Active</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Configuration and Action Controls */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ArUco Reference Size (mm)
            </label>
            <input
              type="number"
              step="0.1"
              value={markerSizeMm}
              onChange={(e) => setMarkerSizeMm(parseFloat(e.target.value) || 40.0)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a81c1c] font-mono font-bold"
              placeholder="40.0"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Printed marker dimension</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Marker ID
            </label>
            <input
              type="number"
              value={markerId}
              onChange={(e) => setMarkerId(parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a81c1c] font-mono"
              placeholder="0"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Dictionary: DICT_4X4_50</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspection Photo (with ArUco)
            </label>
            <label className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 border border-dashed border-slate-300 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 transition truncate">
              <Upload className="w-3.5 h-3.5 flex-shrink-0 text-[#8b1515]" />
              <span className="truncate">{selectedFile ? selectedFile.name : 'Select or drop image'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => executeMeasurement()}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#07152b] hover:bg-[#0a1f44] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? 'Measuring...' : 'Run Metrology Scan'}</span>
            </button>

            {report && (
              <button
                onClick={downloadReportJson}
                className="px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                title="Download JSON Report"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Analysis Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Image & Rectified Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#8b1515]" />
                <span className="text-xs font-bold text-slate-800">
                  {viewMode === 'annotated' ? 'Calibrated Computer Vision Annotations' : 'Planar Rectified Top-Down View'}
                </span>
              </div>

              {rectifiedImage && (
                <div className="flex items-center bg-slate-200 p-0.5 rounded text-[11px] font-semibold">
                  <button
                    onClick={() => setViewMode('annotated')}
                    className={`px-2.5 py-1 rounded transition ${viewMode === 'annotated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Annotated Feed
                  </button>
                  <button
                    onClick={() => setViewMode('rectified')}
                    className={`px-2.5 py-1 rounded transition ${viewMode === 'rectified' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Rectified Top-Down
                  </button>
                </div>
              )}
            </div>

            <div className="p-2 bg-slate-950 flex items-center justify-center min-h-[420px]">
              {isLoading ? (
                <div className="text-center text-slate-400 space-y-2 py-16">
                  <div className="w-8 h-8 border-2 border-[#a81c1c] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium">Computing planar homography & measuring dimensions...</p>
                </div>
              ) : viewMode === 'annotated' && annotatedImage ? (
                <img
                  src={annotatedImage}
                  alt="Metrology Annotations"
                  className="max-h-[500px] w-auto object-contain rounded border border-slate-800"
                />
              ) : viewMode === 'rectified' && rectifiedImage ? (
                <img
                  src={rectifiedImage}
                  alt="Rectified Top Down"
                  className="max-h-[500px] w-auto object-contain rounded border border-slate-800"
                />
              ) : (
                <div className="text-slate-500 text-xs py-16">No image processed yet.</div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Green: ArUco Reference
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Cyan/Blue: Product Polygon
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Amber: Printed Text Line
              </span>
              <span className="text-slate-400">
                Homography Mode: Planar
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Statutory PCR 2011 Cards & Measurements (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Statutory Rule 9 Verification Banner */}
          {report && report.product.detected && statReq && (
            <div className={`p-4 rounded-lg border-2 shadow-xs ${isRule9Compliant ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950' : 'bg-red-50/70 border-red-400 text-red-950'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full flex-shrink-0 ${isRule9Compliant ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                  {isRule9Compliant ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">
                      Rule 9 Numeral Height: {isRule9Compliant ? 'COMPLIANT' : 'VIOLATION DETECTED'}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Based on packaging PDP Area of <strong>{report.product.area_cm2.toFixed(1)} cm²</strong> ({statReq.label}), PCR 2011 Schedule II mandates minimum numeral font height of <strong>{statReq.minHeight.toFixed(1)} mm</strong>.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-white/80 p-2 rounded border border-slate-200 flex justify-between items-center">
                    <span>Measured Primary Character:</span>
                    <strong className={isRule9Compliant ? 'text-emerald-700' : 'text-red-700'}>
                      {primaryCharHeight.toFixed(2)} mm
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metric Dimensions Summary Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#8b1515]" />
              Product Physical Geometry
            </h4>

            {report && report.product.detected ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Physical Width</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {report.product.width_mm.toFixed(1)} <span className="text-xs font-normal">mm</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Physical Height</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {report.product.height_mm.toFixed(1)} <span className="text-xs font-normal">mm</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">PDP Display Area</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {report.product.area_cm2.toFixed(1)} <span className="text-xs font-normal">cm²</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Planar Angle</span>
                  <span className="text-base font-bold text-slate-700 font-mono">
                    {report.product.orientation_degrees.toFixed(1)}°
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No product detected.</p>
            )}
          </div>

          {/* ArUco Scale Reference Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              ArUco Scale Calibration
            </h4>

            {report && report.marker.detected ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Marker ID:</span>
                  <span className="font-mono font-bold text-slate-800">#{report.marker.marker_id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Known Reference Size:</span>
                  <span className="font-mono text-slate-800">{report.marker.known_size_mm.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Optical Pixel Scale:</span>
                  <span className="font-mono text-slate-800">{report.marker.pixels_per_mm.toFixed(2)} px/mm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Reconstruction Error:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {report.marker.error_mm.toFixed(2)} mm ({report.marker.error_percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-600 italic">ArUco marker not found in current scene.</p>
            )}
          </div>

          {/* Text Measurement Breakdown */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Printed Text Region Measurements
            </h4>

            {report && report.text.detected && report.text.regions.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {report.text.regions.map((reg) => (
                  <div key={reg.region_id} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800">Line #{reg.region_id}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Box: {reg.width_mm.toFixed(1)} x {reg.height_mm.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Est. Char Height</span>
                      <span className="font-mono font-bold text-slate-900">
                        {reg.estimated_char_height_mm.toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                {report?.text?.status_message || 'No text regions detected.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

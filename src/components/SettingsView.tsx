'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  Database, 
  CheckCircle2,
  RefreshCw,
  Info,
  UserCheck
} from 'lucide-react';
import { CURRENT_INSPECTOR } from '@/services/mockData';

export const SettingsView: React.FC = () => {
  const [fastApiEndpoint, setFastApiEndpoint] = useState('http://localhost:8000/api/v1/inspect');
  const [useMockBackend, setUseMockBackend] = useState(true);
  const [ocrEngine, setOcrEngine] = useState('PaddleOCR-v4 + TrOCR-India');
  const [yoloModel, setYoloModel] = useState('YOLOv8x-LegalMetrology-2026');
  const [activeInspectorRole, setActiveInspectorRole] = useState(CURRENT_INSPECTOR.designation);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">System Configuration & ML Backend Architecture</h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400 font-mono">
                  SIH26034 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage AI inference pipeline endpoints, inspector authorizations, and Legal Metrology rule schedules.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-700 text-white px-3 py-1 rounded text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Backend & AI Engine Integration */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Server className="w-4 h-4 text-blue-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Inference & API Gateway (FastAPI / PyTorch)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded border border-blue-200">
              <div>
                <span className="font-bold text-blue-950 block">Built-in Client Mock Service</span>
                <span className="text-[11px] text-blue-800">
                  Simulates YOLOv8, OCR and Rule matching for standalone hackathon demos.
                </span>
              </div>
              <input
                type="checkbox"
                checked={useMockBackend}
                onChange={(e) => setUseMockBackend(e.target.checked)}
                className="w-4 h-4 accent-blue-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Production Backend API URL
              </label>
              <input
                type="text"
                value={fastApiEndpoint}
                onChange={(e) => setFastApiEndpoint(e.target.value)}
                disabled={useMockBackend}
                className="w-full p-2 text-xs font-mono rounded border border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-600 focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-500">
                Plug your live FastAPI / TorchServe model server here when deployed.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Active OCR Detection Architecture
              </label>
              <select
                value={ocrEngine}
                onChange={(e) => setOcrEngine(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="PaddleOCR-v4 + TrOCR-India">PaddleOCR-v4 + TrOCR-India (Multilingual English/Hindi)</option>
                <option value="Tesseract-5-Gov">Tesseract 5 + Custom Font Height Calibrator</option>
                <option value="Google-Cloud-Vision">Google Cloud Vision API (Commercial Fallback)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Label ROI Segmentation Model
              </label>
              <select
                value={yoloModel}
                onChange={(e) => setYoloModel(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="YOLOv8x-LegalMetrology-2026">YOLOv8x-LegalMetrology (9-Class Bounding Model)</option>
                <option value="RT-DETR-Large">RT-DETR Large (Real-Time Transformer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Inspector Authorization & Operational Parameters */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <UserCheck className="w-4 h-4 text-blue-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Inspector Credentials & Statutory Jurisdictions
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Active Officer Profile
              </label>
              <input
                type="text"
                value={`${CURRENT_INSPECTOR.name} (${CURRENT_INSPECTOR.id})`}
                disabled
                className="w-full p-2 bg-slate-100 rounded border border-slate-300 font-bold text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Statutory Role Authority
              </label>
              <select
                value={activeInspectorRole}
                onChange={(e) => setActiveInspectorRole(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="Legal Metrology Officer (Gazetted)">Legal Metrology Officer (Gazetted) — Full Inspection Authority</option>
                <option value="Assistant Controller of Legal Metrology">Assistant Controller of Legal Metrology (Appellate)</option>
                <option value="Laboratory Metrologist (RRSL)">Laboratory Metrologist (RRSL) — Chemical & Optical Verification</option>
                <option value="Directorate Admin (DCA)">Directorate Admin (National Headquarters)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Statutory Ruleset Configured
              </label>
              <div className="p-3 bg-slate-50 rounded border text-xs space-y-1 text-slate-700">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Including Mandatory Unit Sale Price Amendment GSR 779(E) & 2024 Gazette Updates.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#0a1f44] hover:bg-blue-900 text-white rounded text-xs font-bold shadow transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

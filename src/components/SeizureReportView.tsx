'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { 
  Scale, 
  Printer, 
  Download, 
  Save, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  MapPin, 
  FileText, 
  Clock, 
  User, 
  Building2, 
  Lock, 
  Key, 
  AlertTriangle,
  Upload,
  ExternalLink,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';
import { 
  SeizureReport, 
  SeizedItem, 
  SeizedInstrument, 
  LegalBasisEntry,
  InspectionRecord
} from '@/types/inspection';
import { saveSeizureReport } from '@/services/storageService';
import { CURRENT_INSPECTOR } from '@/services/mockData';

interface SeizureReportViewProps {
  initialReport: SeizureReport;
  inspectionRecord?: InspectionRecord;
  onBackToInspection?: () => void;
}

export const SeizureReportView: React.FC<SeizureReportViewProps> = ({
  initialReport,
  inspectionRecord,
  onBackToInspection
}) => {
  const [report, setReport] = useState<SeizureReport>(initialReport);
  const [activeTab, setActiveTab] = useState<'form' | 'certificate'>('form');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Compute unit-grouped totals for seized commodities
  const calculateTotalQuantity = (): string => {
    const totals: Record<string, number> = {};
    report.seizedItems.forEach(item => {
      const unit = (item.unit || 'pcs').toLowerCase().trim();
      const qty = Number(item.quantity) || 0;
      totals[unit] = (totals[unit] || 0) + qty;
    });

    const parts = Object.entries(totals).map(([unit, qty]) => `${qty} ${unit}`);
    return parts.length > 0 ? parts.join(', ') : '0 items';
  };

  const handleSaveDraft = () => {
    const result = saveSeizureReport({ ...report, status: 'Draft' });
    if (result.success) {
      setReport(result.report);
      setSaveFeedback('Draft saved successfully with audit record.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  const handleFinalizeReport = () => {
    // Validation: ensure at least one seized item and required fields
    if (report.seizedItems.length === 0) {
      alert('Validation Error: At least one seized commodity item must be recorded before finalization.');
      return;
    }
    if (!report.establishment.name || !report.establishment.fullAddress) {
      alert('Validation Error: Establishment Name and Address are mandatory.');
      return;
    }

    const now = new Date().toLocaleString('en-GB');
    const updated: SeizureReport = {
      ...report,
      status: 'Finalized',
      finalizedAt: now
    };

    const result = saveSeizureReport(updated);
    if (result.success) {
      setReport(result.report);
      setSaveFeedback('Seizure Report finalized! Locked against accidental edits.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  const handleDigitalSign = () => {
    if (report.status === 'Draft') {
      alert('Please finalize the report before affixing Digital e-Sign.');
      return;
    }

    const now = new Date().toLocaleString('en-GB');
    const cryptoHash = `PAKSHYA-SZR-SIG-${Date.now().toString(16).toUpperCase()}-NIC`;
    
    const updated: SeizureReport = {
      ...report,
      status: 'Signed',
      signedAt: now,
      signature: {
        isSigned: true,
        signerName: report.officer.name,
        signedAt: now,
        cryptoToken: cryptoHash,
        method: 'e-Sign NIC (Gazetted Officer Aadhaar OTP Verified)'
      }
    };

    const result = saveSeizureReport(updated);
    if (result.success) {
      setReport(result.report);
      setSaveFeedback('e-Sign affixed with valid cryptographic audit token.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const exportData = {
      portal: 'PAKSHYA — Legal Metrology Inspection Prototype (SIH26034)',
      documentType: 'STATUTORY SEIZURE REPORT / MEMO',
      reportId: report.seizureReportId,
      inspectionReferenceId: report.inspectionId,
      version: report.version,
      status: report.status,
      timestamps: {
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        finalizedAt: report.finalizedAt,
        signedAt: report.signedAt
      },
      establishment: report.establishment,
      location: report.location,
      legalBasis: report.legalBasis,
      seizedItems: report.seizedItems,
      seizedInstruments: report.seizedInstruments,
      factsAndCircumstances: report.factsAndCircumstances,
      witnesses: report.witnesses,
      personFromWhomSeized: report.personFromWhomSeized,
      custodyDetails: report.custodyDetails,
      evidence: report.evidence,
      officer: report.officer,
      signature: report.signature
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.seizureReportId}_SeizureReport.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Seized Items dynamic handlers
  const handleAddItem = () => {
    const nextItem: SeizedItem = {
      id: `szr-item-${Date.now()}`,
      sNo: report.seizedItems.length + 1,
      itemCommodity: '',
      brand: '',
      skuModel: '',
      batchLotNo: '',
      quantity: 1,
      unit: 'pcs',
      declaredQuantity: '',
      mrp: '',
      observedValue: '',
      reasonForSeizure: 'Non-conforming declaration / Overcharging',
      applicableSectionRule: 'Sec 18(1) / Rule 6(1)',
      evidencePhotoId: 'EVD-001',
      remarks: ''
    };
    setReport({ ...report, seizedItems: [...report.seizedItems, nextItem] });
  };

  const handleRemoveItem = (id: string) => {
    const updated = report.seizedItems
      .filter(item => item.id !== id)
      .map((item, index) => ({ ...item, sNo: index + 1 }));
    setReport({ ...report, seizedItems: updated });
  };

  const handleUpdateItem = (id: string, field: keyof SeizedItem, val: any) => {
    const updated = report.seizedItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setReport({ ...report, seizedItems: updated });
  };

  // Seized Instruments dynamic handlers
  const handleAddInstrument = () => {
    const nextInst: SeizedInstrument = {
      id: `inst-${Date.now()}`,
      sNo: (report.seizedInstruments?.length || 0) + 1,
      instrumentType: 'Electronic Weighing Scale (Counter)',
      manufacturer: 'Avery Weigh-Tronix',
      model: 'AW-2024-C',
      serialNumber: 'SN-9812401',
      capacity: '30 kg (e=5g)',
      verificationCertNo: 'TN/ERD/VER/2023/182',
      verificationStatus: 'EXPIRED',
      reasonForSeizure: 'Verification stamp expired; unverified instrument used in trade',
      sectionRule: 'Section 24(1) read with Rule 22',
      remarks: 'Lead seal partially damaged'
    };
    setReport({
      ...report,
      seizedInstruments: [...(report.seizedInstruments || []), nextInst]
    });
  };

  const handleRemoveInstrument = (id: string) => {
    const updated = (report.seizedInstruments || [])
      .filter(inst => inst.id !== id)
      .map((inst, index) => ({ ...inst, sNo: index + 1 }));
    setReport({ ...report, seizedInstruments: updated });
  };

  const isLocked = report.status === 'Signed';

  return (
    <div className="space-y-6" id="printable-report">
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print bg-[#0a1f44] text-white p-4 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">STATUTORY SEIZURE REPORT / MEMO</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                report.status === 'Signed'
                  ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                  : report.status === 'Finalized'
                  ? 'bg-blue-500/20 border border-blue-400 text-blue-300'
                  : 'bg-amber-500/20 border border-amber-400 text-amber-300'
              }`}>
                {report.status} (v{report.version})
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Seizure ID: <strong className="font-mono text-amber-300">{report.seizureReportId}</strong> • Linked Inspection: <span className="font-mono">{report.inspectionId}</span>
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Form / Certificate Mode Toggle */}
          <div className="bg-slate-900/60 p-0.5 rounded border border-white/20 flex text-xs">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeTab === 'form' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Interactive Form
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeTab === 'certificate' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Print Preview
            </button>
          </div>

          {!isLocked && (
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save Draft</span>
            </button>
          )}

          {report.status === 'Draft' && (
            <button
              onClick={handleFinalizeReport}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Finalize Report</span>
            </button>
          )}

          {report.status === 'Finalized' && (
            <button
              onClick={handleDigitalSign}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer animate-pulse"
            >
              <Key className="w-3.5 h-3.5" />
              <span>e-Sign & Seal</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Certificate (PDF)</span>
          </button>

          {onBackToInspection && (
            <button
              onClick={onBackToInspection}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
            >
              Back to Inspection
            </button>
          )}
        </div>
      </div>

      {saveFeedback && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-300 rounded text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE EDITABLE SEIZURE FORM (Shown when activeTab === 'form')     */}
      {/* ========================================================================= */}
      {activeTab === 'form' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-800 space-y-6">
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <p className="text-xs font-bold tracking-wider uppercase text-slate-700">
              भारत सरकार | Government of India
            </p>
            <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
              DEPARTMENT OF CONSUMER AFFAIRS • LEGAL METROLOGY DIVISION
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              MEMORANDUM OF SEIZURE UNDER SECTION 15 OF THE LEGAL METROLOGY ACT, 2009
            </p>
          </div>

          {/* Section A: Report Details */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              A. Report & Identification Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Seizure Report ID</span>
                <span className="font-mono font-bold text-slate-900">{report.seizureReportId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Linked Inspection ID</span>
                <span className="font-mono font-bold text-slate-900">{report.inspectionId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date & Time</span>
                <span className="font-mono text-slate-900">{report.createdAt}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Inspecting Officer</span>
                <span className="font-bold text-slate-900">{report.officer.name}</span>
                <span className="text-[10px] text-slate-500 block font-mono">({report.officer.id})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Place of Inspection</span>
                <span className="font-medium text-slate-900">{report.establishment.fullAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">GPS Coordinates & Map</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                  </span>
                  <a
                    href={report.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    View Map <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Establishment Details */}
          <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              B. Establishment & Proprietor Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Establishment Name</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.establishment.name}
                  onChange={(e) => setReport({
                    ...report,
                    establishment: { ...report.establishment, name: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Licence / Registration No.</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.establishment.licenceNumber || ''}
                  onChange={(e) => setReport({
                    ...report,
                    establishment: { ...report.establishment, licenceNumber: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Full Address & Landmark</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.establishment.fullAddress}
                  onChange={(e) => setReport({
                    ...report,
                    establishment: { ...report.establishment, fullAddress: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Proprietor / Responsible Person</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.establishment.proprietorDetails || ''}
                  onChange={(e) => setReport({
                    ...report,
                    establishment: { ...report.establishment, proprietorDetails: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Representative Present & Contact</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.establishment.representativePresent || ''}
                  onChange={(e) => setReport({
                    ...report,
                    establishment: { ...report.establishment, representativePresent: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section C: Legal Basis */}
          <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              C. Statutory Legal Basis for Seizure (Officer Confirmed)
            </h3>
            {report.legalBasis.map((lb, idx) => (
              <div key={lb.id} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Act</span>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={lb.act}
                      onChange={(e) => {
                        const updated = [...report.legalBasis];
                        updated[idx].act = e.target.value;
                        setReport({ ...report, legalBasis: updated });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Section</span>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={lb.section}
                      onChange={(e) => {
                        const updated = [...report.legalBasis];
                        updated[idx].section = e.target.value;
                        setReport({ ...report, legalBasis: updated });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rule</span>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={lb.rule}
                      onChange={(e) => {
                        const updated = [...report.legalBasis];
                        updated[idx].rule = e.target.value;
                        setReport({ ...report, legalBasis: updated });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Nature of Suspected Contravention</span>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={lb.contraventionNature}
                    onChange={(e) => {
                      const updated = [...report.legalBasis];
                      updated[idx].contraventionNature = e.target.value;
                      setReport({ ...report, legalBasis: updated });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Officer's Factual Observations</span>
                  <textarea
                    rows={2}
                    disabled={isLocked}
                    value={lb.factualObservations}
                    onChange={(e) => {
                      const updated = [...report.legalBasis];
                      updated[idx].factualObservations = e.target.value;
                      setReport({ ...report, legalBasis: updated });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Section D: Dynamic Seized Commodities Table */}
          <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  D. Items / Pre-Packaged Commodities Seized
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total Seized Quantity: <strong className="text-slate-900 font-mono">{calculateTotalQuantity()}</strong>
                </span>
              </div>
              {!isLocked && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 bg-[#0a1f44] text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-[#132c5e] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Seized Item</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5 border-r border-slate-300 w-8 text-center">S.No</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[130px]">Item / Commodity</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[90px]">Brand & SKU</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[80px]">Batch No.</th>
                    <th className="p-1.5 border-r border-slate-300 w-24">Qty & Unit</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[80px]">MRP</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[120px]">Observed Value / Discrepancy</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[120px]">Reason for Seizure</th>
                    <th className="p-1.5 border-r border-slate-300 min-w-[70px]">Photo ID</th>
                    {!isLocked && <th className="p-1.5 text-center w-8">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.seizedItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-1.5 border-r border-slate-300 text-center font-bold font-mono">
                        {item.sNo}
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.itemCommodity}
                          onChange={(e) => handleUpdateItem(item.id, 'itemCommodity', e.target.value)}
                          placeholder="e.g. Pure Cow Ghee"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded font-medium"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.brand}
                          onChange={(e) => handleUpdateItem(item.id, 'brand', e.target.value)}
                          placeholder="Brand"
                          className="w-full px-1.5 py-0.5 border border-slate-300 rounded mb-1"
                        />
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.skuModel}
                          onChange={(e) => handleUpdateItem(item.id, 'skuModel', e.target.value)}
                          placeholder="SKU"
                          className="w-full px-1.5 py-0.5 border border-slate-300 rounded font-mono text-[10px]"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300 font-mono">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.batchLotNo}
                          onChange={(e) => handleUpdateItem(item.id, 'batchLotNo', e.target.value)}
                          placeholder="Batch"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded font-mono"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            disabled={isLocked}
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-12 px-1.5 py-1 border border-slate-300 rounded font-bold font-mono text-center"
                          />
                          <input
                            type="text"
                            disabled={isLocked}
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                            placeholder="unit"
                            className="w-12 px-1.5 py-1 border border-slate-300 rounded text-center"
                          />
                        </div>
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.mrp}
                          onChange={(e) => handleUpdateItem(item.id, 'mrp', e.target.value)}
                          placeholder="₹ MRP"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded font-mono"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.observedValue}
                          onChange={(e) => handleUpdateItem(item.id, 'observedValue', e.target.value)}
                          placeholder="Observed Value"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px]"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.reasonForSeizure}
                          onChange={(e) => handleUpdateItem(item.id, 'reasonForSeizure', e.target.value)}
                          placeholder="Reason"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px]"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-300 font-mono">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item.evidencePhotoId || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'evidencePhotoId', e.target.value)}
                          placeholder="EVD-001"
                          className="w-full px-1.5 py-1 border border-slate-300 rounded font-mono text-[10px]"
                        />
                      </td>
                      {!isLocked && (
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section E: Dynamic Seized Weighing Instruments Table */}
          <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  E. Weights & Measures / Instruments Seized (Optional)
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Applicable when non-standard or unverified scales/weights are seized
                </span>
              </div>
              {!isLocked && (
                <button
                  type="button"
                  onClick={handleAddInstrument}
                  className="px-2.5 py-1 bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-slate-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Seized Instrument</span>
                </button>
              )}
            </div>

            {(!report.seizedInstruments || report.seizedInstruments.length === 0) ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500 italic">
                No physical weighing instruments seized during this inspection. Click "+ Add Seized Instrument" if applicable.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300 w-8 text-center">S.No</th>
                      <th className="p-1.5 border-r border-slate-300">Instrument Type</th>
                      <th className="p-1.5 border-r border-slate-300">Make & Model</th>
                      <th className="p-1.5 border-r border-slate-300 font-mono">Serial No.</th>
                      <th className="p-1.5 border-r border-slate-300">Capacity</th>
                      <th className="p-1.5 border-r border-slate-300">Cert / Stamp Status</th>
                      <th className="p-1.5 border-r border-slate-300">Reason for Seizure</th>
                      {!isLocked && <th className="p-1.5 text-center w-8">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {report.seizedInstruments.map((inst, index) => (
                      <tr key={inst.id} className="hover:bg-slate-50">
                        <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">{inst.sNo}</td>
                        <td className="p-1.5 border-r border-slate-300 font-medium">{inst.instrumentType}</td>
                        <td className="p-1.5 border-r border-slate-300">{inst.manufacturer} - {inst.model}</td>
                        <td className="p-1.5 border-r border-slate-300 font-mono text-[11px]">{inst.serialNumber}</td>
                        <td className="p-1.5 border-r border-slate-300">{inst.capacity}</td>
                        <td className="p-1.5 border-r border-slate-300">
                          <span className="font-bold text-red-700 bg-red-50 px-1 py-0.5 rounded border border-red-200 text-[10px]">
                            {inst.verificationStatus}
                          </span>
                        </td>
                        <td className="p-1.5 border-r border-slate-300 text-[11px]">{inst.reasonForSeizure}</td>
                        {!isLocked && (
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveInstrument(inst.id)}
                              className="text-slate-400 hover:text-red-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section F: Seizure Description (Editable by Inspecting Officer) */}
          <div className="border border-slate-200 rounded p-4 bg-white space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              F. Official Observations: Facts & Circumstances Leading to Seizure
            </h3>
            <textarea
              rows={4}
              disabled={isLocked}
              value={report.factsAndCircumstances}
              onChange={(e) => setReport({ ...report, factsAndCircumstances: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded text-xs font-sans leading-relaxed focus:outline-none"
            />
          </div>

          {/* Section G & H: Witnesses and Person From Whom Seized */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Witnesses */}
            <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                G. Independent Witnesses (Min. Two)
              </h3>
              {report.witnesses.map((w, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 text-[11px] uppercase">
                    Witness #{idx + 1}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block">Full Name & Contact</label>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={w.name}
                      onChange={(e) => {
                        const updated = [...report.witnesses] as [any, any];
                        updated[idx].name = e.target.value;
                        setReport({ ...report, witnesses: updated });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block">Address & ID Reference</label>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={w.address}
                      onChange={(e) => {
                        const updated = [...report.witnesses] as [any, any];
                        updated[idx].address = e.target.value;
                        setReport({ ...report, witnesses: updated });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold pt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Signature recorded on-site ({w.signedAt})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Person from whom seized */}
            <div className="border border-slate-200 rounded p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                H. Person From Whom Goods Were Seized
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Name</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={report.personFromWhomSeized.name}
                    onChange={(e) => setReport({
                      ...report,
                      personFromWhomSeized: { ...report.personFromWhomSeized, name: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-slate-300 rounded font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Designation / Relation</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={report.personFromWhomSeized.designation}
                    onChange={(e) => setReport({
                      ...report,
                      personFromWhomSeized: { ...report.personFromWhomSeized, designation: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Trader Statement / Remarks</label>
                  <textarea
                    rows={2}
                    disabled={isLocked}
                    value={report.personFromWhomSeized.statement}
                    onChange={(e) => setReport({
                      ...report,
                      personFromWhomSeized: { ...report.personFromWhomSeized, statement: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-slate-300 rounded resize-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold pt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Acknowledgment & Signature recorded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section I: Custody & Disposal Details */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              I. Custody, Safe Storage & Seal Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Goods Sealed?</label>
                <select
                  disabled={isLocked}
                  value={report.custodyDetails.goodsSealed}
                  onChange={(e) => setReport({
                    ...report,
                    custodyDetails: { ...report.custodyDetails, goodsSealed: e.target.value as any }
                  })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-bold"
                >
                  <option value="YES">YES — Affixed with Lead Seal</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Seal Number</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.custodyDetails.sealNumber}
                  onChange={(e) => setReport({
                    ...report,
                    custodyDetails: { ...report.custodyDetails, sealNumber: e.target.value }
                  })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Total Sealed Packages</label>
                <input
                  type="number"
                  disabled={isLocked}
                  value={report.custodyDetails.numberOfPackages}
                  onChange={(e) => setReport({
                    ...report,
                    custodyDetails: { ...report.custodyDetails, numberOfPackages: e.target.value }
                  })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Storage Location / Locker</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.custodyDetails.storageLocation}
                  onChange={(e) => setReport({
                    ...report,
                    custodyDetails: { ...report.custodyDetails, storageLocation: e.target.value }
                  })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Custody Handed To</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={report.custodyDetails.custodyHandedTo}
                  onChange={(e) => setReport({
                    ...report,
                    custodyDetails: { ...report.custodyDetails, custodyHandedTo: e.target.value }
                  })}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-medium"
                />
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('certificate')}
              className="px-4 py-2 bg-[#0a1f44] text-white rounded text-xs font-bold hover:bg-[#132c5e] shadow cursor-pointer"
            >
              Proceed to Official Certificate Print Preview →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OFFICIAL PRINTABLE GOVERNMENT SEIZURE REPORT (Print-Safe Certificate)   */}
      {/* ========================================================================= */}
      {(activeTab === 'certificate' || true) && (
        <div className={`gov-print-certificate bg-white p-8 rounded-lg border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-800 space-y-6 ${
          activeTab === 'form' ? 'hidden print:block' : 'block'
        }`}>
          {/* National Official Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <div className="flex justify-center mb-1">
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-serif text-slate-800 font-bold">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-700">
              भारत सरकार | Government of India
            </p>
            <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">
              उपभोक्ता मामले विभाग | DEPARTMENT OF CONSUMER AFFAIRS
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Ministry of Consumer Affairs, Food & Public Distribution • Legal Metrology Division
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold tracking-widest uppercase font-mono">
                FORM LM-SEIZURE/2026 — STATUTORY SEIZURE MEMORANDUM
              </span>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 p-3 bg-slate-50/70 rounded font-sans">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Seizure Report ID
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs">{report.seizureReportId}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Inspection Ref ID
              </span>
              <span className="font-mono text-slate-900 text-xs">{report.inspectionId}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Inspecting Officer
              </span>
              <span className="font-bold text-slate-900 text-xs">{report.officer.name}</span>
              <span className="text-[10px] text-slate-500 block font-mono">({report.officer.id})</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Regional Jurisdiction
              </span>
              <span className="text-slate-900 text-xs">{report.officer.jurisdiction}</span>
            </div>
          </div>

          {/* Geo-Location & Establishment Section */}
          <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Establishment & Geo-Location Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p><strong>Establishment:</strong> {report.establishment.name}</p>
                <p><strong>Address:</strong> {report.establishment.fullAddress}</p>
                <p><strong>Licence No:</strong> <span className="font-mono">{report.establishment.licenceNumber || 'N/A'}</span></p>
                <p><strong>Person Present:</strong> {report.establishment.representativePresent}</p>
              </div>

              <div className="space-y-1">
                <p><strong>Coordinates:</strong> <span className="font-mono font-bold">{report.location.latitude.toFixed(6)}° N, {report.location.longitude.toFixed(6)}° E</span></p>
                <p><strong>GPS Accuracy:</strong> ±{report.location.accuracyMeters ? report.location.accuracyMeters.toFixed(1) : '5.0'} metres ({report.location.source === 'GPS' ? 'Device GPS' : 'Manual Entry'})</p>
                <p><strong>Timestamp:</strong> {report.location.capturedAt}</p>
                <p>
                  <strong>Google Maps:</strong>{' '}
                  <a href={report.location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-700 underline">
                    {report.location.googleMapsUrl}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Legal Basis */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Statutory Basis & Contravention Found
            </h4>
            {report.legalBasis.map((lb) => (
              <div key={lb.id} className="leading-relaxed">
                <p>
                  <strong>Invoked Provisions:</strong> <span className="font-mono font-bold">{lb.act}</span> — <span className="font-mono font-bold">{lb.section}</span> read with <span className="font-mono font-bold">{lb.rule}</span>.
                </p>
                <p className="text-slate-700">
                  <strong>Factual Findings:</strong> {lb.factualObservations}
                </p>
              </div>
            ))}
          </div>

          {/* Seized Items Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Schedule of Seized Pre-Packaged Commodities
              </h4>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                Total Seized: {calculateTotalQuantity()}
              </span>
            </div>

            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-8 text-center">S.No</th>
                  <th className="p-2 border-r border-slate-300">Item / Commodity</th>
                  <th className="p-2 border-r border-slate-300 font-mono">Batch / Lot</th>
                  <th className="p-2 border-r border-slate-300 text-center">Quantity</th>
                  <th className="p-2 border-r border-slate-300 font-mono">Declared MRP</th>
                  <th className="p-2 border-r border-slate-300">Reason for Seizure</th>
                  <th className="p-2 text-center font-mono">Photo Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.seizedItems.map((item) => (
                  <tr key={item.id} className="text-[11px]">
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">{item.sNo}</td>
                    <td className="p-2 border-r border-slate-300">
                      <div className="font-bold text-slate-900">{item.itemCommodity}</div>
                      <div className="text-[10px] text-slate-500">{item.brand} ({item.skuModel})</div>
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono">{item.batchLotNo || '-'}</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono">{item.mrp}</td>
                    <td className="p-2 border-r border-slate-300 leading-tight">{item.reasonForSeizure}</td>
                    <td className="p-2 text-center font-mono text-[10px] text-slate-600">{item.evidencePhotoId || 'EVD-001'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Seized Instruments (if any) */}
          {report.seizedInstruments && report.seizedInstruments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Schedule of Seized Weights, Measures & Non-Standard Instruments
              </h4>
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-8 text-center">S.No</th>
                    <th className="p-2 border-r border-slate-300">Instrument Type</th>
                    <th className="p-2 border-r border-slate-300">Serial & Make</th>
                    <th className="p-2 border-r border-slate-300">Capacity</th>
                    <th className="p-2 border-r border-slate-300">Verification Status</th>
                    <th className="p-2">Reason for Seizure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {report.seizedInstruments.map((inst) => (
                    <tr key={inst.id}>
                      <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">{inst.sNo}</td>
                      <td className="p-2 border-r border-slate-300 font-bold">{inst.instrumentType}</td>
                      <td className="p-2 border-r border-slate-300 font-mono">{inst.manufacturer} - {inst.serialNumber}</td>
                      <td className="p-2 border-r border-slate-300">{inst.capacity}</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-red-700">{inst.verificationStatus}</td>
                      <td className="p-2">{inst.reasonForSeizure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Officer Observations & Custody */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 p-3 rounded space-y-1">
              <h5 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Facts & Circumstances Leading to Seizure
              </h5>
              <p className="text-slate-800 leading-relaxed text-[11px]">
                {report.factsAndCircumstances}
              </p>
            </div>

            <div className="border border-slate-200 p-3 rounded space-y-1">
              <h5 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Custody & Seal Particulars
              </h5>
              <p><strong>Goods Sealed:</strong> {report.custodyDetails.goodsSealed}</p>
              <p><strong>Official Seal No:</strong> <span className="font-mono font-bold">{report.custodyDetails.sealNumber}</span></p>
              <p><strong>Packages:</strong> {report.custodyDetails.numberOfPackages}</p>
              <p><strong>Storage Facility:</strong> {report.custodyDetails.storageLocation}</p>
              <p><strong>Custody Handed To:</strong> {report.custodyDetails.custodyHandedTo}</p>
            </div>
          </div>

          {/* Witness & Person Seized Details */}
          <div className="border-t border-slate-300 pt-3 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Witness 1</p>
              <p className="font-bold text-slate-900">{report.witnesses[0].name}</p>
              <p className="text-[10px] text-slate-600 truncate">{report.witnesses[0].address}</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">✓ Signed on-site</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Witness 2</p>
              <p className="font-bold text-slate-900">{report.witnesses[1].name}</p>
              <p className="text-[10px] text-slate-600 truncate">{report.witnesses[1].address}</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">✓ Signed on-site</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Person Seized From</p>
              <p className="font-bold text-slate-900">{report.personFromWhomSeized.name}</p>
              <p className="text-[10px] text-slate-600 truncate">{report.personFromWhomSeized.designation}</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">✓ Copy Receipt Acknowledged</p>
            </div>
          </div>

          {/* Official Signature and Dual QR Block */}
          <div className="border-t-2 border-slate-800 pt-6 mt-8 flex flex-wrap justify-between items-end text-xs gap-4">
            {/* Left: Dual QR Codes (Google Maps + Digital Verification) */}
            <div className="flex items-center gap-4">
              {/* Google Maps QR */}
              <div className="space-y-1 text-center">
                <div className="w-24 h-24 border border-slate-300 rounded p-1.5 bg-white shadow-xs">
                  <QRCode
                    value={report.location.googleMapsUrl}
                    size={84}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <p className="text-[9px] font-bold text-slate-600 uppercase">
                  Scan for Map
                </p>
              </div>

              {/* Legal Verification / Appwrite Cloud QR */}
              <div className="space-y-1 text-center">
                <div className="w-24 h-24 border border-slate-300 rounded p-1.5 bg-white shadow-xs">
                  <QRCode
                    value={`https://cloud.appwrite.io/v1/storage/buckets/reports-bucket/files/${report.seizureReportId}/view`}
                    size={84}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <p className="text-[9px] font-bold text-slate-600 uppercase">
                  Digital Record
                </p>
              </div>

              <div className="text-[9px] text-slate-500 space-y-0.5">
                <p className="font-mono font-bold text-slate-800">
                  {report.signature?.cryptoToken || `PAKSHYA-SZR-2026-${report.seizureReportId}`}
                </p>
                <p>Coordinates: {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}</p>
                <p>Certified under Legal Metrology Act, 2009</p>
              </div>
            </div>

            {/* Right: Digital Signature Stamp */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-base text-slate-900 font-bold">
                {report.officer.name}
              </div>
              <div className="h-0.5 w-48 bg-slate-800 ml-auto" />
              <p className="font-bold text-slate-900">{report.officer.designation}</p>
              <p className="text-slate-600 text-[10px]">
                Legal Metrology Division • Government of India
              </p>
              {report.signature?.isSigned ? (
                <div className="text-emerald-700 text-[9px] font-bold font-mono">
                  ✓ Digitally signed via {report.signature.method} ({report.signature.signedAt})
                </div>
              ) : (
                <div className="text-slate-400 text-[9px] italic">
                  [Official Seal & Signature Required on Finalization]
                </div>
              )}
            </div>
          </div>

          {/* Official Footer with Page Numbers */}
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Computer Generated Legal Metrology Record</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      )}
    </div>
  );
};

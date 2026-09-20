'use client';

import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  FileCheck, 
  ShieldAlert, 
  Scale, 
  Calendar, 
  User, 
  Building2, 
  QrCode,
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileSpreadsheet,
  MapPin,
  ExternalLink,
  Plus,
  Save,
  Layers,
  FileText,
  Clock,
  Shield,
  Tag,
  Check,
  Edit3
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { 
  InspectionRecord, 
  InspectionLocation, 
  EstablishmentDetails, 
  SeizureReport, 
  PhotoEvidence 
} from '@/types/inspection';
import { CURRENT_INSPECTOR, SAMPLE_PRODUCTS } from '@/services/mockData';
import { ComplianceBadge } from './ComplianceBadge';
import { OfficialChecklistForm } from './OfficialChecklistForm';
import { PhotoEvidenceSection } from './PhotoEvidenceSection';
import { SeizureReportView } from './SeizureReportView';
import { 
  loadInspectionLocation, 
  saveInspectionLocation,
  loadEstablishmentDetails, 
  getSeizureReportsForInspection, 
  createDefaultSeizureReport,
  saveSeizureReport,
  loadInspectionPhotos
} from '@/services/storageService';
import { useLanguage } from '@/context/LanguageContext';

interface ReportPreviewProps {
  record?: InspectionRecord;
  onClose?: () => void;
}

const STATUTORY_CHECKLIST_DATA = [
  { rule: 'Sec 24(1)', details: 'Whether Weights and Measures in the premises is verified and stamped?', finding: 'YES — Verified & Stamped' },
  { rule: 'Rule 22 of TN L.M. (E) Rules 2011', details: 'Whether Certificate of Verification is exhibited with valid date?', finding: 'YES — Certificate #TN-ERD-2024 displayed' },
  { rule: 'Rule 27 of L.M. P.C. Rules 2011', details: 'Whether Registration Certificate is obtained under Packaged Commodities Rules?', finding: 'YES — Valid Registration Active' },
  { rule: 'Section 18(1) read with Rule 6(1)', details: 'Whether Mandatory Declarations (Net Qty, MRP, Mfg Date, Unit Price) are made?', finding: 'NON-COMPLIANT — Dual MRP & Font Defect Found' },
  { rule: 'Rule 18(2) of L.M. P.C. Rules 2011', details: 'Whether commodities are not sold at a price higher than printed M.R.P.?', finding: 'NON-COMPLIANT — ₹250 charged over ₹200 printed MRP' },
  { rule: 'Rule 18(7) of L.M. P.C. Rules 2011', details: 'Whether Retailer has Electronic Weighing Machine with Consumer Receipt Printer?', finding: 'YES — Electronic Point-of-Sale connected' },
  { rule: 'Section 23 read with Rule 11', details: 'Whether repair or sale of weights & measures carried out by licensed entity?', finding: 'YES — Authorized Dealer' },
  { rule: 'Section 17 read with Rule 13', details: 'Whether statutory inspection records are maintained by dealer?', finding: 'YES — Register Up-to-Date' },
  { rule: 'Section 12', details: 'Whether delivering or receiving specified quantity without unauthorized deficit?', finding: 'COMPLIANT' },
  { rule: 'Rule 21 (4) & (5) of PCR 2011', details: 'Whether standard test weights & test measures are available for verification?', finding: 'YES — 5kg & 10kg Calibrated Weights Present' },
  { rule: 'Section 44', details: 'Whether government seal affixed by authority is genuine and not counterfeited?', finding: 'GENUINE — Official Lead Seal Intact' }
];

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  record = SAMPLE_PRODUCTS['SAMPLE-LABELTRUTH'],
  onClose,
}) => {
  const { t } = useLanguage();
  // Mode: 'unified' (Consolidated Single Document) or 'interactive' (Editor & Form)
  const [viewMode, setViewMode] = useState<'unified' | 'interactive'>('unified');

  // Location and establishment state
  const [location, setLocation] = useState<InspectionLocation>(() => 
    loadInspectionLocation(record.id)
  );
  const [establishment, setEstablishment] = useState<EstablishmentDetails>(() =>
    loadEstablishmentDetails(record.id)
  );

  // Associated Seizure Reports
  const [seizureReports, setSeizureReports] = useState<SeizureReport[]>(() => {
    const existing = getSeizureReportsForInspection(record.id);
    if (existing.length > 0) return existing;
    // Create default seizure report so the consolidated single PDF has the full statutory seizure schedule
    const initial = createDefaultSeizureReport(record.id, loadEstablishmentDetails(record.id), loadInspectionLocation(record.id));
    saveSeizureReport(initial);
    return [initial];
  });

  const [photos, setPhotos] = useState<PhotoEvidence[]>(() => {
    const loaded = loadInspectionPhotos(record.id);
    if (loaded.length > 0) return loaded;
    return [
      {
        id: 'EVD-001',
        category: 'Product Front View (PDP)',
        fileName: 'front_dual_mrp.jpeg',
        url: '/images/front_dual_mrp.jpeg',
        capturedAt: '20/09/2026 11:28:14',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracyMeters: location.accuracyMeters,
        hasGpsMetadata: true,
        officerReferenceId: CURRENT_INSPECTOR.id,
        inspectionReferenceId: record.id,
        description: 'Front promotional panel showing ₹250 sticker overlay.'
      },
      {
        id: 'EVD-002',
        category: 'Product Back View / Legal Panel',
        fileName: 'back_dual_mrp.jpeg',
        url: '/images/back_dual_mrp.jpeg',
        capturedAt: '20/09/2026 11:29:02',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracyMeters: location.accuracyMeters,
        hasGpsMetadata: true,
        officerReferenceId: CURRENT_INSPECTOR.id,
        inspectionReferenceId: record.id,
        description: 'Manufacturer pre-printed legal panel showing ₹200 MRP (Rule 18(2) violation).'
      }
    ];
  });

  const [inspectorNotes, setInspectorNotes] = useState<string>(
    'Representative retail packaged samples inspected on-site. Dual MRP discrepancy verified across Front Promotional Panel (₹250) and Back Pre-printed Legal Panel (₹200). Show-Cause Notice recommended under Legal Metrology Act, 2009 Section 36(1) read with Rule 18(2). Statutory seizure executed under Section 15.'
  );

  const [saveDraftFeedback, setSaveDraftFeedback] = useState<string | null>(null);

  // Sync state if record changes
  useEffect(() => {
    const loc = loadInspectionLocation(record.id);
    const est = loadEstablishmentDetails(record.id);
    const reports = getSeizureReportsForInspection(record.id);
    const savedPhotos = loadInspectionPhotos(record.id);
    setLocation(loc);
    setEstablishment(est);
    if (reports.length > 0) setSeizureReports(reports);
    if (savedPhotos.length > 0) setPhotos(savedPhotos);
  }, [record.id]);

  const activeSeizure = seizureReports[0];

  // Calculate total seized quantity
  const calculateTotalSeized = (): string => {
    if (!activeSeizure || !activeSeizure.seizedItems) return '0 items';
    const totals: Record<string, number> = {};
    activeSeizure.seizedItems.forEach(item => {
      const u = (item.unit || 'pcs').toLowerCase().trim();
      totals[u] = (totals[u] || 0) + (Number(item.quantity) || 0);
    });
    return Object.entries(totals).map(([unit, q]) => `${q} ${unit}`).join(', ') || '0 items';
  };

  const handlePrint = () => {
    // If currently on interactive mode, switch to unified for printing
    if (viewMode !== 'unified') {
      setViewMode('unified');
      setTimeout(() => window.print(), 150);
    } else {
      window.print();
    }
  };

  const handleDownloadJSON = () => {
    const reportData = {
      portal: 'PAKSHYA — Legal Metrology Consolidated Inspection & Seizure Dossier (SIH26034)',
      documentType: 'CONSOLIDATED STATUTORY DOSSIER',
      inspectionId: record.id,
      timestamp: `${record.date} • ${record.timestamp}`,
      inspector: CURRENT_INSPECTOR,
      establishment: {
        ...establishment,
        address: location.shopAddress || establishment.fullAddress
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracyMeters: location.accuracyMeters,
        capturedAt: location.capturedAt,
        source: location.source,
        googleMapsUrl: location.googleMapsUrl,
        landmark: location.landmark,
        district: location.district,
        state: location.state,
        pinCode: location.pinCode
      },
      statutoryChecklist: STATUTORY_CHECKLIST_DATA,
      product: {
        name: record.productName,
        sku: record.sku,
        barcode: record.barcode,
        category: record.category,
      },
      overallStatus: record.overallStatus,
      overallScore: record.overallScore,
      declarations: record.declarations,
      labelTruthFindings: record.labelTruthFindings,
      inspectorComments: inspectorNotes,
      photographicEvidence: photos,
      statutorySeizure: activeSeizure,
      certificationHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.id}_Consolidated_Inspection_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveDraft = () => {
    saveInspectionLocation(record.id, location);
    setSaveDraftFeedback('Consolidated inspection dossier saved to local records.');
    setTimeout(() => setSaveDraftFeedback(null), 3000);
  };

  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a9d93e80009b82fad0f';
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const verificationUrl = `${endpoint}/storage/buckets/reports-bucket/files/${record.id}-pdf/view?project=${projectId}`;

  return (
    <div className="space-y-6" id="printable-report">
      {/* ========================================================================= */}
      {/* TOP ACTION BAR (Hidden during printing)                                   */}
      {/* ========================================================================= */}
      <div className="no-print bg-[#0a1f44] text-white p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              Consolidated Legal Metrology Inspection & Seizure Report Generator
            </h2>
            <p className="text-xs text-slate-300">
              Form LM-INSP-SZR/2026 • Unified Single PDF Dossier • Verification ID: <span className="font-mono text-amber-300">{record.id}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('save_draft', 'Save Draft')}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('export_json', 'Export Dossier (JSON)')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('print_pdf', 'Print Official Certificate (PDF)')}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white cursor-pointer"
              >
                {t('close', 'Close')}
              </button>
            )}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/15 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{t('view_unified', 'Consolidated Dossier (Single PDF View)')}</span>
            </button>

            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('view_interactive', 'Interactive Form & GPS Capture')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All Sections Unified: Location, Checklist, Declarations, Geo-Evidence & Seizure</span>
          </div>
        </div>
      </div>

      {saveDraftFeedback && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-300 rounded text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveDraftFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE FORM (Editable by Officer on field)                   */}
      {/* ========================================================================= */}
      {viewMode === 'interactive' && (
        <div className="space-y-6">
          <OfficialChecklistForm
            inspectionId={record.id}
            establishment={establishment}
            location={location}
            onLocationChange={(newLoc) => setLocation(newLoc)}
          />

          <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-800 space-y-6">
            <PhotoEvidenceSection
              inspectionId={record.id}
              currentLocation={location}
              initialPhotos={photos}
              onPhotosChange={(newP) => setPhotos(newP)}
            />
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setViewMode('unified')}
              className="px-4 py-2 bg-[#0a1f44] text-white rounded text-xs font-bold hover:bg-[#132c5e] shadow cursor-pointer"
            >
              View Consolidated Single PDF Dossier →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CONSOLIDATED OFFICIAL DOSSIER (SINGLE MULTI-PAGE PRINTABLE PDF)   */}
      {/* Always printed during window.print()                                      */}
      {/* ========================================================================= */}
      {(viewMode === 'unified' || true) && (
        <div className={`gov-print-certificate bg-white p-6 sm:p-10 rounded-lg border-2 border-slate-300 shadow-2xl max-w-4xl mx-auto text-slate-800 space-y-6 ${
          viewMode === 'interactive' ? 'hidden print:block' : 'block'
        }`}>
          {/* ===================================================================== */}
          {/* 1. NATIONAL OFFICIAL HEADER                                           */}
          {/* ===================================================================== */}
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
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold tracking-widest uppercase font-mono text-slate-900">
                FORM LM-CONSOLIDATED/2026 — STATUTORY INSPECTION & SEIZURE DOSSIER
              </span>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 p-3 bg-slate-50/80 rounded font-sans">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Inspection Dossier ID</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{record.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Date & Timestamp</span>
              <span className="font-mono text-slate-900 text-xs">{record.date} • {record.timestamp}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Inspecting Officer</span>
              <span className="font-bold text-slate-900 text-xs">{CURRENT_INSPECTOR.name}</span>
              <span className="text-[10px] text-slate-500 block font-mono">({CURRENT_INSPECTOR.id})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Regional Jurisdiction</span>
              <span className="text-slate-900 text-xs">{CURRENT_INSPECTOR.region}</span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. SECTION I: ESTABLISHMENT DETAILS                                   */}
          {/* ===================================================================== */}
          <div className="p-3.5 bg-white border border-slate-300 rounded text-xs space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              Section I: Establishment Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
              <div>
                <p><strong>Establishment Name:</strong> {establishment.name}</p>
                <p><strong>Full Address:</strong> {establishment.fullAddress}</p>
                <p><strong>Establishment No:</strong> <span className="font-mono font-semibold">{establishment.establishmentNo}</span></p>
                <p><strong>Licence / Registration No:</strong> <span className="font-mono font-semibold">{establishment.licenceNumber}</span></p>
              </div>
              <div>
                <p><strong>Nature of Business:</strong> {establishment.natureOfBusiness}</p>
                <p><strong>Proprietor / Responsible Person:</strong> {establishment.proprietorDetails}</p>
                <p><strong>Representative Present:</strong> {establishment.representativePresent}</p>
                <p><strong>Contact Details:</strong> {establishment.contactDetails}</p>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. SECTION II: ESTABLISHMENT LOCATION & GEO-TAG (WITH QR CODE)        */}
          {/* ===================================================================== */}
          <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0a1f44]" />
                Section II: Establishment Location & Geo-Tagging Evidence
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800">
                Source: {location.source === 'GPS' ? 'Verified Device GPS' : 'Manual Entry'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-9 space-y-1">
                <p>
                  <span className="text-slate-500 font-semibold uppercase text-[10px]">Verified Premises Address: </span>
                  <strong className="text-slate-900">{location.shopAddress || establishment.fullAddress}</strong>
                </p>
                <p className="font-mono text-slate-900 text-xs">
                  <span className="text-slate-500 font-sans font-semibold uppercase text-[10px]">Plain-Text Coordinates: </span>
                  <strong>Latitude: {location.latitude.toFixed(6)}° N</strong> | <strong>Longitude: {location.longitude.toFixed(6)}° E</strong>
                </p>
                <p className="text-slate-700">
                  <span className="text-slate-500 font-semibold uppercase text-[10px]">GPS Accuracy: </span>
                  <strong className="font-mono">±{location.accuracyMeters ? location.accuracyMeters.toFixed(1) : '4.8'} metres</strong> • 
                  <span className="text-slate-500 font-semibold uppercase text-[10px] ml-1">Captured Timestamp: </span>
                  <strong className="font-mono">{location.capturedAt}</strong>
                </p>
                <p className="text-slate-700 truncate">
                  <span className="text-slate-500 font-semibold uppercase text-[10px]">Google Maps Link: </span>
                  <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-700 underline text-[11px]">
                    {location.googleMapsUrl}
                  </a>
                </p>
                <p className="text-[10px] text-slate-500 italic pt-0.5">
                  Legal Note: Coordinates verified on-site via W3C Geolocation Datum. Coordinates printed as plain text for offline judicial validity.
                </p>
              </div>

              {/* Scannable Google Maps Location QR Code */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center p-2 bg-white rounded border border-slate-200">
                <div className="w-20 h-20">
                  <QRCode
                    value={location.googleMapsUrl}
                    size={76}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <span className="text-[8px] font-bold text-slate-600 uppercase mt-1 text-center">
                  Scan for Maps Pin
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. SECTION III: STATUTORY LEGAL METROLOGY CHECKLIST                    */}
          {/* ===================================================================== */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Section III: Statutory Compliance Checklist</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">Under Legal Metrology Act, 2009</span>
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-1.5 border-r border-slate-300 w-8 text-center">S.No</th>
                  <th className="p-1.5 border-r border-slate-300 w-44">Section / Statutory Rule</th>
                  <th className="p-1.5 border-r border-slate-300">Verification Details</th>
                  <th className="p-1.5 text-center w-36">Finding / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {STATUTORY_CHECKLIST_DATA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">{idx + 1}</td>
                    <td className="p-1.5 border-r border-slate-300 font-mono text-slate-700 font-semibold">{item.rule}</td>
                    <td className="p-1.5 border-r border-slate-300 leading-tight">{item.details}</td>
                    <td className="p-1.5 text-center font-bold">
                      {item.finding.includes('NON-COMPLIANT') ? (
                        <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 text-[10px] block">
                          {item.finding}
                        </span>
                      ) : (
                        <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px] block">
                          {item.finding}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================================================================== */}
          {/* 5. SECTION IV: PRODUCT IDENTITY & AI MANDATORY DECLARATIONS AUDIT    */}
          {/* ===================================================================== */}
          <div className="space-y-3 page-break-before">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
              <span>Section IV: Tested Commodity & AI Mandatory Declarations Audit (Rule 6)</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">PCR 2011 Schedule II</span>
            </h3>

            {/* Product Identity Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Product Name</span>
                <strong className="text-slate-900">{record.productName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Commodity / SKU</span>
                <span className="text-slate-800">{record.category} ({record.sku})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Barcode / GTIN</span>
                <span className="font-mono text-slate-800 font-bold">{record.barcode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Verification Method</span>
                <span className="text-slate-800">Multi-Angle Optical AI & Physical Metrology</span>
              </div>
            </div>

            {/* Overall Verdict Banner */}
            <div
              className={`p-3.5 rounded-lg border-2 flex items-center justify-between gap-4 ${
                record.overallStatus === 'PASS'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : record.overallStatus === 'FAIL'
                  ? 'bg-red-50 border-red-400 text-red-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Statutory Compliance Determination:
                </span>
                <h4 className="text-base font-black tracking-tight mt-0.5">
                  {record.overallStatus === 'PASS' && 'FULLY COMPLIANT WITH PCR 2011'}
                  {record.overallStatus === 'FAIL' && 'NON-COMPLIANT — STATUTORY VIOLATIONS CONFIRMED'}
                  {record.overallStatus === 'REVIEW' && 'ACTION REQUIRED — EVIDENCE INCONCLUSIVE'}
                </h4>
                <p className="text-[11px] mt-0.5">
                  Evaluated against Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <ComplianceBadge status={record.overallStatus} size="md" />
                <span className="text-[11px] font-mono font-bold block mt-1">
                  Score: {record.overallScore}/100
                </span>
              </div>
            </div>

            {/* Declarations Ledger Table */}
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-1.5 border-r border-slate-300">Mandatory Declaration</th>
                  <th className="p-1.5 border-r border-slate-300">Statutory Rule</th>
                  <th className="p-1.5 border-r border-slate-300">Extracted Value</th>
                  <th className="p-1.5 border-r border-slate-300 text-center">Confidence</th>
                  <th className="p-1.5 text-center">Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {record.declarations.map((d) => (
                  <tr key={d.id}>
                    <td className="p-1.5 border-r border-slate-300 font-medium text-slate-900">{d.field}</td>
                    <td className="p-1.5 border-r border-slate-300 font-mono text-[10px] text-slate-600">{d.pcrRuleClause}</td>
                    <td className="p-1.5 border-r border-slate-300 font-mono text-[10px] text-slate-800">{d.extractedValue}</td>
                    <td className="p-1.5 border-r border-slate-300 text-center font-mono">
                      {d.isManualOverride ? (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
                          Override
                        </span>
                      ) : (
                        `${d.confidence}%`
                      )}
                    </td>
                    <td className="p-1.5 text-center">
                      <ComplianceBadge status={d.status} size="sm" showIcon={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* LabelTruth Finding Section (if present) */}
            {record.labelTruthFindings && record.labelTruthFindings.length > 0 && (
              <div className="p-3 bg-red-50 rounded border border-red-200 text-xs space-y-1.5">
                <h4 className="font-bold text-red-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  LabelTruth™ Cross-View Inconsistency Finding
                </h4>
                {record.labelTruthFindings.map((lt) => (
                  <div key={lt.id} className="space-y-0.5 text-[11px]">
                    <p className="text-red-900">
                      <strong>Conflict Detected:</strong> {lt.field} declared as{' '}
                      <span className="font-mono font-bold text-red-800">{lt.viewA.value}</span> on {lt.viewA.name} and{' '}
                      <span className="font-mono font-bold text-red-800">{lt.viewB.value}</span> on {lt.viewB.name}.
                    </p>
                    <p className="text-slate-700">
                      <strong>Statutory Basis:</strong> {lt.ruleReference} — {lt.legalExplanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Inspecting Officer Formal Observations */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Inspecting Officer Formal Observations & Notice
              </h4>
              <p className="text-slate-800 leading-relaxed text-[11px] font-sans">
                {inspectorNotes}
              </p>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 6. SECTION V: ATTACHED PHOTOGRAPHIC EVIDENCE (GEO-EVIDENCE PLATES)    */}
          {/* ===================================================================== */}
          <div className="space-y-3 page-break-before">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Section V: Attached Photographic Evidence (Proof of Violation)</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">{photos.length} Recorded Plates</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {photos.map((item) => (
                <div key={item.id} className="border border-slate-300 rounded p-2.5 bg-slate-50/70 text-xs space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-slate-200 pb-1">
                    <span className="font-bold text-slate-800">{item.id} • {item.category}</span>
                    <span className="text-slate-500">{item.capturedAt}</span>
                  </div>

                  <div className="h-44 w-full bg-white border border-slate-200 rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.category}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-700 leading-tight"><strong>Description:</strong> {item.description}</p>
                    <p className="font-mono text-[10px] text-emerald-800">
                      <strong>GPS:</strong> {item.latitude ? `${item.latitude.toFixed(4)}°, ${item.longitude?.toFixed(4)}° (±${item.accuracyMeters ? item.accuracyMeters.toFixed(1) : '4.8'}m)` : 'Plain Image'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 7. SECTION VI: STATUTORY SEIZURE MEMORANDUM (FORM LM-SEIZURE/2026)    */}
          {/* ===================================================================== */}
          {activeSeizure && (
            <div className="space-y-4 page-break-before border-t-2 border-slate-800 pt-6">
              <div className="text-center pb-2 border-b border-slate-300">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700 block">
                  STATUTORY SEIZURE MEMORANDUM (FORM LM-SEIZURE/2026)
                </span>
                <h4 className="text-sm font-black uppercase text-slate-900">
                  Section VI: Schedule of Seized Pre-Packaged Commodities & Measuring Instruments
                </h4>
                <p className="text-[10px] text-slate-500">
                  Executed under Section 15 of Legal Metrology Act, 2009 • Seizure Memo ID: <strong className="font-mono text-slate-900">{activeSeizure.seizureReportId}</strong>
                </p>
              </div>

              {/* Legal Basis Invoked */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] block">Legal Basis Invoked by Inspecting Officer:</span>
                {activeSeizure.legalBasis.map((lb) => (
                  <p key={lb.id} className="text-[11px] leading-relaxed">
                    <strong>{lb.act}</strong> — <span className="font-mono font-bold">{lb.section}</span> read with <span className="font-mono font-bold">{lb.rule}</span>. 
                    <span className="text-slate-600 block mt-0.5">{lb.factualObservations}</span>
                  </p>
                ))}
              </div>

              {/* Seized Commodities Schedule */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="uppercase text-slate-900">A. Schedule of Seized Commodities</span>
                  <span className="font-mono text-slate-800">Total Seized Quantity: {calculateTotalSeized()}</span>
                </div>
                <table className="w-full text-xs text-left border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300 w-8 text-center">S.No</th>
                      <th className="p-1.5 border-r border-slate-300">Item / Commodity Description</th>
                      <th className="p-1.5 border-r border-slate-300 font-mono">Batch No.</th>
                      <th className="p-1.5 border-r border-slate-300 text-center">Qty & Unit</th>
                      <th className="p-1.5 border-r border-slate-300 font-mono">Declared MRP</th>
                      <th className="p-1.5 border-r border-slate-300">Observed Value / Defect</th>
                      <th className="p-1.5">Statutory Grounds for Seizure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {activeSeizure.seizedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">{item.sNo}</td>
                        <td className="p-1.5 border-r border-slate-300">
                          <strong className="text-slate-900 block">{item.itemCommodity}</strong>
                          <span className="text-[10px] text-slate-500">{item.brand} ({item.skuModel})</span>
                        </td>
                        <td className="p-1.5 border-r border-slate-300 font-mono text-[10px]">{item.batchLotNo || '-'}</td>
                        <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="p-1.5 border-r border-slate-300 font-mono">{item.mrp}</td>
                        <td className="p-1.5 border-r border-slate-300 text-[10px]">{item.observedValue}</td>
                        <td className="p-1.5 text-[10px]">{item.reasonForSeizure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Custody, Witnesses & Seal Particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border border-slate-200 p-3 rounded bg-slate-50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Witness 1</span>
                  <strong className="text-slate-900 block">{activeSeizure.witnesses[0].name}</strong>
                  <span className="text-[10px] text-slate-600 truncate block">{activeSeizure.witnesses[0].address}</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">✓ Signed on-site</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Witness 2</span>
                  <strong className="text-slate-900 block">{activeSeizure.witnesses[1].name}</strong>
                  <span className="text-[10px] text-slate-600 truncate block">{activeSeizure.witnesses[1].address}</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">✓ Signed on-site</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Official Custody & Seal</span>
                  <p><strong>Goods Sealed:</strong> {activeSeizure.custodyDetails.goodsSealed}</p>
                  <p><strong>Official Seal No:</strong> <span className="font-mono font-bold">{activeSeizure.custodyDetails.sealNumber}</span></p>
                  <p><strong>Safe Storage:</strong> {activeSeizure.custodyDetails.storageLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 8. SECTION VII: OFFICIAL SIGNATURES & VERIFICATION TOKENS             */}
          {/* ===================================================================== */}
          <div className="border-t-2 border-slate-800 pt-6 mt-8 flex flex-wrap justify-between items-end text-xs gap-4">
            {/* Dual QR Codes */}
            <div className="flex items-center gap-4">
              <div className="space-y-1 text-center">
                <div className="w-24 h-24 border border-slate-300 rounded p-1.5 bg-white shadow-xs">
                  <QRCode
                    value={location.googleMapsUrl}
                    size={84}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <p className="text-[8px] font-bold text-slate-600 uppercase">Map Location</p>
              </div>

              <div className="space-y-1 text-center">
                <div className="w-24 h-24 border border-slate-300 rounded p-1.5 bg-white shadow-xs">
                  <QRCode
                    value={verificationUrl}
                    size={84}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <p className="text-[8px] font-bold text-slate-600 uppercase">Appwrite Record</p>
              </div>

              <div className="text-[9px] text-slate-500 space-y-0.5">
                <p className="font-mono font-bold text-slate-800">PAKSHYA-DOSSIER-SIG-2026-X9</p>
                <p>Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                <p>Certified under Section 15 & 18 of LM Act, 2009</p>
                <p className="text-slate-400">Cryptographic audit hash verified</p>
              </div>
            </div>

            {/* Officer Digital Signature Stamp */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-base text-slate-900 font-bold">
                {CURRENT_INSPECTOR.name}
              </div>
              <div className="h-0.5 w-52 bg-slate-800 ml-auto" />
              <p className="font-bold text-slate-900">{CURRENT_INSPECTOR.designation}</p>
              <p className="text-slate-600 text-[10px]">
                Legal Metrology Division • Government of India
              </p>
              <p className="text-emerald-700 text-[9px] font-bold font-mono">
                ✓ Digitally signed via e-Sign NIC ({location.capturedAt})
              </p>
            </div>
          </div>

          {/* National Legal Metrology Footer with Page Numbers */}
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Computer Generated Legal Metrology Record • Form LM-CONSOLIDATED/2026</span>
            <span>Comprehensive Official Dossier (Page 1 of 1)</span>
          </div>
        </div>
      )}
    </div>
  );
};

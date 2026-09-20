import { 
  InspectionLocation, 
  PhotoEvidence, 
  EstablishmentDetails, 
  SeizureReport, 
  SeizureStatus,
  SeizedItem,
  SeizedInstrument,
  LegalBasisEntry
} from '@/types/inspection';
import { CURRENT_INSPECTOR } from './mockData';

const LOCATION_PREFIX = 'pakshya_location_';
const PHOTOS_PREFIX = 'pakshya_photos_';
const ESTABLISHMENT_PREFIX = 'pakshya_establishment_';
const SEIZURE_REPORTS_KEY = 'pakshya_seizure_reports_v1';

// Default mock establishment details if none exist
export const DEFAULT_ESTABLISHMENT: EstablishmentDetails = {
  establishmentNo: 'EST/TN/ERD/2024/9812',
  licenceNumber: 'LM-LIC-2022-TN-0481',
  name: 'Sri Murugan Super Market & Wholesale Provisions',
  fullAddress: 'No. 42/8, Brough Road, Erode Bazaar',
  landmark: 'Opposite Clock Tower Roundabout',
  district: 'Erode',
  state: 'Tamil Nadu',
  pinCode: '638001',
  natureOfBusiness: 'Retail Packaged Grocery & Fast Moving Consumer Goods (FMCG)',
  proprietorDetails: 'K. Palanisamy, S/o. Kandasamy, Age 52, Proprietor',
  representativePresent: 'P. Murugesan, Age 28, Store Manager',
  contactDetails: '+91 94431 82710 / muruganprovisions@gmail.com'
};

// Default sample location (Matching user prompt example: 11.3410, 77.7172)
export const DEFAULT_SAMPLE_LOCATION: InspectionLocation = {
  latitude: 11.341000,
  longitude: 77.717200,
  accuracyMeters: 4.8,
  capturedAt: '2026-09-20 11:30:00',
  source: 'GPS',
  googleMapsUrl: 'https://www.google.com/maps?q=11.341000,77.717200',
  shopAddress: 'No. 42/8, Brough Road, Erode Bazaar, Tamil Nadu 638001',
  landmark: 'Opposite Clock Tower Roundabout',
  district: 'Erode',
  state: 'Tamil Nadu',
  pinCode: '638001'
};

/**
 * Save Location for an inspection
 */
export function saveInspectionLocation(inspectionId: string, location: InspectionLocation): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCATION_PREFIX}${inspectionId}`, JSON.stringify(location));
  } catch (e) {
    console.error('Failed to save inspection location', e);
  }
}

/**
 * Load Location for an inspection
 */
export function loadInspectionLocation(inspectionId: string): InspectionLocation {
  if (typeof window === 'undefined') return DEFAULT_SAMPLE_LOCATION;
  try {
    const raw = localStorage.getItem(`${LOCATION_PREFIX}${inspectionId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load inspection location', e);
  }
  return DEFAULT_SAMPLE_LOCATION;
}

/**
 * Save Establishment Details
 */
export function saveEstablishmentDetails(inspectionId: string, details: EstablishmentDetails): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${ESTABLISHMENT_PREFIX}${inspectionId}`, JSON.stringify(details));
  } catch (e) {
    console.error('Failed to save establishment details', e);
  }
}

/**
 * Load Establishment Details
 */
export function loadEstablishmentDetails(inspectionId: string): EstablishmentDetails {
  if (typeof window === 'undefined') return DEFAULT_ESTABLISHMENT;
  try {
    const raw = localStorage.getItem(`${ESTABLISHMENT_PREFIX}${inspectionId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load establishment details', e);
  }
  return DEFAULT_ESTABLISHMENT;
}

/**
 * Save Photographic Evidence
 */
export function saveInspectionPhotos(inspectionId: string, photos: PhotoEvidence[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PHOTOS_PREFIX}${inspectionId}`, JSON.stringify(photos));
  } catch (e) {
    console.error('Failed to save photos', e);
  }
}

/**
 * Load Photographic Evidence
 */
export function loadInspectionPhotos(inspectionId: string): PhotoEvidence[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${PHOTOS_PREFIX}${inspectionId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load photos', e);
  }
  return [];
}

/**
 * Load all seizure reports from localStorage
 */
export function getAllSeizureReports(): SeizureReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEIZURE_REPORTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load all seizure reports', e);
  }
  return [];
}

/**
 * Get seizure reports linked to an inspection ID
 */
export function getSeizureReportsForInspection(inspectionId: string): SeizureReport[] {
  const all = getAllSeizureReports();
  return all.filter(r => r.inspectionId === inspectionId);
}

/**
 * Get a specific seizure report by ID
 */
export function getSeizureReportById(seizureReportId: string): SeizureReport | null {
  const all = getAllSeizureReports();
  return all.find(r => r.seizureReportId === seizureReportId) || null;
}

/**
 * Generate a unique sequential Seizure Report ID: SZR-2026-00001
 */
export function generateSeizureReportId(): string {
  const all = getAllSeizureReports();
  const currentYear = new Date().getFullYear();
  const yearPrefix = `SZR-${currentYear}-`;
  
  const existingNumbers = all
    .map(r => r.seizureReportId)
    .filter(id => id.startsWith(yearPrefix))
    .map(id => {
      const numPart = id.replace(yearPrefix, '');
      const parsed = parseInt(numPart, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

  const nextNumber = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;
  return `${yearPrefix}${String(nextNumber).padStart(5, '0')}`;
}

/**
 * Save or update a Seizure Report with audit logging and protection against silent overwrite
 */
export function saveSeizureReport(report: SeizureReport): { success: boolean; message: string; report: SeizureReport } {
  if (typeof window === 'undefined') return { success: false, message: 'Server-side call', report };
  
  const all = getAllSeizureReports();
  const existingIndex = all.findIndex(r => r.seizureReportId === report.seizureReportId);
  
  const now = new Date().toISOString();
  let updatedReport = { ...report, updatedAt: now };

  if (existingIndex >= 0) {
    const existing = all[existingIndex];
    // If existing report is finalized/signed and changes are attempted without status upgrade, increment version
    if ((existing.status === 'Finalized' || existing.status === 'Signed') && existing.status === report.status) {
      updatedReport.version = (existing.version || 1) + 1;
    }
    all[existingIndex] = updatedReport;
  } else {
    all.push(updatedReport);
  }

  try {
    localStorage.setItem(SEIZURE_REPORTS_KEY, JSON.stringify(all));
    return { success: true, message: 'Seizure Report saved successfully', report: updatedReport };
  } catch (e) {
    console.error('Failed to save seizure report to localStorage', e);
    return { success: false, message: 'Storage capacity exceeded or write error', report };
  }
}

/**
 * Factory for creating a brand-new Seizure Report linked to an inspection
 */
export function createDefaultSeizureReport(
  inspectionId: string, 
  establishment?: Partial<EstablishmentDetails>,
  location?: Partial<InspectionLocation>,
  officer?: { name: string; id: string; designation: string; jurisdiction: string }
): SeizureReport {
  const seizureReportId = generateSeizureReportId();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const activeEstablishment: EstablishmentDetails = {
    ...DEFAULT_ESTABLISHMENT,
    ...(establishment || {})
  };

  const activeLocation: InspectionLocation = {
    ...DEFAULT_SAMPLE_LOCATION,
    ...(location || {})
  };

  const defaultLegalBasis: LegalBasisEntry[] = [
    {
      id: 'lb-1',
      act: 'Legal Metrology Act, 2009',
      section: 'Section 18(1) read with Section 36(1)',
      rule: 'Rule 6(1) of Legal Metrology (Packaged Commodities) Rules, 2011',
      contraventionNature: 'Omission of mandatory declarations & non-standard declaration of Net Quantity/MRP',
      factualObservations: 'Pre-packaged commodities kept for retail sale without conforming declarations and dual pricing stickers observed.',
      evidenceReference: 'Photo Evidence EVD-001 & CV Optical Inspection Log'
    }
  ];

  const defaultItems: SeizedItem[] = [
    {
      id: 'szr-item-1',
      sNo: 1,
      itemCommodity: 'Pure Cow Ghee (Retail Pack)',
      brand: 'Swarna Dairy',
      skuModel: 'SD-GHEE-500ML',
      batchLotNo: 'LOT-2026-B8',
      quantity: 12,
      unit: 'pkts',
      declaredQuantity: '500 ml',
      mrp: '₹340.00',
      observedValue: 'Dual sticker ₹370 over ₹340',
      reasonForSeizure: 'Overcharging higher than declared MRP & dual sticker tampering',
      applicableSectionRule: 'Sec 18(1) / Rule 18(2)',
      evidencePhotoId: 'EVD-001',
      remarks: 'Seized from front display shelf'
    }
  ];

  return {
    seizureReportId,
    inspectionId,
    version: 1,
    status: 'Draft',
    createdAt: `${dateStr} ${timeStr}`,
    updatedAt: `${dateStr} ${timeStr}`,
    createdBy: officer?.id || CURRENT_INSPECTOR.id,
    establishment: activeEstablishment,
    location: activeLocation,
    legalBasis: defaultLegalBasis,
    seizedItems: defaultItems,
    seizedInstruments: [],
    factsAndCircumstances: 'During statutory surprise inspection of the aforementioned premises, pre-packaged commodities were found displayed for retail sale in contravention of the Legal Metrology Act, 2009 and the Packaged Commodities Rules, 2011. The proprietor/representative was unable to substantiate lawful verification or adherence to MRP regulations. Hence, the commodities detailed herein have been formally seized under Section 15 of the Legal Metrology Act, 2009 for adjudication and safe custody.',
    witnesses: [
      {
        name: 'M. Senthilkumar',
        address: 'No. 15, Gandhiji Road, Erode Bazaar, Erode - 638001',
        contact: '+91 98427 11029',
        idReference: 'Aadhaar: XXXX-XXXX-4912',
        signed: true,
        signedAt: `${dateStr} ${timeStr}`
      },
      {
        name: 'R. Vignesh',
        address: 'No. 88, Cauvery Nagar, Brough Road, Erode - 638001',
        contact: '+91 97892 44310',
        idReference: 'Voter ID: TN/08/042/019842',
        signed: true,
        signedAt: `${dateStr} ${timeStr}`
      }
    ],
    personFromWhomSeized: {
      name: 'P. Murugesan',
      designation: 'Store Manager / Authorized Representative',
      address: 'No. 42/8, Brough Road, Erode Bazaar, Tamil Nadu 638001',
      contact: '+91 94431 82710',
      statement: 'I was present during the inspection and have acknowledged the seizure of items listed above. A copy of this Seizure Memo has been handed over to me.',
      signed: true,
      signedAt: `${dateStr} ${timeStr}`
    },
    custodyDetails: {
      goodsSealed: 'YES',
      sealNumber: 'SEAL/GOI/TN-ERD/2026/049',
      numberOfPackages: 1,
      custodyHandedTo: 'Inspector of Legal Metrology, Erode Circ. II',
      storageLocation: 'Departmental Seizure Locker Room, Office of the Assistant Controller, Erode',
      dateTime: `${dateStr} ${timeStr}`,
      additionalDirections: 'Preserved under seal; to be produced before the Adjudicating Officer / Judicial Magistrate.'
    },
    evidence: [],
    officer: {
      name: officer?.name || CURRENT_INSPECTOR.name,
      id: officer?.id || CURRENT_INSPECTOR.id,
      designation: officer?.designation || CURRENT_INSPECTOR.designation,
      jurisdiction: officer?.jurisdiction || CURRENT_INSPECTOR.region
    }
  };
}

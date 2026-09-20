export type ComplianceStatus = 'PASS' | 'FAIL' | 'REVIEW';

export type CommodityCategory = 
  | 'Food & Beverages'
  | 'Edible Oils & Fats'
  | 'Personal Care & Cosmetics'
  | 'Cleaning & Detergents'
  | 'Spices & Condiments'
  | 'Packaged Staples';

export interface BoundingBox {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number;
  height: number;
}

export interface DeclarationItem {
  id: string;
  field: string;
  hindiLabel?: string;
  pcrRuleClause: string;
  extractedValue: string;
  standardRequirement: string;
  confidence: number; // 0 - 100
  status: ComplianceStatus;
  evidenceCrop?: string;
  boundingBox?: BoundingBox;
  viewSource: 'Front View' | 'Back View' | 'Side View' | 'Label Close-up';
  inspectorNote?: string;
  isMandatory: boolean;
  isManualOverride?: boolean;
}

export interface LabelTruthFinding {
  id: string;
  field: string;
  viewA: {
    name: string;
    value: string;
    confidence: number;
    cropUrl?: string;
  };
  viewB: {
    name: string;
    value: string;
    confidence: number;
    cropUrl?: string;
  };
  status: 'INCONSISTENT' | 'CONSISTENT';
  confidence: number;
  ruleReference: string;
  legalExplanation: string;
  recommendedAction: string;
}

export interface FingerprintFieldDiff {
  fieldName: string;
  previousValue: string;
  currentValue: string;
  changeType: 'NO_CHANGE' | 'SHRINKFLATION' | 'PRICE_CHANGE' | 'LABEL_REVISED' | 'MANUFACTURER_CHANGE';
  severity: 'INFO' | 'WARNING' | 'ALERT';
  ruleNote: string;
}

export interface ProductFingerprint {
  productId: string;
  productName: string;
  brand: string;
  category: CommodityCategory;
  barcode: string;
  previousInspectionDate: string;
  currentInspectionDate: string;
  diffs: FingerprintFieldDiff[];
  changeDetected: boolean;
  legalAdvisory: string;
}

export interface SpectraFinding {
  id: string;
  zone: string;
  spectralBands: {
    rgbDescription: string;
    uvFluorescence: string; // 365 nm
    nirReflectance: string; // 850 nm
  };
  anomalySignal: string;
  inspectorAdvisory: string;
  disclaimer: string;
}

export interface PCRRule {
  ruleId: string;
  ruleNumber: string;
  title: string;
  version: string;
  applicability: string;
  summary: string;
  fullClauseText: string;
  mandatoryEvidence: string;
  penaltySection: string;
  status: 'Active' | 'Amended (2022)' | 'Mandatory';
}

export interface InspectionLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedAt: string;
  source: 'GPS' | 'Manual';
  googleMapsUrl: string;
  shopAddress?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pinCode?: string;
}

export type PhotoEvidenceCategory =
  | 'Establishment Front View'
  | 'Establishment Name Board'
  | 'Product Front View (PDP)'
  | 'Product Back View / Legal Panel'
  | 'Weighing Instrument'
  | 'Verification/Stamp Plate'
  | 'Violation Evidence'
  | 'Seized Commodity'
  | 'Other Evidence';

export interface PhotoEvidence {
  id: string;
  category: PhotoEvidenceCategory;
  fileName: string;
  url: string;
  capturedAt: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  hasGpsMetadata: boolean;
  officerReferenceId?: string;
  inspectionReferenceId?: string;
  description?: string;
  relatedItemId?: string;
}

export interface EstablishmentDetails {
  establishmentNo?: string;
  licenceNumber?: string;
  name: string;
  fullAddress: string;
  landmark?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  natureOfBusiness?: string;
  proprietorDetails?: string;
  representativePresent?: string;
  contactDetails?: string;
}

export type SeizureStatus = 'Draft' | 'Finalized' | 'Signed';

export interface SeizedItem {
  id: string;
  sNo: number;
  itemCommodity: string;
  brand: string;
  skuModel: string;
  batchLotNo: string;
  quantity: number;
  unit: string;
  declaredQuantity: string;
  mrp: number | string;
  observedValue: string;
  reasonForSeizure: string;
  applicableSectionRule: string;
  evidencePhotoId?: string;
  remarks?: string;
}

export interface SeizedInstrument {
  id: string;
  sNo: number;
  instrumentType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: string;
  verificationCertNo: string;
  verificationStatus: 'VERIFIED' | 'EXPIRED' | 'UNVERIFIED' | 'TAMPERED' | 'NO_STAMP';
  reasonForSeizure: string;
  sectionRule: string;
  remarks?: string;
}

export interface LegalBasisEntry {
  id: string;
  act: string;
  section: string;
  rule: string;
  contraventionNature: string;
  factualObservations: string;
  evidenceReference: string;
}

export interface Witness {
  name: string;
  address: string;
  contact: string;
  idReference?: string;
  signed: boolean;
  signedAt?: string;
}

export interface PersonFromWhomSeized {
  name: string;
  designation: string;
  address: string;
  contact: string;
  statement: string;
  signed: boolean;
  signedAt?: string;
}

export interface CustodyDetails {
  goodsSealed: 'YES' | 'NO';
  sealNumber: string;
  numberOfPackages: number | string;
  custodyHandedTo: string;
  storageLocation: string;
  dateTime: string;
  additionalDirections?: string;
}

export interface SeizureReport {
  seizureReportId: string;
  inspectionId: string;
  version: number;
  status: SeizureStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  finalizedAt?: string;
  signedAt?: string;
  establishment: EstablishmentDetails;
  location: InspectionLocation;
  legalBasis: LegalBasisEntry[];
  seizedItems: SeizedItem[];
  seizedInstruments?: SeizedInstrument[];
  factsAndCircumstances: string;
  witnesses: [Witness, Witness];
  personFromWhomSeized: PersonFromWhomSeized;
  custodyDetails: CustodyDetails;
  evidence: PhotoEvidence[];
  officer: {
    name: string;
    id: string;
    designation: string;
    jurisdiction: string;
  };
  signature?: {
    isSigned: boolean;
    signerName: string;
    signedAt: string;
    cryptoToken: string;
    method: string;
  };
}

export interface InspectionRecord {
  id: string;
  date: string;
  timestamp: string;
  inspectorName: string;
  inspectorId: string;
  inspectorRegion: string;
  productName: string;
  brand: string;
  sku: string;
  barcode: string;
  category: CommodityCategory;
  overallStatus: ComplianceStatus;
  overallScore: number;
  sampleImages: {
    front?: string;
    back?: string;
    side?: string;
    labelCloseUp?: string;
  };
  declarations: DeclarationItem[];
  labelTruthFindings?: LabelTruthFinding[];
  fingerprintDiffs?: FingerprintFieldDiff[];
  spectraFindings?: SpectraFinding[];
  activeInspectionRequired?: boolean;
  uncertainFieldId?: string;
  inspectorRemarks?: string;
  qrVerified?: boolean;
  location?: InspectionLocation;
  establishmentDetails?: EstablishmentDetails;
  evidencePhotos?: PhotoEvidence[];
  seizureReportIds?: string[];
}

export interface InspectorProfile {
  name: string;
  id: string;
  designation: string;
  region: string;
  office: string;
  avatarInitials: string;
  activeInspectionsToday: number;
}


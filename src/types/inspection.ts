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

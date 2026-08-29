export type EvidenceType =
  | "document"
  | "image"
  | "payment"
  | "certificate"
  | "inspection"
  | "gps"
  | "report";

export type EvidenceStatus = "verified" | "review" | "conflict" | "missing";

export interface ProvenanceInfo {
  sourceSystem: string; // e.g. eSAKSHI Ingestion Portal, Mobile Geo-Upload, PFMS Payment Gateway
  uploaderRole: string; // e.g. District Nodal Officer, Assistant Engineer, Agency Auditor
  uploaderId: string;
  uploadedAt: string;
  documentVersion?: string;
  sha256Hash?: string;
  validationRuleApplied?: string;
  aiVerificationModel?: string;
  aiVerificationTimestamp?: string;
}

export interface ExtractedField {
  fieldName: string;
  extractedValue: string | number;
  confidence: number;
  isConsistent: boolean;
  mismatchNote?: string;
}

export interface EvidenceFinding {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  confidence: number;
  modelUsed: string;
}

export interface EvidenceItem {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  type: EvidenceType;
  status: EvidenceStatus;
  milestoneId?: string;
  milestoneName?: string;
  fileUrl?: string;
  fileType?: "pdf" | "jpg" | "png" | "json" | "csv";
  fileSize?: string;
  thumbnailUrl?: string;

  provenance: ProvenanceInfo;
  extractedFields?: ExtractedField[];
  findings?: EvidenceFinding[];

  metadata?: {
    gpsLatitude?: number;
    gpsLongitude?: number;
    gpsAccuracyMeters?: number;
    capturedTimestamp?: string;
    cameraExif?: string;
    paymentTransactionId?: string;
    voucherNumber?: string;
    sanctionOrderNo?: string;
    vendorGst?: string;
    vendorName?: string;
  };

  comparisonTargetId?: string;
  comparisonSimilarityPercent?: number;
  comparisonNotes?: string;

  isSynthetic?: boolean;
}

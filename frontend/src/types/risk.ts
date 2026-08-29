export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskCategory =
  | "financial"
  | "timeline"
  | "duplicate"
  | "document"
  | "visual"
  | "compliance"
  | "graph"
  | "prediction";

export interface RiskReason {
  id: string;
  category: RiskCategory;
  title: string;
  explanation: string;
  scoreContribution: number;
  confidence: number; // 0 to 1 (e.g. 0.85)
  evidenceIds: string[];
  severity: RiskLevel;
  model: string;
  modelVersion: string;
  recommendedAction: string;
  deviations?: {
    label: string;
    expected: string | number;
    actual: string | number;
    delta: string;
  }[];
}

export interface RiskBreakdown {
  financial: number;
  timeline: number;
  duplicate: number;
  document: number;
  visual: number;
  compliance: number;
  graph: number;
  prediction: number;
}

export interface RiskSummary {
  score: number; // 0 to 100
  level: RiskLevel;
  breakdown: RiskBreakdown;
  reasons: RiskReason[];
  primarySignal: string;
  lastAssessedAt: string;
  status: "verified" | "flagged" | "inconclusive" | "unavailable";
}

export interface AnomalyItem {
  id: string;
  projectId: string;
  projectTitle: string;
  district: string;
  state: string;
  category: RiskCategory;
  riskScore: number;
  severity: RiskLevel;
  signalName: string;
  description: string;
  detectedAt: string;
  evidenceIds: string[];
  costImpact?: number;
}

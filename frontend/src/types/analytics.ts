export interface StateMetric {
  state: string;
  totalWorks: number;
  highRiskWorks: number;
  criticalWorks: number;
  totalSanctionedCr: number;
  totalExpenditureCr: number;
  averageRiskScore: number;
  primaryRiskFactor: string;
}

export interface DistrictMetric {
  district: string;
  state: string;
  totalWorks: number;
  highRiskWorks: number;
  criticalWorks: number;
  totalSanctionedLakhs: number;
  totalExpenditureLakhs: number;
  averageRiskScore: number;
  delayedWorksPercent: number;
}

export interface GeographicRiskPoint {
  id: string;
  projectId: string;
  projectTitle: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  category: string;
  district: string;
  state: string;
  sanctionedAmount: number;
  primarySignal: string;
}

export interface NationalAnalytics {
  totalWorksMonitored: number;
  totalSanctionedCr: number;
  totalExpenditureCr: number;
  highRiskCount: number;
  criticalRiskCount: number;
  flaggedValueCr: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  monthlyTrends: {
    month: string;
    screenedWorks: number;
    flaggedAnomalies: number;
    avgRiskScore: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    flaggedCount: number;
    avgRisk: number;
  }[];
}

import { RiskSummary } from "./risk";

export type ProjectStatus =
  | "proposed"
  | "sanctioned"
  | "in_progress"
  | "milestone_delayed"
  | "completed"
  | "under_investigation"
  | "stalled";

export interface Milestone {
  id: string;
  name: string;
  sequence: number;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: "completed" | "delayed" | "in_progress" | "pending";
  budgetAmount: number;
  disbursedAmount: number;
  evidenceIds: string[];
  completionPercentage: number;
  responsibleAgency: string;
}

export interface FinancialBreakdown {
  recommendedAmount: number;
  sanctionedAmount: number;
  committedAmount: number;
  paidDisbursedAmount: number;
  verifiedExpenditureAmount: number;
  unreconciledGap: number;
  costDeviationPercent?: number;
  comparableMedianAmount?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  state: string;
  district: string;
  constituency?: string;
  category: string;
  implementingAgency: string;
  mpName?: string;
  mpHouse?: "Lok Sabha" | "Rajya Sabha";

  financials: FinancialBreakdown;

  financialProgress: number; // e.g. 88%
  physicalProgress: number;  // e.g. 52%
  timelineDelayDays: number; // e.g. 38 days

  plannedStartDate: string;
  plannedCompletionDate: string;
  actualStartDate?: string;
  actualCompletionDate?: string;

  status: ProjectStatus;
  risk: RiskSummary;

  milestones: Milestone[];
  evidenceIds: string[];
  investigationCaseId?: string;
  isSynthetic?: boolean;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    locationName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

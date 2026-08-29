export type CaseStatus =
  | "new"
  | "under_review"
  | "evidence_requested"
  | "escalated"
  | "cleared"
  | "confirmed_irregularity"
  | "closed";

export type CasePriority = "urgent" | "high" | "medium" | "low";

export interface InvestigatorNote {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  linkedEvidenceIds?: string[];
  isInternalOnly?: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  type: "ai_signal" | "status_change" | "note_added" | "evidence_linked" | "assignment";
}

export interface EvidenceChainNode {
  step: "risk" | "signal" | "claim" | "evidence" | "source";
  title: string;
  subtitle: string;
  status: "verified" | "flagged" | "conflict";
  referenceId?: string;
  details?: string;
}

export interface InvestigationCase {
  id: string; // e.g. CASE-2026-00128
  projectId: string;
  projectTitle: string;
  district: string;
  state: string;
  category: string;

  riskScore: number;
  priority: CasePriority;
  status: CaseStatus;

  primaryIssue: string;
  summary: string;

  assignedTo?: {
    name: string;
    role: string;
    department: string;
    email?: string;
  };

  evidenceIds: string[];
  evidenceChain: EvidenceChainNode[];
  notes: InvestigatorNote[];
  activityLogs: ActivityLogItem[];

  targetResolutionDate?: string;
  createdAt: string;
  updatedAt: string;
  isSynthetic?: boolean;
}

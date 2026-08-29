export interface GroundedSource {
  id: string;
  type: "project" | "guideline" | "cag_reference" | "evidence" | "model";
  title: string;
  referenceUrl?: string;
  snippet?: string;
}

export interface CopilotMessage {
  id: string;
  sender: "user" | "sentinel";
  timestamp: string;
  content: string;

  structuredResponse?: {
    summary: string;
    riskSignals?: {
      signal: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
    }[];
    evidenceSources?: GroundedSource[];
    guidelinesCited?: {
      section: string;
      clause: string;
      text: string;
    }[];
    recommendedVerificationSteps?: string[];
  };

  contextProjectId?: string;
  contextCaseId?: string;
}

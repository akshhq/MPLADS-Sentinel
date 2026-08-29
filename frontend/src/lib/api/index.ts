import { Project } from "@/types/project";
import { EvidenceItem } from "@/types/evidence";
import { InvestigationCase, CaseStatus, ActivityLogItem, InvestigatorNote } from "@/types/investigation";
import { NationalAnalytics, StateMetric, DistrictMetric, GeographicRiskPoint } from "@/types/analytics";
import { CopilotMessage, GroundedSource } from "@/types/copilot";
import { GroundDataset } from "@/types/data";

import { MOCK_PROJECTS } from "../mock/projects";
import { MOCK_EVIDENCE } from "../mock/evidence";
import { MOCK_INVESTIGATIONS } from "../mock/investigations";
import { MOCK_NATIONAL_ANALYTICS, MOCK_STATE_METRICS, MOCK_DISTRICT_METRICS, MOCK_GEO_POINTS } from "../mock/analytics";
import { MOCK_DATASETS } from "../mock/datasets";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import { supabase } from "../supabaseClient";

// In-memory fallback state
let investigationsStore = [...MOCK_INVESTIGATIONS];
let projectsStore = [...MOCK_PROJECTS];

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) {
          headers["Authorization"] = `Bearer ${data.session.access_token}`;
          return headers;
        }
      } catch {
        // Ignore session read error
      }
    }
    const demoRole = localStorage.getItem("mplads_demo_role") || "mospi_officer";
    headers["x-demo-role"] = demoRole;
    headers["Authorization"] = `Bearer demo-${demoRole}`;
  }
  return headers;
}

async function fetchFromBackend<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const authHeaders = await getAuthHeaders();

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data !== undefined) {
        return json.data as T;
      }
    }
  } catch {
    // Graceful fallback to in-memory store if backend server is not running
  }
  return null;
}

export const api = {
  // --- Projects ---
  async getProjects(params?: {
    search?: string;
    state?: string;
    district?: string;
    category?: string;
    riskLevel?: string;
    status?: string;
    limit?: number;
  }): Promise<{ projects: Project[]; total: number }> {
    // Try Express backend
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set("search", params.search);
    if (params?.state && params.state !== "all") queryParams.set("state", params.state);
    if (params?.district && params.district !== "all") queryParams.set("district", params.district);
    if (params?.category && params.category !== "all") queryParams.set("category", params.category);
    if (params?.riskLevel && params.riskLevel !== "all") queryParams.set("riskLevel", params.riskLevel);
    if (params?.status && params.status !== "all") queryParams.set("status", params.status);
    if (params?.limit) queryParams.set("limit", String(params.limit));

    const backendProjects = await fetchFromBackend<Project[]>(`/projects?${queryParams.toString()}`);
    if (backendProjects && backendProjects.length > 0) {
      return { projects: backendProjects, total: backendProjects.length };
    }

    // In-memory fallback
    let list = [...projectsStore];
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.implementingAgency.toLowerCase().includes(q)
      );
    }
    if (params?.state && params.state !== "all") {
      list = list.filter((p) => p.state.toLowerCase() === params.state?.toLowerCase());
    }
    if (params?.district && params.district !== "all") {
      list = list.filter((p) => p.district.toLowerCase() === params.district?.toLowerCase());
    }
    if (params?.category && params.category !== "all") {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.riskLevel && params.riskLevel !== "all") {
      list = list.filter((p) => p.risk.level === params.riskLevel);
    }
    if (params?.status && params.status !== "all") {
      list = list.filter((p) => p.status === params.status);
    }
    if (params?.limit) {
      list = list.slice(0, params.limit);
    }
    return { projects: list, total: list.length };
  },

  async getProjectById(id: string): Promise<Project | null> {
    const backendProject = await fetchFromBackend<Project>(`/projects/${id}`);
    if (backendProject) return backendProject;

    const found = projectsStore.find((p) => p.id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  // --- Evidence ---
  async getEvidence(params?: {
    projectId?: string;
    type?: string;
    status?: string;
  }): Promise<EvidenceItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.projectId) queryParams.set("projectId", params.projectId);
    if (params?.type && params.type !== "all") queryParams.set("type", params.type);
    if (params?.status && params.status !== "all") queryParams.set("status", params.status);

    const backendEvidence = await fetchFromBackend<EvidenceItem[]>(`/evidence?${queryParams.toString()}`);
    if (backendEvidence) return backendEvidence;

    let list = [...MOCK_EVIDENCE];
    if (params?.projectId) list = list.filter((e) => e.projectId.toLowerCase() === params.projectId?.toLowerCase());
    if (params?.type && params.type !== "all") list = list.filter((e) => e.type === params.type);
    if (params?.status && params.status !== "all") list = list.filter((e) => e.status === params.status);
    return list;
  },

  async getEvidenceById(id: string): Promise<EvidenceItem | null> {
    const backendItem = await fetchFromBackend<EvidenceItem>(`/evidence/${id}`);
    if (backendItem) return backendItem;

    const found = MOCK_EVIDENCE.find((e) => e.id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  // --- Investigations ---
  async getInvestigations(params?: { status?: string; priority?: string }): Promise<InvestigationCase[]> {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== "all") queryParams.set("status", params.status);
    if (params?.priority && params.priority !== "all") queryParams.set("priority", params.priority);

    const backendCases = await fetchFromBackend<InvestigationCase[]>(`/investigations?${queryParams.toString()}`);
    if (backendCases) return backendCases;

    let list = [...investigationsStore];
    if (params?.status && params.status !== "all") list = list.filter((c) => c.status === params.status);
    if (params?.priority && params.priority !== "all") list = list.filter((c) => c.priority === params.priority);
    return list;
  },

  async getInvestigationById(id: string): Promise<InvestigationCase | null> {
    const backendCase = await fetchFromBackend<InvestigationCase>(`/investigations/${id}`);
    if (backendCase) return backendCase;

    const found = investigationsStore.find((c) => c.id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  async createInvestigation(data: {
    projectId: string;
    primaryIssue: string;
    priority?: "urgent" | "high" | "medium" | "low";
    notes?: string;
  }): Promise<InvestigationCase> {
    const backendCreated = await fetchFromBackend<InvestigationCase>("/investigations", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (backendCreated) {
      investigationsStore.unshift(backendCreated);
      return backendCreated;
    }

    const project = projectsStore.find((p) => p.id === data.projectId) || projectsStore[0];
    const newCaseId = `CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCase: InvestigationCase = {
      id: newCaseId,
      projectId: project.id,
      projectTitle: project.title,
      state: project.state,
      district: project.district,
      category: project.category,
      riskScore: project.risk.score,
      primaryIssue: data.primaryIssue,
      priority: data.priority || "high",
      status: "new",
      summary: `Automated investigation case opened for ${project.id}. Primary flagged reason: ${data.primaryIssue}`,
      assignedTo: {
        name: "Shri Rajesh Verma",
        role: "Senior Audit Officer",
        department: "MoSPI Performance Audit Cell",
        email: "r.verma.audit@gov.in",
      },
      evidenceIds: ["EVD-IMG-001", "EVD-DOC-003"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes
        ? [
            {
              id: `NOTE-${Date.now()}`,
              authorName: "Shri Rajesh Verma",
              authorRole: "Senior Audit Officer",
              content: data.notes,
              createdAt: new Date().toISOString(),
              linkedEvidenceIds: project.risk.reasons.flatMap((r) => r.evidenceIds || []),
            },
          ]
        : [],
      activityLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Auditor Console",
          action: "Case Created",
          details: `Manual investigation initiated with priority ${(data.priority || "high").toUpperCase()}.`,
          type: "status_change",
        },
      ],
      evidenceChain: [
        {
          step: "risk",
          title: "Multi-Source Anomaly Trigger",
          subtitle: `Composite Risk: ${project.risk.score} / 100`,
          status: "flagged",
          details: "Automated surveillance threshold exceeded.",
        },
        {
          step: "signal",
          title: "AI Detection Engine",
          subtitle: data.primaryIssue,
          status: "flagged",
          details: "Correlated risk reasons detected across financial and execution data.",
        },
      ],
    };

    investigationsStore.unshift(newCase);

    // Update project state in-memory
    const pIdx = projectsStore.findIndex((p) => p.id === data.projectId);
    if (pIdx !== -1) {
      projectsStore[pIdx] = { ...projectsStore[pIdx], investigationCaseId: newCaseId };
    }

    return newCase;
  },

  async updateInvestigationStatus(id: string, status: CaseStatus, note?: string): Promise<InvestigationCase | null> {
    const backendUpdated = await fetchFromBackend<InvestigationCase>(`/investigations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    });
    if (backendUpdated) {
      const idx = investigationsStore.findIndex((c) => c.id === id);
      if (idx !== -1) investigationsStore[idx] = backendUpdated;
      return backendUpdated;
    }

    const idx = investigationsStore.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const current = investigationsStore[idx];
    const updatedLogs: ActivityLogItem[] = [
      ...current.activityLogs,
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: "Reviewing Officer",
        action: `Status Updated to ${status.toUpperCase()}`,
        details: note || `Status transitioned to ${status}.`,
        type: "status_change",
      },
    ];

    const updatedNotes: InvestigatorNote[] = note
      ? [
          ...current.notes,
          {
            id: `NOTE-${Date.now()}`,
            authorName: "Reviewing Officer",
            authorRole: "Auditor",
            content: note,
            createdAt: new Date().toISOString(),
          },
        ]
      : current.notes;

    const updated: InvestigationCase = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
      activityLogs: updatedLogs,
      notes: updatedNotes,
    };

    investigationsStore[idx] = updated;
    return updated;
  },

  async addInvestigationNote(id: string, content: string, linkedEvidenceIds?: string[]): Promise<InvestigationCase | null> {
    const backendUpdated = await fetchFromBackend<InvestigationCase>(`/investigations/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ content, linkedEvidenceIds }),
    });
    if (backendUpdated) {
      const idx = investigationsStore.findIndex((c) => c.id === id);
      if (idx !== -1) investigationsStore[idx] = backendUpdated;
      return backendUpdated;
    }

    const idx = investigationsStore.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const current = investigationsStore[idx];
    const newNote: InvestigatorNote = {
      id: `NOTE-${Date.now()}`,
      authorName: "Shri Rajesh Verma",
      authorRole: "Senior Audit Officer",
      content,
      createdAt: new Date().toISOString(),
      linkedEvidenceIds: linkedEvidenceIds || [],
    };

    const updated: InvestigationCase = {
      ...current,
      updatedAt: new Date().toISOString(),
      notes: [...current.notes, newNote],
    };

    investigationsStore[idx] = updated;
    return updated;
  },

  // --- Analytics ---
  async getNationalAnalytics(): Promise<NationalAnalytics> {
    const backendNational = await fetchFromBackend<NationalAnalytics>("/analytics/national");
    if (backendNational) return backendNational;
    return MOCK_NATIONAL_ANALYTICS;
  },

  async getStateMetrics(): Promise<StateMetric[]> {
    const backendStates = await fetchFromBackend<StateMetric[]>("/analytics/states");
    if (backendStates) return backendStates;
    return MOCK_STATE_METRICS;
  },

  async getStateBySlug(stateSlug: string): Promise<StateMetric | null> {
    const backendState = await fetchFromBackend<StateMetric>(`/analytics/states/${stateSlug}`);
    if (backendState) return backendState;

    const formatted = stateSlug.replace(/-/g, " ").toLowerCase();
    return MOCK_STATE_METRICS.find((s) => s.state.toLowerCase() === formatted) || MOCK_STATE_METRICS[0];
  },

  async getDistrictMetrics(): Promise<DistrictMetric[]> {
    const backendDistricts = await fetchFromBackend<DistrictMetric[]>("/analytics/districts");
    if (backendDistricts) return backendDistricts;
    return MOCK_DISTRICT_METRICS;
  },

  async getGeographicRiskPoints(): Promise<GeographicRiskPoint[]> {
    const backendPoints = await fetchFromBackend<GeographicRiskPoint[]>("/analytics/geopoints");
    if (backendPoints) return backendPoints;
    return MOCK_GEO_POINTS;
  },

  // --- Datasets ---
  async getDatasets(): Promise<GroundDataset[]> {
    const backendDatasets = await fetchFromBackend<GroundDataset[]>("/datasets");
    if (backendDatasets) return backendDatasets;
    return MOCK_DATASETS;
  },

  // --- AI Copilot ---
  async queryCopilot(query: string, context?: { projectId?: string; caseId?: string }): Promise<CopilotMessage> {
    const backendCopilot = await fetchFromBackend<CopilotMessage>("/copilot/query", {
      method: "POST",
      body: JSON.stringify({ query, context }),
    });
    if (backendCopilot) return backendCopilot;

    // In-memory fallback
    const q = query.toLowerCase();
    const activeProject = context?.projectId
      ? projectsStore.find((p) => p.id === context.projectId)
      : projectsStore.find((p) => p.id === "MPL-004821");

    let responseSummary = "";
    let riskSignals: { signal: string; severity: "low" | "medium" | "high" | "critical"; description: string }[] = [];
    let evidenceSources: GroundedSource[] = [];
    let guidelinesCited: { section: string; clause: string; text: string }[] = [];
    let recommendedSteps: string[] = [];

    if (q.includes("why") && (q.includes("risk") || q.includes("flagged") || q.includes("mpl-004821"))) {
      responseSummary = `Project ${activeProject?.id} ("${activeProject?.title}") is prioritized as Critical Risk (87/100) due to 5 correlated multi-source anomalies: severe financial/physical progress divergence, perceptual image reuse, RCC structural milestone delay, high spatial duplicate overlap with MPL-004822, and final bill amount exceeding sanctioned ceiling.`;
      riskSignals = [
        {
          signal: "Financial / Physical Progress Divergence (36% Gap)",
          severity: "critical",
          description: "88% funds disbursed (₹30.8 L) while physical progress is only 52% verified.",
        },
        {
          signal: "Computer Vision 99.4% Image Reuse",
          severity: "critical",
          description: "Site foundation photo matches a 2024 archive photo from North West Delhi.",
        },
        {
          signal: "Cross-Document Invoice Inconsistency",
          severity: "high",
          description: "Final bill lists ₹41 L against approved sanction of ₹35 L.",
        },
      ];
      evidenceSources = [
        { id: "EVD-IMG-001", type: "evidence", title: "Foundation Site Photo (Hash Match)" },
        { id: "EVD-PAY-001", type: "evidence", title: "PFMS Treasury Voucher #02" },
        { id: "EVD-DOC-003", type: "evidence", title: "Contractor Bill RA #3" },
      ];
      guidelinesCited = [
        {
          section: "MPLADS Guidelines 2023",
          clause: "Section 3.4",
          text: "Installment releases must strictly correspond to certified physical milestones with geotagged photographic proof.",
        },
        {
          section: "GFR 2017",
          clause: "Rule 130",
          text: "Expenditure cannot exceed administratively sanctioned ceiling without prior approval of Revised Estimates.",
        },
      ];
      recommendedSteps = [
        "Issue physical site inspection order to District Assistant Engineer.",
        "Freeze further Running Account bill disbursements pending audit.",
        "Summon implementing agency DSIIDC for clarification on foundation photo reuse.",
      ];
    } else if (q.includes("spending") || q.includes("progress") || q.includes("80%") || q.includes("50%")) {
      responseSummary = "Found 2 projects where fund disbursement exceeds 80% while physical execution progress is below 50%: (1) MPL-004821 in New Delhi (Disbursed: 88%, Physical: 52%) and (2) MPL-005104 in Varanasi (Disbursed: 92%, Physical: 40%).";
      riskSignals = [
        {
          signal: "Premature Advance Payout Pattern",
          severity: "critical",
          description: "Cumulative ₹72.2 L disbursed across 2 works with unverified field execution.",
        },
      ];
      evidenceSources = [
        { id: "MPL-004821", type: "project", title: "Community Hall at Village Khera" },
        { id: "MPL-005104", type: "project", title: "50 Solar High-Mast Lighting Systems" },
      ];
      recommendedSteps = [
        "Open Digital Project Twin for MPL-004821 and MPL-005104.",
        "Generate formal audit inquiry into advance fund retention by implementing agencies.",
      ];
    } else if (q.includes("duplicate") || q.includes("overlap") || q.includes("village khera")) {
      responseSummary = "Sentinel NLP & Geospatial engine flagged potential scope overlap between MPL-004821 ('Community Hall at Village Khera') and MPL-004822 ('Community Centre at Village Khera Ext'). SBERT semantic similarity is 92.4% with geographic proximity under 450 meters.";
      riskSignals = [
        {
          signal: "Spatial & Scope Duplication Cluster",
          severity: "high",
          description: "Both projects sanctioned in the same financial year under identical implementing agency (DSIIDC).",
        },
      ];
      evidenceSources = [
        { id: "MPL-004821", type: "project", title: "Village Khera Community Hall" },
        { id: "MPL-004822", type: "project", title: "Village Khera Ext Community Centre" },
      ];
      recommendedSteps = [
        "Compare Cadastral Revenue plot numbers.",
        "Verify if two distinct community structures are legitimately required in the same ward.",
      ];
    } else {
      responseSummary = `Based on grounded analysis of ${activeProject?.id || "the monitored works"}, Sentinel evaluated all financial transactions, milestone submissions, document OCR extractions, and perceptual computer vision features. What specific verification aspect or guideline check would you like me to analyze?`;
      recommendedSteps = [
        `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
        "Ask: 'Show projects with spending >80% and progress <50%'",
        "Ask: 'Which vendors are associated with split payment flags?'",
      ];
    }

    return {
      id: `COPILOT-MSG-${Date.now()}`,
      sender: "sentinel",
      timestamp: new Date().toISOString(),
      content: responseSummary,
      structuredResponse: {
        summary: responseSummary,
        riskSignals: riskSignals.length > 0 ? riskSignals : undefined,
        evidenceSources: evidenceSources.length > 0 ? evidenceSources : undefined,
        guidelinesCited: guidelinesCited.length > 0 ? guidelinesCited : undefined,
        recommendedVerificationSteps: recommendedSteps.length > 0 ? recommendedSteps : undefined,
      },
      contextProjectId: activeProject?.id,
    };
  },
};

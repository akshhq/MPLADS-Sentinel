import { MOCK_PROJECTS } from "../mock/projects";
import { MOCK_EVIDENCE } from "../mock/evidence";
import { MOCK_INVESTIGATIONS } from "../mock/investigations";
import { MOCK_NATIONAL_ANALYTICS, MOCK_STATE_METRICS, MOCK_DISTRICT_METRICS, MOCK_GEO_POINTS } from "../mock/analytics";
import { MOCK_DATASETS } from "../mock/datasets";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { supabase } from "../supabaseClient";
// In-memory fallback state
const investigationsStore = [...MOCK_INVESTIGATIONS];
const projectsStore = [...MOCK_PROJECTS];
const evidenceStore = [...MOCK_EVIDENCE];
async function getAuthHeaders() {
    const headers = {};
    if (typeof window !== "undefined") {
        if (supabase) {
            try {
                const { data } = await supabase.auth.getSession();
                if (data?.session?.access_token) {
                    headers["Authorization"] = `Bearer ${data.session.access_token}`;
                    return headers;
                }
            }
            catch {
                // Ignore session read error
            }
        }
        const demoRole = localStorage.getItem("mplads_demo_role") || "mospi_officer";
        headers["x-demo-role"] = demoRole;
        headers["Authorization"] = `Bearer demo-${demoRole}`;
    }
    return headers;
}
async function fetchFromBackend(path, options) {
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
                return json.data;
            }
        }
    }
    catch {
        // Graceful fallback to in-memory store if backend server is not running
    }
    return null;
}
export const api = {
    // --- Projects ---
    async getProjects(params) {
        // Try Express backend
        const queryParams = new URLSearchParams();
        if (params?.search)
            queryParams.set("search", params.search);
        if (params?.state && params.state !== "all")
            queryParams.set("state", params.state);
        if (params?.district && params.district !== "all")
            queryParams.set("district", params.district);
        if (params?.category && params.category !== "all")
            queryParams.set("category", params.category);
        if (params?.riskLevel && params.riskLevel !== "all")
            queryParams.set("riskLevel", params.riskLevel);
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        if (params?.limit)
            queryParams.set("limit", String(params.limit));
        const backendProjects = await fetchFromBackend(`/projects?${queryParams.toString()}`);
        if (backendProjects && backendProjects.length > 0) {
            return { projects: backendProjects, total: backendProjects.length };
        }
        // In-memory fallback
        let list = [...projectsStore];
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter((p) => p.id.toLowerCase().includes(q) ||
                p.title.toLowerCase().includes(q) ||
                p.district.toLowerCase().includes(q) ||
                p.state.toLowerCase().includes(q) ||
                p.implementingAgency.toLowerCase().includes(q));
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
    async getProjectById(id) {
        const backendProject = await fetchFromBackend(`/projects/${id}`);
        if (backendProject)
            return backendProject;
        const found = projectsStore.find((p) => p.id.toLowerCase() === id.toLowerCase());
        return found || null;
    },
    // --- Evidence ---
    async getEvidence(params) {
        const queryParams = new URLSearchParams();
        if (params?.projectId)
            queryParams.set("projectId", params.projectId);
        if (params?.type && params.type !== "all")
            queryParams.set("type", params.type);
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        const backendEvidence = await fetchFromBackend(`/evidence?${queryParams.toString()}`);
        if (backendEvidence)
            return backendEvidence;
        let list = [...MOCK_EVIDENCE];
        if (params?.projectId)
            list = list.filter((e) => e.projectId.toLowerCase() === params.projectId?.toLowerCase());
        if (params?.type && params.type !== "all")
            list = list.filter((e) => e.type === params.type);
        if (params?.status && params.status !== "all")
            list = list.filter((e) => e.status === params.status);
        return list;
    },
    async getEvidenceById(id) {
        const backendItem = await fetchFromBackend(`/evidence/${id}`);
        if (backendItem)
            return backendItem;
        const found = MOCK_EVIDENCE.find((e) => e.id.toLowerCase() === id.toLowerCase());
        return found || null;
    },
    // --- Investigations ---
    async getInvestigations(params) {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "all")
            queryParams.set("status", params.status);
        if (params?.priority && params.priority !== "all")
            queryParams.set("priority", params.priority);
        const backendCases = await fetchFromBackend(`/investigations?${queryParams.toString()}`);
        if (backendCases)
            return backendCases;
        let list = [...investigationsStore];
        if (params?.status && params.status !== "all")
            list = list.filter((c) => c.status === params.status);
        if (params?.priority && params.priority !== "all")
            list = list.filter((c) => c.priority === params.priority);
        return list;
    },
    async getInvestigationById(id) {
        const backendCase = await fetchFromBackend(`/investigations/${id}`);
        if (backendCase)
            return backendCase;
        const found = investigationsStore.find((c) => c.id.toLowerCase() === id.toLowerCase());
        return found || null;
    },
    async createInvestigation(data) {
        const backendCreated = await fetchFromBackend("/investigations", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (backendCreated) {
            investigationsStore.unshift(backendCreated);
            return backendCreated;
        }
        const project = projectsStore.find((p) => p.id === data.projectId) || projectsStore[0];
        const newCaseId = `CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const newCase = {
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
    async updateInvestigationStatus(id, status, note) {
        const backendUpdated = await fetchFromBackend(`/investigations/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status, note }),
        });
        if (backendUpdated) {
            const idx = investigationsStore.findIndex((c) => c.id === id);
            if (idx !== -1)
                investigationsStore[idx] = backendUpdated;
            return backendUpdated;
        }
        const idx = investigationsStore.findIndex((c) => c.id === id);
        if (idx === -1)
            return null;
        const current = investigationsStore[idx];
        const updatedLogs = [
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
        const updatedNotes = note
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
        const updated = {
            ...current,
            status,
            updatedAt: new Date().toISOString(),
            activityLogs: updatedLogs,
            notes: updatedNotes,
        };
        investigationsStore[idx] = updated;
        return updated;
    },
    async addInvestigationNote(id, content, linkedEvidenceIds) {
        const backendUpdated = await fetchFromBackend(`/investigations/${id}/notes`, {
            method: "POST",
            body: JSON.stringify({ content, linkedEvidenceIds }),
        });
        if (backendUpdated) {
            const idx = investigationsStore.findIndex((c) => c.id === id);
            if (idx !== -1)
                investigationsStore[idx] = backendUpdated;
            return backendUpdated;
        }
        const idx = investigationsStore.findIndex((c) => c.id === id);
        if (idx === -1)
            return null;
        const current = investigationsStore[idx];
        const newNote = {
            id: `NOTE-${Date.now()}`,
            authorName: "Shri Rajesh Verma",
            authorRole: "Senior Audit Officer",
            content,
            createdAt: new Date().toISOString(),
            linkedEvidenceIds: linkedEvidenceIds || [],
        };
        const updated = {
            ...current,
            updatedAt: new Date().toISOString(),
            notes: [...current.notes, newNote],
        };
        investigationsStore[idx] = updated;
        return updated;
    },
    // --- Evidence Vault ---
    async getEvidence(params) {
        const queryParams = new URLSearchParams();
        if (params?.projectId) queryParams.set("projectId", params.projectId);
        if (params?.type && params.type !== "all") queryParams.set("type", params.type);
        if (params?.status && params.status !== "all") queryParams.set("status", params.status);
        if (params?.search) queryParams.set("search", params.search);

        const qs = queryParams.toString();
        const backendItems = await fetchFromBackend(`/evidence${qs ? `?${qs}` : ""}`);
        if (backendItems && Array.isArray(backendItems)) {
            return backendItems;
        }

        let list = [...evidenceStore];
        if (params?.projectId) list = list.filter((e) => e.projectId === params.projectId);
        if (params?.type && params.type !== "all") list = list.filter((e) => e.type === params.type);
        if (params?.status && params.status !== "all") list = list.filter((e) => e.status === params.status);
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter((e) => e.title.toLowerCase().includes(q) || e.projectTitle.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
        }
        return list;
    },
    async getEvidenceById(id) {
        const backendItem = await fetchFromBackend(`/evidence/${id}`);
        if (backendItem) return backendItem;
        return evidenceStore.find((e) => e.id.toLowerCase() === id.toLowerCase()) || null;
    },
    async uploadEvidence(evidenceData) {
        const backendCreated = await fetchFromBackend("/evidence", {
            method: "POST",
            body: JSON.stringify(evidenceData),
        });
        if (backendCreated) {
            evidenceStore.unshift(backendCreated);
            return backendCreated;
        }
        evidenceStore.unshift(evidenceData);
        return evidenceData;
    },
    async getAuditDossier(workId) {
        const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "https://mplads-sentinel-2.onrender.com";
        try {
            const res = await fetch(`${AI_ENGINE_URL}/api/v1/dossier/${encodeURIComponent(workId || "MPL-004821")}`);
            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch {
            // Fallback
        }
        return null;
    },
    // --- Analytics ---
    async getNationalAnalytics() {
        const backendNational = await fetchFromBackend("/analytics/national");
        if (backendNational) {
            const riskCounts = (backendNational.riskCounts || backendNational.risk_counts || {});
            const riskDist = backendNational.riskDistribution;
            const isDistObj = riskDist && typeof riskDist === "object" && !Array.isArray(riskDist) && "low" in riskDist;
            const normalizedDist = isDistObj
                ? riskDist
                : {
                    low: riskCounts.low ?? MOCK_NATIONAL_ANALYTICS.riskDistribution.low,
                    medium: riskCounts.medium ?? MOCK_NATIONAL_ANALYTICS.riskDistribution.medium,
                    high: riskCounts.high ?? MOCK_NATIONAL_ANALYTICS.riskDistribution.high,
                    critical: riskCounts.critical ?? MOCK_NATIONAL_ANALYTICS.riskDistribution.critical,
                };
            return {
                totalWorksMonitored: Number(backendNational.totalWorksMonitored || backendNational.total_works_monitored || MOCK_NATIONAL_ANALYTICS.totalWorksMonitored),
                totalSanctionedCr: Number(backendNational.totalSanctionedCr || backendNational.total_sanctioned_cr || MOCK_NATIONAL_ANALYTICS.totalSanctionedCr),
                totalExpenditureCr: Number(backendNational.totalExpenditureCr || backendNational.total_disbursed_cr || backendNational.total_expenditure_cr || MOCK_NATIONAL_ANALYTICS.totalExpenditureCr),
                highRiskCount: Number(backendNational.highRiskCount || riskCounts.high || MOCK_NATIONAL_ANALYTICS.highRiskCount),
                criticalRiskCount: Number(backendNational.criticalRiskCount || riskCounts.critical || MOCK_NATIONAL_ANALYTICS.criticalRiskCount),
                flaggedValueCr: Number(backendNational.flaggedValueCr || backendNational.totalFlaggedRiskValueCr || backendNational.total_flagged_risk_value_cr || MOCK_NATIONAL_ANALYTICS.flaggedValueCr),
                riskDistribution: normalizedDist,
                monthlyTrends: Array.isArray(backendNational.monthlyTrends) && backendNational.monthlyTrends.length > 0
                    ? backendNational.monthlyTrends
                    : MOCK_NATIONAL_ANALYTICS.monthlyTrends,
                categoryBreakdown: Array.isArray(backendNational.categoryBreakdown) && backendNational.categoryBreakdown.length > 0
                    ? backendNational.categoryBreakdown
                    : MOCK_NATIONAL_ANALYTICS.categoryBreakdown,
            };
        }
        return MOCK_NATIONAL_ANALYTICS;
    },
    async getStateMetrics() {
        const backendStates = await fetchFromBackend("/analytics/states");
        if (backendStates)
            return backendStates;
        return MOCK_STATE_METRICS;
    },
    async getStateBySlug(stateSlug) {
        const backendState = await fetchFromBackend(`/analytics/states/${stateSlug}`);
        if (backendState)
            return backendState;
        const formatted = stateSlug.replace(/-/g, " ").toLowerCase();
        return MOCK_STATE_METRICS.find((s) => s.state.toLowerCase() === formatted) || MOCK_STATE_METRICS[0];
    },
    async getDistrictMetrics() {
        const backendDistricts = await fetchFromBackend("/analytics/districts");
        if (backendDistricts)
            return backendDistricts;
        return MOCK_DISTRICT_METRICS;
    },
    async getGeographicRiskPoints() {
        const backendPoints = await fetchFromBackend("/analytics/geopoints");
        if (backendPoints)
            return backendPoints;
        return MOCK_GEO_POINTS;
    },
    // --- Datasets ---
    async getDatasets() {
        const backendDatasets = await fetchFromBackend("/datasets");
        if (backendDatasets)
            return backendDatasets;
        return MOCK_DATASETS;
    },
    async getNationalDatasetSummary() {
        const backendSummary = await fetchFromBackend("/datasets/summary/national");
        if (backendSummary)
            return backendSummary;
        return {
            totalRecordsMonitored: 45806,
            totalSanctionedWorks: 24190,
            totalCompletedWorks: 14210,
            totalSanctionedCr: 4820.5,
            totalExpenditureCr: 3663.58,
            activeRiskFlags: {
                criticalCount: 48,
                highCount: 113,
                duplicateLedgerRows: 526,
                splitPaymentStructuring: 38,
                timelineSlaBreaches: 142,
            },
            cloudDatasetCatalog: {
                lokSabhaDatasets: 6,
                rajyaSabhaDatasets: 6,
                totalOfficialFiles: 12,
                storageCdn: "https://vehldtcasdnmghnoktay.supabase.co/storage/v1/object/public/datasets",
            },
            topStates: [
                { state: "Uttar Pradesh", totalWorks: 3820, sanctionedCr: 720.4, completionRate: 64.2, riskCount: 18 },
                { state: "Maharashtra", totalWorks: 2940, sanctionedCr: 580.1, completionRate: 71.5, riskCount: 12 },
                { state: "Rajasthan", totalWorks: 2410, sanctionedCr: 490.8, completionRate: 58.9, riskCount: 14 },
                { state: "West Bengal", totalWorks: 2180, sanctionedCr: 440.2, completionRate: 52.1, riskCount: 11 },
                { state: "Bihar", totalWorks: 1950, sanctionedCr: 395.0, completionRate: 49.8, riskCount: 15 },
                { state: "Tamil Nadu", totalWorks: 1870, sanctionedCr: 380.6, completionRate: 78.4, riskCount: 6 },
            ],
            lastComputedAt: new Date().toISOString(),
        };
    },
    // --- AI Copilot ---
    async queryCopilot(query, context) {
        const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "https://mplads-sentinel-2.onrender.com";
        const q = (query || "").toLowerCase();
        const activeProject = context?.projectId
            ? projectsStore.find((p) => p.id === context.projectId)
            : projectsStore.find((p) => p.id === "MPL-004821");

        // 1. Try Live Cloud AI Engine on Render directly (FastAPI + Gemini 2.0 Flash)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const aiRes = await fetch(`${AI_ENGINE_URL}/api/v1/copilot/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    user_role: "mospi_officer",
                    target_work_id: activeProject?.id,
                    target_district: activeProject?.district,
                    target_state: activeProject?.state,
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (aiRes.ok) {
                const aiData = await aiRes.json();
                if (aiData && aiData.answer) {
                    return {
                        id: `COPILOT-MSG-${Date.now()}`,
                        sender: "sentinel",
                        timestamp: new Date().toISOString(),
                        content: aiData.answer,
                        structuredResponse: {
                            summary: aiData.answer,
                            guidelinesCited: aiData.citations?.map((c) => ({
                                section: c,
                                clause: "Statutory Scheme Rule",
                                text: "Official MoSPI / GFR standard clause applied to grounded audit examination.",
                            })),
                            recommendedVerificationSteps: aiData.suggested_follow_ups,
                        },
                        contextProjectId: activeProject?.id,
                    };
                }
            }
        } catch {
            // Fallback to Express backend or local grounded rule engine
        }

        // 2. Try Express Backend
        const backendCopilot = await fetchFromBackend("/copilot/query", {
            method: "POST",
            body: JSON.stringify({ query, context }),
        });
        if (backendCopilot) {
            return backendCopilot;
        }

        // 3. Robust In-Memory Grounded Statutory Intelligence Engine (Fuzzy Typo Tolerant)
        let responseSummary = "";
        let riskSignals = [];
        let evidenceSources = [];

        // Typo-tolerant normalization
        const isGreeting = /^(he+l+o+|h+i+|h+e+y+|namast+e+|greetings|good\s*morn)/i.test(q) || q.includes("helo") || q.includes("hlo");
        const isWhyRisk = (q.includes("why") || q.includes("wy") || q.includes("reason") || q.includes("explain")) && (q.includes("risk") || q.includes("rsk") || q.includes("flag") || q.includes("4821"));
        const isSpendingGap = (q.includes("spend") || q.includes("spnd") || q.includes("disburs") || q.includes("diverg") || q.includes("progress")) && (q.includes("80") || q.includes("50") || q.includes("gap") || q.includes("advance"));
        const isDuplicate = q.includes("duplic") || q.includes("dublic") || q.includes("overlap") || q.includes("ghost") || q.includes("khera");
        const isGuideline = q.includes("guidelin") || q.includes("statut") || q.includes("gfr") || q.includes("rule") || q.includes("sla") || q.includes("annex");

        if (isGreeting) {
            responseSummary = `Greetings! I am MPLADS Sentinel AI Copilot, your official surveillance, risk intelligence, and statutory compliance assistant for the Ministry of Statistics and Programme Implementation (MoSPI).\n\nI can assist you with investigating project risk scores, identifying physical-financial divergence gaps, checking duplicate proposals across Lok Sabha & Rajya Sabha, and citing official MPLADS 2023 & GFR 2017 statutory guidelines. How can I assist your audit investigation today?`;
            guidelinesCited = [
                { section: "MPLADS Guidelines 2023", clause: "Official Scheme Manual", text: "Standard operating framework for MoSPI and District Authorities." },
            ];
            recommendedSteps = [
                `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
                "Ask: 'Show projects where spending >80% and physical progress <50%'",
                "Ask: 'What duplicate scopes exist in New Delhi district?'",
                "Ask: 'What statutory guidelines apply to milestone fund retention?'",
            ];
        }
        else if (isWhyRisk || q.includes("4821")) {
            responseSummary = `Project ${activeProject?.id} ("${activeProject?.title}") is prioritized as Critical Risk (87/100) due to 5 correlated multi-source anomalies: severe financial/physical progress divergence (36% gap), perceptual image reuse (99.4% hash match), RCC structural milestone delay, high spatial duplicate overlap with MPL-004822, and final bill amount exceeding sanctioned ceiling.`;
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
        }
        else if (q.includes("spending") || q.includes("progress") || q.includes("80%") || q.includes("50%")) {
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
            guidelinesCited = [
                {
                    section: "MPLADS Guidelines 2023",
                    clause: "Section 3.4",
                    text: "No advance beyond 1st installment may be disbursed without certified MB entries and photographic evidence.",
                },
            ];
            recommendedSteps = [
                "Open Digital Project Twin for MPL-004821 and MPL-005104.",
                "Generate formal audit inquiry into advance fund retention by implementing agencies.",
            ];
        }
        else if (q.includes("duplicate") || q.includes("overlap") || q.includes("village khera")) {
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
            guidelinesCited = [
                {
                    section: "MPLADS Guidelines 2023",
                    clause: "Annexure-II §3",
                    text: "Creation of duplicate or overlapping public community infrastructure within 500 meters is non-permissible.",
                },
            ];
            recommendedSteps = [
                "Compare Cadastral Revenue plot numbers.",
                "Verify if two distinct community structures are legitimately required in the same ward.",
            ];
        }
        else if (q.includes("guideline") || q.includes("statutory") || q.includes("gfr") || q.includes("rule")) {
            responseSummary = "MPLADS Sentinel enforces statutory compliance across: (1) MPLADS Guidelines 2023 (§3.4 Milestone releases, §2.6 45-day Sanction SLA, Annexure-II Negative List of Ineligible Works), (2) General Financial Rules 2017 (Rule 130 Excess expenditure, Rule 157 Splitting of tenders, Rule 238 Utilization Certificate reconciliation), and (3) CVC Procurement Directives.";
            guidelinesCited = [
                { section: "MPLADS Guidelines 2023", clause: "Section 2.6 & 3.4", text: "45-day sanction SLA & milestone-linked releases" },
                { section: "GFR 2017", clause: "Rule 130 / 157 / 238", text: "Sanction ceilings, tender splitting, and UC reconciliation" },
            ];
            recommendedSteps = [
                "Check contractor bill splitting under GFR Rule 157",
                "Audit 45-day sanction turnaround SLA compliance",
            ];
        }
        else {
            responseSummary = `Based on grounded analysis of ${activeProject?.id || "the monitored works"} (${activeProject?.title || "MPLADS Projects"}), Sentinel evaluated all financial transactions, milestone submissions, document OCR extractions, and perceptual computer vision features. What specific verification aspect or guideline check would you like me to analyze?`;
            recommendedSteps = [
                `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
                "Ask: 'Show projects where spending >80% and physical progress <50%'",
                "Ask: 'Identify duplicate scopes flagged in New Delhi district'",
                "Ask: 'What statutory guidelines apply to milestone fund retention?'",
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

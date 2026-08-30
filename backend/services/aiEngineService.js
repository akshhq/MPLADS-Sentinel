/**
 * AI Engine Client Service
 * Bridges Node.js Express backend with the Python AI Engine (Local or Cloud-deployed).
 */

const AI_ENGINE_BASE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";

class AIEngineService {
  static async checkHealth() {
    try {
      const resp = await fetch(`${AI_ENGINE_BASE_URL}/api/v1/health`);
      return await resp.json();
    } catch (e) {
      return { status: "offline", error: e.message };
    }
  }

  static async analyzeWork(workPayload) {
    try {
      const resp = await fetch(`${AI_ENGINE_BASE_URL}/api/v1/analyze-work`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workPayload),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async queryCopilot(queryObj) {
    try {
      const resp = await fetch(`${AI_ENGINE_BASE_URL}/api/v1/copilot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryObj),
      });
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async getVendorGraph(district) {
    try {
      const encoded = encodeURIComponent(district || "New Delhi");
      const resp = await fetch(`${AI_ENGINE_BASE_URL}/api/v1/vendor-graph/${encoded}`);
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static async getDossier(workId) {
    try {
      const resp = await fetch(`${AI_ENGINE_BASE_URL}/api/v1/dossier/${encodeURIComponent(workId)}`);
      return await resp.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = AIEngineService;

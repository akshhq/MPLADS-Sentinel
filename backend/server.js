const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const { isConfigured, SUPABASE_URL } = require("./config/supabase");

// Route imports
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const copilotRoutes = require("./routes/copilotRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const layoutRoutes = require("./routes/layoutRoutes");
const aiEngineRoutes = require("./routes/aiEngineRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  "https://mplads-sentinel-omega.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith(".vercel.app") ||
        normalizedOrigin.includes("mplads-sentinel");

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "MPLADS Sentinel Backend API",
    version: "1.0.0",
    sihProblem: "SIH26102",
    ministry: "Ministry of Statistics and Programme Implementation (MoSPI)",
    database: isConfigured ? "Supabase PostgreSQL (Connected)" : "Supabase Local Engine (Fallback Ready)",
    supabaseUrl: SUPABASE_URL ? SUPABASE_URL.replace(/:\/\/.*@/, "://***@") : "Not configured",
    authProvider: "Supabase Auth + JWT",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/layout", layoutRoutes);
app.use("/api/ai", aiEngineRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Unhandled Error]", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log("=================================================");
  console.log(`🚀 MPLADS Sentinel Express API running on port ${PORT}`);
  console.log(`🗄️ Database: Supabase (${isConfigured ? "Connected" : "Local Mode"})`);
  console.log(`👉 Health Check: http://localhost:${PORT}/api/health`);
  console.log("=================================================");
});

module.exports = app;

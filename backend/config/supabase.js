const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

let supabase = null;
let isConfigured = false;

const isValidSupabaseConfig =
  SUPABASE_URL &&
  SUPABASE_URL.startsWith("http") &&
  !SUPABASE_URL.includes("your-project-id") &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("your-supabase");

if (isValidSupabaseConfig) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    isConfigured = true;
    console.log(`[Supabase] Live client initialized for project URL: ${SUPABASE_URL}`);
  } catch (err) {
    console.error("[Supabase Init Error]", err.message);
  }
} else {
  console.log("[Supabase] Running in local offline mode (fallback data engine active). Connect Supabase in backend/.env when ready.");
}

module.exports = {
  supabase,
  isConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};

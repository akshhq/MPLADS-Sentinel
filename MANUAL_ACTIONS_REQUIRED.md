# 🛠️ MPLADS Sentinel — Manual Actions & External Configuration Guide

> **Purpose:** This document consolidates all manual steps, dashboard actions, cloud configurations, and credentials that require manual action outside the local codebase.
> **Last Updated:** September 2026
> **Estimated Total Time:** ~10–15 minutes

---

## 📋 Quick Action Checklist

| # | Domain | Action | Est. Time | Status |
|---|---|---|---|---|
| **1** | **Supabase API Keys** | Copy the true `service_role` secret key into `backend/.env` | 2 mins | 🔲 Pending |
| **2** | **Supabase Storage** | Create public storage buckets: `datasets` and `evidence` | 3 mins | 🔲 Pending |
| **3** | **Supabase SQL Seeding** | Run `backend/seed_data.sql` in Supabase SQL Editor | 2 mins | 🔲 Pending |
| **4** | **Supabase Auth** | Create 7 official institutional demo users in Supabase Auth | 5 mins | 🔲 Pending |
| **5** | **Cloud Deployment** | Sync Environment Variables on Render & Vercel | 3 mins | 🔲 Pending |

---

## 1. 🔑 Supabase Service Role Secret Key

### Why is this needed?
The backend currently connects using `SUPABASE_ANON_KEY` as a safe fallback because the current value in `SUPABASE_SERVICE_ROLE_KEY` is the base64 **JWT Secret** (from the "JWT Settings" box), which causes administrative operations requiring service-role privileges (such as raw user provisioning, bypassing RLS, or storage bucket admin) to return `Invalid API key`.

### Steps:
1. Open your browser and navigate to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: **`vehldtcasdnmghnoktay`**.
3. In the left sidebar, click **Project Settings** (gear icon at the bottom).
4. Click **API** under Configuration.
5. In the **Project API keys** section, locate the key labeled:
   - **`service_role`** *(secret — reveals service_role secret)*.
   - Click the **Reveal / Copy** button (the key begins with `sb_secret_` or `eyJhbGciOi...`).
6. Open [`backend/.env`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/.env) on your machine.
7. Replace the value of `SUPABASE_SERVICE_ROLE_KEY`:
   ```env
   # Replace this line:
   # SUPABASE_SERVICE_ROLE_KEY=ol3qoQCG/30d+xJ2...
   
   # With your copied service_role key:
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (or sb_secret_...)
   ```
8. Save the file.

---

## 2. 🗄️ Create Supabase Storage Buckets

### Why is this needed?
The AI surveillance engine and evidence vault store and stream binary assets (such as contractor invoices, sanction order PDFs, geotagged site inspection photos, and the 12 official MoSPI CSV datasets). Storage currently returns `[]` because the buckets have not yet been initialized in the Supabase UI.

### Steps:
1. In the [Supabase Dashboard](https://supabase.com/dashboard), select project **`vehldtcasdnmghnoktay`**.
2. In the left sidebar, click **Storage** (bucket icon).
3. Click **New bucket** and create the first bucket:
   - **Name:** `datasets`
   - **Public bucket:** ✅ **Enable (Toggle ON)**
   - **File size limit:** `50 MB`
   - **Allowed MIME types:** `text/csv`, `application/vnd.ms-excel`, `text/plain`
   - Click **Save**.
4. Click **New bucket** again and create the second bucket:
   - **Name:** `evidence`
   - **Public bucket:** ✅ **Enable (Toggle ON)**
   - **File size limit:** `25 MB`
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
   - Click **Save**.

### Verification:
Once created, navigate to Storage in Supabase; you should see both `datasets` and `evidence` listed as Public buckets.

---

## 3. 💾 Seed Baseline Relational Data (1-Click SQL)

### Why is this needed?
While all 10 PostgreSQL tables (`profiles`, `projects`, `evidence`, `investigations`, `datasets`, `state_metrics`, `district_metrics`, `geographic_risk_points`, `national_analytics`, `audit_logs`) are created and active, seeding baseline projects and benchmarks ensures the cloud database contains reference entities immediately.

### Steps:
1. In the [Supabase Dashboard](https://supabase.com/dashboard), click **SQL Editor** (terminal icon in left menu).
2. Click **New Query** (+ button).
3. Open [`backend/seed_data.sql`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/seed_data.sql) in your editor and copy its entire contents.
4. Paste the SQL into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl + Enter`).
6. Verify output message: `Success. No rows returned` or query result table.

---

## 4. 👥 Supabase Auth Demo User Accounts

### Why is this needed?
The application features a strict 7-role Institutional Governance model where public self-registration is permanently disabled. In local demo mode, role switching is supported via personas, but for real cloud Supabase Auth logins (`supabase.auth.signInWithPassword`), the users should exist in Supabase `auth.users`.

### Steps:
1. In the [Supabase Dashboard](https://supabase.com/dashboard), go to **Authentication -> Users**.
2. Click **Add user** -> **Create user** for each of the 7 official roles:

| Email | Recommended Password | Role Assigned | Jurisdiction |
|---|---|---|---|
| `ministry@mpladssentinel.demo` | `Sentinel@2026` | MoSPI Central Officer | All-India Scope |
| `state@mpladssentinel.demo` | `Sentinel@2026` | State Nodal Authority | Rajasthan Statewide |
| `mp@mpladssentinel.demo` | `Sentinel@2026` | Member of Parliament | New Delhi (PC-04) |
| `agency@mpladssentinel.demo` | `Sentinel@2026` | Implementing Agency | JDA / DSIIDC |
| `investigator@mpladssentinel.demo` | `Sentinel@2026` | Vigilance Investigator | Anti-Corruption Branch |
| `field@mpladssentinel.demo` | `Sentinel@2026` | Field Verification Officer | Delhi & Jaipur Divisions |
| `admin@mpladssentinel.demo` | `Sentinel@2026` | Platform System Admin | Full Platform Governance |

3. Make sure **"Auto Confirm User?"** is checked (Toggle ON) so users can sign in immediately without email confirmation.

---

## 5. ☁️ Cloud Deployment Environment Variables (Render & Vercel)

### Render (Backend & Python AI Microservices):
If you have deployed the backend or AI engine on Render, make sure the Environment Variables match your local configuration:

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Select your Backend Web Service (`mplads-sentinel-1`).
3. Click **Environment**:
   - `SUPABASE_URL` = `https://vehldtcasdnmghnoktay.supabase.co`
   - `SUPABASE_ANON_KEY` = *(same as in `backend/.env`)*
   - `SUPABASE_SERVICE_ROLE_KEY` = *(paste the true `service_role` key from Step 1)*
   - `GEMINI_API_KEY` = *(your Google Gemini API key)*
   - `AI_ENGINE_URL` = `https://mplads-sentinel-2.onrender.com`
   - `PORT` = `5000`
4. Click **Save Changes** (Render will trigger a redeploy).

### Vercel (Frontend Web App):
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the `mplads-sentinel` project.
3. Go to **Settings -> Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://mplads-sentinel-1.onrender.com` (or your backend URL)
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://vehldtcasdnmghnoktay.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(your anon key)*
4. If changed, trigger a redeployment under **Deployments -> Redeploy**.

---

## 6. 🌐 Google Gemini API Key (Optional Renewal)

If you need to change or provide a fresh Gemini API key for the Grounded AI Audit Copilot (Module 20):
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Update `GEMINI_API_KEY` in:
   - [`backend/.env`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/.env)
   - [`ai-engine/.env`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/.env)
4. Restart the backend service.

---

### Need Assistance?
All automated software code changes are managed directly within this repository. Whenever you complete any of the above manual actions, you can test the system status using `GET http://localhost:5000/api/health` or check the bottom-left System Activity card on the dashboard!

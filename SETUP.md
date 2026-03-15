# SentinelAI — Setup Guide

---

## Current Status (as of last session)

Everything below is **already done** for the live deployment. This section is a record of where things stand.

### What's working
- [x] Vercel deployment live at `sentinelai-web-app.vercel.app`
- [x] Google OAuth login working
- [x] Supabase auth + database connected
- [x] SentinelAI favicon (replaced Lovable logo)
- [x] Fast loading / splash screen
- [x] Edge functions deployed with `--no-verify-jwt` (see note below)
- [x] `GEMINI_API_KEY` set as Supabase secret

### What to verify tomorrow
- [ ] **Test the Analyze feature** — was hitting Gemini rate limit from debugging calls; should be clear by morning
- [ ] **Test the AI Chat assistant** — no rate limit issue expected, but untested after the fixes

### Key fix applied this session (important context)

The Supabase project uses a **publishable key** (`sb_publishable_...` format) instead of the old JWT-format anon key. The Supabase edge function gateway validates keys as JWTs and was rejecting requests with `401 Invalid JWT` before even reaching the function code.

**Fix:** Both edge functions are deployed with `--no-verify-jwt` so the gateway skips its own JWT check. The functions still do their own auth header check internally.

**If you ever redeploy the edge functions, always use:**
```bash
supabase functions deploy analyze-sms --no-verify-jwt
supabase functions deploy chat-assistant --no-verify-jwt
```

### Other bugs fixed this session
1. `userId` referenced in both edge functions after removing auth code — caused `ReferenceError` crash after every successful Gemini response → fixed
2. Edge function auth was calling `supabase.auth.getClaims()` (doesn't exist in v2) → replaced with header-only check
3. Frontend was using raw `fetch` with manual token management → switched to `supabase.functions.invoke()` which handles auth automatically

---

## Initial Setup (for reference / fresh installs)

This app requires **Supabase** (auth + database) and a **Google Gemini API key** (used by both AI edge functions).

---

### 1. Supabase (Auth + Database)

Your `.env` is already configured with your project credentials. Run the database migrations:

**Install the Supabase CLI** (if you haven't):
```bash
npm install -g supabase
```

**Log in and link the project:**
```bash
supabase login
supabase link --project-ref aropfnepavvqutztpaop
```

**Push the database migrations:**
```bash
supabase db push
```

This creates the `analyses`, `profiles`, and related tables in your Supabase project.

---

### 2. Gemini API Key (Required for AI features)

Both edge functions use Google's Gemini 2.0 Flash model via the Google AI API.

**Set it as a Supabase secret:**
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

Already set. Key is confirmed in `supabase secrets list`.

---

### 3. Deploy the Edge Functions

> **Important:** Always deploy with `--no-verify-jwt` (see "Key fix" above).

```bash
supabase functions deploy analyze-sms --no-verify-jwt
supabase functions deploy chat-assistant --no-verify-jwt
```

**What each function does:**
- `analyze-sms` — Takes an SMS message and sender phone number, calls Gemini to score it for scam/smishing indicators, returns a full risk report.
- `chat-assistant` — Answers user questions about their analysis results using Gemini, with conversation history and multi-language support (English, Hindi, Telugu).

---

### 4. Google OAuth (Optional)

If you want Google sign-in to work:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Set the redirect URI to: `https://aropfnepavvqutztpaop.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**
5. In your Supabase dashboard → **Authentication → Providers → Google**, enable it and paste the credentials
6. Add your app URL to **Authentication → URL Configuration → Redirect URLs**

---

## Quick Reference

| What | Where |
|---|---|
| Supabase project | [supabase.com/dashboard/project/aropfnepavvqutztpaop](https://supabase.com/dashboard/project/aropfnepavvqutztpaop) |
| Vercel deployment | [sentinelai-web-app.vercel.app](https://sentinelai-web-app.vercel.app) |
| Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| Edge function logs | Supabase dashboard → Edge Functions |
| Vercel logs | Vercel dashboard → Deployments |

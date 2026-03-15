# SentinelAI — Setup Guide

This app requires **Supabase** (auth + database) and a **Google Gemini API key** (used by both AI edge functions).

---

## 1. Supabase (Auth + Database)

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

## 2. Gemini API Key (Required for AI features)

Both edge functions use Google's Gemini 2.0 Flash model via the Google AI API.

**Where to get it:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API key → Create API key**
3. Copy the key

**Set it as a Supabase secret:**
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

---

## 3. Deploy the Edge Functions

Both functions are in `supabase/functions/`. Deploy them:

```bash
supabase functions deploy analyze-sms
supabase functions deploy chat-assistant
```

**What each function does:**
- `analyze-sms` — Takes an SMS message and sender phone number, calls Gemini to score it for scam/smishing indicators, returns a full risk report.
- `chat-assistant` — Answers user questions about their analysis results using Gemini, with conversation history and multi-language support (English, Hindi, Telugu).

---

## 4. Google OAuth (Optional)

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
| Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| Edge function logs | Supabase dashboard → Edge Functions |

---

## Checklist

- [ ] `supabase link --project-ref aropfnepavvqutztpaop`
- [ ] `supabase db push`
- [ ] `supabase secrets set GEMINI_API_KEY=...`
- [ ] `supabase functions deploy analyze-sms`
- [ ] `supabase functions deploy chat-assistant`
- [ ] *(Optional)* Google OAuth configured in Supabase dashboard

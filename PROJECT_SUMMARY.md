# SentinelAI — Complete Project Summary

> **Purpose**: This document provides 100% context about the SentinelAI project for any human or AI reader.

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Name** | SentinelAI |
| **Mission** | Empower every Indian to identify and prevent SMS fraud (smishing) through accessible AI technology |
| **Target Audience** | Rural India |
| **Live URL** | https://sentinelai-web.lovable.app |
| **Languages** | English, Hindi (हिंदी), Telugu (తెలుగు) |
| **Repository** | Lovable-managed React project |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui (Radix primitives) |
| **State Management** | React Query (TanStack), React Context (Auth) |
| **Routing** | React Router DOM v6 |
| **Form Validation** | Zod, React Hook Form |
| **Backend** | Lovable Cloud (Supabase) — Database, Auth, Storage, Edge Functions |
| **AI Model** | Google Gemini 3 Flash Preview via Lovable AI Gateway |
| **Font** | Inter (Google Fonts) |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast) |

---

## 3. Design System & Theme

### Colors
- **Primary**: Sky blue — `HSL(199, 89%, 48%)` / `#0EA5E9`
- **Accent**: Coral red — `HSL(0, 84%, 71%)` / `#FF6B6B` — used for urgent actions like "Analyze Now"
- **Light mode background**: Pure white `#FFFFFF`
- **Dark mode background**: AMOLED true black `#000000`

### Gradients
- `bg-gradient-primary` — primary gradient for buttons/cards
- `bg-gradient-hero` — hero section background
- `bg-gradient-cta` — call-to-action sections

### Custom Animations
- `fade-in-up` — entrance animation for content
- `float` — floating effect for decorative elements
- `pulse-slow` — slow pulse for risk score highlight (2s duration)
- `slide-in-right` — slide-in for panels/modals

### Design Tokens
- All colors use CSS custom properties (`--primary`, `--background`, `--foreground`, etc.)
- Custom shadow variables for elevated cards
- Chart-specific color tokens for data visualization
- **Rule**: Never use direct Tailwind colors (`text-white`, `bg-black`) — always use semantic tokens

---

## 4. Authentication

| Aspect | Detail |
|---|---|
| **Providers** | Email/Password + Google OAuth (Lovable Cloud managed) |
| **Email confirmation** | Required (NOT auto-confirmed) |
| **Auth context** | `AuthContext` in `src/contexts/AuthContext.tsx` wraps entire app |
| **Google OAuth** | Uses `lovable.auth.signInWithOAuth('google')` |
| **Protected routes** | `/analyze`, `/history`, `/settings` |
| **Profile auto-creation** | `handle_new_user()` database trigger on `auth.users` INSERT |
| **Trigger hardening** | Input validation, 100-char name limit, SQL injection prevention |

### Auth Flow
1. User signs up via email or Google OAuth
2. Email confirmation sent (email/password only)
3. On confirmed login, `onAuthStateChange` listener updates `AuthContext`
4. `ProtectedRoute` component guards authenticated pages
5. Profile row auto-created in `profiles` table via trigger

---

## 5. Database Schema

### Tables

#### `analyses`
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | No | — | Owner |
| `sender_phone` | text | No | — | Sanitized input |
| `message_content` | text | No | — | SMS text |
| `date_received` | date | No | — | User-provided |
| `time_received` | time | No | — | User-provided |
| `screenshot_url` | text | Yes | — | Signed URL reference |
| `language` | enum (`analysis_language`) | Yes | `'english'` | |
| `risk_score` | integer | Yes | — | 0–100 |
| `risk_level` | enum (`risk_level`) | Yes | — | LOW/MEDIUM/HIGH |
| `verdict` | text | Yes | — | AI-generated verdict |
| `threats` | jsonb | Yes | — | `ThreatIndicator[]` |
| `recommendations` | jsonb | Yes | — | `{ do: string[], dont: string[] }` |
| `sender_analysis` | jsonb | Yes | — | `SenderAnalysis` object |
| `content_analysis` | jsonb | Yes | — | `ContentAnalysis` object |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `profiles`
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | No | — | Unique, references auth user |
| `full_name` | text | Yes | — | From signup metadata |
| `avatar_url` | text | Yes | — | Google profile picture URL |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `user_preferences`
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `user_id` | uuid | No | — | Primary key |
| `default_language` | enum (`analysis_language`) | Yes | `'english'` | |
| `theme` | text | Yes | `'system'` | light/dark/system |
| `email_notifications` | boolean | Yes | `true` | |
| `auto_delete_history` | boolean | Yes | `true` | |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

### Enums
- `analysis_language`: `'english'` | `'hindi'` | `'telugu'`
- `risk_level`: `'LOW'` | `'MEDIUM'` | `'HIGH'`

### Storage Bucket: `screenshots`
- **Visibility**: Private
- **Access**: Signed URLs with 1-hour expiry
- **Max file size**: 5MB
- **Allowed types**: PNG, JPG/JPEG
- **Retention**: 30-day auto-delete policy

---

## 6. RLS Policies

All tables have **Row Level Security enabled**. Every table uses the same pattern:

| Operation | Policy |
|---|---|
| SELECT | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |

Users can only access their own data. No public read access on any table.

---

## 7. Pages & Routes (15 pages)

### Public Routes
| Route | Page Component | Description |
|---|---|---|
| `/` | `Index` | Landing page with hero, features, stats, testimonials, CTA |
| `/auth` | `Auth` | Login/signup form (no navbar/footer) |
| `/demo` | `Demo` | Try analysis without login (3 free demos) |
| `/about` | `About` | Mission, team, story |
| `/help` | `Help` | FAQ and support information |
| `/contact` | `Contact` | Contact form |
| `/privacy` | `Privacy` | Privacy policy |
| `/terms` | `Terms` | Terms of service |
| `/data-security` | `DataSecurity` | Data security practices |

### Protected Routes (require authentication)
| Route | Page Component | Description |
|---|---|---|
| `/analyze` | `Analyze` | SMS analysis form + results |
| `/history` | `History` | Past analysis history |
| `/settings` | `Settings` | User preferences |

### Legacy Redirects
| From | To |
|---|---|
| `/dashboard` | `/analyze` |
| `/faq` | `/help` |

### 404
- Catch-all `NotFound` component for unmatched routes

---

## 8. Page Layouts

### Standard Layout
```
┌──────────────────────────────────┐
│  Navbar (fixed, h-16, shadow)    │
├──────────────────────────────────┤
│                                  │
│  Page Content                    │
│  container mx-auto px-4 py-8    │
│  max-w-2xl or max-w-4xl         │
│                                  │
├──────────────────────────────────┤
│  Footer                         │
└──────────────────────────────────┘
```

### Auth Page Layout
```
┌──────────────────────────────────┐
│                                  │
│     Centered Auth Card           │
│     (no navbar, no footer)       │
│                                  │
└──────────────────────────────────┘
```

### Home Page Sections (in order)
1. HeroSection — main CTA with illustration
2. StatisticsSection — key metrics
3. FeaturesSection — feature cards
4. HowItWorksSection — step-by-step guide
5. LanguageSupportSection — Hindi/Telugu/English
6. TestimonialsSection — user stories
7. TrustSection — trust indicators
8. CTASection — final call-to-action

---

## 9. Key Components

### Navbar (`src/components/Navbar.tsx`)
- Fixed position, `h-16`
- Shadow appears on scroll
- Adaptive links: different for logged-in vs logged-out users
- Profile avatar: 40px circle with Google picture or user initials
- Dropdown menu: Settings, Help Center, Logout (red text)
- Mobile: Sheet (slide-in) menu

### AnalysisReport (`src/components/dashboard/AnalysisReport.tsx`)
- Risk score card with color-coded progress bar (green/yellow/red)
- Verdict text with simplified explanation
- Recommendations split into "Do" and "Don't" lists
- Threat indicators with severity badges
- Sender analysis and content analysis sections
- Share button (opens ShareModal) and download PDF
- Feedback thumbs (up/down)
- Auto-scroll to report on completion with 2s pulse animation

### AIChatbot (`src/components/dashboard/AIChatbot.tsx`)
- Floating bubble in bottom-right corner
- Expandable chat panel (350×500px)
- Quick question buttons for common queries
- Typing indicator animation
- Multi-language support (responds in selected language)
- Context-aware: knows about the current analysis

### Other Components
- **ShareModal**: Modal to share analysis results
- **ThemeToggle**: Light/dark mode switcher (Sun/Moon icons)
- **ProtectedRoute**: Auth guard — shows loading spinner, redirects to `/auth` if not authenticated
- **AnalysisHistory**: List of past analyses with search/filter
- **NavLink**: Active-state-aware navigation link

---

## 10. Edge Functions

### `analyze-sms` (`supabase/functions/analyze-sms/index.ts`)
- **Auth**: JWT validation required
- **Input**: `messageContent`, `senderPhone`, `language`
- **AI Call**: Lovable AI Gateway → Google Gemini 3 Flash Preview
- **Prompt**: Structured JSON output format for risk assessment
- **Output**: `{ riskScore, riskLevel, confidence, verdict, action, threats[], senderAnalysis, contentAnalysis, recommendations }`
- **Error handling**: 401 (auth), 429 (rate limit), 402 (service unavailable)

### `chat-assistant` (`supabase/functions/chat-assistant/index.ts`)
- **Auth**: JWT validation required
- **Input**: `userQuestion`, `analysisContext`, `language`, `chatHistory[]`
- **AI Call**: Lovable AI Gateway → Google Gemini 3 Flash Preview
- **Context**: Includes analyzed message details, risk level, threats
- **History**: Maintains last 10 messages for conversation continuity
- **Safety info**: India Cyber Crime Helpline 1930, cybercrime.gov.in
- **Output**: `{ response: string }` — conversational text

---

## 11. Services Layer

### `aiService.ts` (`src/services/aiService.ts`)
- `analyzeSMSMessage(messageContent, senderPhone, language)` → `AnalysisResult`
- `chatWithAssistant(question, context, language, history)` → `string`
- Handles auth token injection via `getAuthToken()`
- Uses `VITE_SUPABASE_URL` for edge function URLs

### `analysisService.ts` (`src/services/analysisService.ts`)
- `saveAnalysis(data)` — INSERT into analyses table
- `getAnalyses()` — SELECT user's analyses (ordered by date)
- `getAnalysisById(id)` — SELECT single analysis
- `deleteAnalysis(id)` — DELETE analysis
- `getAnalysisStats()` — Aggregate statistics

### `storageService.ts` (`src/services/storageService.ts`)
- `uploadScreenshot(file, userId)` — Upload to `screenshots` bucket
- `deleteScreenshot(path)` — Remove from storage
- `getSignedUrl(path)` — Generate 1-hour signed URL
- Validates file type (PNG/JPG) and size (5MB max)

---

## 12. Core Feature Flow

```
User Journey: SMS Analysis
═══════════════════════════

1. User navigates to /analyze (must be authenticated)
2. Fills in:
   ├── SMS message text (required)
   ├── Sender phone number (required, sanitized)
   ├── Language selection (English/Hindi/Telugu)
   └── Screenshot upload (optional, 5MB max, PNG/JPG)
3. Clicks "Analyze"
4. If screenshot → uploaded to private storage bucket
5. Edge function `analyze-sms` called with JWT auth
6. AI (Gemini 3 Flash) returns structured JSON:
   ├── Risk score (0-100)
   ├── Risk level (LOW/MEDIUM/HIGH)
   ├── Confidence percentage
   ├── Verdict (plain language explanation)
   ├── Threats detected (with severity)
   ├── Sender analysis
   ├── Content analysis
   └── Recommendations (do/don't)
7. Results rendered in AnalysisReport component
   ├── Auto-scroll to report
   └── 2-second pulse animation on risk card
8. Analysis auto-saved to database
9. AI Chatbot bubble appears for follow-up questions
10. User can:
    ├── Share results (ShareModal)
    ├── Download as PDF
    ├── Give feedback (thumbs up/down)
    └── Ask chatbot questions about the analysis
```

---

## 13. Demo Mode

| Aspect | Detail |
|---|---|
| **Route** | `/demo` |
| **Auth required** | No |
| **Pre-filled message** | SBI KYC scam SMS |
| **AI call** | None — uses hardcoded mock result |
| **Mock result** | HIGH risk, 92/100 score |
| **Usage limit** | 3 demos per device (tracked in `localStorage`) |
| **After demo** | CTA to sign up for full access |

---

## 14. Internationalization

### Translation System
- **File**: `src/lib/translations.ts` (~294 lines)
- **Languages**: English, Hindi, Telugu
- **Structure**: Keyed object with nested translation strings
- **Usage**: Imported in `AnalysisReport` and `AIChatbot` components
- **Persistence**: Selected language stored in `localStorage`

### AI Response Language
- Edge functions receive `language` parameter
- AI system prompt includes language-specific instructions
- Hindi/Telugu prompts emphasize simple language for rural users

---

## 15. Security Measures

### Database Security
- ✅ RLS enabled on ALL tables
- ✅ All policies scoped to `auth.uid() = user_id`
- ✅ DELETE policies on profiles and user_preferences
- ✅ No public read access on any table

### Edge Function Security
- ✅ JWT validation on all endpoints
- ✅ Authorization header required (`Bearer <token>`)
- ✅ Token claims verified via `supabase.auth.getClaims()`

### Storage Security
- ✅ Private bucket (no public access)
- ✅ Signed URLs with 1-hour expiration
- ✅ File type validation (PNG/JPG only)
- ✅ File size validation (5MB max)
- ✅ 30-day auto-delete policy

### Input Validation
- ✅ Phone number sanitization (digits + country code, 16 char max)
- ✅ Zod schema validation on auth forms
- ✅ `handle_new_user()` trigger hardened with input validation and 100-char name limit

### Manual Configuration Required
- ⚠️ Enable **Leaked Password Protection** in Authentication → Attack Protection dashboard

---

## 16. File Structure

```
sentinelai/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── hero-illustration.png
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIChatbot.tsx          # Floating AI chat bubble
│   │   │   ├── AnalysisHistory.tsx     # History list component
│   │   │   ├── AnalysisReport.tsx      # Risk analysis results display
│   │   │   └── ShareModal.tsx          # Share results modal
│   │   ├── home/
│   │   │   ├── CTASection.tsx          # Final call-to-action
│   │   │   ├── FeaturesSection.tsx     # Feature cards grid
│   │   │   ├── HeroSection.tsx         # Hero with illustration
│   │   │   ├── HowItWorksSection.tsx   # Step-by-step guide
│   │   │   ├── LanguageSupportSection.tsx
│   │   │   ├── StatisticsSection.tsx   # Key metrics
│   │   │   ├── TestimonialsSection.tsx # User stories
│   │   │   └── TrustSection.tsx        # Trust indicators
│   │   ├── ui/                         # shadcn/ui components (40+ files)
│   │   ├── Footer.tsx
│   │   ├── NavLink.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx             # Auth state management
│   ├── hooks/
│   │   ├── use-mobile.tsx              # Mobile detection
│   │   ├── use-theme.tsx               # Theme management
│   │   └── use-toast.ts                # Toast notifications
│   ├── integrations/
│   │   ├── lovable/index.ts            # Lovable Cloud client
│   │   └── supabase/
│   │       ├── client.ts               # Auto-generated Supabase client
│   │       └── types.ts                # Auto-generated database types
│   ├── lib/
│   │   ├── translations.ts            # i18n strings (EN/HI/TE)
│   │   └── utils.ts                   # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Analyze.tsx                # Main analysis page (protected)
│   │   ├── Auth.tsx                   # Login/signup
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx              # Redirects to /analyze
│   │   ├── DataSecurity.tsx
│   │   ├── Demo.tsx                   # Free demo (no auth)
│   │   ├── FAQ.tsx                    # Redirects to /help
│   │   ├── Help.tsx
│   │   ├── History.tsx                # Past analyses (protected)
│   │   ├── Index.tsx                  # Landing page
│   │   ├── NotFound.tsx               # 404 page
│   │   ├── Privacy.tsx
│   │   ├── Settings.tsx               # User preferences (protected)
│   │   └── Terms.tsx
│   ├── services/
│   │   ├── aiService.ts               # Edge function API client
│   │   ├── analysisService.ts         # CRUD for analyses table
│   │   └── storageService.ts          # Screenshot upload/download
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   ├── App.tsx                        # Router setup
│   ├── App.css
│   ├── index.css                      # Design system tokens
│   └── main.tsx                       # Entry point
├── supabase/
│   ├── config.toml                    # Auto-generated config
│   └── functions/
│       ├── analyze-sms/index.ts       # SMS analysis edge function
│       └── chat-assistant/index.ts    # AI chatbot edge function
├── PROJECT_SUMMARY.md                 # This file
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── components.json                    # shadcn/ui config
```

---

## 17. Type Definitions

Key TypeScript types defined in `src/types/index.ts`:

```typescript
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type Language = 'english' | 'hindi' | 'telugu';

interface ThreatIndicator {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  riskScore: number;        // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;       // 0-100
  verdict: string;          // AI-generated explanation
  action: string;           // Recommended action
  threats: ThreatIndicator[];
  senderAnalysis: SenderAnalysis;
  contentAnalysis: ContentAnalysis;
  recommendations: { do: string[]; dont: string[] };
}
```

---

## 18. Complexity Assessment

| Dimension | Level | Rationale |
|---|---|---|
| **Frontend** | Medium-High | 15 pages, multi-language, theme system, complex analysis UI, floating chatbot |
| **Backend** | Medium | 3 tables, 2 edge functions, storage bucket, auth with Google OAuth |
| **AI Integration** | Medium | Structured JSON prompting, conversational chat with history, multi-language output |
| **Security** | Medium-High | RLS on all tables, JWT validation, signed URLs, input sanitization, hardened triggers |
| **Overall** | **Medium-High** | Full-stack application with AI integration and multi-language support |

---

## 19. Environment Variables

| Variable | Source | Usage |
|---|---|---|
| `VITE_SUPABASE_URL` | Auto-generated (.env) | Edge function base URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Auto-generated (.env) | Supabase client initialization |
| `VITE_SUPABASE_PROJECT_ID` | Auto-generated (.env) | Project identification |
| `LOVABLE_API_KEY` | Edge function runtime | AI Gateway authentication (server-side only) |
| `SUPABASE_URL` | Edge function runtime | Supabase client in edge functions |
| `SUPABASE_ANON_KEY` | Edge function runtime | Supabase client in edge functions |

---

*Last updated: February 2026*

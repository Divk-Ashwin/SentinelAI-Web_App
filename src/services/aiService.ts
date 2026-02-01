import type { AnalysisResult, Language } from "@/types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface AnalyzeSMSResponse {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  verdict: string;
  action: string;
  threats: Array<{ title: string; description: string; severity: "high" | "medium" | "low" }>;
  senderAnalysis: {
    phone: string;
    inContacts: boolean;
    reportCount: number;
    isNew: boolean;
  };
  contentAnalysis: {
    hasLinks: boolean;
    linkDomain?: string;
    hasUrgency: boolean;
    grammarScore: number;
    keywords: string[];
  };
  recommendations: {
    do: string[];
    dont: string[];
  };
}

interface ChatResponse {
  response: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Analyze an SMS message for scam indicators using AI
 */
export async function analyzeSMSMessage(
  messageContent: string,
  senderPhone: string,
  language: Language
): Promise<AnalysisResult> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      messageContent,
      senderPhone,
      language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed: ${response.status}`);
  }

  const data: AnalyzeSMSResponse = await response.json();
  
  return {
    riskScore: data.riskScore,
    riskLevel: data.riskLevel,
    confidence: data.confidence,
    verdict: data.verdict,
    action: data.action,
    threats: data.threats,
    senderAnalysis: data.senderAnalysis,
    contentAnalysis: data.contentAnalysis,
    recommendations: data.recommendations,
  };
}

/**
 * Chat with AI assistant about the analysis
 */
export async function chatWithAssistant(
  userQuestion: string,
  analysisContext: {
    messageContent?: string;
    riskLevel?: string;
    riskScore?: number;
    verdict?: string;
    threats?: Array<{ title: string; description: string }>;
  },
  language: Language,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      userQuestion,
      analysisContext,
      language,
      chatHistory,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Chat failed: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data.response;
}

import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult, Language } from "@/types";

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

export async function analyzeSMSMessage(
  messageContent: string,
  senderPhone: string,
  language: Language
): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke<AnalyzeSMSResponse>("analyze-sms", {
    body: { messageContent, senderPhone, language },
  });

  if (error) {
    // Extract real error message from the edge function response body
    try {
      const body = await (error as any).context?.json?.();
      if (body?.error) throw new Error(body.error);
    } catch (inner) {
      if (inner instanceof Error && inner.message !== error.message) throw inner;
    }
    throw new Error(error.message || "Analysis failed");
  }

  if (!data) {
    throw new Error("No response from analysis service");
  }

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
  const { data, error } = await supabase.functions.invoke<ChatResponse>("chat-assistant", {
    body: { userQuestion, analysisContext, language, chatHistory },
  });

  if (error) {
    throw new Error(error.message || "Chat failed");
  }

  if (!data) {
    throw new Error("No response from chat service");
  }

  return data.response;
}

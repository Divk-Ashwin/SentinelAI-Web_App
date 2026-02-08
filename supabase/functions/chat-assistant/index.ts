import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatRequest {
  userQuestion: string;
  analysisContext: {
    messageContent?: string;
    riskLevel?: string;
    riskScore?: number;
    verdict?: string;
    threats?: Array<{ title: string; description: string }>;
  };
  language: "english" | "hindi" | "telugu";
  chatHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============================================
    // AUTHENTICATION CHECK - Validate JWT token
    // ============================================
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the JWT and get claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.log("Invalid or expired token:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);
    // ============================================

    const { userQuestion, analysisContext, language, chatHistory = [] } = await req.json() as ChatRequest;

    if (!userQuestion) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      english: "Respond in English. Use simple, clear language that anyone can understand.",
      hindi: "Respond in Hindi (हिंदी). Use simple language that rural users can understand. Avoid complex technical terms.",
      telugu: "Respond in Telugu (తెలుగు). Use simple language that rural users can understand. Avoid complex technical terms."
    };

    const threatsList = analysisContext.threats?.map(t => t.title).join(", ") || "None detected";

    const systemPrompt = `You are a helpful AI assistant specializing in SMS scam detection and cyber safety in India. You help users understand scam analysis results and provide actionable safety advice.

${languageInstructions[language]}

Context about the analyzed message:
- Original Message: ${analysisContext.messageContent || "Not provided"}
- Risk Level: ${analysisContext.riskLevel || "Unknown"} (Score: ${analysisContext.riskScore || "N/A"}/100)
- Verdict: ${analysisContext.verdict || "Not analyzed"}
- Threats Found: ${threatsList}

Important information to share when relevant:
- India Cyber Crime Helpline: 1930 (24/7)
- Report online: cybercrime.gov.in
- Banks never ask for OTP/PIN via SMS
- Never click shortened URLs (bit.ly, etc.)
- Verify suspicious messages by calling official numbers

Keep responses concise (2-4 sentences for simple questions, up to 6 points for action lists).
Be empathetic and reassuring - many victims feel embarrassed.
If they've already been scammed, prioritize immediate action steps.`;

    // Build messages array with chat history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add previous chat history (limit to last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    }

    // Add current question
    messages.push({ role: "user", content: userQuestion });

    console.log("Calling AI gateway for chat response...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Chat response generated for user:", userId);

    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Chat service temporarily unavailable" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

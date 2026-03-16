import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalyzeRequest {
  messageContent: string;
  senderPhone: string;
  language: "english" | "hindi" | "telugu";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Supabase gateway already verified the JWT before reaching this function.
    // No need to re-decode the token — just confirm the header is present.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messageContent, senderPhone, language } = await req.json() as AnalyzeRequest;

    if (!messageContent) {
      return new Response(
        JSON.stringify({ error: "Message content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const languageInstructions = {
      english: "Respond in English",
      hindi: "Respond in Hindi (हिंदी)",
      telugu: "Respond in Telugu (తెలుగు)"
    };

    const systemPrompt = `You are an expert at detecting SMS fraud and scams in India. Analyze messages and provide specific, message-relevant safety advice.

You MUST respond with ONLY a valid JSON object - no markdown, no code blocks, no additional text.

CRITICAL DISTINCTION — apply this before scoring:
- A message that DELIVERS a one-time code or OTP TO the user (e.g., "Your Coinbase code is 783215. Do not share this.") is a LEGITIMATE 2FA message. Score these LOW (5-20).
- The phrase "do not share this code with anyone" is a SECURITY WARNING from a legitimate service — it is NOT a scam indicator.
- The phrase "if you have not requested this, please call [number]" is a standard security notice from a legitimate service — NOT a scam indicator.
- A message that ASKS you to share your OTP, password, PIN, or account details IS a phishing scam. Score HIGH (75-100).
- Known services (banks, Coinbase, Google, Amazon, delivery services) sending OTP codes or delivery alerts are legitimate.

Analyze for these threat indicators:
- Suspicious links (shortened URLs like bit.ly, fake domains)
- Urgency tactics (immediate action required, threats, deadlines)
- Requests for personal info (OTP, password, CVV, PIN, Aadhaar) — only if the message is asking you to provide them
- Impersonation of known services with fake sender numbers
- Too-good-to-be-true offers (lottery wins, prizes, free money)
- Poor grammar and spelling mistakes

Risk scoring guidelines:
- 0-20: SAFE (legitimate 2FA OTP, bank alerts, delivery notifications from known services)
- 21-35: LOW risk (legitimate messages, minor unusual elements)
- 36-65: MEDIUM risk (some suspicious elements, verify before acting)
- 66-100: HIGH risk (clear scam indicators, do not engage)

Recommendations MUST be specific to this exact message — not generic advice. Reference the actual message content, sender, or specific risk found.

${languageInstructions[language]}`;

    const userPrompt = `Analyze this SMS message for scam indicators:

Message: "${messageContent}"
Sender Phone: ${senderPhone}

Return a JSON object with this exact structure:
{
  "riskScore": <number 0-100>,
  "riskLevel": "<LOW or MEDIUM or HIGH>",
  "confidence": <number 0-100>,
  "verdict": "<brief explanation of why this is/isn't a scam>",
  "action": "<what the user should do>",
  "threats": [
    {
      "title": "<threat name>",
      "description": "<brief description>",
      "severity": "<high or medium or low>"
    }
  ],
  "senderAnalysis": {
    "phone": "${senderPhone}",
    "inContacts": false,
    "reportCount": <estimated reports 0-100>,
    "isNew": <boolean>
  },
  "contentAnalysis": {
    "hasLinks": <boolean>,
    "linkDomain": "<domain if link present, otherwise null>",
    "hasUrgency": <boolean>,
    "grammarScore": <1-10>,
    "keywords": ["<suspicious keyword found in message>"],
    "triggerPhrases": ["<exact phrase or word from the message that most influenced the risk score>"]
  },
  "recommendations": {
    "do": ["<specific action relevant to THIS message>", "<specific action>", "<specific action>", "<specific action>"],
    "dont": ["<specific thing to avoid relevant to THIS message>", "<specific thing>", "<specific thing>", "<specific thing>"]
  }
}`;

    console.log("Calling AI gateway for analysis...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq error ${response.status}:`, errorText);
      throw new Error(`Groq ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response - handle potential markdown code blocks
    let analysisResult;
    try {
      // Remove potential markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse analysis result");
    }

    // Validate and normalize the response
    const normalizedResult = {
      riskScore: Math.min(100, Math.max(0, Number(analysisResult.riskScore) || 50)),
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(analysisResult.riskLevel?.toUpperCase()) 
        ? analysisResult.riskLevel.toLowerCase() 
        : "medium",
      confidence: Math.min(100, Math.max(0, Number(analysisResult.confidence) || 80)),
      verdict: analysisResult.verdict || "Unable to determine message safety",
      action: analysisResult.action || "Exercise caution with this message",
      threats: Array.isArray(analysisResult.threats) ? analysisResult.threats : [],
      senderAnalysis: {
        phone: senderPhone,
        inContacts: false,
        reportCount: Number(analysisResult.senderAnalysis?.reportCount) || 0,
        isNew: Boolean(analysisResult.senderAnalysis?.isNew),
      },
      contentAnalysis: {
        hasLinks: Boolean(analysisResult.contentAnalysis?.hasLinks),
        linkDomain: analysisResult.contentAnalysis?.linkDomain || undefined,
        hasUrgency: Boolean(analysisResult.contentAnalysis?.hasUrgency),
        grammarScore: Math.min(10, Math.max(1, Number(analysisResult.contentAnalysis?.grammarScore) || 5)),
        keywords: Array.isArray(analysisResult.contentAnalysis?.keywords)
          ? analysisResult.contentAnalysis.keywords
          : [],
        triggerPhrases: Array.isArray(analysisResult.contentAnalysis?.triggerPhrases)
          ? analysisResult.contentAnalysis.triggerPhrases
          : [],
      },
      recommendations: {
        do: Array.isArray(analysisResult.recommendations?.do) 
          ? analysisResult.recommendations.do 
          : ["Be cautious with this message"],
        dont: Array.isArray(analysisResult.recommendations?.dont) 
          ? analysisResult.recommendations.dont 
          : ["Do not share personal information"],
      },
    };

    console.log("Analysis complete.");

    return new Response(
      JSON.stringify(normalizedResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Analysis service temporarily unavailable" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  messageContent: string;
  senderPhone: string;
  language: "english" | "hindi" | "telugu";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageContent, senderPhone, language } = await req.json() as AnalyzeRequest;

    if (!messageContent) {
      return new Response(
        JSON.stringify({ error: "Message content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      english: "Respond in English",
      hindi: "Respond in Hindi (हिंदी)",
      telugu: "Respond in Telugu (తెలుగు)"
    };

    const systemPrompt = `You are an expert at detecting SMS fraud and scams in India. Analyze messages for scam indicators and provide safety recommendations.

You MUST respond with ONLY a valid JSON object - no markdown, no code blocks, no additional text.

Analyze for these threat indicators:
- Suspicious links (shortened URLs like bit.ly, fake domains)
- Urgency tactics (immediate action required, threats, deadlines)
- Requests for personal info (OTP, password, CVV, PIN, Aadhaar)
- Impersonation (banks, government, courier services, telecom)
- Too-good-to-be-true offers (lottery wins, prizes, free money)
- Poor grammar and spelling mistakes
- Unknown sender numbers
- Pressure tactics and fear mongering

Risk scoring guidelines:
- 0-35: LOW risk (legitimate messages, known senders, no suspicious elements)
- 36-65: MEDIUM risk (some suspicious elements, verify before acting)
- 66-100: HIGH risk (clear scam indicators, do not engage)

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
    "linkDomain": "<domain if link present or null>",
    "hasUrgency": <boolean>,
    "grammarScore": <1-10>,
    "keywords": ["<suspicious keywords found>"]
  },
  "recommendations": {
    "do": ["<action 1>", "<action 2>", "<action 3>", "<action 4>"],
    "dont": ["<thing to avoid 1>", "<thing to avoid 2>", "<thing to avoid 3>", "<thing to avoid 4>"]
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
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

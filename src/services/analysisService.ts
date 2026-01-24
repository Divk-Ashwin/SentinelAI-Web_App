import { supabase } from "@/integrations/supabase/client";
import type { AnalysisData, AnalysisRow, RiskLevel, ThreatIndicator, Recommendations, SenderAnalysis, ContentAnalysis } from "@/types";
import type { Json } from "@/integrations/supabase/types";

interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Save a new analysis to the database
export async function saveAnalysis(data: AnalysisData): Promise<ServiceResult<{ id: string }>> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data: result, error } = await supabase
      .from("analyses")
      .insert({
        user_id: userData.user.id,
        sender_phone: data.senderPhone,
        message_content: data.messageContent,
        date_received: data.dateReceived,
        time_received: data.timeReceived,
        screenshot_url: data.screenshotUrl || null,
        language: data.language,
        risk_score: data.riskScore,
        risk_level: data.riskLevel,
        verdict: data.verdict,
        threats: data.threats as unknown as Json,
        recommendations: data.recommendations as unknown as Json,
        sender_analysis: data.senderAnalysis as unknown as Json,
        content_analysis: data.contentAnalysis as unknown as Json,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving analysis:", error);
      return { success: false, error: error.message };
    }

    console.log("Analysis saved successfully:", result.id);
    return { success: true, data: { id: result.id } };
  } catch (err) {
    console.error("Unexpected error saving analysis:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Get user's analyses with optional limit
export async function getUserAnalyses(limit?: number): Promise<ServiceResult<AnalysisRow[]>> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return { success: false, error: "User not authenticated" };
    }

    let query = supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching analyses:", error);
      return { success: false, error: error.message };
    }

    // Transform the data to match AnalysisRow type
    const analyses: AnalysisRow[] = (data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      sender_phone: row.sender_phone,
      message_content: row.message_content,
      date_received: row.date_received,
      time_received: row.time_received,
      screenshot_url: row.screenshot_url,
      language: row.language as AnalysisRow["language"],
      risk_score: row.risk_score,
      risk_level: row.risk_level as RiskLevel | null,
      verdict: row.verdict,
      threats: row.threats as unknown as ThreatIndicator[] | null,
      recommendations: row.recommendations as unknown as Recommendations | null,
      sender_analysis: row.sender_analysis as unknown as SenderAnalysis | null,
      content_analysis: row.content_analysis as unknown as ContentAnalysis | null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    console.log("Fetched analyses:", analyses.length);
    return { success: true, data: analyses };
  } catch (err) {
    console.error("Unexpected error fetching analyses:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Delete an analysis by ID
export async function deleteAnalysis(id: string): Promise<ServiceResult> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error deleting analysis:", error);
      return { success: false, error: error.message };
    }

    console.log("Analysis deleted successfully:", id);
    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting analysis:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Get analysis statistics for the user
export async function getAnalysisStats(): Promise<ServiceResult<{
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}>> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("analyses")
      .select("risk_level")
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      total: data?.length || 0,
      highRisk: data?.filter(a => a.risk_level === 'HIGH').length || 0,
      mediumRisk: data?.filter(a => a.risk_level === 'MEDIUM').length || 0,
      lowRisk: data?.filter(a => a.risk_level === 'LOW').length || 0,
    };

    return { success: true, data: stats };
  } catch (err) {
    console.error("Unexpected error fetching stats:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

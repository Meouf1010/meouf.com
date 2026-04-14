// ============================================================
// app/api/ai/analyze/route.ts — Daily Check-in AI Analysis
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  buildDailyAnalysisPrompt,
  callOpenAI,
  type DailyAnalysisInput,
} from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { petId, logId } = await req.json();

    // Fetch pet profile
    const { data: pet } = await supabase
      .from("pets")
      .select("*")
      .eq("id", petId)
      .eq("owner_id", user.id)
      .single();

    if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 });

    // Fetch today's log
    const { data: todayLog } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("id", logId)
      .eq("owner_id", user.id)
      .single();

    if (!todayLog) return NextResponse.json({ error: "Log not found" }, { status: 404 });

    // Fetch last 30 days for baseline & trend
    const { data: recentLogs } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("pet_id", petId)
      .neq("id", logId)
      .order("log_date", { ascending: false })
      .limit(30);

    // Compute baseline from DB function
    const { data: baselineResult } = await supabase
      .rpc("compute_pet_baseline", { p_pet_id: petId });

    const input: DailyAnalysisInput = {
      pet,
      todayLog,
      recentLogs: recentLogs || [],
      baseline: baselineResult?.log_count >= 7 ? baselineResult : null,
    };

    const prompt = buildDailyAnalysisPrompt(input);
    const rawResult = await callOpenAI(prompt);
    const analysis = JSON.parse(rawResult);

    // Update log with AI results
    const { error: updateError } = await supabase
      .from("daily_logs")
      .update({
        ai_analyzed: true,
        ai_health_score: analysis.health_score,
        ai_summary: analysis.summary,
        ai_flags: analysis.flags,
        ai_suggestions: analysis.suggestions,
        ai_triage_level: analysis.triage_level,
        ai_processed_at: new Date().toISOString(),
      })
      .eq("id", logId);

    if (updateError) throw updateError;

    // Update pet's AI baseline & risk score
    await supabase
      .from("pets")
      .update({
        ai_baseline: await supabase.rpc("compute_pet_baseline", { p_pet_id: petId }),
        ai_risk_score: 10 - analysis.health_score,
        updated_at: new Date().toISOString(),
      })
      .eq("id", petId);

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


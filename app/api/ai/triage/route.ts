
// ============================================================
// app/api/ai/triage/route.ts — Emergency Triage
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildTriagePrompt, callOpenAI } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { petId, symptoms, duration, context } = await req.json();

    const { data: pet } = await supabase.from("pets").select("*").eq("id", petId).single();
    if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 });

    const prompt = buildTriagePrompt(pet, symptoms, duration, context);
    const rawResult = await callOpenAI(prompt);
    const triage = JSON.parse(rawResult);

    return NextResponse.json({ success: true, triage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
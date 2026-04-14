
// ============================================================
// app/api/ai/vision/route.ts — Weekly Photo Vision Analysis
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildVisionAnalysisPrompt, callOpenAI } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("photo") as File;
    const petId = formData.get("petId") as string;

    if (!file || !petId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Upload photo to Supabase Storage
    const fileName = `${user.id}/${petId}/${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("vision-scans")
      .upload(fileName, file, { contentType: "image/jpeg" });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage.from("vision-scans").getPublicUrl(fileName);

    // Fetch pet
    const { data: pet } = await supabase.from("pets").select("*").eq("id", petId).single();

    // Convert to base64 for OpenAI Vision
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // AI Vision analysis
    const prompt = buildVisionAnalysisPrompt(pet);
    const rawResult = await callOpenAI(prompt, base64);
    const analysis = JSON.parse(rawResult);

    // Save vision scan
    const { data: scan } = await supabase
      .from("vision_scans")
      .insert({
        pet_id: petId,
        owner_id: user.id,
        scan_date: new Date().toISOString().split("T")[0],
        week_number: getISOWeek(new Date()),
        photo_url: urlData.publicUrl,
        photo_storage_path: fileName,
        ...analysis,
      })
      .select()
      .single();

    // Update pet BCS score
    if (analysis.bcs_score) {
      await supabase
        .from("pets")
        .update({ body_condition_score: analysis.bcs_score })
        .eq("id", petId);
    }

    return NextResponse.json({ success: true, scan, analysis });
  } catch (error: any) {
    console.error("Vision analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

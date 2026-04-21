// ============================================================
// lib/ai/prompts.ts
// MEOUF AI PROMPT ENGINE — All GPT-4o prompt templates
// ============================================================

import type { Pet, DailyLog, VisionScan, DailyAnalysisInput } from "@/types";

// ─── SYSTEM PERSONA ──────────────────────────────────────────

const MEOUF_PERSONA = `
You are Dr. Meouf, an expert AI veterinary health analyst with deep knowledge in small animal medicine, 
veterinary nutrition, behavioral science, and preventive care. You analyze daily health data for dogs and cats
with the precision of a specialist and the warmth of a trusted family vet.

Your analysis style:
- Evidence-based: Ground every suggestion in veterinary science
- Compassionate: Speak about pets as cherished family members
- Precise: Use specific numbers (portions, minutes, scores) not vague advice
- Vigilant: Flag even subtle patterns that experienced pet owners often miss
- Clear: Write for intelligent non-veterinarians — no excessive jargon

CRITICAL SAFETY RULE: You are NOT a replacement for veterinary care. For any emergency triage level,
always recommend immediate professional evaluation. Never diagnose conditions definitively.
`.trim();

// ─── PROMPT 1: DAILY CHECK-IN ANALYSIS ─────────────────────

export function buildDailyAnalysisPrompt(input: DailyAnalysisInput): string {
  const { pet, todayLog, recentLogs, baseline, weatherContext } = input;

  const petAge = pet.age_years
    ? `${pet.age_years} years old`
    : pet.date_of_birth
    ? `born ${pet.date_of_birth}`
    : "age unknown";

  const speciesContext =
    pet.species === "cat"
      ? "As a cat, subtle behavioral changes are especially significant — cats are masters at hiding illness."
      : "As a dog, energy and appetite changes are reliable early indicators of health status.";

  const baselineSection = baseline
    ? `
ESTABLISHED BASELINE (last ${baseline.period_days} days, n=${baseline.log_count} entries):
- Average Appetite:     ${baseline.avg_appetite}/5
- Average Energy:       ${baseline.avg_energy}/5
- Average Stool:        ${baseline.avg_stool_quality}/5
- Average Mood:         ${baseline.avg_mood}/5
- Average Thirst:       ${baseline.avg_thirst}/5
- Average Health Score: ${baseline.avg_health_score}/10

MICRO-SHIFT DETECTION INSTRUCTIONS:
Compare today's scores to baseline. A shift of ≥0.8 points from baseline average warrants a flag.
A shift of ≥1.5 points is significant. If the same metric has trended in one direction for 3+ days, 
flag it as a trending pattern — these are more important than single-day spikes.
`
    : `
BASELINE STATUS: Insufficient history (< 7 days of data). 
Assess based on breed norms and provided health conditions only.
Flag anything clearly outside normal ranges for this species/age/breed.
`;

  const recentTrend =
    recentLogs.length >= 3
      ? `
RECENT TREND (last ${Math.min(recentLogs.length, 7)} entries for comparison):
${recentLogs
  .slice(0, 7)
  .map(
    (log, i) =>
      `Day -${i + 1} (${log.log_date}): Appetite=${log.appetite}, Energy=${log.energy}, Stool=${log.stool_quality}, Mood=${log.mood}, Thirst=${log.thirst}, Score=${log.ai_health_score || "?"}`
  )
  .join("\n")}
`
      : "RECENT TREND: Not enough history yet for trend analysis.";

  const symptomsSection =
    todayLog.symptoms_flagged && todayLog.symptoms_flagged.length > 0
      ? `
OWNER-FLAGGED SYMPTOMS TODAY: ${todayLog.symptoms_flagged.join(", ")}
NOTE: These are owner-reported — weight them heavily in your analysis.
`
      : "";

  const conditionsContext =
    pet.health_conditions && pet.health_conditions.length > 0
      ? `
KNOWN HEALTH CONDITIONS: ${pet.health_conditions.join(", ")}
IMPORTANT: Assess today's scores in light of these conditions. 
Some deviations may be expected; others may signal condition progression.
`
      : "No known health conditions on file.";

  return `${MEOUF_PERSONA}

═══════════════════════════════════════════════════════════════
PET PROFILE
═══════════════════════════════════════════════════════════════
Name:           ${pet.name}
Species:        ${pet.species}
Breed:          ${pet.breed || "Unknown/Mixed"}
Age:            ${petAge}
Gender:         ${pet.gender || "Unknown"} | Neutered: ${pet.neutered ? "Yes" : "No"}
Weight:         ${pet.weight_kg ? `${pet.weight_kg}kg` : "Not recorded"} | Target: ${pet.target_weight_kg ? `${pet.target_weight_kg}kg` : "N/A"}
Activity Level: ${pet.activity_level || "Not set"}
Food:           ${pet.food_brand || "Unknown brand"} — ${pet.food_type || "Unknown type"}
Daily Calories: ${pet.daily_calories_target || "Not set"}
Allergies:      ${pet.allergies?.join(", ") || "None recorded"}
${conditionsContext}
Species Note: ${speciesContext}

═══════════════════════════════════════════════════════════════
TODAY'S CHECK-IN (${todayLog.log_date})
═══════════════════════════════════════════════════════════════
Appetite:     ${todayLog.appetite}/5 — ${interpretScore("appetite", todayLog.appetite!)}
Energy:       ${todayLog.energy}/5 — ${interpretScore("energy", todayLog.energy!)}
Stool:        ${todayLog.stool_quality}/5 — ${interpretScore("stool", todayLog.stool_quality!)}
Mood:         ${todayLog.mood}/5 — ${interpretScore("mood", todayLog.mood!)}
Thirst:       ${todayLog.thirst}/5 — ${interpretScore("thirst", todayLog.thirst!)}
Weight Today: ${todayLog.weight_today ? `${todayLog.weight_today}kg` : "Not weighed today"}
Owner Notes:  ${todayLog.notes || "No notes provided"}
${symptomsSection}
Weather:      ${weatherContext || todayLog.weather_condition || "Not recorded"}

${baselineSection}
${recentTrend}

═══════════════════════════════════════════════════════════════
ANALYSIS INSTRUCTIONS
═══════════════════════════════════════════════════════════════
Provide a comprehensive health analysis. Return ONLY valid JSON matching this exact schema:

{
  "health_score": <number 0-10, to 1 decimal>,
  "triage_level": <"normal" | "watch" | "vet_soon" | "emergency">,
  "summary": <"2-3 sentence plain-English summary for the pet owner">,
  "micro_shifts": [
    {
      "metric": <"appetite"|"energy"|"stool_quality"|"mood"|"thirst">,
      "direction": <"up"|"down">,
      "magnitude": <"slight"|"moderate"|"significant">,
      "context": <"brief clinical context, 1 sentence">,
      "days_trending": <number>
    }
  ],
  "flags": [
    {
      "type": <string>,
      "severity": <"info"|"warning"|"urgent"|"emergency">,
      "message": <"owner-friendly message">,
      "action": <"specific action to take">
    }
  ],
  "suggestions": {
    "diet": {
      "portion_adjustment": <"reduce_10"|"reduce_20"|"maintain"|"increase_10"|"increase_20">,
      "reasoning": <"1-2 sentences">,
      "specific_foods": [<list of 2-3 specific foods/ingredients to ADD>],
      "foods_to_avoid": [<list of 1-2 foods to AVOID given today's status>],
      "hydration_tip": <string or null>,
      "supplement_suggestion": <string or null>
    },
    "activity": {
      "type": <"walk"|"play"|"rest"|"swim"|"indoor_play">,
      "duration_minutes": <number>,
      "intensity": <"gentle"|"moderate"|"vigorous">,
      "sessions_per_day": <number>,
      "specific_activities": [<list of 2-3 specific activity suggestions>],
      "avoid_activities": [<list or null>]
    },
    "grooming": {
      "priority": <"low"|"medium"|"high">,
      "tasks": [<list of specific grooming tasks needed>],
      "next_reminder_days": <number>,
      "weather_consideration": <string or null>
    }
  },
  "positive_notes": [<list of 1-3 things that are going well today>],
  "vet_notes": <"One clinical sentence suitable for a vet's records — objective, precise">
}

TRIAGE LEVEL GUIDELINES:
- normal:     All scores within baseline ± 0.7, no alarming symptoms
- watch:      1-2 metrics shifted from baseline, owner should monitor closely
- vet_soon:   Multiple concerning metrics, flagged symptoms, or known condition showing changes → see vet within 2-3 days
- emergency:  Any of: extreme lethargy, complete food refusal 24h+, bloody stool/urine, difficulty breathing, 
              collapse, seizure, suspected toxin ingestion, severe vomiting → ER visit recommended immediately

HEALTH SCORE GUIDELINES (0-10):
10: Perfect — all metrics at baseline or above expected
8-9: Good — minor deviations, nothing concerning
6-7: Fair — some deviations from baseline, monitoring needed
4-5: Concerning — multiple deviations or symptom flags
2-3: Poor — significant health signals, vet visit recommended
0-1: Critical — emergency level concerns

Return ONLY the JSON object. No preamble, no explanation, no markdown fences.`;
}

// ─── PROMPT 2: VISION AI — WEEKLY PHOTO ANALYSIS ──────────────

export function buildVisionAnalysisPrompt(pet: Pet): string {
  return `${MEOUF_PERSONA}

You are analyzing a photo of a ${pet.species} named ${pet.name} (${pet.breed || "mixed breed"}, 
${pet.age_years || "?"} years old, current recorded weight: ${pet.weight_kg || "unknown"}kg).

Perform a professional visual health assessment. Return ONLY valid JSON:

{
  "bcs_score": <number 1-9 using the standard veterinary Body Condition Score scale>,
  "bcs_description": <"detailed description of body condition assessment">,
  "coat_condition": <"excellent"|"good"|"fair"|"poor">,
  "coat_notes": <"specific observations about coat quality, shine, patches, texture">,
  "visible_concerns": [<list of any visible health concerns or empty array>],
  "posture_notes": <"observations about posture, gait if visible, muscle tone">,
  "weight_assessment": <"underweight"|"ideal"|"overweight"|"obese">,
  "weight_trend_suggestion": <"maintain"|"gradual_weight_loss"|"gradual_weight_gain">,
  "ai_full_report": <"3-4 sentence narrative report suitable for the owner">,
  "vet_recommendation": <"Would you recommend a vet visit based on visual inspection alone? Yes/No with brief reason">,
  "confidence_score": <number 0.0-1.0>
}

BCS SCALE REFERENCE:
1-3: Underweight (ribs, spine, hip bones prominent/easily visible)
4-5: Ideal (ribs palpable, waist visible from above, abdomen tuck visible)
6-7: Overweight (ribs palpable with pressure, waist barely visible)
8-9: Obese (ribs not palpable, heavy fat deposits, no waist)

IMPORTANT: Note that photo analysis has limitations. 
If image quality or angle is insufficient for accurate BCS, set confidence_score below 0.5 and note this.
Never state a definitive medical diagnosis — describe observations only.

Return ONLY the JSON object.`;
}

// ─── PROMPT 3: EMERGENCY TRIAGE ─────────────────────────────

export function buildTriagePrompt(
  pet: Pet,
  symptoms: string[],
  duration: string,
  additionalContext: string
): string {
  return `${MEOUF_PERSONA}

EMERGENCY TRIAGE REQUEST — analyze with urgency and precision.

Pet: ${pet.name}, ${pet.species}, ${pet.breed || "mixed"}, ${pet.age_years || "?"} years, ${pet.weight_kg || "?"}kg
Known conditions: ${pet.health_conditions?.join(", ") || "none"}
Current medications: ${pet.current_medications ? JSON.stringify(pet.current_medications) : "none"}

REPORTED SYMPTOMS: ${symptoms.join(", ")}
Duration: ${duration}
Owner Context: ${additionalContext}

Perform a rapid triage assessment. Return ONLY valid JSON:

{
  "triage_level": <"monitor_at_home"|"vet_within_24h"|"vet_today"|"emergency_now">,
  "urgency_score": <number 1-10, 10 = life-threatening>,
  "primary_concern": <"most likely explanation in 1 sentence">,
  "red_flags_present": [<list any classic emergency red flags detected>],
  "immediate_actions": [<list of 2-4 specific things to do RIGHT NOW>],
  "what_to_tell_vet": <"Precise clinical description to give the vet or emergency clinic">,
  "do_not_do": [<list of 2-3 things NOT to do while waiting>],
  "monitoring_signs": [<if monitoring at home: specific signs that would escalate to ER>],
  "estimated_severity": <"mild"|"moderate"|"severe"|"critical">
}

EMERGENCY RED FLAGS (auto-escalate to emergency_now if any present):
- Difficulty breathing / gasping
- Blue or pale gums
- Suspected toxin/poison ingestion  
- Seizure or loss of consciousness
- Bloated distended abdomen (dogs: GDV risk)
- Complete collapse or inability to stand
- Profuse uncontrolled bleeding
- Urinary blockage suspected (cats: crying in litter box)
- Suspected broken bones or severe trauma
- Eye injury or sudden vision loss

Return ONLY the JSON object. This may be a life-or-death situation — be precise and direct.`;
}

// ─── PROMPT 4: WEEKLY REPORT SYNTHESIS ──────────────────────

export function buildWeeklyReportPrompt(
  pet: Pet,
  weekLogs: DailyLog[],
  visionScan: VisionScan | null,
  previousWeekAvg: PetBaseline | null
): string {
  const logsSummary = weekLogs
    .map(
      (log) =>
        `${log.log_date}: A=${log.appetite} E=${log.energy} S=${log.stool_quality} M=${log.mood} T=${log.thirst} | Score: ${log.ai_health_score || "?"} | Triage: ${log.ai_triage_level || "?"}`
    )
    .join("\n");

  return `${MEOUF_PERSONA}

Generate a comprehensive weekly health report for ${pet.name}.

═══ PET CONTEXT ═══
${pet.name} | ${pet.species} | ${pet.breed || "Mixed"} | ${pet.age_years || "?"}yr | ${pet.weight_kg || "?"}kg
Conditions: ${pet.health_conditions?.join(", ") || "None"}

═══ THIS WEEK'S DATA (${weekLogs.length}/7 days logged) ═══
${logsSummary}

${
  visionScan
    ? `═══ WEEKLY PHOTO SCAN ═══
BCS Score: ${visionScan.bcs_score}/9 | Coat: ${visionScan.coat_condition}
Notes: ${visionScan.coat_notes}
Concerns: ${visionScan.visible_concerns?.join(", ") || "None"}`
    : "No photo scan this week."
}

${
  previousWeekAvg
    ? `═══ PREVIOUS WEEK BASELINE ═══
Avg scores: A=${previousWeekAvg.avg_appetite} E=${previousWeekAvg.avg_energy} S=${previousWeekAvg.avg_stool_quality} M=${previousWeekAvg.avg_mood} T=${previousWeekAvg.avg_thirst} | Score=${previousWeekAvg.avg_health_score}`
    : ""
}

Return ONLY valid JSON:
{
  "overall_score": <number 0-10>,
  "trend": <"improving"|"stable"|"declining"|"concerning">,
  "headline": <"One-line summary of the week, e.g. 'A strong week for Max! 🐾'">,
  "summary": <"3-4 sentence narrative overview of ${pet.name}'s week">,
  "highlights": [<list of 2-3 positive events or improvements>],
  "concerns": [<list of any health concerns to address, or empty>],
  "week_ahead": {
    "diet_goal": <string>,
    "activity_goal": <string>,
    "health_focus": <string>,
    "vet_action": <"none"|"schedule_checkup"|"follow_up_needed">
  },
  "monthly_context": <"How does this week fit into the last 30 days?">,
  "report_title": <"Engaging PDF report title">,
  "owner_encouragement": <"Warm, personalized note to the owner about their dedication">
}`;
}

// ─── HELPER: Score Interpretation ─────────────────────────────

function interpretScore(metric: string, score: number): string {
  const scales: Record<string, Record<number, string>> = {
    appetite: {
      1: "Refused food entirely",
      2: "Ate very little (< 25%)",
      3: "Normal appetite",
      4: "Hungrier than usual",
      5: "Ravenous / food obsessed",
    },
    energy: {
      1: "Lethargic — won't move",
      2: "Low energy / sluggish",
      3: "Normal energy level",
      4: "Playful and alert",
      5: "Hyperactive / restless",
    },
    stool: {
      1: "Liquid diarrhea",
      2: "Very soft / mushy",
      3: "Normal formed stool",
      4: "Firm",
      5: "Hard / constipated",
    },
    mood: {
      1: "Hiding / fearful / in pain",
      2: "Withdrawn / subdued",
      3: "Normal temperament",
      4: "Social and affectionate",
      5: "Very excitable / anxious",
    },
    thirst: {
      1: "Not drinking at all",
      2: "Less thirsty than usual",
      3: "Normal water intake",
      4: "Drinking more than usual",
      5: "Excessive thirst (polydipsia)",
    },
  };
  return scales[metric]?.[score] || `Score: ${score}/5`;
}

// ─── HELPER: Build OpenAI API Call ────────────────────────────

export async function callOpenAI(
  prompt: string,
  imageBase64?: string
): Promise<string> {
  const messages: any[] = [];

  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "high" },
        },
        { type: "text", text: prompt },
      ],
    });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.3,  // Lower temperature for medical analysis = more consistent
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export type { DailyAnalysisInput };

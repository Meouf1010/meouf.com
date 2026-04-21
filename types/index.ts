// types/index.ts

export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age_years: number;
  weight_kg: number;
  photo_url?: string;
  ai_risk_score: number;
  body_condition_score: number;
}

export interface DailyLog {
  log_date: string;
  appetite: number;
  energy: number;
  stool_quality: number;
  mood: number;
  thirst: number;
  ai_health_score: number;
  ai_triage_level: string;
  ai_summary: string;
  ai_suggestions: {
    diet: { portion_adjustment: string; reasoning: string };
    activity: { duration_minutes: number; type: string; specific_activities: string[] };
    grooming: { priority: string; tasks: string[] };
  };
  ai_flags: Array<{ type: string; severity: string; message: string; action: string }>;
}

export interface VisionScan {
  id: string;
  pet_id: string;
  image_url: string;
  created_at: string;
  result: string;
}

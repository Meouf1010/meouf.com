// ============================================================
// app/checkin/page.tsx — 30-Second Daily Check-in Wizard
// ============================================================
"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Zap, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    id: "appetite",
    title: "Appetite",
    emoji: "🍽",
    question: "How did {name} eat today?",
    options: [
      { value: 1, label: "Refused food", emoji: "😴", color: "#D94F4F" },
      { value: 2, label: "Very little", emoji: "😕", color: "#E07B54" },
      { value: 3, label: "Normal", emoji: "😊", color: "#6B8F71" },
      { value: 4, label: "Hungrier than usual", emoji: "😋", color: "#8FAF95" },
      { value: 5, label: "Ravenous", emoji: "🤤", color: "#C9A84C" },
    ],
  },
  {
    id: "energy",
    title: "Energy",
    emoji: "⚡",
    question: "What's {name}'s energy like?",
    options: [
      { value: 1, label: "Lethargic", emoji: "😴", color: "#D94F4F" },
      { value: 2, label: "Low energy", emoji: "😐", color: "#E07B54" },
      { value: 3, label: "Normal", emoji: "😊", color: "#6B8F71" },
      { value: 4, label: "Playful", emoji: "😄", color: "#8FAF95" },
      { value: 5, label: "Hyperactive", emoji: "🤪", color: "#C9A84C" },
    ],
  },
  {
    id: "stool_quality",
    title: "Stool",
    emoji: "💩",
    question: "How was {name}'s stool quality?",
    options: [
      { value: 1, label: "Diarrhea", emoji: "😱", color: "#D94F4F" },
      { value: 2, label: "Very soft", emoji: "😟", color: "#E07B54" },
      { value: 3, label: "Normal", emoji: "✅", color: "#6B8F71" },
      { value: 4, label: "Firm", emoji: "👍", color: "#8FAF95" },
      { value: 5, label: "Very hard", emoji: "😤", color: "#C9A84C" },
    ],
  },
  {
    id: "mood",
    title: "Mood",
    emoji: "😊",
    question: "How's {name}'s mood and behavior?",
    options: [
      { value: 1, label: "Hiding/Fearful", emoji: "😨", color: "#D94F4F" },
      { value: 2, label: "Withdrawn", emoji: "😔", color: "#E07B54" },
      { value: 3, label: "Normal", emoji: "😊", color: "#6B8F71" },
      { value: 4, label: "Social & affectionate", emoji: "🥰", color: "#8FAF95" },
      { value: 5, label: "Very excitable", emoji: "🤩", color: "#C9A84C" },
    ],
  },
  {
    id: "thirst",
    title: "Thirst",
    emoji: "💧",
    question: "How much did {name} drink today?",
    options: [
      { value: 1, label: "Not drinking", emoji: "🚫", color: "#D94F4F" },
      { value: 2, label: "Less than usual", emoji: "📉", color: "#E07B54" },
      { value: 3, label: "Normal", emoji: "✅", color: "#6B8F71" },
      { value: 4, label: "More than usual", emoji: "📈", color: "#C9A84C" },
      { value: 5, label: "Excessive", emoji: "💦", color: "#7BA3D4" },
    ],
  },
];

const SYMPTOM_FLAGS = [
  "vomiting", "diarrhea", "limping", "coughing", "sneezing",
  "eye discharge", "ear scratching", "skin irritation", "not urinating",
  "blood in stool", "blood in urine", "swollen abdomen", "seizure",
];

export default function CheckinPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const petName = "Max"; // Replace with actual pet name from context

  const totalSteps = QUESTIONS.length + 2; // +2 for symptoms & notes steps
  const progress = ((step + 1) / totalSteps) * 100;

  const currentQuestion = QUESTIONS[step];
  const isAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : true;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else setStep(QUESTIONS.length); // Move to symptoms step
    }, 300);
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, symptoms, notes }),
      });
      if (response.ok) router.push("/dashboard?checkin=complete");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FAF6EF 0%, #F0E8D8 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "13px", color: "#8B7B72", marginBottom: "8px" }}>
            Step {step + 1} of {totalSteps}
          </div>
          <div style={{ height: "4px", background: "#E8E0D4", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6B8F71, #8FAF95)",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Question Card */}
        {step < QUESTIONS.length && (
          <div style={{
            background: "white",
            borderRadius: "28px",
            padding: "40px 32px",
            boxShadow: "0 24px 60px rgba(61,43,31,0.1)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>{currentQuestion.emoji}</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 400,
              color: "#3D2B1F",
              marginBottom: "32px",
            }}>
              {currentQuestion.question.replace("{name}", petName)}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      border: `2px solid ${selected ? opt.color : "rgba(61,43,31,0.08)"}`,
                      background: selected ? opt.color + "15" : "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: selected ? opt.color : "#3D2B1F",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{opt.emoji}</span>
                    {opt.label}
                    {selected && <Check size={16} style={{ marginLeft: "auto", color: opt.color }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Symptoms Step */}
        {step === QUESTIONS.length && (
          <div style={{
            background: "white",
            borderRadius: "28px",
            padding: "40px 32px",
            boxShadow: "0 24px 60px rgba(61,43,31,0.1)",
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, color: "#3D2B1F", marginBottom: "8px" }}>
              Any symptoms to flag?
            </h2>
            <p style={{ color: "#8B7B72", fontSize: "14px", marginBottom: "24px" }}>
              Select all that apply — or skip if all clear.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {SYMPTOM_FLAGS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "100px",
                    border: `1.5px solid ${symptoms.includes(s) ? "#6B8F71" : "rgba(61,43,31,0.1)"}`,
                    background: symptoms.includes(s) ? "rgba(107,143,113,0.1)" : "white",
                    color: symptoms.includes(s) ? "#6B8F71" : "#6B5244",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              placeholder={`Any other notes about ${petName} today?`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "1.5px solid rgba(61,43,31,0.1)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#3D2B1F",
                resize: "none",
                height: "80px",
                outline: "none",
                background: "#FAF6EF",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "16px",
                background: "#6B8F71",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(107,143,113,0.3)",
              }}
            >
              {loading ? "Analyzing with AI..." : <>
                <Zap size={18} />
                Submit & Get AI Analysis
              </>}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step > 0 && step < QUESTIONS.length && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              background: "none",
              border: "none",
              color: "#8B7B72",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: "20px auto 0",
              fontSize: "14px",
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
      </div>
    </div>
  );
}


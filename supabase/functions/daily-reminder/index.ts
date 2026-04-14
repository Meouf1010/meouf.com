// ============================================================
// supabase/functions/daily-reminder/index.ts — Edge Function
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const currentHour = new Date().getUTCHours();

  // Get all users whose reminder time matches current UTC hour
  // (In production: handle timezone conversion)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, reminder_time")
    .eq("notification_email", true);

  const today = new Date().toISOString().split("T")[0];
  let reminded = 0;

  for (const profile of profiles || []) {
    // Check if they've already checked in today
    const { data: pets } = await supabase
      .from("pets")
      .select("id, name")
      .eq("owner_id", profile.id)
      .eq("is_active", true);

    for (const pet of pets || []) {
      const { data: log } = await supabase
        .from("daily_logs")
        .select("id")
        .eq("pet_id", pet.id)
        .eq("log_date", today)
        .single();

      if (!log) {
        // Send reminder email via Resend/Postmark
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Meouf <hello@meouf.com>",
            to: profile.email,
            subject: `🐾 ${pet.name}'s daily check-in is ready`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
                <h2 style="color: #3D2B1F;">Good morning, ${profile.full_name?.split(" ")[0] || "there"}! 🌿</h2>
                <p style="color: #6B5244;">It's time for ${pet.name}'s 30-second health check-in.</p>
                <a href="https://meouf.com/checkin" 
                   style="display: inline-block; background: #6B8F71; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                  Start Check-in →
                </a>
                <p style="color: #8B7B72; font-size: 13px; margin-top: 24px;">
                  Early detection saves lives. Your 30 seconds matters. 🐾
                </p>
              </div>
            `,
          }),
        });
        reminded++;
      }
    }
  }

  return new Response(JSON.stringify({ reminded }), {
    headers: { "Content-Type": "application/json" },
  });
});


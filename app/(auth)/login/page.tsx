import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LandingClient from "./LandingClient";

export default async function LoginPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) redirect("/dashboard");
  return <LandingClient />;
}
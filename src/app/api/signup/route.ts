import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { email, password, slug, brideName, groomName } = await req.json();

  const { data, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (signUpError || !data.user) {
    return NextResponse.json(
      { error: signUpError?.message ?? "Sign up failed" },
      { status: 400 }
    );
  }

  const { error: coupleError } = await adminClient.from("couples").insert({
    user_id: data.user.id,
    slug,
    bride_name: brideName,
    groom_name: groomName,
    color_theme: { mode: "light", accent: "#C9A96E" },
    font_style: "serif",
    nav_labels: { wishes: "Well Wishes", schedule: "Schedule", qa: "Q&A", rsvp: "RSVP", gifting: "Gifting" },
    sections_enabled: { wishes: true, schedule: true, qa: true, rsvp: true, gifting: true },
    rsvp_required_fields: { first_name: true, last_name: true, email: true, phone: false, relationship: false, address: false, attending_for: true },
  });

  if (coupleError) {
    await adminClient.auth.admin.deleteUser(data.user.id);
    const message = coupleError.code === "23505"
      ? "That URL is already taken — try a different slug."
      : coupleError.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ userId: data.user.id });
}

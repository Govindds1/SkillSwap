import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type ProfilePayload = {
  fullName?: string;
  email?: string;
  department?: string;
  skills?: string[];
};

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = supabaseServiceRoleKey
    ? createSupabaseAdminClient()
    : supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "full_name, email, department, branch, year, section, skills, profile_photo_url, intro_video_url",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("GET /api/profile error:", error);
    // Return a 200 with null profile so the UI can still render Clerk data.
    return NextResponse.json({ profile: null, error: error.message });
  }

  return NextResponse.json({ profile: data ?? null });
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as ProfilePayload;
  const fullName = body.fullName?.trim();
  const department = body.department?.trim();
  const skills = body.skills ?? [];

  if (!fullName || !department || !Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json(
      { error: "Full Name, Department, and at least one skill are required." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = supabaseServiceRoleKey
    ? createSupabaseAdminClient()
    : supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 500 });
  }
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: body.email?.trim() ?? null,
      full_name: fullName,
      department,
      skills,
    },
    { onConflict: "id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

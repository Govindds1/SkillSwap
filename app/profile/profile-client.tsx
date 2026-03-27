"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ProfileHero } from "@/components/profile-hero";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
  full_name: string | null;
  email: string | null;
  department: string | null;
  branch: string | null;
  year: string | null;
  section: string | null;
  skills: string[] | null;
  profile_photo_url: string | null;
  intro_video_url: string | null;
};

export function ProfileClient() {
  const { user } = useUser();
  const [skills, setSkills] = useState<string[]>([]);
  const [details, setDetails] = useState<ProfileRow | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setSkills([]);
        setDetails(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "full_name, email, department, branch, year, section, skills, profile_photo_url, intro_video_url",
          )
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          setSkills([]);
          setDetails(null);
          return;
        }

        setSkills(data?.skills ?? []);
        setDetails(data ?? null);
      } catch {
        setSkills([]);
        setDetails(null);
      }
    };

    fetchProfile();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-end">
          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <ProfileHero
              fullName={details?.full_name ?? user?.fullName ?? null}
              email={details?.email ?? user?.primaryEmailAddress?.emailAddress ?? null}
              imageUrl={details?.profile_photo_url ?? user?.imageUrl ?? null}
              branch={details?.branch ?? null}
              year={details?.year ?? null}
              department={details?.department ?? null}
              section={details?.section ?? null}
              introVideoUrl={details?.intro_video_url ?? null}
            />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar initialSkills={skills} />
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import type { ProfileCard } from "@/components/explore-feed";
import { initials } from "@/lib/conversations";

function ProfileSpotlightCard({ profile }: { profile: ProfileCard }) {
  const name = profile.full_name?.trim() || "Student";
  const skills = profile.skills ?? [];

  return (
    <Link
      href={`/messages/${profile.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:border-primary hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <Avatar className="h-14 w-14 shrink-0 border-2 border-golden-yellow/30">
            {profile.profile_photo_url ? (
              <AvatarImage src={profile.profile_photo_url} alt="" className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-primary text-base font-semibold text-white">{initials(profile.full_name)}</AvatarFallback>
          </Avatar>
          <ArrowRight className="h-5 w-5 shrink-0 text-golden-yellow opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
        </div>

        <h3 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">{name}</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {profile.branch?.trim() ? `Branch: ${profile.branch}` : "Branch not set"}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[11px] font-medium">
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No skills listed yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProfileGrid({
  title,
  subtitle,
  profiles,
}: {
  title: string;
  subtitle: string;
  profiles: ProfileCard[];
}) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-16 last:mb-0">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h3>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileSpotlightCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export function TopSkillsSection() {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, department, branch, year, profile_photo_url, skills")
        .order("full_name", { ascending: true })
        .limit(6);

      if (cancelled) {
        return;
      }

      if (error) {
        setFetchError(error.message);
        setProfiles([]);
      } else {
        setProfiles((data ?? []) as ProfileCard[]);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const { recommended, topMentors } = useMemo(() => {
    const n = profiles.length;
    if (n === 0) {
      return { recommended: [] as ProfileCard[], topMentors: [] as ProfileCard[] };
    }
    const mid = Math.ceil(n / 2);
    return {
      recommended: profiles.slice(0, mid),
      topMentors: profiles.slice(mid),
    };
  }, [profiles]);

  return (
    <section id="top-skills" className="bg-warm-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            SkillSwap <span className="text-golden-yellow">Community</span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Meet students from your network—tap a card to start a conversation.
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading profiles…</p>
        ) : fetchError ? (
          <p className="text-sm text-red-600">{fetchError}</p>
        ) : profiles.length === 0 ? (
          <p className="text-muted-foreground">No profiles yet. Check back soon.</p>
        ) : (
          <>
            <ProfileGrid
              title="Recommended Skills"
              subtitle="Students offering skills you can learn from—connect and schedule a SkillSwap."
              profiles={recommended}
            />
            <ProfileGrid
              title="Top Mentors"
              subtitle="Active peers ready to help—message them to get started."
              profiles={topMentors}
            />
          </>
        )}
      </div>
    </section>
  );
}

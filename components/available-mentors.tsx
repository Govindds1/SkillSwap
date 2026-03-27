"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, MessageCircle, Search, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProfileCard } from "@/components/explore-feed";
import { initials } from "@/lib/conversations";

export function AvailableMentors() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
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
        .order("full_name", { ascending: true });

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

  const filtered = useMemo(() => {
    let list = profiles.filter((p) => p.id !== user?.id);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => (p.skills ?? []).some((s) => s.toLowerCase().includes(q)));
    }
    return list;
  }, [profiles, search, user?.id]);

  return (
    <section className="mb-12">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Available Mentors</h2>
          <p className="mt-2 text-muted-foreground">Students sharing skills—filter by skill to find a match</p>
        </div>
        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill (e.g. Cybersecurity, UI/UX)"
            className="h-11 border-border bg-white pl-10 pr-3"
            autoComplete="off"
            aria-label="Filter mentors by skill"
          />
        </div>
      </div>

      {fetchError ? (
        <p className="text-sm text-red-600">{fetchError}</p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Loading mentors…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <div className="mb-3 text-4xl" aria-hidden>
            🔍
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {search.trim() ? "No mentors match this skill" : "No mentors yet"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {search.trim()
              ? "Try another skill keyword or clear the search to see everyone."
              : "Check back once more students join SkillSwap."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative flex h-24 items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80">
                <Users className="h-9 w-9 text-white/90" aria-hidden />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-start gap-3">
                  <Avatar className="h-12 w-12 shrink-0 border-2 border-golden-yellow">
                    {item.profile_photo_url ? (
                      <AvatarImage src={item.profile_photo_url} alt="" className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-light-grey text-sm font-semibold text-foreground">
                      {initials(item.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {item.full_name ?? "Student"}
                    </h3>
                  </div>
                </div>

                {(item.skills ?? []).length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(item.skills ?? []).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[11px] font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    No skills listed yet
                  </p>
                )}

                <div className="mt-auto pt-2">
                  <Button asChild className="w-full bg-primary font-semibold text-white hover:bg-primary/90">
                    <Link href={`/messages/${item.id}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

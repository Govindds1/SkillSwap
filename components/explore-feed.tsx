'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export type ProfileCard = {
  id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
  branch: string | null;
  year: string | null;
  profile_photo_url: string | null;
  skills: string[] | null;
};

const departmentColors: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700',
  Design: 'bg-purple-100 text-purple-700',
  Business: 'bg-green-100 text-green-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Product: 'bg-indigo-100 text-indigo-700',
};

function initials(name: string | null | undefined): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface ExploreFeedProps {
  searchQuery?: string;
  department?: string | null;
  category?: string | null;
}

export function ExploreFeed({ searchQuery = '', department = null, category = null }: ExploreFeedProps) {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfiles() {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, department, branch, year, profile_photo_url, skills')
        .order('full_name', { ascending: true });

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

    loadProfiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    let list = profiles.filter((p) => p.id !== user?.id);

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = (p.full_name ?? '').toLowerCase();
        const dept = (p.department ?? '').toLowerCase();
        const branch = (p.branch ?? '').toLowerCase();
        const year = (p.year ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        const skillMatch = (p.skills ?? []).some((s) => s.toLowerCase().includes(q));
        return (
          name.includes(q) ||
          dept.includes(q) ||
          branch.includes(q) ||
          year.includes(q) ||
          email.includes(q) ||
          skillMatch
        );
      });
    }

    if (department) {
      list = list.filter(
        (p) =>
          (p.department ?? '').toLowerCase() === department.toLowerCase() ||
          (p.branch ?? '').toLowerCase().includes(department.toLowerCase()),
      );
    }

    if (category) {
      list = list.filter((p) => (p.skills ?? []).some((s) => s === category || s.includes(category)));
    }

    return list;
  }, [profiles, searchQuery, department, category, user?.id]);

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading students…' : `Showing ${filteredItems.length} student${filteredItems.length !== 1 ? 's' : ''}`}
        </p>
        {fetchError ? <p className="mt-1 text-sm text-red-600">{fetchError}</p> : null}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-muted-foreground">
          Loading profiles…
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters to find students in your network
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="h-28 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden flex items-center justify-center">
                <Users className="h-10 w-10 text-white/90" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-golden-yellow shrink-0">
                    {item.profile_photo_url ? (
                      <AvatarImage src={item.profile_photo_url} alt="" className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-light-grey text-foreground text-sm font-semibold">
                      {initials(item.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.full_name ?? 'Student'}
                    </h3>
                    {item.email ? (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{item.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {item.year ? (
                    <Badge variant="outline" className="text-xs">
                      Year {item.year}
                    </Badge>
                  ) : null}
                  {item.branch ? (
                    <Badge variant="outline" className="text-xs">
                      {item.branch}
                    </Badge>
                  ) : null}
                  {item.department ? (
                    <Badge
                      variant="outline"
                      className={`text-xs ${departmentColors[item.department] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {item.department}
                    </Badge>
                  ) : null}
                </div>

                {(item.skills ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(item.skills ?? []).slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] font-medium">
                        {skill}
                      </Badge>
                    ))}
                    {(item.skills ?? []).length > 4 ? (
                      <Badge variant="outline" className="text-[10px]">
                        +{(item.skills ?? []).length - 4} more
                      </Badge>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    No skills listed yet
                  </p>
                )}

                <div className="mt-auto pt-2">
                  <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 font-semibold">
                    <Link href={`/messages/${item.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

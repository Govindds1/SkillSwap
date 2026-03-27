"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  type ConversationPreview,
  type MessageRow,
  type PeerProfile,
  getConversationPreviewsForUser,
  peerFromMessage,
  snippet,
  initials,
} from "@/lib/conversations";
import { supabase } from "@/lib/supabase";

export default function MessagesInboxPage() {
  const { isLoaded, user } = useUser();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    if (!user?.id) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { conversations: next, error: fetchError } = await getConversationPreviewsForUser(user.id);

    if (fetchError) {
      setError(fetchError);
    } else {
      setError(null);
    }

    setConversations(next);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const meId = user.id;

    const channel = supabase
      .channel(`messages-inbox:${meId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const row = payload.new as MessageRow;
          if (!row?.id) {
            return;
          }
          if (row.sender_id !== meId && row.receiver_id !== meId) {
            return;
          }

          const other = peerFromMessage(row, meId);

          let shouldFetchProfile = false;

          setConversations((prev) => {
            const existing = prev.find((c) => c.peerId === other);
            if (existing && new Date(row.created_at) <= new Date(existing.lastMessage.created_at)) {
              return prev;
            }
            const rest = prev.filter((c) => c.peerId !== other);
            const peerProfile = existing?.peer ?? { full_name: null, profile_photo_url: null };
            shouldFetchProfile = !peerProfile.full_name && !peerProfile.profile_photo_url;
            const merged: ConversationPreview = {
              peerId: other,
              lastMessage: row,
              peer: peerProfile,
            };
            return [merged, ...rest].sort(
              (a, b) =>
                new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime(),
            );
          });

          if (shouldFetchProfile) {
            const { data } = await supabase
              .from("profiles")
              .select("full_name, profile_photo_url")
              .eq("id", other)
              .maybeSingle();

            if (data) {
              const p = data as PeerProfile;
              setConversations((prev) =>
                prev.map((c) => (c.peerId === other ? { ...c, peer: p } : c)),
              );
            }
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-sm text-muted-foreground">Sign in to see your messages.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pb-12 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground">Chats with students in your network</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading conversations…</p>
        ) : error && conversations.length === 0 ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : conversations.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-muted-foreground">No conversations yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore students and start a conversation from their profile card.
            </p>
            <Link href="/explore" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Go to Explore
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {conversations.map((c) => {
              const name = c.peer.full_name?.trim() || "Student";
              const mine = c.lastMessage.sender_id === user.id;
              const prefix = mine ? "You: " : "";
              return (
                <li key={c.peerId}>
                  <Link
                    href={`/messages/${c.peerId}`}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/20"
                  >
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-golden-yellow">
                      {c.peer.profile_photo_url ? (
                        <AvatarImage src={c.peer.profile_photo_url} alt="" className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-light-grey text-sm font-semibold text-foreground">
                        {initials(c.peer.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-semibold text-foreground">{name}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {new Date(c.lastMessage.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {prefix}
                        {snippet(c.lastMessage.content)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {error && conversations.length > 0 ? (
          <p className="mt-3 text-xs text-amber-700">{error}</p>
        ) : null}
      </main>
    </div>
  );
}

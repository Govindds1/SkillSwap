"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ConversationPreview,
  type MessageRow,
  getConversationPreviewsForUser,
  hasUnreadIncomingMessages,
  snippet,
  initials,
} from "@/lib/conversations";
import { supabase } from "@/lib/supabase";

function senderDisplay(
  c: ConversationPreview,
  meId: string,
  clerkImageUrl: string | null | undefined,
  clerkName: string | null | undefined,
): { photo: string | null; label: string } {
  const last = c.lastMessage;
  if (last.sender_id === meId) {
    return {
      photo: clerkImageUrl ?? null,
      label: clerkName?.trim() || "You",
    };
  }
  return {
    photo: c.peer.profile_photo_url,
    label: c.peer.full_name?.trim() || "Student",
  };
}

export function MessagesNavDropdown() {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const refreshUnread = useCallback(async () => {
    if (!user?.id) {
      setHasUnread(false);
      return;
    }
    setHasUnread(await hasUnreadIncomingMessages(user.id));
  }, [user?.id]);

  const load = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setFetchError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    const { conversations, error } = await getConversationPreviewsForUser(user.id, { limit: 3 });
    setItems(conversations);
    if (error) {
      setFetchError(error);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    void refreshUnread();
  }, [refreshUnread]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const meId = user.id;

    const channel = supabase
      .channel(`messages-nav:${meId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          if (!row?.id) {
            return;
          }
          if (row.sender_id !== meId && row.receiver_id !== meId) {
            return;
          }
          void load();
          void refreshUnread();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          if (!row?.id) {
            return;
          }
          if (row.sender_id !== meId && row.receiver_id !== meId) {
            return;
          }
          void refreshUnread();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, load, refreshUnread]);

  if (!isLoaded || !user) {
    return (
      <Link
        href="/messages"
        className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
      >
        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
        Messages
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-foreground outline-none transition-colors hover:text-primary data-[state=open]:text-primary">
        <span className="relative inline-flex shrink-0">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {hasUnread ? (
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-warm-cream"
              aria-label="Unread messages"
            />
          ) : null}
        </span>
        Messages
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="border-b border-border px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">Recent messages</p>
        </div>
        <div className="max-h-[min(24rem,calc(100vh-8rem))] overflow-y-auto py-1">
          {loading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
          ) : fetchError ? (
            <p className="px-3 py-4 text-center text-xs text-red-600">{fetchError}</p>
          ) : items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No messages yet</p>
          ) : (
            items.map((c) => {
              const meId = user.id;
              const { photo, label: senderLabel } = senderDisplay(c, meId, user.imageUrl, user.fullName);
              const peerTitle = c.peer.full_name?.trim() || "Student";
              const prefix = c.lastMessage.sender_id === meId ? "You: " : "";
              return (
                <DropdownMenuItem key={c.peerId} asChild className="cursor-pointer p-0 focus:bg-transparent">
                  <Link
                    href={`/messages/${c.peerId}`}
                    className="flex w-full items-start gap-3 px-3 py-2.5 hover:bg-accent/50"
                  >
                    <Avatar className="h-9 w-9 shrink-0 border border-border" title={senderLabel}>
                      {photo ? <AvatarImage src={photo} alt="" className="object-cover" /> : null}
                      <AvatarFallback className="bg-light-grey text-sm font-semibold text-foreground">
                        {initials(senderLabel)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium text-foreground">{peerTitle}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {prefix}
                        {snippet(c.lastMessage.content, 48)}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-transparent">
          <Link
            href="/messages"
            className="block w-full px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-accent/50"
          >
            View All
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { ScheduleSkillSwapDialog } from "@/components/schedule-skillswap-dialog";
import { supabase } from "@/lib/supabase";
import { markIncomingThreadRead, type MessageRow } from "@/lib/conversations";

function isMessageInThread(row: MessageRow, meId: string, peerId: string) {
  return (
    (row.sender_id === meId && row.receiver_id === peerId) ||
    (row.sender_id === peerId && row.receiver_id === meId)
  );
}

export default function ConversationPage() {
  const params = useParams();
  const peerId = typeof params.userId === "string" ? params.userId : "";
  const { isLoaded, user } = useUser();

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [peerName, setPeerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const loadConversation = useCallback(async () => {
    if (!user?.id || !peerId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const meId = user.id;

    const { data, error: fetchError } = await supabase
      .from("messages")
      .select("id, sender_id, receiver_id, content, created_at")
      .or(
        `and(sender_id.eq.${meId},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${meId})`,
      )
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setMessages([]);
    } else {
      setMessages((data ?? []) as MessageRow[]);
      void markIncomingThreadRead(meId, peerId);
    }

    setLoading(false);
  }, [user?.id, peerId]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (!peerId) {
      return;
    }

    let cancelled = false;

    async function loadPeer() {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", peerId).maybeSingle();

      if (!cancelled && data) {
        setPeerName((data as { full_name: string | null }).full_name ?? null);
      }
    }

    loadPeer();

    return () => {
      cancelled = true;
    };
  }, [peerId]);

  useEffect(() => {
    if (!user?.id || !peerId) {
      return;
    }

    const meId = user.id;

    const channel = supabase
      .channel(`messages:${meId}:${peerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          if (!row?.id) {
            return;
          }

          if (!isMessageInThread(row, meId, peerId)) {
            return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) {
              return prev;
            }
            return [...prev, row].sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            );
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, peerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !isLoaded || !user?.id || !peerId || sending) {
      return;
    }

    setSending(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: peerId,
        content: text,
      })
      .select("id, sender_id, receiver_id, content, created_at")
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === (data as MessageRow).id)) {
          return prev;
        }
        return [...prev, data as MessageRow].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
      });
      setInput("");
    }

    setSending(false);
  };

  if (!peerId) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-sm text-muted-foreground">Invalid conversation.</p>
        </main>
      </div>
    );
  }

  const displayName = peerName?.trim() || `Student${peerId ? ` (${peerId.slice(0, 8)}…)` : ""}`;

  return (
    <div className="flex min-h-screen flex-col bg-warm-cream">
      <Header />

      {/* Chat shell: header + scrollable messages + fixed input */}
      <div className="flex flex-1 flex-col overflow-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-4">
          {/* Peer header */}
          <div className="mb-3 shrink-0 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
            <h1 className="text-lg font-semibold text-primary">{displayName}</h1>
            <p className="text-xs text-muted-foreground">Direct message</p>
          </div>

          {/* Speech bubbles — scrollable */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-muted/30 p-4"
          >
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading messages…</p>
            ) : error && messages.length === 0 ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((m) => {
                  const isMine = m.sender_id === user?.id;
                  return (
                    <li key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMine
                            ? "bg-primary text-white"
                            : "border border-border bg-white text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            isMine ? "text-white/80" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(m.created_at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {error && messages.length > 0 ? (
          <p className="mx-auto w-full max-w-2xl px-4 pb-1 text-xs text-red-600">{error}</p>
        ) : null}

        {/* Fixed bottom input */}
        <form
          onSubmit={handleSend}
          className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-warm-cream/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoaded && user ? "Type a message…" : "Sign in to send…"}
              disabled={!isLoaded || !user || sending}
              className="min-w-0 flex-1 rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              autoComplete="off"
            />
            {isLoaded && user ? (
              <ScheduleSkillSwapDialog
                mentorId={user.id}
                studentId={peerId}
                disabled={sending}
                onError={setError}
                onMessageInserted={(row) => {
                  setMessages((prev) => {
                    if (prev.some((m) => m.id === row.id)) {
                      return prev;
                    }
                    return [...prev, row].sort(
                      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
                    );
                  });
                }}
              />
            ) : null}
            <button
              type="submit"
              disabled={!isLoaded || !user || sending || !input.trim()}
              className="shrink-0 rounded-xl bg-golden-yellow px-5 py-2.5 text-sm font-semibold text-dark-grey hover:bg-golden-yellow/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

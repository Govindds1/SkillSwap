import { supabase } from "@/lib/supabase";

export type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read?: boolean | null;
};

export type PeerProfile = {
  full_name: string | null;
  profile_photo_url: string | null;
};

export type ConversationPreview = {
  peerId: string;
  lastMessage: MessageRow;
  peer: PeerProfile;
};

export function peerFromMessage(m: MessageRow, meId: string): string {
  return m.sender_id === meId ? m.receiver_id : m.sender_id;
}

export function groupConversations(rows: MessageRow[], meId: string): Map<string, MessageRow> {
  const byPeer = new Map<string, MessageRow>();
  for (const m of rows) {
    const other = peerFromMessage(m, meId);
    const existing = byPeer.get(other);
    if (!existing || new Date(m.created_at) > new Date(existing.created_at)) {
      byPeer.set(other, m);
    }
  }
  return byPeer;
}

export function sortConversations(map: Map<string, MessageRow>): [string, MessageRow][] {
  return [...map.entries()].sort(
    (a, b) => new Date(b[1].created_at).getTime() - new Date(a[1].created_at).getTime(),
  );
}

export async function getConversationPreviewsForUser(
  meId: string,
  options?: { limit?: number },
): Promise<{ conversations: ConversationPreview[]; error: string | null }> {
  const { data: rows, error: fetchError } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, created_at")
    .or(`sender_id.eq.${meId},receiver_id.eq.${meId}`)
    .order("created_at", { ascending: false });

  if (fetchError) {
    return { conversations: [], error: fetchError.message };
  }

  const list = (rows ?? []) as MessageRow[];
  const grouped = groupConversations(list, meId);
  const sorted = sortConversations(grouped);
  const limited = options?.limit != null ? sorted.slice(0, options.limit) : sorted;

  const peerIds = limited.map(([id]) => id);
  if (peerIds.length === 0) {
    return { conversations: [], error: null };
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, profile_photo_url")
    .in("id", peerIds);

  const profileById = new Map(
    ((profiles ?? []) as { id: string; full_name: string | null; profile_photo_url: string | null }[]).map(
      (p) => [p.id, { full_name: p.full_name, profile_photo_url: p.profile_photo_url }],
    ),
  );

  const conversations: ConversationPreview[] = limited.map(([peerId, lastMessage]) => ({
    peerId,
    lastMessage,
    peer: profileById.get(peerId) ?? { full_name: null, profile_photo_url: null },
  }));

  return { conversations, error: profileError?.message ?? null };
}

/** True if the user has any incoming messages not yet marked read. */
export async function hasUnreadIncomingMessages(meId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", meId)
    .eq("is_read", false);

  if (error) {
    return false;
  }
  return (count ?? 0) > 0;
}

/** Mark incoming messages in a 1:1 thread as read (viewer is receiver). */
export async function markIncomingThreadRead(meId: string, peerId: string): Promise<void> {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", meId)
    .eq("sender_id", peerId)
    .eq("is_read", false);
}

export function snippet(text: string, max = 72): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max - 1)}…`;
}

export function initials(name: string | null | undefined): string {
  if (!name?.trim()) {
    return "?";
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

"use client";

import { useCallback, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { MessageRow } from "@/lib/conversations";

function defaultDateTimeLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 60);
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildInviteMessage(scheduledAt: Date, link: string): string {
  const timeLabel = scheduledAt.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `📅 New Session Invited!\nTime: ${timeLabel}\nLink: ${link}`;
}

type ScheduleSkillSwapDialogProps = {
  mentorId: string;
  studentId: string;
  disabled?: boolean;
  onMessageInserted: (row: MessageRow) => void;
  onError: (message: string | null) => void;
};

export function ScheduleSkillSwapDialog({
  mentorId,
  studentId,
  disabled,
  onMessageInserted,
  onError,
}: ScheduleSkillSwapDialogProps) {
  const [open, setOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setScheduledAt(defaultDateTimeLocal());
    setMeetingLink("");
    setInviteError(null);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      resetForm();
      onError(null);
    }
  };

  const handleSendInvite = async () => {
    onError(null);
    setInviteError(null);

    const trimmedLink = meetingLink.trim();
    if (!scheduledAt) {
      setInviteError("Please choose a date and time.");
      return;
    }
    if (!trimmedLink) {
      setInviteError("Add a Google Meet or Zoom link.");
      return;
    }

    const startsAt = new Date(scheduledAt);
    if (Number.isNaN(startsAt.getTime())) {
      setInviteError("Invalid date or time.");
      return;
    }

    setInviting(true);

    const { error: sessionError } = await supabase.from("sessions").insert({
      mentor_id: mentorId,
      student_id: studentId,
      scheduled_at: startsAt.toISOString(),
      meeting_link: trimmedLink,
    });

    if (sessionError) {
      setInviteError(sessionError.message);
      setInviting(false);
      return;
    }

    const content = buildInviteMessage(startsAt, trimmedLink);

    const { data: msg, error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: mentorId,
        receiver_id: studentId,
        content,
      })
      .select("id, sender_id, receiver_id, content, created_at")
      .single();

    if (messageError) {
      onError(messageError.message);
      setInviting(false);
      return;
    }

    if (msg) {
      onMessageInserted(msg as MessageRow);
    }

    setInviting(false);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title="Schedule SkillSwap"
          className="flex h-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary/35 bg-white px-3 text-primary shadow-sm transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarDays className="h-5 w-5" aria-hidden />
          <span className="sr-only">Schedule SkillSwap</span>
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-md border-2 border-primary/25 bg-warm-cream p-0 shadow-xl sm:max-w-md"
      >
        <div className="border-b border-primary/15 bg-primary px-6 py-5 text-white">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Schedule SkillSwap</DialogTitle>
            <DialogDescription className="text-sm text-white/85">
              Pick a time and share your Meet or Zoom link. We&apos;ll notify them in chat.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="skillswap-datetime" className="text-foreground">
              Date &amp; time
            </Label>
            <Input
              id="skillswap-datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-11 border-primary/25 bg-white text-foreground focus-visible:ring-primary/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skillswap-link" className="text-foreground">
              Google Meet / Zoom link
            </Label>
            <Input
              id="skillswap-link"
              type="url"
              inputMode="url"
              placeholder="https://meet.google.com/... or https://zoom.us/j/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="h-11 border-primary/25 bg-white text-foreground focus-visible:ring-primary/40"
              autoComplete="off"
            />
          </div>
          {inviteError ? <p className="text-sm text-red-600">{inviteError}</p> : null}
        </div>

        <DialogFooter className="gap-2 border-t border-primary/10 bg-white/80 px-6 py-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => setOpen(false)}
            disabled={inviting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-golden-yellow font-semibold text-dark-grey shadow-sm hover:bg-golden-yellow/90"
            onClick={() => void handleSendInvite()}
            disabled={inviting}
          >
            {inviting ? "Sending…" : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

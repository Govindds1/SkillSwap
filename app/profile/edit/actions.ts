"use server";

import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function deleteVideo(fileKey: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!fileKey || typeof fileKey !== "string") {
    throw new Error("Missing fileKey");
  }

  // 1) Delete from UploadThing
  const utapi = new UTApi();
  await utapi.deleteFiles(fileKey);

  // 2) Clear intro_video_url in Supabase for this user
  // Prefer service role for server-side update.
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ intro_video_url: null })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}


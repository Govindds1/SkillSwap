import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  introVideo: f({ video: { maxFileSize: "16MB", maxFileCount: 1 } }).onUploadComplete(async () => {
    // You can persist metadata to Supabase here later if needed.
  }),
  profilePhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).onUploadComplete(async () => {
    // You can persist metadata to Supabase here later if needed.
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;


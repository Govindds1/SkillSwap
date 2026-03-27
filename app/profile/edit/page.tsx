"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
// Browser client (NEXT_PUBLIC_SUPABASE_ANON_KEY) — not the service-role admin client.
import { supabase } from "@/lib/supabase";
import { UploadButton } from "@/lib/uploadthing";
import { Camera, Trash2, Video } from "lucide-react";
import { deleteVideo } from "./actions";

export default function EditProfilePage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [introVideoKey, setIntroVideoKey] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [isProfilePhotoUploading, setIsProfilePhotoUploading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      branch.trim().length > 0 &&
      year.trim().length > 0 &&
      section.trim().length > 0 &&
      profilePhotoUrl.trim().length > 0
    );
  }, [branch, fullName, profilePhotoUrl, section, year]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      }
      return [...prev, skill];
    });
  };

  useEffect(() => {
    if (user?.id) {
      console.log("Clerk ID:", user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      try {
        const { data, error } = await supabase.from("available_skills").select("name").order("name");

        if (error) {
          throw new Error(error.message);
        }

        const names = (data ?? [])
          .map((row) => (row as { name?: unknown }).name)
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0);

        setAvailableSkills(Array.from(new Set(names)));
      } catch {
        setAvailableSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setIsSubmitting(true);
  setErrorMessage("");

  try {
    // 1. Check if photo is there
    if (!profilePhotoUrl || profilePhotoUrl.trim() === "") {
      setErrorMessage("Please upload a profile photo to continue.");
      setIsSubmitting(false);
      return;
    }

    // 2. Prepare the data (FIXING THE TYPES)
    const profileData = {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      full_name: fullName.trim(),
      branch: branch.trim(),
      year: parseInt(year) || 0, // CRITICAL: Converts string to Number for Supabase
      section: section.trim(),
      skills: skills, // Ensure this is the array of strings
      profile_photo_url: profilePhotoUrl.trim(),
      intro_video_url: introVideoUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    console.log("Sending to Supabase:", profileData);

    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" });

    if (error) throw error;

    // 3. Hard Redirect to refresh all data
    alert("Profile Saved!");
    window.location.href = "/profile";

  } catch (err: any) {
    console.error("Save Error:", err);
    setErrorMessage(err.message || "Something went wrong.");
    alert("Save Failed: " + err.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your details so learners can discover and connect with you.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Personal Details</h2>
            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-3">
                <p className="mb-2 text-sm font-medium text-foreground">Profile Photo *</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-golden-yellow bg-muted flex items-center justify-center">
                    {profilePhotoUrl ? (
                      <img src={profilePhotoUrl} alt="Profile photo" className="h-full w-full object-cover" />
                    ) : isProfilePhotoUploading ? (
                      <span className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5 text-primary/70" />
                    )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground">Upload a clear headshot. Images up to 4MB.</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <UploadButton
                      endpoint="profilePhoto"
                      onUploadBegin={() => {
                        setIsProfilePhotoUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        alert("Upload Finished!");
                        const url = res[0]?.url;
                        if (!url) {
                          setIsProfilePhotoUploading(false);
                          setErrorMessage("Upload finished but no URL was returned.");
                          alert("Upload finished but no URL was returned.");
                          return;
                        }
                        console.log("Upload successful! URL:", url);
                        setProfilePhotoUrl(res[0].url);
                        setIsProfilePhotoUploading(false);
                        setErrorMessage("");
                      }}
                      onUploadError={(error) => {
                        setIsProfilePhotoUploading(false);
                        setErrorMessage(error.message ?? "Failed to upload profile photo.");
                        alert(error.message ?? "Failed to upload profile photo.");
                      }}
                      appearance={{
                        button:
                          "ut-ready:bg-[#EFA949] ut-ready:text-white ut-ready:hover:bg-[#EFA949]/90 ut-ready:rounded-xl ut-ready:px-4 ut-ready:py-2 ut-ready:text-sm ut-ready:font-semibold ut-ready:shadow-sm",
                        allowedContent: "hidden",
                      }}
                      content={{
                        button: () => (
                          <span className="inline-flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Upload Profile Photo
                          </span>
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label htmlFor="branch" className="mb-2 block text-sm font-medium text-foreground">
                  Branch *
                </label>
                <input
                  id="branch"
                  type="text"
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label htmlFor="year" className="mb-2 block text-sm font-medium text-foreground">
                  Year *
                </label>
                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label htmlFor="section" className="mb-2 block text-sm font-medium text-foreground">
                  Section *
                </label>
                <input
                  id="section"
                  type="text"
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-primary/5 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Skill Selection</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose only the skills you are comfortable teaching to others.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSkillsDropdownOpen((v) => !v)}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-warm-cream transition-colors flex items-center justify-between"
                aria-expanded={skillsDropdownOpen}
                aria-haspopup="listbox"
              >
                <span>
                  {skills.length > 0 ? `${skills.length} selected` : "Select skills"}
                </span>
                <span className="text-primary">{skillsDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {skillsDropdownOpen ? (
                <div className="mt-2 rounded-lg border border-border bg-white shadow-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {skillsLoading ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Loading skills...</div>
                    ) : availableSkills.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No skills available.
                      </div>
                    ) : (
                      availableSkills.map((skill) => (
                        <label
                          key={skill}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-warm-cream"
                        >
                          <input
                            type="checkbox"
                            checked={skills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="h-4 w-4"
                          />
                          <span className="text-foreground">{skill}</span>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border bg-primary/5 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      {skills.length} selected
                    </p>
                    <button
                      type="button"
                      onClick={() => setSkillsDropdownOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : null}

              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-golden-yellow/40 bg-golden-yellow/10 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Intro Video</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a short intro video link so others can know you better.
            </p>
            <div className="mt-4 space-y-4">
              {introVideoUrl ? (
                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Current intro video</p>
                      <p className="mt-1 text-xs text-muted-foreground break-all">{introVideoUrl}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!introVideoKey || isSubmitting}
                      onClick={async () => {
                        try {
                          setErrorMessage("");
                          if (!introVideoKey) {
                            setErrorMessage("Missing video file key. Re-upload the video to enable deletion.");
                            return;
                          }
                          await deleteVideo(introVideoKey);
                          setIntroVideoUrl("");
                          setIntroVideoKey("");
                        } catch (e) {
                          setErrorMessage(e instanceof Error ? e.message : "Failed to delete video.");
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Video
                    </button>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl bg-black/5">
                    <video
                      src={introVideoUrl}
                      className="w-full aspect-video object-cover"
                      autoPlay
                      muted
                      playsInline
                      loop
                      controls
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <UploadButton
                  endpoint="introVideo"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url ?? "";
                    const key = (res?.[0] as { key?: string } | undefined)?.key ?? "";
                    if (url) {
                      setIntroVideoUrl(url);
                      setIntroVideoKey(key);
                    }
                  }}
                  onUploadError={(error) => {
                    setErrorMessage(error.message ?? "Failed to upload intro video.");
                  }}
                  appearance={{
                    button:
                      "ut-ready:rounded-xl ut-ready:border ut-ready:border-primary ut-ready:bg-white ut-ready:text-primary ut-ready:hover:bg-primary/5 ut-ready:px-4 ut-ready:py-2 ut-ready:text-sm ut-ready:font-semibold",
                    allowedContent: "hidden",
                  }}
                  content={{
                    button: () => (
                      <span className="inline-flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Upload Intro Video (optional)
                      </span>
                    ),
                  }}
                />
                <p className="mt-2 text-xs text-muted-foreground">Video up to 16MB.</p>
              </div>

              <div>
                <label htmlFor="introVideoUrl" className="block text-sm font-medium text-foreground">
                  Intro Video URL
                </label>
                <input
                  id="introVideoUrl"
                  type="url"
                  value={introVideoUrl}
                  onChange={(event) => setIntroVideoUrl(event.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </section>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <div className="flex items-center justify-between gap-3">
            {!profilePhotoUrl.trim() ? (
              <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                Please upload a profile photo to continue.
              </span>
            ) : (
              <span />
            )}
          </div>

          <button
            type="submit"
            disabled={!isLoaded || isSubmitting || !isValid}
            className="inline-flex w-full items-center justify-center rounded-md bg-golden-yellow px-4 py-3 text-sm font-semibold text-dark-grey hover:bg-golden-yellow/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving profile..." : "Save Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}


"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "UI/UX Design",
  "Public Speaking",
  "Data Analysis",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => {
    return fullName.trim().length > 0 && department.trim().length > 0 && skills.length > 0;
  }, [department, fullName, skills.length]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      }
      return [...prev, skill];
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!canSubmit) {
      setErrorMessage("Please complete all fields and select at least one skill.");
      return;
    }

    if (!isLoaded || !user) {
      setErrorMessage("You must be signed in to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: fullName.trim(),
          email: user.primaryEmailAddress?.emailAddress ?? "",
          department: department.trim(),
          skills,
        },
        { onConflict: "id" },
      );

      if (error) {
        throw new Error(error.message || "Failed to save profile.");
      }

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-foreground">Complete your profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us a little about yourself to get started.
          </p>

          <form className="mt-6 space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="department" className="mb-2 block text-sm font-medium text-foreground">
                Department
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. CSE, ECE, Mechanical"
              />
            </div>

            <div>
              <p className="mb-2 block text-sm font-medium text-foreground">Skills</p>
              <p className="mb-3 text-xs text-muted-foreground">Select one or more skills.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SKILL_OPTIONS.map((skill) => (
                  <label
                    key={skill}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="h-4 w-4"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit || !isLoaded}
              className="inline-flex w-full items-center justify-center rounded-md bg-golden-yellow px-4 py-2 text-sm font-semibold text-dark-grey disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save and continue"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

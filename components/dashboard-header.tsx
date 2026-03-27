"use client";

import { useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { user, isLoaded } = useUser();

  const firstName =
    user?.firstName?.trim() ||
    user?.fullName?.trim().split(/\s+/)[0] ||
    null;

  if (!isLoaded) {
    return <div className="mb-10 h-20 max-w-2xl animate-pulse rounded-2xl bg-muted/40" aria-hidden />;
  }

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
        Welcome back
        {firstName ? (
          <>
            , <span className="text-primary">{firstName}</span>
          </>
        ) : user ? (
          <>
            , <span className="text-primary">there</span>
          </>
        ) : null}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Discover mentors from your network and message them to swap skills.
      </p>
    </div>
  );
}

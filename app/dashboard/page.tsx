"use client";

import { Header } from "@/components/header";
import { DashboardHeader } from "@/components/dashboard-header";
import { AvailableMentors } from "@/components/available-mentors";
import { Footer } from "@/components/footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <DashboardHeader />
          <AvailableMentors />
        </div>
      </main>

      <Footer />
    </div>
  );
}

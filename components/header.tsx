'use client';

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { MessagesNavDropdown } from '@/components/messages-nav-dropdown';

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-warm-cream border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              className="h-8 w-8"
            >
              {/* Teal curved mark */}
              <path
                d="M 20 30 Q 15 50 25 70"
                stroke="#184A48"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold">
              <span className="text-primary">Skill</span>
              <span className="text-golden-yellow">Swap</span>
            </span>
          </Link>

          {/* Navigation and CTA */}
          <nav className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
              <Link
                href="/dashboard"
                className="hidden text-foreground hover:text-primary transition-colors md:inline"
              >
                Dashboard
              </Link>
              <Link
                href="/explore"
                className="hidden text-foreground hover:text-primary transition-colors md:inline"
              >
                Explore
              </Link>
              <MessagesNavDropdown />
              <Link
                href="/profile"
                className="hidden text-foreground hover:text-primary transition-colors md:inline"
              >
                Profile
              </Link>
            </div>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <Button
                asChild
                className="bg-golden-yellow text-dark-grey hover:bg-opacity-90 font-semibold"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

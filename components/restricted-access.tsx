'use client';

import { Lock, Mail, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface RestrictedAccessProps {
  attemptedEmail?: string;
  signOutButton?: ReactNode;
}

export function RestrictedAccess({ attemptedEmail, signOutButton }: RestrictedAccessProps) {
  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Illustration */}
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-golden-yellow/20 rounded-full blur-2xl" />
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-lg">
              <Lock className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-golden-yellow">Restricted</span> Access
          </h1>
          <p className="text-muted-foreground">
            SkillSwap is currently available for SRM Institute of Science and Technology students only.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <Mail className="w-5 h-5 text-primary mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Email Not Recognized</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You tried to sign up with:
              </p>
              <div className="bg-warm-cream rounded-lg px-4 py-2 text-sm font-mono text-primary break-all">
                {attemptedEmail || 'your-email@example.com'}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">To access SkillSwap:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">1.</span>
                <span>Use your official SRM email (<strong>@srmist.edu.in</strong>)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">2.</span>
                <span>Verify you are currently enrolled at SRM Institute</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">3.</span>
                <span>Complete the verification process in your email</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {signOutButton ?? (
            <Button className="w-full bg-golden-yellow text-dark-grey hover:bg-golden-yellow/90 font-semibold py-3 h-auto flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Try Another Email
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 py-3 h-auto">
            Contact Support
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-primary/5 rounded-xl text-center text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <p className="font-semibold text-primary mb-1">Why SRM Email Only?</p>
          <p>
            We verify access to protect student privacy and ensure our community remains connected to the campus.
          </p>
        </div>
      </div>
    </div>
  );
}

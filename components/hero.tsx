'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-warm-cream pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Keep Your Skills <span className="text-golden-yellow">on Track,</span> Together
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect with fellow students to exchange skills. Learn what you want, teach what you know. Build a community of learners and educators.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-primary mb-1">5K+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-golden-yellow mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Skills Exchanged</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-golden-yellow mb-1">10K+</div>
                <div className="text-sm text-muted-foreground">Peer Reviews</div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-golden-yellow text-dark-grey hover:bg-opacity-90 font-semibold text-base"
            >
              Join with College Email
            </Button>
          </div>

          {/* Right Visual - Bento Grid */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large Featured Card */}
              <div className="col-span-2 h-48 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 text-4xl">✨</div>
                  <div className="absolute bottom-8 right-6 text-3xl">📚</div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl font-bold">Learn Anything</div>
                  <div className="text-sm opacity-90">From Your Peers</div>
                </div>
              </div>

              {/* Small Cards */}
              <div className="h-32 bg-golden-yellow rounded-xl flex flex-col items-center justify-center text-center p-4 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-semibold text-dark-grey text-sm">Design</div>
              </div>
              <div className="h-32 bg-light-grey rounded-xl flex flex-col items-center justify-center text-center p-4 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">💻</div>
                <div className="font-semibold text-foreground text-sm">Coding</div>
              </div>
              <div className="h-32 bg-light-grey rounded-xl flex flex-col items-center justify-center text-center p-4 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">📝</div>
                <div className="font-semibold text-foreground text-sm">Writing</div>
              </div>
              <div className="h-32 bg-golden-yellow rounded-xl flex flex-col items-center justify-center text-center p-4 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">🎵</div>
                <div className="font-semibold text-dark-grey text-sm">Music</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

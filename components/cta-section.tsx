'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-warm-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Background gradient with teal primary and golden yellow accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-12 text-5xl opacity-40">✨</div>
          <div className="absolute bottom-12 left-8 text-6xl opacity-30">⭐</div>
          <div className="absolute top-1/2 right-8 text-4xl opacity-20">📚</div>

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Start <br />
              Your Learning Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who are already exchanging skills and growing together. Sign up with your college email and start today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-golden-yellow text-dark-grey hover:bg-opacity-90 font-semibold text-base group"
              >
                Join with College Email
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold text-base"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
              <div className="text-white/80 text-sm font-medium">
                <div className="text-xl font-bold">5K+</div>
                Active Users
              </div>
              <div className="w-1 h-8 bg-white/20"></div>
              <div className="text-white/80 text-sm font-medium">
                <div className="text-xl font-bold">500+</div>
                Skills Shared
              </div>
              <div className="w-1 h-8 bg-white/20"></div>
              <div className="text-white/80 text-sm font-medium">
                <div className="text-xl font-bold">98%</div>
                Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

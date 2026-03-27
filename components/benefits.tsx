'use client';

import { useEffect, useState, useRef } from 'react';

export function BenefitsSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const index = parseInt(element.dataset.index || '0');
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('[data-index]');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      title: 'Learn Together',
      description: 'Exchange knowledge with peers and grow your skills in a supportive community environment.',
      icon: '🤝',
      color: 'from-primary to-primary/80',
    },
    {
      title: 'Flexible Schedule',
      description: 'Set your own pace and availability. Learn when it works best for your schedule.',
      icon: '⏰',
      color: 'from-golden-yellow to-golden-yellow/80',
    },
    {
      title: 'Real Experience',
      description: 'Get practical, hands-on learning directly from students with real-world experience.',
      icon: '⭐',
      color: 'from-primary to-primary/80',
    },
  ];

  return (
    <section id="benefits" className="py-16 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-golden-yellow">SkillSwap?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We believe in peer-to-peer learning. Our platform connects students who want to teach with students who want to learn.
          </p>
        </div>

        {/* Bento Grid - 3 Block Cluster */}
        <div ref={sectionRef} className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              data-index={idx}
              className={`relative rounded-2xl overflow-hidden transition-all duration-700 transform ${
                visibleItems.includes(idx)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Curtain Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/50 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className={`relative bg-gradient-to-br ${benefit.color} p-8 rounded-2xl h-80 flex flex-col justify-between text-white hover:shadow-xl transition-all duration-300 group`}>
                <div>
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-base opacity-95 leading-relaxed">{benefit.description}</p>
                </div>

                {/* Bottom accent */}
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                  <div className="w-2 h-2 bg-white rounded-full opacity-25"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

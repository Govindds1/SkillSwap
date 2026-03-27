'use client';

import { useEffect, useState, useRef } from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
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

    const items = sectionRef.current?.querySelectorAll('[data-testimonial]');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      text: 'I learned UI/UX design from a peer on SkillSwap and it changed my career path. The personalized teaching approach was exactly what I needed.',
      rating: 5,
      avatar: '👩‍💻',
    },
    {
      name: 'Michael Chen',
      role: 'Business Student',
      text: 'Teaching Python to other students while learning digital marketing was the perfect exchange. The community is so supportive and genuine.',
      rating: 5,
      avatar: '👨‍🎓',
    },
    {
      name: 'Emma Davis',
      role: 'Creative Arts Student',
      text: 'Found my graphic design mentor through SkillSwap. The platform made it so easy to connect with someone who understood my learning style.',
      rating: 5,
      avatar: '👩‍🎨',
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-golden-yellow">Community</span> Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Real stories from students who transformed their learning journey with SkillSwap.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={sectionRef}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              data-testimonial
              data-index={idx}
              className={`rounded-xl border border-border bg-white p-8 hover:shadow-lg transition-all duration-300 transform ${
                visibleItems.includes(idx)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-golden-yellow text-golden-yellow"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Session {
  id: string;
  title: string;
  instructor: string;
  avatar: string;
  time: string;
  duration: string;
  attendees: number;
  skill: string;
  zoomLink: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Advanced React Hooks Masterclass',
    instructor: 'Sarah Chen',
    avatar: 'SC',
    time: 'Today at 6:00 PM',
    duration: '90 min',
    attendees: 12,
    skill: 'React',
    zoomLink: 'https://zoom.us/j/123456789'
  },
  {
    id: '2',
    title: 'Product Design Sprint Workshop',
    instructor: 'Marcus Williams',
    avatar: 'MW',
    time: 'Tomorrow at 2:00 PM',
    duration: '120 min',
    attendees: 8,
    skill: 'Design',
    zoomLink: 'https://zoom.us/j/987654321'
  },
  {
    id: '3',
    title: 'Python Data Science Fundamentals',
    instructor: 'Elena Rodriguez',
    avatar: 'ER',
    time: 'Friday at 7:00 PM',
    duration: '60 min',
    attendees: 15,
    skill: 'Python',
    zoomLink: 'https://zoom.us/j/456789123'
  },
  {
    id: '4',
    title: 'Content Writing for Social Media',
    instructor: 'James Park',
    avatar: 'JP',
    time: 'Saturday at 10:00 AM',
    duration: '75 min',
    attendees: 20,
    skill: 'Writing',
    zoomLink: 'https://zoom.us/j/789123456'
  },
  {
    id: '5',
    title: 'UI/UX Design Principles',
    instructor: 'Priya Kapoor',
    avatar: 'PK',
    time: 'Sunday at 3:00 PM',
    duration: '90 min',
    attendees: 10,
    skill: 'Design',
    zoomLink: 'https://zoom.us/j/321654987'
  },
  {
    id: '6',
    title: 'JavaScript ES6+ Deep Dive',
    instructor: 'Tom Anderson',
    avatar: 'TA',
    time: 'Monday at 5:00 PM',
    duration: '105 min',
    attendees: 14,
    skill: 'JavaScript',
    zoomLink: 'https://zoom.us/j/654987321'
  }
];

const skillColors: Record<string, string> = {
  'React': 'bg-blue-100 text-blue-700',
  'Design': 'bg-purple-100 text-purple-700',
  'Python': 'bg-green-100 text-green-700',
  'Writing': 'bg-pink-100 text-pink-700',
  'JavaScript': 'bg-yellow-100 text-yellow-700',
};

export function UpcomingSessions() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Live Sessions</h2>
        <p className="text-muted-foreground">Join skill-sharing sessions with the community</p>
      </div>

      <div
        className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {mockSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
            onMouseEnter={() => setHoveredId(session.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Header with gradient */}
            <div className={`h-32 bg-gradient-to-br ${
              session.skill === 'React' ? 'from-blue-400 to-blue-600' :
              session.skill === 'Design' ? 'from-purple-400 to-purple-600' :
              session.skill === 'Python' ? 'from-green-400 to-green-600' :
              session.skill === 'Writing' ? 'from-pink-400 to-pink-600' :
              'from-yellow-400 to-yellow-600'
            } relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 text-2xl">🎓</div>
              </div>
            </div>

            <div className="p-6">
              {/* Instructor */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-white font-semibold text-sm">
                    {session.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground">{session.instructor}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2">
                {session.title}
              </h3>

              {/* Meta info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {session.time}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {session.duration}
                </Badge>
              </div>

              {/* Skill tag and attendees */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={`text-xs ${skillColors[session.skill] || 'bg-gray-100 text-gray-700'}`}>
                  {session.skill}
                </Badge>
                <span className="text-xs text-muted-foreground">{session.attendees} attending</span>
              </div>

              {/* Join Button */}
              <Button
                className="w-full bg-golden-yellow text-dark-grey hover:bg-opacity-90 font-semibold"
                onClick={() => window.open(session.zoomLink, '_blank')}
              >
                Join via Zoom
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

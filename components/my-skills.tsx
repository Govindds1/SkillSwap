'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  endorsements: number;
  category: string;
}

const mockSkills: Skill[] = [
  { id: '1', name: 'React', level: 'Advanced', endorsements: 24, category: 'Frontend' },
  { id: '2', name: 'UI/UX Design', level: 'Advanced', endorsements: 18, category: 'Design' },
  { id: '3', name: 'Product Strategy', level: 'Intermediate', endorsements: 12, category: 'Business' },
  { id: '4', name: 'JavaScript', level: 'Advanced', endorsements: 31, category: 'Programming' },
  { id: '5', name: 'Figma', level: 'Intermediate', endorsements: 15, category: 'Design' },
  { id: '6', name: 'Node.js', level: 'Intermediate', endorsements: 9, category: 'Backend' },
  { id: '7', name: 'Content Writing', level: 'Advanced', endorsements: 22, category: 'Writing' },
  { id: '8', name: 'Python', level: 'Beginner', endorsements: 5, category: 'Programming' },
];

const levelColors: Record<string, string> = {
  'Beginner': 'bg-blue-100 text-blue-700',
  'Intermediate': 'bg-amber-100 text-amber-700',
  'Advanced': 'bg-emerald-100 text-emerald-700',
};

export function MySkills() {
  const [skills, setSkills] = useState(mockSkills);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">My Skills</h2>
          <p className="text-muted-foreground">You have {skills.length} skills listed</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          + Add Skill
        </Button>
      </div>

      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="bg-white border border-border rounded-2xl p-8">
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-2 bg-light-grey hover:bg-opacity-80 rounded-full px-5 py-3 transition-all duration-300 hover:shadow-md"
              >
                <div>
                  <div className="font-semibold text-foreground text-sm">{skill.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${levelColors[skill.level] || ''}`}
                    >
                      {skill.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {skill.endorsements} endorsements
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="ml-2 p-1 rounded-full hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove skill"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No skills added yet</p>
              <Button className="bg-primary text-white hover:bg-primary/90">
                Add Your First Skill
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

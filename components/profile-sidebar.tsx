'use client';

import { useState } from 'react';
import { FileText, Clock, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileSidebarProps = {
  initialSkills?: string[];
};

export function ProfileSidebar({ initialSkills = [] }: ProfileSidebarProps) {
  const [selectedSkills] = useState<string[]>(initialSkills);

  const uploads = [
    { id: 1, title: 'React Hooks Tutorial', type: 'Video', date: '2 days ago', views: 342 },
    { id: 2, title: 'UI Design Principles', type: 'Notes', date: '1 week ago', views: 518 },
    { id: 3, title: 'Web Performance Tips', type: 'Notes', date: '2 weeks ago', views: 247 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
      {/* My Shared Skills */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-bold text-foreground mb-4">My Shared Skills</h3>
        
        {/* Selected Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSkills.length > 0 ? selectedSkills.map(skill => (
            <div
              key={skill}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-primary/20 transition-colors"
            >
              {skill}
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} shared
        </p>
      </div>

      {/* My Uploads */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-bold text-foreground mb-4">My Uploads</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {uploads.map(upload => (
            <div
              key={upload.id}
              className="flex items-start gap-3 p-3 bg-warm-cream rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex-shrink-0 mt-1">
                {upload.type === 'Video' ? (
                  <div className="w-8 h-8 bg-golden-yellow/20 text-golden-yellow rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{upload.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {upload.type} • {upload.date}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4 bg-warm-cream text-foreground hover:bg-muted border border-border">
          <Upload className="w-4 h-4 mr-2" />
          Upload New
        </Button>
      </div>

      {/* Host a Session */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-6 h-6 text-golden-yellow" />
          <h3 className="text-lg font-bold text-white">Host a Session</h3>
        </div>
        <p className="text-primary/90 text-sm mb-4">
          Share your expertise with the community. Schedule a live teaching session.
        </p>
        <Button className="w-full bg-golden-yellow text-dark-grey hover:bg-golden-yellow/90 font-semibold">
          Schedule Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">48</p>
          <p className="text-xs text-muted-foreground mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-golden-yellow">4.9</p>
          <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
        </div>
      </div>
    </div>
  );
}

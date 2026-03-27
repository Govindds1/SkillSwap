'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Play } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  createdAt: string;
  views: number;
  likes: number;
  duration?: string;
}

const mockVideos: ContentItem[] = [
  {
    id: 'v1',
    title: 'Getting Started with React Hooks',
    creator: 'Sarah Chen',
    avatar: 'SC',
    createdAt: '2 days ago',
    views: 342,
    likes: 48,
    duration: '24:15'
  },
  {
    id: 'v2',
    title: 'Responsive Design Patterns',
    creator: 'Marcus Williams',
    avatar: 'MW',
    createdAt: '5 days ago',
    views: 218,
    likes: 32,
    duration: '18:45'
  },
  {
    id: 'v3',
    title: 'State Management Best Practices',
    creator: 'Elena Rodriguez',
    avatar: 'ER',
    createdAt: '1 week ago',
    views: 567,
    likes: 89,
    duration: '31:20'
  },
  {
    id: 'v4',
    title: 'CSS Grid Mastery',
    creator: 'James Park',
    avatar: 'JP',
    createdAt: '1 week ago',
    views: 445,
    likes: 62,
    duration: '27:30'
  }
];

const mockNotes: ContentItem[] = [
  {
    id: 'n1',
    title: 'Complete Guide to TypeScript',
    creator: 'Priya Kapoor',
    avatar: 'PK',
    createdAt: '3 days ago',
    views: 156,
    likes: 28
  },
  {
    id: 'n2',
    title: 'Web Performance Optimization Tips',
    creator: 'Tom Anderson',
    avatar: 'TA',
    createdAt: '1 week ago',
    views: 289,
    likes: 45
  },
  {
    id: 'n3',
    title: 'Database Design Fundamentals',
    creator: 'Lisa Zhang',
    avatar: 'LZ',
    createdAt: '2 weeks ago',
    views: 412,
    likes: 61
  },
  {
    id: 'n4',
    title: 'UX Research Methods',
    creator: 'David Kumar',
    avatar: 'DK',
    createdAt: '2 weeks ago',
    views: 198,
    likes: 34
  }
];

export function ContentFeeds() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Content Feed</h2>
        <p className="text-muted-foreground">Videos and notes from the community</p>
      </div>

      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <Tabs defaultValue="videos" className="bg-white border border-border rounded-2xl p-8">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8 bg-light-grey">
            <TabsTrigger 
              value="videos"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4 mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {mockVideos.map((video) => (
                <div
                  key={video.id}
                  className="group border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Video thumbnail placeholder */}
                  <div className="h-40 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white/70 group-hover:text-white transition-colors" />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>

                    {/* Creator info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-light-grey text-foreground text-xs font-semibold">
                          {video.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{video.creator}</p>
                        <p className="text-xs text-muted-foreground">{video.createdAt}</p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                      <span className="text-xs text-muted-foreground">{video.views} views</span>
                      <span className="text-xs text-muted-foreground">{video.likes} likes</span>
                      <Badge variant="outline" className="text-xs">
                        {video.duration}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {mockNotes.map((note) => (
                <div
                  key={note.id}
                  className="group border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Note icon placeholder */}
                  <div className="h-40 bg-gradient-to-br from-golden-yellow to-golden-yellow/80 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-white/70 group-hover:text-white transition-colors" />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>

                    {/* Creator info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-light-grey text-foreground text-xs font-semibold">
                          {note.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{note.creator}</p>
                        <p className="text-xs text-muted-foreground">{note.createdAt}</p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                      <span className="text-xs text-muted-foreground">{note.views} views</span>
                      <span className="text-xs text-muted-foreground">{note.likes} likes</span>
                      <Badge variant="outline" className="text-xs">
                        PDF
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Read Notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

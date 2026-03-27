'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileHeroProps = {
  fullName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  branch?: string | null;
  year?: string | null;
  department?: string | null;
  section?: string | null;
  introVideoUrl?: string | null;
};

export function ProfileHero({
  fullName,
  email,
  imageUrl,
  branch,
  year,
  department,
  section,
  introVideoUrl,
}: ProfileHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const subtitleParts = [
    branch?.trim() ? branch.trim() : null,
    year?.trim() ? `Year ${year.trim()}` : null,
    section?.trim() ? `Section ${section.trim()}` : null,
    department?.trim() ? department.trim() : null,
  ].filter(Boolean) as string[];

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Profile Section */}
        <div className="md:col-span-1 flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-golden-yellow shadow-lg">
              <img
                src={
                  imageUrl ??
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23184A48'/%3E%3Ccircle cx='60' cy='40' r='20' fill='%23EFA949'/%3E%3Cpath d='M 30 120 Q 30 75 60 75 Q 90 75 90 120' fill='%23EFA949'/%3E%3C/svg%3E"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-lg" />
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center">{fullName ?? "User"}</h2>
          <p className="text-muted-foreground text-center mt-1">{email ?? "No email available"}</p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {subtitleParts.length > 0 ? subtitleParts.join(" • ") : "Complete your profile details"}
          </p>
          <p className="text-sm text-primary font-semibold mt-3">Online</p>
        </div>

        {/* Video Player Section */}
        <div className="md:col-span-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border">
            <div className="relative bg-black/5 aspect-video flex items-center justify-center group">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                {introVideoUrl ? (
                  <source src={introVideoUrl} type="video/mp4" />
                ) : null}
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                {!isPlaying && introVideoUrl && (
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full bg-golden-yellow hover:bg-golden-yellow/90 text-dark-grey flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                )}
                {!introVideoUrl && (
                  <div className="rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-foreground">
                    Add an intro video in Edit Profile
                  </div>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                Intro Video
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">My 1-Minute Intro Video</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A quick introduction about myself, my skills, and what I&apos;m looking to learn from the SkillSwap community.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>2.3K views</span>
                </div>
                <div className="text-xs">
                  <span className="bg-muted rounded px-2 py-1">MP4 • 8.5MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

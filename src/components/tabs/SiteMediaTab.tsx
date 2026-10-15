import React, { useState, useEffect } from 'react';
import { Project, SiteMediaPhoto, SiteMediaVideo } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatDateTime } from '../../utils/formatters';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Volume2, 
  Camera, 
  Video, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ZoomIn, 
  X,
  Upload,
  Sparkles,
  Layers
} from 'lucide-react';

interface SiteMediaTabProps {
  project: Project;
  onOpenCommentAtTime?: (timecode: string) => void;
}

export const SiteMediaTab: React.FC<SiteMediaTabProps> = ({ project, onOpenCommentAtTime }) => {
  const { currentRole } = useProjectContext();
  const photos = project.media?.photos || [];
  const videos = project.media?.videoWalkthroughs || [];

  // Active video walkthrough state
  const activeVideo = videos[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(45);
  const totalSeconds = 258; // 4 mins 18 secs
  const [selectedPhoto, setSelectedPhoto] = useState<SiteMediaPhoto | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Simulated video playback scrubber
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const jumpToTimestamp = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      const targetSec = parts[0] * 60 + parts[1];
      setCurrentSeconds(targetSec);
      setIsPlaying(true);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    return activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Site Photos & 4K Video Walkthrough Inspections</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual inspection records from Rana Al Kassim luxury project sites, marble dry-lays, and field execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            {photos.length} High-Res Photos · {videos.length} 4K Walkthrough Video
          </span>
        </div>
      </div>

      {/* 4K Video Walkthrough Inspection Module */}
      {activeVideo ? (
        <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md">
          {/* Top Bar of Video Player */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-slate-100">{activeVideo.title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono text-[11px]">{activeVideo.resolution}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Recorded by: <strong className="text-slate-200">{activeVideo.recordedBy}</strong></span>
              <span>·</span>
              <span className="font-mono">{formatDateTime(activeVideo.recordedAt)}</span>
            </div>
          </div>

          {/* Video Screen Viewport */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
            <img
              src={activeVideo.videoThumbnail}
              alt="Site inspection video view"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />

            {/* Video HUD Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            {/* In-Video Live Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 rounded border border-emerald-500/30">
                REC 4K UHD 60P
              </span>
              <span className="px-2.5 py-1 text-[10px] font-mono text-slate-200 bg-slate-900/80 backdrop-blur-md rounded border border-slate-700">
                GEO: DUBAI UAE (RANA AL KASSIM SITE #88)
              </span>
            </div>

            {/* Center Big Play Button if paused */}
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all transform hover:scale-110 cursor-pointer shadow-lg"
                title="Play Walkthrough Video"
              >
                <Play className="w-8 h-8 ml-1 fill-white" />
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-2 pointer-events-auto">
              {/* Scrubber Progress Bar */}
              <div
                className="w-full bg-white/20 hover:bg-white/30 h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentSeconds(Math.floor(pos * totalSeconds));
                }}
              >
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(currentSeconds / totalSeconds) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <span className="font-mono text-[11px] tabular-nums">
                    {formatSecs(currentSeconds)} / {formatSecs(totalSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Audio: Natural Jobsite Ambient</span>
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <button
                    onClick={() => {
                      if (onOpenCommentAtTime) onOpenCommentAtTime(formatSecs(currentSeconds));
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>Comment at {formatSecs(currentSeconds)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Timestamps Bar for Executive Reviewers (Ops & CEO) */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Jump to Critical Inspection Checkpoints (Click to scrub):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {activeVideo.keyTimestamps.map((ts, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToTimestamp(ts.time)}
                    className="px-3 py-1.5 text-xs font-mono bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-lg border border-slate-700/60 cursor-pointer flex items-center gap-2 transition-all"
                  >
                    <span className="text-emerald-400 font-bold">{ts.time}</span>
                    <span className="text-slate-300 font-sans">{ts.label}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Photo Inspection Gallery */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-600" />
              High-Resolution Site Inspection Photography
            </h3>
            <p className="text-xs text-slate-500">
              Verified on-site by Site Supervisor Tariq Mansoor for Operations and CEO review.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Photo Categories ({photos.length})</option>
              <option value="Living Salon">Living Salon</option>
              <option value="Master Suite">Master Suite</option>
              <option value="Site Inspection">Site Inspection & QA</option>
            </select>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium shadow-sm">
                      <ZoomIn className="w-3.5 h-3.5" />
                      View High-Res
                    </span>
                  </div>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm px-2 py-0.5 rounded">
                      {photo.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{photo.uploadedBy}</span>
                    <span className="font-mono">{formatDateTime(photo.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-900 flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 block uppercase tracking-wide">
                    {selectedPhoto.category} · {selectedPhoto.stage}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedPhoto.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>Inspector: {selectedPhoto.uploadedBy}</span>
                  <span>·</span>
                  <span>{formatDateTime(selectedPhoto.uploadedAt)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {selectedPhoto.caption}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Inspection Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

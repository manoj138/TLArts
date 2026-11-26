import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  Film,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { useArtworks } from '../../context/ArtworkContext';

// Individual Video Card Component with Hover/Click Play & Sound Toggle
function VideoCard({ video, onOpenLightbox }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="bg-[#101018] border border-white/10 hover:border-[#c5a059]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/80 group text-left cursor-pointer"
      onClick={() => onOpenLightbox(video)}
    >
      <div>
        {/* Video Container (Vertical Reel 9:16 Format for 4-5 items per row) */}
        <div className="relative w-full aspect-[9/16] overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl || undefined}
            playsInline
            muted={isMuted}
            loop
            preload="metadata"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 contrast-105"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Gradient Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Category Badge */}
          <div className="absolute top-2.5 left-2.5 bg-black/85 border border-white/15 backdrop-blur-md font-['Space_Grotesk',monospace] text-[9px] sm:text-[10px] tracking-wider text-[#c5a059] px-2.5 py-0.5 rounded-full pointer-events-none truncate max-w-[75%]">
            {video.category || 'Timelapse'}
          </div>

          {/* Duration Pill */}
          {video.duration && (
            <div className="absolute top-2.5 right-2.5 bg-black/80 border border-white/10 text-white font-mono text-[9px] px-1.5 py-0.5 rounded pointer-events-none">
              {video.duration}
            </div>
          )}

          {/* Center Play Button Overlay (when paused) */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer group/btn"
              title="Play Video"
              aria-label="Play video"
            >
              <Play size={18} className="ml-1 fill-current" />
            </button>
          )}

          {/* Bottom Video Quick Action Controls */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-[#c5a059] border border-white/15 hover:border-[#c5a059] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-md"
              title={isMuted ? 'Unmute Video' : 'Mute Video'}
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(video);
              }}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-[#c5a059] border border-white/15 hover:border-[#c5a059] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Full Screen View"
              aria-label="Full screen view"
            >
              <Maximize2 size={11} />
            </button>
          </div>
        </div>

        {/* Video Card Meta & Details */}
        <div className="p-3 sm:p-3.5">
          <h3 className="font-['Bebas_Neue',sans-serif] text-lg sm:text-xl tracking-wide text-white mb-1 leading-snug line-clamp-1 group-hover:text-[#c5a059] transition-colors">
            {video.title}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'Watch the detailed graphite blending and artistic process in real-time.'}
          </p>
        </div>
      </div>

      {/* Card Footer: Watch Reel & Lightbox Trigger */}
      <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5">
        <div className="flex items-center justify-between border-t border-white/5 pt-2">
          <button
            type="button"
            className="font-['Space_Grotesk',monospace] text-[10px] sm:text-[11px] font-semibold text-[#c5a059] group-hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
            onClick={() => onOpenLightbox(video)}
          >
            <span>Play</span>
            <Maximize2 size={10} />
          </button>

          {video.instagramReelUrl && (
            <a
              href={video.instagramReelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#c5a059] bg-white/5 hover:bg-[#c5a059]/15 border border-white/10 hover:border-[#c5a059] p-1 rounded-full transition-all"
              onClick={(e) => e.stopPropagation()}
              title="Watch on Instagram"
              aria-label="Watch on Instagram"
            >
              <InstagramIcon size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Full-Screen Instagram-Style Vertical Reel Viewer Modal
function ReelLightboxModal({
  video,
  currentIndex,
  totalCount,
  isMuted,
  onToggleMute,
  onPrev,
  onNext,
  onClose
}) {
  const modalVideoRef = useRef(null);
  const touchStartYRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const vid = modalVideoRef.current;
    if (!vid) return;

    vid.muted = isMuted;
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Fallback to muted autoplay if browser blocks sound
        vid.muted = true;
        onToggleMute(true);
        vid.play().catch(() => setIsPlaying(false));
      });
    }
  }, [isMuted, onToggleMute]);

  const togglePlayPause = (e) => {
    e?.stopPropagation();
    const vid = modalVideoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const vid = modalVideoRef.current;
    if (!vid || !vid.duration) return;
    setProgress((vid.currentTime / vid.duration) * 100);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const vid = modalVideoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio * 100);
  };

  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartYRef.current === null || totalCount <= 1) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    touchStartYRef.current = null;

    if (deltaY > 55) {
      onNext();
    } else if (deltaY < -55) {
      onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title || 'Studio Reel'}
    >
      {/* Reel Frame: True Fullscreen (100vw x 100dvh) on Mobile, Vertical 9:16 Theater on Desktop */}
      <div
        className="relative w-full h-[100dvh] sm:h-[92dvh] sm:w-auto sm:aspect-[9/16] sm:max-w-[95vw] bg-black sm:rounded-2xl sm:border sm:border-white/15 overflow-hidden shadow-2xl shadow-black select-none"
        onClick={togglePlayPause}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <video
          ref={modalVideoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />

        {/* Top Gradient Overlay & Controls */}
        <div
          className="absolute inset-x-0 top-0 z-20 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-5 bg-gradient-to-b from-black/80 via-black/35 to-transparent flex items-center justify-between gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-black/60 border border-[#c5a059]/40 text-[#e8c985] font-['Space_Grotesk',monospace] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full truncate">
              <InstagramIcon size={11} />
              <span>@artist_tushar_02</span>
            </span>
            {totalCount > 1 && (
              <span className="bg-black/60 border border-white/15 text-slate-300 font-mono text-[10px] px-2 py-1 rounded-full shrink-0">
                {currentIndex + 1}/{totalCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleMute(!isMuted)}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#c5a059] border border-white/20 hover:border-[#c5a059] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title={isMuted ? 'Unmute Reel' : 'Mute Reel'}
              aria-label={isMuted ? 'Unmute Reel' : 'Mute Reel'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#c5a059] border border-white/20 hover:border-[#c5a059] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title="Close Reel"
              aria-label="Close Reel"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Center Play Indicator when Paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlayPause}
            className="absolute inset-0 m-auto z-20 w-16 h-16 rounded-full bg-black/65 border border-[#c5a059]/60 text-white flex items-center justify-center shadow-2xl cursor-pointer animate-in zoom-in-90 duration-150"
            aria-label="Play Reel"
          >
            <Play size={26} className="ml-1 fill-current" />
          </button>
        )}

        {/* Right-side Prev/Next Reel Controls (when multiple reels exist) */}
        {totalCount > 1 && (
          <div
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onPrev}
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-[#c5a059] border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title="Previous Reel"
              aria-label="Previous Reel"
            >
              <ChevronUp size={18} />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-9 h-9 rounded-full bg-black/55 hover:bg-[#c5a059] border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title="Next Reel"
              aria-label="Next Reel"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        {/* Bottom Metadata Overlay & Progress Bar */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] px-4 sm:p-5 sm:pt-16 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-left space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1 pr-10">
            <span className="font-['Space_Grotesk',monospace] text-[10px] text-[#c5a059] uppercase tracking-widest block">
              {video.category || 'Timelapse'}
            </span>
            <h3 className="font-['Bebas_Neue',sans-serif] text-2xl sm:text-3xl text-white tracking-wide leading-none">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            )}
          </div>

          {video.instagramReelUrl && (
            <a
              href={video.instagramReelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] text-black font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg cursor-pointer hover:brightness-110 transition-all"
            >
              <InstagramIcon size={14} />
              <span>View on Instagram Reel</span>
              <ExternalLink size={12} />
            </a>
          )}

          {/* Slim Seekable Reel Progress Track */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer pt-0"
            role="slider"
            aria-label="Reel progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-[#e8c985] to-[#c5a059] transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Video Showcase Component (4 or 5 videos in desktop row)
export default function FeaturedVideos() {
  const { videos = [] } = useArtworks();
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [isModalMuted, setIsModalMuted] = useState(false);

  const activeLightboxVideo =
    activeLightboxIndex !== null && videos[activeLightboxIndex]
      ? videos[activeLightboxIndex]
      : null;

  const handleOpenLightbox = (video) => {
    const idx = videos.findIndex((v) => v.id === video.id);
    setActiveLightboxIndex(idx >= 0 ? idx : 0);
  };

  const handlePrevReel = () => {
    if (videos.length <= 1) return;
    setActiveLightboxIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleNextReel = () => {
    if (videos.length <= 1) return;
    setActiveLightboxIndex((prev) => (prev + 1) % videos.length);
  };

  // Lock page scroll & handle Escape / Arrow keys while reel viewer is open
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveLightboxIndex((prev) =>
          prev === null || videos.length <= 1 ? prev : (prev - 1 + videos.length) % videos.length
        );
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveLightboxIndex((prev) =>
          prev === null || videos.length <= 1 ? prev : (prev + 1) % videos.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxIndex, videos.length]);

  return (
    <section id="videos" className="py-20 sm:py-28 px-4 sm:px-6 md:px-10 bg-[#09090e] border-t border-white/5 relative overflow-hidden">
      {/* Background Subtle Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[#c5a059]/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14 text-left">
          <div>
            <span className="inline-flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-3 uppercase">
              <Film size={12} />
              <span>STUDIO IN MOTION</span>
            </span>
            <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-7xl tracking-wider text-white leading-none">
              DRAWING <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">TIMELAPSES & REELS</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
            Witness raw graphite realism take life. Watch authentic sketching timelapses, blending techniques, and behind-the-scenes artistry by Tushar Lohar.
          </p>
        </div>

        {/* 4 to 5 Videos in Row Grid for Desktop (2 on mobile, 3 on tablet, 4 on lg, 5 on xl) */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {videos.map((vid) => (
              <VideoCard
                key={vid.id}
                video={vid}
                onOpenLightbox={handleOpenLightbox}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#101018]/80 border border-dashed border-[#c5a059]/20 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
              <Film size={24} />
            </div>
            <div>
              <h3 className="font-['Bebas_Neue',sans-serif] text-2xl text-white tracking-wide mb-1">
                Studio Timelapses Updating
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                New drawing process videos and pencil timelapses are being uploaded. Watch live studio reels on Instagram.
              </p>
            </div>
            <a
              href="https://www.instagram.com/artist_tushar_02/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] text-black font-semibold text-xs px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#c5a059]/20 transition-all cursor-pointer"
            >
              <InstagramIcon size={14} />
              <span>Watch Reels on @artist_tushar_02</span>
            </a>
          </div>
        )}
      </div>

      {/* Fullscreen Instagram-Style Reel Lightbox Modal (Portaled to document.body above Navbar) */}
      {activeLightboxVideo &&
        createPortal(
          <ReelLightboxModal
            key={activeLightboxVideo.id}
            video={activeLightboxVideo}
            currentIndex={activeLightboxIndex}
            totalCount={videos.length}
            isMuted={isModalMuted}
            onToggleMute={setIsModalMuted}
            onPrev={handlePrevReel}
            onNext={handleNextReel}
            onClose={() => setActiveLightboxIndex(null)}
          />,
          document.body
        )}
    </section>
  );
}

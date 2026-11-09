import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Film, X } from 'lucide-react';
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

// Main Video Showcase Component (4 or 5 videos in desktop row)
export default function FeaturedVideos() {
  const { videos = [] } = useArtworks();
  const [activeLightboxVideo, setActiveLightboxVideo] = useState(null);

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
                onOpenLightbox={(video) => setActiveLightboxVideo(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#101018] border border-dashed border-white/10 rounded-2xl p-8 space-y-3">
            <Film size={40} className="mx-auto text-[#c5a059] opacity-40" />
            <h3 className="font-['Bebas_Neue',sans-serif] text-2xl text-white">Videos Coming Soon</h3>
            <p className="text-xs text-slate-400">Timelapses and drawing process videos are being prepared in the studio.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Video Theater Lightbox Modal */}
      {activeLightboxVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-[#0d0d14] border border-[#c5a059]/40 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl shadow-black animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 z-30 bg-black/70 hover:bg-[#c5a059] border border-white/20 hover:border-[#c5a059] text-white hover:text-black p-2 rounded-full cursor-pointer transition-all"
              onClick={() => setActiveLightboxVideo(null)}
              aria-label="Close Video"
            >
              <X size={18} />
            </button>

            {/* Lightbox Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeLightboxVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Meta Info */}
            <div className="p-6 md:p-8 text-left bg-gradient-to-t from-[#0a0a0f] to-[#12121c] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] uppercase tracking-wider block mb-1">
                  {activeLightboxVideo.category || 'Timelapse'}
                </span>
                <h3 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide">
                  {activeLightboxVideo.title}
                </h3>
                {activeLightboxVideo.description && (
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
                    {activeLightboxVideo.description}
                  </p>
                )}
              </div>

              {activeLightboxVideo.instagramReelUrl && (
                <a
                  href={activeLightboxVideo.instagramReelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] text-black font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shrink-0 cursor-pointer hover:brightness-110 transition-all"
                >
                  <InstagramIcon size={14} />
                  <span>View on Instagram Reel</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

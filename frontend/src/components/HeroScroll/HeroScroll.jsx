import { useEffect, useRef, useState, useCallback } from 'react';
import './HeroScroll.css';

const FRAME_FILES = [
  'frame_001.jpg', 'frame_002.jpg', 'frame_003.jpg', 'frame_004.jpg', 'frame_005.jpg',
  'frame_006.jpg', 'frame_007.jpg', 'frame_008.jpg', 'frame_009.jpg', 'frame_010.jpg',
  'frame_011.jpg', 'frame_012.jpg', 'frame_013.jpg', 'frame_014.jpg', 'frame_015.jpg',
  'frame_016.jpg', 'frame_017.jpg', 'frame_018.jpg', 'frame_019.jpg', 'frame_020.jpg',
  'frame_021.jpg', 'frame_022.jpg', 'frame_023.jpg', 'frame_024.jpg', 'frame_025.jpg',
  'frame_026.jpg', 'frame_027.jpg', 'frame_028.jpg', 'frame_029.jpg', 'frame_030.jpg',
  'frame_031.jpg', 'frame_032.jpg', 'frame_033.jpg', 'frame_034.jpg', 'frame_042.jpg'
];

const BASE_PATH = '/scrolling_images/gemini_generated_video_4f6543f0_gwr_video_mvp_frames/';
const TOTAL_FRAMES = FRAME_FILES.length;

export default function HeroScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayFrame, setDisplayFrame] = useState(1);

  // High-performance canvas draw with 'cover' aspect ratio preservation
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas dimensions are initialized
    if (canvas.width === 0 || canvas.height === 0) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor((rect.width || window.innerWidth) * dpr);
      canvas.height = Math.floor((rect.height || window.innerHeight) * dpr);
    }

    // Retrieve target image or nearest loaded image
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prev = imagesRef.current[frameIndex - delta];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + delta];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = cw;
      renderH = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderW = ch * imgRatio;
      renderH = ch;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    currentFrameRef.current = frameIndex;
    setDisplayFrame(frameIndex + 1);
  }, []);

  // Resize canvas according to devicePixelRatio for retina/4K sharpness
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload all 35 frames in background
  useEffect(() => {
    let loaded = 0;
    const images = [];

    FRAME_FILES.forEach((fileName, index) => {
      const img = new Image();
      img.src = `${BASE_PATH}${fileName}`;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (index === 0) {
          // Render the very first frame immediately
          setIsReady(true);
          renderFrame(0);
        }
        if (loaded === TOTAL_FRAMES) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        console.warn(`Could not load frame: ${fileName}`);
        loaded++;
        setLoadedCount(loaded);
      };

      images.push(img);
    });

    imagesRef.current = images;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame, resizeCanvas]);

  // Scroll event handling to update frames
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = scrolled / scrollableDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(progress);

      // Map progress to frame index
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      if (targetFrame !== currentFrameRef.current) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          renderFrame(targetFrame);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [renderFrame]);

  const scrollToNext = () => {
    if (containerRef.current) {
      const nextPosition = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({
        top: nextPosition,
        behavior: 'smooth'
      });
    }
  };

  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <section ref={containerRef} className="hero-scroll-track" id="hero">
      {/* Sticky Frame: Pins at top during the scroll duration */}
      <div className="hero-sticky-frame">
        {/* Fullscreen Canvas for instant frame scrubbing */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Cinematic Filters & Overlays */}
        <div className="hero-vignette" />
        <div className="hero-scanlines" />
        <div className="hero-glow-ambient" />

        {/* Preloader Overlay (disappears smoothly once frame 1 is ready) */}
        {!isReady && (
          <div className="hero-loader-overlay">
            <h2 className="loader-title">TL ARTS</h2>
            <div className="loader-status">
              LOADING TRAILER FRAMES... {loadPercent}%
            </div>
            <div className="loader-bar-bg">
              <div
                className="loader-bar-fill"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Story Overlays (Synced to Scroll Progress) */}
        <div className="hero-content-layer">
          {/* Chapter 1: 0% to 30% scroll */}
          <div
            className={`story-card ${
              scrollProgress < 0.28
                ? 'visible'
                : 'hidden-up'
            }`}
          >
            <div className="badge-tagline">★ TUSHAR LOHAR ARTS ★</div>
            <h1 className="gta-headline">TLARTS</h1>
            <p className="story-description">
              EVERY STROKE TELLS A STORY. REALISTIC GRAPHITE & CHARCOAL PORTRAITS BY TUSHAR LOHAR.
            </p>
            <div className="tags-cluster">
              <span className="pill-item">PENCIL PORTRAITS</span>
              <span className="pill-item">CHARCOAL ART</span>
              <span className="pill-item">@ARTIST_TUSHAR_02</span>
            </div>
          </div>

          {/* Chapter 2: 32% to 68% scroll */}
          <div
            className={`story-card ${
              scrollProgress >= 0.32 && scrollProgress < 0.68
                ? 'visible'
                : scrollProgress < 0.32
                ? 'hidden-down'
                : 'hidden-up'
            }`}
          >
            <div className="badge-tagline">✦ THE CREATIVE VISION ✦</div>
            <h2 className="gta-headline cyan-accent">CAPTURING SOUL</h2>
            <p className="story-description">
              BREATHING LIFE AND AUTHENTIC EMOTION INTO GRAPHITE WITH OBSESSIVE ATTENTION TO DETAIL.
            </p>
            <div className="tags-cluster">
              <span className="pill-item">FINE TEXTURES</span>
              <span className="pill-item">LIFELIKE SHADING</span>
              <span className="pill-item">COMMISSIONED WORKS</span>
            </div>
          </div>

          {/* Chapter 3: 72% to 100% scroll */}
          <div
            className={`story-card ${
              scrollProgress >= 0.72
                ? 'visible'
                : 'hidden-down'
            }`}
          >
            <div className="badge-tagline">⚡ DISCOVER THE PORTFOLIO ⚡</div>
            <h2 className="gta-headline">IMMERSIVE ARTISTRY</h2>
            <p className="story-description">
              EXPLORE REALISTIC SKETCHES, DETAILED MASTERPIECES & INSTAGRAM ART POSTS.
            </p>
            <div className="cta-row">
              <button
                type="button"
                className="cta-primary"
                onClick={scrollToNext}
              >
                DISCOVER THE ART ↓
              </button>
              <a
                href="https://www.instagram.com/artist_tushar_02/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                FOLLOW ON INSTAGRAM
              </a>
            </div>
          </div>
        </div>

        {/* Bottom HUD: Telemetry, Scroll Indicator & Progress Bar */}
        <footer className="hero-bottom-hud">
          <div className="hud-left">
            <div className="frame-telemetry">
              <span>FRAME: [{String(displayFrame).padStart(2, '0')} / {String(TOTAL_FRAMES).padStart(2, '0')}]</span>
              <span>•</span>
              <span>TLARTS GALLERY</span>
            </div>
            <div className="hud-location">TUSHAR LOHAR • @ARTIST_TUSHAR_02</div>
          </div>

          <div className="hud-center">
            <div className="scroll-prompt">
              <span>SCROLL TO EXPLORE</span>
              <span>↓</span>
            </div>
          </div>

          <div className="hud-right">
            <div className="progress-number">
              {Math.round(scrollProgress * 100)}% COMPLETE
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

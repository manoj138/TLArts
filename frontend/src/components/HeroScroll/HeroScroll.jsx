import { useEffect, useRef, useState, useCallback } from 'react';
import './HeroScroll.css';

const FRAME_FILES = [
  
  'frame_006.jpg', 'frame_007.jpg', 'frame_008.jpg', 'frame_009.jpg', 'frame_010.jpg',
  'frame_011.jpg', 'frame_012.jpg', 'frame_013.jpg', 'frame_014.jpg', 'frame_015.jpg',
  'frame_016.jpg', 'frame_017.jpg', 'frame_018.jpg', 'frame_019.jpg', 'frame_020.jpg',
  'frame_021.jpg', 'frame_022.jpg', 'frame_023.jpg', 'frame_024.jpg', 'frame_025.jpg',
  'frame_026.jpg', 'frame_027.jpg', 'frame_028.jpg', 'frame_029.jpg', 'frame_030.jpg',
  'frame_031.jpg', 'frame_032.jpg', 'frame_033.jpg', 'frame_034.jpg', 'frame_042.jpg'
];

const BASE_PATH = '/scrolling_images/gemini_generated_video_4f6543f0_gwr_video_mvp_frames/';
const TOTAL_FRAMES = FRAME_FILES.length;
const MAX_HERO_WHEEL_STEP = 90;
const IDLE_NUDGE_DELAY_MS = 3000;

const isFrameReady = (src) => {
  if (!src) return false;
  if (typeof ImageBitmap !== 'undefined' && src instanceof ImageBitmap) {
    return src.width > 0 && src.height > 0;
  }
  return Boolean(src.complete && src.naturalWidth > 0);
};

export default function HeroScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const decodedRef = useRef([]);
  const currentFrameRef = useRef(-1);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const activeChapterRef = useRef(0);
  const rafIdRef = useRef(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [isIdleNudge, setIsIdleNudge] = useState(false);

  // High-performance canvas draw with 'cover' aspect ratio preservation
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Ensure canvas dimensions are initialized
    if (canvas.width === 0 || canvas.height === 0) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor((rect.width || window.innerWidth) * dpr);
      canvas.height = Math.floor((rect.height || window.innerHeight) * dpr);
    }

    const pickReady = (idx) => {
      const bmp = decodedRef.current[idx];
      if (isFrameReady(bmp)) return bmp;
      const img = imagesRef.current[idx];
      if (isFrameReady(img)) return img;
      return null;
    };

    // Retrieve target frame (preferring pre-decoded ImageBitmap) or nearest loaded frame
    let frame = pickReady(frameIndex);
    if (!frame) {
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        frame = pickReady(frameIndex - delta) || pickReady(frameIndex + delta);
        if (frame) break;
      }
    }

    if (!frame) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const srcW = frame.naturalWidth || frame.width;
    const srcH = frame.naturalHeight || frame.height;

    const imgRatio = srcW / srcH;
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

    ctx.drawImage(frame, offsetX, offsetY, renderW, renderH);
    currentFrameRef.current = frameIndex;
  }, []);

  // Resize canvas according to capped devicePixelRatio for sharp yet fast rendering
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    renderFrame(Math.max(0, currentFrameRef.current));
  }, [renderFrame]);

  // Preload & pre-decode all frames in background to eliminate scroll-time JPEG decode stutter
  useEffect(() => {
    let isMounted = true;
    const images = [];
    const bitmaps = new Array(TOTAL_FRAMES).fill(null);
    decodedRef.current = bitmaps;

    FRAME_FILES.forEach((fileName, index) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${BASE_PATH}${fileName}`;

      img.onload = () => {
        if (!isMounted) return;

        if (index === Math.max(0, currentFrameRef.current) || index === 0) {
          renderFrame(Math.max(0, currentFrameRef.current));
        }

        if (typeof createImageBitmap === 'function') {
          createImageBitmap(img)
            .then((bmp) => {
              if (!isMounted) {
                bmp.close?.();
                return;
              }
              bitmaps[index] = bmp;
              if (index === Math.max(0, currentFrameRef.current)) {
                renderFrame(index);
              }
            })
            .catch(() => {
              // Keep HTMLImageElement fallback
            });
        } else if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
      };

      img.onerror = () => {
        console.warn(`Could not load frame: ${fileName}`);
      };

      images.push(img);
    });

    imagesRef.current = images;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resizeCanvas);
      bitmaps.forEach((bmp) => bmp?.close?.());
      decodedRef.current = [];
    };
  }, [renderFrame, resizeCanvas]);

  // Smooth rAF lerp loop + gentle wheel pacing while inside hero sticky track
  useEffect(() => {
    const step = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const diff = target - current;

      const next = Math.abs(diff) < 0.0005 ? target : current + diff * 0.16;
      smoothProgressRef.current = next;

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.round(next * (TOTAL_FRAMES - 1))
      );

      if (targetFrame !== currentFrameRef.current) {
        renderFrame(targetFrame);
      }

      const nextChapter = next < 0.34 ? 0 : next < 0.68 ? 1 : 2;
      if (nextChapter !== activeChapterRef.current) {
        activeChapterRef.current = nextChapter;
        setActiveChapter(nextChapter);
      }

      if (Math.abs(target - next) > 0.0005) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
      }
    };

    const startLoop = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(step);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      targetProgressRef.current = progress;
      startLoop();
    };

    const handleWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !containerRef.current) {
        return;
      }

      const rawDelta =
        e.deltaMode === 1
          ? e.deltaY * 32
          : e.deltaMode === 2
          ? e.deltaY * window.innerHeight
          : e.deltaY;

      if (Math.abs(rawDelta) <= MAX_HERO_WHEEL_STEP) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollingDownInsideHero =
        rawDelta > 0 && rect.top <= 1 && rect.bottom > window.innerHeight + 2;
      const scrollingUpInsideHero =
        rawDelta < 0 && rect.top < -2 && rect.bottom >= window.innerHeight - 1;

      if (scrollingDownInsideHero || scrollingUpInsideHero) {
        e.preventDefault();
        window.scrollBy({
          top: Math.sign(rawDelta) * MAX_HERO_WHEEL_STEP,
          behavior: 'auto'
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [renderFrame]);

  // Prompt user with a noticeable scroll nudge if they stay idle in Hero Chapters 1 or 2
  useEffect(() => {
    if (activeChapter >= 2) return;

    let timerId = setTimeout(() => {
      setIsIdleNudge(true);
    }, IDLE_NUDGE_DELAY_MS);

    const resetIdleTimer = () => {
      setIsIdleNudge(false);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setIsIdleNudge(true);
      }, IDLE_NUDGE_DELAY_MS);
    };

    window.addEventListener('scroll', resetIdleTimer, { passive: true });
    window.addEventListener('wheel', resetIdleTimer, { passive: true });
    window.addEventListener('touchstart', resetIdleTimer, { passive: true });
    window.addEventListener('keydown', resetIdleTimer, { passive: true });

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('wheel', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, [activeChapter]);

  const scrollToNext = () => {
    if (containerRef.current) {
      const nextPosition = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({
        top: nextPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToNextChapter = () => {
    if (!containerRef.current) return;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    const targetRatio = activeChapter === 0 ? 0.45 : 0.85;
    window.scrollTo({
      top: containerRef.current.offsetTop + scrollableDistance * targetRatio,
      behavior: 'smooth'
    });
  };

  const showIdleNudge = isIdleNudge && activeChapter < 2;

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

        {/* Dynamic Story Overlays (Synced to Scroll Progress) */}
        <div className="hero-content-layer">
          {/* Chapter 1: 0% to 34% scroll */}
          <div
            className={`story-card ${
              activeChapter === 0 ? 'visible' : 'hidden-up'
            }`}
          >
            <div className="badge-tagline">★ TUSHAR LOHAR STUDIO ★</div>
            <h1 className="gta-headline">TUSHAR ARTS</h1>
            <p className="story-description">
              EVERY STROKE TELLS A STORY. REALISTIC GRAPHITE & CHARCOAL PORTRAITS BY TUSHAR LOHAR.
            </p>
            <div className="tags-cluster">
              <span className="pill-item">PENCIL PORTRAITS</span>
              <span className="pill-item">CHARCOAL ART</span>
              <span className="pill-item">@ARTIST_TUSHAR_02</span>
            </div>
          </div>

          {/* Chapter 2: 34% to 68% scroll */}
          <div
            className={`story-card ${
              activeChapter === 1
                ? 'visible'
                : activeChapter < 1
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

          {/* Chapter 3: 68% to 100% scroll */}
          <div
            className={`story-card ${
              activeChapter === 2 ? 'visible' : 'hidden-down'
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

        {/* Bottom HUD: Scroll Indicator */}
        <footer className={`hero-bottom-hud ${activeChapter === 2 ? 'hud-hidden' : ''}`}>
          <div className="hud-center">
            <button
              type="button"
              onClick={scrollToNextChapter}
              className={`scroll-prompt ${showIdleNudge ? 'idle-nudge' : ''}`}
              aria-label="Scroll down to explore"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="scroll-arrow" aria-hidden="true">↓</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

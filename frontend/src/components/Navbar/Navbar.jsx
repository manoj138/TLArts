import { useState, useEffect, useRef } from 'react';
import { Menu, X, Feather } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTIST_INFO } from '../../data/artworks';
import { useArtworks } from '../../context/ArtworkContext';

export default function Navbar() {
  const { openStudio } = useArtworks();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 4-click secret detector for owner authentication
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleBrandClick = (e) => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 4) {
      e.preventDefault();
      clickCountRef.current = 0;
      openStudio();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1400);

    closeMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08080c]/90 backdrop-blur-md border-b border-[#c5a059]/20 py-2.5 shadow-2xl shadow-black/80'
          : 'bg-[#08080c]/75 backdrop-blur-md border-b border-white/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Brand Wordmark with 4-Click Owner Trigger */}
        <a
          href="#hero"
          className="flex flex-col text-left leading-none group cursor-pointer select-none"
          onClick={handleBrandClick}
          title="TLArts - Tushar Lohar Arts"
        >
          <span className="font-['Bebas_Neue',sans-serif] text-2xl md:text-3xl tracking-widest font-black bg-gradient-to-r from-white via-white to-[#c5a059] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
            <span className='text-[#ffc14d]'>TL</span> ARTS
          </span>
          <span className="font-['Space_Grotesk',monospace] text-[10px] tracking-widest text-[#c5a059] uppercase mt-0.5">
            TUSHAR LOHAR ARTS
          </span>
        </a>

        {/* Desktop Nav Links (Ordered according to homepage section flow) */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#videos"
            className="hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300"
          >
            Studio Reels
          </a>
          <a
            href="#gallery"
            className="hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300"
          >
            Sketch Gallery
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300"
          >
            About Artist
          </a>
          <a
            href="#process"
            className="hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300"
          >
            The Process
          </a>
          <a
            href="#enquiry"
            className="hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300"
          >
            Custom Commission
          </a>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Instagram Link */}
          <a
            href={ARTIST_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/5 hover:bg-[#c5a059]/15 border border-white/10 hover:border-[#c5a059]/40 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-full font-['Space_Grotesk',monospace] text-xs tracking-wider transition-all duration-300 hover:-translate-y-0.5"
            title="Follow @artist_tushar_02 on Instagram"
          >
            <InstagramIcon size={15} />
            <span>@artist_tushar_02</span>
          </a>

          {/* Book Sketch CTA */}
          <a
            href="#enquiry"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-[#09090d] font-semibold px-4 py-1.5 rounded-md text-xs uppercase tracking-wider shadow-lg shadow-[#c5a059]/20 hover:shadow-[#c5a059]/35 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Feather size={13} />
            <span>Book Sketch</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="lg:hidden p-1.5 text-slate-300 hover:text-white cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden flex flex-col gap-3 bg-[#08080c] border-b border-white/10 px-6 py-6 transition-all">
          <a
            href="#videos"
            className="text-base text-slate-200 hover:text-[#c5a059] py-2 border-b border-white/5"
            onClick={closeMenu}
          >
            Studio Reels & Timelapses
          </a>
          <a
            href="#gallery"
            className="text-base text-slate-200 hover:text-[#c5a059] py-2 border-b border-white/5"
            onClick={closeMenu}
          >
            Complete Gallery
          </a>
          <a
            href="#about"
            className="text-base text-slate-200 hover:text-[#c5a059] py-2 border-b border-white/5"
            onClick={closeMenu}
          >
            About Artist
          </a>
          <a
            href="#process"
            className="text-base text-slate-200 hover:text-[#c5a059] py-2 border-b border-white/5"
            onClick={closeMenu}
          >
            The Creative Process
          </a>
          <a
            href="#enquiry"
            className="text-base text-slate-200 hover:text-[#c5a059] py-2 border-b border-white/5"
            onClick={closeMenu}
          >
            Custom Commission
          </a>

          <div className="flex flex-col gap-2.5 mt-2">
            <a
              href={ARTIST_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#c5a059]/15 border border-[#c5a059] text-white py-2.5 rounded-lg text-xs font-mono"
              onClick={closeMenu}
            >
              <InstagramIcon size={16} />
              <span>Follow @artist_tushar_02</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

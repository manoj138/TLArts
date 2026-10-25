import { ArrowUp } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTIST_INFO } from '../../data/artworks';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[#060609] border-t border-white/10 pt-20 pb-10 px-6 md:px-12 text-left relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5 flex flex-col">
            <span className="font-['Bebas_Neue',sans-serif] text-5xl tracking-widest font-black bg-gradient-to-r from-white via-white to-[#c5a059] bg-clip-text text-transparent leading-none mb-1">
              TLARTS
            </span>
            <span className="font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] uppercase mb-3">
              {ARTIST_INFO.fullName}
            </span>
            <p className="font-['Cinzel',serif] text-base italic text-slate-300 mb-3">
              &ldquo;{ARTIST_INFO.tagline}&rdquo;
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {ARTIST_INFO.bio}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col">
            <h4 className="font-['Space_Grotesk',monospace] text-xs tracking-widest text-slate-400 uppercase mb-4">
              PORTFOLIO NAVIGATION
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <a href="#about" className="hover:text-[#c5a059] transition-colors">About Tushar Lohar</a>
              <a href="#featured" className="hover:text-[#c5a059] transition-colors">Featured Artworks</a>
              <a href="#gallery" className="hover:text-[#c5a059] transition-colors">Complete Sketch Gallery</a>
              <a href="#process" className="hover:text-[#c5a059] transition-colors">The Creative Process</a>
              <a href="#enquiry" className="hover:text-[#c5a059] transition-colors">Commission a Portrait</a>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col">
            <h4 className="font-['Space_Grotesk',monospace] text-xs tracking-widest text-slate-400 uppercase mb-4">
              CONNECT WITH ARTIST
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Follow for daily pencil sketches, process videos & client stories.
            </p>
            <a
              href={ARTIST_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs text-white bg-[#c5a059]/15 border border-[#c5a059]/30 hover:border-[#c5a059] px-4 py-2.5 rounded-full transition-all w-fit cursor-pointer"
            >
              <InstagramIcon size={16} />
              <span>{ARTIST_INFO.instagramUsername}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-8 gap-4 text-xs font-['Space_Grotesk',monospace] text-slate-500">
          <div>
            © {new Date().getFullYear()} {ARTIST_INFO.fullName} ({ARTIST_INFO.brandName}). Handcrafted with Graphite & Passion.
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 bg-[#161622] border border-white/10 hover:border-[#c5a059] text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            onClick={scrollToTop}
            aria-label="Back to top of portfolio"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}

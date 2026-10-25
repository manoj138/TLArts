import { useEffect } from 'react';
import { X, ExternalLink, Calendar, Maximize2, Tag } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';

export default function ArtworkModal({ artwork, onClose }) {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-artwork-title"
    >
      <div
        className="relative bg-[#101017] border border-[#c5a059]/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-[#c5a059]/20 border border-white/15 hover:border-[#c5a059] text-slate-300 hover:text-white p-2 rounded-full cursor-pointer transition-all duration-200 hover:rotate-90"
          onClick={onClose}
          aria-label="Close Artwork Details"
        >
          <X size={18} />
        </button>

        {/* Modal Content Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          {/* Left: Large Artwork Showcase */}
          <div className="md:col-span-5 bg-black/60 p-6 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-w-full max-h-[460px] object-contain rounded-lg shadow-2xl contrast-105 block"
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/15 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 font-['Space_Grotesk',monospace] text-[10px] tracking-wider text-[#c5a059] whitespace-nowrap">
                <Maximize2 size={11} />
                <span>ORIGINAL GRAPHITE STUDY</span>
              </div>
            </div>
          </div>

          {/* Right: Curatorial Details & IG Redirection */}
          <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center text-left">
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="flex items-center gap-1 font-['Space_Grotesk',monospace] text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/25 px-2.5 py-0.5 rounded-full">
                <Tag size={11} /> {artwork.category}
              </span>
              <span className="flex items-center gap-1 font-['Space_Grotesk',monospace] text-slate-500">
                <Calendar size={11} /> {artwork.year}
              </span>
            </div>

            <h2 id="modal-artwork-title" className="font-['Bebas_Neue',sans-serif] text-3xl md:text-4xl text-white tracking-wide mb-3 leading-tight">
              {artwork.title}
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
              {artwork.description}
            </p>

            {/* Technical Specifications */}
            <div className="bg-[#161622]/60 border border-white/10 rounded-xl p-4 mb-6 space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="font-['Space_Grotesk',monospace] text-slate-500 w-24 shrink-0">Medium:</span>
                <span className="text-slate-200 font-medium">{artwork.medium}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-['Space_Grotesk',monospace] text-slate-500 w-24 shrink-0">Dimensions:</span>
                <span className="text-slate-200 font-medium">{artwork.dimensions}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-['Space_Grotesk',monospace] text-slate-500 w-24 shrink-0">Artist:</span>
                <span className="text-slate-200 font-medium">Tushar Lohar (@artist_tushar_02)</span>
              </div>
            </div>

            {/* Instagram Redirection Banner */}
            <div className="bg-gradient-to-br from-[#1c1424] to-[#101018] border border-[#c5a059]/30 rounded-xl p-4 space-y-3">
              <div>
                <strong className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide block">
                  View on Instagram
                </strong>
                <p className="text-xs text-slate-400 mt-0.5">
                  See process timelapses, client reactions, and commentary on @artist_tushar_02.
                </p>
              </div>

              <a
                href={artwork.instagramPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs py-3 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer"
              >
                <InstagramIcon size={15} />
                <span>View Original Post</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

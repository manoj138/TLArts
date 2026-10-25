import { Sparkles, ArrowUpRight } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTWORKS_DATA } from '../../data/artworks';

export default function FeaturedSketches({ onSelectArtwork }) {
  const featuredList = ARTWORKS_DATA.filter((art) => art.isFeatured);

  return (
    <section id="featured" className="py-24 px-6 md:px-12 bg-[#0b0b10] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 text-left">
          <div>
            <span className="inline-block font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-3 uppercase">
              CURATED SELECTION
            </span>
            <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-6xl tracking-wider text-white leading-none">
              FEATURED <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">SKETCHES</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
            A signature showcase of photorealistic graphite & charcoal commissions, celebrating meticulous craft and human expression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map((art) => (
            <div
              key={art.id}
              className="bg-[#111118] border border-white/10 hover:border-[#c5a059]/40 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black group text-left"
              onClick={() => onSelectArtwork(art)}
            >
              <div className="relative w-full h-[360px] overflow-hidden bg-black/60">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 contrast-105 block"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xl">
                    View Details & Story <ArrowUpRight size={14} />
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-black/80 border border-white/15 backdrop-blur-md font-['Space_Grotesk',monospace] text-[11px] tracking-wider text-[#c5a059] px-3 py-1 rounded-full">
                  {art.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs text-slate-400 mb-2">
                  <span>{art.year}</span>
                  <span className="text-[#c5a059]">•</span>
                  <span>{art.medium.split('&')[0]}</span>
                </div>

                <h3 className="font-['Bebas_Neue',sans-serif] text-2xl tracking-wide text-white mb-2 line-clamp-1">
                  {art.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-2 flex-1">
                  {art.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <button
                    type="button"
                    className="font-['Space_Grotesk',monospace] text-xs font-semibold text-[#c5a059] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtwork(art);
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Explore Sketch</span>
                  </button>

                  <a
                    href={art.instagramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#c5a059] bg-white/5 hover:bg-[#c5a059]/15 border border-white/10 hover:border-[#c5a059] p-2 rounded-full transition-all"
                    onClick={(e) => e.stopPropagation()}
                    title="View on Instagram"
                  >
                    <InstagramIcon size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

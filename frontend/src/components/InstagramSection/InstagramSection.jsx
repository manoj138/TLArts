import { ArrowUpRight, Heart, MessageCircle, Sparkles, Film, Palette } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTIST_INFO } from '../../data/artworks';
import { useArtworks } from '../../context/ArtworkContext';

export default function InstagramSection() {
  const { artworks } = useArtworks();
  const igPreviews = (artworks || []).filter((art) => art.imageUrl).slice(0, 4);

  return (
    <section className="py-24 px-6 md:px-12 bg-[#08080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Banner Card */}
        <div className="bg-gradient-to-br from-[#1c1424]/70 to-[#101018]/70 border border-[#c5a059]/30 rounded-2xl p-8 md:p-12 mb-12 backdrop-blur-md shadow-2xl text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs tracking-wider text-[#c5a059] bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full mb-4">
              <InstagramIcon size={15} />
              <span>OFFICIAL INSTAGRAM COMMUNITY</span>
            </div>

            <h2 className="font-['Bebas_Neue',sans-serif] text-4xl md:text-6xl tracking-wider text-white leading-none mb-4">
              FOLLOW <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">{ARTIST_INFO.instagramUsername.toUpperCase()}</span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
              Step into the studio behind the scenes. Watch hyper-lapse sketching videos, WIP progress reels, and close-up graphite textures on the artist&apos;s daily feed.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={ARTIST_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs md:text-sm px-6 py-3 rounded-lg shadow-lg shadow-[#c5a059]/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <InstagramIcon size={16} />
                <span>Follow on Instagram</span>
                <ArrowUpRight size={14} />
              </a>

              <span className="font-['Space_Grotesk',monospace] text-xs text-slate-400">
                Direct DM available for custom portrait commissions
              </span>
            </div>
          </div>
        </div>

        {/* Live Instagram Previews Grid or Community Cards */}
        {igPreviews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {igPreviews.map((post) => (
              <a
                key={post.id}
                href={post.instagramPostUrl || ARTIST_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-xl overflow-hidden h-64 bg-[#111116] border border-white/10 group block text-center"
                title={`View ${post.title} on Instagram`}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col justify-center items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <div className="flex gap-4 font-['Space_Grotesk',monospace] text-xs text-white">
                    <span className="flex items-center gap-1.5"><Heart size={15} fill="#fff" /> View</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={15} fill="#fff" /> Post</span>
                  </div>
                  <div className="font-['Bebas_Neue',sans-serif] text-base text-[#c5a059] tracking-wide line-clamp-1">
                    {post.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Elegant Community Highlights when starting out */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <a
              href={ARTIST_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111118] border border-white/5 hover:border-[#c5a059]/40 rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mb-4">
                <Film size={20} />
              </div>
              <h3 className="font-['Bebas_Neue',sans-serif] text-xl text-white tracking-wide mb-1">
                Studio Timelapses
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Watch speed-drawings and layer-by-layer graphite pencil shading reels.
              </p>
              <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] flex items-center gap-1">
                Watch Reels <ArrowUpRight size={12} />
              </span>
            </a>

            <a
              href={ARTIST_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111118] border border-white/5 hover:border-[#c5a059]/40 rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mb-4">
                <Palette size={20} />
              </div>
              <h3 className="font-['Bebas_Neue',sans-serif] text-xl text-white tracking-wide mb-1">
                WIP Progress Stories
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Daily studio updates, paper textures, and live client portrait commissions.
              </p>
              <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] flex items-center gap-1">
                View Stories <ArrowUpRight size={12} />
              </span>
            </a>

            <a
              href={ARTIST_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111118] border border-white/5 hover:border-[#c5a059]/40 rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-['Bebas_Neue',sans-serif] text-xl text-white tracking-wide mb-1">
                Original Sketch Drops
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Be the first to claim original handmade 1-of-1 pieces as soon as they are completed.
              </p>
              <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] flex items-center gap-1">
                Follow Feed <ArrowUpRight size={12} />
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

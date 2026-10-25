import { Feather, Eye, Compass, Heart } from 'lucide-react';
import { ARTIST_INFO } from '../../data/artworks';

export default function ArtistIntroduction() {
  return (
    <section id="about" className="py-28 px-6 md:px-12 bg-[#08080c] border-t border-[#c5a059]/20 relative">
      <div className="max-w-7xl mx-auto">
        {/* Subtle Section Badge */}
        <div className="text-center mb-16">
          <span className="inline-block font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-4 uppercase">
            THE ARTIST & STUDIO
          </span>
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-7xl tracking-wider text-white leading-none mb-4">
            TUSHAR LOHAR <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">ARTS</span>
          </h2>
          <p className="font-['Cinzel',serif] text-lg md:text-xl italic text-slate-400 max-w-2xl mx-auto">
            &ldquo;Every stroke tells a story, and every graphite layer captures a soul.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 bg-[#111118]">
              <img
                src="/tushar_photo/Tushar_photo.jpg"
                alt="Realistic pencil sketch by Tushar Lohar"
                className="w-full h-[480px] object-cover contrast-105 group-hover:scale-105 transition-transform duration-700 block"
                loading="lazy"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-[#09090d]/85 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-lg flex items-center gap-2.5 font-['Space_Grotesk',monospace] text-xs tracking-wider text-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#c5a059] shadow-[0_0_8px_#c5a059]" />
                <span>HANDMADE WITH GRAPHITE & CHARCOAL</span>
              </div>
            </div>
          </div>

          {/* Biography & Philosophy Column */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            <div className="flex gap-3 flex-wrap">
              <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] tracking-wider uppercase">
                PENCIL SKETCH ARTIST
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-['Space_Grotesk',monospace] text-xs text-slate-400 tracking-wider">
                INSTAGRAM: {ARTIST_INFO.instagramUsername}
              </span>
            </div>

            <h3 className="font-['Bebas_Neue',sans-serif] text-3xl md:text-4xl text-white tracking-wide leading-tight">
              Crafting Hyper-Realistic Art From The Soul
            </h3>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Welcome to <strong className="text-white font-semibold">TLArts</strong>, the creative studio of sketch artist <strong className="text-white font-semibold">Tushar Lohar</strong>. 
              Driven by a deep passion for the nuances of human emotion and realism, each artwork is meticulously hand-drawn using graphite and charcoal pencils.
            </p>

            <p className="text-slate-400 text-base leading-relaxed">
              Rather than generic reproductions, each sketch is built through hours of deliberate layering—from the fine curvature of eyelashes and the warmth of a smile, to the subtle gradient of ambient shadows across portrait paper.
            </p>

            {/* Core Values Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              <div className="flex gap-3.5 bg-[#161622]/60 border border-white/5 p-4 rounded-xl">
                <div className="text-[#c5a059] bg-[#c5a059]/10 p-2.5 rounded-lg flex items-center justify-center h-fit">
                  <Eye size={18} />
                </div>
                <div>
                  <h4 className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide mb-1">Realistic Detailing</h4>
                  <p className="text-xs text-slate-400 leading-normal">Micro-textures, delicate skin tones, and expressive eye reflections.</p>
                </div>
              </div>

              <div className="flex gap-3.5 bg-[#161622]/60 border border-white/5 p-4 rounded-xl">
                <div className="text-[#c5a059] bg-[#c5a059]/10 p-2.5 rounded-lg flex items-center justify-center h-fit">
                  <Feather size={18} />
                </div>
                <div>
                  <h4 className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide mb-1">Archival Mediums</h4>
                  <p className="text-xs text-slate-400 leading-normal">High-grade Bristol paper, Staedtler graphite, and UV protective seals.</p>
                </div>
              </div>

              <div className="flex gap-3.5 bg-[#161622]/60 border border-white/5 p-4 rounded-xl">
                <div className="text-[#c5a059] bg-[#c5a059]/10 p-2.5 rounded-lg flex items-center justify-center h-fit">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide mb-1">Personalized Meaning</h4>
                  <p className="text-xs text-slate-400 leading-normal">Cherished memories transformed into timeless, frameable keepsakes.</p>
                </div>
              </div>

              <div className="flex gap-3.5 bg-[#161622]/60 border border-white/5 p-4 rounded-xl">
                <div className="text-[#c5a059] bg-[#c5a059]/10 p-2.5 rounded-lg flex items-center justify-center h-fit">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide mb-1">Direct Connection</h4>
                  <p className="text-xs text-slate-400 leading-normal">All completed pieces and work-in-progress shared on Instagram.</p>
                </div>
              </div>
            </div>

            {/* Link to Instagram & Gallery */}
            <div className="flex gap-4 mt-2 flex-wrap">
              <a
                href="#gallery"
                className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-[#09090d] font-semibold px-6 py-3 rounded-md text-sm transition-all duration-300 shadow-lg shadow-[#c5a059]/25 hover:-translate-y-0.5"
              >
                Explore The Gallery →
              </a>
              <a
                href={ARTIST_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 px-6 py-3 rounded-md text-sm font-['Space_Grotesk',monospace] transition-all duration-300 hover:-translate-y-0.5"
              >
                View on Instagram ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

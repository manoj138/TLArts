import { useState, useMemo } from 'react';
import { Search, Filter, Eye, X } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTWORK_CATEGORIES } from '../../data/artworks';
import { useArtworks } from '../../context/ArtworkContext';

export default function SketchGallery({ onSelectArtwork }) {
  const { artworks } = useArtworks();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter artworks based on category and search query
  const filteredArtworks = useMemo(() => {
    return artworks.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medium.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [artworks, selectedCategory, searchQuery]);

  return (
    <section id="gallery" className="py-20 sm:py-28 px-3.5 sm:px-6 md:px-12 bg-[#08080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Gallery Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-3 uppercase">
            THE COMPLETE COLLECTION
          </span>
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-7xl tracking-wider text-white leading-none mb-3">
            SKETCH <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">GALLERY</span>
          </h2>
          <p className="font-['Cinzel',serif] text-base md:text-lg italic text-slate-400 max-w-xl mx-auto">
            Explore authentic graphite and charcoal studies. Click any sketch to view archival details and direct Instagram post.
          </p>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ARTWORK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`text-[11px] sm:text-xs md:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#e8c985] to-[#c5a059] text-black font-semibold shadow-md shadow-[#c5a059]/20'
                    : 'bg-[#161622]/80 text-slate-400 hover:text-white border border-white/10 hover:border-[#c5a059]/30'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sketches by title, medium..."
              className="w-full bg-[#12121a] border border-white/10 focus:border-[#c5a059] rounded-full py-2 pl-9 pr-9 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
              aria-label="Search artworks"
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Count & Status */}
        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/5 pb-4 mb-6 sm:mb-8">
          <span>
            Showing <strong className="text-white font-medium">{filteredArtworks.length}</strong> of {artworks.length} sketches
          </span>
          {selectedCategory !== 'All' && (
            <span className="flex items-center gap-1.5 text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded font-mono text-[11px] sm:text-xs">
              <Filter size={11} /> {selectedCategory}
            </span>
          )}
        </div>

        {/* Artworks Grid: 2 columns on mobile, 2 on tablet, 3 on desktop, 4 on xl */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-[#111118] border border-white/5 hover:border-[#c5a059]/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl text-left group flex flex-col justify-between"
                onClick={() => onSelectArtwork(art)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectArtwork(art);
                  }
                }}
              >
                <div>
                  <div className="relative w-full h-44 sm:h-64 md:h-72 overflow-hidden bg-black/60">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 contrast-105 block"
                      loading="lazy"
                    />
                    <div className="hidden sm:flex absolute inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-black font-medium text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Eye size={13} /> Inspect Artwork
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/85 border border-white/10 backdrop-blur-md font-['Space_Grotesk',monospace] text-[8px] sm:text-[10px] tracking-wider text-[#c5a059] px-2 sm:px-2.5 py-0.5 rounded-full truncate max-w-[85%]">
                      {art.category}
                    </div>
                  </div>

                  <div className="p-3 sm:p-5">
                    <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-['Space_Grotesk',monospace] text-slate-500 mb-1 sm:mb-1.5">
                      <span>{art.year}</span>
                      <span>{art.dimensions.split(' ')[0]}</span>
                    </div>
                    <h3 className="font-['Bebas_Neue',sans-serif] text-base sm:text-xl text-white tracking-wide mb-0.5 sm:mb-1 line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 truncate mb-2 sm:mb-4">
                      {art.medium}
                    </p>
                  </div>
                </div>

                <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                  <div className="flex justify-between items-center border-t border-white/5 pt-2 sm:pt-3">
                    <span className="font-['Space_Grotesk',monospace] text-[10px] sm:text-xs text-[#c5a059] group-hover:translate-x-0.5 transition-transform">
                      View Story →
                    </span>
                    <a
                      href={art.instagramPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-[#c5a059] p-0.5 sm:p-1 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Open on Instagram"
                    >
                      <InstagramIcon size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-20 px-6 bg-[#12121a]/50 border border-dashed border-white/10 rounded-2xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto mb-4">
              <Search size={26} />
            </div>
            <h3 className="font-['Bebas_Neue',sans-serif] text-2xl text-white tracking-wide mb-2">
              No Sketches Found
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              We couldn&apos;t find any artwork matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}. Try another keyword or reset the filter.
            </p>
            <button
              type="button"
              className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] text-black font-semibold text-xs px-5 py-2.5 rounded-full cursor-pointer hover:shadow-lg transition-all"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

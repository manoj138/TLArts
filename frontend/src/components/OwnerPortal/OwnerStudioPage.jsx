import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  Copy,
  Trash2,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Layers,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { useArtworks } from '../../context/ArtworkContext';
import { ARTWORK_CATEGORIES } from '../../data/artworks';

export default function OwnerStudioPage() {
  const { artworks, addArtwork, deleteCustomArtwork, closeStudio, logoutOwner } = useArtworks();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Realistic Portraits');
  const [medium, setMedium] = useState('Graphite & Charcoal on 250 GSM Bristol Paper');
  const [dimensions, setDimensions] = useState('A3 (29.7 × 42.0 cm)');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [instagramPostUrl, setInstagramPostUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  // Handle local file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large (max 5MB).');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Artwork Title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an artwork image (upload file or enter URL).');
      return;
    }

    const newSketch = {
      title: title.trim(),
      category,
      medium: medium.trim() || 'Graphite & Charcoal on Paper',
      dimensions: dimensions.trim() || 'A3 (29.7 × 42.0 cm)',
      description: description.trim() || 'Original handmade graphite and charcoal portrait study by Tushar Lohar.',
      imageUrl: imageUrl.trim(),
      instagramPostUrl: instagramPostUrl.trim() || 'https://www.instagram.com/artist_tushar_02/',
      isFeatured,
      year: `${new Date().getFullYear()}`
    };

    addArtwork(newSketch);
    setSuccessMsg(`"${newSketch.title}" is now published live on your portfolio!`);

    // Reset Form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview('');
    setInstagramPostUrl('');
    setError('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Generate code snippet to paste into artworks.js
  const handleCopyCode = () => {
    const snippet = {
      id: `sketch-${Date.now()}`,
      title: title || 'Artwork Title',
      slug: (title || 'new-sketch').toLowerCase().replace(/\s+/g, '-'),
      category,
      medium,
      dimensions,
      year: `${new Date().getFullYear()}`,
      description: description || 'Detailed sketch description...',
      imageUrl: imageUrl.startsWith('data:') ? '/assets/sketches/your_image.jpg' : imageUrl,
      instagramPostUrl: instagramPostUrl || 'https://www.instagram.com/artist_tushar_02/',
      isFeatured
    };

    navigator.clipboard.writeText(JSON.stringify(snippet, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Filter artworks in the manager table
  const displayedArtworks = artworks.filter(
    (art) => filterCat === 'All' || art.category === filterCat
  );

  return (
    <div className="min-h-screen bg-[#06060a] text-slate-200 flex flex-col selection:bg-[#c5a059] selection:text-black">
      {/* Top Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-[#09090f]/95 border-b border-white/10 backdrop-blur-md px-6 md:px-12 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Back to Website Button */}
          <button
            type="button"
            onClick={closeStudio}
            className="flex items-center gap-2 bg-white/5 hover:bg-[#c5a059]/15 border border-white/15 hover:border-[#c5a059]/50 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-xs md:text-sm font-['Space_Grotesk',monospace] transition-all duration-200 cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>← Return to Portfolio Website</span>
          </button>

          {/* Center Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8c985] to-[#c5a059] text-black flex items-center justify-center font-bold shadow-md shadow-[#c5a059]/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Bebas_Neue',sans-serif] text-2xl tracking-wider text-white">
                  TLARTS STUDIO
                </span>
                <span className="bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                  CMS DASHBOARD
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 block leading-tight">
                ARTIST: TUSHAR LOHAR (@ARTIST_TUSHAR_02)
              </span>
            </div>
          </div>

          {/* Right Status Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#12121c] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
              <Layers size={14} className="text-[#c5a059]" />
              <span>{artworks.length} Sketches Active</span>
            </div>

            <button
              type="button"
              onClick={logoutOwner}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
              title="Logout from Studio"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-10 space-y-12">
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-sm text-emerald-300 flex items-center justify-between shadow-xl animate-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={16} className="text-emerald-400" />
              </div>
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-emerald-400 hover:text-emerald-200 text-xs cursor-pointer font-mono"
            >
              Dismiss ✕
            </button>
          </div>
        )}

        {/* Top Studio Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 text-left">
          <div>
            <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] tracking-widest uppercase block mb-1">
              FULL-PAGE CREATION STUDIO
            </span>
            <h1 className="font-['Bebas_Neue',sans-serif] text-4xl md:text-5xl text-white tracking-wide leading-none">
              Publish & Manage Sketches
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mt-1">
              Add new pencil portraits, link their Instagram posts, and preview in real-time before publishing to your live portfolio.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeStudio}
              className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye size={15} />
              <span>View Live Website</span>
            </button>
          </div>
        </div>

        {/* Split Screen Workspace: Form (Left) & Real-Time Card Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
          {/* Left Column: Spacious Form */}
          <div className="lg:col-span-7 bg-[#0e0e16] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-[#c5a059]" />
                <h3 className="font-['Bebas_Neue',sans-serif] text-2xl text-white tracking-wide">
                  Add New Sketch Form
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                Fields marked <span className="text-rose-400">*</span> are required
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> {error}
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-5">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Artwork Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Portrait of Resilience"
                    className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-sm text-white outline-none cursor-pointer"
                  >
                    {ARTWORK_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Medium & Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Medium & Tools
                  </label>
                  <input
                    type="text"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="e.g. Staedtler 8B Graphite & Charcoal on Bristol Sheet"
                    className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. A3 (29.7 × 42.0 cm)"
                    className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                  Artwork Description & Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the facial expression, light study, hours invested, or texture details..."
                  className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none transition-all resize-y"
                />
              </div>

              {/* Image Source Selection */}
              <div className="bg-[#12121c] border border-white/10 rounded-xl p-5 space-y-4">
                <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-[#c5a059]">
                  Artwork Image Source <span className="text-rose-400">*</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Option A: Local File Upload */}
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#c5a059]/50 rounded-xl p-5 cursor-pointer bg-[#181826] transition-all group">
                      <Upload size={24} className="text-[#c5a059] group-hover:scale-110 transition-transform mb-1.5" />
                      <span className="text-xs text-white font-medium">Upload From Your Computer</span>
                      <span className="text-[10px] text-slate-500 mt-1">JPG, PNG, WebP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Option B: Direct Web Image URL */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      OR Paste Image Web Link:
                    </span>
                    <div className="relative">
                      <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="url"
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={handleUrlChange}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#181826] border border-white/10 focus:border-[#c5a059] rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Supports direct image links from Cloudinary, Imgur, Unsplash, etc.
                    </span>
                  </div>
                </div>
              </div>

              {/* Instagram Post Link */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                  Instagram Post URL
                </label>
                <div className="relative">
                  <InstagramIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    value={instagramPostUrl}
                    onChange={(e) => setInstagramPostUrl(e.target.value)}
                    placeholder="https://www.instagram.com/p/C-example123/"
                    className="w-full bg-[#141420] border border-white/10 focus:border-[#c5a059] rounded-xl py-3 pl-10 pr-3 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  When visitors click &quot;View Original on Instagram&quot;, they will directly open this specific post!
                </span>
              </div>

              {/* Feature Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-[#141420] border border-white/10 rounded-xl">
                <div>
                  <span className="font-['Space_Grotesk',monospace] text-xs font-semibold text-white block">
                    Feature on Homepage Carousel
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Display prominently in the top &quot;Featured Sketches&quot; section on the homepage.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 text-[#c5a059] focus:ring-[#c5a059] bg-[#1a1a28] cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-sm py-3.5 rounded-xl shadow-xl shadow-[#c5a059]/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus size={18} />
                  <span>Publish Sketch to Live Portfolio</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs px-5 py-3.5 rounded-xl transition-all cursor-pointer font-mono"
                  title="Copy code snippet to paste into src/data/artworks.js"
                >
                  {copiedCode ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Code for artworks.js</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Real-Time Live Card Preview */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={14} /> Real-Time Live Card Preview
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Visitor Viewport
              </span>
            </div>

            {/* Exact Replicated Card */}
            <div className="bg-[#111118] border border-white/15 hover:border-[#c5a059]/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <div className="relative w-full h-80 bg-black/80 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={title || 'Preview'}
                    className="w-full h-full object-cover contrast-105 block"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-500">
                    <Upload size={36} className="mx-auto mb-2 opacity-40 text-[#c5a059]" />
                    <span className="text-xs font-mono block">Image Preview will appear here</span>
                    <span className="text-[10px] text-slate-600">Select a file or paste URL on the left</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/85 border border-white/15 backdrop-blur-md font-['Space_Grotesk',monospace] text-[10px] tracking-wider text-[#c5a059] px-3 py-1 rounded-full">
                  {category}
                </div>
                {isFeatured && (
                  <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                    FEATURED
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs text-slate-400 mb-2">
                  <span>{new Date().getFullYear()}</span>
                  <span className="text-[#c5a059]">•</span>
                  <span>{dimensions}</span>
                </div>

                <h3 className="font-['Bebas_Neue',sans-serif] text-3xl tracking-wide text-white mb-1.5 leading-tight">
                  {title || 'Your Artwork Title'}
                </h3>
                <p className="text-xs text-slate-400 mb-3 truncate font-mono">
                  {medium}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-5 line-clamp-2">
                  {description || 'Your description will appear here on the artwork card.'}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059] font-medium">
                    Explore Sketch →
                  </span>
                  <div className="text-slate-400 p-1.5 bg-white/5 border border-white/10 rounded-full">
                    <InstagramIcon size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Guide Tip */}
            <div className="p-4 bg-[#101018] border border-white/10 rounded-xl text-xs text-slate-400 space-y-1">
              <strong className="text-slate-200 block font-['Space_Grotesk',monospace]">
                ✦ Instant Publishing Note
              </strong>
              <p className="leading-relaxed">
                When you click &ldquo;Publish Sketch&rdquo;, it saves to your browser immediately. When you are ready to make it permanent for all users, click &ldquo;Copy Code for artworks.js&rdquo; and paste it into the project file.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Visual Portfolio Manager Table */}
        <div className="bg-[#0e0e16] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide leading-none">
                All Portfolio Sketches ({artworks.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                View, inspect, and manage all active sketches in your portfolio collection.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#c5a059]" />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-[#161622] border border-white/10 text-xs text-slate-200 rounded-lg p-2 outline-none cursor-pointer"
              >
                {ARTWORK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-[#12121c] border border-white/10 hover:border-[#c5a059]/40 rounded-xl overflow-hidden p-3 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative w-full h-44 rounded-lg overflow-hidden bg-black/60 mb-3">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-black/80 text-[10px] text-[#c5a059] px-2 py-0.5 rounded-full font-mono">
                      {art.category}
                    </span>
                    {art.isCustom && (
                      <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  <h4 className="font-['Bebas_Neue',sans-serif] text-xl text-white tracking-wide truncate">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mb-1">
                    {art.medium}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {art.dimensions} • {art.year}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-3">
                  <a
                    href={art.instagramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#c5a059] text-[11px] font-mono flex items-center gap-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink size={11} />
                  </a>

                  {art.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCustomArtwork(art.id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Delete this sketch"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

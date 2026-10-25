import { useState } from 'react';
import { Plus, X, Upload, Link as LinkIcon, Sparkles, Check, Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { useArtworks } from '../../context/ArtworkContext';
import { ARTWORK_CATEGORIES } from '../../data/artworks';

export default function AddArtworkModal() {
  const { isAddModalOpen, setIsAddModalOpen, addArtwork, artworks, deleteCustomArtwork } = useArtworks();

  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
  const [copiedCode, setCopiedCode] = useState(false);

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

  if (!isAddModalOpen) return null;

  // Custom artworks currently added
  const customArtworks = artworks.filter((a) => a.isCustom);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Artwork Title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an image (upload or enter URL).');
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
    setSuccessMsg('Sketch successfully added to your portfolio!');

    // Reset Form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview('');
    setInstagramPostUrl('');
    setError('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // Generate JavaScript code snippet for artworks.js
  const generateSnippet = () => {
    const sample = {
      id: `sketch-${Date.now()}`,
      title: title || 'New Sketch Title',
      slug: (title || 'new-sketch').toLowerCase().replace(/\s+/g, '-'),
      category,
      medium,
      dimensions,
      year: `${new Date().getFullYear()}`,
      description: description || 'Sketch description here...',
      imageUrl: imageUrl.startsWith('data:') ? '/assets/sketches/your_image.jpg' : imageUrl,
      instagramPostUrl: instagramPostUrl || 'https://www.instagram.com/artist_tushar_02/',
      isFeatured
    };

    return JSON.stringify(sample, null, 2);
  };

  const handleCopyCode = () => {
    const code = generateSnippet();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
      onClick={() => setIsAddModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-[#101018] border border-[#c5a059]/40 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-black p-6 md:p-8 text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
          onClick={() => setIsAddModalOpen(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide leading-none">
              Owner Studio — Manage Artworks
            </h2>
            <span className="font-['Space_Grotesk',monospace] text-[11px] text-[#c5a059] tracking-wider uppercase">
              TUSHAR LOHAR PORTFOLIO MANAGER
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-white/10 mt-5 mb-6">
          <button
            type="button"
            className={`font-['Space_Grotesk',monospace] text-xs font-semibold pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('add')}
          >
            + Add New Sketch
          </button>
          <button
            type="button"
            className={`font-['Space_Grotesk',monospace] text-xs font-semibold pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('manage')}
          >
            <span>Custom Sketches</span>
            <span className="bg-[#c5a059]/20 text-[#c5a059] px-2 py-0.2 rounded-full text-[10px]">
              {customArtworks.length}
            </span>
          </button>
        </div>

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Check size={16} /> {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <X size={16} /> {error}
          </div>
        )}

        {activeTab === 'add' ? (
          /* Add Artwork Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                  Artwork Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Portrait of Resilience"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-2.5 text-xs md:text-sm text-white outline-none cursor-pointer"
                >
                  {ARTWORK_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medium */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                  Medium & Tools
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. Graphite 8B & Charcoal on Bristol Sheet"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. A3 (29.7 × 42.0 cm)"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Artwork Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the shading technique, facial emotion, or background story..."
                className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-2.5 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all resize-y"
              />
            </div>

            {/* Image Upload / URL Options */}
            <div className="bg-[#14141e] border border-white/10 rounded-xl p-4 space-y-3">
              <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-[#c5a059]">
                Artwork Image Source <span className="text-rose-400">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Local Upload */}
                <div>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#c5a059]/40 rounded-xl p-4 cursor-pointer bg-[#181824] transition-all">
                    <Upload size={20} className="text-[#c5a059] mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Upload Image From Device</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Web URL */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-mono">OR Enter Image Web URL:</span>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="url"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={handleUrlChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#181824] border border-white/10 focus:border-[#c5a059] rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Image Preview */}
              {imagePreview && (
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-white/15"
                  />
                  <div className="text-xs">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check size={12} /> Image Ready for Preview
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                      {imageUrl.startsWith('data:') ? 'Local file uploaded as Base64' : imageUrl}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Instagram Post Link */}
            <div>
              <label className="block font-['Space_Grotesk',monospace] text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                Instagram Post URL
              </label>
              <div className="relative">
                <InstagramIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="url"
                  value={instagramPostUrl}
                  onChange={(e) => setInstagramPostUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/C-example123/"
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg py-2.5 pl-8 pr-3 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                When visitors click &quot;View on Instagram&quot;, they will land directly on this specific post!
              </span>
            </div>

            {/* Feature on Homepage Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="feat-checkbox"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 text-[#c5a059] focus:ring-[#c5a059] bg-[#161622] cursor-pointer"
              />
              <label htmlFor="feat-checkbox" className="text-xs text-slate-300 cursor-pointer">
                Display in <strong>Featured Sketches</strong> section on homepage
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/10">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs py-3 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Sketch to Live Portfolio</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs px-4 py-3 rounded-lg transition-colors cursor-pointer"
                onClick={handleCopyCode}
                title="Copy formatted JavaScript object to paste into src/data/artworks.js"
              >
                {copiedCode ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-300">Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Code for artworks.js</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Manage Custom Artworks Tab */
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Custom sketches added during this session. You can delete them or preview their details.
            </p>

            {customArtworks.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {customArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between gap-4 p-3.5 bg-[#14141e] border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-12 h-12 object-cover rounded-lg border border-white/15"
                      />
                      <div>
                        <h4 className="font-['Bebas_Neue',sans-serif] text-lg text-white tracking-wide leading-none">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-[#c5a059] font-mono block">
                          {art.category} • {art.year}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() => deleteCustomArtwork(art.id)}
                      title="Delete this sketch"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-500">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No custom sketches added yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

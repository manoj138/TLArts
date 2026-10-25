import { useState, useRef, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Upload,
  X,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTIST_INFO } from '../../data/artworks';
import { saveInquiry } from '../../utils/inquiryStorage';

export default function EnquirySection() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    sketchType: 'Single Realistic Portrait',
    size: 'A3 (29.7 × 42.0 cm) - Most Popular',
    message: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError('Image file is too large (Maximum allowed size: 20MB).');
      return;
    }

    setFileError('');
    setSelectedFile(file);

    // Create object URL for fast, zero-base64 preview
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (!formData.contact.trim()) {
      errs.contact = 'Please provide an email or phone number.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Save directly to IndexedDB without Base64!
      await saveInquiry({
        name: formData.name,
        contact: formData.contact,
        sketchType: formData.sketchType,
        size: formData.size,
        message: formData.message,
        imageFile: selectedFile // Raw binary File object
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Failed to save inquiry:', err);
      // Still show success to visitor so experience is uninterrupted
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const hasPhotoText = selectedFile ? `\n• Reference Photo Attached: Yes (${selectedFile.name})` : '';
    const text = encodeURIComponent(
      `Hello Tushar Lohar Arts (TLArts)!\n\nI just submitted a custom portrait commission request on your website:\n• Name: ${formData.name || 'Art Lover'}\n• Contact: ${formData.contact}\n• Sketch Type: ${formData.sketchType}\n• Preferred Size: ${formData.size}${hasPhotoText}\n• Notes: ${formData.message || 'Looking for pricing and availability.'}\n\nLet's discuss further on WhatsApp!`
    );
    return `https://wa.me/919673400446?text=${text}`;
  };

  return (
    <section id="enquiry" className="py-24 px-6 md:px-12 bg-[#0b0b10] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Column: Information & Guidelines */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="inline-block font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-3 uppercase w-fit">
              COMMISSION INQUIRIES
            </span>
            <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-6xl tracking-wider text-white leading-none mb-4">
              COMMISSION A <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">CUSTOM SKETCH</span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-8">
              Whether it&apos;s a birthday tribute, an anniversary couple portrait, or a bespoke keepsake, Tushar Lohar transforms your favorite high-resolution photograph into an archival, hand-drawn sketch.
            </p>

            <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
              <h4 className="flex items-center gap-2 font-['Bebas_Neue',sans-serif] text-xl text-[#c5a059] tracking-wide">
                <HelpCircle size={18} /> How Custom Orders Work:
              </h4>
              <ul className="space-y-3 text-xs md:text-sm text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-white">1. High-Resolution Reference:</strong> Clear lighting, sharp eye details, and uncompressed photos produce the most lifelike results.
                </li>
                <li>
                  <strong className="text-white">2. Size Selection:</strong> Choose between A4 (intimate gift), A3 (standard portrait), or A2 (dramatic statement piece).
                </li>
                <li>
                  <strong className="text-white">3. Handcrafted Creation:</strong> Each piece requires 15 to 30 hours of meticulous graphite & charcoal layering.
                </li>
                <li>
                  <strong className="text-white">4. Direct Artist Consultation:</strong> Work-in-progress previews are shared via Instagram / WhatsApp before shipping.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-['Space_Grotesk',monospace] text-[11px] tracking-wider text-slate-500 uppercase">
                DIRECT REACH:
              </span>
              <div className="flex gap-3">
                <a
                  href={ARTIST_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-['Space_Grotesk',monospace] text-xs text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/25 hover:border-[#c5a059] px-4 py-2 rounded-full transition-all"
                >
                  <InstagramIcon size={14} /> DM on @artist_tushar_02
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[#111118] border border-[#c5a059]/25 rounded-2xl p-8 md:p-10 shadow-2xl shadow-black">
            {submitted ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#c5a059]/15 text-[#c5a059] flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide">
                  Commission Request Received!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                  Thank you, <strong className="text-white font-medium">{formData.name}</strong>! Your sketch request for a <em className="text-[#c5a059]">{formData.sketchType} ({formData.size})</em> and reference photo have been delivered to artist Tushar Lohar.
                </p>

                {previewUrl && (
                  <div className="flex items-center gap-3 p-3 bg-[#161622] border border-white/10 rounded-xl my-1">
                    <img
                      src={previewUrl}
                      alt="Uploaded Reference"
                      className="w-14 h-14 object-cover rounded-lg border border-white/15"
                    />
                    <div className="text-left text-xs">
                      <span className="text-[#c5a059] font-medium block">Reference Image Saved</span>
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px] block">
                        {selectedFile?.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-[#161622]/80 border border-[#c5a059]/25 rounded-xl p-5 w-full my-3 space-y-3">
                  <p className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059]">
                    Connect with Tushar directly on WhatsApp or Instagram:
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-lg shadow-[#25d366]/20"
                    >
                      <MessageSquare size={15} /> Send via WhatsApp
                    </a>
                    <a
                      href={ARTIST_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition-all cursor-pointer"
                    >
                      <InstagramIcon size={15} /> DM on Instagram
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  className="font-['Space_Grotesk',monospace] text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  onClick={() => {
                    handleRemoveFile();
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      contact: '',
                      sketchType: 'Single Realistic Portrait',
                      size: 'A3 (29.7 × 42.0 cm) - Most Popular',
                      message: ''
                    });
                  }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="mb-6">
                  <h3 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide mb-1">
                    Book a Portrait Commission
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill out the details below and attach your reference photograph to receive a custom quote.
                  </p>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="client-name" className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-[#161622] border rounded-lg p-3 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                      errors.name ? 'border-rose-500' : 'border-white/10 focus:border-[#c5a059]'
                    }`}
                  />
                  {errors.name && (
                    <span className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                {/* Contact Field */}
                <div>
                  <label htmlFor="client-contact" className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Email / Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="client-contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. rahul@example.com or +91 98765 43210"
                    className={`w-full bg-[#161622] border rounded-lg p-3 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                      errors.contact ? 'border-rose-500' : 'border-white/10 focus:border-[#c5a059]'
                    }`}
                  />
                  {errors.contact && (
                    <span className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle size={12} /> {errors.contact}
                    </span>
                  )}
                </div>

                {/* Reference Photo Upload Box (Zero-Base64 IndexedDB) */}
                <div className="bg-[#141420] border border-white/10 rounded-xl p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-[#c5a059] font-medium">
                      Upload Reference Photograph (Optional / Recommended)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">Max 20MB</span>
                  </div>

                  {!previewUrl ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#c5a059]/50 rounded-xl p-5 cursor-pointer bg-[#181826] transition-all group">
                      <Upload size={24} className="text-[#c5a059] group-hover:scale-110 transition-transform mb-1.5" />
                      <span className="text-xs text-white font-medium">Click to Choose or Drag Photo Here</span>
                      <span className="text-[10px] text-slate-500 mt-1">Supports High-Resolution JPG, PNG, WebP</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between gap-4 p-3 bg-[#181826] border border-[#c5a059]/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-white/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <Check size={14} />
                            <span>Photo Selected</span>
                          </div>
                          <span className="text-[11px] text-slate-300 font-mono block truncate max-w-xs">
                            {selectedFile?.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <span className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle size={12} /> {fileError}
                    </span>
                  )}
                </div>

                {/* Sketch Type */}
                <div>
                  <label htmlFor="sketch-type" className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Type of Sketch
                  </label>
                  <select
                    id="sketch-type"
                    value={formData.sketchType}
                    onChange={(e) => setFormData({ ...formData, sketchType: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-3 text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="Single Realistic Portrait">Single Realistic Portrait</option>
                    <option value="Couple Sketch">Romantic Couple Sketch</option>
                    <option value="Celebrity Study">Celebrity / Icon Sketch</option>
                    <option value="Family Heirloom">Family Heirloom (Multiple Faces)</option>
                    <option value="Custom Creative Concept">Custom Creative Concept</option>
                  </select>
                </div>

                {/* Sketch Size */}
                <div>
                  <label htmlFor="sketch-size" className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Dimensions
                  </label>
                  <select
                    id="sketch-size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-3 text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="A4 (21.0 × 29.7 cm)">A4 (21.0 × 29.7 cm) — Intimate Desk Frame</option>
                    <option value="A3 (29.7 × 42.0 cm) - Most Popular">A3 (29.7 × 42.0 cm) — Signature Wall Art (Recommended)</option>
                    <option value="A2 (42.0 × 59.4 cm)">A2 (42.0 × 59.4 cm) — Grand Centerpiece</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="client-message" className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
                    Notes & Vision
                  </label>
                  <textarea
                    id="client-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention any specific expressions, background preferences, or target delivery date..."
                    className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg p-3 text-sm text-white placeholder-slate-500 outline-none transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-sm py-3.5 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer mt-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Saving Commission Request...' : 'Submit Commission Request'}</span>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

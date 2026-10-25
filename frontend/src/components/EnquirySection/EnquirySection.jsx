import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';
import { ARTIST_INFO } from '../../data/artworks';

export default function EnquirySection() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    sketchType: 'Single Realistic Portrait',
    size: 'A3 (29.7 × 42.0 cm) - Most Popular',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  const generateWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello Tushar Lohar Arts (TLArts)!\n\nI am interested in commissioning a custom sketch:\n• Name: ${formData.name || 'Art Lover'}\n• Type: ${formData.sketchType}\n• Preferred Size: ${formData.size}\n• Notes: ${formData.message || 'Looking for details on pricing and availability.'}\n\nLet's discuss further on Instagram / WhatsApp!`
    );
    return `https://wa.me/919876543210?text=${text}`;
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
                  Commission Request Prepared!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                  Thank you, <strong className="text-white font-medium">{formData.name}</strong>! Your sketch request for a <em className="text-[#c5a059]">{formData.sketchType} ({formData.size})</em> has been generated.
                </p>

                <div className="bg-[#161622]/80 border border-[#c5a059]/25 rounded-xl p-5 w-full my-3 space-y-3">
                  <p className="font-['Space_Grotesk',monospace] text-xs text-[#c5a059]">
                    To send this commission directly to Tushar Lohar with one click:
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <a
                      href={ARTIST_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition-all cursor-pointer"
                    >
                      <InstagramIcon size={15} /> Send via Instagram DM
                    </a>
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <MessageSquare size={15} /> Send via WhatsApp
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  className="font-['Space_Grotesk',monospace] text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  onClick={() => {
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
                    Fill out the details below to receive a custom quote.
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-sm py-3.5 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer mt-2"
                >
                  <span>Prepare Commission Request</span>
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

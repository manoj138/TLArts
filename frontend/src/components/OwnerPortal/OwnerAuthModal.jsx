import { useState } from 'react';
import { ShieldCheck, Lock, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useArtworks } from '../../context/ArtworkContext';

export default function OwnerAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, verifyPasscode } = useArtworks();
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the owner passcode.');
      triggerShake();
      return;
    }

    const result = verifyPasscode(passcode);
    if (result.success) {
      setPasscode('');
      setError('');
    } else {
      setError(result.error);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleClose = () => {
    setPasscode('');
    setError('');
    setIsAuthModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative bg-[#101018] border border-[#c5a059]/40 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-black text-left animate-in zoom-in-95 duration-200 ${
          shake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center mb-5">
          <ShieldCheck size={28} />
        </div>

        <h3 className="font-['Bebas_Neue',sans-serif] text-3xl text-white tracking-wide mb-1">
          Owner Studio Access
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Restricted to Tushar Lohar. Enter your secret studio passcode to manage sketches, add new artworks, and configure Instagram links.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block font-['Space_Grotesk',monospace] text-xs uppercase tracking-wider text-slate-300 mb-1.5">
              Secret Studio Passcode
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter owner passcode..."
                autoFocus
                className="w-full bg-[#161622] border border-white/10 focus:border-[#c5a059] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <span className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-['Space_Grotesk',monospace]">
                <AlertCircle size={13} /> {error}
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs py-2.5 rounded-lg shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer"
            >
              Unlock Studio
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-white/5 text-center">
          <span className="font-['Space_Grotesk',monospace] text-[10px] text-slate-500 tracking-wider uppercase">
            Default Passcode: TLARTS@02
          </span>
        </div>
      </div>
    </div>
  );
}

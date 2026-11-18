import { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';

/**
 * DeleteConfirmModal
 * A luxury dark-themed confirmation modal for permanent deletion of artworks, videos, and inquiries.
 * Matches TLArts luxury aesthetic with animated danger badges, backdrop blur, and keyboard support.
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName = 'this item',
  itemType = 'Item',
  thumbnailUrl = null,
  isLoading = false,
  warningMessage = null,
}) {
  // ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="relative w-full max-w-md bg-[#0d0d14] border border-rose-500/25 rounded-2xl p-6 md:p-7 shadow-2xl shadow-rose-950/40 text-slate-200 overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        {/* Subtle Top Red/Rose Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/10">
            <Trash2 size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="font-['Space_Grotesk',monospace] text-[10px] tracking-[0.2em] uppercase text-rose-400/90 font-medium block">
              Danger Action
            </span>
            <h3
              id="delete-dialog-title"
              className="font-['Bebas_Neue',sans-serif] text-2xl md:text-3xl tracking-wide text-white leading-tight"
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Item Preview Box */}
        <div className="bg-[#14141f] border border-white/10 rounded-xl p-3.5 mb-5 flex items-center gap-3">
          {thumbnailUrl ? (
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
              <img
                src={thumbnailUrl}
                alt={itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">
                {itemType}
              </span>
            </div>
            <p className="text-sm font-medium text-white truncate" title={itemName}>
              {itemName}
            </p>
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5 mb-6 flex items-start gap-3">
          <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-200/90 leading-relaxed font-['Space_Grotesk',monospace]">
            {warningMessage ||
              'This action cannot be undone. It will be permanently removed from your portfolio, database, and Cloudinary media storage.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-xs tracking-wider uppercase shadow-lg shadow-rose-950/50 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


import { Plus, LogOut, ShieldCheck } from 'lucide-react';
import { useArtworks } from '../../context/ArtworkContext';

export default function OwnerFloatingBar() {
  const { isOwner, setIsAddModalOpen, logoutOwner } = useArtworks();

  if (!isOwner) return null;

  return (
    <aside
      aria-label="Owner Studio Controls"
      className="fixed bottom-6 right-6 z-40 bg-[#0e0e16]/95 border border-[#c5a059]/40 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl shadow-black flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 px-2.5 text-[#c5a059]">
        <ShieldCheck size={16} />
        <span className="font-['Space_Grotesk',monospace] text-[11px] font-semibold tracking-wider uppercase hidden sm:inline">
          Owner Mode
        </span>
      </div>

      <button
        type="button"
        className="flex items-center gap-1.5 bg-gradient-to-r from-[#e8c985] to-[#c5a059] hover:from-[#f5dca2] hover:to-[#e8c985] text-black font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus size={14} />
        <span>Add Sketch</span>
      </button>

      <button
        type="button"
        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        onClick={logoutOwner}
        title="Exit Owner Studio Mode"
        aria-label="Exit Owner Mode"
      >
        <LogOut size={15} />
      </button>
    </aside>
  );
}

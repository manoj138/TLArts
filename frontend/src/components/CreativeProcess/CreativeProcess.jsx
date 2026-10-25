import { PenTool, Compass, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { CREATIVE_STEPS } from '../../data/artworks';

const STEP_ICONS = [
  <PenTool size={20} key="1" />,
  <Compass size={20} key="2" />,
  <Layers size={20} key="3" />,
  <Sparkles size={20} key="4" />,
  <CheckCircle2 size={20} key="5" />
];

export default function CreativeProcess() {
  return (
    <section id="process" className="py-24 px-6 md:px-12 bg-[#0b0b10] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block font-['Space_Grotesk',monospace] text-xs tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-4 py-1.5 rounded-full mb-3 uppercase">
            THE ARTISTIC DISCIPLINE
          </span>
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-7xl tracking-wider text-white leading-none mb-3">
            THE CREATIVE <span className="bg-gradient-to-r from-[#e8c985] to-[#c5a059] bg-clip-text text-transparent">PROCESS</span>
          </h2>
          <p className="font-['Cinzel',serif] text-base md:text-lg italic text-slate-400 max-w-xl mx-auto">
            Behind every realistic sketch lies 20+ hours of patient graphite layering, measurement, and precision craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CREATIVE_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="bg-[#111118] border border-white/5 hover:border-[#c5a059]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group text-left"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-['Bebas_Neue',sans-serif] text-4xl font-black text-[#c5a059]/40 group-hover:text-[#c5a059] transition-colors leading-none">
                    {step.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border border-[#c5a059]/20">
                    {STEP_ICONS[idx]}
                  </div>
                </div>

                <h3 className="font-['Bebas_Neue',sans-serif] text-xl text-white tracking-wide mb-2 line-clamp-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="bg-[#161622]/80 border border-white/5 rounded-lg p-2.5 text-[11px] mt-2">
                <span className="font-['Space_Grotesk',monospace] text-[#c5a059] block text-[10px] tracking-wider mb-0.5">
                  STUDIO TOOL:
                </span>
                <span className="text-slate-300 font-medium">
                  {step.tool}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

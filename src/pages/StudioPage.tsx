import React, { useState } from 'react';
import { FreeformCanvas } from '../components/FreeformCanvas';
import { PenTool, Palette, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';

interface StudioPageProps {
  initialGrid?: 'one-point' | 'two-point' | 'isometric' | 'none';
  initialPrompt?: string;
  onSavedToSketchbook?: () => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  initialGrid = 'none',
  initialPrompt,
  onSavedToSketchbook
}) => {
  const [activePrompt, setActivePrompt] = useState(initialPrompt || '');

  const quickPrompts = [
    { title: 'Modernist Cantilever', prompt: 'Construct a 2-story minimalist villa with a 4-meter cantilevered concrete slab.', grid: 'two-point' as const },
    { title: 'The Endless Colonnade', prompt: 'Draft a one-point perspective corridor with receding arches and deep shadows.', grid: 'one-point' as const },
    { title: 'Axonometric Synth Rig', prompt: 'Draw a dual-tier audio synthesizer with patch cables in 30° isometric.', grid: 'isometric' as const },
    { title: 'Freehand Plain Paper', prompt: 'Warm up with loose gesture linework and continuous contour figure studies.', grid: 'none' as const },
  ];

  return (
    <div className="space-y-8 py-6 sm:py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a] mb-1">
            <PenTool className="w-4 h-4" />
            <span>FREEFORM DRAFTING TABLE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            PixelBen Drawing Studio
          </h1>
          <p className="text-sm text-[#9ea4b0] mt-1 max-w-2xl">
            Technical Micron ink, soft graphite pencils, chisel markers, perspective guides, and symmetry mode. Draw freely or follow architectural prompts.
          </p>
        </div>

        {/* Quick Prompt Presets */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePrompt(p.prompt)}
              className="px-3 py-1.5 rounded-lg border border-white/10 glass-panel hover:bg-white/10 text-xs font-mono text-[#b8bcc8] hover:text-white whitespace-nowrap transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Canvas */}
      <section>
        <FreeformCanvas
          initialGrid={initialGrid}
          initialPrompt={activePrompt}
          onSavedToSketchbook={onSavedToSketchbook}
        />
      </section>

      {/* Studio Drafting Tips */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1.5">
          <div className="text-[#38bdf8] font-semibold">01. LINE WEIGHT CONTRAST</div>
          <p className="text-[#8e95a5] font-sans text-xs">
            Keep construction lines whisper-thin (1px, 20% opacity). Reserve bold 4px–8px Micron pens for cut planes and outer silhouettes.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1.5">
          <div className="text-[#e24a4a] font-semibold">02. SYMMETRY DISCIPLINE</div>
          <p className="text-[#8e95a5] font-sans text-xs">
            Toggle the Vertical Symmetry tool when drafting symmetrical building facades, audio monitor speakers, or columns.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1.5">
          <div className="text-[#f5f0ea] font-semibold">03. UNDERLAY TRACING</div>
          <p className="text-[#8e95a5] font-sans text-xs">
            Load preset architectural underlays with adjustable opacity to trace master proportions and understand spatial convergence.
          </p>
        </div>
      </section>
    </div>
  );
};

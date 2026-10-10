import React, { useState } from 'react';
import { isometricExercises } from '../data/isometricLessons';
import { IsometricExercise } from '../types';
import { IsometricCanvas } from '../components/IsometricCanvas';
import { Compass, BookOpen, CheckCircle, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface IsometricPageProps {
  selectedExerciseId?: string;
  onSavedToSketchbook?: () => void;
}

export const IsometricPage: React.FC<IsometricPageProps> = ({
  selectedExerciseId,
  onSavedToSketchbook
}) => {
  const [activeExercise, setActiveExercise] = useState<IsometricExercise | null>(() => {
    if (selectedExerciseId) {
      const found = isometricExercises.find(e => e.id === selectedExerciseId);
      if (found) return found;
    }
    return isometricExercises[0];
  });

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a] mb-1">
            <Compass className="w-4 h-4" />
            <span>TECHNICAL AXONOMETRY</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Isometric Practice Workbench
          </h1>
          <p className="text-sm text-[#9ea4b0] mt-1 max-w-2xl">
            Draw in true 1:1 metric scale along 30-degree axes. Use the 30° snap engine, stamp architectural primitives, or trace guided ghost templates to build muscle memory.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121319] rounded-xl border border-white/10 overflow-x-auto">
          {isometricExercises.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                activeExercise?.id === ex.id
                  ? 'bg-[#f5f0ea] text-[#0d0e11] font-semibold'
                  : 'text-[#8e95a5] hover:text-white'
              }`}
            >
              Ex 0{idx + 1}
            </button>
          ))}
          <button
            onClick={() => setActiveExercise(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
              activeExercise === null
                ? 'bg-[#f5f0ea] text-[#0d0e11] font-semibold'
                : 'text-[#8e95a5] hover:text-white'
            }`}
          >
            Free Sandbox
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <section>
        <IsometricCanvas
          exercise={activeExercise || undefined}
          onSavedToSketchbook={onSavedToSketchbook}
        />
      </section>

      {/* Step-by-Step Exercise Instructions (if active) */}
      {activeExercise && (
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-6">
          <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXERCISE DRAWING PROTOCOL</span>
          </div>

          <h3 className="font-display text-xl font-bold text-white">
            How to Construct: {activeExercise.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeExercise.instructions.map((inst, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#8e95a5]">
                  <span>STEP 0{index + 1}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-[#e24a4a]" />
                </div>
                <p className="text-xs text-[#edebe6] leading-relaxed">
                  {inst}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The 4 Laws of Isometric Drafting */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>AXONOMETRIC CONVENTIONS</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          The 4 Non-Negotiable Laws of Isometric Drawing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#e24a4a]">01. THE 30° TRIAD</span>
            <h4 className="font-display text-sm font-bold text-white">Parallel Axes Only</h4>
            <p className="text-xs text-[#9ea4b0] leading-relaxed">
              Every horizontal line in space travels strictly along 30° or 150°. There is zero vanishing point convergence.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#38bdf8]">02. TRUE VERTICALS</span>
            <h4 className="font-display text-sm font-bold text-white">Verticals Never Tilt</h4>
            <p className="text-xs text-[#9ea4b0] leading-relaxed">
              All vertical structural corners remain 90° plumb. If a vertical line tilts, the drawing is immediately perceived as tumbling down.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
            <span className="text-xs font-mono text-[#f5f0ea]">03. 1:1 METRIC PRESERVATION</span>
            <h4 className="font-display text-sm font-bold text-white">True Measurements</h4>
            <p className="text-xs text-[#9ea4b0] leading-relaxed">
              A 1-meter edge in the foreground and a 1-meter edge in the background are drawn at the exact same physical length.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
            <span className="text-xs font-mono text-emerald-400">04. PROFILE HIERARCHY</span>
            <h4 className="font-display text-sm font-bold text-white">Heavy Outer Contours</h4>
            <p className="text-xs text-[#9ea4b0] leading-relaxed">
              The outer silhouette line must be 2× to 3× heavier than internal face lines. This creates an immediate pop off the page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

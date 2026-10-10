import React, { useState } from 'react';
import { architecturalLessons } from '../data/lessonsData';
import { ArchitecturalLesson } from '../types';
import { PerspectiveVisualizer } from '../components/PerspectiveVisualizer';
import { Building2, CheckCircle2, Lightbulb, Play, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ArchitecturalLessonsPageProps {
  initialLessonId?: string;
  onLaunchCanvasWithSetup: (grid: 'one-point' | 'two-point' | 'isometric' | 'none', prompt: string) => void;
}

export const ArchitecturalLessonsPage: React.FC<ArchitecturalLessonsPageProps> = ({
  initialLessonId,
  onLaunchCanvasWithSetup
}) => {
  const [selectedLesson, setSelectedLesson] = useState<ArchitecturalLesson>(() => {
    if (initialLessonId) {
      const found = architecturalLessons.find(l => l.id === initialLessonId);
      if (found) return found;
    }
    return architecturalLessons[0];
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <div className="space-y-12 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] mb-1">
            <Building2 className="w-4 h-4" />
            <span>CURRICULUM · ARCHITECTURAL DRAWING</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Architectural Masterclasses
          </h1>
          <p className="text-sm text-[#9ea4b0] mt-1 max-w-2xl">
            Understand how light, perspective lines, horizons, and material textures transform geometric volumes into convincing architectural spaces.
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedLesson.canvasSetup) {
              onLaunchCanvasWithSetup(
                selectedLesson.canvasSetup.gridType,
                selectedLesson.canvasSetup.prompt
              );
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5f0ea] hover:bg-white text-[#0d0e11] font-semibold text-xs transition-colors shrink-0 shadow-[0_0_15px_rgba(245,240,234,0.2)]"
        >
          <Play className="w-3.5 h-3.5 fill-[#0d0e11]" />
          <span>Practice Current Lesson on Canvas</span>
        </button>
      </div>

      {/* Module Selector Carousel / Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {architecturalLessons.map((lesson, idx) => {
          const isSelected = selectedLesson.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                setSelectedLesson(lesson);
                setActiveStepIndex(0);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-white/10 border-white/40 shadow-lg scale-[1.02]'
                  : 'glass-panel border-white/5 hover:border-white/20 text-[#8e95a5]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#787f8e] mb-1">
                <span>MOD 0{idx + 1}</span>
                <span className="text-[#38bdf8]">{lesson.duration}</span>
              </div>
              <h4 className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-[#b8bcc8]'}`}>
                {lesson.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Interactive Perspective Visualizer Playground */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
          <Layers className="w-3.5 h-3.5" />
          <span>INTERACTIVE PERSPECTIVE SIMULATOR</span>
        </div>
        <PerspectiveVisualizer />
      </section>

      {/* Active Lesson Deep-Dive */}
      <section className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/15 space-y-8">
        {/* Lesson Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8]">
              <span>{selectedLesson.category}</span>
              <span>·</span>
              <span>{selectedLesson.difficulty}</span>
              <span>·</span>
              <span>{selectedLesson.duration}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {selectedLesson.title}
            </h2>

            <p className="text-sm text-[#f5f0ea]/80 font-light">
              {selectedLesson.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-[#9ea4b0] leading-relaxed">
              {selectedLesson.summary}
            </p>

            {/* Launch CTA */}
            {selectedLesson.canvasSetup && (
              <div className="pt-2">
                <button
                  onClick={() =>
                    onLaunchCanvasWithSetup(
                      selectedLesson.canvasSetup!.gridType,
                      selectedLesson.canvasSetup!.prompt
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e24a4a] hover:bg-[#c93232] text-white font-medium text-xs transition-colors shadow-[0_0_15px_rgba(226,74,74,0.3)]"
                >
                  <span>Open Interactive Canvas for this Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/15 shadow-2xl">
            <img
              src={selectedLesson.heroImage}
              alt={selectedLesson.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <span className="text-[11px] font-mono text-[#edebe6] bg-black/50 px-2.5 py-1 rounded backdrop-blur-sm">
                Architectural Study Reference
              </span>
            </div>
          </div>
        </div>

        {/* Key Principles Checklist */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL PRINCIPLES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedLesson.keyPrinciples.map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span className="text-xs text-[#d4d8e2] leading-relaxed">
                  {principle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Construction Guide */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white">
              Step-by-Step Construction Walkthrough
            </h3>
            <span className="text-xs font-mono text-[#8e95a5]">
              STEP {activeStepIndex + 1} OF {selectedLesson.steps.length}
            </span>
          </div>

          {/* Steps navigation tab strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {selectedLesson.steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  activeStepIndex === idx
                    ? 'bg-[#f5f0ea] text-[#0d0e11] font-bold'
                    : 'bg-white/5 text-[#8e95a5] hover:text-white'
                }`}
              >
                0{st.stepNumber}. {st.title.split(' ')[0]}...
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="p-6 rounded-2xl bg-[#14151b] border border-white/15 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
              <span>STEP 0{selectedLesson.steps[activeStepIndex].stepNumber}</span>
              <span>·</span>
              <span className="text-white font-semibold">{selectedLesson.steps[activeStepIndex].title}</span>
            </div>

            <p className="text-sm text-[#edebe6] leading-relaxed">
              {selectedLesson.steps[activeStepIndex].instructions}
            </p>

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#b8bcc8]">
              <Lightbulb className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Pro Tip: </span>
                <span>{selectedLesson.steps[activeStepIndex].proTip}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#9ea4b0] hover:text-white disabled:opacity-30"
              >
                ← Previous Step
              </button>

              <button
                onClick={() => setActiveStepIndex(Math.min(selectedLesson.steps.length - 1, activeStepIndex + 1))}
                disabled={activeStepIndex === selectedLesson.steps.length - 1}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white disabled:opacity-30"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

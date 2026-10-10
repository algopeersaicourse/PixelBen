import React from 'react';
import { NavPage, UserProgress, SketchItem } from '../types';
import {
  Compass,
  Building2,
  PenTool,
  Clock,
  ArrowRight,
  Flame,
  Award,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { architecturalLessons } from '../data/lessonsData';
import { isometricExercises } from '../data/isometricLessons';
import { getDailyStreakQuote } from '../utils/streakQuotes';

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectIsometricExercise: (exerciseId: string) => void;
  onOpenWarmup: () => void;
  progress: UserProgress;
  sketches: SketchItem[];
  onOpenSketchModal: (sketch: SketchItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectLesson,
  onSelectIsometricExercise,
  onOpenWarmup,
  progress,
  sketches,
  onOpenSketchModal
}) => {
  const featuredLesson = architecturalLessons[0];
  const featuredIsometric = isometricExercises[0];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 lg:p-16 border border-white/15">
        {/* Subtle decorative background gradient beam */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e24a4a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Motto kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#f5f0ea]">
            <span className="w-2 h-2 rounded-full bg-[#e24a4a] animate-pulse" />
            <span className="tracking-wide">“Every bad drawing brings you closer to a great one.”</span>
          </div>

          {/* Large PIXELBEN Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#f5f0ea] leading-none">
            PIXELBEN<span className="text-[#e24a4a]">.</span>
          </h1>

          {/* Short welcome */}
          <p className="text-base sm:text-xl text-[#b8bcc8] max-w-2xl font-light leading-relaxed">
            Welcome to your personal drawing sanctuary. Part architectural studio, part music lounge—crafted for deliberate practice, isometric mastery, and spatial intuition.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('isometrics')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f5f0ea] hover:bg-white text-[#0d0e11] font-semibold text-sm transition-all shadow-[0_0_20px_rgba(245,240,234,0.25)] hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4 text-[#e24a4a]" />
              <span>Practice Isometrics</span>
            </button>

            <button
              onClick={() => onNavigate('lessons')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-medium text-sm border border-white/20 transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4 text-[#38bdf8]" />
              <span>Architectural Lessons</span>
            </button>

            <button
              onClick={onOpenWarmup}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#d4d8e2] hover:text-white font-mono text-xs border border-white/10 transition-colors"
            >
              <Clock className="w-4 h-4 text-[#e24a4a]" />
              <span>5-Min Warm-up</span>
            </button>
          </div>

          {/* Studio Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-white/10 font-mono text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-red-500 mb-1">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[11px] text-red-400 font-semibold tracking-wider">CURRENT STREAK</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {progress.streakDays} <span className="text-xs font-normal text-red-400/80">Days</span>
              </div>
              <div className="text-[11px] text-red-500 font-sans font-semibold tracking-tight mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                <span>{getDailyStreakQuote()}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#38bdf8] mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] text-[#8e95a5]">TIME DRAWN</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {progress.totalMinutesDrawn} mins
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#f5f0ea] mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[11px] text-[#8e95a5]">STUDIES IN VAULT</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {sketches.length} Sketches
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[11px] text-[#8e95a5]">SKILL LEVEL</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                Level 2 Architect
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Jump Studio Hub Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8]">
              STUDIO WORKBENCHES
            </span>
            <h2 className="font-display text-2xl font-bold text-white">
              Choose Your Practice Discipline
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Isometric Engine */}
          <div
            onClick={() => onNavigate('isometrics')}
            className="group relative rounded-2xl p-6 glass-panel border border-white/10 hover:border-[#e24a4a]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e24a4a]/15 border border-[#e24a4a]/30 flex items-center justify-center text-[#e24a4a] group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8e95a5] uppercase">
                  Precision Axonometry
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1 group-hover:text-[#f5f0ea]">
                  Isometric Drawing
                </h3>
                <p className="text-xs text-[#9ea4b0] mt-2 leading-relaxed">
                  Interactive 30° and 150° snap grid. Stamp cubes, cylinders, stairs, and pavilions with mathematical precision.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f5f0ea] mt-6 pt-4 border-t border-white/5 group-hover:text-[#e24a4a] transition-colors">
              <span>Enter Isometric Grid</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Architectural Lessons */}
          <div
            onClick={() => onNavigate('lessons')}
            className="group relative rounded-2xl p-6 glass-panel border border-white/10 hover:border-[#38bdf8]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8e95a5] uppercase">
                  Spatial Masterclasses
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1 group-hover:text-[#f5f0ea]">
                  Architectural Lessons
                </h3>
                <p className="text-xs text-[#9ea4b0] mt-2 leading-relaxed">
                  Step-by-step guides on 1-point and 2-point perspective, 45° cast shadows, material textures, and human scale.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f5f0ea] mt-6 pt-4 border-t border-white/5 group-hover:text-[#38bdf8] transition-colors">
              <span>Browse 6 Modules</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Freeform Studio */}
          <div
            onClick={() => onNavigate('studio')}
            className="group relative rounded-2xl p-6 glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#f5f0ea] group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8e95a5] uppercase">
                  Digital Drafting Table
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1 group-hover:text-[#f5f0ea]">
                  Freeform Studio
                </h3>
                <p className="text-xs text-[#9ea4b0] mt-2 leading-relaxed">
                  Micron pens, graphite pencils, chisel markers, reference underlays, perspective guides, and symmetry mode.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f5f0ea] mt-6 pt-4 border-t border-white/5 group-hover:text-white transition-colors">
              <span>Open Blank Canvas</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lesson & Isometric Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Architectural Spotlight */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#e24a4a]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED CURRICULUM</span>
            </div>
            <span className="text-[#8e95a5]">MODULE 01</span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 group">
            <img
              src={featuredLesson.heroImage}
              alt={featuredLesson.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  {featuredLesson.difficulty} · {featuredLesson.duration}
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-1.5">
                  {featuredLesson.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#9ea4b0] leading-relaxed">
            {featuredLesson.summary}
          </p>

          <button
            onClick={() => onSelectLesson(featuredLesson.id)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            <span>Start Lesson 01</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Isometric Spotlight */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#38bdf8]">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>RECOMMENDED ISOMETRIC STUDY</span>
            </div>
            <span className="text-[#8e95a5]">EXERCISE 01</span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 group">
            <img
              src={featuredIsometric.referenceArtwork || featuredLesson.heroImage}
              alt={featuredIsometric.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  {featuredIsometric.difficulty} · {featuredIsometric.timeEstimate}
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-1.5">
                  {featuredIsometric.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#9ea4b0] leading-relaxed">
            {featuredIsometric.description}
          </p>

          <button
            onClick={() => onSelectIsometricExercise(featuredIsometric.id)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            <span>Launch Exercise & Ghost Outline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Recent Sketchbook Reel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#e24a4a]">
              STUDIO VAULT
            </span>
            <h2 className="font-display text-xl font-bold text-white">
              Recent Sketchbook Studies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-mono text-[#f5f0ea] hover:text-[#e24a4a] flex items-center gap-1 transition-colors"
          >
            <span>View All ({sketches.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sketches.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenSketchModal(item)}
              className="group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-white/30 cursor-pointer transition-all"
            >
              <div className="relative aspect-[4/3] bg-[#14151b] overflow-hidden">
                <img
                  src={item.dataUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8e95a5]">
                  <span>{item.date}</span>
                  <span className="uppercase text-[#38bdf8]">{item.category}</span>
                </div>
                <h4 className="font-display text-sm font-semibold text-white group-hover:text-[#f5f0ea] truncate">
                  {item.title}
                </h4>
                {item.notes && (
                  <p className="text-xs text-[#9ea4b0] line-clamp-1">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

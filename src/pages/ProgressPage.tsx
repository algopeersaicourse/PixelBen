import React, { useState } from 'react';
import { UserProgress, SketchItem } from '../types';
import { saveStoredProgress, deleteStoredSketch } from '../utils/storage';
import { getDailyStreakQuote } from '../utils/streakQuotes';
import {
  Flame,
  Clock,
  Layers,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Download,
  Maximize2,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ProgressPageProps {
  progress: UserProgress;
  sketches: SketchItem[];
  onRefreshSketches: () => void;
  onOpenSketchModal: (sketch: SketchItem) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  sketches,
  onRefreshSketches,
  onOpenSketchModal
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'isometric' | 'architecture' | 'freeform'>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [journalNotes, setJournalNotes] = useState(progress.journalNotes || []);

  const filteredSketches = sketches.filter(s => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const handleAddJournalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: 'note-' + Date.now(),
      date: 'Today',
      text: newNoteText.trim()
    };

    const updated = [newNote, ...journalNotes];
    setJournalNotes(updated);
    setNewNoteText('');

    progress.journalNotes = updated;
    saveStoredProgress(progress);
  };

  const handleDeleteSketch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this sketch study from your vault?')) {
      deleteStoredSketch(id);
      onRefreshSketches();
    }
  };

  const badges = [
    { title: 'The First Cube', desc: 'Constructed initial 30° isometric volume', unlocked: true },
    { title: 'Vanishing Point Intuition', desc: 'Mastered 2-point perspective without distortion', unlocked: true },
    { title: 'Studio Streak (4 Days)', desc: 'Consistent daily deliberate practice', unlocked: progress.streakDays >= 4 },
    { title: 'Shadow Master', desc: 'Calculated 45° solar ground projection', unlocked: progress.skills.shadowConstruction >= 60 },
    { title: 'Vault Collector', desc: 'Stored 5+ architectural studies', unlocked: sketches.length >= 5 },
  ];

  return (
    <div className="space-y-12 py-6 sm:py-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a] mb-1">
          <Award className="w-4 h-4" />
          <span>PROGRESS & SKETCHBOOK VAULT</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Drawing Mastery & Sketchbook
        </h1>
        <p className="text-sm text-[#9ea4b0] mt-1 max-w-2xl">
          Track your deliberate practice hours, review past studies, reflect in your sketchbook journal, and measure spatial intuition growth.
        </p>
      </div>

      {/* Metrics Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-red-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-red-400">
            <span className="font-semibold text-red-400">PRACTICE STREAK</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {progress.streakDays} <span className="text-sm font-normal text-red-400/80">Days</span>
          </div>
          <div className="text-xs text-red-500 font-semibold leading-snug flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1 animate-pulse" />
            <span>“{getDailyStreakQuote()}”</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8e95a5]">
            <span>TIME DRAWN</span>
            <Clock className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {progress.totalMinutesDrawn} <span className="text-sm font-normal text-[#8e95a5]">Mins</span>
          </div>
          <div className="text-[11px] text-[#9ea4b0]">
            {(progress.totalMinutesDrawn / 60).toFixed(1)} hours of deliberate practice.
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8e95a5]">
            <span>VAULT STUDIES</span>
            <Layers className="w-4 h-4 text-[#f5f0ea]" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {sketches.length} <span className="text-sm font-normal text-[#8e95a5]">Sketches</span>
          </div>
          <div className="text-[11px] text-[#9ea4b0]">
            Axonometric and perspective studies saved.
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8e95a5]">
            <span>STUDIO BADGES</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {badges.filter(b => b.unlocked).length} / {badges.length}
          </div>
          <div className="text-[11px] text-[#9ea4b0]">
            Milestone achievements unlocked.
          </div>
        </div>
      </section>

      {/* Skill Mastery Gauges */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#38bdf8]">
              SPATIAL CAPABILITY RADAR
            </span>
            <h3 className="font-display text-xl font-bold text-white">
              Skill Proficiency Metrics
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Line Confidence & Speed', value: progress.skills.lineConfidence, desc: 'Pivoting from shoulder, smooth single strokes' },
            { name: '30° Isometric Precision', value: progress.skills.isometricAngles, desc: 'True parallel axonometric axis discipline' },
            { name: 'Perspective & Vanishing Points', value: progress.skills.perspectiveIntuition, desc: 'Horizon anchoring and diagonal foreshortening' },
            { name: 'Cast Shadows (45° Sun)', value: progress.skills.shadowConstruction, desc: 'Parallel ground rays and ambient occlusion' },
            { name: 'Architectural Materiality', value: progress.skills.materialRendering, desc: 'Concrete formwork, glass glare, timber battens' },
          ].map((skill, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white">{skill.name}</span>
                <span className="font-mono text-[#38bdf8]">{skill.value}%</span>
              </div>
              <div className="w-full bg-[#1e2029] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#e24a4a] to-[#38bdf8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
              <p className="text-[11px] text-[#787f8e] leading-snug">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sketchbook Gallery */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#e24a4a]">
              PORTFOLIO ARCHIVE
            </span>
            <h3 className="font-display text-2xl font-bold text-white">
              Sketchbook Studies ({filteredSketches.length})
            </h3>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121319] rounded-xl border border-white/10 overflow-x-auto">
            {(['all', 'isometric', 'architecture', 'freeform'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#f5f0ea] text-[#0d0e11] font-semibold'
                    : 'text-[#8e95a5] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredSketches.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 space-y-2">
            <p className="text-sm text-[#9ea4b0]">No sketches saved in this category yet.</p>
            <p className="text-xs text-[#787f8e]">Jump into the Isometric Workbench or Drawing Studio to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSketches.map((sketch) => (
              <div
                key={sketch.id}
                onClick={() => onOpenSketchModal(sketch)}
                className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[#14151b] overflow-hidden">
                  <img
                    src={sketch.dataUrl}
                    alt={sketch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDeleteSketch(sketch.id, e)}
                      className="p-1.5 rounded-lg bg-black/70 text-[#e24a4a] hover:bg-black/90 transition-colors"
                      title="Delete sketch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1.5 rounded-lg bg-black/70 text-white/80">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8e95a5]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sketch.date}
                    </span>
                    <span className="uppercase text-[#38bdf8] font-semibold">{sketch.category}</span>
                  </div>

                  <h4 className="font-display text-base font-bold text-white group-hover:text-[#f5f0ea]">
                    {sketch.title}
                  </h4>

                  {sketch.notes && (
                    <p className="text-xs text-[#9ea4b0] line-clamp-2 leading-relaxed">
                      {sketch.notes}
                    </p>
                  )}

                  {sketch.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {sketch.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-[#787f8e]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sketchbook Journal Notes & Reflection */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SKETCHBOOK REFLECTION JOURNAL</span>
        </div>

        <h3 className="font-display text-xl font-bold text-white">
          Architectural Log & Practice Insights
        </h3>

        <form onSubmit={handleAddJournalNote} className="flex gap-2">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Record an architectural insight (e.g. 'Keep line weight light until final profile pass')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-[#787f8e] focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#f5f0ea] hover:bg-white text-[#0d0e11] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </form>

        <div className="space-y-3">
          {journalNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-mono text-[#e24a4a] block mb-1">
                  LOGGED · {note.date}
                </span>
                <p className="text-xs text-[#edebe6] leading-relaxed">
                  {note.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Badges */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DELIBERATE PRACTICE MILESTONES</span>
        </div>
        <h3 className="font-display text-xl font-bold text-white">
          Earned Studio Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                b.unlocked
                  ? 'bg-white/[0.04] border-white/15'
                  : 'bg-black/30 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display text-sm font-bold text-white">
                  {b.title}
                </span>
                {b.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-[#787f8e]">LOCKED</span>
                )}
              </div>
              <p className="text-xs text-[#8e95a5]">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

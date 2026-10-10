/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage, UserProgress, SketchItem } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { IsometricPage } from './pages/IsometricPage';
import { ArchitecturalLessonsPage } from './pages/ArchitecturalLessonsPage';
import { StudioPage } from './pages/StudioPage';
import { ProgressPage } from './pages/ProgressPage';
import { DailyWarmupModal } from './components/DailyWarmupModal';
import { SketchModal } from './components/SketchModal';
import { getStoredProgress, getStoredSketches, deleteStoredSketch } from './utils/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress);
  const [sketches, setSketches] = useState<SketchItem[]>(getStoredSketches);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [selectedSketch, setSelectedSketch] = useState<SketchItem | null>(null);

  // States passed between pages for seamless practice jumping
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [activeIsometricId, setActiveIsometricId] = useState<string>('iso-cube-1');
  const [studioSetup, setStudioSetup] = useState<{
    grid: 'one-point' | 'two-point' | 'isometric' | 'none';
    prompt: string;
  }>({
    grid: 'none',
    prompt: '',
  });

  const reloadSketches = () => {
    setSketches(getStoredSketches());
    setProgress(getStoredProgress());
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentPage('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIsometric = (exerciseId: string) => {
    setActiveIsometricId(exerciseId);
    setCurrentPage('isometrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchCanvasWithSetup = (
    grid: 'one-point' | 'two-point' | 'isometric' | 'none',
    prompt: string
  ) => {
    setStudioSetup({ grid, prompt });
    setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDrawingFromWarmup = (promptText: string) => {
    setStudioSetup({ grid: 'none', prompt: promptText });
    setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSketchFromModal = (id: string) => {
    deleteStoredSketch(id);
    reloadSketches();
  };

  return (
    <div className="relative min-h-screen text-[#edebe6] flex flex-col font-sans selection:bg-[#e24a4a]/25 selection:text-white">
      {/* Cinematic Professional Studio Background with Realistic Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Realistic studio canvas photo backdrop */}
        <img
          src="/src/assets/images/studio_canvas_backdrop_1791048428928.jpg"
          alt="Professional Drawing Studio Canvas"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* Studio Dark Overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d11]/88 via-[#0c0d11]/82 to-[#0c0d11]/94" />

        {/* Ambient Warm Sunbeam & Alice Blue Highlight Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#dfd5c6]/12 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#38bdf8]/10 via-[#e24a4a]/8 to-transparent blur-3xl" />

        {/* Twinkling Studio Dust Motems */}
        <div className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-white/40 twinkle-star" style={{ animationDelay: '0.4s' }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#f5f0ea]/50 twinkle-star" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-[#38bdf8]/40 twinkle-star" style={{ animationDelay: '2.1s' }} />
        <div className="absolute top-2/3 right-1/6 w-1 h-1 rounded-full bg-[#e24a4a]/40 twinkle-star" style={{ animationDelay: '1.7s' }} />
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => {
          setCurrentPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWarmup={() => setWarmupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectLesson={handleSelectLesson}
            onSelectIsometricExercise={handleSelectIsometric}
            onOpenWarmup={() => setWarmupOpen(true)}
            progress={progress}
            sketches={sketches}
            onOpenSketchModal={(s) => setSelectedSketch(s)}
          />
        )}

        {currentPage === 'isometrics' && (
          <IsometricPage
            selectedExerciseId={activeIsometricId}
            onSavedToSketchbook={reloadSketches}
          />
        )}

        {currentPage === 'lessons' && (
          <ArchitecturalLessonsPage
            initialLessonId={activeLessonId}
            onLaunchCanvasWithSetup={handleLaunchCanvasWithSetup}
          />
        )}

        {currentPage === 'studio' && (
          <StudioPage
            initialGrid={studioSetup.grid}
            initialPrompt={studioSetup.prompt}
            onSavedToSketchbook={reloadSketches}
          />
        )}

        {currentPage === 'progress' && (
          <ProgressPage
            progress={progress}
            sketches={sketches}
            onRefreshSketches={reloadSketches}
            onOpenSketchModal={(s) => setSelectedSketch(s)}
          />
        )}
      </main>

      {/* Studio Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0c0d11]/85 backdrop-blur-md py-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8e95a5]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-white">PIXELBEN</span>
            <span>·</span>
            <span className="text-[#edebe6]/70 italic">“Every bad drawing brings you closer to a great one.”</span>
          </div>

          <div className="flex items-center gap-4 text-[#9ea4b0]">
            <button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">
              Studio
            </button>
            <button onClick={() => setCurrentPage('isometrics')} className="hover:text-white transition-colors">
              Isometrics
            </button>
            <button onClick={() => setCurrentPage('lessons')} className="hover:text-white transition-colors">
              Architecture
            </button>
            <button onClick={() => setCurrentPage('progress')} className="hover:text-white transition-colors">
              Vault ({sketches.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Daily Warm-up Modal */}
      <DailyWarmupModal
        isOpen={warmupOpen}
        onClose={() => setWarmupOpen(false)}
        onStartDrawing={handleStartDrawingFromWarmup}
      />

      {/* Sketchbook Study Detail Modal */}
      <SketchModal
        sketch={selectedSketch}
        onClose={() => setSelectedSketch(null)}
        onDelete={handleDeleteSketchFromModal}
      />
    </div>
  );
}

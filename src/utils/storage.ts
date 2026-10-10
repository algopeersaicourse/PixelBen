import { SketchItem, UserProgress } from '../types';
import {
  isometricArchitectureArt,
  drawingLessonPerspective,
  isometricGamingStation
} from '../assets/images';

const PROGRESS_KEY = 'pixelben_user_progress';
const SKETCHES_KEY = 'pixelben_sketches';

const initialSketches: SketchItem[] = [
  {
    id: 'sample-iso-1',
    title: 'Pavilion Axonometric Study',
    category: 'isometric',
    date: '2026-10-02',
    dataUrl: isometricArchitectureArt,
    notes: 'Practicing 30-degree cantilever projection. Focused on keeping floor plate thickness uniform across all corners.',
    timeSpentMinutes: 35,
    tags: ['Isometric', 'Cantilever', 'Concrete']
  },
  {
    id: 'sample-arch-1',
    title: 'Two-Point Perspective Colonnade',
    category: 'architecture',
    date: '2026-10-01',
    dataUrl: drawingLessonPerspective,
    notes: 'Established left and right vanishing points off the canvas edge to avoid unnatural fish-eye distortion.',
    timeSpentMinutes: 45,
    tags: ['Perspective', 'Vanishing Point', 'Proportions']
  },
  {
    id: 'sample-iso-2',
    title: 'Studio Synthesizer Station',
    category: 'isometric',
    date: '2026-09-29',
    dataUrl: isometricGamingStation,
    notes: 'Isometric drawing of acoustic monitors, drawing screen, and synth keyboard. Good line weight hierarchy.',
    timeSpentMinutes: 50,
    tags: ['Isometric', 'Studio', 'Hardware']
  }
];

const defaultProgress: UserProgress = {
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalMinutesDrawn: 195,
  completedLessonIds: ['lesson-1', 'lesson-2'],
  completedExerciseIds: ['iso-cube-1', 'iso-cantilever-2'],
  sketchesCount: 3,
  skills: {
    lineConfidence: 74,
    isometricAngles: 82,
    perspectiveIntuition: 68,
    shadowConstruction: 60,
    materialRendering: 55
  },
  journalNotes: [
    {
      id: 'note-1',
      date: 'Yesterday',
      text: 'Remember: don’t draw from the wrist when laying down long perspective guidelines. Pivot smoothly from the shoulder.'
    },
    {
      id: 'note-2',
      date: '3 days ago',
      text: 'In 30° isometric, true vertical edges never tilt. All horizontal lines travel strictly along 30° and 150° rays.'
    }
  ]
};

export function getStoredProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(data) };
  } catch {
    return defaultProgress;
  }
}

export function saveStoredProgress(progress: UserProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // fallback
  }
}

export function getStoredSketches(): SketchItem[] {
  try {
    const data = localStorage.getItem(SKETCHES_KEY);
    if (!data) return initialSketches;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialSketches;
  } catch {
    return initialSketches;
  }
}

export function saveNewSketch(sketch: Omit<SketchItem, 'id' | 'date'>): SketchItem {
  const all = getStoredSketches();
  const newItem: SketchItem = {
    ...sketch,
    id: 'sketch-' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  const updated = [newItem, ...all];
  try {
    localStorage.setItem(SKETCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Update progress
  const progress = getStoredProgress();
  progress.totalMinutesDrawn += sketch.timeSpentMinutes || 15;
  progress.sketchesCount = updated.length;
  progress.skills.lineConfidence = Math.min(100, progress.skills.lineConfidence + 2);
  if (sketch.category === 'isometric') {
    progress.skills.isometricAngles = Math.min(100, progress.skills.isometricAngles + 3);
  } else if (sketch.category === 'architecture') {
    progress.skills.perspectiveIntuition = Math.min(100, progress.skills.perspectiveIntuition + 3);
  }
  saveStoredProgress(progress);

  return newItem;
}

export function deleteStoredSketch(id: string): SketchItem[] {
  const all = getStoredSketches().filter(s => s.id !== id);
  try {
    localStorage.setItem(SKETCHES_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return all;
}

export type NavPage = 'home' | 'isometrics' | 'lessons' | 'studio' | 'progress';

export interface SketchItem {
  id: string;
  title: string;
  category: 'isometric' | 'architecture' | 'freeform' | 'warmup';
  date: string;
  dataUrl: string;
  notes?: string;
  timeSpentMinutes: number;
  tags: string[];
}

export interface ArchitecturalLesson {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  heroImage: string;
  keyPrinciples: string[];
  steps: {
    stepNumber: number;
    title: string;
    instructions: string;
    proTip: string;
    diagramSvg?: string;
  }[];
  canvasSetup?: {
    gridType: 'one-point' | 'two-point' | 'isometric' | 'none';
    prompt: string;
  };
}

export interface IsometricExercise {
  id: string;
  title: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Mastery';
  timeEstimate: string;
  description: string;
  instructions: string[];
  ghostGuideSvg: string;
  referenceArtwork?: string;
}

export interface UserProgress {
  streakDays: number;
  lastActiveDate: string;
  totalMinutesDrawn: number;
  completedLessonIds: string[];
  completedExerciseIds: string[];
  sketchesCount: number;
  skills: {
    lineConfidence: number;
    isometricAngles: number;
    perspectiveIntuition: number;
    shadowConstruction: number;
    materialRendering: number;
  };
  journalNotes: {
    id: string;
    date: string;
    text: string;
  }[];
}

import React, { useState, useEffect } from 'react';
import { Clock, Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyWarmupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrawing: (promptText: string) => void;
}

const warmUpPrompts = [
  "Draw 3 overlapping isometric cubes with 45° cast shadows falling to the right.",
  "Construct a modernist cantilevered balcony with 2 scale human silhouettes.",
  "Sketch a studio acoustic speaker on a wooden stand with accurate 30° lines.",
  "Draw an L-shaped corridor with a 1-point vanishing point in the bottom left third.",
  "Draw 10 straight continuous lines across your canvas without lifting the pen or bending your wrist.",
  "Construct an isometric staircase with 6 steps and an open glass balustrade.",
  "Draft an audio mixing console with 8 channel faders and 3 master volume knobs in isometric view."
];

export const DailyWarmupModal: React.FC<DailyWarmupModalProps> = ({
  isOpen,
  onClose,
  onStartDrawing
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isRunning && secondsRemaining > 0) {
      timer = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch {
              // ignore
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const shufflePrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % warmUpPrompts.length);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(300);
    setIsCompleted(false);
  };

  const handleLaunchCanvas = () => {
    onStartDrawing(warmUpPrompts[currentPromptIndex]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8e95a5] hover:text-white text-sm p-1.5 rounded-lg hover:bg-white/5"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#e24a4a]">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
            Daily Studio Warm-up
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-[#f5f0ea] mb-2">
          5-Minute Hand & Mind Activation
        </h3>
        <p className="text-sm text-[#9ea4b0] mb-6">
          “Every bad drawing brings you closer to a great one.” Loosen your shoulder and build muscle memory before deep architectural drafting.
        </p>

        {/* Prompt Card */}
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
          <div className="flex items-center justify-between text-xs text-[#a2a6b2] mb-2 font-mono">
            <span>TODAY’S PROMPT</span>
            <button
              onClick={shufflePrompt}
              className="flex items-center gap-1 text-[#38bdf8] hover:text-white transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Shuffle</span>
            </button>
          </div>
          <p className="text-base text-[#f5f0ea] font-medium leading-relaxed">
            {warmUpPrompts[currentPromptIndex]}
          </p>
        </div>

        {/* Timer display */}
        <div className="text-center py-4 bg-[#14151b] rounded-xl border border-white/10 mb-6">
          <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white tabular-nums">
            {timeFormatted}
          </span>
          <div className="text-xs text-[#787f8e] mt-1 font-mono">
            {isRunning ? 'CALIBRATING ARM & EYE' : isCompleted ? 'SESSION COMPLETE' : 'TIMER READY'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isRunning && !isCompleted ? (
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#e24a4a] hover:bg-[#c93232] text-white font-medium text-sm transition-colors shadow-[0_0_20px_rgba(226,74,74,0.3)]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 5-Min Timer</span>
            </button>
          ) : isRunning ? (
            <button
              onClick={() => setIsRunning(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors"
            >
              Pause Timer
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Great practice! Hand is warm.</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-xl border border-white/10 bg-white/5 text-[#9ea4b0] hover:text-white hover:border-white/20 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchCanvas}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#f5f0ea] hover:bg-white text-[#0d0e11] font-semibold text-sm transition-colors"
          >
            <span>Open in Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

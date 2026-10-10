import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  Pencil,
  Highlighter,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  BookmarkPlus,
  Grid,
  CheckCircle2,
  Eye,
  Sliders,
  SplitSquareVertical,
  Minus
} from 'lucide-react';
import { saveNewSketch } from '../utils/storage';
import confetti from 'canvas-confetti';
import {
  isometricArchitectureArt,
  drawingLessonPerspective,
  isometricGamingStation
} from '../assets/images';

interface FreeformCanvasProps {
  initialGrid?: 'one-point' | 'two-point' | 'isometric' | 'none';
  initialPrompt?: string;
  onSavedToSketchbook?: () => void;
}

type BrushMode = 'micron' | 'pencil' | 'chisel' | 'highlighter' | 'eraser';

export const FreeformCanvas: React.FC<FreeformCanvasProps> = ({
  initialGrid = 'none',
  initialPrompt,
  onSavedToSketchbook
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushMode, setBrushMode] = useState<BrushMode>('micron');
  const [color, setColor] = useState('#f5f0ea');
  const [brushSize, setBrushSize] = useState(2);
  const [gridOverlay, setGridOverlay] = useState<'none' | 'one-point' | 'two-point' | 'isometric' | 'thirds'>(initialGrid);
  const [symmetryMode, setSymmetryMode] = useState(false);
  const [rulerStraightLine, setRulerStraightLine] = useState(false);
  const [referenceUnderlay, setReferenceUnderlay] = useState<string | null>(null);
  const [underlayOpacity, setUnderlayOpacity] = useState(0.25);
  const [isSaved, setIsSaved] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [straightStartPoint, setStraightStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const colors = [
    { name: 'Architectural Ivory', hex: '#f5f0ea' },
    { name: 'Studio Black', hex: '#0f1013' },
    { name: 'Drafting Red', hex: '#e24a4a' },
    { name: 'Blueprint Alice Blue', hex: '#38bdf8' },
    { name: 'Graphite Silver', hex: '#9ea4b0' },
    { name: 'Raw Ochre', hex: '#d97706' },
    { name: 'Sage Concrete', hex: '#84cc16' }
  ];

  const referencePresets = [
    { name: 'Modernist Pavilion', path: isometricArchitectureArt },
    { name: 'Colonnade Perspective', path: drawingLessonPerspective },
    { name: 'Studio Workstation', path: isometricGamingStation }
  ];

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imgData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 960;
    canvas.height = 580;

    // Fill drawing surface
    ctx.fillStyle = '#14151b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const initial = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initial]);
    setHistoryIndex(0);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const applyBrushStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (brushMode) {
      case 'micron':
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = 1.0;
        break;
      case 'pencil':
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize * 1.5;
        ctx.globalAlpha = 0.45;
        break;
      case 'chisel':
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize * 3;
        ctx.lineCap = 'square';
        ctx.globalAlpha = 0.65;
        break;
      case 'highlighter':
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = brushSize * 5;
        ctx.lineCap = 'square';
        ctx.globalAlpha = 0.25;
        break;
      case 'eraser':
        ctx.strokeStyle = '#14151b';
        ctx.lineWidth = brushSize * 6;
        ctx.globalAlpha = 1.0;
        break;
    }
  };

  const drawSegment = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    ctx.save();
    applyBrushStyle(ctx);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Symmetry mode (mirror along vertical center axis)
    if (symmetryMode) {
      const centerX = 960 / 2;
      const mirroredFromX = centerX - (from.x - centerX);
      const mirroredToX = centerX - (to.x - centerX);

      ctx.beginPath();
      ctx.moveTo(mirroredFromX, from.y);
      ctx.lineTo(mirroredToX, to.y);
      ctx.stroke();
    }

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setLastPoint(coords);
    setStraightStartPoint(coords);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rulerStraightLine) {
      drawSegment(ctx, lastPoint, coords);
      setLastPoint(coords);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (rulerStraightLine && straightStartPoint) {
      drawSegment(ctx, straightStartPoint, coords);
    }

    setIsDrawing(false);
    setLastPoint(null);
    setStraightStartPoint(null);
    pushHistory();
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#14151b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixelben-sketch-${Date.now()}.png`;
    a.click();
  };

  const handleSaveVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');

    saveNewSketch({
      title: initialPrompt ? 'Curriculum Practice Study' : 'Studio Freeform Sketch',
      category: gridOverlay === 'isometric' ? 'isometric' : 'architecture',
      dataUrl: url,
      notes: initialPrompt || 'Freehand architectural drafting study created in PixelBen Studio.',
      timeSpentMinutes: 20,
      tags: ['Architecture', 'Studio', gridOverlay]
    });

    setIsSaved(true);
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    if (onSavedToSketchbook) onSavedToSketchbook();
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Studio Banner / Active Prompt */}
      {initialPrompt && (
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e24a4a] animate-pulse" />
            <span className="font-mono text-[#e24a4a] uppercase">ACTIVE LESSON PROMPT:</span>
            <span className="text-[#f5f0ea] font-medium">{initialPrompt}</span>
          </div>
          <span className="text-[#787f8e] font-mono hidden md:inline">GUIDES PRE-CONFIGURED</span>
        </div>
      )}

      {/* Main Tool Palette */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-white/15">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
          {/* Brushes */}
          <div className="flex items-center gap-1 bg-[#121319] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setBrushMode('micron')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
                brushMode === 'micron' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Micron Drafting Pen (Crisp 0.3mm)"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Micron</span>
            </button>
            <button
              onClick={() => setBrushMode('pencil')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
                brushMode === 'pencil' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Graphite 2B Pencil"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Pencil</span>
            </button>
            <button
              onClick={() => setBrushMode('chisel')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
                brushMode === 'chisel' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Chisel Architectural Marker"
            >
              <Minus className="w-3.5 h-3.5 rotate-45" />
              <span className="hidden sm:inline font-mono">Chisel</span>
            </button>
            <button
              onClick={() => setBrushMode('highlighter')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs ${
                brushMode === 'highlighter' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Blueprint Alice Blue Highlighter"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">Tint</span>
            </button>
            <button
              onClick={() => setBrushMode('eraser')}
              className={`p-2 rounded-lg transition-colors ${
                brushMode === 'eraser' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grids and Guides */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#121319] p-1 rounded-xl border border-white/10 text-xs font-mono">
              <Grid className="w-3.5 h-3.5 text-[#9ea4b0] ml-1.5" />
              {(['none', 'one-point', 'two-point', 'isometric', 'thirds'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGridOverlay(g)}
                  className={`px-2 py-1 rounded-lg uppercase text-[10px] transition-colors ${
                    gridOverlay === g ? 'bg-white/20 text-white font-bold' : 'text-[#787f8e] hover:text-white'
                  }`}
                >
                  {g === 'one-point' ? '1-PT' : g === 'two-point' ? '2-PT' : g === 'isometric' ? 'ISO' : g === 'thirds' ? '3RDS' : 'PLAIN'}
                </button>
              ))}
            </div>

            {/* Symmetry & Ruler */}
            <button
              onClick={() => setSymmetryMode(!symmetryMode)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                symmetryMode
                  ? 'bg-[#38bdf8]/20 border-[#38bdf8]/50 text-[#38bdf8]'
                  : 'bg-[#121319] border-white/10 text-[#787f8e] hover:text-white'
              }`}
              title="Vertical Symmetry Mirror"
            >
              <SplitSquareVertical className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRulerStraightLine(!rulerStraightLine)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                rulerStraightLine
                  ? 'bg-[#e24a4a]/20 border-[#e24a4a]/50 text-white'
                  : 'bg-[#121319] border-white/10 text-[#787f8e] hover:text-white'
              }`}
              title="Ruler: Click & Drag Straight Line"
            >
              RULER {rulerStraightLine ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Colors & Width */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    color === c.hex
                      ? 'scale-110 border-white ring-2 ring-white/30'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#121319] p-1 rounded-xl border border-white/10 text-xs font-mono">
              {[1, 2, 4, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setBrushSize(w)}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    brushSize === w ? 'bg-white/20 text-white font-bold' : 'text-[#787f8e] hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            {/* Undo / Redo / Clear */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg text-[#9ea4b0] hover:text-white disabled:opacity-30"
                title="Undo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg text-[#9ea4b0] hover:text-white disabled:opacity-30"
                title="Redo"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-lg text-[#9ea4b0] hover:text-[#e24a4a]"
                title="Clear Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reference Image Underlay Selector */}
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 mb-2 bg-white/[0.02] rounded-lg text-xs font-mono text-[#9ea4b0]">
          <div className="flex items-center gap-2">
            <span className="text-[#38bdf8]">REFERENCE UNDERLAY:</span>
            {referencePresets.map((ref) => (
              <button
                key={ref.name}
                onClick={() => setReferenceUnderlay(referenceUnderlay === ref.path ? null : ref.path)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  referenceUnderlay === ref.path
                    ? 'bg-[#38bdf8]/20 border-[#38bdf8]/50 text-white'
                    : 'border-white/10 text-[#787f8e] hover:text-white'
                }`}
              >
                {ref.name}
              </button>
            ))}
          </div>

          {referenceUnderlay && (
            <div className="flex items-center gap-2">
              <span>OPACITY: {Math.round(underlayOpacity * 100)}%</span>
              <input
                type="range"
                min="0.05"
                max="0.7"
                step="0.05"
                value={underlayOpacity}
                onChange={(e) => setUnderlayOpacity(parseFloat(e.target.value))}
                className="w-20 accent-[#38bdf8] h-1 bg-[#252833] rounded"
              />
            </div>
          )}
        </div>

        {/* Canvas Display Viewport */}
        <div className="relative w-full rounded-xl overflow-hidden border border-white/15 bg-[#14151b] shadow-inner select-none cursor-crosshair">
          {/* Reference Image Underlay */}
          {referenceUnderlay && (
            <img
              src={referenceUnderlay}
              alt="Reference Underlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ opacity: underlayOpacity }}
            />
          )}

          {/* Perspective & Grid Overlays (SVG) */}
          {gridOverlay === 'one-point' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 960 580">
              {/* Horizon Line */}
              <line x1="0" y1="290" x2="960" y2="290" stroke="#e24a4a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6" />
              <circle cx="480" cy="290" r="4" fill="#e24a4a" />
              <text x="490" y="285" fill="#e24a4a" fontSize="11" fontFamily="JetBrains Mono">VP</text>
              {/* Converging Rays */}
              {[
                { x: 0, y: 0 }, { x: 240, y: 0 }, { x: 720, y: 0 }, { x: 960, y: 0 },
                { x: 0, y: 580 }, { x: 240, y: 580 }, { x: 720, y: 580 }, { x: 960, y: 580 },
                { x: 0, y: 145 }, { x: 0, y: 435 }, { x: 960, y: 145 }, { x: 960, y: 435 }
              ].map((pt, i) => (
                <line key={i} x1="480" y1="290" x2={pt.x} y2={pt.y} stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
              ))}
            </svg>
          )}

          {gridOverlay === 'two-point' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 960 580">
              {/* Horizon */}
              <line x1="0" y1="240" x2="960" y2="240" stroke="#e24a4a" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6" />
              {/* VP Left at x=40, VP Right at x=920 */}
              <circle cx="40" cy="240" r="4" fill="#e24a4a" />
              <circle cx="920" cy="240" r="4" fill="#e24a4a" />
              {/* Rays from Left */}
              {[100, 200, 300, 400, 500, 580].map((y, i) => (
                <line key={'l'+i} x1="40" y1="240" x2="960" y2={y} stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
              ))}
              {/* Rays from Right */}
              {[100, 200, 300, 400, 500, 580].map((y, i) => (
                <line key={'r'+i} x1="920" y1="240" x2="0" y2={y} stroke="rgba(245,240,234,0.12)" strokeWidth="1" />
              ))}
            </svg>
          )}

          {gridOverlay === 'isometric' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 960 580">
              <defs>
                <pattern id="freeform-iso" width="60" height="103.92" patternUnits="userSpaceOnUse">
                  <path d="M 0,0 L 60,34.64 L 60,103.92 L 0,69.28 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <path d="M 60,34.64 L 120,0 L 120,69.28 L 60,103.92 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="960" height="580" fill="url(#freeform-iso)" />
            </svg>
          )}

          {gridOverlay === 'thirds' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 960 580">
              <line x1="320" y1="0" x2="320" y2="580" stroke="rgba(226,74,74,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="640" y1="0" x2="640" y2="580" stroke="rgba(226,74,74,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="193" x2="960" y2="193" stroke="rgba(226,74,74,0.3)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="386" x2="960" y2="386" stroke="rgba(226,74,74,0.3)" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
          )}

          {/* Vertical Symmetry Axis Line */}
          {symmetryMode && (
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#38bdf8]/40 border-r border-[#38bdf8]/40 border-dashed pointer-events-none z-10" />
          )}

          {/* User Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative z-20 w-full h-auto block touch-none"
          />
        </div>

        {/* Footer info & export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-3 border-t border-white/10 text-xs font-mono text-[#9ea4b0]">
          <div>
            BRUSH: {brushMode.toUpperCase()} · COLOR: {color} · GRID: {gridOverlay.toUpperCase()}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={handleSaveVault}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
                isSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#f5f0ea] hover:bg-white text-[#0d0e11] shadow-[0_0_15px_rgba(245,240,234,0.2)]'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5 text-[#e24a4a]" />}
              <span>{isSaved ? 'Study Saved!' : 'Save to Sketchbook'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

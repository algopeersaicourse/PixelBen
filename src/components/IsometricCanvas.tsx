import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pen,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  BookmarkPlus,
  Box,
  Cylinder,
  Triangle,
  Layers,
  Compass,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { IsometricExercise } from '../types';
import { saveNewSketch } from '../utils/storage';
import confetti from 'canvas-confetti';

interface IsometricCanvasProps {
  exercise?: IsometricExercise;
  onSavedToSketchbook?: () => void;
}

type DrawTool = 'pen' | 'eraser' | 'cube' | 'cylinder' | 'wedge' | 'stairs';

export const IsometricCanvas: React.FC<IsometricCanvasProps> = ({
  exercise,
  onSavedToSketchbook
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawTool>('pen');
  const [snapToIsometric, setSnapToIsometric] = useState(true);
  const [lineWidth, setLineWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState('#f5f0ea');
  const [showGrid, setShowGrid] = useState(true);
  const [gridType, setGridType] = useState<'dots' | 'lines'>('lines');
  const [showGhost, setShowGhost] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaved, setIsSaved] = useState(false);

  const colors = [
    { name: 'Paper White', hex: '#f5f0ea' },
    { name: 'Studio Black', hex: '#0f1013' },
    { name: 'Drafting Red', hex: '#e24a4a' },
    { name: 'Alice Blue', hex: '#38bdf8' },
    { name: 'Graphite Silver', hex: '#9ea4b0' },
    { name: 'Warm Ochre', hex: '#eab308' },
  ];

  // Helper to save current state to undo history
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

  // Redraw isometric grid background
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showGrid) return;

    ctx.save();
    const spacing = 30; // distance between isometric grid nodes
    const hSpacing = spacing * Math.cos(Math.PI / 6); // ~26px

    if (gridType === 'lines') {
      ctx.strokeStyle = 'rgba(215, 210, 200, 0.08)';
      ctx.lineWidth = 1;

      // Draw 30° lines (slanted up-right)
      for (let x = -height * 2; x < width + height * 2; x += spacing * 2) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x + height * Math.tan(Math.PI / 3), 0);
        ctx.stroke();
      }

      // Draw 150° lines (slanted up-left)
      for (let x = -height * 2; x < width + height * 2; x += spacing * 2) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x - height * Math.tan(Math.PI / 3), 0);
        ctx.stroke();
      }

      // Draw vertical lines (90°)
      for (let x = 0; x < width; x += hSpacing * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    } else {
      // Dot matrix
      ctx.fillStyle = 'rgba(245, 240, 234, 0.22)';
      for (let y = 0; y < height; y += spacing) {
        const row = Math.floor(y / spacing);
        const offsetX = (row % 2) * hSpacing;
        for (let x = offsetX; x < width; x += hSpacing * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }, [showGrid, gridType]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 900;
    canvas.height = 560;

    // Fill canvas paper background
    ctx.fillStyle = '#16171d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial state
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);

  // Snap angle to 30-degree isometric increments (30, 90, 150, 210, 270, 330)
  const snapToIsometricAngle = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const distance = Math.hypot(dx, dy);
    if (distance < 5) return { x: x1, y: y1 };

    let angle = Math.atan2(dy, dx); // radians -PI to PI
    // Target angles in radians
    const validAngles = [
      Math.PI / 6, // 30 deg (down right)
      Math.PI / 2, // 90 deg (straight down)
      (5 * Math.PI) / 6, // 150 deg (down left)
      -(5 * Math.PI) / 6, // 210 deg (up left)
      -Math.PI / 2, // 270 deg (straight up)
      -Math.PI / 6, // 330 deg (up right)
    ];

    // Find closest isometric ray
    let closestAngle = validAngles[0];
    let minDiff = Infinity;
    for (const target of validAngles) {
      let diff = Math.abs(angle - target);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = target;
      }
    }

    return {
      x: x0 + Math.cos(closestAngle) * distance,
      y: y0 + Math.sin(closestAngle) * distance,
    };
  };

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

  // Stamp functions for isometric primitives
  const stampIsometricCube = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size = 60) => {
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    const dx = size * cos30;
    const dy = size * sin30;

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top face
    ctx.fillStyle = 'rgba(245, 240, 234, 0.15)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + dx, cy - size - dy);
    ctx.lineTo(cx, cy - size - dy * 2);
    ctx.lineTo(cx - dx, cy - size - dy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.fillStyle = 'rgba(15, 16, 20, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.lineTo(cx + dx, cy - size - dy);
    ctx.lineTo(cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left face
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - dx, cy - dy);
    ctx.lineTo(cx - dx, cy - size - dy);
    ctx.lineTo(cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center vertical edge
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - size);
    ctx.stroke();

    ctx.restore();
  };

  const stampIsometricCylinder = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius = 45, height = 70) => {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = 'rgba(245, 240, 234, 0.12)';

    // Isometric ellipse ratio is approx 0.577 (sin 30 / cos 30)
    const ry = radius * 0.58;

    // Bottom ellipse half
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, ry, 0, 0, Math.PI);
    ctx.stroke();

    // Side edges
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx - radius, cy - height);
    ctx.moveTo(cx + radius, cy);
    ctx.lineTo(cx + radius, cy - height);
    ctx.stroke();

    // Top ellipse full
    ctx.beginPath();
    ctx.ellipse(cx, cy - height, radius, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  const stampIsometricWedge = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size = 60) => {
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    const dx = size * cos30;
    const dy = size * sin30;

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    // Base triangle & ramp
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.lineTo(cx - dx, cy - dy);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - size);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx - dx, cy - dy);
    ctx.stroke();

    ctx.restore();
  };

  const stampIsometricStairs = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    const stepH = 18;
    const stepL = 28;
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    const widthOffset = 50;

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    let curX = cx;
    let curY = cy;

    for (let i = 0; i < 4; i++) {
      // Riser (vertical)
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX, curY - stepH);
      ctx.stroke();

      // Tread (30 deg up-right)
      const nextX = curX + stepL * cos30;
      const nextY = curY - stepH - stepL * sin30;
      ctx.beginPath();
      ctx.moveTo(curX, curY - stepH);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Extrude step back along 150 deg (left)
      const wDx = widthOffset * cos30;
      const wDy = widthOffset * sin30;
      ctx.beginPath();
      ctx.moveTo(curX, curY - stepH);
      ctx.lineTo(curX - wDx, curY - stepH - wDy);
      ctx.lineTo(nextX - wDx, nextY - wDy);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      curX = nextX;
      curY = nextY;
    }

    ctx.restore();
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (['cube', 'cylinder', 'wedge', 'stairs'].includes(tool)) {
      if (tool === 'cube') stampIsometricCube(ctx, coords.x, coords.y);
      if (tool === 'cylinder') stampIsometricCylinder(ctx, coords.x, coords.y);
      if (tool === 'wedge') stampIsometricWedge(ctx, coords.x, coords.y);
      if (tool === 'stairs') stampIsometricStairs(ctx, coords.x, coords.y);
      pushHistory();
      return;
    }

    setIsDrawing(true);
    setStartPoint(coords);
    setLastPoint(coords);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    const rawCoords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (tool === 'eraser') {
      ctx.strokeStyle = '#16171d'; // background color
      ctx.lineWidth = lineWidth * 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(rawCoords.x, rawCoords.y);
      ctx.stroke();
      setLastPoint(rawCoords);
    } else {
      // Pen drawing
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let target = rawCoords;
      if (snapToIsometric && startPoint) {
        // If holding continuous line, snap from last point
        target = snapToIsometricAngle(lastPoint.x, lastPoint.y, rawCoords.x, rawCoords.y);
      }

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      setLastPoint(target);
    }
    ctx.restore();
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPoint(null);
      setLastPoint(null);
      pushHistory();
    }
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

    ctx.fillStyle = '#16171d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixelben-isometric-${Date.now()}.png`;
    a.click();
  };

  const handleSaveToVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');

    saveNewSketch({
      title: exercise ? exercise.title : 'Isometric Spatial Study',
      category: 'isometric',
      dataUrl: url,
      notes: exercise
        ? `Completed exercise: ${exercise.title}. Practiced 30-degree isometric coordinate planes.`
        : 'Freehand isometric practice with 30° snap tool.',
      timeSpentMinutes: 15,
      tags: ['Isometric', '30-Degree', 'Drafting']
    });

    setIsSaved(true);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    if (onSavedToSketchbook) onSavedToSketchbook();
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Exercise instruction header if active */}
      {exercise && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] mb-1">
              <span>ACTIVE EXERCISE</span>
              <span>·</span>
              <span>{exercise.difficulty}</span>
              <span>·</span>
              <span>{exercise.timeEstimate}</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {exercise.title}
            </h3>
            <p className="text-xs text-[#9ea4b0] mt-0.5 max-w-3xl">
              {exercise.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showGhost
                  ? 'bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-white/5 border-white/10 text-[#787f8e]'
              }`}
            >
              {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showGhost ? 'Guide Outline ON' : 'Guide Outline OFF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workbench & Controls */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-white/15">
        {/* Top Tool Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 bg-[#121319] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'pen' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Technical Drafting Pen"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${
                tool === 'eraser' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            {/* Primitive Stamps */}
            <button
              onClick={() => setTool('cube')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                tool === 'cube' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Stamp 30° Isometric Cube"
            >
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono">Cube</span>
            </button>

            <button
              onClick={() => setTool('cylinder')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                tool === 'cylinder' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Stamp Isometric Cylinder"
            >
              <Cylinder className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono">Cylinder</span>
            </button>

            <button
              onClick={() => setTool('wedge')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                tool === 'wedge' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Stamp Triangular Wedge"
            >
              <Triangle className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono">Wedge</span>
            </button>

            <button
              onClick={() => setTool('stairs')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                tool === 'stairs' ? 'bg-[#f5f0ea] text-[#0d0e11]' : 'text-[#9ea4b0] hover:text-white'
              }`}
              title="Stamp 4-tier Isometric Stairs"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono">Stairs</span>
            </button>
          </div>

          {/* 30° Snap toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSnapToIsometric(!snapToIsometric)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                snapToIsometric
                  ? 'bg-[#e24a4a]/20 border-[#e24a4a]/50 text-white font-medium shadow-[0_0_12px_rgba(226,74,74,0.2)]'
                  : 'bg-[#121319] border-white/10 text-[#787f8e] hover:text-white'
              }`}
              title="Lock lines to 30°, 90°, and 150° isometric rays"
            >
              <Compass className={`w-3.5 h-3.5 ${snapToIsometric ? 'text-[#e24a4a]' : ''}`} />
              <span>30° SNAP: {snapToIsometric ? 'LOCKED' : 'FREEHAND'}</span>
            </button>

            {/* Grid toggle */}
            <button
              onClick={() => {
                if (showGrid) {
                  if (gridType === 'lines') setGridType('dots');
                  else setShowGrid(false);
                } else {
                  setShowGrid(true);
                  setGridType('lines');
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#121319] text-xs font-mono text-[#9ea4b0] hover:text-white transition-colors"
            >
              GRID: {showGrid ? (gridType === 'lines' ? '30° LINES' : 'DOTS') : 'OFF'}
            </button>
          </div>

          {/* Colors and stroke width */}
          <div className="flex items-center gap-3">
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setStrokeColor(c.hex)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    strokeColor === c.hex
                      ? 'scale-110 border-white ring-2 ring-white/30'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Width */}
            <div className="flex items-center gap-1 bg-[#121319] p-1 rounded-xl border border-white/10 text-xs font-mono">
              {[1, 2, 4, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setLineWidth(w)}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    lineWidth === w ? 'bg-white/20 text-white font-bold' : 'text-[#787f8e] hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            {/* Actions: Undo, Redo, Clear */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg text-[#9ea4b0] hover:text-white disabled:opacity-30 disabled:hover:text-[#9ea4b0]"
                title="Undo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg text-[#9ea4b0] hover:text-white disabled:opacity-30 disabled:hover:text-[#9ea4b0]"
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

        {/* Canvas viewport container */}
        <div className="relative w-full rounded-xl overflow-hidden border border-white/15 bg-[#16171d] shadow-inner select-none cursor-crosshair">
          {/* Dynamic grid canvas overlay */}
          <canvas
            ref={(canvas) => {
              if (canvas) {
                canvas.width = 900;
                canvas.height = 560;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, 900, 560);
                  drawGrid(ctx, 900, 560);
                }
              }
            }}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Ghost outline guide for active exercise */}
          {exercise && showGhost && exercise.ghostGuideSvg && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 900 560"
              dangerouslySetInnerHTML={{ __html: exercise.ghostGuideSvg }}
            />
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

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-3 border-t border-white/10 text-xs font-mono text-[#9ea4b0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            <span>30° AXONOMETRIC SYSTEM ACTIVE</span>
            <span>·</span>
            <span>HOLD CLICK TO SKETCH IN CONSTRAINED 30° / 90° / 150°</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={handleSaveToVault}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
                isSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#f5f0ea] hover:bg-white text-[#0d0e11] shadow-[0_0_15px_rgba(245,240,234,0.2)]'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5 text-[#e24a4a]" />}
              <span>{isSaved ? 'Saved to Sketchbook!' : 'Save to Sketchbook'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

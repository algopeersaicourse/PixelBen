import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Eye, RefreshCw } from 'lucide-react';

export const PerspectiveVisualizer: React.FC = () => {
  const [horizonY, setHorizonY] = useState(180); // Y position of horizon
  const [vpSpread, setVpSpread] = useState(380); // Distance of VP Left & Right from center
  const [boxWidth, setBoxWidth] = useState(160);
  const [boxHeight, setBoxHeight] = useState(120);
  const [showRays, setShowRays] = useState(true);
  const [showShading, setShowShading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background paper tint
    ctx.fillStyle = '#14151b';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vanishing points
    const vpLeft = { x: centerX - vpSpread, y: horizonY };
    const vpRight = { x: centerX + vpSpread, y: horizonY };

    // Draw Horizon Line
    ctx.strokeStyle = '#e24a4a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Horizon label
    ctx.fillStyle = '#e24a4a';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('EYE LEVEL HORIZON LINE', 16, horizonY - 8);

    // Draw VP pin markers
    const drawVp = (x: number, y: number, label: string) => {
      ctx.fillStyle = '#e24a4a';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f5f0ea';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(label, x - 18, y + 16);
    };

    drawVp(vpLeft.x, vpLeft.y, 'VP-L');
    drawVp(vpRight.x, vpRight.y, 'VP-R');

    // Box leading front vertical edge
    const frontCornerX = centerX;
    const frontCornerTopY = horizonY + 30;
    const frontCornerBottomY = frontCornerTopY + boxHeight;

    // Calculate left wall rear corner
    const leftT = (boxWidth * 0.7) / vpSpread;
    const leftCornerX = frontCornerX - boxWidth * 0.7;
    const leftCornerTopY = frontCornerTopY + (vpLeft.y - frontCornerTopY) * leftT;
    const leftCornerBottomY = frontCornerBottomY + (vpLeft.y - frontCornerBottomY) * leftT;

    // Calculate right wall rear corner
    const rightT = (boxWidth * 0.9) / vpSpread;
    const rightCornerX = frontCornerX + boxWidth * 0.9;
    const rightCornerTopY = frontCornerTopY + (vpRight.y - frontCornerTopY) * rightT;
    const rightCornerBottomY = frontCornerBottomY + (vpRight.y - frontCornerBottomY) * rightT;

    // Calculate top rear corner (intersection of lines from left rear to VP-R and right rear to VP-L)
    // Simple 2-point perspective top polygon vertex approximation:
    const rearCornerX = frontCornerX + (rightCornerX - frontCornerX) - (frontCornerX - leftCornerX);
    const rearCornerY = leftCornerTopY + (rightCornerTopY - frontCornerTopY);

    // Draw Perspective Construction Rays (Subtle Alice Blue / Silver)
    if (showRays) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;

      // From VP-L to front corner & right corner
      [
        frontCornerTopY,
        frontCornerBottomY,
        rightCornerTopY,
        rightCornerBottomY
      ].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(vpLeft.x, vpLeft.y);
        ctx.lineTo(frontCornerX + 200, y);
        ctx.stroke();
      });

      // From VP-R to front corner & left corner
      [
        frontCornerTopY,
        frontCornerBottomY,
        leftCornerTopY,
        leftCornerBottomY
      ].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(vpRight.x, vpRight.y);
        ctx.lineTo(frontCornerX - 200, y);
        ctx.stroke();
      });
    }

    // Shading for faces
    if (showShading) {
      // Right face (darker tone)
      ctx.fillStyle = 'rgba(20, 24, 32, 0.85)';
      ctx.beginPath();
      ctx.moveTo(frontCornerX, frontCornerTopY);
      ctx.lineTo(rightCornerX, rightCornerTopY);
      ctx.lineTo(rightCornerX, rightCornerBottomY);
      ctx.lineTo(frontCornerX, frontCornerBottomY);
      ctx.closePath();
      ctx.fill();

      // Left face (light lit tone)
      ctx.fillStyle = 'rgba(235, 230, 220, 0.08)';
      ctx.beginPath();
      ctx.moveTo(frontCornerX, frontCornerTopY);
      ctx.lineTo(leftCornerX, leftCornerTopY);
      ctx.lineTo(leftCornerX, leftCornerBottomY);
      ctx.lineTo(frontCornerX, frontCornerBottomY);
      ctx.closePath();
      ctx.fill();

      // Top face (if below horizon)
      if (frontCornerTopY > horizonY) {
        ctx.fillStyle = 'rgba(245, 240, 234, 0.18)';
        ctx.beginPath();
        ctx.moveTo(frontCornerX, frontCornerTopY);
        ctx.lineTo(leftCornerX, leftCornerTopY);
        ctx.lineTo(rearCornerX, rearCornerY);
        ctx.lineTo(rightCornerX, rightCornerTopY);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Heavy Architectural Ink Lines
    ctx.strokeStyle = '#f5f0ea';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Front vertical corner (closest to camera)
    ctx.beginPath();
    ctx.moveTo(frontCornerX, frontCornerTopY);
    ctx.lineTo(frontCornerX, frontCornerBottomY);
    ctx.stroke();

    // Left vertical corner
    ctx.beginPath();
    ctx.moveTo(leftCornerX, leftCornerTopY);
    ctx.lineTo(leftCornerX, leftCornerBottomY);
    ctx.stroke();

    // Right vertical corner
    ctx.beginPath();
    ctx.moveTo(rightCornerX, rightCornerTopY);
    ctx.lineTo(rightCornerX, rightCornerBottomY);
    ctx.stroke();

    // Connecting planes
    ctx.beginPath();
    // Left bottom & top
    ctx.moveTo(frontCornerX, frontCornerBottomY);
    ctx.lineTo(leftCornerX, leftCornerBottomY);
    ctx.moveTo(frontCornerX, frontCornerTopY);
    ctx.lineTo(leftCornerX, leftCornerTopY);

    // Right bottom & top
    ctx.moveTo(frontCornerX, frontCornerBottomY);
    ctx.lineTo(rightCornerX, rightCornerBottomY);
    ctx.moveTo(frontCornerX, frontCornerTopY);
    ctx.lineTo(rightCornerX, rightCornerTopY);

    // Top face edges if visible
    if (frontCornerTopY > horizonY) {
      ctx.moveTo(leftCornerX, leftCornerTopY);
      ctx.lineTo(rearCornerX, rearCornerY);
      ctx.lineTo(rightCornerX, rightCornerTopY);
    }
    ctx.stroke();

    // Add architectural glass mullion details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    const midLeftX = (frontCornerX + leftCornerX) / 2;
    const midLeftTopY = (frontCornerTopY + leftCornerTopY) / 2;
    const midLeftBottomY = (frontCornerBottomY + leftCornerBottomY) / 2;
    ctx.beginPath();
    ctx.moveTo(midLeftX, midLeftTopY);
    ctx.lineTo(midLeftX, midLeftBottomY);
    ctx.stroke();

  }, [horizonY, vpSpread, boxWidth, boxHeight, showRays, showShading]);

  const handleReset = () => {
    setHorizonY(180);
    setVpSpread(380);
    setBoxWidth(160);
    setBoxHeight(120);
    setShowRays(true);
    setShowShading(true);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/15">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-mono mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>INTERACTIVE SPATIAL ENGINE</span>
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            Dynamic Two-Point Perspective Simulator
          </h3>
          <p className="text-xs text-[#9ea4b0]">
            Drag horizon height and vanishing point spread to observe real-time optical convergence and volume distortion.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-[#b8bcc8] hover:text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Angles</span>
        </button>
      </div>

      {/* Simulator canvas */}
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 mb-4 bg-[#14151b]">
        <canvas
          ref={canvasRef}
          width={840}
          height={380}
          className="w-full h-auto block select-none"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono text-[#a2a6b2]">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex justify-between">
            <span>HORIZON EYE LEVEL</span>
            <span className="text-white">{horizonY}px</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            value={horizonY}
            onChange={(e) => setHorizonY(Number(e.target.value))}
            className="w-full accent-[#e24a4a] h-1.5 bg-[#252833] rounded cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex justify-between">
            <span>VP SPREAD (WIDTH)</span>
            <span className="text-white">{vpSpread}px</span>
          </div>
          <input
            type="range"
            min="200"
            max="600"
            value={vpSpread}
            onChange={(e) => setVpSpread(Number(e.target.value))}
            className="w-full accent-[#38bdf8] h-1.5 bg-[#252833] rounded cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <div className="flex justify-between">
            <span>BUILDING HEIGHT</span>
            <span className="text-white">{boxHeight}px</span>
          </div>
          <input
            type="range"
            min="60"
            max="220"
            value={boxHeight}
            onChange={(e) => setBoxHeight(Number(e.target.value))}
            className="w-full accent-[#f5f0ea] h-1.5 bg-[#252833] rounded cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <span className="text-white font-medium">VISUAL AIDS</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRays(!showRays)}
              className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                showRays ? 'bg-[#38bdf8]/20 border-[#38bdf8]/50 text-[#38bdf8]' : 'bg-transparent border-white/10 text-[#787f8e]'
              }`}
            >
              Rays
            </button>
            <button
              onClick={() => setShowShading(!showShading)}
              className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                showShading ? 'bg-white/20 border-white/40 text-white' : 'bg-transparent border-white/10 text-[#787f8e]'
              }`}
            >
              Shading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

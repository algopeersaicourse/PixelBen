import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Disc3, Sparkles } from 'lucide-react';
import { studioAudio } from '../utils/audioEngine';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'rhodes' | 'tape-crackle' | 'ambient-pad'>('rhodes');
  const [volume, setVolume] = useState(0.25);
  const [isOpen, setIsOpen] = useState(false);
  const [vuLevel, setVuLevel] = useState(0);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateMeter = () => {
        // Random organic VU meter needle fluctuation
        const target = 0.35 + Math.random() * 0.45;
        setVuLevel(prev => prev * 0.7 + target * 0.3);
        animId = requestAnimationFrame(updateMeter);
      };
      animId = requestAnimationFrame(updateMeter);
    } else {
      setVuLevel(0);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const togglePlayback = () => {
    const active = studioAudio.toggle(mode);
    setIsPlaying(active);
  };

  const handleModeChange = (newMode: 'rhodes' | 'tape-crackle' | 'ambient-pad') => {
    setMode(newMode);
    studioAudio.setMode(newMode);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    studioAudio.setVolume(newVol);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayback}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-[#1e2029] border-[#e24a4a]/40 text-[#edebe6] shadow-[0_0_12px_rgba(226,74,74,0.2)]'
              : 'bg-[#181920]/80 border-white/10 text-[#a2a6b2] hover:text-[#edebe6] hover:border-white/20'
          }`}
          title="Toggle Studio Ambient Soundscape"
          aria-label="Studio Audio"
        >
          <div className="relative flex items-center justify-center">
            <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin text-[#e24a4a]' : 'text-[#8e95a5]'}`} />
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#e24a4a] animate-ping" />
            )}
          </div>
          <span className="hidden sm:inline font-mono text-[11px] tracking-tight">
            {isPlaying ? 'STUDIO SOUND ON' : 'STUDIO SOUND'}
          </span>

          {/* Mini VU meter bars */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3 w-5 ml-0.5">
              <span
                className="w-1 bg-[#38bdf8] rounded-t-sm transition-all duration-75"
                style={{ height: `${Math.min(100, Math.max(15, vuLevel * 100))}%` }}
              />
              <span
                className="w-1 bg-[#e24a4a] rounded-t-sm transition-all duration-75"
                style={{ height: `${Math.min(100, Math.max(10, vuLevel * 85))}%` }}
              />
              <span
                className="w-1 bg-[#f5f0ea] rounded-t-sm transition-all duration-75"
                style={{ height: `${Math.min(100, Math.max(20, vuLevel * 110))}%` }}
              />
            </div>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg border border-white/10 bg-[#181920]/60 text-[#a2a6b2] hover:text-[#edebe6] hover:border-white/20 transition-colors"
          title="Audio Soundscape Settings"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 glass-panel rounded-xl shadow-2xl z-50 border border-white/15">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e24a4a]" />
              <span className="font-display text-xs font-semibold tracking-wide text-white uppercase">
                Studio Sound Console
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8e95a5] hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#a2a6b2] block mb-1.5">
                Acoustic Mood
              </label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { id: 'rhodes', label: 'Warm Rhodes Chords', desc: 'Chill electric piano in F# major' },
                  { id: 'tape-crackle', label: 'Vintage Vinyl & Tape', desc: 'Warm analog saturation hiss' },
                  { id: 'ambient-pad', label: 'Dreamy Studio Pad', desc: 'Filtered analog synth drone' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleModeChange(item.id as any)}
                    className={`text-left p-2 rounded-lg border transition-all text-xs ${
                      mode === item.id
                        ? 'bg-white/10 border-white/25 text-white'
                        : 'border-transparent text-[#9da3b4] hover:bg-white/5'
                    }`}
                  >
                    <div className="font-medium text-[12px]">{item.label}</div>
                    <div className="text-[10px] text-[#787f8e]">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#a2a6b2] mb-1">
                <span>VOLUME</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVolumeChange(volume === 0 ? 0.25 : 0)}
                  className="text-[#8e95a5] hover:text-white"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#e24a4a] h-1.5 bg-[#252833] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { SketchItem } from '../types';
import { X, Download, Calendar, Tag, Trash2 } from 'lucide-react';

interface SketchModalProps {
  sketch: SketchItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const SketchModal: React.FC<SketchModalProps> = ({ sketch, onClose, onDelete }) => {
  if (!sketch) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = sketch.dataUrl;
    a.download = `${sketch.title.toLowerCase().replace(/\s+/g, '-')}-${sketch.id}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Stage */}
        <div className="md:w-3/5 bg-[#121319] flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <img
            src={sketch.dataUrl}
            alt={sketch.title}
            className="max-h-[60vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Metadata & Notes Deck */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#e24a4a]">
              <span className="uppercase">{sketch.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#8e95a5]">
                <Calendar className="w-3 h-3" />
                {sketch.date}
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white">
              {sketch.title}
            </h2>

            {sketch.notes && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-[#38bdf8]">
                  STUDY NOTES
                </span>
                <p className="text-xs sm:text-sm text-[#d4d8e2] leading-relaxed">
                  {sketch.notes}
                </p>
              </div>
            )}

            {sketch.tags && sketch.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-[#8e95a5]">
                  DISCIPLINE TAGS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sketch.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#d4d8e2]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f5f0ea] hover:bg-white text-[#0d0e11] font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Delete this study from your sketchbook vault?')) {
                    onDelete(sketch.id);
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono text-[#e24a4a] hover:bg-[#e24a4a]/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Vault</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

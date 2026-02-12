import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, SkipForward, Plus, Layers } from 'lucide-react';

export const Timeline: React.FC = () => {
  const {
    actors,
    keyframes,
    currentTime,
    duration,
    isPlaying,
    setPlaying,
    setTime,
    selectedId,
    setSelected,
    addKeyframe
  } = useStore();

  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll or handle zoom could be added here

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    setTime(percentage * duration);
  };

  const handlePlayToggle = () => setPlaying(!isPlaying);

  return (
    <div className="flex flex-col h-full bg-editor-panel text-editor-text select-none">
       {/* Timeline Toolbar */}
       <div className="h-10 border-b border-editor-border flex items-center justify-between px-4 bg-editor-bg">
          <div className="flex items-center gap-2">
             <button onClick={() => setTime(0)} className="p-1 hover:text-white text-editor-muted"><SkipBack size={16} /></button>
             <button onClick={handlePlayToggle} className="p-1 hover:text-white text-editor-accent">
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
             </button>
             <button onClick={() => setTime(duration)} className="p-1 hover:text-white text-editor-muted"><SkipForward size={16} /></button>
             <div className="w-px h-4 bg-editor-border mx-2" />
             <div className="font-mono text-xs text-editor-accent">
                {currentTime.toFixed(2)}s <span className="text-editor-muted">/ {duration}s</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button
                onClick={() => selectedId && addKeyframe(selectedId, 'position')}
                disabled={!selectedId}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-editor-panelHover hover:bg-editor-accent hover:text-black disabled:opacity-50 transition-colors"
             >
                <Plus size={12} /> Keyframe
             </button>
          </div>
       </div>

       {/* Tracks Area */}
       <div className="flex-1 flex overflow-hidden">
          {/* Track Headers (Left) */}
          <div className="w-60 border-r border-editor-border bg-editor-panel flex flex-col overflow-y-auto no-scrollbar">
              {actors.map(actor => (
                  <div
                    key={actor.id}
                    onClick={() => setSelected(actor.id)}
                    className={`h-8 px-4 flex items-center justify-between text-xs border-b border-editor-border cursor-pointer hover:bg-editor-panelHover transition-colors ${selectedId === actor.id ? 'bg-editor-panelHover text-editor-accent border-l-2 border-l-editor-accent' : 'text-editor-muted'}`}
                  >
                      <div className="flex items-center gap-2 overflow-hidden">
                          <Layers size={12} />
                          <span className="truncate">{actor.name}</span>
                      </div>
                  </div>
              ))}
          </div>

          {/* Timeline Tracks (Right) */}
          <div className="flex-1 relative overflow-hidden bg-editor-bg" ref={timelineRef} onMouseDown={handleTimelineClick}>
              {/* Grid / Ruler Background */}
              <div className="absolute inset-0 pointer-events-none opacity-20"
                   style={{ backgroundImage: 'linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: `${100 / duration}% 100%` }}
              />

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-editor-accent z-20 pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              >
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-editor-accent -ml-[4.5px]" />
              </div>

              {/* Tracks Content */}
              <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                  {actors.map(actor => {
                      const actorKeyframes = keyframes.filter(k => k.targetId === actor.id);
                      return (
                        <div key={actor.id} className="h-8 border-b border-editor-border/50 relative">
                            {actorKeyframes.map(kf => (
                                <div
                                    key={kf.id}
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-editor-accent border border-black transform hover:scale-150 transition-transform cursor-pointer"
                                    style={{ left: `${(kf.time / duration) * 100}%` }}
                                    title={`${kf.property}: ${JSON.stringify(kf.value)}`}
                                />
                            ))}
                        </div>
                      );
                  })}
              </div>
          </div>
       </div>
    </div>
  );
};

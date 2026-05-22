import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, SkipForward, Plus, Layers } from 'lucide-react';

export const Timeline: React.FC = () => {
  const actors = useStore(s => s.actors);
  const timelineData = useStore(s => s.timeline);
  const currentTime = useStore(s => s.currentTime);
  const isPlaying = useStore(s => s.isPlaying);
  const setPlaying = useStore(s => s.setPlaying);
  const setTime = useStore(s => s.setTime);
  const selectedId = useStore(s => s.selectedId);
  const setSelected = useStore(s => s.setSelected);
  const addKeyframe = useStore(s => s.addKeyframe);

  const duration = timelineData.duration;
  const tracks = timelineData.animationTracks;

  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    setTime(percentage * duration);
  };

  const handlePlayToggle = () => setPlaying(!isPlaying);

  const handleAddKeyframe = () => {
      if (!selectedId) return;
      const actor = actors.find(a => a.id === selectedId);
      if (!actor) return;

      // Default to adding position keyframe for now
      // Real implementation would open a menu or check which property is selected
      const value = actor.transform.position;
      addKeyframe(selectedId, 'transform.position', value);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] text-gray-200 select-none border-t border-gray-700">
       {/* Timeline Toolbar */}
       <div className="h-10 border-b border-gray-700 flex items-center justify-between px-4 bg-[#0f172a]">
          <div className="flex items-center gap-2">
             <button
               onClick={() => setTime(0)}
               aria-label="Go to start"
               title="Go to start"
               className="p-1 hover:text-white text-gray-400 rounded focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
             >
               <SkipBack size={16} />
             </button>
             <button
               onClick={handlePlayToggle}
               aria-label={isPlaying ? "Pause" : "Play"}
               title={isPlaying ? "Pause" : "Play"}
               aria-pressed={isPlaying}
               className="p-1 hover:text-white text-[#4ade80] rounded focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
             >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
             </button>
             <button
               onClick={() => setTime(duration)}
               aria-label="Go to end"
               title="Go to end"
               className="p-1 hover:text-white text-gray-400 rounded focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
             >
               <SkipForward size={16} />
             </button>
             <div className="w-px h-4 bg-gray-700 mx-2" />
             <div className="font-mono text-xs text-[#4ade80]">
                {currentTime.toFixed(2)}s <span className="text-gray-500">/ {duration}s</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button
                onClick={handleAddKeyframe}
                disabled={!selectedId}
                title={!selectedId ? "Select an actor to add a keyframe" : "Add keyframe"}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-[#4ade80] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
             >
                <Plus size={12} /> Keyframe
             </button>
          </div>
       </div>

       {/* Tracks Area */}
       <div className="flex-1 flex overflow-hidden">
          {/* Track Headers (Left) */}
          <div className="w-60 border-r border-gray-700 bg-[#1e293b] flex flex-col overflow-y-auto">
              {actors.map(actor => (
                  <div
                    key={actor.id}
                    onClick={() => setSelected(actor.id)}
                    className={`h-8 px-4 flex items-center justify-between text-xs border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${selectedId === actor.id ? 'bg-gray-700 text-[#4ade80] border-l-2 border-l-[#4ade80]' : 'text-gray-400'}`}
                  >
                      <div className="flex items-center gap-2 overflow-hidden">
                          <Layers size={12} />
                          <span className="truncate">{actor.name}</span>
                      </div>
                  </div>
              ))}
          </div>

          {/* Timeline Tracks (Right) */}
          <div className="flex-1 relative overflow-hidden bg-[#0f172a]" onClick={handleTimelineClick} ref={timelineRef}>
              {/* Grid / Ruler Background */}
              {/* Simplified grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20"
                   style={{ backgroundImage: 'linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '10% 100%' }}
              />

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#4ade80] z-20 pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              >
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#4ade80] -ml-[4.5px]" />
              </div>

              {/* Tracks Content */}
              <div className="absolute inset-0 overflow-y-auto">
                  {actors.map(actor => {
                      // Find all tracks for this actor
                      const actorTracks = tracks.filter(t => t.targetId === actor.id);
                      // Flatten keyframes from all tracks for visualization
                      const allKeyframes = actorTracks.flatMap(t => t.keyframes);

                      return (
                        <div key={actor.id} className="h-8 border-b border-gray-700 relative">
                            {allKeyframes.map((kf, i) => (
                                <div
                                    key={i} // Keyframes don't have IDs in new schema?
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#4ade80] border border-black transform hover:scale-150 transition-transform cursor-pointer"
                                    style={{ left: `${(kf.time / duration) * 100}%` }}
                                    title={`Value: ${JSON.stringify(kf.value)}`}
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

import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, Square, Key } from 'lucide-react';

export const Timeline: React.FC = () => {
    const actors = useStore((state) => state.actors);
    const keyframes = useStore((state) => state.keyframes);
    const currentTime = useStore((state) => state.currentTime);
    const setTime = useStore((state) => state.setTime);
    const isPlaying = useStore((state) => state.isPlaying);
    const setPlaying = useStore((state) => state.setPlaying);
    const duration = useStore((state) => state.duration);
    const selectedId = useStore((state) => state.selectedId);
    const setSelected = useStore((state) => state.setSelected);
    const addKeyframe = useStore((state) => state.addKeyframe);

    const timelineRef = useRef<HTMLDivElement>(null);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            setTime(percentage * duration);
        }
    };

    return (
        <div className="h-48 bg-slate-900 border-t border-brand-green/20 flex flex-col shrink-0 z-10 select-none">
             {/* Controls */}
             <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-4 bg-slate-950">
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPlaying(!isPlaying)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded text-brand-green transition-colors"
                    >
                      {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <button
                      onClick={() => { setPlaying(false); setTime(0); }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded text-red-500 transition-colors"
                    >
                      <Square size={14} fill="currentColor" />
                    </button>
                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    <button
                        onClick={() => {
                            if (selectedId) {
                                addKeyframe(selectedId, 'position');
                                addKeyframe(selectedId, 'rotation');
                                addKeyframe(selectedId, 'scale');
                            }
                        }}
                        disabled={!selectedId}
                        className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold transition-colors ${selectedId ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20' : 'text-slate-600 cursor-not-allowed'}`}
                    >
                        <Key size={14} />
                        KEY
                    </button>
                </div>

                <div className="flex-1 h-8 bg-slate-900 rounded relative cursor-pointer group border border-slate-800" onClick={handleTimelineClick} ref={timelineRef}>
                   {/* Ruler / Ticks */}
                   <div className="absolute inset-0 flex pointer-events-none">
                       {Array.from({ length: duration }).map((_, i) => (
                           <div key={i} className="flex-1 border-l border-slate-800 h-full relative first:border-l-0 opacity-50">
                               <span className="absolute top-1 left-1 text-[8px] text-slate-500">{i}s</span>
                           </div>
                       ))}
                   </div>

                   {/* Playhead */}
                   <div className="absolute top-0 bottom-0 w-px bg-brand-green pointer-events-none z-10" style={{ left: `${(currentTime / duration) * 100}%` }}>
                       <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-brand-green rounded-full shadow"></div>
                   </div>
                </div>

                <span className="text-xs font-mono text-brand-green w-16 text-right">
                    {currentTime.toFixed(2)}s
                </span>
             </div>

             {/* Tracks */}
             <div className="flex-1 overflow-auto bg-slate-900 flex">
                 {/* Sidebar (Actor Names) */}
                 <div className="w-48 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
                     {actors.map(actor => (
                         <div
                            key={actor.id}
                            onClick={() => setSelected(actor.id)}
                            className={`h-8 flex items-center px-4 text-xs cursor-pointer border-b border-slate-900 truncate ${selectedId === actor.id ? 'bg-brand-green/10 text-brand-green' : 'text-slate-400 hover:bg-slate-900'}`}
                         >
                             {actor.name}
                         </div>
                     ))}
                 </div>

                 {/* Keyframe Area */}
                 <div className="flex-1 relative min-w-0 overflow-hidden" onClick={handleTimelineClick}>
                     {actors.map(actor => {
                         const actorKeyframes = keyframes.filter(k => k.targetId === actor.id);
                         // Group keyframes by time to avoid stacking dots too much
                         const distinctTimes = Array.from(new Set(actorKeyframes.map(k => k.time)));

                         return (
                            <div key={actor.id} className="h-8 border-b border-slate-800 relative bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                                {distinctTimes.map(time => (
                                    <div
                                        key={time}
                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-green rotate-45 hover:scale-150 transition-transform cursor-pointer z-10"
                                        style={{ left: `${(time / duration) * 100}%` }}
                                        title={`Keyframe at ${time.toFixed(2)}s`}
                                    ></div>
                                ))}
                            </div>
                         );
                     })}

                     {/* Playhead Line extending down */}
                     <div className="absolute top-0 bottom-0 w-px bg-brand-green/20 pointer-events-none" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
                 </div>
             </div>
        </div>
    );
};

import React, { useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, Square, Key, Video, Box, User, Lightbulb, Zap, Music } from 'lucide-react';
import { interpolate } from '../engine/EasingFunctions';

// Helper to get icon for actor type
const getActorIcon = (type: string, shape?: string) => {
    switch (type) {
        case 'character': return <User size={12} />;
        case 'prop': return <Box size={12} />;
        case 'light': return <Lightbulb size={12} />;
        case 'vfx': return <Zap size={12} />;
        case 'sound': return <Music size={12} />;
        case 'camera': return <Video size={12} />;
        default: return <Box size={12} />;
    }
};

export const Timeline: React.FC = () => {
    const actors = useStore((state) => state.actors);
    const keyframes = useStore((state) => state.keyframes);
    const scenes = useStore((state) => state.scenes);
    const cameraCuts = useStore((state) => state.cameraCuts);
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

    // Camera Segments
    const cameraSegments = useMemo(() => {
        const sortedCuts = [...cameraCuts].sort((a, b) => a.time - b.time);
        if (sortedCuts.length === 0) return [];

        const segments = [];
        for (let i = 0; i < sortedCuts.length; i++) {
            const cut = sortedCuts[i];
            const nextCut = sortedCuts[i + 1];
            const endTime = nextCut ? nextCut.time : duration;

            // Find camera name
            const camActor = actors.find(a => a.id === cut.cameraId);
            const camName = camActor ? camActor.name : cut.cameraId;

            segments.push({
                startTime: cut.time,
                endTime: endTime,
                camName,
                isActive: currentTime >= cut.time && currentTime < endTime
            });
        }
        return segments;
    }, [cameraCuts, duration, actors, currentTime]);

    // Current Scene
    const currentScene = useMemo(() => {
        return scenes.find(s => currentTime >= s.startTime && currentTime < s.endTime);
    }, [scenes, currentTime]);

    return (
        <div className="h-64 bg-slate-900 border-t border-brand-green/20 flex flex-col shrink-0 z-10 select-none">
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

                {/* Scrubber / Ruler Area */}
                <div className="flex-1 h-8 bg-slate-900 rounded relative cursor-pointer group border border-slate-800" onClick={handleTimelineClick} ref={timelineRef}>
                   {/* Ruler / Ticks */}
                   <div className="absolute inset-0 flex pointer-events-none opacity-30">
                       {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                           <div key={i} className="flex-1 border-l border-slate-700 h-full relative first:border-l-0">
                               <span className="absolute top-1 left-1 text-[8px] text-slate-500">{i}s</span>
                           </div>
                       ))}
                   </div>

                   {/* Playhead */}
                   <div className="absolute top-0 bottom-0 w-px bg-brand-green pointer-events-none z-20" style={{ left: `${(currentTime / duration) * 100}%` }}>
                       <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-brand-green rounded-full shadow"></div>
                   </div>

                   {/* Scenes Bar Overlay */}
                   <div className="absolute inset-0 top-0 h-4 flex pointer-events-none">
                       {scenes.map(scene => (
                           <div
                                key={scene.id}
                                className="h-full border-r border-slate-900 bg-brand-green/10 flex items-center px-1 overflow-hidden"
                                style={{
                                    width: `${((scene.endTime - scene.startTime) / duration) * 100}%`,
                                    left: `${(scene.startTime / duration) * 100}%`,
                                    position: 'absolute'
                                }}
                           >
                               <span className="text-[9px] font-bold text-brand-green/50 whitespace-nowrap truncate">{scene.name}</span>
                           </div>
                       ))}
                   </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-brand-green w-16 text-right">
                        {currentTime.toFixed(2)}s
                    </span>
                    <span className="text-[10px] text-slate-500">
                        {currentScene ? currentScene.name : 'No Scene'}
                    </span>
                </div>
             </div>

             {/* Tracks Container */}
             <div className="flex-1 overflow-y-auto bg-slate-900 flex flex-col relative">
                 {/* Camera Track */}
                 <div className="flex border-b border-slate-800 bg-slate-950/50 h-6 shrink-0">
                     <div className="w-48 border-r border-slate-800 flex items-center px-4 gap-2 text-xs text-slate-400 font-mono">
                         <Video size={12} /> Camera Track
                     </div>
                     <div className="flex-1 relative" onClick={handleTimelineClick}>
                         {cameraSegments.map((seg, i) => (
                             <div
                                key={i}
                                className={`absolute top-1 bottom-1 rounded-sm text-[9px] flex items-center justify-center truncate px-1 transition-colors ${seg.isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                                style={{
                                    left: `${(seg.startTime / duration) * 100}%`,
                                    width: `${((seg.endTime - seg.startTime) / duration) * 100}%`
                                }}
                             >
                                 {seg.camName}
                             </div>
                         ))}
                         {/* Playhead Line */}
                         <div className="absolute top-0 bottom-0 w-px bg-brand-green/20 pointer-events-none" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
                     </div>
                 </div>

                 {/* Actor Tracks */}
                 {actors.filter(a => a.type !== 'camera').map(actor => {
                     const actorKeyframes = keyframes.filter(k => k.targetId === actor.id);
                     const distinctTimes = Array.from(new Set(actorKeyframes.map(k => k.time))).sort((a,b) => a-b);

                     return (
                         <div key={actor.id} className="h-8 border-b border-slate-800 flex shrink-0 group hover:bg-slate-800/30 transition-colors">
                             {/* Sidebar */}
                             <div
                                onClick={() => setSelected(actor.id)}
                                className={`w-48 border-r border-slate-800 flex items-center px-4 gap-2 text-xs cursor-pointer truncate transition-colors ${selectedId === actor.id ? 'bg-brand-green/10 text-brand-green' : 'text-slate-400'}`}
                             >
                                 {getActorIcon(actor.type, actor.shape)}
                                 {actor.name}
                             </div>

                             {/* Track Area */}
                             <div className="flex-1 relative" onClick={handleTimelineClick}>
                                 {/* Easing Lines (Preview) */}
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                     {distinctTimes.map((t, i) => {
                                         if (i === distinctTimes.length - 1) return null;
                                         const nextT = distinctTimes[i+1];
                                         const x1 = (t / duration) * 100;
                                         const x2 = (nextT / duration) * 100;

                                         // Just a straight line for now to indicate connection
                                         return (
                                             <line
                                                key={i}
                                                x1={`${x1}%`} y1="50%"
                                                x2={`${x2}%`} y2="50%"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                className="text-brand-green"
                                             />
                                         );
                                     })}
                                 </svg>

                                 {/* Keyframe Dots */}
                                 {distinctTimes.map(time => (
                                     <div
                                         key={time}
                                         className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-green rotate-45 hover:scale-150 transition-transform cursor-pointer z-10"
                                         style={{ left: `${(time / duration) * 100}%` }}
                                         title={`Keyframe at ${time.toFixed(2)}s`}
                                     ></div>
                                 ))}

                                 {/* Playhead Line */}
                                 <div className="absolute top-0 bottom-0 w-px bg-brand-green/20 pointer-events-none" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>
    );
};

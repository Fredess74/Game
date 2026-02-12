import React from 'react';
import { useStore } from '../store/useStore';
import type { ActorType, ShapeType } from '../types';
import { Box, Circle, User, Lightbulb, Zap, Mountain, Film, PlayCircle } from 'lucide-react';

export const AssetLibrary: React.FC = () => {
  const addActor = useStore((state) => state.addActor);
  const scenes = useStore((state) => state.scenes);
  const setTime = useStore((state) => state.setTime);
  const currentTime = useStore((state) => state.currentTime);

  const assets = [
    // Characters
    { type: 'character', shape: 'humanoid', label: 'Humanoid', icon: User },
    { type: 'character', shape: 'cube_character', label: 'Cube Bot', icon: User },

    // Props
    { type: 'prop', shape: 'box', label: 'Box', icon: Box },
    { type: 'prop', shape: 'sphere', label: 'Sphere', icon: Circle },
    { type: 'prop', shape: 'cylinder', label: 'Cylinder', icon: Box },
    { type: 'prop', shape: 'cone', label: 'Cone', icon: Mountain },

    // Set Pieces
    { type: 'set_piece', shape: 'plane', label: 'Ground', icon: Box, extra: { rotation: { x: -Math.PI/2, y: 0, z: 0 }, scale: { x: 5, y: 5, z: 1 } } },
    { type: 'set_piece', shape: 'box', label: 'Wall', icon: Box, extra: { scale: { x: 5, y: 3, z: 0.2 } } },

    // Lights
    { type: 'light', shape: 'sphere', label: 'Point Light', icon: Lightbulb, extra: { lightType: 'point', intensity: 1, color: '#ffffff' } },
    { type: 'light', shape: 'cone', label: 'Spot Light', icon: Lightbulb, extra: { lightType: 'spot', intensity: 2, color: '#ffffff' } },
    { type: 'light', shape: 'box', label: 'Sun Light', icon: Lightbulb, extra: { lightType: 'directional', intensity: 1, color: '#ffffee', position: { x: 5, y: 10, z: 5 } } },

    // VFX
    { type: 'vfx', shape: 'sphere', label: 'Particles', icon: Zap },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-brand-green/20 flex flex-col overflow-hidden">
      {/* Scenes Section */}
      <div className="p-4 border-b border-slate-800 shrink-0 max-h-48 overflow-y-auto">
          <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider mb-3 flex items-center gap-2">
              <Film size={14} /> Scenes
          </h2>
          <div className="flex flex-col gap-1">
              {scenes.length === 0 && <span className="text-xs text-slate-500 italic">No scenes defined</span>}
              {scenes.map(scene => {
                  const isActive = currentTime >= scene.startTime && currentTime < scene.endTime;
                  return (
                      <button
                          key={scene.id}
                          onClick={() => setTime(scene.startTime)}
                          className={`w-full flex items-center gap-2 px-2 py-2 rounded text-xs transition-colors text-left ${isActive ? 'bg-brand-green/20 text-brand-green border border-brand-green/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                      >
                          <PlayCircle size={12} />
                          <div className="flex-1 truncate">
                              <div className="font-bold">{scene.name}</div>
                              <div className="text-[10px] opacity-70">{scene.startTime}s - {scene.endTime}s</div>
                          </div>
                      </button>
                  );
              })}
          </div>
      </div>

      {/* Assets Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider mb-3">Library</h2>
        <div className="grid grid-cols-2 gap-2">
            {assets.map((asset, i) => (
            <button
                key={i}
                onClick={() => {
                    addActor(asset.type as ActorType, asset.shape as ShapeType, asset.extra as any);
                }}
                className="aspect-square bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-brand-green/50 rounded flex flex-col items-center justify-center gap-2 transition-all group"
            >
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand-green group-hover:bg-brand-green/10 transition-colors">
                <asset.icon size={18} />
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-white text-center leading-tight">{asset.label}</span>
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};

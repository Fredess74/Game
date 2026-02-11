import React from 'react';
import { useStore } from '../store/useStore';
import type { ActorType, ShapeType } from '../types';
import { Box, Circle, User, Music } from 'lucide-react';

export const AssetLibrary: React.FC = () => {
  const addActor = useStore((state) => state.addActor);

  const assets = [
    { type: 'actor', shape: 'capsule', label: 'Robot', icon: User },
    { type: 'prop', shape: 'box', label: 'Crate', icon: Box },
    { type: 'prop', shape: 'sphere', label: 'Ball', icon: Circle },
    { type: 'sound', shape: 'box', label: 'Speaker', icon: Music },
  ];

  return (
    <div className="w-64 bg-brand-dark border-r border-brand-green/20 p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider">Library</h2>
      <div className="grid grid-cols-2 gap-2">
        {assets.map((asset) => (
          <button
            key={asset.label}
            onClick={() => addActor(asset.type as ActorType, asset.shape as ShapeType)}
            className="aspect-square bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-brand-green/50 rounded flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand-green group-hover:bg-brand-green/10 transition-colors">
              <asset.icon size={20} />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white">{asset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

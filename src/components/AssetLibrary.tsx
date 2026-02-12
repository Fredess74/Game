import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Box, Image as ImageIcon, Grid, Search } from 'lucide-react';
import type { ActorType, ShapeType } from '../types';

type Tab = 'characters' | 'props' | 'sprites' | 'voxels';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'characters', label: 'Actors', icon: <User size={14} /> },
  { id: 'props', label: 'Props', icon: <Box size={14} /> },
  { id: 'sprites', label: '2D', icon: <ImageIcon size={14} /> },
  { id: 'voxels', label: 'Voxel', icon: <Grid size={14} /> },
];

export const AssetLibrary: React.FC = () => {
  const addActor = useStore((state) => state.addActor);
  const [activeTab, setActiveTab] = useState<Tab>('characters');
  const [search, setSearch] = useState('');

  const handleAdd = (type: ActorType, shape?: ShapeType, props?: any) => {
    addActor(type, shape, props);
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Search & Tabs Header */}
      <div className="p-2 border-b border-editor-border space-y-2">
         <div className="relative">
             <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-editor-muted" />
             <input
               type="text"
               placeholder="Search assets..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-editor-input text-editor-text pl-8 pr-2 py-1.5 rounded text-xs border border-transparent focus:border-editor-accent outline-none"
             />
         </div>
         <div className="flex gap-1 overflow-x-auto no-scrollbar">
             {TABS.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                        ? 'bg-editor-accent text-black'
                        : 'bg-editor-panelHover text-editor-muted hover:text-white'
                    }`}
                 >
                     {tab.icon} {tab.label}
                 </button>
             ))}
         </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
             {/* Dynamic Content based on Tab */}
             {activeTab === 'characters' && (
                 <>
                    <AssetCard label="Humanoid" onClick={() => handleAdd('character', 'humanoid')} icon={<User size={24} />} />
                    <AssetCard label="Cube Bot" onClick={() => handleAdd('character', 'cube_character')} icon={<Box size={24} />} />
                 </>
             )}

             {activeTab === 'props' && (
                 <>
                    <AssetCard label="Box" onClick={() => handleAdd('prop', 'box')} icon={<Box size={24} />} />
                    <AssetCard label="Sphere" onClick={() => handleAdd('prop', 'sphere')} icon={<div className="w-6 h-6 rounded-full border-2 border-current" />} />
                    <AssetCard label="Cylinder" onClick={() => handleAdd('prop', 'cylinder')} icon={<div className="w-4 h-6 border-2 border-current rounded-sm" />} />
                    <AssetCard label="Plane" onClick={() => handleAdd('prop', 'plane')} icon={<div className="w-6 h-4 border-2 border-current transform skew-x-12" />} />
                    <AssetCard label="Model (Duck)" onClick={() => handleAdd('model', 'model', { model: { url: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf', format: 'gltf' }, scale: { x: 1, y: 1, z: 1 } })} icon={<Box size={24} className="text-yellow-400" />} />
                 </>
             )}

             {activeTab === 'sprites' && (
                 <>
                    <AssetCard label="React Logo" onClick={() => handleAdd('sprite', 'sprite', { sprite: { url: '/vite.svg', billboardMode: true } })} icon={<ImageIcon size={24} />} />
                 </>
             )}

             {activeTab === 'voxels' && (
                 <>
                    <AssetCard label="Voxel Grid" onClick={() => handleAdd('voxel', 'voxel', { color: '#ef4444' })} icon={<Grid size={24} />} />
                 </>
             )}
          </div>
      </div>
    </div>
  );
};

const AssetCard: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-4 bg-editor-panelHover rounded hover:bg-neutral-700 active:scale-95 transition-all border border-transparent hover:border-editor-accent group"
    >
        <div className="text-editor-muted group-hover:text-editor-accent transition-colors">
            {icon}
        </div>
        <span className="text-xs font-medium text-editor-text">{label}</span>
    </button>
);

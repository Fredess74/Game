import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Box, Image as ImageIcon, Grid, Search } from 'lucide-react';

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

  // Helper to add different types of actors
  const handleAddCharacter = (name: string, url?: string) => {
      addActor('character', {
          name,
          baseModelUrl: url
      } as any);
  };

  const handleAddPrimitive = (shape: string) => {
      addActor('primitive', {
          name: shape.charAt(0).toUpperCase() + shape.slice(1),
          properties: { shape, color: '#ffffff', roughness: 0.5, metalness: 0.5 }
      } as any);
  };

  const handleAddModel = (name: string, url: string) => {
      addActor('prop', {
          name,
          properties: { modelUrl: url, format: 'gltf' }
      } as any);
  };

  const handleAddSprite = (name: string, url: string) => {
      addActor('sprite', {
          name,
          properties: { url, billboardMode: true }
      } as any);
  };

  return (
    <div className="flex flex-col h-full select-none bg-[#1e293b] text-gray-200">
      {/* Search & Tabs Header */}
      <div className="p-2 border-b border-gray-700 space-y-2 bg-[#0f172a]">
         <div className="relative">
             <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
             <input
               type="text"
               placeholder="Search assets..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[#334155] text-white pl-8 pr-2 py-1.5 rounded text-xs border border-transparent focus:border-[#4ade80] outline-none"
             />
         </div>
         <div className="flex gap-1 overflow-x-auto no-scrollbar">
             {TABS.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                        ? 'bg-[#4ade80] text-black'
                        : 'bg-gray-700 text-gray-400 hover:text-white'
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
                    <AssetCard label="Modular Human" onClick={() => handleAddCharacter('Human')} icon={<User size={24} />} />
                    <AssetCard label="Robot" onClick={() => handleAddCharacter('Robot', 'https://models.readyplayer.me/64f0263b65574328519c2354.glb')} icon={<Box size={24} />} />
                 </>
             )}

             {activeTab === 'props' && (
                 <>
                    <AssetCard label="Box" onClick={() => handleAddPrimitive('box')} icon={<Box size={24} />} />
                    <AssetCard label="Sphere" onClick={() => handleAddPrimitive('sphere')} icon={<div className="w-6 h-6 rounded-full border-2 border-current" />} />
                    <AssetCard label="Cylinder" onClick={() => handleAddPrimitive('cylinder')} icon={<div className="w-4 h-6 border-2 border-current rounded-sm" />} />
                    <AssetCard label="Plane" onClick={() => handleAddPrimitive('plane')} icon={<div className="w-6 h-4 border-2 border-current transform skew-x-12" />} />
                    <AssetCard label="Duck (GLTF)" onClick={() => handleAddModel('Duck', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf')} icon={<Box size={24} className="text-yellow-400" />} />
                 </>
             )}

             {activeTab === 'sprites' && (
                 <>
                    <AssetCard label="React Logo" onClick={() => handleAddSprite('React Logo', '/vite.svg')} icon={<ImageIcon size={24} />} />
                 </>
             )}

             {activeTab === 'voxels' && (
                 <div className="col-span-2 text-center text-xs text-gray-500 py-4">Voxel support coming soon</div>
             )}
          </div>
      </div>
    </div>
  );
};

const AssetCard: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-800 rounded hover:bg-gray-700 active:scale-95 transition-all border border-transparent hover:border-[#4ade80] group"
    >
        <div className="text-gray-400 group-hover:text-[#4ade80] transition-colors">
            {icon}
        </div>
        <span className="text-xs font-medium text-gray-200">{label}</span>
    </button>
);

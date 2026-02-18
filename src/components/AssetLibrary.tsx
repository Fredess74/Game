import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { User, Box, Image as ImageIcon, Grid, Search, AlertCircle } from 'lucide-react';

type Tab = 'characters' | 'props' | 'sprites' | 'voxels';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'characters', label: 'Actors', icon: <User size={14} /> },
  { id: 'props', label: 'Props', icon: <Box size={14} /> },
  { id: 'sprites', label: '2D', icon: <ImageIcon size={14} /> },
  { id: 'voxels', label: 'Voxel', icon: <Grid size={14} /> },
];

interface AssetDef {
  label: string;
  tab: Tab;
  icon: React.ReactNode;
  onAdd: (addActor: any) => void;
}

const ASSETS: AssetDef[] = [
  // Characters
  {
    label: 'Modular Human',
    tab: 'characters',
    icon: <User size={24} />,
    onAdd: (add) => add('character', { name: 'Human' } as any)
  },
  {
    label: 'Robot',
    tab: 'characters',
    icon: <Box size={24} />,
    onAdd: (add) => add('character', { name: 'Robot', baseModelUrl: 'https://models.readyplayer.me/64f0263b65574328519c2354.glb' } as any)
  },

  // Props
  {
    label: 'Box',
    tab: 'props',
    icon: <Box size={24} />,
    onAdd: (add) => add('primitive', { name: 'Box', properties: { shape: 'box', color: '#ffffff', roughness: 0.5, metalness: 0.5 } } as any)
  },
  {
    label: 'Sphere',
    tab: 'props',
    icon: <div className="w-6 h-6 rounded-full border-2 border-current" />,
    onAdd: (add) => add('primitive', { name: 'Sphere', properties: { shape: 'sphere', color: '#ffffff', roughness: 0.5, metalness: 0.5 } } as any)
  },
  {
    label: 'Cylinder',
    tab: 'props',
    icon: <div className="w-4 h-6 border-2 border-current rounded-sm" />,
    onAdd: (add) => add('primitive', { name: 'Cylinder', properties: { shape: 'cylinder', color: '#ffffff', roughness: 0.5, metalness: 0.5 } } as any)
  },
  {
    label: 'Plane',
    tab: 'props',
    icon: <div className="w-6 h-4 border-2 border-current transform skew-x-12" />,
    onAdd: (add) => add('primitive', { name: 'Plane', properties: { shape: 'plane', color: '#ffffff', roughness: 0.5, metalness: 0.5 } } as any)
  },
  {
    label: 'Duck (GLTF)',
    tab: 'props',
    icon: <Box size={24} className="text-yellow-400" />,
    onAdd: (add) => add('prop', { name: 'Duck', properties: { modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf', format: 'gltf' } } as any)
  },

  // Sprites
  {
    label: 'React Logo',
    tab: 'sprites',
    icon: <ImageIcon size={24} />,
    onAdd: (add) => add('sprite', { name: 'React Logo', properties: { url: '/vite.svg', billboardMode: true } } as any)
  },
];

export const AssetLibrary: React.FC = () => {
  const addActor = useStore((state) => state.addActor);
  const [activeTab, setActiveTab] = useState<Tab>('characters');
  const [search, setSearch] = useState('');

  const filteredAssets = useMemo(() => {
    return ASSETS.filter(asset =>
      asset.tab === activeTab &&
      asset.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeTab, search]);

  return (
    <div className="flex flex-col h-full select-none bg-[#1e293b] text-gray-200">
      {/* Search & Tabs Header */}
      <div className="p-2 border-b border-gray-700 space-y-2 bg-[#0f172a]">
         <div className="relative">
             <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
             <input
               type="text"
               placeholder="Search assets..."
               aria-label="Search assets"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[#334155] text-white pl-8 pr-2 py-1.5 rounded text-xs border border-transparent focus:border-[#4ade80] outline-none transition-colors placeholder:text-gray-500"
             />
         </div>
         <div className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Asset categories">
             {TABS.map((tab) => (
                 <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] ${
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
      <div
        className="flex-1 overflow-y-auto p-2 custom-scrollbar"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
          {activeTab === 'voxels' ? (
             <div className="flex flex-col items-center justify-center h-32 text-gray-500 gap-2">
                <Grid size={24} className="opacity-50" />
                <span className="text-xs">Voxel support coming soon</span>
             </div>
          ) : (
            <>
              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredAssets.map((asset, index) => (
                      <AssetCard
                        key={`${asset.tab}-${index}`}
                        label={asset.label}
                        onClick={() => asset.onAdd(addActor)}
                        icon={asset.icon}
                      />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 gap-2">
                   <AlertCircle size={24} className="opacity-50" />
                   <div className="text-center">
                     <p className="text-xs font-medium text-gray-400">No assets found</p>
                     <p className="text-[10px] text-gray-600">Try a different search term</p>
                   </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

const AssetCard: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-800 rounded hover:bg-gray-700 active:scale-95 transition-all border border-transparent hover:border-[#4ade80] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]"
    >
        <div className="text-gray-400 group-hover:text-[#4ade80] transition-colors">
            {icon}
        </div>
        <span className="text-xs font-medium text-gray-200 text-center">{label}</span>
    </button>
);

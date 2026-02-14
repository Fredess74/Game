import React, { useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronRight, Eye, EyeOff, Trash2, Box, Image as ImageIcon, Grid, Video, User, Sun } from 'lucide-react';
import type { Actor } from '../types';

export const PropertiesPanel: React.FC = () => {
  const selectedId = useStore((state) => state.selectedId);
  const actors = useStore((state) => state.actors);
  const updateActor = useStore((state) => state.updateActor);
  const removeActor = useStore((state) => state.removeActor);

  const selectedActor = actors.find((a) => a.id === selectedId);

  if (!selectedActor) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#1e293b] text-gray-500 select-none">
        <Box size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <span className="text-sm font-medium">No Selection</span>
        <span className="text-xs opacity-50">Click an object to edit properties</span>
      </div>
    );
  }

  // Transform helpers (convert tuple to object for UI, and back for update)
  const pos = { x: selectedActor.transform.position[0], y: selectedActor.transform.position[1], z: selectedActor.transform.position[2] };
  const rot = { x: selectedActor.transform.rotation[0], y: selectedActor.transform.rotation[1], z: selectedActor.transform.rotation[2] };
  const scale = { x: selectedActor.transform.scale[0], y: selectedActor.transform.scale[1], z: selectedActor.transform.scale[2] };

  const updateTransform = (type: 'position' | 'rotation' | 'scale', axis: 'x'|'y'|'z', val: number) => {
      const current = selectedActor.transform[type];
      const next = [...current] as [number, number, number];
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

      if (type === 'rotation') {
          next[idx] = THREE.MathUtils.degToRad(val);
      } else {
          next[idx] = val;
      }

      const newTransform = { ...selectedActor.transform, [type]: next };
      updateActor(selectedActor.id, { transform: newTransform });
  };

  // Property helpers
  const props = (selectedActor as any).properties || {};

  const updateProperty = (key: string, value: any) => {
      // Shallow merge properties
      updateActor(selectedActor.id, { properties: { ...props, [key]: value } } as any);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] text-gray-200 overflow-y-auto custom-scrollbar select-none border-l border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-[#0f172a] sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#4ade80] font-bold uppercase text-xs tracking-wider">
                    {getIconForType(selectedActor.type)}
                    <span>{selectedActor.type}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => updateActor(selectedActor.id, { visible: !selectedActor.visible })}
                        className={`p-1.5 rounded transition-colors ${selectedActor.visible ? 'text-gray-400 hover:text-white' : 'text-red-500 bg-red-500/10'}`}
                        title="Toggle Visibility"
                        aria-label={selectedActor.visible ? `Hide ${selectedActor.name}` : `Show ${selectedActor.name}`}
                        aria-pressed={!selectedActor.visible}
                    >
                        {selectedActor.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                        onClick={() => removeActor(selectedActor.id)}
                        className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                        aria-label={`Delete ${selectedActor.name}`}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="actor-name" className="text-[10px] uppercase font-bold text-gray-500">Name</label>
                <input
                    id="actor-name"
                    type="text"
                    value={selectedActor.name}
                    onChange={(e) => updateActor(selectedActor.id, { name: e.target.value })}
                    className="w-full bg-[#334155] text-sm text-white px-2 py-1.5 rounded border border-transparent focus:border-[#4ade80] outline-none font-medium"
                />
            </div>
        </div>

        <div className="p-2 space-y-2">
            <CollapsibleSection title="Transform" defaultOpen>
                <div className="space-y-3 p-1">
                    <Vector3Input label="Position" value={pos} onChange={(a, v) => updateTransform('position', a, v)} />
                    <Vector3Input label="Rotation" value={{
                        x: THREE.MathUtils.radToDeg(rot.x),
                        y: THREE.MathUtils.radToDeg(rot.y),
                        z: THREE.MathUtils.radToDeg(rot.z)
                    }} onChange={(a, v) => updateTransform('rotation', a, v)} step={5} />
                    <Vector3Input label="Scale" value={scale} onChange={(a, v) => updateTransform('scale', a, v)} step={0.1} />
                </div>
            </CollapsibleSection>

            {/* Conditional Properties based on Type */}
            {(selectedActor.type === 'primitive' || selectedActor.type === 'light') && (
                <CollapsibleSection title="Properties" defaultOpen>
                    <div className="space-y-3 p-1">
                         {props.color !== undefined && (
                             <div className="flex items-center justify-between">
                                 <label htmlFor="prop-color" className="text-xs text-gray-400">Color</label>
                                 <div className="flex items-center gap-2">
                                     <input id="prop-color" type="color" value={props.color} onChange={(e) => updateProperty('color', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                                     <span className="text-xs font-mono text-gray-500">{props.color}</span>
                                 </div>
                             </div>
                         )}

                         {props.intensity !== undefined && (
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <label htmlFor="prop-intensity">Intensity</label>
                                    <span>{props.intensity}</span>
                                </div>
                                <input
                                    id="prop-intensity"
                                    type="range" min="0" max="10" step="0.1"
                                    value={props.intensity}
                                    onChange={(e) => updateProperty('intensity', parseFloat(e.target.value))}
                                    className="w-full accent-[#4ade80] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                         )}

                         {props.fov !== undefined && (
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <label htmlFor="prop-fov">FOV</label>
                                    <span>{props.fov}</span>
                                </div>
                                <input
                                    id="prop-fov"
                                    type="range" min="10" max="120" step="1"
                                    value={props.fov}
                                    onChange={(e) => updateProperty('fov', parseFloat(e.target.value))}
                                    className="w-full accent-[#4ade80] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                         )}
                    </div>
                </CollapsibleSection>
            )}

            {selectedActor.type === 'primitive' && (
                <CollapsibleSection title="Material" defaultOpen>
                    <div className="space-y-3 p-1">
                         <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                                <label htmlFor="prop-roughness">Roughness</label>
                                <span>{props.roughness ?? 0.5}</span>
                            </div>
                            <input
                                id="prop-roughness"
                                type="range" min="0" max="1" step="0.01"
                                value={props.roughness ?? 0.5}
                                onChange={(e) => updateProperty('roughness', parseFloat(e.target.value))}
                                className="w-full accent-[#4ade80] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                                <label htmlFor="prop-metalness">Metalness</label>
                                <span>{props.metalness ?? 0.5}</span>
                            </div>
                            <input
                                id="prop-metalness"
                                type="range" min="0" max="1" step="0.01"
                                value={props.metalness ?? 0.5}
                                onChange={(e) => updateProperty('metalness', parseFloat(e.target.value))}
                                className="w-full accent-[#4ade80] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                         </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    </div>
  );
};

const getIconForType = (type: string) => {
    switch(type) {
        case 'character': return <User size={14} />;
        case 'prop': return <Box size={14} />;
        case 'sprite': return <ImageIcon size={14} />;
        case 'voxel': return <Grid size={14} />;
        case 'camera': return <Video size={14} />;
        case 'light': return <Sun size={14} />;
        default: return <Box size={14} />;
    }
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-700 rounded bg-[#0f172a] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 hover:bg-gray-700 transition-colors text-xs font-bold uppercase tracking-wide text-gray-200"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {isOpen && <div className="p-2 border-t border-gray-700">{children}</div>}
        </div>
    );
};

const Vector3Input: React.FC<{ label: string; value: { x: number, y: number, z: number }; onChange: (axis: 'x'|'y'|'z', val: number) => void; step?: number }> = ({ label, value, onChange, step = 0.1 }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase">{label}</label>
        <div className="grid grid-cols-3 gap-1">
            <NumberInput label="X" value={value.x} onChange={(v) => onChange('x', v)} step={step} color="text-red-400" ariaLabel={`${label} X`} />
            <NumberInput label="Y" value={value.y} onChange={(v) => onChange('y', v)} step={step} color="text-green-400" ariaLabel={`${label} Y`} />
            <NumberInput label="Z" value={value.z} onChange={(v) => onChange('z', v)} step={step} color="text-blue-400" ariaLabel={`${label} Z`} />
        </div>
    </div>
);

const NumberInput: React.FC<{ label: string; value: number; onChange: (v: number) => void; step?: number; color?: string; ariaLabel?: string }> = ({ label, value, onChange, step = 0.1, color = 'text-gray-400', ariaLabel }) => (
    <div className="relative group">
        <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold pointer-events-none ${color}`}>{label}</span>
        <input
            type="number"
            aria-label={ariaLabel || label}
            value={Math.round(value * 100) / 100}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            step={step}
            className="w-full bg-[#334155] text-white text-xs pl-5 pr-1 py-1 rounded border border-transparent focus:border-[#4ade80] outline-none text-right font-mono"
        />
    </div>
);

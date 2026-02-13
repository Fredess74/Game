import React, { useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronRight, Eye, EyeOff, Trash2, Box, Image as ImageIcon, Grid, Video, User } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const selectedId = useStore((state) => state.selectedId);
  const actors = useStore((state) => state.actors);
  const updateActor = useStore((state) => state.updateActor);
  const removeActor = useStore((state) => state.removeActor);

  const selectedActor = actors.find((a) => a.id === selectedId);

  if (!selectedActor) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-editor-muted select-none">
        <Box size={48} strokeWidth={1} className="mb-4 opacity-20" />
        <span className="text-sm font-medium">No Selection</span>
        <span className="text-xs opacity-50">Click an object to edit properties</span>
      </div>
    );
  }

  const updatePos = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { position: { ...selectedActor.position, [axis]: val } });
  const updateRot = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { rotation: { ...selectedActor.rotation, [axis]: THREE.MathUtils.degToRad(val) } });
  const updateScale = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { scale: { ...selectedActor.scale, [axis]: val } });

  return (
    <div className="flex flex-col h-full bg-editor-panel overflow-y-auto custom-scrollbar select-none">
        {/* Header */}
        <div className="p-4 border-b border-editor-border bg-editor-bg sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-editor-accent font-bold uppercase text-xs tracking-wider">
                    {getIconForType(selectedActor.type)}
                    <span>{selectedActor.type}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => updateActor(selectedActor.id, { visible: !selectedActor.visible })}
                        className={`p-1.5 rounded transition-colors ${selectedActor.visible ? 'text-editor-muted hover:text-white' : 'text-editor-danger bg-editor-danger/10'}`}
                        title="Toggle Visibility"
                    >
                        {selectedActor.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                        onClick={() => removeActor(selectedActor.id)}
                        className="p-1.5 rounded text-editor-muted hover:text-editor-danger hover:bg-editor-danger/10 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-editor-muted">Name</label>
                <input
                    type="text"
                    value={selectedActor.name}
                    onChange={(e) => updateActor(selectedActor.id, { name: e.target.value })}
                    className="w-full bg-editor-input text-sm text-editor-text px-2 py-1.5 rounded border border-transparent focus:border-editor-accent outline-none font-medium"
                />
            </div>
        </div>

        <div className="p-2 space-y-2">
            <CollapsibleSection title="Transform" defaultOpen>
                <div className="space-y-3 p-1">
                    <Vector3Input label="Position" value={selectedActor.position} onChange={(a, v) => updatePos(a, v)} />
                    <Vector3Input label="Rotation" value={{
                        x: THREE.MathUtils.radToDeg(selectedActor.rotation.x),
                        y: THREE.MathUtils.radToDeg(selectedActor.rotation.y),
                        z: THREE.MathUtils.radToDeg(selectedActor.rotation.z)
                    }} onChange={(a, v) => updateRot(a, v)} step={5} />
                    <Vector3Input label="Scale" value={selectedActor.scale} onChange={(a, v) => updateScale(a, v)} step={0.1} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Material" defaultOpen>
                <div className="space-y-3 p-1">
                     <div className="flex items-center justify-between">
                         <label className="text-xs text-editor-muted">Base Color</label>
                         <div className="flex items-center gap-2">
                             <input type="color" value={selectedActor.color} onChange={(e) => updateActor(selectedActor.id, { color: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                             <span className="text-xs font-mono text-editor-muted">{selectedActor.color}</span>
                         </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-editor-muted">
                            <span>Opacity</span>
                            <span>{Math.round(selectedActor.opacity * 100)}%</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={selectedActor.opacity}
                            onChange={(e) => updateActor(selectedActor.id, { opacity: parseFloat(e.target.value) })}
                            className="w-full accent-editor-accent h-1 bg-editor-border rounded-lg appearance-none cursor-pointer"
                        />
                     </div>

                     <div className="space-y-1 pt-2 border-t border-editor-border">
                        <div className="flex justify-between text-xs text-editor-muted">
                            <span>Emissive (Glow)</span>
                            <span>{selectedActor.emissiveIntensity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="color" value={selectedActor.emissive || '#000000'} onChange={(e) => updateActor(selectedActor.id, { emissive: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                            <input
                                type="range" min="0" max="5" step="0.1"
                                value={selectedActor.emissiveIntensity || 0}
                                onChange={(e) => updateActor(selectedActor.id, { emissiveIntensity: parseFloat(e.target.value) })}
                                className="flex-1 accent-editor-accent h-1 bg-editor-border rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                     </div>
                </div>
            </CollapsibleSection>

            {/* Type Specific Sections */}
            {selectedActor.type === 'sprite' && (
                <CollapsibleSection title="Sprite Settings" defaultOpen>
                    <div className="space-y-2 p-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-editor-muted">Billboard</label>
                            <input
                                type="checkbox"
                                checked={selectedActor.sprite?.billboardMode ?? true}
                                onChange={(e) => updateActor(selectedActor.id, { sprite: { ...selectedActor.sprite!, billboardMode: e.target.checked } })}
                                className="accent-editor-accent"
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
        default: return <Box size={14} />;
    }
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-editor-border rounded bg-editor-bg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-editor-panelHover hover:bg-neutral-700 transition-colors text-xs font-bold uppercase tracking-wide text-editor-text"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {isOpen && <div className="p-2 border-t border-editor-border">{children}</div>}
        </div>
    );
};

const Vector3Input: React.FC<{ label: string; value: { x: number, y: number, z: number }; onChange: (axis: 'x'|'y'|'z', val: number) => void; step?: number }> = ({ label, value, onChange, step = 0.1 }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-editor-muted uppercase">{label}</label>
        <div className="grid grid-cols-3 gap-1">
            <NumberInput label="X" value={value.x} onChange={(v) => onChange('x', v)} step={step} color="text-red-400" />
            <NumberInput label="Y" value={value.y} onChange={(v) => onChange('y', v)} step={step} color="text-green-400" />
            <NumberInput label="Z" value={value.z} onChange={(v) => onChange('z', v)} step={step} color="text-blue-400" />
        </div>
    </div>
);

const NumberInput: React.FC<{ label: string; value: number; onChange: (v: number) => void; step?: number; color?: string }> = ({ label, value, onChange, step = 0.1, color = 'text-editor-muted' }) => (
    <div className="relative group">
        <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold pointer-events-none ${color}`}>{label}</span>
        <input
            type="number"
            value={Math.round(value * 100) / 100}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            step={step}
            className="w-full bg-editor-input text-editor-text text-xs pl-5 pr-1 py-1 rounded border border-transparent focus:border-editor-accent outline-none text-right font-mono"
        />
    </div>
);

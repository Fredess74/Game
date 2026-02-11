import React from 'react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { Eye, EyeOff } from 'lucide-react';

const NumberInput = ({ label, value, onChange, step = 0.1 }: { label: string, value: number, onChange: (v: number) => void, step?: number }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] text-slate-500 text-center">{label}</span>
        <input
            type="number"
            step={step}
            value={Number(value).toFixed(2)}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700 focus:border-brand-green outline-none text-white"
        />
    </div>
);

export const PropertiesPanel: React.FC = () => {
    const selectedId = useStore((state) => state.selectedId);
    const actors = useStore((state) => state.actors);
    const updateActor = useStore((state) => state.updateActor);
    const backgroundColor = useStore((state) => state.backgroundColor);
    const gridVisible = useStore((state) => state.gridVisible);
    const setEnvironment = useStore((state) => state.setEnvironment);
    const fog = useStore((state) => state.fog);

    const selectedActor = actors.find(a => a.id === selectedId);

    if (!selectedActor) {
        return (
            <div className="w-64 bg-slate-900 border-l border-brand-green/20 p-4 flex flex-col gap-4">
                <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider">Scene Settings</h2>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Background Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setEnvironment({ backgroundColor: e.target.value })}
                            className="w-8 h-8 bg-transparent border-0 p-0 rounded cursor-pointer overflow-hidden"
                        />
                        <input
                             type="text"
                             value={backgroundColor}
                             onChange={(e) => setEnvironment({ backgroundColor: e.target.value })}
                             className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-brand-green outline-none uppercase"
                        />
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        id="gridCheck"
                        checked={gridVisible}
                        onChange={(e) => setEnvironment({ gridVisible: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-brand-green focus:ring-brand-green"
                     />
                     <label htmlFor="gridCheck" className="text-xs text-slate-400 cursor-pointer">Show Grid</label>
                 </div>

                 {/* Fog Settings */}
                 <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                     <div className="flex items-center justify-between">
                         <label className="text-xs text-slate-400">Fog</label>
                         <input
                            type="checkbox"
                            checked={!!fog}
                            onChange={(e) => setEnvironment({ fog: e.target.checked ? { color: backgroundColor, near: 5, far: 20 } : undefined })}
                            className="rounded border-slate-700 bg-slate-800 text-brand-green"
                         />
                     </div>
                     {fog && (
                         <>
                             <div className="flex gap-2">
                                <span className="text-[10px] w-8">Near</span>
                                <input type="range" min="0" max="50" value={fog.near} onChange={(e) => setEnvironment({ fog: { ...fog, near: parseFloat(e.target.value) } })} className="flex-1" />
                             </div>
                             <div className="flex gap-2">
                                <span className="text-[10px] w-8">Far</span>
                                <input type="range" min="10" max="100" value={fog.far} onChange={(e) => setEnvironment({ fog: { ...fog, far: parseFloat(e.target.value) } })} className="flex-1" />
                             </div>
                         </>
                     )}
                 </div>

                <div className="mt-8 text-sm text-slate-500 text-center italic border-t border-slate-800 pt-4">
                    Select an object to edit properties
                </div>
            </div>
        );
    }

    const updatePos = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { position: { ...selectedActor.position, [axis]: val } });
    const updateRot = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { rotation: { ...selectedActor.rotation, [axis]: THREE.MathUtils.degToRad(val) } });
    const updateScale = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { scale: { ...selectedActor.scale, [axis]: val } });

    return (
        <div className="w-64 bg-slate-900 border-l border-brand-green/20 p-4 flex flex-col gap-4 overflow-y-auto h-full">
             <div className="flex items-center justify-between">
                 <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider">Properties</h2>
                 <button
                    onClick={() => updateActor(selectedActor.id, { visible: !selectedActor.visible })}
                    className={`text-xs p-1 rounded ${selectedActor.visible ? 'text-slate-400 hover:text-white' : 'text-slate-600'}`}
                 >
                     {selectedActor.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                 </button>
             </div>

             <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Name</label>
                <input
                    type="text"
                    value={selectedActor.name}
                    onChange={(e) => updateActor(selectedActor.id, { name: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-brand-green outline-none"
                />
             </div>

             <div className="text-[10px] font-mono text-slate-600 text-right">{selectedActor.type} / {selectedActor.shape}</div>

             {/* Color / Emissive */}
             <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400">Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={selectedActor.color}
                        onChange={(e) => updateActor(selectedActor.id, { color: e.target.value })}
                        className="w-8 h-8 bg-transparent border-0 p-0 rounded cursor-pointer overflow-hidden"
                    />
                    <input
                         type="text"
                         value={selectedActor.color}
                         onChange={(e) => updateActor(selectedActor.id, { color: e.target.value })}
                         className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-brand-green outline-none uppercase"
                    />
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">Emissive (Glow)</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={selectedActor.emissive || '#000000'}
                        onChange={(e) => updateActor(selectedActor.id, { emissive: e.target.value })}
                        className="w-8 h-8 bg-transparent border-0 p-0 rounded cursor-pointer overflow-hidden"
                    />
                    <input
                        type="range"
                        min="0" max="10" step="0.1"
                        value={selectedActor.emissiveIntensity || 0}
                        onChange={(e) => updateActor(selectedActor.id, { emissiveIntensity: parseFloat(e.target.value) })}
                        className="flex-1"
                    />
                </div>
             </div>

             <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <label className="text-xs text-slate-400">Opacity</label>
                    <span className="text-[10px] text-slate-500">{(selectedActor.opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={selectedActor.opacity}
                    onChange={(e) => updateActor(selectedActor.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full"
                />
             </div>

             {/* Transforms */}
             <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <label className="text-xs text-brand-green font-bold">Position</label>
                <div className="grid grid-cols-3 gap-2">
                    <NumberInput label="X" value={selectedActor.position.x} onChange={(v) => updatePos('x', v)} />
                    <NumberInput label="Y" value={selectedActor.position.y} onChange={(v) => updatePos('y', v)} />
                    <NumberInput label="Z" value={selectedActor.position.z} onChange={(v) => updatePos('z', v)} />
                </div>
             </div>

             <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <label className="text-xs text-brand-green font-bold">Rotation (°)</label>
                <div className="grid grid-cols-3 gap-2">
                    <NumberInput label="X" value={THREE.MathUtils.radToDeg(selectedActor.rotation.x)} onChange={(v) => updateRot('x', v)} step={5} />
                    <NumberInput label="Y" value={THREE.MathUtils.radToDeg(selectedActor.rotation.y)} onChange={(v) => updateRot('y', v)} step={5} />
                    <NumberInput label="Z" value={THREE.MathUtils.radToDeg(selectedActor.rotation.z)} onChange={(v) => updateRot('z', v)} step={5} />
                </div>
             </div>

             <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <label className="text-xs text-brand-green font-bold">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                    <NumberInput label="X" value={selectedActor.scale.x} onChange={(v) => updateScale('x', v)} />
                    <NumberInput label="Y" value={selectedActor.scale.y} onChange={(v) => updateScale('y', v)} />
                    <NumberInput label="Z" value={selectedActor.scale.z} onChange={(v) => updateScale('z', v)} />
                </div>
             </div>

             {/* Light Properties */}
             {selectedActor.type === 'light' && (
                 <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                     <label className="text-xs text-yellow-500 font-bold">Light Settings</label>
                     <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Intensity</label>
                        <input
                            type="range" min="0" max="10" step="0.1"
                            value={selectedActor.intensity || 1}
                            onChange={(e) => updateActor(selectedActor.id, { intensity: parseFloat(e.target.value) })}
                        />
                     </div>
                 </div>
             )}
        </div>
    );
};

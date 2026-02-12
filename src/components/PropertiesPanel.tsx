import { useStore } from '../store/useStore';
import { Eye, EyeOff, Sun } from 'lucide-react';
import * as THREE from 'three';
import { EnvironmentPanel } from './EnvironmentPanel';

const NumberInput = ({ label, value, onChange, step = 0.1, min, max }: { label: string, value: number, onChange: (val: number) => void, step?: number, min?: number, max?: number }) => (
    <div className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1 border border-slate-700">
        <span className="text-[10px] text-slate-500 w-3">{label}</span>
        <input
            type="number"
            value={Number(value).toFixed(2)}
            step={step}
            min={min}
            max={max}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-transparent text-xs text-white outline-none font-mono text-right"
        />
    </div>
);

export const PropertiesPanel = () => {
    const selectedId = useStore((state) => state.selectedId);
    const actors = useStore((state) => state.actors);
    const updateActor = useStore((state) => state.updateActor);
    const setEnvironment = useStore((state) => state.setEnvironment);

    // Legacy environment props
    const ambientLightIntensity = useStore((state) => state.ambientLightIntensity);
    const ambientLightColor = useStore((state) => state.ambientLightColor);
    const fog = useStore((state) => state.fog);

    const selectedActor = actors.find(a => a.id === selectedId);

    if (!selectedActor) {
        return (
            <div className="w-72 bg-slate-950 border-l border-brand-green/20 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-slate-900 bg-slate-900/50">
                    <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider flex items-center gap-2">
                        <Sun size={16} /> Scene Environment
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                     <EnvironmentPanel />

                     {/* Global Lighting & Fog (Legacy/Root State) */}
                     <div className="p-4 border-t border-slate-800 space-y-4">
                         <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs flex items-center gap-2">
                            <span>💡</span> Lighting & Fog
                         </h3>

                         {/* Ambient Light */}
                         <div className="space-y-2 pl-2 border-l-2 border-slate-800">
                             <label className="text-xs text-slate-300">Ambient Light</label>
                             <div className="flex items-center gap-2">
                                <input
                                     type="color"
                                     value={ambientLightColor}
                                     onChange={(e) => setEnvironment({ ambientLightColor: e.target.value })}
                                     className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                                />
                                <input
                                    type="range"
                                    min="0" max="2" step="0.1"
                                    value={ambientLightIntensity}
                                    onChange={(e) => setEnvironment({ ambientLightIntensity: parseFloat(e.target.value) })}
                                    className="flex-1 accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                         </div>

                         {/* Fog Settings */}
                         <div className="space-y-2 pl-2 border-l-2 border-slate-800">
                             <div className="flex items-center justify-between">
                                 <label className="text-xs text-slate-300">Fog</label>
                                 <input
                                    type="checkbox"
                                    checked={!!fog}
                                    onChange={(e) => setEnvironment({ fog: e.target.checked ? { color: '#1e293b', near: 5, far: 20 } : undefined })}
                                    className="accent-brand-green w-4 h-4 cursor-pointer"
                                 />
                             </div>
                             {fog && (
                                 <div className="space-y-2 pt-2">
                                     <div className="flex items-center gap-2">
                                        <label className="text-[10px] text-slate-500 w-8">Color</label>
                                        <input
                                            type="color"
                                            value={fog.color}
                                            onChange={(e) => setEnvironment({ fog: { ...fog, color: e.target.value } })}
                                            className="w-full h-4 rounded cursor-pointer border-0 p-0"
                                        />
                                     </div>
                                     <div className="flex gap-2 items-center">
                                        <span className="text-[10px] w-8 text-slate-500">Near</span>
                                        <input type="range" min="0" max="50" value={fog.near} onChange={(e) => setEnvironment({ fog: { ...fog, near: parseFloat(e.target.value) } })} className="flex-1 accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                                     </div>
                                     <div className="flex gap-2 items-center">
                                        <span className="text-[10px] w-8 text-slate-500">Far</span>
                                        <input type="range" min="10" max="200" value={fog.far} onChange={(e) => setEnvironment({ fog: { ...fog, far: parseFloat(e.target.value) } })} className="flex-1 accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    const updatePos = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { position: { ...selectedActor.position, [axis]: val } });
    const updateRot = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { rotation: { ...selectedActor.rotation, [axis]: THREE.MathUtils.degToRad(val) } });
    const updateScale = (axis: 'x'|'y'|'z', val: number) => updateActor(selectedActor.id, { scale: { ...selectedActor.scale, [axis]: val } });

    return (
        <div className="w-72 bg-slate-900 border-l border-brand-green/20 p-4 flex flex-col gap-4 overflow-y-auto h-full custom-scrollbar">
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
                        className="flex-1 accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
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
                    className="w-full accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
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
                            className="w-full accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                     </div>
                 </div>
             )}
        </div>
    );
};

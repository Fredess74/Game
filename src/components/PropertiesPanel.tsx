import React from 'react';
import { useStore } from '../store/useStore';

export const PropertiesPanel: React.FC = () => {
    const selectedId = useStore((state) => state.selectedId);
    const actors = useStore((state) => state.actors);
    const updateActor = useStore((state) => state.updateActor);
    const backgroundColor = useStore((state) => state.backgroundColor);
    const gridVisible = useStore((state) => state.gridVisible);
    const setEnvironment = useStore((state) => state.setEnvironment);

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

                <div className="mt-8 text-sm text-slate-500 text-center italic border-t border-slate-800 pt-4">
                    Select an object to edit properties
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 bg-slate-900 border-l border-brand-green/20 p-4 flex flex-col gap-4 overflow-y-auto h-full">
             <h2 className="text-brand-green font-bold uppercase text-sm tracking-wider">Properties</h2>

             <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Name</label>
                <input
                    type="text"
                    value={selectedActor.name}
                    onChange={(e) => updateActor(selectedActor.id, { name: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-brand-green outline-none"
                />
             </div>

             <div className="flex flex-col gap-1">
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

             <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <label className="text-xs text-brand-green font-bold">Position</label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">X</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.position.x.toFixed(2)} readOnly />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">Y</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.position.y.toFixed(2)} readOnly />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">Z</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.position.z.toFixed(2)} readOnly />
                    </div>
                </div>
             </div>

             <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <label className="text-xs text-brand-green font-bold">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">X</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.rotation.x.toFixed(2)} readOnly />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">Y</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.rotation.y.toFixed(2)} readOnly />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 text-center">Z</span>
                        <input className="bg-slate-800 text-xs px-1 py-1 rounded text-center w-full border border-slate-700" value={selectedActor.rotation.z.toFixed(2)} readOnly />
                    </div>
                </div>
             </div>
        </div>
    );
};

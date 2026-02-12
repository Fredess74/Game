import { useStore } from '../store/useStore';

export const EnvironmentPanel = () => {
  const environment = useStore((state) => state.environment);
  const setEnvironment = useStore((state) => state.setEnvironment);

  const updateEnvironment = (section: 'ground' | 'sky' | 'weather', updates: any) => {
    setEnvironment({
      environment: {
        ...environment,
        [section]: {
          ...environment[section],
          ...updates
        }
      }
    });
  };

  return (
    <div className="space-y-6 text-xs p-4 overflow-y-auto h-full text-slate-300">
      {/* Sky Section */}
      <div className="space-y-2">
        <h3 className="font-bold text-brand-green uppercase tracking-wider flex items-center gap-2">
            <span>☁️</span> Sky
        </h3>
        <div className="space-y-3 pl-2 border-l-2 border-slate-800">
           <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
             <label>Color</label>
             <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={environment.sky.color}
                    onChange={(e) => updateEnvironment('sky', { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-[10px] font-mono text-slate-500">{environment.sky.color}</span>
             </div>
           </div>
           <div className="space-y-1">
             <label className="block mb-1">Texture URL (Skybox)</label>
             <input
                type="text"
                value={environment.sky.texture || ''}
                placeholder="https://..."
                onChange={(e) => updateEnvironment('sky', { texture: e.target.value || null })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-300 focus:border-brand-green outline-none transition-colors"
             />
           </div>
        </div>
      </div>

      {/* Ground Section */}
      <div className="space-y-2">
        <h3 className="font-bold text-brand-green uppercase tracking-wider flex items-center gap-2">
            <span>🌍</span> Ground
        </h3>
        <div className="space-y-3 pl-2 border-l-2 border-slate-800">
           <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
             <label>Color</label>
             <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={environment.ground.color}
                    onChange={(e) => updateEnvironment('ground', { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-[10px] font-mono text-slate-500">{environment.ground.color}</span>
             </div>
           </div>
           <div className="space-y-1">
             <label className="block mb-1">Texture URL</label>
             <input
                type="text"
                value={environment.ground.texture || ''}
                placeholder="https://..."
                onChange={(e) => updateEnvironment('ground', { texture: e.target.value || null })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-300 focus:border-brand-green outline-none transition-colors"
             />
           </div>
           <div className="space-y-1">
               <div className="flex justify-between">
                 <label>Opacity</label>
                 <span className="text-slate-500">{Math.round(environment.ground.opacity * 100)}%</span>
               </div>
               <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={environment.ground.opacity}
                  onChange={(e) => updateEnvironment('ground', { opacity: parseFloat(e.target.value) })}
                  className="w-full accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
               />
           </div>
           <div className="flex items-center justify-between pt-1">
             <label>Show Grid</label>
             <input
                type="checkbox"
                checked={environment.ground.gridVisible}
                onChange={(e) => updateEnvironment('ground', { gridVisible: e.target.checked })}
                className="accent-brand-green w-4 h-4 cursor-pointer"
             />
           </div>
        </div>
      </div>

      {/* Weather Section */}
      <div className="space-y-2">
        <h3 className="font-bold text-brand-green uppercase tracking-wider flex items-center gap-2">
            <span>⛈️</span> Weather
        </h3>
        <div className="space-y-3 pl-2 border-l-2 border-slate-800">
           <div className="space-y-1">
             <label className="block mb-1">Effect</label>
             <select
                value={environment.weather.type}
                onChange={(e) => updateEnvironment('weather', { type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-300 focus:border-brand-green outline-none"
             >
               <option value="none">None</option>
               <option value="rain">Rain</option>
               <option value="snow">Snow</option>
             </select>
           </div>
           {environment.weather.type !== 'none' && (
             <div className="space-y-1">
               <div className="flex justify-between">
                 <label>Intensity</label>
                 <span className="text-slate-500">{Math.round(environment.weather.intensity * 100)}%</span>
               </div>
               <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={environment.weather.intensity}
                  onChange={(e) => updateEnvironment('weather', { intensity: parseFloat(e.target.value) })}
                  className="w-full accent-brand-green h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
               />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

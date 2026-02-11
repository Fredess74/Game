import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AssetLibrary } from './components/AssetLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Timeline } from './components/Timeline';
import { SceneManager } from './engine/SceneManager';
import { PlaybackController } from './engine/PlaybackController';
import { AudioEngine } from './engine/AudioEngine';
import { VideoExporter } from './engine/VideoExporter';
import { Camera, Video, Download, Upload, FileVideo } from 'lucide-react';
import { useStore } from './store/useStore';

function App() {
  const currentTime = useStore((state) => state.currentTime);
  const isCameraView = useStore((state) => state.isCameraView);
  const setCameraView = useStore((state) => state.setCameraView);
  const isExporting = useStore((state) => state.isExporting);
  const setExporting = useStore((state) => state.setExporting);
  const loadProject = useStore((state) => state.loadProject);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const state = useStore.getState();
    const data = JSON.stringify({
        actors: state.actors,
        keyframes: state.keyframes,
        duration: state.duration,
        backgroundColor: state.backgroundColor,
        gridVisible: state.gridVisible
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${Date.now()}.json`;
    a.click();
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            loadProject(json);
        } catch (err) {
            console.error("Failed to parse project file", err);
            alert("Invalid project file");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen w-screen bg-brand-dark flex flex-col text-white">
      <header className="h-14 bg-slate-900 border-b border-brand-green/20 flex items-center px-4 justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold text-slate-900">M</div>
           <h1 className="text-xl font-bold text-brand-green tracking-tight">MOVIE MAKER</h1>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={handleSave} className="text-slate-400 hover:text-white px-2 py-1 text-xs flex items-center gap-1">
                <Download size={14} /> SAVE
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-white px-2 py-1 text-xs flex items-center gap-1">
                <Upload size={14} /> LOAD
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoad}
                className="hidden"
                accept=".json"
            />
            <div className="w-px h-4 bg-slate-700 mx-2"></div>
            <button
                onClick={() => setExporting(true)}
                disabled={isExporting}
                className={`bg-brand-green text-slate-900 text-xs px-3 py-1 rounded font-bold transition-colors flex items-center gap-1 ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-green/80'}`}
            >
                <FileVideo size={14} />
                {isExporting ? 'EXPORTING...' : 'EXPORT VIDEO'}
            </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <AssetLibrary />

        <div className="flex-1 relative bg-slate-950 flex flex-col">
           <div className="flex-1 relative">
             <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
                <PlaybackController />
                <SceneManager />
                <AudioEngine />
                <VideoExporter />
             </Canvas>

             {/* Viewport Overlay */}
             <div className="absolute top-4 left-4 bg-slate-900/80 p-2 rounded border border-slate-700 pointer-events-auto flex items-center gap-2">
                <button
                    onClick={() => setCameraView(!isCameraView)}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-mono transition-colors ${isCameraView ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'text-slate-400 hover:text-white'}`}
                >
                    {isCameraView ? <Video size={14} /> : <Camera size={14} />}
                    {isCameraView ? "REC VIEW" : "EDITOR VIEW"}
                </button>
             </div>

             {/* Export Overlay */}
             {isExporting && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
                     <div className="bg-slate-900 p-4 rounded border border-brand-green text-center">
                         <div className="text-brand-green font-bold text-xl mb-2">EXPORTING VIDEO...</div>
                         <div className="text-slate-400 text-sm">Please wait while we render your masterpiece.</div>
                         <div className="mt-4 w-full bg-slate-800 h-2 rounded overflow-hidden">
                             <div className="h-full bg-brand-green transition-all duration-75" style={{ width: `${(currentTime / 10) * 100}%` }}></div>
                         </div>
                     </div>
                 </div>
             )}
           </div>
        </div>

        <PropertiesPanel />
      </main>

      <Timeline />
    </div>
  )
}

export default App

import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AssetLibrary } from './components/AssetLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Timeline } from './components/Timeline';
import { SceneManager } from './engine/SceneManager';
import { PlaybackController } from './engine/PlaybackController';
import { AudioEngine } from './engine/AudioEngine';
import { VideoExporter } from './engine/VideoExporter';
import { ScriptConsole } from './components/ScriptConsole';
import { ExportModal } from './components/ExportModal';
import { CinematicOverlay } from './components/CinematicOverlay';
import { Camera, Video, Download, Upload, FileVideo, Zap } from 'lucide-react';
import { useStore } from './store/useStore';

function App() {
  const isCameraView = useStore((state) => state.isCameraView);
  const setCameraView = useStore((state) => state.setCameraView);
  const isExporting = useStore((state) => state.isExporting);
  const exportSettings = useStore((state) => state.exportSettings);
  const loadProject = useStore((state) => state.loadProject);

  const [showScriptConsole, setShowScriptConsole] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const state = useStore.getState();
    const data = JSON.stringify({
        actors: state.actors,
        keyframes: state.keyframes,
        scenes: state.scenes,
        cameraCuts: state.cameraCuts,
        overlays: state.overlays,
        duration: state.duration,
        backgroundColor: state.backgroundColor,
        gridVisible: state.gridVisible,
        ambientLightIntensity: state.ambientLightIntensity,
        ambientLightColor: state.ambientLightColor,
        fog: state.fog,
        exportSettings: state.exportSettings
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
    <div className="h-screen w-screen bg-brand-dark flex flex-col text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-brand-green/20 flex items-center px-4 justify-between shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold text-slate-900">M</div>
               <h1 className="text-xl font-bold text-brand-green tracking-tight hidden sm:block">FREDESS MOVIE ENGINE</h1>
           </div>

           <div className="h-6 w-px bg-slate-700 mx-2"></div>

           <button
                onClick={handleSave}
                className="text-slate-400 hover:text-white px-2 py-1 text-xs flex items-center gap-1 transition-colors"
                title="Save Project JSON"
            >
                <Download size={14} /> SAVE
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-white px-2 py-1 text-xs flex items-center gap-1 transition-colors"
                title="Load Project JSON"
            >
                <Upload size={14} /> LOAD
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoad}
                className="hidden"
                accept=".json"
            />

            <button
                onClick={() => setShowScriptConsole(!showScriptConsole)}
                className={`text-xs px-3 py-1 rounded font-bold transition-colors flex items-center gap-1 border border-transparent ${showScriptConsole ? 'bg-brand-green/20 text-brand-green border-brand-green/50' : 'text-slate-300 hover:text-brand-green hover:bg-slate-800'}`}
            >
                <Zap size={14} /> AI SCRIPT
            </button>
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowExportModal(true)}
                disabled={isExporting}
                className={`bg-brand-green hover:bg-brand-green/90 text-slate-900 text-xs px-4 py-2 rounded font-bold transition-colors flex items-center gap-2 shadow-lg shadow-brand-green/20 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <FileVideo size={16} />
                EXPORT MOVIE
            </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <AssetLibrary />

        <div className="flex-1 relative bg-slate-950 flex flex-col min-w-0">
           <div
             className={isExporting ? 'fixed top-0 left-0 z-50 pointer-events-none bg-black' : 'flex-1 relative'}
             style={isExporting ? {
                width: exportSettings.resolution === '4k' ? 3840 : exportSettings.resolution === '720p' ? 1280 : 1920,
                height: exportSettings.resolution === '4k' ? 2160 : exportSettings.resolution === '720p' ? 720 : 1080
             } : {}}
           >
             <Canvas shadows dpr={isExporting ? 1 : [1, 2]} gl={{ preserveDrawingBuffer: true }}>
                <PlaybackController />
                <SceneManager />
                <AudioEngine />
                <VideoExporter />
             </Canvas>

             {/* Cinematic Overlays */}
             <CinematicOverlay />

             {/* Viewport Overlay Controls */}
             <div className="absolute top-4 left-4 bg-slate-900/80 p-1 rounded-md border border-slate-700 pointer-events-auto flex items-center gap-1 z-10 backdrop-blur-sm">
                <button
                    onClick={() => setCameraView(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${!isCameraView ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Camera size={14} /> EDITOR
                </button>
                <button
                    onClick={() => setCameraView(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${isCameraView ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Video size={14} /> REC VIEW
                </button>
             </div>
           </div>
        </div>

        <PropertiesPanel />

        {/* Script Console Overlay */}
        {showScriptConsole && (
            <ScriptConsole onClose={() => setShowScriptConsole(false)} />
        )}
      </main>

      <Timeline />

      {/* Export Modal Overlay */}
      {(showExportModal || isExporting) && (
          <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  )
}

export default App

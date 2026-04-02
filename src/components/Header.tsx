import React, { useRef } from 'react';
import { Download, Video, Box, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isExporting, setExporting,
    isCameraView, setCameraView,

    loadProject
  } = useStore();

  const handleExport = () => {
    setExporting(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadProject(json);
      } catch (err) {
        console.error('Failed to load project', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="h-12 bg-editor-panel border-b border-editor-border flex items-center justify-between px-4 select-none z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-editor-accent font-bold text-lg tracking-tight">
          <Box size={20} />
          <span>FREDESS <span className="text-editor-muted font-normal text-xs align-top">ENGINE</span></span>
        </div>

        <div className="h-6 w-px bg-editor-border mx-2" />

        <div className="flex items-center gap-1 bg-editor-bg rounded p-1">
           <button
             onClick={() => setCameraView(false)}
             aria-pressed={!isCameraView}
             className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none ${!isCameraView ? 'bg-editor-panel text-white shadow-sm' : 'text-editor-muted hover:text-white'}`}
           >
             <Box size={14} /> Editor
           </button>
           <button
             onClick={() => setCameraView(true)}
             aria-pressed={isCameraView}
             className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none ${isCameraView ? 'bg-editor-accent text-black shadow-sm' : 'text-editor-muted hover:text-white'}`}
           >
             <Video size={14} /> Camera
           </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
            >
                <Layers size={14} /> Load JSON
            </button>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
              tabIndex={-1}
            />
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            aria-busy={isExporting}
            aria-label={isExporting ? "Exporting Video..." : "Export Video"}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-editor-accent/20 focus-visible:ring-2 focus-visible:ring-editor-accent focus-visible:outline-none"
          >
            {isExporting ? <span className="animate-spin">⟳</span> : <Download size={16} />}
            <span>Export Video</span>
          </button>
      </div>
    </header>
  );
};

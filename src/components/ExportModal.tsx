import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, X, Video } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { exportSettings, setExportSettings, setExporting, isExporting } = useStore();
  const [localSettings, setLocalSettings] = useState(exportSettings);

  const handleStart = () => {
    setExportSettings(localSettings);
    setExporting(true);
    // onClose(); // Don't close, let it show progress overlay
  };

  if (isExporting) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-editor-accent mb-4"></div>
        <h2 className="text-xl font-bold text-editor-accent animate-pulse">Rendering Movie...</h2>
        <p className="text-editor-muted text-sm mt-2">Please wait while we capture your masterpiece.</p>
        <p className="text-xs text-editor-muted mt-4 font-mono">Do not switch tabs.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-editor-panel border border-editor-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
         <div className="flex items-center justify-between p-4 border-b border-editor-border bg-editor-bg">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Download size={20} className="text-editor-accent" />
                Export Settings
            </h2>
            <button
              onClick={onClose}
              className="text-editor-muted hover:text-white transition-colors"
              aria-label="Close"
            >
                <X size={20} />
            </button>
         </div>

         <div className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-editor-muted uppercase tracking-wider">Resolution</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['720p', '1080p', '4k'].map((res) => (
                            <button
                                key={res}
                                onClick={() => setLocalSettings({ ...localSettings, resolution: res as any })}
                                className={`py-2 px-3 rounded text-sm font-medium border transition-all ${localSettings.resolution === res ? 'bg-editor-accent text-black border-editor-accent shadow-lg shadow-editor-accent/20' : 'bg-editor-input text-editor-text border-transparent hover:border-editor-border'}`}
                            >
                                {res}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-editor-muted uppercase tracking-wider">Frame Rate</label>
                    <select
                        value={localSettings.fps}
                        onChange={(e) => setLocalSettings({ ...localSettings, fps: parseInt(e.target.value) })}
                        className="bg-editor-input border border-transparent rounded px-3 py-2 text-sm text-editor-text outline-none focus:border-editor-accent"
                    >
                        <option value="24">24 fps (Cinematic)</option>
                        <option value="30">30 fps (Standard)</option>
                        <option value="60">60 fps (Smooth)</option>
                    </select>
                </div>

                <div className="pt-4 border-t border-editor-border flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="titleCheck"
                            checked={localSettings.includeTitle}
                            onChange={(e) => setLocalSettings({ ...localSettings, includeTitle: e.target.checked })}
                            className="rounded border-editor-border bg-editor-input text-editor-accent focus:ring-editor-accent"
                        />
                        <label htmlFor="titleCheck" className="text-sm text-editor-text cursor-pointer select-none">Include Title Card</label>
                    </div>

                    {localSettings.includeTitle && (
                        <div className="pl-6 flex flex-col gap-2 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Movie Title"
                                value={localSettings.title}
                                onChange={(e) => setLocalSettings({ ...localSettings, title: e.target.value })}
                                className="bg-editor-input border border-transparent rounded px-3 py-2 text-xs text-editor-text outline-none focus:border-editor-accent"
                            />
                            <input
                                type="text"
                                placeholder="Subtitle / Director"
                                value={localSettings.subtitle}
                                onChange={(e) => setLocalSettings({ ...localSettings, subtitle: e.target.value })}
                                className="bg-editor-input border border-transparent rounded px-3 py-2 text-xs text-editor-text outline-none focus:border-editor-accent"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleStart}
                    className="mt-4 w-full bg-editor-accent hover:bg-emerald-400 text-black py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-editor-accent/20"
                >
                    <Video size={18} />
                    START EXPORT
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Download, Share2, Film, Check } from 'lucide-react';

export const ExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const isExporting = useStore(s => s.isExporting);
    const setExporting = useStore(s => s.setExporting);
    const exportSettings = useStore(s => s.exportSettings);
    const setExportSettings = useStore(s => s.setExportSettings);
    const lastExportUrl = useStore(s => s.lastExportUrl);
    const setLastExportUrl = useStore(s => s.setLastExportUrl);
    const currentTime = useStore(s => s.currentTime);
    const duration = useStore(s => s.duration);

    const [localSettings, setLocalSettings] = useState(exportSettings);

    // Sync local settings to store when they change
    useEffect(() => {
        setExportSettings(localSettings);
    }, [localSettings, setExportSettings]);

    const handleStart = () => {
        setExporting(true);
    };

    const handleDownload = () => {
        if (lastExportUrl) {
            const a = document.createElement('a');
            a.href = lastExportUrl;
            a.download = `movie_${Date.now()}.webm`;
            a.click();
        }
    };

    const handleClose = () => {
        if (isExporting) return; // Can't close while exporting
        setLastExportUrl(null); // Clear result
        onClose();
    };

    if (isExporting) {
        const progress = Math.min(100, (currentTime / duration) * 100);
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-slate-900 border border-brand-green/30 p-8 rounded-lg w-96 text-center shadow-2xl">
                    <div className="animate-pulse mb-4 flex justify-center text-brand-green">
                        <Film size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Rendering Movie...</h2>
                    <p className="text-slate-400 text-sm mb-6">Please wait while we capture your scene frame by frame.</p>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-brand-green transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-right text-xs font-mono text-brand-green">
                        {progress.toFixed(0)}%
                    </div>
                </div>
            </div>
        );
    }

    if (lastExportUrl) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-slate-900 border border-brand-green p-6 rounded-lg w-[480px] shadow-2xl relative">
                    <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Check className="text-brand-green" /> Export Complete!
                    </h2>

                    <div className="aspect-video bg-black rounded overflow-hidden mb-6 border border-slate-800">
                        <video src={lastExportUrl} controls className="w-full h-full" />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-brand-green hover:bg-brand-green/90 text-slate-900 py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download size={18} /> DOWNLOAD .WEBM
                        </button>
                        {/* Share button placeholder */}
                        <button
                            onClick={() => alert("Sharing not implemented in MVP")}
                            className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold flex items-center gap-2 transition-colors"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg w-[400px] shadow-xl relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    🎬 Export Settings
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Resolution</label>
                        <select
                            value={localSettings.resolution}
                            onChange={(e) => setLocalSettings({ ...localSettings, resolution: e.target.value as any })}
                            className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white outline-none focus:border-brand-green"
                        >
                            <option value="720p">HD (720p) - Fast</option>
                            <option value="1080p">Full HD (1080p) - Balanced</option>
                            <option value="4k">4K Ultra HD - High Quality</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Frame Rate</label>
                        <select
                            value={localSettings.fps}
                            onChange={(e) => setLocalSettings({ ...localSettings, fps: parseInt(e.target.value) })}
                            className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white outline-none focus:border-brand-green"
                        >
                            <option value="24">24 fps (Cinematic)</option>
                            <option value="30">30 fps (Standard)</option>
                            <option value="60">60 fps (Smooth)</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="titleCheck"
                                checked={localSettings.includeTitle}
                                onChange={(e) => setLocalSettings({ ...localSettings, includeTitle: e.target.checked })}
                                className="rounded border-slate-700 bg-slate-800 text-brand-green"
                            />
                            <label htmlFor="titleCheck" className="text-sm text-white cursor-pointer">Include Title Card</label>
                        </div>

                        {localSettings.includeTitle && (
                            <div className="pl-6 flex flex-col gap-2 animate-slide-down">
                                <input
                                    type="text"
                                    placeholder="Movie Title"
                                    value={localSettings.title}
                                    onChange={(e) => setLocalSettings({ ...localSettings, title: e.target.value })}
                                    className="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-brand-green"
                                />
                                <input
                                    type="text"
                                    placeholder="Subtitle / Director"
                                    value={localSettings.subtitle}
                                    onChange={(e) => setLocalSettings({ ...localSettings, subtitle: e.target.value })}
                                    className="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-brand-green"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStart}
                        className="mt-4 w-full bg-brand-green hover:bg-brand-green/90 text-slate-900 py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        START EXPORT
                    </button>
                </div>
            </div>
        </div>
    );
};

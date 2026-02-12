import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MainLayout } from './components/layout/MainLayout';
import { AssetLibrary } from './components/AssetLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Timeline } from './components/Timeline';
import { SceneManager } from './engine/SceneManager';
import { PlaybackController } from './engine/PlaybackController';
import { AudioEngine } from './engine/AudioEngine';
import { VideoExporter } from './engine/VideoExporter';
import { ScriptConsole } from './components/ScriptConsole';
import { ExportModal } from './components/ExportModal';
import { useStore } from './store/useStore';

function App() {
  const isExporting = useStore((state) => state.isExporting);


  const [showScriptConsole, setShowScriptConsole] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Note: Header handles Export/Load actions now
  // We need to sync showExportModal state or move it to store?
  // Current Header sets isExporting directly for "Export Video".
  // But maybe we want the modal first?
  // Let's assume Header button triggers "Export Video" directly for now or opens modal?
  // The existing Header.tsx calls setExporting(true).

  // Viewport Content
  const Viewport = (
    <>
        <Canvas shadows dpr={isExporting ? 1 : [1, 2]} gl={{ preserveDrawingBuffer: true }} className="w-full h-full block">
            <color attach="background" args={['#000']} />
            <PlaybackController />
            <SceneManager />
            <AudioEngine />
            <VideoExporter />
        </Canvas>

        {/* Overlays */}
        {showScriptConsole && <ScriptConsole onClose={() => setShowScriptConsole(false)} />}
        {(isExporting || showExportModal) && <ExportModal onClose={() => setShowExportModal(false)} />}
    </>
  );

  return (
    <MainLayout
      sidebar={<AssetLibrary />}
      viewport={Viewport}
      properties={<PropertiesPanel />}
      timeline={<Timeline />}
    />
  );
}

export default App;

import React from 'react';
import { Header } from '../Header';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  viewport: React.ReactNode;
  properties: React.ReactNode;
  timeline: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, viewport, properties, timeline }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-editor-bg overflow-hidden text-editor-text">
      {/* Global Header */}
      <Header />

      {/* Main Workspace (Top) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Asset Library) */}
        <div className="w-80 flex-shrink-0 border-r border-editor-border bg-editor-panel flex flex-col z-20">
          {sidebar}
        </div>

        {/* Center (Viewport) */}
        <div className="flex-1 relative bg-black flex flex-col min-w-0 z-10">
           {viewport}
        </div>

        {/* Right Sidebar (Properties) */}
        <div className="w-80 flex-shrink-0 border-l border-editor-border bg-editor-panel flex flex-col z-20 overflow-y-auto custom-scrollbar">
          {properties}
        </div>
      </div>

      {/* Bottom Workspace (Timeline) */}
      <div className="h-80 flex-shrink-0 border-t border-editor-border bg-editor-panel flex flex-col z-30">
        {timeline}
      </div>
    </div>
  );
};

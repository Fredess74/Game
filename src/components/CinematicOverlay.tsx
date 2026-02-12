import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import type { Overlay } from '../types';

export const CinematicOverlay: React.FC = () => {
    const overlays = useStore(state => state.overlays);
    const currentTime = useStore(state => state.currentTime);

    const activeOverlays = useMemo(() => {
        return overlays.filter(o =>
            currentTime >= o.startTime &&
            currentTime < (o.startTime + o.duration)
        );
    }, [overlays, currentTime]);

    if (activeOverlays.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden flex flex-col justify-center items-center">
            {activeOverlays.map(overlay => {
                const progress = (currentTime - overlay.startTime) / overlay.duration;

                // Text Overlay
                if (overlay.type === 'text') {
                    // Simple fade in/out for text
                    let opacity = 1;
                    const fadeDuration = 0.5; // seconds

                    // Fade In
                    if (currentTime - overlay.startTime < fadeDuration) {
                        opacity = (currentTime - overlay.startTime) / fadeDuration;
                    }
                    // Fade Out
                    else if ((overlay.startTime + overlay.duration) - currentTime < fadeDuration) {
                        opacity = ((overlay.startTime + overlay.duration) - currentTime) / fadeDuration;
                    }

                    const isBottom = overlay.style?.position === 'bottom';
                    const isTop = overlay.style?.position === 'top';

                    return (
                        <div
                            key={overlay.id}
                            className={`absolute w-full text-center p-12 transition-opacity duration-75 ${
                                isBottom ? 'bottom-0 pb-20' : isTop ? 'top-0 pt-20' : 'top-1/2 -translate-y-1/2'
                            }`}
                            style={{ opacity }}
                        >
                            <h1
                                className="font-bold text-white drop-shadow-lg"
                                style={{
                                    fontSize: overlay.style?.fontSize || 48,
                                    color: overlay.style?.color || 'white',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                }}
                            >
                                {overlay.text}
                            </h1>
                        </div>
                    );
                }

                // Fades
                if (overlay.type === 'fade_black' || overlay.type === 'fade_white') {
                     // Default: Fade Out (0 -> 1)
                     // If we want different behaviors, we'd need more types.
                     // For now, let's assume 'fade_black' means "Transition to Black"
                     const opacity = Math.min(Math.max(progress, 0), 1);
                     const color = overlay.type === 'fade_black' ? 'black' : 'white';

                     return (
                         <div
                            key={overlay.id}
                            className="absolute inset-0 w-full h-full"
                            style={{ backgroundColor: color, opacity }}
                         />
                     );
                }

                return null;
            })}
        </div>
    );
};

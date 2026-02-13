import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, Hud, OrthographicCamera } from '@react-three/drei';
import { useStore } from '../store/useStore';

const SimpleTitleCard = ({ title, subtitle, opacity }: { title: string, subtitle: string, opacity: number }) => {
    const { viewport } = useThree();
    return (
        <Hud renderPriority={2}>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} left={-viewport.width/2} right={viewport.width/2} top={viewport.height/2} bottom={-viewport.height/2} />
             <mesh position={[0, 0, -1]}>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <meshBasicMaterial color="#000000" transparent opacity={opacity} />
            </mesh>
            <Text
                position={[0, 1, 0]}
                fontSize={viewport.width * 0.05}
                color="white"
                anchorX="center"
                anchorY="bottom"
                fillOpacity={opacity}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                {title.toUpperCase()}
            </Text>
            <Text
                position={[0, -0.5, 0]}
                fontSize={viewport.width * 0.02}
                color="#4ade80"
                anchorX="center"
                anchorY="top"
                fillOpacity={opacity}
                 font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                {subtitle}
            </Text>
        </Hud>
    )
}

export const VideoExporter: React.FC = () => {
    const { gl } = useThree();
    const isExporting = useStore(s => s.isExporting);
    const setExporting = useStore(s => s.setExporting);
    const duration = useStore(s => s.timeline.duration);
    const currentTime = useStore(s => s.currentTime);
    const setPlaying = useStore(s => s.setPlaying);
    const setTime = useStore(s => s.setTime);
    const setCameraView = useStore(s => s.setCameraView);
    const exportSettings = useStore(s => s.exportSettings);
    const setLastExportUrl = useStore(s => s.setLastExportUrl);

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const [titleOpacity, setTitleOpacity] = useState(0);

    // Title Card Logic
    useFrame(() => {
        if (isExporting && exportSettings.includeTitle) {
            // Fade in 0-0.5s, Hold 0.5-1.5s, Fade out 1.5-2s
            if (currentTime < 0.5) setTitleOpacity(currentTime / 0.5);
            else if (currentTime < 1.5) setTitleOpacity(1);
            else if (currentTime < 2) setTitleOpacity(1 - (currentTime - 1.5) / 0.5);
            else setTitleOpacity(0);
        } else {
            setTitleOpacity(0);
        }

        // Auto-stop logic moved from component body to here to be safe
        if (isExporting && currentTime >= duration - 0.1) {
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                mediaRecorder.current.stop();
            }
            // Logic handled in onstop
        }
    });

    useEffect(() => {
        if (isExporting) {
            console.log("Starting Export...", exportSettings);

            // 2. Setup Scene
            setCameraView(true);
            setTime(0);
            setPlaying(false); // Pause first

            // 3. Start Recording after delay
            const timer = setTimeout(() => {
                const stream = gl.domElement.captureStream(exportSettings.fps);
                const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                                ? 'video/webm;codecs=vp9'
                                : 'video/webm';

                mediaRecorder.current = new MediaRecorder(stream, {
                    mimeType,
                    videoBitsPerSecond: exportSettings.resolution === '4k' ? 25000000 : 8000000 // Higher bitrate for 4K
                });

                mediaRecorder.current.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.current.push(e.data);
                };

                mediaRecorder.current.onstop = () => {
                    const blob = new Blob(chunks.current, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);

                    setLastExportUrl(url); // Save URL for modal
                    chunks.current = [];

                    // Reset State
                    setExporting(false);
                    setPlaying(false);
                    setCameraView(false);
                };

                mediaRecorder.current.start();
                setPlaying(true);
            }, 1000); // 1s delay to stabilize resizing

            return () => clearTimeout(timer);
        }
    }, [isExporting]); // Run when isExporting changes

    if (!isExporting) return null;

    return (
        <>
            {exportSettings.includeTitle && titleOpacity > 0 && (
                <SimpleTitleCard
                    title={exportSettings.title}
                    subtitle={exportSettings.subtitle}
                    opacity={titleOpacity}
                />
            )}
        </>
    );
};

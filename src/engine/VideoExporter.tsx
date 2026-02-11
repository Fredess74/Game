import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';

export const VideoExporter = () => {
    const { gl } = useThree();
    const isExporting = useStore(s => s.isExporting);
    const setExporting = useStore(s => s.setExporting);
    const duration = useStore(s => s.duration);
    const currentTime = useStore(s => s.currentTime);
    const setPlaying = useStore(s => s.setPlaying);
    const setTime = useStore(s => s.setTime);
    const setCameraView = useStore(s => s.setCameraView);

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    useEffect(() => {
        if (isExporting) {
            console.log("Starting Export...");
            setCameraView(true);
            setTime(0);

            // Delay to allow scene to update
            const timer = setTimeout(() => {
                const stream = gl.domElement.captureStream(60);

                try {
                    mediaRecorder.current = new MediaRecorder(stream, {
                        mimeType: 'video/webm;codecs=vp9'
                    });
                } catch {
                    console.warn("VP9 not supported, trying default");
                    mediaRecorder.current = new MediaRecorder(stream);
                }

                mediaRecorder.current.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.current.push(e.data);
                };

                mediaRecorder.current.onstop = () => {
                    const blob = new Blob(chunks.current, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `movie_${Date.now()}.webm`;
                    a.click();
                    chunks.current = [];
                };

                mediaRecorder.current.start();
                setPlaying(true);
            }, 500);

            return () => clearTimeout(timer);
        } else {
             if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                 mediaRecorder.current.stop();
                 setPlaying(false);
             }
        }
    }, [isExporting, gl, setCameraView, setPlaying, setTime]);

    useFrame(() => {
        if (isExporting) {
            if (currentTime >= duration - 0.1) {
                setExporting(false);
            }
        }
    });

    return null;
};

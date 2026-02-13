import React, { useRef, useMemo, useEffect } from 'react';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import type { Actor, CameraCut } from '../types';

const CameraHelperVisual: React.FC<{ cameraActor: Actor; isSelected: boolean; onClick: (e: any) => void }> = ({ cameraActor, isSelected, onClick }) => {
    return (
        <group
            position={cameraActor.transform.position}
            rotation={cameraActor.transform.rotation}
            onClick={onClick}
        >
            {/* Camera Body */}
            <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial color={isSelected ? "#ef4444" : "#ffffff"} wireframe />
            </mesh>

            {/* Lens */}
            <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            <Html position={[0, 0.8, 0]} center>
                <div className="bg-black/50 text-white text-[10px] px-1 rounded whitespace-nowrap font-mono">
                    {cameraActor.name}
                </div>
            </Html>

            {/* View Cone Hint */}
            {isSelected && (
                <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
                    <coneGeometry args={[1, 4, 4, 1, true]} />
                    <meshBasicMaterial color="yellow" wireframe transparent opacity={0.2} />
                </mesh>
            )}
        </group>
    );
};

export const CameraManager: React.FC = () => {
    const isCameraView = useStore(s => s.isCameraView);
    const actors = useStore(s => s.actors);
    const cameraTrack = useStore(s => s.timeline.cameraTrack);
    const currentTime = useStore(s => s.currentTime);
    const selectedId = useStore(s => s.selectedId);
    const setSelected = useStore(s => s.setSelected);

    const cameraActors = useMemo(() => actors.filter(a => a.type === 'camera'), [actors]);

    // Determine active cut
    const activeCut = useMemo(() => {
        // Find the last cut that is <= currentTime
        let active: CameraCut | null = null;
        for (const cut of cameraTrack) {
            if (cut.time <= currentTime) {
                active = cut;
            } else {
                break; // Assumes sorted by time
            }
        }
        return active;
    }, [cameraTrack, currentTime]);

    const activeCameraId = activeCut ? activeCut.cameraId : (cameraActors.length > 0 ? cameraActors[0]?.id : null);
    const activeCameraActor = cameraActors.find(a => a.id === activeCameraId);

    // Type guard / safe access
    const camProps = activeCameraActor && activeCameraActor.type === 'camera' ? (activeCameraActor as any).properties : {};

    // Ref for the active camera
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const { set } = useThree();

    // Sync camera every frame to follow actor
    useFrame(() => {
        if (isCameraView && activeCameraActor && cameraRef.current) {
            const cam = cameraRef.current;
            const pos = activeCameraActor.transform.position;
            const rot = activeCameraActor.transform.rotation;

            cam.position.set(pos[0], pos[1], pos[2]);

            // Handle LookAt
            const lookAt = camProps.lookAt;
            if (lookAt) {
                const targetPos = new THREE.Vector3();
                if (typeof lookAt === 'string') {
                    // Look at actor ID
                    const targetActor = actors.find(a => a.id === lookAt);
                    if (targetActor) {
                        const tPos = targetActor.transform.position;
                        targetPos.set(tPos[0], tPos[1], tPos[2]);
                    }
                } else if (Array.isArray(lookAt)) {
                    // Static point [x,y,z]
                    targetPos.set(lookAt[0], lookAt[1], lookAt[2]);
                }
                cam.lookAt(targetPos);
            } else {
                // Use explicit rotation if no lookAt
                cam.rotation.set(rot[0], rot[1], rot[2]);
            }

            cam.updateProjectionMatrix();
        }
    });

    // Set default camera when entering camera view
    useEffect(() => {
        if (isCameraView && cameraRef.current) {
            set({ camera: cameraRef.current });
        } else {
            // Revert to OrbitControls camera? Usually OrbitControls handles this by 'makeDefault'
        }
    }, [isCameraView, set]);

    return (
        <>
            {isCameraView && activeCameraActor ? (
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    fov={camProps.fov || 50}
                    near={camProps.near || 0.1}
                    far={camProps.far || 1000}
                />
            ) : (
                <>
                    <OrbitControls makeDefault />
                    {/* Render helpers */}
                    {cameraActors.map(cam => (
                        <CameraHelperVisual
                            key={cam.id}
                            cameraActor={cam}
                            isSelected={selectedId === cam.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected(cam.id);
                            }}
                        />
                    ))}
                </>
            )}
        </>
    );
};

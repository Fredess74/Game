import React, { useRef, useMemo } from 'react';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import type { Actor } from '../types';

const CameraHelperVisual: React.FC<{ cameraActor: Actor; isSelected: boolean; onClick: (e: any) => void }> = ({ cameraActor, isSelected, onClick }) => {
    return (
        <group
            position={[cameraActor.position.x, cameraActor.position.y, cameraActor.position.z]}
            rotation={[cameraActor.rotation.x, cameraActor.rotation.y, cameraActor.rotation.z]}
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
    const cameraCuts = useStore(s => s.cameraCuts);
    const currentTime = useStore(s => s.currentTime);
    const selectedId = useStore(s => s.selectedId);
    const setSelected = useStore(s => s.setSelected);

    const cameraActors = useMemo(() => actors.filter(a => a.type === 'camera'), [actors]);

    // Determine active camera based on cuts
    const activeCut = useMemo(() => {
        const sortedCuts = [...cameraCuts].sort((a, b) => a.time - b.time);
        let active = null;
        for (const cut of sortedCuts) {
            if (cut.time <= currentTime) {
                active = cut;
            } else {
                break;
            }
        }
        return active;
    }, [cameraCuts, currentTime]);

    const activeCameraId = activeCut ? activeCut.cameraId : (cameraActors.length > 0 ? cameraActors[0].id : null);
    const activeCameraActor = cameraActors.find(a => a.id === activeCameraId);

    // Ref for the active camera to update lookAt
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    // Cache the index of the lookAt target actor to avoid O(N) search every frame
    const lookAtTargetIndexRef = useRef<number>(-1);

    useFrame(() => {
        if (isCameraView && activeCameraActor && cameraRef.current) {
            const cam = cameraRef.current;
            cam.position.set(activeCameraActor.position.x, activeCameraActor.position.y, activeCameraActor.position.z);

            if (activeCameraActor.lookAt) {
                let targetPos = new THREE.Vector3(0, 0, 0);
                if (typeof activeCameraActor.lookAt === 'string') {
                    // Look at actor
                    const targetId = activeCameraActor.lookAt;
                    let targetActor: Actor | undefined;

                    // Optimistic lookup: Check if the cached index still points to the correct actor
                    // This is O(1) in the steady state (playback), versus O(N) for .find()
                    if (
                        lookAtTargetIndexRef.current !== -1 &&
                        actors[lookAtTargetIndexRef.current]?.id === targetId
                    ) {
                        targetActor = actors[lookAtTargetIndexRef.current];
                    } else {
                        // Cache miss or invalid: Search and update cache
                        const idx = actors.findIndex(a => a.id === targetId);
                        if (idx !== -1) {
                            lookAtTargetIndexRef.current = idx;
                            targetActor = actors[idx];
                        } else {
                            lookAtTargetIndexRef.current = -1;
                        }
                    }

                    if (targetActor) {
                        targetPos.set(targetActor.position.x, targetActor.position.y, targetActor.position.z);
                    }
                } else if (typeof activeCameraActor.lookAt === 'object') {
                    // Static point
                    const p = activeCameraActor.lookAt as any; // {x,y,z}
                    targetPos.set(p.x, p.y, p.z);
                }
                cam.lookAt(targetPos);
            } else {
                // Use rotation if no lookAt
                cam.rotation.set(activeCameraActor.rotation.x, activeCameraActor.rotation.y, activeCameraActor.rotation.z);
            }

            cam.updateProjectionMatrix();
        }
    });

    return (
        <>
            {isCameraView && activeCameraActor ? (
                <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    fov={activeCameraActor.fov || 50}
                    near={0.1}
                    far={1000}
                />
            ) : (
                <>
                    <OrbitControls makeDefault />

                    {/* Render all cameras as helpers */}
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

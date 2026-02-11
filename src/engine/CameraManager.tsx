import React, { useRef } from 'react';
import { PerspectiveCamera, TransformControls } from '@react-three/drei';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export const CameraManager: React.FC = () => {
    const isCameraView = useStore(s => s.isCameraView);
    const actors = useStore(s => s.actors);
    const cameraActor = actors.find(a => a.id === 'main-camera');
    const selectedId = useStore(s => s.selectedId);
    const setSelected = useStore(s => s.setSelected);
    const updateActor = useStore(s => s.updateActor);

    const groupRef = useRef<THREE.Group>(null);

    if (!cameraActor) return null;

    const isSelected = selectedId === cameraActor.id;

    const handleClick = (e: any) => {
        e.stopPropagation();
        setSelected(cameraActor.id);
    };

    const onTransformEnd = () => {
        if (groupRef.current) {
            const { position, rotation, scale } = groupRef.current;
            updateActor(cameraActor.id, {
                position: { x: position.x, y: position.y, z: position.z },
                rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
                scale: { x: scale.x, y: scale.y, z: scale.z },
            });
        }
    };

    return (
        <>
            {isCameraView ? (
                <PerspectiveCamera
                    makeDefault
                    position={[cameraActor.position.x, cameraActor.position.y, cameraActor.position.z]}
                    rotation={[cameraActor.rotation.x, cameraActor.rotation.y, cameraActor.rotation.z]}
                    fov={50}
                />
            ) : (
                <>
                    <group
                        ref={groupRef}
                        position={[cameraActor.position.x, cameraActor.position.y, cameraActor.position.z]}
                        rotation={[cameraActor.rotation.x, cameraActor.rotation.y, cameraActor.rotation.z]}
                        onClick={handleClick}
                    >
                        {/* Camera Body */}
                        <mesh rotation={[0, Math.PI, 0]}>
                            <boxGeometry args={[0.5, 0.5, 0.8]} />
                            <meshStandardMaterial color={isSelected ? "#ef4444" : "#ffffff"} wireframe />
                        </mesh>

                        {/* Lens */}
                        <mesh position={[0, 0, -0.4]} rotation={[Math.PI/2, 0, 0]}>
                             <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                             <meshStandardMaterial color="#333" />
                        </mesh>

                        {/* View Cone Hint */}
                        {isSelected && (
                             <mesh position={[0, 0, -2]} rotation={[Math.PI/2, 0, 0]}>
                                 <coneGeometry args={[1, 4, 4, 1, true]} />
                                 <meshBasicMaterial color="yellow" wireframe transparent opacity={0.2} />
                             </mesh>
                        )}
                    </group>

                    {isSelected && (
                        <TransformControls
                            object={groupRef as any}
                            mode="translate"
                            onMouseUp={onTransformEnd}
                        />
                    )}
                </>
            )}
        </>
    );
};

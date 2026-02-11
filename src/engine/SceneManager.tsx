import React, { useRef } from 'react';
import { TransformControls, OrbitControls, Grid } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { SceneObject } from './SceneObject';
import { CameraManager } from './CameraManager';
import * as THREE from 'three';

// Wrapper to handle TransformControls locally
const SceneObjectWrapper = ({ actor }: { actor: any }) => {
    const selectedId = useStore((state) => state.selectedId);
    const updateActor = useStore((state) => state.updateActor);
    const isSelected = selectedId === actor.id;
    const groupRef = useRef<THREE.Group>(null);

    const onTransformEnd = () => {
        if (groupRef.current) {
            const { position, rotation, scale } = groupRef.current;
            updateActor(actor.id, {
                position: { x: position.x, y: position.y, z: position.z },
                rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
                scale: { x: scale.x, y: scale.y, z: scale.z },
            });
        }
    };

    return (
        <>
            <group
                ref={groupRef}
                position={[actor.position.x, actor.position.y, actor.position.z]}
                rotation={[actor.rotation.x, actor.rotation.y, actor.rotation.z]}
                scale={[actor.scale.x, actor.scale.y, actor.scale.z]}
            >
                <SceneObject actor={actor} />
            </group>

            {isSelected && (
                <TransformControls
                    object={groupRef as any}
                    mode="translate"
                    onMouseUp={onTransformEnd}
                />
            )}
        </>
    );
};

export const SceneManager: React.FC = () => {
  const actors = useStore((state) => state.actors);
  const setSelected = useStore((state) => state.setSelected);
  const isCameraView = useStore((state) => state.isCameraView);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const gridVisible = useStore((state) => state.gridVisible);

  const sceneActors = actors.filter(a => a.type !== 'camera');

  const handleBackgroundClick = () => {
    setSelected(null);
  };

  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {gridVisible && <Grid infiniteGrid sectionColor="#4ade80" cellColor="#ffffff" fadeDistance={30} position={[0, -0.01, 0]} />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={handleBackgroundClick}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <CameraManager />

      {sceneActors.map((actor) => (
        <SceneObjectWrapper key={actor.id} actor={actor} />
      ))}

      {!isCameraView && <OrbitControls makeDefault />}
    </>
  );
};

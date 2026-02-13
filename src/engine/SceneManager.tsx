import React, { useRef, useMemo } from 'react';
import { TransformControls, Grid } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { SceneObject } from './SceneObject';
import { CameraManager } from './CameraManager';
import * as THREE from 'three';
import type { Actor, Vector3 } from '../types';

// Wrapper to handle TransformControls locally
const SceneObjectWrapper: React.FC<{ actor: Actor }> = ({ actor }) => {
    const selectedId = useStore((state) => state.selectedId);
    const updateActor = useStore((state) => state.updateActor);
    const setSelected = useStore((state) => state.setSelected);

    const isSelected = selectedId === actor.id;
    const groupRef = useRef<THREE.Group>(null);
    const controlRef = useRef<any>(null);

    const onTransformEnd = () => {
        if (groupRef.current) {
            const { position, rotation, scale } = groupRef.current;
            updateActor(actor.id, {
                transform: {
                    position: [position.x, position.y, position.z] as Vector3,
                    rotation: [rotation.x, rotation.y, rotation.z] as Vector3,
                    scale: [scale.x, scale.y, scale.z] as Vector3,
                }
            });
        }
    };

    // Convert Euler to tuple for r3f if needed, but r3f accepts array
    // actor.transform.rotation is [x,y,z]

    return (
        <>
            <group
                ref={groupRef}
                position={actor.transform.position}
                rotation={actor.transform.rotation}
                scale={actor.transform.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelected(actor.id);
                }}
            >
                <SceneObject actor={actor} />
            </group>

            {isSelected && (
                <TransformControls
                    ref={controlRef}
                    object={groupRef}
                    mode="translate" // Could expose mode to UI later
                    onMouseUp={onTransformEnd}
                />
            )}
        </>
    );
};

export const SceneManager: React.FC = () => {
  const actors = useStore((state) => state.actors);
  const selectedId = useStore((state) => state.selectedId);
  const setSelected = useStore((state) => state.setSelected);
  const isCameraView = useStore((state) => state.isCameraView);
  const environment = useStore((state) => state.environment);

  // Filter out cameras (they are handled by CameraManager)
  // Also, lights are actors now, so we render them via SceneObjectWrapper which calls SceneObject
  // SceneObject handles rendering <pointLight> etc.
  // So we just filter out cameras.
  const sceneActors = useMemo(() => actors.filter(a => a.type !== 'camera'), [actors]);

  const handleBackgroundClick = (e: any) => {
    // Only deselect if clicking background directly
    e.stopPropagation();
    setSelected(null);
  };

  return (
    <>
      <color attach="background" args={[environment.skyColor || '#1e293b']} />

      {environment.fog && (
          <fog attach="fog" args={[environment.fog.color, environment.fog.near, environment.fog.far]} />
      )}

      <ambientLight
        intensity={environment.ambientLight.intensity}
        color={environment.ambientLight.color}
      />

      {environment.sun && (
          <directionalLight
             position={environment.sun.position}
             intensity={environment.sun.intensity}
             color={environment.sun.color}
             castShadow
          />
      )}

      <Grid infiniteGrid sectionColor="#4ade80" cellColor="#ffffff" fadeDistance={30} position={[0, -0.01, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={handleBackgroundClick}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <CameraManager />

      {sceneActors.map((actor) => (
        <SceneObjectWrapper key={actor.id} actor={actor} />
      ))}
    </>
  );
};

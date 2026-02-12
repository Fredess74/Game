import React, { useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { SceneObject } from './SceneObject';
import { CameraManager } from './CameraManager';
import { Ground } from './Environment/Ground';
import { Sky } from './Environment/Sky';
import { Weather } from './Environment/Weather';
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
                    mode="translate" // Could expose mode to UI later
                    onMouseUp={onTransformEnd}
                />
            )}
        </>
    );
};

export const SceneManager: React.FC = () => {
  const actors = useStore((state) => state.actors);
  const ambientLightIntensity = useStore((state) => state.ambientLightIntensity);
  const ambientLightColor = useStore((state) => state.ambientLightColor);
  const fog = useStore((state) => state.fog);

  // Filter out cameras (they are handled by CameraManager)
  const sceneActors = actors.filter(a => a.type !== 'camera');

  return (
    <>
      <Sky />

      {fog && <fog attach="fog" args={[fog.color, fog.near, fog.far]} />}

      <ambientLight intensity={ambientLightIntensity} color={ambientLightColor} />

      <Ground />

      <Weather />

      <CameraManager />

      {sceneActors.map((actor) => (
        <SceneObjectWrapper key={actor.id} actor={actor} />
      ))}
    </>
  );
};

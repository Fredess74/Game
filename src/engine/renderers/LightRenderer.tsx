import React from 'react';
import { Html } from '@react-three/drei';
import type { ActorRendererProps } from '../registry/ActorRegistry';
import { useStore } from '../../store/useStore';

export const LightRenderer: React.FC<ActorRendererProps> = ({ actor, onSelect }) => {
  const isCameraView = useStore((state) => state.isCameraView);

  return (
    <group onClick={onSelect}>
        {/* Actual Light */}
        {actor.lightType === 'point' && <pointLight color={actor.color} intensity={actor.intensity ?? 1} castShadow distance={20} decay={2} />}
        {actor.lightType === 'spot' && <spotLight color={actor.color} intensity={actor.intensity ?? 1} castShadow angle={0.5} penumbra={0.5} />}
        {actor.lightType === 'directional' && <directionalLight color={actor.color} intensity={actor.intensity ?? 1} castShadow />}

        {/* Editor Visualizer */}
        {!isCameraView && (
            <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color={actor.color} wireframe />
                <Html position={[0, 0.5, 0]}>
                  <div className="text-[10px] text-yellow-500 font-mono bg-black/50 px-1 rounded">{actor.lightType?.toUpperCase()}</div>
                </Html>
            </mesh>
        )}
    </group>
  );
};

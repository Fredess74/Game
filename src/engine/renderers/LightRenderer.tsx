import React from 'react';
import { Html } from '@react-three/drei';
import type { ActorRendererProps } from '../registry/ActorRegistry';
import { useStore } from '../../store/useStore';
import type { Actor } from '../../types';

export const LightRenderer: React.FC<ActorRendererProps> = ({ actor, onSelect }) => {
  const isCameraView = useStore((state) => state.isCameraView);

  // Safe access
  const props = actor.type === 'light' ? (actor as any).properties : {};
  const type = props.type || 'point';
  const color = props.color || '#ffffff';
  const intensity = props.intensity ?? 1;
  const castShadow = props.castShadow ?? true;

  return (
    <group onClick={onSelect}>
        {type === 'point' && <pointLight color={color} intensity={intensity} castShadow={castShadow} distance={20} decay={2} />}
        {type === 'spot' && <spotLight color={color} intensity={intensity} castShadow={castShadow} angle={0.5} penumbra={0.5} />}
        {type === 'directional' && <directionalLight color={color} intensity={intensity} castShadow={castShadow} />}

        {/* Editor Visualizer */}
        {!isCameraView && (
            <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color={color} wireframe />
                <Html position={[0, 0.5, 0]}>
                  <div className="text-[10px] text-yellow-500 font-mono bg-black/50 px-1 rounded">{type.toUpperCase()}</div>
                </Html>
            </mesh>
        )}
    </group>
  );
};

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { ActorRendererProps } from '../registry/ActorRegistry';
import * as THREE from 'three';

export const ModelRenderer: React.FC<ActorRendererProps> = ({ actor, isSelected, onSelect }) => {
  const props = (actor.type === 'prop' || actor.type === 'model') ? (actor as any).properties : {};
  const url = props.modelUrl;

  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(), [scene]);

  // Apply visual overrides if needed (e.g. selection highlight)
  // Logic similar to ModularCharacter but for props.

  return (
    <group onClick={onSelect}>
      {/* Selection Highlight */}
      {isSelected && (
          <mesh position={[0, 1, 0]}>
              <ringGeometry args={[0.5, 0.6, 32]} />
              <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
          </mesh>
      )}

      <primitive object={clone} />
    </group>
  );
};

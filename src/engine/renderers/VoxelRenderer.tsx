import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { InstancedMesh } from 'three';
import type { ActorRendererProps } from '../registry/ActorRegistry';

export const VoxelRenderer: React.FC<ActorRendererProps> = ({ actor, isSelected, onSelect }) => {
  const meshRef = useRef<InstancedMesh>(null);

  // Placeholder: Render a 3x3x3 grid of voxels
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const temp = new THREE.Object3D();
    let i = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.random() > 0.5) { // Random voxels
            temp.position.set(x * 0.2, y * 0.2, z * 0.2);
            temp.updateMatrix();
            meshRef.current.setMatrixAt(i++, temp.matrix);
          }
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 27]} onClick={onSelect}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={actor.color} wireframe={isSelected} />
    </instancedMesh>
  );
};

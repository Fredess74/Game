import React, { useRef } from 'react';
import { Box, Sphere, Capsule, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { Actor } from '../types';

interface SceneObjectProps {
  actor: Actor;
}

export const SceneObject: React.FC<SceneObjectProps> = ({ actor }) => {
  const meshRef = useRef<THREE.Group>(null);
  const selectedId = useStore((state) => state.selectedId);
  const setSelected = useStore((state) => state.setSelected);
  const isSelected = selectedId === actor.id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelected(actor.id);
  };

  const materialProps = {
    color: isSelected ? '#ef4444' : actor.color,
    metalness: 0.1,
    roughness: 0.8,
  };

  const renderShape = () => {
    if (actor.type === 'sound') {
        return (
            <group onClick={handleClick}>
                 <Box args={[0.5, 0.8, 0.5]} position={[0, 0.4, 0]} castShadow>
                     <meshStandardMaterial color={isSelected ? '#ef4444' : '#222'} />
                 </Box>
                 {/* Speaker Cone */}
                 <mesh position={[0, 0.6, 0.26]} rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.15, 0.05, 0.05, 32]} />
                     <meshStandardMaterial color="#555" />
                 </mesh>
                 <mesh position={[0, 0.25, 0.26]} rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.2, 0.1, 0.05, 32]} />
                     <meshStandardMaterial color="#555" />
                 </mesh>
            </group>
        );
    }

    switch (actor.shape) {
      case 'box':
        return (
          <Box onClick={handleClick} castShadow receiveShadow>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere onClick={handleClick} castShadow receiveShadow>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );
      case 'capsule': // Robot Character
        return (
          <group onClick={handleClick}>
             <group position={[0, 0.75, 0]}>
                 {/* Body */}
                 <Capsule args={[0.3, 0.6, 4, 8]} castShadow receiveShadow>
                      <meshStandardMaterial {...materialProps} />
                 </Capsule>

                 {/* Head */}
                 <mesh position={[0, 0.65, 0]} castShadow>
                      <boxGeometry args={[0.4, 0.35, 0.4]} />
                      <meshStandardMaterial {...materialProps} />
                 </mesh>

                 {/* Eye Visor */}
                 <mesh position={[0, 0.65, 0.21]}>
                      <boxGeometry args={[0.3, 0.1, 0.05]} />
                      <meshStandardMaterial color="#111" roughness={0.2} />
                 </mesh>

                 {/* Arms */}
                 <group position={[0.4, 0.1, 0]} rotation={[0, 0, -0.2]}>
                    <Capsule args={[0.1, 0.4, 4, 8]} castShadow>
                        <meshStandardMaterial {...materialProps} />
                    </Capsule>
                 </group>
                 <group position={[-0.4, 0.1, 0]} rotation={[0, 0, 0.2]}>
                    <Capsule args={[0.1, 0.4, 4, 8]} castShadow>
                        <meshStandardMaterial {...materialProps} />
                    </Capsule>
                 </group>
             </group>
          </group>
        );
      default:
        return (
             <Box onClick={handleClick} args={[0.5, 0.5, 0.5]} castShadow>
                <meshStandardMaterial {...materialProps} wireframe />
             </Box>
        );
    }
  };

  return (
    <group ref={meshRef}>
        {renderShape()}
        {isSelected && (
            <Html position={[0, 2, 0]}>
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap border border-brand-green/50">
                    {actor.name}
                </div>
            </Html>
        )}
    </group>
  );
};

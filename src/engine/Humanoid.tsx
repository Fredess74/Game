import React from 'react';
import { Capsule } from '@react-three/drei';
import type { Actor } from '../types';
import { MaterialComponent } from './MaterialComponent';

interface HumanoidProps {
    actor: Actor;
    isSelected: boolean;
    onClick: (e: any) => void;
}

export const Humanoid: React.FC<HumanoidProps> = ({ actor, isSelected, onClick }) => {
    return (
        <group onClick={onClick}>
             {/* Body */}
             <group position={[0, 0.75, 0]}>
                 <Capsule args={[0.25, 0.6, 4, 8]} castShadow receiveShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                 </Capsule>

                 {/* Head */}
                 <mesh position={[0, 0.65, 0]} castShadow>
                      <sphereGeometry args={[0.2, 16, 16]} />
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                 </mesh>

                 {/* Arms */}
                 <group position={[0.35, 0.1, 0]} rotation={[0, 0, -0.2]}>
                    <Capsule args={[0.08, 0.4, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
                 <group position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.2]}>
                    <Capsule args={[0.08, 0.4, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>

                 {/* Legs */}
                 <group position={[0.15, -0.6, 0]}>
                    <Capsule args={[0.09, 0.5, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
                 <group position={[-0.15, -0.6, 0]}>
                    <Capsule args={[0.09, 0.5, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
             </group>
        </group>
    );
};

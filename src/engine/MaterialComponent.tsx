import React from 'react';
import type { Actor } from '../types';

interface MaterialComponentProps {
  actor: Actor;
  isSelected: boolean;
}

export const MaterialComponent: React.FC<MaterialComponentProps> = ({ actor, isSelected }) => {
    return (
        <meshStandardMaterial
            color={isSelected ? '#ef4444' : actor.color}
            emissive={actor.emissive}
            emissiveIntensity={actor.emissiveIntensity}
            transparent={actor.opacity < 1}
            opacity={actor.opacity}
            metalness={actor.metalness ?? 0.1}
            roughness={actor.roughness ?? 0.8}
            wireframe={false}
        />
    );
};

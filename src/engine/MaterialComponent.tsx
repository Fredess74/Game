import React from 'react';
import type { Actor } from '../types';

interface MaterialProps {
    actor: Actor;
    isSelected: boolean;
}

export const MaterialComponent: React.FC<MaterialProps> = ({ actor, isSelected }) => {
    let color = '#ffffff';
    let roughness = 0.5;
    let metalness = 0.5;
    const emissive = '#000000';
    const emissiveIntensity = 0;

    if (actor.type === 'primitive') {
        const props = (actor as any).properties || {};
        color = props.color || '#ffffff';
        roughness = props.roughness ?? 0.5;
        metalness = props.metalness ?? 0.5;
    } else if (actor.type === 'prop' || actor.type === 'model') {
        const props = (actor as any).properties || {};
        if (props.materialOverride) {
            color = props.materialOverride;
        }
    }

    return (
        <meshStandardMaterial
            color={isSelected ? '#ef4444' : color} // Override color on selection? Or just emissive?
            roughness={roughness}
            metalness={metalness}
            emissive={isSelected ? '#ef4444' : emissive}
            emissiveIntensity={isSelected ? 0.5 : emissiveIntensity}
        />
    );
};

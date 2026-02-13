import React from 'react';
import type { ActorRendererProps } from '../registry/ActorRegistry';

export const VoxelRenderer: React.FC<ActorRendererProps> = ({ actor, onSelect }) => {
    // Basic voxel rendering
    // Assuming properties contain voxel data
    const props = (actor as any).properties || {};
    const data = props.voxelData;

    // Placeholder
    if (!data) return null;

    return (
        <group onClick={onSelect}>
             <mesh>
                 <boxGeometry args={[1, 1, 1]} />
                 <meshStandardMaterial color="#88ff88" wireframe />
             </mesh>
        </group>
    );
};

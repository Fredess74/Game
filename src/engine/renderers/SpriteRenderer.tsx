import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { ActorRendererProps } from '../registry/ActorRegistry';

export const SpriteRenderer: React.FC<ActorRendererProps> = ({ actor, onSelect }) => {
    // Basic sprite rendering
    const props = (actor as any).properties || {};
    const url = props.url;

    if (!url) return null;

    const texture = useLoader(THREE.TextureLoader, url);

    return (
        <sprite onClick={onSelect} scale={[1, 1, 1]}>
            <spriteMaterial map={texture} />
        </sprite>
    );
};

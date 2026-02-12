import React from 'react';
import { Billboard, Image } from '@react-three/drei';
import type { ActorRendererProps } from '../registry/ActorRegistry';

export const SpriteRenderer: React.FC<ActorRendererProps> = ({ actor, isSelected, onSelect }) => {
  if (!actor.sprite?.url) return (
      <Billboard position={[0, 0, 0]} onClick={onSelect}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="magenta" />
      </Billboard>
  );

  return (
    <Billboard
        position={[0, 0, 0]}
        follow={actor.sprite.billboardMode ?? true}
        lockX={false}
        lockY={false}
        lockZ={false}
        onClick={onSelect}
    >
        <Image
            url={actor.sprite.url}
            transparent
            opacity={actor.opacity ?? 1}
            color={isSelected ? '#4ade80' : undefined}
            scale={isSelected ? 1.05 : 1}
        />
    </Billboard>
  );
};

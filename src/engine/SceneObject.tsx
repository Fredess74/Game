import React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import type { Actor } from '../types';
import { getRenderer } from './registry';

interface SceneObjectProps {
  actor: Actor;
}

export const SceneObject: React.FC<SceneObjectProps> = ({ actor }) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const Renderer = React.useMemo(() => getRenderer(actor.type, actor.shape), [actor.type, actor.shape]);
  const selectedId = useStore((state) => state.selectedId);
  const setSelected = useStore((state) => state.setSelected);
  const isCameraView = useStore((state) => state.isCameraView);

  const isSelected = selectedId === actor.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelected(actor.id);
  };

  if (!actor.visible) return null;




  if (!Renderer) {
    console.warn(`No renderer found for actor ${actor.name} (type: ${actor.type}, shape: ${actor.shape})`);
    return null;
  }

  return (
    <group>
        <Renderer
            actor={actor}
            isSelected={isSelected}
            onSelect={handleClick}
        />
        {isSelected && !isCameraView && (
            <Html position={[0, 2, 0]} center>
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap border border-brand-green/50 z-50">
                    {actor.name}
                </div>
            </Html>
        )}
    </group>
  );
};

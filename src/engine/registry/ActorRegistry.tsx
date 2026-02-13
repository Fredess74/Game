import React from 'react';
import type { Actor, ActorType, ShapeType } from '../../types';
import type { ThreeEvent } from '@react-three/fiber';

export interface ActorRendererProps {
  actor: Actor;
  isSelected: boolean;
  onSelect: (e: ThreeEvent<MouseEvent>) => void;
}

export type ActorRenderer = React.FC<ActorRendererProps>;

const registry: Map<string, ActorRenderer> = new Map();

export const registerRenderer = (key: string, component: ActorRenderer) => {
  registry.set(key, component);
};

export const getRenderer = (actor: Actor): ActorRenderer | undefined => {
  // 1. Check strict type match
  if (registry.has(actor.type)) return registry.get(actor.type);

  // 2. Check for shape if primitive
  if (actor.type === 'primitive') {
     // @ts-ignore - TS might not narrow correctly without type guard
     const shape = actor.properties?.shape;
     if (shape && registry.has(shape)) return registry.get(shape);
  }

  // 3. Fallbacks
  if (actor.type === 'character') return registry.get('humanoid'); // Should be covered by step 1 if registered

  return registry.get('box'); // Ultimate fallback
};

export const useActorRenderer = (actor: Actor) => {
  return getRenderer(actor);
};

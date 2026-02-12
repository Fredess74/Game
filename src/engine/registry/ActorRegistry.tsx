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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getKey = (type: ActorType, shape?: ShapeType) => {
  if (type === 'light' || type === 'camera' || type === 'sound') {
    return type;
  }
  return shape || type;
};

export const registerRenderer = (key: string, component: ActorRenderer) => {
  registry.set(key, component);
};

export const getRenderer = (type: ActorType, shape?: ShapeType): ActorRenderer | undefined => {
  if (shape && registry.has(shape)) return registry.get(shape);
  if (registry.has(type)) return registry.get(type);
  if (type === 'character') return registry.get('humanoid');
  return registry.get('box');
};

export const useActorRenderer = (actor: Actor) => {
  return getRenderer(actor.type, actor.shape);
};

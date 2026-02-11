export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type ActorType = 'actor' | 'prop' | 'light' | 'camera' | 'sound';
export type ShapeType = 'box' | 'sphere' | 'capsule' | 'plane';

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color: string;
  shape: ShapeType;
}

export interface Keyframe {
  id: string;
  targetId: string;
  property: 'position' | 'rotation' | 'scale';
  time: number;
  value: Vector3;
}

export interface ProjectState {
  actors: Actor[];
  keyframes: Keyframe[];
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  selectedId: string | null;
  // Environment
  backgroundColor?: string;
  gridVisible?: boolean;
}

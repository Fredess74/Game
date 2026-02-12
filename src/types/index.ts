export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type ActorType = 'character' | 'prop' | 'set_piece' | 'light' | 'camera' | 'vfx' | 'sound' | 'model' | 'sprite' | 'voxel';
export type ShapeType = 'box' | 'sphere' | 'capsule' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'humanoid' | 'cube_character' | 'model' | 'sprite' | 'voxel';
export type LightType = 'point' | 'spot' | 'directional';
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInBack' | 'easeOutBounce' | 'step';

export interface ModelProperties {
  url: string;
  format: 'gltf' | 'glb' | 'obj' | 'vox';
}

export interface SpriteProperties {
  url: string;
  billboardMode: boolean; // Always face camera
  columns?: number; // For sprite sheets
  rows?: number;    // For sprite sheets
  frameRate?: number; // For sprite sheets
}

export interface VoxelProperties {
  voxelData?: string; // Base64 or raw data string for voxel grids
  gridSize?: number;
}

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  shape: ShapeType; // default to 'box' if not applicable

  // Transform
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  // Visuals
  color: string;
  emissive: string;
  emissiveIntensity: number;
  opacity: number;
  visible: boolean;
  metalness?: number;
  roughness?: number;

  // Light specifics
  lightType?: LightType;
  intensity?: number;
  target?: string; // ID of actor to look at

  // Camera specifics
  fov?: number;
  lookAt?: string | Vector3; // ID or static point

  // Advanced Graphics Properties
  model?: ModelProperties;
  sprite?: SpriteProperties;
  voxel?: VoxelProperties;
}

export interface Keyframe {
  id: string;
  targetId: string;
  property: string; // 'position', 'rotation', 'scale', 'emissiveIntensity', 'opacity', etc.
  time: number;
  value: Vector3 | number; // Vector3 for transform, number for scalars
  easing: EasingType;
}

export interface AnimationClip {
  id: string;
  name: string;
  duration: number;
  tracks: Keyframe[]; // Reusing Keyframe interface but time is relative to clip start
}

export interface AnimationEvent {
  id: string;
  time: number;
  type: 'play_clip' | 'stop_clip' | 'set_property' | 'custom';
  targetId: string;
  parameters: Record<string, any>; // e.g., { clipId: 'walk_loop', loop: true }
}

export interface CameraCut {
  id: string;
  time: number;
  cameraId: string;
  transition: 'cut' | 'smooth';
  transitionDuration?: number;
}

export interface Scene {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}

export interface ProjectState {
  actors: Actor[];
  keyframes: Keyframe[];
  scenes: Scene[];
  cameraCuts: CameraCut[];

  // New Animation System
  clips: AnimationClip[];
  events: AnimationEvent[];

  currentTime: number;
  isPlaying: boolean;
  duration: number;
  selectedId: string | null;

  // Environment
  backgroundColor: string;
  gridVisible: boolean;
  ambientLightIntensity: number;
  ambientLightColor: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  exportSettings: {
    resolution: '720p' | '1080p' | '4k';
    fps: number;
    includeTitle: boolean;
    title: string;
    subtitle: string;
  };
  lastExportUrl: string | null;
}

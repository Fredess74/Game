export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type ActorType = 'character' | 'prop' | 'set_piece' | 'light' | 'camera' | 'vfx' | 'sound';
export type ShapeType = 'box' | 'sphere' | 'capsule' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'humanoid' | 'cube_character';
export type LightType = 'point' | 'spot' | 'directional';
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInBack' | 'easeOutBounce' | 'step';

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
}

export interface Keyframe {
  id: string;
  targetId: string;
  property: string; // 'position', 'rotation', 'scale', 'emissiveIntensity', 'opacity', etc.
  time: number;
  value: Vector3 | number; // Vector3 for transform, number for scalars
  easing: EasingType;
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

export interface EnvironmentSettings {
  ground: {
    color: string;
    texture: string | null;
    opacity: number;
    gridVisible: boolean;
  };
  sky: {
    color: string;
    texture: string | null;
  };
  weather: {
    type: "none" | "rain" | "snow";
    intensity: number;
  };
}

export interface ProjectState {
  actors: Actor[];
  keyframes: Keyframe[];
  scenes: Scene[];
  cameraCuts: CameraCut[];

  currentTime: number;
  isPlaying: boolean;
  duration: number;
  selectedId: string | null;
  environment: EnvironmentSettings;

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

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Actor, ActorType, ShapeType, Vector3, ProjectState, Keyframe } from '../types';
import { interpolate } from '../engine/EasingFunctions';

interface StoreState extends ProjectState {
  addActor: (type: ActorType, shape?: ShapeType, initialProps?: Partial<Actor>) => void;
  removeActor: (id: string) => void;
  updateActor: (id: string, updates: Partial<Actor>) => void;
  setSelected: (id: string | null) => void;
  setPlaying: (isPlaying: boolean) => void;
  setTime: (time: number) => void;
  addKeyframe: (targetId: string, property: string) => void;
  isCameraView: boolean;
  setCameraView: (isCameraView: boolean) => void;
  isExporting: boolean;
  setExporting: (isExporting: boolean) => void;
  loadProject: (project: Partial<ProjectState>) => void;

  // Environment
  setEnvironment: (updates: Partial<ProjectState>) => void;
  setExportSettings: (settings: ProjectState['exportSettings']) => void;
  setLastExportUrl: (url: string | null) => void;
}

const DEFAULT_ACTOR: Partial<Actor> = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#4ade80',
  emissive: '#000000',
  emissiveIntensity: 0,
  opacity: 1,
  visible: true,
};

const DEFAULT_CAMERA: Actor = {
    id: 'main-camera',
    name: 'Main Camera',
    type: 'camera',
    shape: 'box',
    position: { x: 0, y: 2, z: 10 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#ffffff',
    emissive: '#000000',
    emissiveIntensity: 0,
    opacity: 1,
    visible: true,
    fov: 50,
};

// Helper: Interpolate Vector3
const lerpVector3 = (start: Vector3, end: Vector3, t: number): Vector3 => ({
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
  z: start.z + (end.z - start.z) * t,
});

// Helper: Get interpolated value
const getValueAtTime = (targetKeyframes: Keyframe[], time: number, defaultValue: any): any => {
  if (!targetKeyframes || targetKeyframes.length === 0) return defaultValue;

  // Before first keyframe
  if (time <= targetKeyframes[0].time) return targetKeyframes[0].value;

  // After last keyframe
  if (time >= targetKeyframes[targetKeyframes.length - 1].time) return targetKeyframes[targetKeyframes.length - 1].value;

  // Between keyframes
  for (let i = 0; i < targetKeyframes.length - 1; i++) {
    const k1 = targetKeyframes[i];
    const k2 = targetKeyframes[i + 1];
    if (time >= k1.time && time < k2.time) {
      const t = (time - k1.time) / (k2.time - k1.time);
      // Determine easing
      const easing = k1.easing || 'linear';

      // Interpolate
      if (typeof k1.value === 'number' && typeof k2.value === 'number') {
         return interpolate(k1.value, k2.value, t, easing);
      } else if (typeof k1.value === 'object' && typeof k2.value === 'object') {
         // Vector3
         // Get eased T (0 to 1)
         const easedT = interpolate(0, 1, t, easing);
         return lerpVector3(k1.value as Vector3, k2.value as Vector3, easedT);
      }
    }
  }

  return defaultValue;
};

export const useStore = create<StoreState>((set) => ({
  actors: [DEFAULT_CAMERA],
  keyframes: [],
  scenes: [],
  cameraCuts: [],
  currentTime: 0,
  isPlaying: false,
  duration: 60,
  selectedId: null,
  isCameraView: false,
  isExporting: false,

  // Environment
  backgroundColor: '#1e293b',
  gridVisible: true,
  ambientLightIntensity: 0.5,
  ambientLightColor: '#ffffff',
  fog: undefined,
  exportSettings: {
      resolution: '1080p',
      fps: 30,
      includeTitle: true,
      title: 'My Movie',
      subtitle: 'Created with Fredess',
  },

  lastExportUrl: null,

  setCameraView: (isCameraView) => set({ isCameraView }),
  setExportSettings: (settings) => set({ exportSettings: settings }),
  setLastExportUrl: (url) => set({ lastExportUrl: url }),
  setExporting: (isExporting) => set({ isExporting }),
  setEnvironment: (updates) => set((state) => ({ ...state, ...updates })),

  loadProject: (project) => set((state) => ({
      ...state,
      actors: project.actors || state.actors,
      keyframes: project.keyframes || state.keyframes,
      scenes: project.scenes || state.scenes,
      cameraCuts: project.cameraCuts || state.cameraCuts,
      duration: project.duration || state.duration,
      backgroundColor: project.backgroundColor || state.backgroundColor,
      gridVisible: project.gridVisible !== undefined ? project.gridVisible : state.gridVisible,
      ambientLightIntensity: project.ambientLightIntensity !== undefined ? project.ambientLightIntensity : state.ambientLightIntensity,
      ambientLightColor: project.ambientLightColor || state.ambientLightColor,
      fog: project.fog || state.fog,
      currentTime: 0,
      isPlaying: false,
  })),

  addActor: (type, shape, initialProps) =>
    set((state) => ({
      actors: [
        ...state.actors,
        {
          ...DEFAULT_ACTOR,
          id: uuidv4(),
          name: `${type}_${state.actors.length + 1}`,
          type,
          shape: shape || 'box',
          position: {
            x: (Math.random() - 0.5) * 5,
            y: type === 'prop' ? 0.5 : 1,
            z: (Math.random() - 0.5) * 5,
          },
          ...initialProps
        } as Actor,
      ],
    })),

  removeActor: (id) =>
    set((state) => ({
      actors: state.actors.filter((a) => a.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  updateActor: (id, updates) =>
    set((state) => {
        return {
            actors: state.actors.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        };
    }),

  addKeyframe: (targetId, property) =>
    set((state) => {
        const actor = state.actors.find(a => a.id === targetId);
        if (!actor) return state;

        const value = (actor as any)[property];
        if (value === undefined) return state;

        const filteredKeyframes = state.keyframes.filter(
            k => !(k.targetId === targetId && k.property === property && Math.abs(k.time - state.currentTime) < 0.01)
        );

        // Clone value to avoid reference issues
        let clonedValue = value;
        if (typeof value === 'object') {
            clonedValue = { ...value };
        }

        return {
            keyframes: [
                ...filteredKeyframes,
                {
                    id: uuidv4(),
                    targetId,
                    property,
                    time: state.currentTime,
                    value: clonedValue,
                    easing: 'linear',
                }
            ]
        };
    }),

  setSelected: (id) => set({ selectedId: id }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  setTime: (time) =>
    set((state) => {
        const newTime = Math.max(0, Math.min(time, state.duration));

        // Group keyframes by targetId and property
        const keyframeMap = new Map<string, Map<string, Keyframe[]>>();

        for (const k of state.keyframes) {
            if (!keyframeMap.has(k.targetId)) {
                keyframeMap.set(k.targetId, new Map());
            }
            const props = keyframeMap.get(k.targetId)!;
            if (!props.has(k.property)) {
                props.set(k.property, []);
            }
            props.get(k.property)!.push(k);
        }

        // Sort keyframes by time
        for (const props of keyframeMap.values()) {
            for (const frames of props.values()) {
                frames.sort((a, b) => a.time - b.time);
            }
        }

        const updatedActors = state.actors.map(actor => {
            const actorProps = keyframeMap.get(actor.id);
            if (!actorProps) return actor;

            const updates: any = {};
            for (const [prop, frames] of actorProps.entries()) {
                const currentVal = (actor as any)[prop];
                updates[prop] = getValueAtTime(frames, newTime, currentVal);
            }

            return { ...actor, ...updates };
        });

        return {
            currentTime: newTime,
            actors: updatedActors
        };
    }),
}));

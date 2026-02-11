import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Actor, ActorType, ShapeType, Vector3, ProjectState, Keyframe } from '../types';

interface StoreState extends ProjectState {
  addActor: (type: ActorType, shape: ShapeType) => void;
  removeActor: (id: string) => void;
  updateActor: (id: string, updates: Partial<Actor>) => void;
  setSelected: (id: string | null) => void;
  setPlaying: (isPlaying: boolean) => void;
  setTime: (time: number) => void;
  addKeyframe: (targetId: string, property: 'position' | 'rotation' | 'scale') => void;
  isCameraView: boolean;
  setCameraView: (isCameraView: boolean) => void;
  isExporting: boolean;
  setExporting: (isExporting: boolean) => void;
  loadProject: (project: Partial<ProjectState>) => void;

  // Environment
  backgroundColor: string;
  gridVisible: boolean;
  setEnvironment: (updates: Partial<{ backgroundColor: string; gridVisible: boolean }>) => void;
}

const DEFAULT_ACTOR = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#4ade80', // brand-green
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
};

// Helper: Interpolate Vector3
const lerpVector3 = (start: Vector3, end: Vector3, t: number): Vector3 => ({
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
  z: start.z + (end.z - start.z) * t,
});

// Helper: Get interpolated value
const getValueAtTime = (keyframes: Keyframe[], targetId: string, property: string, time: number, defaultValue: Vector3): Vector3 => {
  const targetKeyframes = keyframes
    .filter((k) => k.targetId === targetId && k.property === property)
    .sort((a, b) => a.time - b.time);

  if (targetKeyframes.length === 0) return defaultValue;

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
      return lerpVector3(k1.value, k2.value, t);
    }
  }

  return defaultValue;
};

export const useStore = create<StoreState>((set) => ({
  actors: [DEFAULT_CAMERA],
  keyframes: [],
  currentTime: 0,
  isPlaying: false,
  duration: 10,
  selectedId: null,
  isCameraView: false,
  isExporting: false,
  backgroundColor: '#1e293b',
  gridVisible: true,

  setCameraView: (isCameraView) => set({ isCameraView }),
  setExporting: (isExporting) => set({ isExporting }),
  setEnvironment: (updates) => set((state) => ({ ...state, ...updates })),

  loadProject: (project) => set((state) => ({
      ...state,
      actors: project.actors || state.actors,
      keyframes: project.keyframes || state.keyframes,
      duration: project.duration || state.duration,
      backgroundColor: project.backgroundColor || state.backgroundColor,
      gridVisible: project.gridVisible !== undefined ? project.gridVisible : state.gridVisible,
      currentTime: 0,
      isPlaying: false,
  })),

  addActor: (type, shape) =>
    set((state) => ({
      actors: [
        ...state.actors,
        {
          id: uuidv4(),
          name: `${type}_${state.actors.length + 1}`,
          type,
          shape,
          ...DEFAULT_ACTOR,
          position: {
            x: (Math.random() - 0.5) * 2,
            y: type === 'prop' ? 0.5 : 1,
            z: (Math.random() - 0.5) * 2,
          }
        },
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

        const value = actor[property];

        const filteredKeyframes = state.keyframes.filter(
            k => !(k.targetId === targetId && k.property === property && Math.abs(k.time - state.currentTime) < 0.01)
        );

        return {
            keyframes: [
                ...filteredKeyframes,
                {
                    id: uuidv4(),
                    targetId,
                    property,
                    time: state.currentTime,
                    value: { ...value },
                }
            ]
        };
    }),

  setSelected: (id) => set({ selectedId: id }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  setTime: (time) =>
    set((state) => {
        const newTime = Math.max(0, Math.min(time, state.duration));

        const updatedActors = state.actors.map(actor => {
            const hasKeyframes = state.keyframes.some(k => k.targetId === actor.id);
            if (!hasKeyframes) return actor;

            return {
                ...actor,
                position: getValueAtTime(state.keyframes, actor.id, 'position', newTime, actor.position),
                rotation: getValueAtTime(state.keyframes, actor.id, 'rotation', newTime, actor.rotation),
                scale: getValueAtTime(state.keyframes, actor.id, 'scale', newTime, actor.scale),
            };
        });

        return {
            currentTime: newTime,
            actors: updatedActors
        };
    }),
}));

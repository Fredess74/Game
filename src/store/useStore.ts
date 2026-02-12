import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Actor, ActorType, ShapeType, ProjectState } from '../types';
import { getValueAtTime } from './utils';

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


export const useStore = create<StoreState>((set, get) => ({
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

        const updatedActors = state.actors.map(actor => {
            // Check if actor has any keyframes
            const actorKeyframes = state.keyframes.filter(k => k.targetId === actor.id);
            if (actorKeyframes.length === 0) return actor;

            // Get all animated properties for this actor
            const properties = Array.from(new Set(actorKeyframes.map(k => k.property)));

            const updates: any = {};
            properties.forEach(prop => {
                const currentVal = (actor as any)[prop];
                updates[prop] = getValueAtTime(state.keyframes, actor.id, prop, newTime, currentVal);
            });

            return { ...actor, ...updates };
        });

        return {
            currentTime: newTime,
            actors: updatedActors
        };
    }),
}));

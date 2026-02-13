import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  ProjectState,
  Actor,
  Timeline,
  Environment,
  Character,
  ActorType,
  Vector3
} from '../types';
import { getValueAtTime } from './utils';
import { ProjectSchema } from '../types/schemas/project';

interface StoreState extends ProjectState {
  addActor: (type: ActorType, initialProps?: Partial<Actor>) => void;
  removeActor: (id: string) => void;
  updateActor: (id: string, updates: Partial<Actor> | ((prev: Actor) => Partial<Actor>)) => void;
  setSelected: (id: string | null) => void;
  setPlaying: (isPlaying: boolean) => void;
  setTime: (time: number) => void;
  setEnvironment: (updates: Partial<Environment>) => void;
  addKeyframe: (targetId: string, property: string, value: any) => void;
  setCameraView: (isCameraView: boolean) => void;
  setExportSettings: (settings: ProjectState['exportSettings']) => void;
  setLastExportUrl: (url: string | null) => void;
  loadProject: (project: Partial<ProjectState>) => void;
}

const DEFAULT_TRANSFORM = {
  position: [0, 0, 0] as Vector3,
  rotation: [0, 0, 0] as Vector3,
  scale: [1, 1, 1] as Vector3,
};

const DEFAULT_ENVIRONMENT: Environment = {
  ambientLight: { intensity: 0.5, color: '#ffffff' },
  skyColor: '#1e293b',
};

const DEFAULT_TIMELINE: Timeline = {
  duration: 60,
  cameraTrack: [],
  animationTracks: [],
};

// Deep merge helper
const setNestedValue = (obj: any, path: string[], value: any) => {
    const key = path[0];
    if (path.length === 1) {
        obj[key] = value;
        return;
    }
    if (!obj[key]) obj[key] = {};
    setNestedValue(obj[key], path.slice(1), value);
};

export const useStore = create<StoreState>((set, get) => ({
  actors: [],
  timeline: DEFAULT_TIMELINE,
  environment: DEFAULT_ENVIRONMENT,
  library: { clips: [] },

  currentTime: 0,
  isPlaying: false,
  selectedId: null,
  isCameraView: false,
  isExporting: false,
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
  setEnvironment: (updates) => set((state) => ({
    environment: { ...state.environment, ...updates }
  })),

  addActor: (type, initialProps) => set((state) => {
    const id = uuidv4();
    const baseActor = {
      id,
      name: `${type}_${state.actors.length + 1}`,
      type,
      transform: { ...DEFAULT_TRANSFORM },
      visible: true,
      ...initialProps
    } as Actor;

    if (type === 'character') {
       (baseActor as any).parts = [];
       (baseActor as any).morphTargets = {};
    }

    return { actors: [...state.actors, baseActor] };
  }),

  removeActor: (id) => set((state) => ({
    actors: state.actors.filter((a) => a.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),

  updateActor: (id, updates) => set((state) => ({
    actors: state.actors.map((a) => {
      if (a.id !== id) return a;
      const newProps = typeof updates === 'function' ? updates(a) : updates;
      return { ...a, ...newProps };
    }),
  })),

  setSelected: (id) => set({ selectedId: id }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  setTime: (time) => set((state) => {
    // 1. Clamp time
    const newTime = Math.max(0, Math.min(time, state.timeline.duration));

    // 2. Apply Animation Tracks
    // We create a map of updates per actor to avoid excessive cloning
    const updatesMap = new Map<string, any>();

    state.timeline.animationTracks.forEach(track => {
        const actorId = track.targetId;
        const value = getValueAtTime(track.keyframes, newTime, null);

        if (value !== null) {
            if (!updatesMap.has(actorId)) updatesMap.set(actorId, {});
            const actorUpdates = updatesMap.get(actorId);
            setNestedValue(actorUpdates, track.property.split('.'), value);
        }
    });

    const updatedActors = state.actors.map(actor => {
        if (updatesMap.has(actor.id)) {
            // Merge deep updates? Ideally use a deep merge library, but for now strict replacement of top-level or specific nested is tricky.
            // Our setNestedValue builds a partial object structure.
            // E.g. { transform: { position: [...] } }
            // We need to merge this into actor.
            // For now, shallow merge of top level props is safe if we are careful.
            // But 'transform' is an object. strict replacement might lose 'rotation' if we only set 'position'.

            // Simplified approach: Re-apply updates carefully.
            // Actually, let's use a simpler loop for now:
            const updates = updatesMap.get(actor.id);
            // We need to merge 'updates' into 'actor' deeply.
            // Since we don't have Lodash, let's do a basic 2-level merge manually for known props.

            const newActor = { ...actor };
            if (updates.transform) {
                newActor.transform = { ...newActor.transform, ...updates.transform };
            }
            if (updates.morphTargets) {
                newActor.morphTargets = { ...newActor.morphTargets, ...updates.morphTargets };
            }
            // For other props
            Object.keys(updates).forEach(key => {
                if (key !== 'transform' && key !== 'morphTargets') {
                    (newActor as any)[key] = updates[key];
                }
            });
            return newActor;
        }
        return actor;
    });

    return {
      currentTime: newTime,
      actors: updatedActors
    };
  }),

  addKeyframe: (targetId, property, value) => set((state) => {
    const tracks = [...state.timeline.animationTracks];
    let trackIndex = tracks.findIndex(t => t.targetId === targetId && t.property === property);

    if (trackIndex === -1) {
       tracks.push({
         targetId,
         property,
         keyframes: []
       });
       trackIndex = tracks.length - 1;
    }

    const track = { ...tracks[trackIndex] };
    track.keyframes = track.keyframes.filter(k => Math.abs(k.time - state.currentTime) > 0.01);

    track.keyframes.push({
      time: state.currentTime,
      value,
      easing: 'linear'
    });

    track.keyframes.sort((a, b) => a.time - b.time);
    tracks[trackIndex] = track;

    return {
      timeline: {
        ...state.timeline,
        animationTracks: tracks
      }
    };
  }),

  loadProject: (project) => set((state) => ({
      ...state,
      ...project,
      currentTime: 0,
      isPlaying: false
  })),
}));

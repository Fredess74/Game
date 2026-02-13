import { z } from 'zod';
import {
  ProjectSchema,
  ActorDataSchema,
  CharacterSchema,
  TimelineSchema,
  CameraCutSchema,
  AnimationClipSchema,
  KeyframeSchema,
  EnvironmentSchema
} from './schemas';

// Re-export Schema Types
export type Project = z.infer<typeof ProjectSchema>;
export type Actor = z.infer<typeof ActorDataSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
export type CameraCut = z.infer<typeof CameraCutSchema>;
export type AnimationClip = z.infer<typeof AnimationClipSchema>;
export type Keyframe = z.infer<typeof KeyframeSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;

// Primitive Types
export type Vector3 = [number, number, number];
export type ActorType = Actor['type'];

// Project State (Runtime)
// Extending Project Schema with runtime-only fields
export interface ProjectState {
  // Data (Mapped from Schema)
  actors: Actor[];
  timeline: Timeline;
  environment: Environment;
  library: Project['library'];

  // Runtime State
  currentTime: number;
  isPlaying: boolean;
  selectedId: string | null;

  // Editor Settings
  isCameraView: boolean;
  isExporting: boolean;
  exportSettings: {
    resolution: '720p' | '1080p' | '4k';
    fps: number;
    includeTitle: boolean;
    title: string;
    subtitle: string;
  };
  lastExportUrl: string | null;
}

import { z } from 'zod';
import { UUIDSchema } from './common';
import { AnimationTrackSchema } from './animation';

export const CameraTransitionSchema = z.enum(['cut', 'dissolve', 'fade']);

export const CameraCutSchema = z.object({
  id: UUIDSchema,
  time: z.number().min(0),
  duration: z.number().min(0).optional(),
  cameraId: UUIDSchema,
  transition: CameraTransitionSchema.default('cut'),
  transitionDuration: z.number().min(0).default(0),
});

export const TimelineTrackType = z.enum(['camera', 'animation', 'audio']);

export const TimelineTrackSchema = z.object({
  id: UUIDSchema,
  type: TimelineTrackType,
  name: z.string(),
  cuts: z.array(CameraCutSchema).default([]),
});

export const TimelineSchema = z.object({
  duration: z.number().min(0),
  cameraTrack: z.array(CameraCutSchema).default([]),
  animationTracks: z.array(AnimationTrackSchema).default([]), // Added this back!
});

export type CameraCut = z.infer<typeof CameraCutSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;

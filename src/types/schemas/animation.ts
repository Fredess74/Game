import { z } from 'zod';
import { UUIDSchema, Vector3Schema } from './common';

export const EasingSchema = z.enum([
  'linear', 'easeIn', 'easeOut', 'easeInOut', 'step', 'bezier'
]);

export const KeyframeValueSchema = z.union([Vector3Schema, z.number(), z.string()]);

export const KeyframeSchema = z.object({
  time: z.number().min(0),
  value: KeyframeValueSchema,
  easing: EasingSchema.default('linear'),
});

export const AnimationTrackSchema = z.object({
  targetId: UUIDSchema,
  property: z.string(), // e.g. 'position', 'rotation', 'morphTarget:smile'
  keyframes: z.array(KeyframeSchema).default([]),
});

export const AnimationClipSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  duration: z.number().min(0),
  loop: z.boolean().default(false),
  tracks: z.array(AnimationTrackSchema).default([]),
});

export type AnimationClip = z.infer<typeof AnimationClipSchema>;
export type AnimationTrack = z.infer<typeof AnimationTrackSchema>;
export type Keyframe = z.infer<typeof KeyframeSchema>;

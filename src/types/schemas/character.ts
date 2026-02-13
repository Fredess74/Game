import { z } from 'zod';
import { TransformSchema, ColorSchema, UUIDSchema } from './common';

export const CharacterSlotSchema = z.enum(['head', 'torso', 'legs', 'feet']);

export const CharacterPartSchema = z.object({
  slot: CharacterSlotSchema,
  modelUrl: z.string(), // URL to the GLTF/GLB model
  materialOverride: ColorSchema.optional(),
});

export const MorphTargetSchema = z.record(z.string(), z.number().min(0).max(1)); // e.g. { "smile": 0.5, "blink_left": 1.0 }

export const CharacterSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  type: z.literal('character'),
  transform: TransformSchema,
  baseModelUrl: z.string().optional(), // Base skeleton/body if not fully modular
  parts: z.array(CharacterPartSchema).default([]),
  morphTargets: MorphTargetSchema.default({}),
  visible: z.boolean().default(true),
});

export type Character = z.infer<typeof CharacterSchema>;

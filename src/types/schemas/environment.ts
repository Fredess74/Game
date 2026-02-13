import { z } from 'zod';
import { ColorSchema, Vector3Schema } from './common';

export const LightTypeSchema = z.enum(['ambient', 'point', 'spot', 'directional']);

export const FogSchema = z.object({
  color: ColorSchema,
  near: z.number().min(0),
  far: z.number().min(0),
});

export const WeatherSchema = z.object({
  ambientLight: z.object({
    intensity: z.number().min(0).max(10),
    color: ColorSchema,
  }),
  sun: z.object({
    position: Vector3Schema,
    intensity: z.number().min(0).max(10),
    color: ColorSchema,
  }).optional(),
  fog: FogSchema.optional(),
  skyColor: ColorSchema.optional(),
});

export const LightSchema = z.object({
  id: z.string().uuid(),
  type: LightTypeSchema,
  color: ColorSchema.default('#ffffff'),
  intensity: z.number().min(0).default(1),
  position: Vector3Schema,
  target: Vector3Schema.optional(),
  castShadow: z.boolean().default(false),
});

export type Environment = z.infer<typeof WeatherSchema>;
export type Light = z.infer<typeof LightSchema>;

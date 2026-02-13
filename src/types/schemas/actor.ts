import { z } from 'zod';
import { CharacterSchema } from './character';
import { CowboySchema } from './cowboy';
import { TransformSchema, UUIDSchema, ColorSchema, Vector3Schema } from './common';

export const ActorTypeSchema = z.enum([
  'character', 'cowboy', 'prop', 'light', 'camera', 'model', 'sprite', 'voxel', 'vfx', 'primitive', 'sound'
]);

// Base Actor Properties (Transform, ID, Visibility)
const BaseActorSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  type: ActorTypeSchema,
  transform: TransformSchema,
  visible: z.boolean().default(true),
  parentId: UUIDSchema.optional(), // Parent-child hierarchy support
});

export const ShapeTypeSchema = z.enum([
  'box', 'sphere', 'capsule', 'cylinder', 'cone', 'torus', 'plane'
]);

// Primitive Specifics
export const PrimitivePropertiesSchema = z.object({
  shape: ShapeTypeSchema,
  color: ColorSchema.default('#ffffff'),
  roughness: z.number().min(0).max(1).default(0.5),
  metalness: z.number().min(0).max(1).default(0.5),
});

// Camera Specifics
export const CameraPropertiesSchema = z.object({
  fov: z.number().min(1).max(179).default(50),
  lookAt: z.union([UUIDSchema, Vector3Schema]).optional(), // Look at actor ID or coordinate
  near: z.number().default(0.1),
  far: z.number().default(1000),
});

// Light Specifics
export const LightPropertiesSchema = z.object({
  intensity: z.number().min(0).default(1),
  color: ColorSchema.default('#ffffff'),
  castShadow: z.boolean().default(true),
  distance: z.number().optional(),
  decay: z.number().optional(),
  type: z.enum(['point', 'spot', 'directional']),
});

// Model/Prop Specifics
export const ModelPropertiesSchema = z.object({
  modelUrl: z.string(),
  format: z.enum(['gltf', 'glb', 'obj', 'fbx']).default('glb'),
  materialOverride: ColorSchema.optional(),
});

// Discriminated Union for Actor Data
export const ActorDataSchema = z.discriminatedUnion('type', [
  CharacterSchema, // Character has its own schema with 'type: "character"'
  CowboySchema, // Cowboy has its own schema with 'type: "cowboy"'
  BaseActorSchema.extend({
    type: z.literal('camera'),
    properties: CameraPropertiesSchema,
  }),
  BaseActorSchema.extend({
    type: z.literal('light'),
    properties: LightPropertiesSchema,
  }),
  BaseActorSchema.extend({
    type: z.literal('prop'),
    properties: ModelPropertiesSchema,
  }),
   BaseActorSchema.extend({
    type: z.literal('model'), // Alias for prop/static mesh
    properties: ModelPropertiesSchema,
  }),
  BaseActorSchema.extend({
    type: z.literal('primitive'),
    properties: PrimitivePropertiesSchema,
  }),
  // Fallback for others currently
  BaseActorSchema.extend({
      type: z.enum(['sprite', 'voxel', 'vfx', 'sound']),
      properties: z.record(z.any()).optional(),
  })
]);

export type Actor = z.infer<typeof ActorDataSchema>;
export type ShapeType = z.infer<typeof ShapeTypeSchema>;

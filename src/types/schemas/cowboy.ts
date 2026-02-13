import { z } from 'zod';
import { TransformSchema, UUIDSchema, Vector3Schema } from './common';

// Cowboy-specific equipment schema
export const CowboyEquipmentSchema = z.object({
  hat: z.boolean().default(true),
  revolver: z.enum(['none', 'holstered', 'inHand']).default('holstered'),
  badge: z.boolean().default(false),
});

// Cowboy-specific IK targets for high-fidelity control
export const CowboyIKSchema = z.object({
  lookAt: Vector3Schema.optional(), // Head tracking target
  rightHand: Vector3Schema.optional(), // Right hand target (e.g. for aiming)
  leftHand: Vector3Schema.optional(), // Left hand target
});

// Cowboy-specific animation states
// This allows controlling the character via high-level commands like "draw_gun"
export const CowboyAnimationSchema = z.enum([
  'idle',
  'walk',
  'run',
  'draw_revolver',
  'aim_revolver',
  'shoot_revolver',
  'holster_revolver',
  'tip_hat',
  'emote_angry',
  'emote_happy'
]).default('idle');

export const CowboySchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  type: z.literal('cowboy'),
  transform: TransformSchema,
  visible: z.boolean().default(true),

  // High-level control properties
  animation: CowboyAnimationSchema,
  animationSpeed: z.number().min(0).default(1.0),

  // Low-level control properties (mimicry)
  morphTargets: z.record(z.string(), z.number().min(0).max(1)).default({}),

  // Equipment state
  equipment: CowboyEquipmentSchema.default({}),

  // IK Targets
  ikTargets: CowboyIKSchema.default({}),
});

export type Cowboy = z.infer<typeof CowboySchema>;

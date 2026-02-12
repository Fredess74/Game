import { z } from 'zod';

export const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const MetaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().min(1).max(600).default(60), // Allow up to 10 mins, default 60s
  fps: z.number().default(30),
});

export const EnvironmentSchema = z.object({
  backgroundColor: z.string().optional(),
  ambientLightIntensity: z.number().min(0).max(10).default(0.5),
  ambientLightColor: z.string().optional(),
  fog: z.object({
    color: z.string(),
    near: z.number(),
    far: z.number(),
  }).optional(),
  gridVisible: z.boolean().default(true),
});

export const ActorTypeSchema = z.enum(['character', 'prop', 'set_piece', 'light', 'vfx', 'camera']);
export const ShapeTypeSchema = z.enum([
  'box', 'sphere', 'capsule', 'cylinder', 'cone', 'torus', 'plane', 'humanoid', 'cube_character'
]);
export const LightTypeSchema = z.enum(['point', 'spot', 'directional']);

export const EmotionTypeSchema = z.enum(['neutral', 'happy', 'sad', 'angry', 'surprised']);

export const ClothingSchema = z.object({
  head: z.string().optional(),
  top: z.string().optional(),
  bottom: z.string().optional(),
  shoes: z.string().optional(),
  accessory: z.string().optional(),
});

export const PoseSchema = z.record(Vector3Schema);

// Advanced Graphics Properties Schemas
export const ModelPropertiesSchema = z.object({
  url: z.string(),
  format: z.enum(['gltf', 'glb', 'obj', 'vox']),
});

export const SpritePropertiesSchema = z.object({
  url: z.string(),
  billboardMode: z.boolean().default(true),
  columns: z.number().optional(),
  rows: z.number().optional(),
  frameRate: z.number().optional(),
});

export const VoxelPropertiesSchema = z.object({
  voxelData: z.string().optional(),
  gridSize: z.number().optional(),
});

export const ActorSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ActorTypeSchema,
  shape: ShapeTypeSchema.optional(), // shape is optional for lights/cameras/vfx
  lightType: LightTypeSchema.optional(),
  color: z.string().optional(),
  emissive: z.string().optional(),
  emissiveIntensity: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  metalness: z.number().min(0).max(1).optional(),
  roughness: z.number().min(0).max(1).optional(),
  visible: z.boolean().default(true),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  target: z.string().optional(), // For lights/cameras to look at actor ID

  // Character specifics
  emotion: EmotionTypeSchema.optional(),
  clothing: ClothingSchema.optional(),
  pose: PoseSchema.optional(),

  // Advanced Graphics Properties
  model: ModelPropertiesSchema.optional(),
  sprite: SpritePropertiesSchema.optional(),
  voxel: VoxelPropertiesSchema.optional(),
});

export const CameraSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: Vector3Schema,
  lookAt: z.union([z.string(), Vector3Schema]), // Actor ID or [x,y,z]
  fov: z.number().default(50),
});

export const EasingSchema = z.enum([
  'linear', 'easeIn', 'easeOut', 'easeInOut', 'easeInBack', 'easeOutBounce', 'step'
]);

export const KeyframeFrameSchema = z.object({
  time: z.number(),
  value: z.union([Vector3Schema, z.number(), z.tuple([z.number(), z.number(), z.number()])]), // Support vector or scalar
  easing: EasingSchema.optional(),
});

export const ActorKeyframeSchema = z.object({
  actorId: z.string(),
  property: z.string(), // 'position', 'rotation', 'scale', 'emissiveIntensity', etc.
  frames: z.array(KeyframeFrameSchema),
});

export const CameraCutSchema = z.object({
  time: z.number(),
  cameraId: z.string(),
  transition: z.enum(['cut', 'smooth']),
  transitionDuration: z.number().optional(),
});

export const SceneSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  activeCamera: z.string(),
  cameraCuts: z.array(CameraCutSchema).optional(),
  keyframes: z.array(ActorKeyframeSchema).default([]),
});

export const TimelineSchema = z.object({
  scenes: z.array(SceneSchema),
});

export const ScriptSchema = z.object({
  meta: MetaSchema,
  environment: EnvironmentSchema,
  actors: z.array(ActorSchema),
  cameras: z.array(CameraSchema),
  timeline: TimelineSchema,
});

export type Script = z.infer<typeof ScriptSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type Actor = z.infer<typeof ActorSchema>;
export type Camera = z.infer<typeof CameraSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type KeyframeFrame = z.infer<typeof KeyframeFrameSchema>;
export type ActorKeyframe = z.infer<typeof ActorKeyframeSchema>;
export type CameraCut = z.infer<typeof CameraCutSchema>;

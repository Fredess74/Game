import { z } from 'zod';
import { ActorDataSchema } from './actor';
import { WeatherSchema } from './environment';
import { TimelineSchema } from './timeline';
import { AnimationClipSchema } from './animation';

export const MetaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),
});

export const ProjectSchema = z.object({
  meta: MetaSchema,
  environment: WeatherSchema,
  actors: z.array(ActorDataSchema).default([]),
  timeline: TimelineSchema,
  library: z.object({
    clips: z.array(AnimationClipSchema).default([]),
    // Future: materials, assets
  }).default({}),
});

export type Project = z.infer<typeof ProjectSchema>;

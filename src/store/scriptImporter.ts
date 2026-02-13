import { ProjectSchema } from '../types/schemas/project';
import type { ProjectState } from '../types';

export const parseScript = (jsonString: string): { success: true, data: Partial<ProjectState> } | { success: false, error: string } => {
  try {
    const json = JSON.parse(jsonString);
    const result = ProjectSchema.safeParse(json);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\n');
      return { success: false, error: errorMsg };
    }

    const project = result.data;

    // Convert Schema Project to State Project
    // Since types are aligned now, this is mostly direct assignment.
    // However, ProjectSchema has 'meta' which State might not store directly or flattened.
    // State has 'exportSettings' which might come from meta or defaults.

    const state: Partial<ProjectState> = {
      actors: project.actors,
      timeline: project.timeline,
      environment: project.environment,
      library: project.library,
      // Default runtime state
      currentTime: 0,
      isPlaying: false,
      exportSettings: {
          resolution: '1080p',
          fps: 30,
          includeTitle: true,
          title: project.meta.title,
          subtitle: project.meta.description || '',
      }
    };

    return { success: true, data: state };

  } catch (e: any) {
    return { success: false, error: "Invalid JSON format: " + e.message };
  }
};

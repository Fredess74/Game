import { v4 as uuidv4 } from 'uuid';
import { ScriptSchema } from '../types/scriptSchema';
import type { Script } from '../types/scriptSchema';
import type { ProjectState, Actor, Keyframe, Scene, Vector3, ShapeType, ActorType, LightType } from '../types';

export const parseScript = (jsonString: string): { success: true, data: Partial<ProjectState> } | { success: false, error: string } => {
  try {
    const json = JSON.parse(jsonString);
    const result = ScriptSchema.safeParse(json);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\n');
      return { success: false, error: errorMsg };
    }

    const script: Script = result.data;
    const state: Partial<ProjectState> = {
      actors: [],
      keyframes: [],
      scenes: [],
      cameraCuts: [],
      duration: script.meta.duration,
      backgroundColor: script.environment.backgroundColor || '#000000',
      gridVisible: script.environment.gridVisible,
      ambientLightIntensity: script.environment.ambientLightIntensity,
      ambientLightColor: script.environment.ambientLightColor || '#ffffff',
      fog: script.environment.fog,
    };

    // Actors
    script.actors.forEach(a => {
      const actor: Actor = {
        id: a.id,
        name: a.name,
        type: a.type as ActorType,
        shape: (a.shape as ShapeType) || 'box',
        position: { x: a.position[0], y: a.position[1], z: a.position[2] },
        rotation: { x: a.rotation[0], y: a.rotation[1], z: a.rotation[2] },
        scale: { x: a.scale[0], y: a.scale[1], z: a.scale[2] },
        color: a.color || '#ffffff',
        emissive: a.emissive || '#000000',
        emissiveIntensity: a.emissiveIntensity || 0,
        opacity: a.opacity !== undefined ? a.opacity : 1,
        visible: a.visible,
        lightType: a.lightType as LightType,
        target: a.target,
        metalness: a.metalness || 0,
        roughness: a.roughness || 1,
      };
      state.actors!.push(actor);
    });

    // Cameras (convert to Actors)
    script.cameras.forEach(c => {
      const cameraActor: Actor = {
        id: c.id,
        name: c.name,
        type: 'camera',
        shape: 'box', // placeholder shape for editor
        position: { x: c.position[0], y: c.position[1], z: c.position[2] },
        rotation: { x: 0, y: 0, z: 0 }, // rotation is controlled by lookAt usually
        scale: { x: 1, y: 1, z: 1 },
        color: '#ff0000',
        emissive: '#000000',
        emissiveIntensity: 0,
        opacity: 1,
        visible: true,
        fov: c.fov,
        lookAt: Array.isArray(c.lookAt) ? { x: c.lookAt[0], y: c.lookAt[1], z: c.lookAt[2] } : c.lookAt as string,
      };
      state.actors!.push(cameraActor);
    });

    // Timeline: Scenes, Keyframes, Camera Cuts
    script.timeline.scenes.forEach(s => {
      // Scene
      const scene: Scene = {
        id: s.id,
        name: s.name,
        startTime: s.startTime,
        endTime: s.endTime,
      };
      state.scenes!.push(scene);

      // Initial Camera Cut
      state.cameraCuts!.push({
          id: uuidv4(),
          time: s.startTime,
          cameraId: s.activeCamera,
          transition: 'cut',
      });

      // Camera Cuts
      if (s.cameraCuts) {
        s.cameraCuts.forEach(cut => {
          state.cameraCuts!.push({
            id: uuidv4(),
            time: cut.time,
            cameraId: cut.cameraId,
            transition: cut.transition,
            transitionDuration: cut.transitionDuration
          });
        });
      }

      // Keyframes
      s.keyframes.forEach(ak => {
        ak.frames.forEach(f => {
          let value: Vector3 | number;
          if (typeof f.value === 'number') {
            value = f.value;
          } else if (Array.isArray(f.value)) {
            value = { x: f.value[0], y: f.value[1], z: f.value[2] };
          } else {
            value = f.value;
          }

          const keyframe: Keyframe = {
            id: uuidv4(),
            targetId: ak.actorId,
            property: ak.property,
            time: f.time,
            value: value,
            easing: (f.easing as any) || 'linear',
          };
          state.keyframes!.push(keyframe);
        });
      });
    });

    // Sort cuts by time
    state.cameraCuts!.sort((a, b) => a.time - b.time);

    return { success: true, data: state };

  } catch (e: any) {
    return { success: false, error: "Invalid JSON format: " + e.message };
  }
};

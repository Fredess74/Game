import type { Keyframe, Vector3 } from '../types';
import { interpolate } from '../engine/EasingFunctions';

// Helper: Interpolate Vector3
export const lerpVector3 = (start: Vector3, end: Vector3, t: number): Vector3 => ({
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
  z: start.z + (end.z - start.z) * t,
});

// Helper: Get interpolated value
export const getValueAtTime = (keyframes: Keyframe[], targetId: string, property: string, time: number, defaultValue: any): any => {
  const targetKeyframes = keyframes
    .filter((k) => k.targetId === targetId && k.property === property)
    .sort((a, b) => a.time - b.time);

  if (targetKeyframes.length === 0) return defaultValue;

  // Before first keyframe
  if (time <= targetKeyframes[0].time) return targetKeyframes[0].value;

  // After last keyframe
  if (time >= targetKeyframes[targetKeyframes.length - 1].time) return targetKeyframes[targetKeyframes.length - 1].value;

  // Between keyframes
  for (let i = 0; i < targetKeyframes.length - 1; i++) {
    const k1 = targetKeyframes[i];
    const k2 = targetKeyframes[i + 1];
    if (time >= k1.time && time < k2.time) {
      const t = (time - k1.time) / (k2.time - k1.time);
      // Determine easing
      const easing = k1.easing || 'linear';

      // Interpolate
      if (typeof k1.value === 'number' && typeof k2.value === 'number') {
         return interpolate(k1.value, k2.value, t, easing);
      } else if (typeof k1.value === 'object' && typeof k2.value === 'object') {
         // Vector3
         // Get eased T (0 to 1)
         const easedT = interpolate(0, 1, t, easing);
         return lerpVector3(k1.value as Vector3, k2.value as Vector3, easedT);
      }
    }
  }

  return defaultValue;
};

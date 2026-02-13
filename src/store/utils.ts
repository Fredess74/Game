import type { Keyframe, Vector3 } from '../types';
import { interpolate } from '../engine/EasingFunctions';

// Helper: Interpolate Vector3 (Tuple)
export const lerpVector3 = (start: Vector3, end: Vector3, t: number): Vector3 => ([
  start[0] + (end[0] - start[0]) * t,
  start[1] + (end[1] - start[1]) * t,
  start[2] + (end[2] - start[2]) * t,
]);

// Helper: Get interpolated value
export const getValueAtTime = (keyframes: Keyframe[], time: number, defaultValue: any): any => {
  // Assuming keyframes are pre-filtered and sorted by caller for performance
  // Or handled here if needed. But for now, let's keep it simple.
  // The old signature took targetId/property. The new AnimationTrack structure groups keyframes.
  // So we pass tracks[i].keyframes here.

  if (keyframes.length === 0) return defaultValue;

  // Before first keyframe
  if (time <= keyframes[0].time) return keyframes[0].value;

  // After last keyframe
  if (time >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

  // Between keyframes
  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (time >= k1.time && time < k2.time) {
      const t = (time - k1.time) / (k2.time - k1.time);
      // Determine easing
      const easing = k1.easing || 'linear';

      // Interpolate
      if (typeof k1.value === 'number' && typeof k2.value === 'number') {
         return interpolate(k1.value, k2.value, t, easing);
      } else if (Array.isArray(k1.value) && Array.isArray(k2.value)) {
         // Vector3 Tuple
         const easedT = interpolate(0, 1, t, easing);
         return lerpVector3(k1.value as Vector3, k2.value as Vector3, easedT);
      } else {
        // String or other non-interpolatable types (step interpolation)
        return k1.value;
      }
    }
  }

  return defaultValue;
};

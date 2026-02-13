import { describe, it, expect } from 'vitest';
import { parseScript } from './scriptImporter';
import type { Script } from '../types/scriptSchema';

describe('parseScript', () => {
  it('should successfully parse a valid script', () => {
    const validScript: Script = {
      meta: { title: 'Test Script', duration: 60, fps: 30 },
      environment: {
        ambientLightIntensity: 0.5,
        gridVisible: true,
      },
      actors: [
        {
          id: 'actor-1',
          name: 'Cube',
          type: 'prop',
          shape: 'box',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          visible: true,
        },
      ],
      cameras: [
        {
          id: 'cam-1',
          name: 'Main Camera',
          position: [0, 5, 10],
          lookAt: [0, 0, 0],
          fov: 75,
        },
      ],
      timeline: {
        scenes: [
          {
            id: 'scene-1',
            name: 'Scene 1',
            startTime: 0,
            endTime: 10,
            activeCamera: 'cam-1',
            keyframes: [],
          },
        ],
      },
    };

    const result = parseScript(JSON.stringify(validScript));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.actors).toHaveLength(2); // 1 actor + 1 camera converted to actor
      expect(result.data.scenes).toHaveLength(1);
      expect(result.data.duration).toBe(60);
    }
  });

  it('should handle optional fields and defaults', () => {
    const minimalScript = {
      meta: { title: 'Minimal' },
      environment: {},
      actors: [],
      cameras: [],
      timeline: { scenes: [] },
    };

    const result = parseScript(JSON.stringify(minimalScript));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ambientLightIntensity).toBe(0.5); // Default
      expect(result.data.ambientLightColor).toBe('#ffffff'); // Default
      expect(result.data.gridVisible).toBe(true); // Default
    }
  });

  it('should handle keyframe values as numbers and arrays', () => {
    const scriptWithKeyframes = {
      meta: { title: 'Keyframes' },
      environment: {},
      actors: [],
      cameras: [],
      timeline: {
        scenes: [
          {
            id: 's1',
            name: 'Scene 1',
            startTime: 0,
            endTime: 10,
            activeCamera: 'c1',
            keyframes: [
              {
                actorId: 'a1',
                property: 'position',
                frames: [
                  { time: 0, value: [0, 0, 0] },
                  { time: 1, value: 5 }, // scalar value
                ],
              },
            ],
          },
        ],
      },
    };

    const result = parseScript(JSON.stringify(scriptWithKeyframes));

    expect(result.success).toBe(true);
    if (result.success) {
      const keyframes = result.data.keyframes || [];
      expect(keyframes).toHaveLength(2);
      expect(keyframes[0].value).toEqual({ x: 0, y: 0, z: 0 });
      expect(keyframes[1].value).toBe(5);
    }
  });

  it('should return error for invalid JSON', () => {
    const result = parseScript('{ invalid json }');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid JSON format');
    }
  });

  it('should return error for schema validation failure', () => {
    const invalidScript = {
      meta: { title: 'Invalid' },
      // Missing required fields
    };

    const result = parseScript(JSON.stringify(invalidScript));
    expect(result.success).toBe(false);
    // exact error message depends on Zod, but it should be defined
    if (!result.success) {
        expect(result.error).toBeDefined();
    }
  });

    it('should correctly process camera cuts', () => {
        const scriptWithCuts = {
            meta: { title: 'Cuts' },
            environment: {},
            actors: [],
            cameras: [],
            timeline: {
                scenes: [
                    {
                        id: 's1',
                        name: 'Scene 1',
                        startTime: 0,
                        endTime: 10,
                        activeCamera: 'cam1',
                        cameraCuts: [
                            { time: 2, cameraId: 'cam2', transition: 'cut' },
                            { time: 5, cameraId: 'cam1', transition: 'smooth', transitionDuration: 1 }
                        ]
                    }
                ]
            }
        };

        const result = parseScript(JSON.stringify(scriptWithCuts));

        expect(result.success).toBe(true);
        if (result.success) {
            const cuts = result.data.cameraCuts || [];
            // 1 initial cut + 2 explicit cuts
            expect(cuts).toHaveLength(3);
            expect(cuts[0].cameraId).toBe('cam1');
            expect(cuts[1].cameraId).toBe('cam2');
            expect(cuts[2].transition).toBe('smooth');
        }
    });
});

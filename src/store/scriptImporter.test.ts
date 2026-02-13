import { describe, it, expect } from 'vitest';
import { parseScript } from './scriptImporter';
import { v4 as uuidv4 } from 'uuid';

describe('Script Importer', () => {
    it('should parse valid JSON script', () => {
        const json = JSON.stringify({
            meta: { title: 'Test Project' },
            environment: {
                ambientLight: { intensity: 1, color: '#ffffff' }
            },
            actors: [
                {
                    id: uuidv4(),
                    name: 'Char1',
                    type: 'character',
                    transform: {
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                    },
                    parts: [],
                    morphTargets: {},
                    visible: true
                }
            ],
            timeline: {
                duration: 60,
                cameraTrack: [],
                animationTracks: []
            },
            library: { clips: [] }
        });

        const result = parseScript(json);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.actors?.length).toBe(1);
            expect(result.data.actors![0].type).toBe('character');
        }
    });

    it('should fail on invalid JSON', () => {
        const result = parseScript('{ invalid: json }');
        expect(result.success).toBe(false);
    });
});

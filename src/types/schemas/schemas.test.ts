import { describe, it, expect } from 'vitest';
import { ProjectSchema } from './project';
import { CharacterSchema } from './character';
import { v4 as uuidv4 } from 'uuid';

describe('Schema Validation', () => {
    it('should validate a basic character', () => {
        const charData = {
            id: uuidv4(),
            name: 'Test Character',
            type: 'character',
            transform: {
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            },
            parts: [],
            morphTargets: {},
            visible: true
        };
        const result = CharacterSchema.safeParse(charData);
        if (!result.success) {
            console.error(result.error);
        }
        expect(result.success).toBe(true);
    });

    it('should validate a basic project', () => {
        const projectData = {
            meta: { title: 'Test Project' },
            environment: {
                ambientLight: { intensity: 1, color: '#ffffff' }
            },
            actors: [],
            timeline: {
                duration: 60,
                cameraTrack: []
            },
            library: { clips: [] }
        };
        const result = ProjectSchema.safeParse(projectData);
         if (!result.success) {
            console.error(result.error);
        }
        expect(result.success).toBe(true);
    });
});

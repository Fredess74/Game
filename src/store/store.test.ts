import { describe, it, expect } from 'vitest';
import { useStore } from './useStore';
import { CharacterSchema } from '../types/schemas/character';
import { v4 as uuidv4 } from 'uuid';

describe('useStore', () => {
    it('should initialize with default state', () => {
        const state = useStore.getState();
        expect(state.actors).toEqual([]);
        expect(state.timeline.duration).toBe(60);
    });

    it('should add a character actor', () => {
        const { addActor } = useStore.getState();
        addActor('character');
        const state = useStore.getState();
        expect(state.actors.length).toBe(1);
        const actor = state.actors[0];
        expect(actor.type).toBe('character');
        expect(actor.transform.position).toEqual([0, 0, 0]);
        // Verify Zod schema compliance
        const result = CharacterSchema.safeParse(actor);
        expect(result.success).toBe(true);
    });

    it('should update timeline tracks', () => {
        const { addActor, addKeyframe, setTime } = useStore.getState();
        const state = useStore.getState();
        const actor = state.actors[0]; // Assuming character from prev test

        addKeyframe(actor.id, 'transform.position', [1, 2, 3]);

        const newState = useStore.getState();
        expect(newState.timeline.animationTracks.length).toBe(1);
        expect(newState.timeline.animationTracks[0].keyframes[0].value).toEqual([1, 2, 3]);
    });
});

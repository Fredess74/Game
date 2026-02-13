import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Character, CharacterPart } from '../types';
import * as THREE from 'three';

interface ModularCharacterProps {
  actor: Character;
  isSelected: boolean;
  onClick: (e: any) => void;
}

const CharacterPartModel: React.FC<{ part: CharacterPart }> = ({ part }) => {
    const { scene } = useGLTF(part.modelUrl);
    const clone = useMemo(() => scene.clone(), [scene]);

    // TODO: Bone attachment logic would go here.
    // For now, we just parent it to the root, assuming pre-rigged or static mesh.
    // Real implementation requires finding the bone in the parent skeleton and attaching.

    return <primitive object={clone} />;
};

export const ModularCharacter: React.FC<ModularCharacterProps> = ({ actor, isSelected, onClick }) => {
    const group = useRef<THREE.Group>(null);
    const url = actor.baseModelUrl || 'https://models.readyplayer.me/64f0263b65574328519c2354.glb'; // Default fallback

    // Load Base Model
    const { scene, animations } = useGLTF(url);
    const clone = useMemo(() => scene.clone(), [scene]);
    const { actions } = useAnimations(animations, group);

    // Apply Morph Targets
    useEffect(() => {
        if (!clone) return;

        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetDictionary) {
                const mesh = child as THREE.Mesh;
                Object.entries(actor.morphTargets).forEach(([key, value]) => {
                    const index = mesh.morphTargetDictionary![key];
                    if (index !== undefined && mesh.morphTargetInfluences) {
                        mesh.morphTargetInfluences[index] = value;
                    }
                });
            }
        });
    }, [actor.morphTargets, clone]);

    // Apply Material/Color overrides if needed
    // (Logic omitted for brevity, but would iterate materials)

    return (
        <group
            ref={group}
            onClick={onClick}
            dispose={null}
        >
            {/* Visual Selection Ring/Highlight could go here */}
            {isSelected && (
                <mesh position={[0, 2, 0]}>
                    <ringGeometry args={[0.5, 0.6, 32]} />
                    <meshBasicMaterial color="yellow" side={THREE.DoubleSide} />
                </mesh>
            )}

            <primitive object={clone} />

            {/* Attached Parts */}
            {actor.parts.map((part, i) => (
                <CharacterPartModel key={`${actor.id}-part-${i}`} part={part} />
            ))}
        </group>
    );
};

// Preload default model to avoid suspense fallback on first load if possible
useGLTF.preload('https://models.readyplayer.me/64f0263b65574328519c2354.glb');

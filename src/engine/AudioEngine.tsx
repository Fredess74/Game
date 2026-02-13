import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as Tone from 'tone';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import type { Actor } from '../types';

const SoundEmitter: React.FC<{ actor: Actor }> = ({ actor }) => {
    const isPlaying = useStore((state) => state.isPlaying);
    const pannerRef = useRef<Tone.Panner3D | null>(null);
    const synthRef = useRef<Tone.Synth | null>(null);
    const loopRef = useRef<Tone.Loop | null>(null);

    useEffect(() => {
        // Initialize nodes
        const pos = actor.transform.position;
        pannerRef.current = new Tone.Panner3D(pos[0], pos[1], pos[2]).toDestination();

        // Simple synth for sound effects
        synthRef.current = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 1 }
        }).connect(pannerRef.current);

        // Play a simple pattern
        loopRef.current = new Tone.Loop((time) => {
            if (synthRef.current) {
                synthRef.current.triggerAttackRelease("C3", "8n", time);
            }
        }, "2n");

        return () => {
            loopRef.current?.dispose();
            synthRef.current?.dispose();
            pannerRef.current?.dispose();
        };
    }, []);

    // Sync loop state
    useEffect(() => {
        const startAudio = async () => {
            if (isPlaying) {
                 await Tone.start();
                 if (loopRef.current) {
                     loopRef.current.start(0);
                     Tone.Transport.start();
                 }
            } else {
                 if (loopRef.current) loopRef.current.stop();
                 Tone.Transport.stop();
            }
        };
        startAudio();
    }, [isPlaying]);

    // Update position
    useFrame(() => {
        if (pannerRef.current) {
            const pos = actor.transform.position;
            pannerRef.current.setPosition(pos[0], pos[1], pos[2]);
        }
    });

    return null;
};

export const AudioEngine: React.FC = () => {
    const { camera } = useThree();
    const actors = useStore((state) => state.actors);
    const soundActors = actors.filter(a => a.type === 'sound');

    // Persistent vectors to avoid garbage collection
    const forwardRef = useRef<THREE.Vector3 | null>(null);
    const upRef = useRef<THREE.Vector3 | null>(null);

    if (forwardRef.current === null) {
        forwardRef.current = new THREE.Vector3();
    }
    if (upRef.current === null) {
        upRef.current = new THREE.Vector3();
    }

    useFrame(() => {
        // Update listener position for spatial audio
        if (Tone.Listener.positionX) {
            Tone.Listener.positionX.value = camera.position.x;
            Tone.Listener.positionY.value = camera.position.y;
            Tone.Listener.positionZ.value = camera.position.z;
        }

        const forward = forwardRef.current!.set(0, 0, -1).applyQuaternion(camera.quaternion);
        const up = upRef.current!.set(0, 1, 0).applyQuaternion(camera.quaternion);

        if (Tone.Listener.forwardX) {
            Tone.Listener.forwardX.value = forward.x;
            Tone.Listener.forwardY.value = forward.y;
            Tone.Listener.forwardZ.value = forward.z;

            Tone.Listener.upX.value = up.x;
            Tone.Listener.upY.value = up.y;
            Tone.Listener.upZ.value = up.z;
        }
    });

    return (
        <>
            {soundActors.map(actor => (
                <SoundEmitter key={actor.id} actor={actor} />
            ))}
        </>
    );
};

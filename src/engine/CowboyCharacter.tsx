import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useGraph, createPortal, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Cowboy } from '../types/schemas/cowboy';

interface CowboyCharacterProps {
  actor: Cowboy;
  isSelected: boolean;
  onSelect: (e: ThreeEvent<MouseEvent>) => void;
}

// Helper component for attaching children to bones via Portal
const AttachToBone = ({ bone, children }: { bone: THREE.Object3D | null, children: React.ReactNode }) => {
    if (!bone) return null;
    return createPortal(children, bone);
};

// Procedural Hat Component
const CowboyHat: React.FC = () => {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0.02]} scale={1.1}>
      {/* Brim */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.01, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.10, 0.12, 0.16, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
       {/* Band */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.122, 0.122, 0.03, 32]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Procedural Revolver Component
const Revolver: React.FC = () => {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0.05, 0.05, 0.05]} scale={1.5}>
      {/* Handle */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.04, 0.12, 0.03]} />
          <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Barrel */}
      <mesh position={[0.1, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cylinder */}
      <mesh position={[0.02, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 6]} />
          <meshStandardMaterial color="#333" metalness={0.7} />
      </mesh>
    </group>
  );
};

export const CowboyCharacter: React.FC<CowboyCharacterProps> = ({ actor, isSelected, onSelect }) => {
  const group = useRef<THREE.Group>(null);

  // Use a standard RPM model as base.
  const { scene, animations } = useGLTF('https://models.readyplayer.me/64f0263b65574328519c2354.glb');

  // Clone scene for unique instance
  const clone = useMemo(() => scene.clone(), [scene]);

  // Get graph of nodes to find bones
  const { nodes } = useGraph(clone);

  const { actions, names } = useAnimations(animations, group);

  // Typed Refs for specific bones for manual manipulation
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const rightHandBoneRef = useRef<THREE.Object3D | null>(null);
  const rightArmBoneRef = useRef<THREE.Object3D | null>(null);
  const spineBoneRef = useRef<THREE.Object3D | null>(null);

  // Identify bones
  useEffect(() => {
    if (nodes) {
        // Try to find standard bone names (Mixamo/RPM naming conventions)
        headBoneRef.current = nodes.Head || nodes.mixamorigHead || null;
        rightHandBoneRef.current = nodes.RightHand || nodes.mixamorigRightHand || null;
        rightArmBoneRef.current = nodes.RightArm || nodes.mixamorigRightArm || null;
        spineBoneRef.current = nodes.Spine || nodes.mixamorigSpine || null;
    }
  }, [nodes]);

  // Animation & Pose Logic
  useFrame((state, delta) => {
      // 1. Play Animations
      const animName = names.find(n => n.toLowerCase().includes(actor.animation?.toLowerCase() || 'idle'));

      if (animName && actions[animName]) {
          const action = actions[animName];
          if (action && !action.isRunning()) {
              Object.values(actions).forEach(a => {
                  if (a !== action) a?.fadeOut(0.5);
              });
              action.reset().fadeIn(0.5).play();
          }
      } else {
           const idleAnim = names.find(n => n.toLowerCase().includes('idle'));
           if (idleAnim && actions[idleAnim] && !actions[idleAnim]?.isRunning()) {
                Object.values(actions).forEach(a => {
                  if (a !== actions[idleAnim]) a?.fadeOut(0.5);
                });
               actions[idleAnim]?.reset().fadeIn(0.5).play();
           }
      }

      // 2. Procedural Overrides (Inverse Kinematics / Manual Bone Rotation)
      if (actor.animation === 'draw_revolver') {
           if (rightArmBoneRef.current && rightHandBoneRef.current) {
               // Lift arm
               rightArmBoneRef.current.rotation.x = THREE.MathUtils.lerp(rightArmBoneRef.current.rotation.x, 1.5, 0.1);
               rightArmBoneRef.current.rotation.z = THREE.MathUtils.lerp(rightArmBoneRef.current.rotation.z, -0.5, 0.1);
               // Point hand
               rightHandBoneRef.current.rotation.x = THREE.MathUtils.lerp(rightHandBoneRef.current.rotation.x, 0, 0.1);
           }
      } else if (actor.animation === 'aim_revolver') {
           if (rightArmBoneRef.current) {
               // Aim forward
               rightArmBoneRef.current.rotation.x = THREE.MathUtils.lerp(rightArmBoneRef.current.rotation.x, 1.6, 0.1);
               rightArmBoneRef.current.rotation.z = THREE.MathUtils.lerp(rightArmBoneRef.current.rotation.z, 0, 0.1);
           }
      }

      // 3. Facial Mimicry (Morph Targets)
      clone.traverse((child) => {
         if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetDictionary && (child as THREE.Mesh).morphTargetInfluences) {
            const mesh = child as THREE.Mesh;

            // Default "Face" mapping (RPM/ARKit standards)
            Object.entries(actor.morphTargets).forEach(([key, value]) => {
                const index = mesh.morphTargetDictionary![key];
                if (index !== undefined && mesh.morphTargetInfluences) {
                    mesh.morphTargetInfluences[index] = value;
                }
            });

            // Emotion presets
            if (actor.animation === 'emote_happy') {
                const smile = mesh.morphTargetDictionary!['mouthSmile'];
                if (smile !== undefined && mesh.morphTargetInfluences) mesh.morphTargetInfluences[smile] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[smile], 1, 0.1);
            }
            if (actor.animation === 'emote_angry') {
                 const frown = mesh.morphTargetDictionary!['browDownLeft'];
                 if (frown !== undefined && mesh.morphTargetInfluences) mesh.morphTargetInfluences[frown] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[frown], 1, 0.1);
            }
         }
      });
  });

  return (
    <group ref={group} dispose={null} onClick={onSelect}>
      {/* Visual Selection Ring */}
      {isSelected && (
        <mesh position={[0, 2.0, 0]}>
            <ringGeometry args={[0.4, 0.45, 32]} />
            <meshBasicMaterial color="#ff9900" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      <primitive object={clone} />

      <AttachToBone bone={headBoneRef.current}>
        {actor.equipment.hat && <CowboyHat />}
      </AttachToBone>

      <AttachToBone bone={rightHandBoneRef.current}>
        {actor.equipment.revolver === 'inHand' && <Revolver />}
      </AttachToBone>

      <AttachToBone bone={spineBoneRef.current}>
        {actor.equipment.revolver === 'holstered' && (
             <group position={[0.2, 0, 0.1]} rotation={[0, 0, Math.PI/2]}>
               <Revolver />
            </group>
        )}
      </AttachToBone>

    </group>
  );
};

// Preload
useGLTF.preload('https://models.readyplayer.me/64f0263b65574328519c2354.glb');

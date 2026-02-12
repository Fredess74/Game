import React, { useRef, useMemo } from 'react';
import { Capsule, Sphere, Box } from '@react-three/drei';
import type { Actor, Pose, Vector3 } from '../types';
import { MaterialComponent } from './MaterialComponent';
import { Face } from './humanoid/Face';
import { CLOTHING_ASSETS } from './clothing/ClothingAssets';

interface HumanoidProps {
    actor: Actor;
    isSelected: boolean;
    onClick: (e: any) => void;
}

const getRotation = (pose: Pose | undefined, key: string, defaultVal: [number, number, number]): [number, number, number] => {
  if (!pose || !pose[key]) return defaultVal;
  const p = pose[key];
  return [p.x, p.y, p.z];
};

export const Humanoid: React.FC<HumanoidProps> = ({ actor, isSelected, onClick }) => {
    const pose = actor.pose;
    const clothing = actor.clothing || {};
    const emotion = actor.emotion || 'neutral';

    // Clothing Components
    const Headwear = clothing.head && CLOTHING_ASSETS.head[clothing.head as keyof typeof CLOTHING_ASSETS.head];
    const Top = clothing.top && CLOTHING_ASSETS.top[clothing.top as keyof typeof CLOTHING_ASSETS.top];
    const Bottom = clothing.bottom && CLOTHING_ASSETS.bottom[clothing.bottom as keyof typeof CLOTHING_ASSETS.bottom];
    const Shoes = clothing.shoes && CLOTHING_ASSETS.shoes[clothing.shoes as keyof typeof CLOTHING_ASSETS.shoes];
    const Accessory = clothing.accessory && CLOTHING_ASSETS.accessory[clothing.accessory as keyof typeof CLOTHING_ASSETS.accessory];

    return (
        <group onClick={onClick}>
             {/* -- ROOT / HIPS -- */}
             <group position={[0, 0, 0]}>

                 {/* -- TORSO -- */}
                 <group position={[0, 0.45, 0]} rotation={getRotation(pose, 'torso', [0, 0, 0])}>
                     <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                         <capsuleGeometry args={[0.24, 0.5, 4, 8]} />
                         <MaterialComponent actor={actor} isSelected={isSelected} />
                     </mesh>

                     {/* Clothing: Top */}
                     {Top && <Top />}

                     {/* Clothing: Accessory (Backpack) */}
                     {Accessory && <Accessory />}

                     {/* -- HEAD -- */}
                     <group position={[0, 0.65, 0]} rotation={getRotation(pose, 'head', [0, 0, 0])}>
                         <mesh castShadow receiveShadow>
                             <sphereGeometry args={[0.2, 16, 16]} />
                             <MaterialComponent actor={actor} isSelected={isSelected} />
                         </mesh>

                         {/* Face */}
                         <Face emotion={emotion} />

                         {/* Clothing: Headwear */}
                         {Headwear && <Headwear />}

                         {/* Clothing: Accessory (Glasses) */}
                         {/* Note: We put glasses here if it's "glasses", but schema just has one accessory slot.
                             We can just render Accessory if it fits head context, but simpler to just put it on Torso or use specific logic.
                             For now, let's assume specific accessories attach to specific bones.
                             Our Accessory map has "sunglasses" (head) and "backpack" (torso).
                         */}
                         {clothing.accessory === 'sunglasses' && CLOTHING_ASSETS.accessory.sunglasses ? <CLOTHING_ASSETS.accessory.sunglasses /> : null}
                     </group>

                     {/* -- ARMS -- */}
                     {/* Right Arm */}
                     <group position={[0.3, 0.35, 0]} rotation={getRotation(pose, 'rightUpperArm', [0, 0, -0.2])}>
                         <mesh position={[0, -0.15, 0]}>
                             <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
                             <MaterialComponent actor={actor} isSelected={isSelected} />
                         </mesh>
                         <group position={[0, -0.3, 0]} rotation={getRotation(pose, 'rightForearm', [0, 0, 0])}>
                             <mesh position={[0, -0.15, 0]}>
                                 <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
                                 <MaterialComponent actor={actor} isSelected={isSelected} />
                             </mesh>
                             <group position={[0, -0.3, 0]}>
                                 <mesh position={[0, -0.05, 0]}>
                                     <sphereGeometry args={[0.06]} />
                                     <MaterialComponent actor={actor} isSelected={isSelected} />
                                 </mesh>
                             </group>
                         </group>
                     </group>

                     {/* Left Arm */}
                     <group position={[-0.3, 0.35, 0]} rotation={getRotation(pose, 'leftUpperArm', [0, 0, 0.2])}>
                         <mesh position={[0, -0.15, 0]}>
                             <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
                             <MaterialComponent actor={actor} isSelected={isSelected} />
                         </mesh>
                         <group position={[0, -0.3, 0]} rotation={getRotation(pose, 'leftForearm', [0, 0, 0])}>
                             <mesh position={[0, -0.15, 0]}>
                                 <capsuleGeometry args={[0.06, 0.3, 4, 8]} />
                                 <MaterialComponent actor={actor} isSelected={isSelected} />
                             </mesh>
                             <group position={[0, -0.3, 0]}>
                                 <mesh position={[0, -0.05, 0]}>
                                     <sphereGeometry args={[0.06]} />
                                     <MaterialComponent actor={actor} isSelected={isSelected} />
                                 </mesh>
                             </group>
                         </group>
                     </group>
                 </group>

                 {/* -- LEGS -- */}
                 {/* Clothing: Bottom (Hips) */}
                 {Bottom && <Bottom />}

                 {/* Right Leg */}
                 <group position={[0.12, 0, 0]} rotation={getRotation(pose, 'rightThigh', [0, 0, 0])}>
                     <mesh position={[0, -0.25, 0]}>
                         <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
                         <MaterialComponent actor={actor} isSelected={isSelected} />
                     </mesh>
                     <group position={[0, -0.5, 0]} rotation={getRotation(pose, 'rightShin', [0, 0, 0])}>
                         <mesh position={[0, -0.25, 0]}>
                             <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
                             <MaterialComponent actor={actor} isSelected={isSelected} />
                         </mesh>
                         <group position={[0, -0.5, 0]}>
                             {/* Foot / Shoe */}
                             {Shoes ? <Shoes /> : (
                               <mesh position={[0, -0.05, 0.05]}>
                                   <boxGeometry args={[0.1, 0.1, 0.2]} />
                                   <MaterialComponent actor={actor} isSelected={isSelected} />
                               </mesh>
                             )}
                         </group>
                     </group>
                 </group>

                 {/* Left Leg */}
                 <group position={[-0.12, 0, 0]} rotation={getRotation(pose, 'leftThigh', [0, 0, 0])}>
                     <mesh position={[0, -0.25, 0]}>
                         <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
                         <MaterialComponent actor={actor} isSelected={isSelected} />
                     </mesh>
                     <group position={[0, -0.5, 0]} rotation={getRotation(pose, 'leftShin', [0, 0, 0])}>
                         <mesh position={[0, -0.25, 0]}>
                             <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
                             <MaterialComponent actor={actor} isSelected={isSelected} />
                         </mesh>
                         <group position={[0, -0.5, 0]}>
                             {/* Foot / Shoe */}
                             {Shoes ? <Shoes /> : (
                               <mesh position={[0, -0.05, 0.05]}>
                                   <boxGeometry args={[0.1, 0.1, 0.2]} />
                                   <MaterialComponent actor={actor} isSelected={isSelected} />
                               </mesh>
                             )}
                         </group>
                     </group>
                 </group>

             </group>
        </group>
    );
};

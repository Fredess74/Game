import React from 'react';
import { Box, Sphere, Capsule, Cylinder, Cone, Torus, Plane, Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import type { Actor } from '../types';

interface SceneObjectProps {
  actor: Actor;
}

const MaterialComponent: React.FC<{ actor: Actor; isSelected: boolean }> = ({ actor, isSelected }) => {
    return (
        <meshStandardMaterial
            color={isSelected ? '#ef4444' : actor.color}
            emissive={actor.emissive}
            emissiveIntensity={actor.emissiveIntensity}
            transparent={actor.opacity < 1}
            opacity={actor.opacity}
            metalness={actor.metalness ?? 0.1}
            roughness={actor.roughness ?? 0.8}
            wireframe={false}
        />
    );
};

const Humanoid: React.FC<{ actor: Actor; isSelected: boolean; onClick: (e: any) => void }> = ({ actor, isSelected, onClick }) => {
    return (
        <group onClick={onClick}>
             {/* Body */}
             <group position={[0, 0.75, 0]}>
                 <Capsule args={[0.25, 0.6, 4, 8]} castShadow receiveShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                 </Capsule>

                 {/* Head */}
                 <mesh position={[0, 0.65, 0]} castShadow>
                      <sphereGeometry args={[0.2, 16, 16]} />
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                 </mesh>

                 {/* Arms */}
                 <group position={[0.35, 0.1, 0]} rotation={[0, 0, -0.2]}>
                    <Capsule args={[0.08, 0.4, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
                 <group position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.2]}>
                    <Capsule args={[0.08, 0.4, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>

                 {/* Legs */}
                 <group position={[0.15, -0.6, 0]}>
                    <Capsule args={[0.09, 0.5, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
                 <group position={[-0.15, -0.6, 0]}>
                    <Capsule args={[0.09, 0.5, 4, 8]} castShadow>
                        <MaterialComponent actor={actor} isSelected={isSelected} />
                    </Capsule>
                 </group>
             </group>
        </group>
    );
};

export const SceneObject: React.FC<SceneObjectProps> = ({ actor }) => {
  const selectedId = useStore((state) => state.selectedId);
  const setSelected = useStore((state) => state.setSelected);
  const isCameraView = useStore((state) => state.isCameraView);

  const isSelected = selectedId === actor.id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelected(actor.id);
  };

  if (!actor.visible) return null;

  // Lights
  if (actor.type === 'light') {
      return (
          <group onClick={handleClick}>
              {/* Actual Light */}
              {actor.lightType === 'point' && <pointLight color={actor.color} intensity={actor.intensity ?? 1} castShadow distance={20} decay={2} />}
              {actor.lightType === 'spot' && <spotLight color={actor.color} intensity={actor.intensity ?? 1} castShadow angle={0.5} penumbra={0.5} />}
              {actor.lightType === 'directional' && <directionalLight color={actor.color} intensity={actor.intensity ?? 1} castShadow />}

              {/* Editor Visualizer */}
              {!isCameraView && (
                  <mesh>
                      <sphereGeometry args={[0.2, 8, 8]} />
                      <meshBasicMaterial color={actor.color} wireframe />
                      <Html position={[0, 0.5, 0]}>
                        <div className="text-[10px] text-yellow-500 font-mono bg-black/50 px-1 rounded">{actor.lightType?.toUpperCase()}</div>
                      </Html>
                  </mesh>
              )}
          </group>
      );
  }

  // Shapes
  const renderShape = () => {
      const commonProps = {
          onClick: handleClick,
          castShadow: true,
          receiveShadow: true,
      };

      // Humanoid / Character
      if (actor.type === 'character' || actor.shape === 'humanoid') {
          return <Humanoid actor={actor} isSelected={isSelected} onClick={handleClick} />;
      }

      // Minecraft style char
      if (actor.shape === 'cube_character') {
          return (
              <group onClick={handleClick}>
                  {/* Head */}
                  <Box args={[0.4, 0.4, 0.4]} position={[0, 1.4, 0]} castShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                  </Box>
                  {/* Body */}
                  <Box args={[0.6, 0.8, 0.3]} position={[0, 0.8, 0]} castShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                  </Box>
                  {/* Arms */}
                  <Box args={[0.2, 0.8, 0.2]} position={[0.4, 0.8, 0]} castShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                  </Box>
                   <Box args={[0.2, 0.8, 0.2]} position={[-0.4, 0.8, 0]} castShadow>
                      <MaterialComponent actor={actor} isSelected={isSelected} />
                  </Box>
              </group>
          )
      }

      switch (actor.shape) {
          case 'box':
              return <Box {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Box>;
          case 'sphere':
              return <Sphere {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Sphere>;
          case 'capsule':
              return <Capsule {...commonProps} args={[0.5, 1, 4, 8]}><MaterialComponent actor={actor} isSelected={isSelected} /></Capsule>;
          case 'cylinder':
              return <Cylinder {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Cylinder>;
          case 'cone':
              return <Cone {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Cone>;
          case 'torus':
              return <Torus {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Torus>;
          case 'plane':
              return <Plane {...commonProps} args={[5, 5]} rotation={[-Math.PI/2, 0, 0]}><MaterialComponent actor={actor} isSelected={isSelected} /></Plane>;
          default:
              return <Box {...commonProps}><MaterialComponent actor={actor} isSelected={isSelected} /></Box>;
      }
  };

  return (
    <group>
        {renderShape()}
        {isSelected && (
            <Html position={[0, 2, 0]} center>
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap border border-brand-green/50 z-50">
                    {actor.name}
                </div>
            </Html>
        )}
    </group>
  );
};

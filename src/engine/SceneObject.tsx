import React from 'react';
import { Box, Sphere, Capsule, Cylinder, Cone, Torus, Plane, Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import type { Actor } from '../types';
import { MaterialComponent } from './MaterialComponent';
import { Humanoid } from './Humanoid';
import { CubeCharacter } from './CubeCharacter';

interface SceneObjectProps {
  actor: Actor;
}

const PrimitiveShape: React.FC<{
    component: any;
    actor: Actor;
    isSelected: boolean;
    onClick: (e: any) => void;
    [key: string]: any;
}> = ({ component: Component, actor, isSelected, onClick, ...props }) => (
    <Component onClick={onClick} castShadow receiveShadow {...props}>
        <MaterialComponent actor={actor} isSelected={isSelected} />
    </Component>
);

const SHAPE_COMPONENTS: Record<string, React.FC<any>> = {
    humanoid: Humanoid,
    cube_character: CubeCharacter,
    box: (props) => <PrimitiveShape component={Box} {...props} />,
    sphere: (props) => <PrimitiveShape component={Sphere} {...props} />,
    capsule: (props) => <PrimitiveShape component={Capsule} args={[0.5, 1, 4, 8]} {...props} />,
    cylinder: (props) => <PrimitiveShape component={Cylinder} {...props} />,
    cone: (props) => <PrimitiveShape component={Cone} {...props} />,
    torus: (props) => <PrimitiveShape component={Torus} {...props} />,
    plane: (props) => <PrimitiveShape component={Plane} args={[5, 5]} rotation={[-Math.PI/2, 0, 0]} {...props} />,
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
      // Determine the correct renderer key
      // If the actor is a character, it forces the humanoid shape unless explicitly overridden?
      // The original logic was: if (actor.type === 'character' || actor.shape === 'humanoid') -> Humanoid
      const shapeKey = (actor.type === 'character' || actor.shape === 'humanoid')
          ? 'humanoid'
          : actor.shape;

      const ShapeComponent = SHAPE_COMPONENTS[shapeKey] || SHAPE_COMPONENTS['box'];

      return (
          <ShapeComponent
              actor={actor}
              isSelected={isSelected}
              onClick={handleClick}
          />
      );
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

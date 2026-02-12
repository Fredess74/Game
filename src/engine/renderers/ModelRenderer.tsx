import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import type { ActorRendererProps } from '../registry/ActorRegistry';
import { MaterialComponent } from '../MaterialComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GLTFModel = ({ url, actor, isSelected, onSelect }: any) => {
  const { scene } = useGLTF(url);
  // Clone scene to avoid shared reference issues if multiple actors use same model
  // primitive object={scene} renders the same instance
  // For multiple instances, we should use <primitive object={scene.clone()} /> but requires manual cloning
  // Or use Clone from drei if imported. But useGLTF caches scenes.
  // For now let's trust simple primitive for single instance usage.
  return (
    <primitive object={scene} onClick={onSelect} castShadow receiveShadow>
        <MaterialComponent actor={actor} isSelected={isSelected} />
    </primitive>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OBJModel = ({ url, actor, isSelected, onSelect }: any) => {
  const obj = useLoader(OBJLoader, url);
  return (
    <primitive object={obj} onClick={onSelect} castShadow receiveShadow>
        <MaterialComponent actor={actor} isSelected={isSelected} />
    </primitive>
  );
};

export const ModelRenderer: React.FC<ActorRendererProps> = ({ actor, isSelected, onSelect }) => {
  if (!actor.model?.url) return null;

  return (
    <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="red" wireframe /></mesh>}>
        {actor.model.format === 'gltf' || actor.model.format === 'glb' ? (
            <GLTFModel url={actor.model.url} actor={actor} isSelected={isSelected} onSelect={onSelect} />
        ) : actor.model.format === 'obj' ? (
            <OBJModel url={actor.model.url} actor={actor} isSelected={isSelected} onSelect={onSelect} />
        ) : (
            <mesh onClick={onSelect}><boxGeometry /><meshStandardMaterial color="gray" /></mesh>
        )}
    </Suspense>
  );
};

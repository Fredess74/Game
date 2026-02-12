import React, { useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const TexturedSky = ({ textureUrl }: { textureUrl: string }) => {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} />
    </mesh>
  );
};

export const Sky = () => {
  const sky = useStore((state) => state.environment.sky);

  return (
    <>
      {sky.texture ? (
        <React.Suspense fallback={<color attach="background" args={[sky.color]} />}>
           <TexturedSky textureUrl={sky.texture} />
        </React.Suspense>
      ) : (
        <color attach="background" args={[sky.color]} />
      )}
    </>
  );
};

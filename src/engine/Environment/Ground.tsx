import React, { useEffect } from 'react';
import { Grid, useTexture } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const TexturedPlane = ({ textureUrl, color, opacity, onClick }: { textureUrl: string, color: string, opacity: number, onClick: (e: any) => void }) => {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onClick}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        map={texture}
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
};

export const Ground = () => {
  const ground = useStore((state) => state.environment.ground);
  const setSelected = useStore((state) => state.setSelected);

  const handleBackgroundClick = (e: any) => {
    e.stopPropagation();
    setSelected(null);
  };

  return (
    <group position={[0, -0.02, 0]}>
       {ground.texture ? (
         <React.Suspense fallback={<mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color={ground.color} /></mesh>}>
            <TexturedPlane
                textureUrl={ground.texture}
                color={ground.color}
                opacity={ground.opacity}
                onClick={handleBackgroundClick}
            />
         </React.Suspense>
       ) : (
         <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={handleBackgroundClick}>
           <planeGeometry args={[100, 100]} />
           <meshStandardMaterial
             color={ground.color}
             transparent={ground.opacity < 1}
             opacity={ground.opacity}
           />
         </mesh>
       )}

       {ground.gridVisible && (
         <Grid
           infiniteGrid
           sectionColor="#4ade80"
           cellColor="#ffffff"
           fadeDistance={30}
           position={[0, 0.01, 0]}
         />
       )}
    </group>
  );
};

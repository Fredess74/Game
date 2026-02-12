import React from 'react';
import type { EmotionType } from '../../types';

interface FaceProps {
  emotion?: EmotionType;
}

const Eye: React.FC<{ position: [number, number, number], shape?: 'circle' | 'wide' | 'squint' }> = ({ position, shape = 'circle' }) => {
  const scale = shape === 'wide' ? 1.2 : shape === 'squint' ? 0.5 : 1;
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.035 * scale, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

const Eyebrow: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={[0.08, 0.015, 0.01]} />
    <meshStandardMaterial color="black" />
  </mesh>
);

const Mouth: React.FC<{ emotion: EmotionType }> = ({ emotion }) => {
  if (emotion === 'happy') {
    return (
      <mesh position={[0, -0.1, 0.16]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="black" />
      </mesh>
    );
  }
  if (emotion === 'sad') {
    return (
      <mesh position={[0, -0.15, 0.16]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="black" />
      </mesh>
    );
  }
  if (emotion === 'surprised') {
    return (
      <mesh position={[0, -0.12, 0.16]}>
        <torusGeometry args={[0.04, 0.015, 8, 16, Math.PI * 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    );
  }
  if (emotion === 'angry') {
    return (
      <mesh position={[0, -0.12, 0.16]}>
         <boxGeometry args={[0.1, 0.02, 0.01]} />
         <meshStandardMaterial color="black" />
      </mesh>
    );
  }
  // Neutral
  return (
      <mesh position={[0, -0.12, 0.16]}>
         <boxGeometry args={[0.08, 0.015, 0.01]} />
         <meshStandardMaterial color="black" />
      </mesh>
  );
};

export const Face: React.FC<FaceProps> = ({ emotion = 'neutral' }) => {
  return (
    <group position={[0, 0, 0]}>
       {/* Eyes */}
       <Eye position={[0.08, 0.02, 0.17]} shape={emotion === 'surprised' ? 'wide' : 'circle'} />
       <Eye position={[-0.08, 0.02, 0.17]} shape={emotion === 'surprised' ? 'wide' : 'circle'} />

       {/* Eyebrows for Angry/Sad */}
       {emotion === 'angry' && (
         <>
           <Eyebrow position={[0.08, 0.07, 0.17]} rotation={[0, 0, 0.3]} />
           <Eyebrow position={[-0.08, 0.07, 0.17]} rotation={[0, 0, -0.3]} />
         </>
       )}
       {emotion === 'sad' && (
         <>
           <Eyebrow position={[0.08, 0.07, 0.17]} rotation={[0, 0, -0.2]} />
           <Eyebrow position={[-0.08, 0.07, 0.17]} rotation={[0, 0, 0.2]} />
         </>
       )}
       {/* Mouth */}
       <Mouth emotion={emotion} />
    </group>
  );
};

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const Rain = ({ count }: { count: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 50,
        speed: 0.3 + Math.random() * 0.3
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (particle.y < 0) {
        particle.y = 20;
        particle.x = (Math.random() - 0.5) * 50;
        particle.z = (Math.random() - 0.5) * 50;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.z = 0.1;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.03, 0.6, 0.03]} />
      <meshBasicMaterial color="#aabbcc" transparent opacity={0.6} />
    </instancedMesh>
  );
};

const Snow = ({ count }: { count: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 50,
        speed: 0.05 + Math.random() * 0.1,
        offset: Math.random() * 100
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (particle.y < 0) {
        particle.y = 20;
        particle.x = (Math.random() - 0.5) * 50;
        particle.z = (Math.random() - 0.5) * 50;
      }

      const sway = Math.sin(time + particle.offset) * 0.5;
      dummy.position.set(particle.x + sway, particle.y, particle.z + sway * 0.5);

      dummy.rotation.x = time * 0.5 + particle.offset;
      dummy.rotation.y = time * 0.3 + particle.offset;

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
};

export const Weather = () => {
  const weather = useStore((state) => state.environment.weather);

  if (weather.type === 'none') return null;

  // Calculate count based on intensity (0-1). Max 2000 particles.
  // Ensure at least some particles if type is not none.
  const count = Math.floor(Math.max(0.1, weather.intensity) * 2000);

  return (
    <group>
      {weather.type === 'rain' && <Rain count={count} />}
      {weather.type === 'snow' && <Snow count={count} />}
    </group>
  );
};

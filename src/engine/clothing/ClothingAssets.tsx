import React from 'react';

// Common Materials (can be parameterized later)
const RedMat = () => <meshStandardMaterial color="#d32f2f" />;
const BlueMat = () => <meshStandardMaterial color="#1976d2" />;
const BlackMat = () => <meshStandardMaterial color="#212121" />;
const WhiteMat = () => <meshStandardMaterial color="#eeeeee" />;
const DenimMat = () => <meshStandardMaterial color="#1565c0" />;
const KhakiMat = () => <meshStandardMaterial color="#fdd835" />;
const LeatherMat = () => <meshStandardMaterial color="#5d4037" roughness={0.4} />;

// --- HEADWEAR ---
export const BaseballCap: React.FC = () => (
  <group position={[0, 0.12, 0]}>
    {/* Dome */}
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <BlueMat />
    </mesh>
    {/* Visor */}
    <mesh position={[0, 0, 0.18]} rotation={[0.1, 0, 0]}>
      <boxGeometry args={[0.22, 0.02, 0.15]} />
      <BlueMat />
    </mesh>
  </group>
);

export const Beanie: React.FC = () => (
  <group position={[0, 0.15, 0]}>
    <mesh>
      <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
      <RedMat />
    </mesh>
    {/* Cuff */}
    <mesh position={[0, -0.05, 0]}>
      <torusGeometry args={[0.21, 0.04, 8, 16]} />
      <RedMat />
    </mesh>
  </group>
);

// --- TOPS ---
// Rendered relative to Torso group (approx height 0.6, width 0.25)
export const TShirt: React.FC = () => (
  <group>
    <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.26, 0.62, 4, 8]} />
        <WhiteMat />
    </mesh>
  </group>
);

export const Hoodie: React.FC = () => (
  <group>
    <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.27, 0.62, 4, 8]} />
        <meshStandardMaterial color="#9c27b0" />
    </mesh>
    {/* Hood (on back) */}
    <mesh position={[0, 0.25, -0.15]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 16]} />
        <meshStandardMaterial color="#9c27b0" />
    </mesh>
  </group>
);

// --- BOTTOMS ---
// Rendered relative to Pelvis/Legs area. Since legs are separate,
// we might need to attach these to the Thigh bone or just overlay the hip area.
// For simplicity, we'll assume the Humanoid logic handles leg visibility or color override,
// but here we provide meshes that sit on the hips.
// Wait, separate legs mean Pants need to be on the legs.
// Strategy: The Humanoid component will use these assets *per limb* if needed,
// or these assets represent the *hip* part, and we need separate Leg meshes.
// Let's make these assets strictly for the "Hip/Pelvis" area for now,
// and the Humanoid component will handle the leg color/mesh swappage.
// Actually, to keep it simple: "Jeans" = Blue material on legs.
// "Shorts" = Skin + Short pants mesh.
// Let's provide geometries for the Hip area.
export const JeansHip: React.FC = () => (
    <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.3, 16]} />
        <DenimMat />
    </mesh>
);

export const ShortsHip: React.FC = () => (
    <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.3, 16]} />
        <KhakiMat />
    </mesh>
);

// --- SHOES ---
// Attached to Foot group
export const Sneakers: React.FC = () => (
  <group position={[0, -0.05, 0.05]}>
      <mesh>
        <boxGeometry args={[0.12, 0.1, 0.25]} />
        <WhiteMat />
      </mesh>
      {/* Tongue */}
      <mesh position={[0, 0.05, 0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          <WhiteMat />
      </mesh>
  </group>
);

export const Boots: React.FC = () => (
  <group position={[0, 0.05, 0.05]}>
      <mesh>
        <boxGeometry args={[0.14, 0.3, 0.26]} />
        <LeatherMat />
      </mesh>
  </group>
);

// --- ACCESSORIES ---
export const Sunglasses: React.FC = () => (
  <group position={[0, 0.05, 0.18]}>
      {/* Frames */}
      <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.02]} />
          <BlackMat />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.02]} />
          <BlackMat />
      </mesh>
      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.01, 0.02]} />
          <BlackMat />
      </mesh>
  </group>
);

export const Backpack: React.FC = () => (
  <group position={[0, 0, -0.25]}>
      <mesh>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#ff5722" />
      </mesh>
  </group>
);

export const CLOTHING_ASSETS = {
  head: {
    cap: BaseballCap,
    beanie: Beanie,
  },
  top: {
    tshirt: TShirt,
    hoodie: Hoodie,
  },
  bottom: {
    jeans: JeansHip,
    shorts: ShortsHip,
  },
  shoes: {
    sneakers: Sneakers,
    boots: Boots,
  },
  accessory: {
    sunglasses: Sunglasses,
    backpack: Backpack,
  }
};

'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float } from '@react-three/drei';

function FloatingGlassShape() {
  const meshRef = useRef();

  // Ye function har frame pe shape ko halka sa rotate karega
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* Ye material ekdum premium glass jaisa look dega */}
        <MeshTransmissionMaterial 
          thickness={0.5}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.04}
          backside={true}
          color="#ffd6e8" // Halka pinkish Amina brand tint
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* Environment se glass pe real-world reflections aayengi */}
        <Environment preset="city" />
        <FloatingGlassShape />
      </Canvas>
    </div>
  );
}
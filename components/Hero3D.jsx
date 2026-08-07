'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StaticPerfumeBottle() {
  const meshRef = useRef();

  // Abstract but elegant shape (e.g., a flattened, curved form)
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.5);
  shape.lineTo(0, 0.8);
  shape.quadraticCurveTo(0, 0, 0.4, 0.2);
  shape.lineTo(0.8, 0);
  shape.quadraticCurveTo(1, 0.8, 0.8, 1.5);
  shape.lineTo(0, 1.5);

  const extrudeSettings = {
    steps: 2,
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  return (
    <mesh ref={meshRef} scale={1.5} geometry={geometry} position={[0, 0, 0]}>
        <MeshTransmissionMaterial 
          thickness={0.2}
          roughness={0.1}
          transmission={0.6} 
          ior={1.5}
          chromaticAberration={0.05}
          backside={true}
          color="#f0e6f6" // Elegant, soft tint
        />
      </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="warehouse" />
        <StaticPerfumeBottle />
      </Canvas>
    </div>
  );
}
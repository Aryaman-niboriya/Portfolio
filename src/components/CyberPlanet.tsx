"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export const CyberPlanet = () => {
  const planetRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Points>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);

  const particleCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 2.5 + Math.random() * 1.5;
        pos[i * 3] = Math.cos(theta) * radius;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
      planetRef.current.rotation.x += delta * 0.1;
    }
    if (ringRef.current) {
        ringRef.current.rotation.y -= delta * 0.15;
    }
    if (auraRef.current) {
        auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group>
      {/* Central Planet */}
      <mesh ref={planetRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#00ff41" transparent opacity={0.1} />
      </mesh>
      
      {/* Asteroid Ring */}
      <group rotation={[Math.PI / 8, 0, 0]}>
        <Points ref={ringRef} positions={positions} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#00ff41"
            size={0.03}
            sizeAttenuation
            depthWrite={false}
            opacity={0.8}
          />
        </Points>
      </group>
    </group>
  );
};

"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export const BlackHole = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (particlesRef.current) {
        particlesRef.current.rotation.y += delta * 1.2;
        // Vortex effect
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for(let i = 0; i < particleCount; i++) {
            const x = posArray[i * 3];
            const z = posArray[i * 3 + 2];
            const dist = Math.sqrt(x*x + z*z);
            if(dist > 0.5) {
                // Pull towards center
                posArray[i * 3] -= (x / dist) * 0.01;
                posArray[i * 3 + 2] -= (z / dist) * 0.01;
            } else {
                // Respawn at edge
                const angle = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 2;
                posArray[i * 3] = Math.cos(angle) * radius;
                posArray[i * 3 + 2] = Math.sin(angle) * radius;
            }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Event Horizon */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Accretion Disk */}
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#00ff41"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
        />
      </Points>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#00ff41" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  );
};

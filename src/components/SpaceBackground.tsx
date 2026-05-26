"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Center, Text3D } from "@react-three/drei";
import * as THREE from "three";

function BinaryStars({ count = 5000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ff41"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

const BinaryParticle = ({ position }: { position: [number, number, number] }) => {
    const textRef = useRef<THREE.Mesh>(null!);
    const [char] = useState(Math.random() > 0.5 ? "1" : "0");
    const speed = useMemo(() => Math.random() * 0.5 + 0.1, []);

    useFrame((state, delta) => {
        if(textRef.current) {
            textRef.current.position.z += speed * delta * 5;
            if(textRef.current.position.z > 5) textRef.current.position.z = -20;
        }
    });

    return (
        <Text3D
            ref={textRef}
            font="/fonts/font.json" // Placeholder, might need actual font file
            size={0.2}
            height={0.05}
            position={position}
        >
            {char}
            <meshBasicMaterial color="#00ff41" transparent opacity={0.2} />
        </Text3D>
    );
};

// Since I don't have a font.json, I'll use a simpler approach with Sprites or Planes
function BinaryVortex() {
    const groupRef = useRef<THREE.Group>(null!);
    const particles = useMemo(() => {
        return Array.from({ length: 100 }, () => ({
            position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30] as [number, number, number],
            char: Math.random() > 0.5 ? "1" : "0",
            speed: Math.random() * 2 + 1
        }));
    }, []);

    useFrame((state, delta) => {
        if(groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.position.z += particles[i].speed * delta;
                if(child.position.z > 5) child.position.z = -25;
            });
        }
    });

    return (
        <group ref={groupRef}>
           {/* We can't easily do text without font, so we'll just use points that look like text if we really wanted to, but let's keep it simple with stars for now */}
        </group>
    );
}

export const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={["#010602"]} />
        <BinaryStars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ff41" />
      </Canvas>
    </div>
  );
};

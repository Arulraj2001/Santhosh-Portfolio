import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '../lib/store';

function FloatingGeometries({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * -0.1;
      ringRef.current.rotation.z = t * 0.15;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.25;
      octaRef.current.position.y = Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <group>
      {/* Central organic morphing sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 64, 64]} position={[2.5, 0.2, -1]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </Sphere>
      </Float>

      {/* Floating accent ring */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
        <mesh ref={ringRef} position={[-2.8, 1, -2]}>
          <torusGeometry args={[1.1, 0.04, 16, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* Secondary marketing crystal */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.2}>
        <mesh ref={octaRef} position={[3.2, -1.8, -1.5]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#FAFAFA"
            roughness={0.1}
            metalness={0.9}
            wireframe={true}
          />
        </mesh>
      </Float>
    </group>
  );
}

function StarField({ count = 120, color }: { count?: number; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      sc[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function ThreeCanvas() {
  const { state } = usePortfolioStore();
  const { enable3D, particleDensity } = state.settings.fxSettings;
  const primaryColor = state.settings.customColors.primary;

  if (!enable3D) {
    return null;
  }

  const particleCount =
    particleDensity === 'high' ? 240 : particleDensity === 'low' ? 60 : 120;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-65">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={primaryColor} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FFFFFF" />

        <FloatingGeometries color={primaryColor} />
        <StarField count={particleCount} color={primaryColor} />
      </Canvas>
    </div>
  );
}


"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function TeddyBear() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const clock = useRef(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handlePointerMove = (e: PointerEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    if (window.innerWidth >= 768) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    clock.current += delta;

    // Gentle floating/bobbing
    groupRef.current.position.y = Math.sin(clock.current * 1.5) * 0.08;

    // Subtle mouse follow (desktop only)
    if (!isMobile) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.3,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.15,
        0.05
      );
    }
  });

  const bodyColor = "#C4916E";
  const darkAccent = "#8B7355";
  const blushColor = "#E8B4A0";

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.1}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Left Ear */}
      <mesh position={[-0.35, 0.85, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Left Ear Inner */}
      <mesh position={[-0.35, 0.85, 0.08]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={darkAccent}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Right Ear */}
      <mesh position={[0.35, 0.85, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Right Ear Inner */}
      <mesh position={[0.35, 0.85, 0.08]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={darkAccent}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 0.3, 0.38]} scale={[1.2, 0.9, 0.8]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={blushColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.35, 0.52]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial
          color={darkAccent}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.15, 0.52, 0.4]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.15, 0.52, 0.4]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.65, -0.3, 0]} rotation={[0, 0, 0.6]} scale={[0.8, 1.1, 0.8]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.65, -0.3, 0]} rotation={[0, 0, -0.6]} scale={[0.8, 1.1, 0.8]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.3, -1.05, 0.1]} scale={[0.9, 0.7, 1]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Left Foot Pad */}
      <mesh position={[-0.3, -1.05, 0.3]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={blushColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.3, -1.05, 0.1]} scale={[0.9, 0.7, 1]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Right Foot Pad */}
      <mesh position={[0.3, -1.05, 0.3]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={blushColor}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Belly */}
      <mesh position={[0, -0.4, 0.45]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={blushColor}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#C4916E] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#8B7355] tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 3, 2]} intensity={0.3} color="#E8B4A0" />

          <TeddyBear />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={5}
            blur={2.5}
            far={4}
            color="#8B7355"
          />

          <Environment preset="sunset" />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

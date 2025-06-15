'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

interface MineSceneProps {
  className?: string;
  children?: React.ReactNode;
}

function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={500}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
      />
      
      {/* Secondary directional light for fill */}
      <directionalLight
        position={[-50, 50, -50]}
        intensity={0.3}
      />
    </>
  );
}

function GroundPlane() {
  return (
    <>
      {/* Main ground plane - 500m x 500m */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500, 50, 50]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Grid overlay for scale reference */}
      <Grid
        args={[500, 500]}
        cellSize={10}
        cellThickness={0.5}
        cellColor="#666666"
        sectionSize={50}
        sectionThickness={1}
        sectionColor="#444444"
        fadeDistance={400}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />
    </>
  );
}

export default function MineScene({ className, children }: MineSceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={null}>
          {/* Camera setup - Better initial view to see whole mine */}
          <PerspectiveCamera
            makeDefault
            position={[300, 200, 300]} // Further out for better overview
            fov={60}
            near={0.1}
            far={2000}
          />
          
          {/* Orbit controls - Improved for better navigation */}
          <OrbitControls
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI * 0.85} // Allow more vertical movement
            minDistance={20} // Allow closer zoom
            maxDistance={800} // Allow zooming out to see full site
            enableDamping
            dampingFactor={0.05}
            enablePan={true} // Ensure panning is enabled
            panSpeed={1}
            rotateSpeed={0.8}
          />
          
          {/* Environment and lighting */}
          <Environment preset="sunset" />
          <Lights />
          
          {/* Ground plane and grid */}
          <GroundPlane />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#d4c4b0', 200, 500]} />
          
          {/* Children (equipment, heatmap, etc.) */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
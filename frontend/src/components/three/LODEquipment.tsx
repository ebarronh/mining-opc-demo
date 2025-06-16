'use client';

import { useRef, useMemo, useState } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EquipmentPosition } from '@/types/websocket';
import { miningToScene, isValidMiningCoordinates } from '@/utils/coordinateTransform';

interface LODEquipmentProps {
  data: EquipmentPosition;
  onHover?: (equipment: EquipmentPosition | null) => void;
  onClick?: (equipment: EquipmentPosition) => void;
  onDoubleClick?: (equipment: EquipmentPosition) => void;
  showLabel?: boolean;
}

// LOD levels based on distance from camera
const LOD_LEVELS = {
  HIGH: 0,    // 0-50 units: Full detail
  MEDIUM: 1,  // 50-150 units: Reduced detail
  LOW: 2,     // 150+ units: Basic shapes only
};

const LOD_DISTANCES = {
  [LOD_LEVELS.HIGH]: 50,
  [LOD_LEVELS.MEDIUM]: 150,
  [LOD_LEVELS.LOW]: Infinity,
};

// Status colors
const STATUS_COLORS = {
  operating: '#00ff00',
  idle: '#ffff00',
  error: '#ff0000',
  maintenance: '#ff0000' // Keep for backwards compatibility
};

// High detail excavator (LOD 0)
function ExcavatorHighDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <group position={scenePosition}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[8, 6, 10]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 5, -2]} castShadow>
        <boxGeometry args={[6, 4, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Arm base */}
      <mesh position={[0, 3, 6]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1.5, 12]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Bucket arm */}
      <mesh position={[0, -2, 12]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Tracks */}
      <mesh position={[4, -3, 0]} castShadow>
        <boxGeometry args={[2, 2, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-4, -3, 0]} castShadow>
        <boxGeometry args={[2, 2, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

// Medium detail excavator (LOD 1)
function ExcavatorMediumDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <group position={scenePosition}>
      {/* Main body only */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[8, 6, 10]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
      
      {/* Simplified arm */}
      <mesh position={[0, 3, 8]} castShadow>
        <boxGeometry args={[2, 2, 12]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

// Low detail excavator (LOD 2)
function ExcavatorLowDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <mesh position={scenePosition} castShadow>
      <boxGeometry args={[8, 6, 10]} />
      <meshBasicMaterial color={STATUS_COLORS[data.status]} />
    </mesh>
  );
}

// High detail truck (LOD 0)
function TruckHighDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <group position={scenePosition}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 4, 12]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 3, -4]} castShadow>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Dump bed */}
      <mesh position={[0, 3, 2]} castShadow>
        <boxGeometry args={[5.5, 4, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Wheels */}
      {[[-3, -2, -4], [3, -2, -4], [-3, -2, 4], [3, -2, 4]].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[2, 2, 1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}

// Medium detail truck (LOD 1)
function TruckMediumDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <group position={scenePosition}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 4, 12]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
      
      {/* Simplified cabin */}
      <mesh position={[0, 3, -4]} castShadow>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// Low detail truck (LOD 2)
function TruckLowDetail({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <mesh position={scenePosition} castShadow>
      <boxGeometry args={[6, 4, 12]} />
      <meshBasicMaterial color={STATUS_COLORS[data.status]} />
    </mesh>
  );
}

// Conveyor components (simplified since they're stationary)
function ConveyorAllLOD({ data, scenePosition }: { data: EquipmentPosition; scenePosition: Vector3 }) {
  return (
    <group position={scenePosition}>
      {/* Conveyor belt structure */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 50]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Belt surface */}
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.2, 49]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
    </group>
  );
}

export default function LODEquipment({ 
  data, 
  onHover, 
  onClick, 
  onDoubleClick, 
  showLabel = true 
}: LODEquipmentProps) {
  const groupRef = useRef<Group>(null);
  const [currentLOD, setCurrentLOD] = useState(LOD_LEVELS.HIGH);
  const [isHovered, setIsHovered] = useState(false);
  const { camera } = useThree();
  
  // Transform coordinates from mining space to scene space
  const scenePosition = useMemo(() => {
    let position;
    
    if (isValidMiningCoordinates(data.position)) {
      position = miningToScene(data.position);
    } else {
      position = data.position;
    }
    
    const groundOffset = data.type === 'conveyor' ? 2 : 1;
    
    return new Vector3(
      position.x,
      Math.max(0, position.y) + groundOffset,
      position.z
    );
  }, [data.position, data.type]);
  
  // Calculate LOD based on distance from camera
  useFrame(() => {
    if (!groupRef.current) return;
    
    const distance = camera.position.distanceTo(scenePosition);
    
    let newLOD = LOD_LEVELS.LOW;
    if (distance < LOD_DISTANCES[LOD_LEVELS.HIGH]) {
      newLOD = LOD_LEVELS.HIGH;
    } else if (distance < LOD_DISTANCES[LOD_LEVELS.MEDIUM]) {
      newLOD = LOD_LEVELS.MEDIUM;
    }
    
    if (newLOD !== currentLOD) {
      setCurrentLOD(newLOD);
    }
  });
  
  const handlePointerOver = () => {
    setIsHovered(true);
    if (onHover) onHover(data);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
    if (onHover) onHover(null);
    document.body.style.cursor = 'default';
  };
  
  const handleClick = () => {
    if (onClick) onClick(data);
  };
  
  const handleDoubleClick = () => {
    if (onDoubleClick) onDoubleClick(data);
  };
  
  // Render appropriate LOD based on equipment type and distance
  const renderEquipment = () => {
    switch (data.type) {
      case 'excavator':
        switch (currentLOD) {
          case LOD_LEVELS.HIGH:
            return <ExcavatorHighDetail data={data} scenePosition={scenePosition} />;
          case LOD_LEVELS.MEDIUM:
            return <ExcavatorMediumDetail data={data} scenePosition={scenePosition} />;
          case LOD_LEVELS.LOW:
            return <ExcavatorLowDetail data={data} scenePosition={scenePosition} />;
        }
        break;
      case 'truck':
        switch (currentLOD) {
          case LOD_LEVELS.HIGH:
            return <TruckHighDetail data={data} scenePosition={scenePosition} />;
          case LOD_LEVELS.MEDIUM:
            return <TruckMediumDetail data={data} scenePosition={scenePosition} />;
          case LOD_LEVELS.LOW:
            return <TruckLowDetail data={data} scenePosition={scenePosition} />;
        }
        break;
      case 'conveyor':
        return <ConveyorAllLOD data={data} scenePosition={scenePosition} />;
      default:
        return null;
    }
  };
  
  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      rotation={[data.rotation.x, data.rotation.y, data.rotation.z]}
    >
      {renderEquipment()}
      
      {/* Label - only show on high/medium LOD */}
      {showLabel && currentLOD <= LOD_LEVELS.MEDIUM && (
        <Text
          position={[scenePosition.x, scenePosition.y + 10, scenePosition.z]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.id}
        </Text>
      )}
      
      {/* Hover highlight - only on high LOD */}
      {isHovered && currentLOD === LOD_LEVELS.HIGH && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
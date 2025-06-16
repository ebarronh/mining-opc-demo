'use client';

import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Object3D, Matrix4, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { EquipmentPosition } from '@/types/websocket';
import { miningToScene, isValidMiningCoordinates } from '@/utils/coordinateTransform';

interface InstancedEquipmentProps {
  equipmentData: EquipmentPosition[];
  type: 'excavator' | 'truck' | 'conveyor';
  onHover?: (equipment: EquipmentPosition | null) => void;
  onClick?: (equipment: EquipmentPosition) => void;
  onDoubleClick?: (equipment: EquipmentPosition) => void;
  showLabels?: boolean;
}

// Status colors
const STATUS_COLORS = {
  operating: new Color('#00ff00'),
  idle: new Color('#ffff00'),
  maintenance: new Color('#ff0000'),
  error: new Color('#ff0000')
};

// Equipment geometries for instancing
const EQUIPMENT_GEOMETRIES = {
  excavator: {
    scale: [8, 6, 10] as [number, number, number],
    color: '#4a9eff'
  },
  truck: {
    scale: [6, 4, 12] as [number, number, number], 
    color: '#ff9a4a'
  },
  conveyor: {
    scale: [4, 1, 50] as [number, number, number],
    color: '#9a4aff'
  }
};

export function InstancedEquipment({ 
  equipmentData, 
  type, 
  onHover, 
  onClick, 
  onDoubleClick, 
  showLabels 
}: InstancedEquipmentProps) {
  const meshRef = useRef<InstancedMesh>(null);
  
  // Filter equipment by type
  const filteredEquipment = useMemo(() => 
    equipmentData.filter(eq => eq.type === type),
    [equipmentData, type]
  );

  const count = filteredEquipment.length;
  
  // Temporary objects for matrix calculations
  const tempObject = useMemo(() => new Object3D(), []);
  const tempMatrix = useMemo(() => new Matrix4(), []);

  // Update instance matrices when equipment positions change
  useEffect(() => {
    if (!meshRef.current || count === 0) return;

    filteredEquipment.forEach((equipment, index) => {
      // Transform coordinates
      let position;
      if (isValidMiningCoordinates(equipment.position)) {
        position = miningToScene(equipment.position);
      } else {
        position = equipment.position;
      }

      // Position equipment on ground with proper offset
      const groundOffset = type === 'conveyor' ? 2 : 1;
      tempObject.position.set(
        position.x,
        Math.max(0, position.y) + groundOffset,
        position.z
      );

      // Apply rotation
      tempObject.rotation.set(
        equipment.rotation.x,
        equipment.rotation.y,
        equipment.rotation.z
      );

      // Apply scale based on equipment type
      const geometry = EQUIPMENT_GEOMETRIES[type];
      tempObject.scale.set(...geometry.scale);

      // Update matrix
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(index, tempObject.matrix);

      // Set color based on status
      const statusColor = STATUS_COLORS[equipment.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.operating;
      meshRef.current!.setColorAt(index, statusColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [filteredEquipment, type, tempObject]);

  // Don't render if no equipment of this type
  if (count === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

// Higher-order component to manage all equipment types with instancing
export function OptimizedEquipmentRenderer({ 
  equipmentData, 
  onHover, 
  onClick, 
  onDoubleClick, 
  showLabels 
}: {
  equipmentData: EquipmentPosition[];
  onHover?: (equipment: EquipmentPosition | null) => void;
  onClick?: (equipment: EquipmentPosition) => void;
  onDoubleClick?: (equipment: EquipmentPosition) => void;
  showLabels?: boolean;
}) {
  return (
    <group>
      <InstancedEquipment
        equipmentData={equipmentData}
        type="excavator"
        onHover={onHover}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        showLabels={showLabels}
      />
      <InstancedEquipment
        equipmentData={equipmentData}
        type="truck"
        onHover={onHover}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        showLabels={showLabels}
      />
      <InstancedEquipment
        equipmentData={equipmentData}
        type="conveyor"
        onHover={onHover}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        showLabels={showLabels}
      />
    </group>
  );
}
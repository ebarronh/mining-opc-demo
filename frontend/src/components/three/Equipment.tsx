'use client';

import { useRef, useMemo, useState } from 'react';
import { Mesh, Group, BoxGeometry, CylinderGeometry } from 'three';
import { Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EquipmentPosition } from '@/types/websocket';
import { miningToScene, isValidMiningCoordinates } from '@/utils/coordinateTransform';

interface EquipmentProps {
  data: EquipmentPosition;
  onHover?: (equipment: EquipmentPosition | null) => void;
  onClick?: (equipment: EquipmentPosition) => void;
  onDoubleClick?: (equipment: EquipmentPosition) => void;
  showLabel?: boolean;
}

// Status colors
const STATUS_COLORS = {
  operating: '#00ff00',
  idle: '#ffff00',
  maintenance: '#ff0000'
};

function Excavator({ data, showLabel, scenePosition }: { data: EquipmentPosition; showLabel?: boolean; scenePosition: { x: number; y: number; z: number } }) {
  const groupRef = useRef<Group>(null);
  
  return (
    <group ref={groupRef} position={[scenePosition.x, scenePosition.y, scenePosition.z]}>
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
      
      {/* Label */}
      {showLabel && (
        <Text
          position={[0, 10, 0]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.id}
        </Text>
      )}
    </group>
  );
}

function HaulTruck({ data, showLabel, scenePosition }: { data: EquipmentPosition; showLabel?: boolean; scenePosition: { x: number; y: number; z: number } }) {
  const groupRef = useRef<Group>(null);
  const wheelRefs = useRef<Mesh[]>([]);
  
  // Animate wheels if moving
  useFrame((state, delta) => {
    if (data.telemetry?.speed && data.telemetry.speed > 0) {
      wheelRefs.current.forEach(wheel => {
        if (wheel) wheel.rotation.x += delta * data.telemetry!.speed! * 0.1;
      });
    }
  });
  
  return (
    <group ref={groupRef} position={[scenePosition.x, scenePosition.y, scenePosition.z]}>
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
          ref={el => { if (el) wheelRefs.current[i] = el; }}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[2, 2, 1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      
      {/* Label */}
      {showLabel && (
        <Text
          position={[0, 8, 0]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.id}
        </Text>
      )}
    </group>
  );
}

function Conveyor({ data, showLabel, scenePosition }: { data: EquipmentPosition; showLabel?: boolean; scenePosition: { x: number; y: number; z: number } }) {
  const groupRef = useRef<Group>(null);
  
  return (
    <group ref={groupRef} position={[scenePosition.x, scenePosition.y, scenePosition.z]}>
      {/* Conveyor belt structure - positioned above ground */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 50]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Belt surface */}
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.2, 49]} />
        <meshStandardMaterial color={STATUS_COLORS[data.status]} />
      </mesh>
      
      {/* Support pillars - extend down to ground */}
      {[-20, -10, 0, 10, 20].map((z, i) => (
        <mesh key={i} position={[0, -2, z]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
      
      {/* Label */}
      {showLabel && (
        <Text
          position={[0, 4, 0]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.id}
        </Text>
      )}
    </group>
  );
}

function EquipmentTooltip({ data, visible }: { data: EquipmentPosition; visible: boolean }) {
  if (!visible) return null;
  
  return (
    <Html
      position={[0, 15, 0]}
      center
      style={{
        transition: 'all 0.2s',
        opacity: visible ? 1 : 0,
        transform: `scale(${visible ? 1 : 0.8})`,
        pointerEvents: 'none'
      }}
    >
      <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl min-w-[200px] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">{data.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            data.status === 'operating' ? 'bg-green-500/20 text-green-400' :
            data.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {data.status}
          </span>
        </div>
        
        <div className="text-xs space-y-1 text-gray-300">
          <div>Type: <span className="text-white capitalize">{data.type}</span></div>
          {data.telemetry && (
            <>
              {data.telemetry.speed !== undefined && (
                <div>Speed: <span className="text-white">{data.telemetry.speed} km/h</span></div>
              )}
              {data.telemetry.payload !== undefined && (
                <div>Payload: <span className="text-white">{data.telemetry.payload} tons</span></div>
              )}
              {data.telemetry.temperature !== undefined && (
                <div>Temp: <span className="text-white">{data.telemetry.temperature}°C</span></div>
              )}
            </>
          )}
          <div className="text-[10px] text-gray-400 mt-2">
            Position: ({Math.round(data.position.x)}, {Math.round(data.position.y)}, {Math.round(data.position.z)})
          </div>
        </div>
      </div>
    </Html>
  );
}

export default function Equipment({ data, onHover, onClick, onDoubleClick, showLabel = true }: EquipmentProps) {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightIntensity, setHighlightIntensity] = useState(0);
  
  // Transform coordinates from mining space to scene space
  const scenePosition = useMemo(() => {
    let position;
    
    // Check if coordinates look like mining coordinates (large values)
    if (isValidMiningCoordinates(data.position)) {
      position = miningToScene(data.position);
    } else {
      // If coordinates are already in scene space, use them directly
      position = data.position;
    }
    
    // Ensure equipment sits ON the ground (Y=0 is ground level)
    // Add small offset so equipment doesn't clip through ground
    const groundOffset = data.type === 'conveyor' ? 2 : 1; // Conveyors higher for support structure
    
    return {
      x: position.x,
      y: Math.max(0, position.y) + groundOffset, // Ensure Y >= 0 + offset
      z: position.z
    };
  }, [data.position, data.type]);
  
  // Animate highlight on hover
  useFrame((state, delta) => {
    const target = isHovered ? 1 : 0;
    setHighlightIntensity(prev => {
      const diff = target - prev;
      return prev + diff * delta * 5;
    });
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
  
  return (
    <group
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      rotation={[data.rotation.x, data.rotation.y, data.rotation.z]}
    >
      {/* Hover highlight effect */}
      {highlightIntensity > 0 && (
        <mesh scale={[1 + highlightIntensity * 0.1, 1 + highlightIntensity * 0.1, 1 + highlightIntensity * 0.1]}>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={highlightIntensity * 0.1}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {data.type === 'excavator' && <Excavator data={data} showLabel={showLabel} scenePosition={scenePosition} />}
      {data.type === 'truck' && <HaulTruck data={data} showLabel={showLabel} scenePosition={scenePosition} />}
      {data.type === 'conveyor' && <Conveyor data={data} showLabel={showLabel} scenePosition={scenePosition} />}
      
      {/* Tooltip */}
      <EquipmentTooltip data={data} visible={isHovered} />
    </group>
  );
}
'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Mesh, Color, BufferGeometry, Float32BufferAttribute } from 'three';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GradeData } from '@/types/websocket';
import { getGradeColor } from '@/utils/gradeColors';

interface GradeHeatmapProps {
  data: GradeData | null;
  visible: boolean;
  onCellClick?: (row: number, col: number, grade: number) => void;
}

// Grade color mapping moved to shared utility

// GradeLegend function removed - now using UI component

export default function GradeHeatmap({ data, visible, onCellClick }: GradeHeatmapProps) {
  const meshRef = useRef<Mesh>(null);
  const [opacity, setOpacity] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  
  // Fade in/out animation
  useFrame((state, delta) => {
    const targetOpacity = visible ? 0.85 : 0; // Increased opacity for better visibility
    setOpacity(prev => {
      const diff = targetOpacity - prev;
      return prev + diff * delta * 3; // Smooth transition
    });
  });
  
  // Generate heatmap mesh
  const geometry = useMemo(() => {
    if (!data) return null;
    
    const { rows, columns } = data.gridSize;
    const cellWidth = (data.bounds.maxX - data.bounds.minX) / columns;
    const cellHeight = (data.bounds.maxY - data.bounds.minY) / rows;
    
    const geometry = new BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    
    // Create vertices and colors for each cell
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = data.bounds.minX + col * cellWidth;
        const z = data.bounds.minY + row * cellHeight;
        const y = 1.5; // Higher above ground for better visibility
        
        const vertexIndex = (row * columns + col) * 4;
        
        // Four vertices per cell
        vertices.push(
          x, y, z,
          x + cellWidth, y, z,
          x + cellWidth, y, z + cellHeight,
          x, y, z + cellHeight
        );
        
        // Get color for this cell
        const grade = data.grid[row][col];
        const color = getGradeColor(grade);
        
        // Four colors per cell (one for each vertex)
        for (let i = 0; i < 4; i++) {
          colors.push(color.r, color.g, color.b);
        }
        
        // Two triangles per cell
        indices.push(
          vertexIndex, vertexIndex + 1, vertexIndex + 2,
          vertexIndex, vertexIndex + 2, vertexIndex + 3
        );
      }
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [data]);
  
  const handlePointerMove = (event: any) => {
    if (!data || !onCellClick) return;
    
    const { rows, columns } = data.gridSize;
    const cellWidth = (data.bounds.maxX - data.bounds.minX) / columns;
    const cellHeight = (data.bounds.maxY - data.bounds.minY) / rows;
    
    const x = event.point.x;
    const z = event.point.z;
    
    const col = Math.floor((x - data.bounds.minX) / cellWidth);
    const row = Math.floor((z - data.bounds.minY) / cellHeight);
    
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      setHoveredCell({ row, col });
      document.body.style.cursor = 'pointer';
    } else {
      setHoveredCell(null);
      document.body.style.cursor = 'default';
    }
  };
  
  const handlePointerOut = () => {
    setHoveredCell(null);
    document.body.style.cursor = 'default';
  };
  
  const handleClick = (event: any) => {
    if (!data || !onCellClick || !hoveredCell) return;
    
    const grade = data.grid[hoveredCell.row][hoveredCell.col];
    onCellClick(hoveredCell.row, hoveredCell.col, grade);
  };
  
  if (!geometry || !data) return null;
  
  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={opacity}
          depthWrite={false}
          side={2} // DoubleSide - render both sides
        />
      </mesh>
      
      {/* Hover indicator */}
      {hoveredCell && visible && (
        <mesh position={[
          data.bounds.minX + (hoveredCell.col + 0.5) * ((data.bounds.maxX - data.bounds.minX) / data.gridSize.columns),
          1,
          data.bounds.minY + (hoveredCell.row + 0.5) * ((data.bounds.maxY - data.bounds.minY) / data.gridSize.rows)
        ]}>
          <boxGeometry args={[
            (data.bounds.maxX - data.bounds.minX) / data.gridSize.columns,
            0.5,
            (data.bounds.maxY - data.bounds.minY) / data.gridSize.rows
          ]} />
          <meshBasicMaterial color="white" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* 3D Grade legend removed - now in UI panel */}
    </group>
  );
}
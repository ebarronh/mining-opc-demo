'use client';

import { useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControlsProps {
  equipmentPositions?: Array<{ id: string; position: { x: number; y: number; z: number } }>;
  onToggleGradeHeatmap?: () => void;
  onToggleEquipmentLabels?: () => void;
  onToggleHelp?: () => void;
}

export default function CameraControls({
  equipmentPositions = [],
  onToggleGradeHeatmap,
  onToggleEquipmentLabels,
  onToggleHelp
}: CameraControlsProps) {
  const { camera, controls } = useThree();
  
  // Reset camera to default position
  const resetCamera = useCallback(() => {
    camera.position.set(150, 100, 150);
    if (controls) {
      (controls as any).target.set(0, 0, 0);
      (controls as any).update();
    }
  }, [camera, controls]);
  
  // Focus on next equipment
  const focusNextEquipment = useCallback(() => {
    if (equipmentPositions.length === 0) return;
    
    // Get current focused index from global state
    const currentIndex = (window as any).__focusedEquipmentIndex || -1;
    const nextIndex = (currentIndex + 1) % equipmentPositions.length;
    (window as any).__focusedEquipmentIndex = nextIndex;
    
    const equipment = equipmentPositions[nextIndex];
    const targetPosition = new Vector3(
      equipment.position.x,
      equipment.position.y,
      equipment.position.z
    );
    
    // Animate camera to look at equipment
    const offset = new Vector3(30, 20, 30);
    const newCameraPosition = targetPosition.clone().add(offset);
    
    camera.position.lerp(newCameraPosition, 0.1);
    if (controls) {
      (controls as any).target.lerp(targetPosition, 0.1);
      (controls as any).update();
    }
  }, [camera, controls, equipmentPositions]);
  
  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);
  
  // Focus on specific equipment
  const focusOnEquipment = useCallback((equipment: { position: { x: number; y: number; z: number } }) => {
    const targetPosition = new Vector3(
      equipment.position.x,
      equipment.position.y,
      equipment.position.z
    );
    
    // Animate camera to look at equipment
    const offset = new Vector3(30, 20, 30);
    const newCameraPosition = targetPosition.clone().add(offset);
    
    camera.position.lerp(newCameraPosition, 0.1);
    if (controls) {
      (controls as any).target.lerp(targetPosition, 0.1);
      (controls as any).update();
    }
  }, [camera, controls]);
  
  // Handle keyboard and custom events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const key = event.key.toUpperCase();
      
      switch (key) {
        case 'R':
          event.preventDefault();
          resetCamera();
          break;
        case 'G':
          event.preventDefault();
          onToggleGradeHeatmap?.();
          break;
        case 'E':
          event.preventDefault();
          focusNextEquipment();
          break;
        case 'L':
          event.preventDefault();
          onToggleEquipmentLabels?.();
          break;
        case 'H':
          event.preventDefault();
          onToggleHelp?.();
          break;
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    
    const handleFocusOnEquipment = (event: CustomEvent) => {
      if (event.detail) {
        focusOnEquipment(event.detail);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focusOnEquipment', handleFocusOnEquipment as any);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focusOnEquipment', handleFocusOnEquipment as any);
    };
  }, [resetCamera, focusNextEquipment, toggleFullscreen, focusOnEquipment, onToggleGradeHeatmap, onToggleEquipmentLabels, onToggleHelp]);
  
  // This component only handles the Three.js logic, no UI rendering
  return null;
}
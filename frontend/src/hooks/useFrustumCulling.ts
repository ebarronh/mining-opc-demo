'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Frustum, Matrix4, Box3, Sphere } from 'three';

export interface CullableObject {
  id: string;
  position: Vector3;
  boundingRadius?: number;
  boundingBox?: Box3;
}

export interface FrustumCullingResult {
  visibleObjects: string[];
  culledObjects: string[];
  totalObjects: number;
  visibilityRatio: number;
}

export interface UseFrustumCullingOptions {
  cullMargin?: number; // Extra margin for culling (to avoid pop-in)
  updateFrequency?: number; // How often to update culling (in frames)
  useBoundingSphere?: boolean; // Use sphere vs box for culling
}

export function useFrustumCulling(
  objects: CullableObject[],
  options: UseFrustumCullingOptions = {}
) {
  const {
    cullMargin = 10,
    updateFrequency = 3, // Update every 3 frames for performance
    useBoundingSphere = true
  } = options;

  const { camera } = useThree();
  const frustumRef = useRef(new Frustum());
  const matrixRef = useRef(new Matrix4());
  const frameCountRef = useRef(0);
  const lastResultRef = useRef<FrustumCullingResult>({
    visibleObjects: [],
    culledObjects: [],
    totalObjects: 0,
    visibilityRatio: 1
  });

  // Memoize bounding spheres/boxes for objects
  const objectBounds = useMemo(() => {
    const bounds = new Map<string, Sphere | Box3>();
    
    objects.forEach(obj => {
      if (useBoundingSphere) {
        const radius = obj.boundingRadius || 20; // Default radius
        const sphere = new Sphere(obj.position.clone(), radius + cullMargin);
        bounds.set(obj.id, sphere);
      } else {
        const box = obj.boundingBox?.clone() || new Box3();
        if (!obj.boundingBox) {
          // Create default bounding box around position
          const size = obj.boundingRadius || 20;
          box.setFromCenterAndSize(obj.position, new Vector3(size, size, size));
        }
        // Expand box with margin
        box.expandByScalar(cullMargin);
        bounds.set(obj.id, box);
      }
    });
    
    return bounds;
  }, [objects, cullMargin, useBoundingSphere]);

  useFrame(() => {
    frameCountRef.current++;
    
    // Only update culling every N frames for performance
    if (frameCountRef.current % updateFrequency !== 0) {
      return;
    }

    // Update frustum with current camera
    matrixRef.current.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustumRef.current.setFromProjectionMatrix(matrixRef.current);

    const visibleObjects: string[] = [];
    const culledObjects: string[] = [];

    objects.forEach(obj => {
      const bounds = objectBounds.get(obj.id);
      if (!bounds) {
        // If no bounds, assume visible
        visibleObjects.push(obj.id);
        return;
      }

      let isVisible = false;

      if (bounds instanceof Sphere) {
        // Update sphere center to current object position
        bounds.center.copy(obj.position);
        isVisible = frustumRef.current.intersectsSphere(bounds);
      } else {
        // Update box center to current object position
        const boxSize = new Vector3();
        bounds.getSize(boxSize);
        bounds.setFromCenterAndSize(obj.position, boxSize);
        isVisible = frustumRef.current.intersectsBox(bounds);
      }

      if (isVisible) {
        visibleObjects.push(obj.id);
      } else {
        culledObjects.push(obj.id);
      }
    });

    // Update result
    lastResultRef.current = {
      visibleObjects,
      culledObjects,
      totalObjects: objects.length,
      visibilityRatio: objects.length > 0 ? visibleObjects.length / objects.length : 1
    };
  });

  return lastResultRef.current;
}

// Higher-order component for automatic frustum culling
export function withFrustumCulling<T extends { id: string; position: Vector3 }>(
  Component: React.ComponentType<{ data: T; visible?: boolean }>,
  options: UseFrustumCullingOptions = {}
) {
  return function FrustumCulledComponent({ 
    data, 
    allObjects = [], 
    ...props 
  }: { 
    data: T; 
    allObjects?: CullableObject[];
    [key: string]: any;
  }) {
    const cullingResult = useFrustumCulling(allObjects, options);
    const isVisible = cullingResult.visibleObjects.includes(data.id);

    if (!isVisible) {
      return null; // Don't render culled objects
    }

    return React.createElement(Component, { data, visible: isVisible, ...props });
  };
}

// Utility function to convert equipment positions to cullable objects
export function equipmentToCullableObjects(equipment: Array<{
  id: string;
  position: { x: number; y: number; z: number };
  type: string;
}>): CullableObject[] {
  return equipment.map(eq => ({
    id: eq.id,
    position: new Vector3(eq.position.x, eq.position.y, eq.position.z),
    boundingRadius: eq.type === 'conveyor' ? 30 : 15 // Larger radius for conveyors
  }));
}
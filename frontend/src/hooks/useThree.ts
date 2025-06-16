'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Object3D, Vector3, Box3, Sphere } from 'three';

export interface ThreePerformanceMetrics {
  fps: number;
  frameTime: number;
  renderCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsage: number;
  visibleObjects: number;
  totalObjects: number;
}

export interface UseThreeOptions {
  enablePerformanceMonitoring?: boolean;
  performanceUpdateInterval?: number;
  logPerformanceWarnings?: boolean;
  targetFPS?: number;
}

export function useThree(options: UseThreeOptions = {}) {
  const {
    enablePerformanceMonitoring = false,
    performanceUpdateInterval = 1000,
    logPerformanceWarnings = true,
    targetFPS = 30
  } = options;

  const { scene, camera, gl, size } = useThree();
  const [metrics, setMetrics] = useState<ThreePerformanceMetrics | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastUpdateRef = useRef(performance.now());

  // Performance monitoring
  useFrame(() => {
    if (!enablePerformanceMonitoring) return;

    frameCountRef.current++;
    const now = performance.now();

    // Update metrics periodically
    if (now - lastUpdateRef.current >= performanceUpdateInterval) {
      const deltaTime = now - lastTimeRef.current;
      const fps = (frameCountRef.current * 1000) / deltaTime;
      const frameTime = deltaTime / frameCountRef.current;

      // Get render info
      const renderInfo = gl.info.render;
      const memoryInfo = gl.info.memory;

      // Count visible objects by traversing scene
      let visibleObjects = 0;
      let totalObjects = 0;
      
      scene.traverse((object) => {
        totalObjects++;
        if (object.visible) {
          visibleObjects++;
        }
      });

      const newMetrics: ThreePerformanceMetrics = {
        fps: Math.round(fps),
        frameTime: Math.round(frameTime * 100) / 100,
        renderCalls: renderInfo.calls,
        triangles: renderInfo.triangles,
        geometries: memoryInfo.geometries,
        textures: memoryInfo.textures,
        memoryUsage: 0, // WebGL memory info is limited
        visibleObjects,
        totalObjects
      };

      setMetrics(newMetrics);

      // Log performance warnings
      if (logPerformanceWarnings) {
        if (fps < targetFPS * 0.8) {
          console.warn(`⚠️ Low FPS detected: ${fps.toFixed(1)} (target: ${targetFPS})`);
        }
        if (renderInfo.calls > 100) {
          console.warn(`⚠️ High draw calls: ${renderInfo.calls} (consider instancing)`);
        }
        if (renderInfo.triangles > 100000) {
          console.warn(`⚠️ High triangle count: ${renderInfo.triangles.toLocaleString()}`);
        }
      }

      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      lastUpdateRef.current = now;
    }
  });

  // Camera utilities
  const focusOnObject = useCallback((object: Object3D | Vector3, distance: number = 50) => {
    if (!camera) return;

    let targetPosition: Vector3;
    
    if (object instanceof Vector3) {
      targetPosition = object;
    } else {
      // Calculate bounding box center
      const box = new Box3().setFromObject(object);
      targetPosition = box.getCenter(new Vector3());
    }

    // Calculate camera position
    const direction = camera.position.clone().sub(targetPosition).normalize();
    const newPosition = targetPosition.clone().add(direction.multiplyScalar(distance));
    
    // Animate camera movement (simplified - in real implementation you'd use tween)
    camera.position.copy(newPosition);
    camera.lookAt(targetPosition);
  }, [camera]);

  const resetCamera = useCallback(() => {
    if (!camera) return;
    
    // Reset to default position
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const fitCameraToObjects = useCallback((objects: Object3D[]) => {
    if (!camera || objects.length === 0) return;

    // Calculate bounding box of all objects
    const box = new Box3();
    objects.forEach(obj => {
      const objBox = new Box3().setFromObject(obj);
      box.union(objBox);
    });

    // Calculate center and size
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Calculate camera distance based on field of view
    const fov = (camera as any).fov ? (camera as any).fov : 50;
    const distance = maxDim / (2 * Math.tan((fov * Math.PI) / 360));

    // Position camera
    camera.position.copy(center);
    camera.position.y += distance * 0.5;
    camera.position.z += distance;
    camera.lookAt(center);
  }, [camera]);

  // Object utilities
  const getObjectsInFrustum = useCallback(() => {
    if (!camera) return [];

    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);

    const visibleObjects: Object3D[] = [];
    scene.traverse((object) => {
      if (object.geometry) {
        const sphere = new Sphere();
        object.geometry.boundingSphere = object.geometry.boundingSphere || sphere;
        object.geometry.computeBoundingSphere();
        
        if (frustum.intersectsSphere(object.geometry.boundingSphere)) {
          visibleObjects.push(object);
        }
      }
    });

    return visibleObjects;
  }, [camera, scene]);

  const getObjectsInRadius = useCallback((center: Vector3, radius: number) => {
    const objectsInRadius: Object3D[] = [];
    
    scene.traverse((object) => {
      if (object.position.distanceTo(center) <= radius) {
        objectsInRadius.push(object);
      }
    });

    return objectsInRadius;
  }, [scene]);

  const getObjectsByName = useCallback((namePattern: string | RegExp) => {
    const matchingObjects: Object3D[] = [];
    const pattern = typeof namePattern === 'string' 
      ? new RegExp(namePattern, 'i') 
      : namePattern;

    scene.traverse((object) => {
      if (pattern.test(object.name)) {
        matchingObjects.push(object);
      }
    });

    return matchingObjects;
  }, [scene]);

  // Scene utilities
  const optimizeScene = useCallback(() => {
    let optimizations = 0;

    scene.traverse((object) => {
      // Remove empty groups
      if (object.children.length === 0 && object.parent && object.type === 'Group') {
        object.parent.remove(object);
        optimizations++;
      }

      // Dispose of unused geometries and materials
      if ((object as any).geometry && (object as any).geometry.dispose) {
        const geometry = (object as any).geometry;
        if (geometry.attributes.position.count === 0) {
          geometry.dispose();
          optimizations++;
        }
      }

      // Merge small geometries (simplified logic)
      // In a real implementation, this would be more sophisticated
    });

    console.log(`🔧 Scene optimized: ${optimizations} objects cleaned up`);
    return optimizations;
  }, [scene]);

  const calculateSceneBounds = useCallback(() => {
    const box = new Box3();
    
    scene.traverse((object) => {
      if ((object as any).geometry) {
        const objectBox = new Box3().setFromObject(object);
        box.union(objectBox);
      }
    });

    return {
      box,
      center: box.getCenter(new Vector3()),
      size: box.getSize(new Vector3()),
      min: box.min.clone(),
      max: box.max.clone()
    };
  }, [scene]);

  // Debugging utilities
  const logSceneInfo = useCallback(() => {
    let objectCount = 0;
    let geometryCount = 0;
    let materialCount = 0;
    let lightCount = 0;

    scene.traverse((object) => {
      objectCount++;
      
      if ((object as any).geometry) geometryCount++;
      if ((object as any).material) materialCount++;
      if (object.type.includes('Light')) lightCount++;
    });

    console.log('📊 Scene Information:');
    console.log(`  Objects: ${objectCount}`);
    console.log(`  Geometries: ${geometryCount}`);
    console.log(`  Materials: ${materialCount}`);
    console.log(`  Lights: ${lightCount}`);
    console.log(`  Scene size: ${JSON.stringify(size)}`);
    
    if (metrics) {
      console.log(`  Performance: ${metrics.fps} FPS, ${metrics.frameTime}ms frame time`);
      console.log(`  Render calls: ${metrics.renderCalls}`);
      console.log(`  Triangles: ${metrics.triangles.toLocaleString()}`);
    }
  }, [scene, size, metrics]);

  // Screenshot utility
  const takeScreenshot = useCallback((filename: string = 'screenshot.png') => {
    const canvas = gl.domElement;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [gl]);

  return {
    // Core Three.js objects
    scene,
    camera,
    gl,
    size,
    
    // Performance monitoring
    metrics,
    
    // Camera utilities
    focusOnObject,
    resetCamera,
    fitCameraToObjects,
    
    // Object utilities
    getObjectsInFrustum,
    getObjectsInRadius,
    getObjectsByName,
    
    // Scene utilities
    optimizeScene,
    calculateSceneBounds,
    
    // Debugging utilities
    logSceneInfo,
    takeScreenshot
  };
}
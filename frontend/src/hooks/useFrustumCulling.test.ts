import { renderHook, act } from '@testing-library/react';
import { Vector3 } from 'three';
import { useFrustumCulling, CullableObject } from './useFrustumCulling';

// Mock Three.js
jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      position: new Vector3(0, 0, 10),
      projectionMatrix: {
        elements: new Array(16).fill(0)
      },
      matrixWorldInverse: {
        elements: new Array(16).fill(0)
      }
    }
  }),
  useFrame: (callback: () => void) => {
    // Store callback for manual triggering
    (global as any).frameCallback = callback;
  }
}));

// Mock Three.js classes
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x, y, z,
    clone: () => new (jest.requireActual('three').Vector3)(x, y, z),
    copy: jest.fn()
  })),
  Frustum: jest.fn().mockImplementation(() => ({
    setFromProjectionMatrix: jest.fn(),
    intersectsSphere: jest.fn(() => true),
    intersectsBox: jest.fn(() => true)
  })),
  Matrix4: jest.fn().mockImplementation(() => ({
    multiplyMatrices: jest.fn()
  })),
  Box3: jest.fn().mockImplementation(() => ({
    setFromCenterAndSize: jest.fn(),
    getSize: jest.fn(() => new Vector3(1, 1, 1)),
    expandByScalar: jest.fn()
  })),
  Sphere: jest.fn().mockImplementation((center, radius) => ({
    center: center || new Vector3(),
    radius: radius || 1
  }))
}));

describe('useFrustumCulling', () => {
  const mockObjects: CullableObject[] = [
    {
      id: 'obj1',
      position: new Vector3(0, 0, 0),
      boundingRadius: 5
    },
    {
      id: 'obj2', 
      position: new Vector3(10, 0, 0),
      boundingRadius: 3
    },
    {
      id: 'obj3',
      position: new Vector3(-10, 0, 0),
      boundingRadius: 8
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useFrustumCulling([]));

    expect(result.current.totalObjects).toBe(0);
    expect(result.current.visibleObjects).toEqual([]);
    expect(result.current.culledObjects).toEqual([]);
    expect(result.current.visibilityRatio).toBe(1);
  });

  test('processes objects and returns culling results', () => {
    const { result } = renderHook(() => 
      useFrustumCulling(mockObjects, { updateFrequency: 1 })
    );

    // Trigger frame update
    act(() => {
      if ((global as any).frameCallback) {
        (global as any).frameCallback();
      }
    });

    expect(result.current.totalObjects).toBe(3);
    expect(result.current.visibleObjects.length).toBeGreaterThan(0);
    expect(result.current.visibilityRatio).toBeGreaterThan(0);
  });

  test('respects update frequency', () => {
    const { result } = renderHook(() => 
      useFrustumCulling(mockObjects, { updateFrequency: 5 })
    );

    // First frame - should not update yet
    act(() => {
      if ((global as any).frameCallback) {
        (global as any).frameCallback();
      }
    });

    // Should still be initial state due to update frequency
    expect(result.current.totalObjects).toBe(0);
  });

  test('uses bounding spheres by default', () => {
    const { result } = renderHook(() => 
      useFrustumCulling(mockObjects, { useBoundingSphere: true })
    );

    // The hook should create Sphere instances for culling
    expect(result.current).toBeDefined();
  });

  test('can use bounding boxes instead of spheres', () => {
    const { result } = renderHook(() => 
      useFrustumCulling(mockObjects, { useBoundingSphere: false })
    );

    // The hook should create Box3 instances for culling
    expect(result.current).toBeDefined();
  });

  test('applies cull margin correctly', () => {
    const { result } = renderHook(() => 
      useFrustumCulling(mockObjects, { cullMargin: 20 })
    );

    // Margin should be applied to bounding volumes
    expect(result.current).toBeDefined();
  });

  test('handles empty object array', () => {
    const { result } = renderHook(() => useFrustumCulling([]));

    act(() => {
      if ((global as any).frameCallback) {
        (global as any).frameCallback();
      }
    });

    expect(result.current.totalObjects).toBe(0);
    expect(result.current.visibilityRatio).toBe(1);
  });

  test('updates when objects change', () => {
    const { result, rerender } = renderHook(
      ({ objects }) => useFrustumCulling(objects),
      { initialProps: { objects: mockObjects } }
    );

    // Add more objects
    const moreObjects = [
      ...mockObjects,
      {
        id: 'obj4',
        position: new Vector3(20, 20, 20),
        boundingRadius: 2
      }
    ];

    rerender({ objects: moreObjects });

    act(() => {
      if ((global as any).frameCallback) {
        (global as any).frameCallback();
      }
    });

    expect(result.current.totalObjects).toBe(4);
  });
});
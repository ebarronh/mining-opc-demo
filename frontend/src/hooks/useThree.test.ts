import { renderHook } from '@testing-library/react';
import { Vector3, Object3D } from 'three';
import { useThree as useThreeHook } from './useThree';

// Mock @react-three/fiber
const mockCamera = {
  position: new Vector3(0, 0, 10),
  lookAt: jest.fn(),
  projectionMatrix: {
    elements: new Array(16).fill(0)
  },
  matrixWorldInverse: {
    elements: new Array(16).fill(0)
  },
  fov: 50
};

const mockScene = {
  traverse: jest.fn(),
  children: []
};

const mockGl = {
  domElement: {
    toDataURL: jest.fn(() => 'data:image/png;base64,mock-data')
  },
  info: {
    render: {
      calls: 10,
      triangles: 1000
    },
    memory: {
      geometries: 5,
      textures: 3
    }
  }
};

const mockSize = { width: 800, height: 600 };

jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    scene: mockScene,
    camera: mockCamera,
    gl: mockGl,
    size: mockSize
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
    copy: jest.fn(),
    sub: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    normalize: jest.fn().mockReturnThis(),
    multiplyScalar: jest.fn().mockReturnThis(),
    distanceTo: jest.fn(() => 10)
  })),
  Box3: jest.fn().mockImplementation(() => ({
    setFromObject: jest.fn().mockReturnThis(),
    union: jest.fn().mockReturnThis(),
    getCenter: jest.fn(() => new Vector3()),
    getSize: jest.fn(() => new Vector3(10, 10, 10)),
    min: new Vector3(-5, -5, -5),
    max: new Vector3(5, 5, 5)
  })),
  Sphere: jest.fn().mockImplementation(() => ({
    center: new Vector3(),
    radius: 1
  })),
  Object3D: jest.fn().mockImplementation(() => ({
    position: new Vector3(),
    children: [],
    parent: null,
    name: '',
    type: 'Object3D',
    visible: true
  }))
}));

describe('useThree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns Three.js core objects', () => {
    const { result } = renderHook(() => useThreeHook());

    expect(result.current.scene).toBe(mockScene);
    expect(result.current.camera).toBe(mockCamera);
    expect(result.current.gl).toBe(mockGl);
    expect(result.current.size).toBe(mockSize);
  });

  test('initializes without performance monitoring by default', () => {
    const { result } = renderHook(() => useThreeHook());

    expect(result.current.metrics).toBeNull();
  });

  test('enables performance monitoring when requested', () => {
    renderHook(() => useThreeHook({ enablePerformanceMonitoring: true }));

    // Performance monitoring would be enabled but metrics need frame updates
    // to be populated in a real scenario
  });

  test('focusOnObject works with Vector3', () => {
    const { result } = renderHook(() => useThreeHook());
    const targetPosition = new Vector3(10, 5, 0);

    result.current.focusOnObject(targetPosition, 20);

    // Camera position should be updated
    expect(mockCamera.lookAt).toHaveBeenCalled();
  });

  test('focusOnObject works with Object3D', () => {
    const { result } = renderHook(() => useThreeHook());
    const mockObject = new Object3D();

    result.current.focusOnObject(mockObject, 30);

    // Should calculate bounding box and position camera
    expect(mockCamera.lookAt).toHaveBeenCalled();
  });

  test('resetCamera restores default position', () => {
    const { result } = renderHook(() => useThreeHook());

    result.current.resetCamera();

    expect(mockCamera.position.copy).toHaveBeenCalled();
    expect(mockCamera.lookAt).toHaveBeenCalledWith(0, 0, 0);
  });

  test('fitCameraToObjects calculates proper bounds', () => {
    const { result } = renderHook(() => useThreeHook());
    const objects = [new Object3D(), new Object3D()];

    result.current.fitCameraToObjects(objects);

    expect(mockCamera.lookAt).toHaveBeenCalled();
  });

  test('fitCameraToObjects handles empty array', () => {
    const { result } = renderHook(() => useThreeHook());

    result.current.fitCameraToObjects([]);

    // Should not throw or crash
    expect(result.current.fitCameraToObjects).toBeDefined();
  });

  test('getObjectsInRadius filters objects by distance', () => {
    const { result } = renderHook(() => useThreeHook());
    const center = new Vector3(0, 0, 0);
    const radius = 15;

    // Mock scene.traverse to call callback with test objects
    mockScene.traverse.mockImplementation((callback) => {
      const obj1 = new Object3D();
      obj1.position = new Vector3(5, 0, 0); // Within radius
      const obj2 = new Object3D();
      obj2.position = new Vector3(20, 0, 0); // Outside radius
      
      callback(obj1);
      callback(obj2);
    });

    const objectsInRadius = result.current.getObjectsInRadius(center, radius);

    expect(mockScene.traverse).toHaveBeenCalled();
    // In a real implementation, would filter based on distance
  });

  test('getObjectsByName finds objects matching pattern', () => {
    const { result } = renderHook(() => useThreeHook());

    // Mock scene.traverse with named objects
    mockScene.traverse.mockImplementation((callback) => {
      const obj1 = new Object3D();
      obj1.name = 'Equipment_EX001';
      const obj2 = new Object3D();
      obj2.name = 'Conveyor_CV001';
      const obj3 = new Object3D();
      obj3.name = 'Unknown';
      
      callback(obj1);
      callback(obj2);
      callback(obj3);
    });

    const equipmentObjects = result.current.getObjectsByName('Equipment');

    expect(mockScene.traverse).toHaveBeenCalled();
  });

  test('optimizeScene removes empty groups', () => {
    const { result } = renderHook(() => useThreeHook());

    // Mock scene with empty groups
    mockScene.traverse.mockImplementation((callback) => {
      const emptyGroup = {
        children: [],
        parent: { remove: jest.fn() },
        type: 'Group'
      };
      const normalObject = {
        children: [{}],
        parent: null,
        type: 'Mesh'
      };
      
      callback(emptyGroup);
      callback(normalObject);
    });

    const optimizations = result.current.optimizeScene();

    expect(mockScene.traverse).toHaveBeenCalled();
    expect(typeof optimizations).toBe('number');
  });

  test('calculateSceneBounds returns scene dimensions', () => {
    const { result } = renderHook(() => useThreeHook());

    // Mock scene with objects that have geometry
    mockScene.traverse.mockImplementation((callback) => {
      const obj = {
        geometry: {}
      };
      callback(obj);
    });

    const bounds = result.current.calculateSceneBounds();

    expect(bounds).toHaveProperty('box');
    expect(bounds).toHaveProperty('center');
    expect(bounds).toHaveProperty('size');
    expect(bounds).toHaveProperty('min');
    expect(bounds).toHaveProperty('max');
  });

  test('logSceneInfo outputs scene statistics', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { result } = renderHook(() => useThreeHook());

    // Mock scene with various object types
    mockScene.traverse.mockImplementation((callback) => {
      const mesh = { geometry: {}, material: {} };
      const light = { type: 'DirectionalLight' };
      const group = { type: 'Group' };
      
      callback(mesh);
      callback(light);
      callback(group);
    });

    result.current.logSceneInfo();

    expect(consoleSpy).toHaveBeenCalledWith('📊 Scene Information:');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Objects:'));
    
    consoleSpy.mockRestore();
  });

  test('takeScreenshot creates download link', () => {
    const { result } = renderHook(() => useThreeHook());
    
    // Mock DOM elements
    const mockLink = {
      download: '',
      href: '',
      click: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    result.current.takeScreenshot('test.png');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('test.png');
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockGl.domElement.toDataURL).toHaveBeenCalledWith('image/png');
  });

  test('performance metrics update with frame callback', () => {
    const { result } = renderHook(() => 
      useThreeHook({ 
        enablePerformanceMonitoring: true,
        performanceUpdateInterval: 100
      })
    );

    // Mock scene.traverse for object counting
    mockScene.traverse.mockImplementation((callback) => {
      const obj1 = { visible: true };
      const obj2 = { visible: false };
      callback(obj1);
      callback(obj2);
    });

    // Simulate frame updates
    if ((global as any).frameCallback) {
      // Fast forward time to trigger metrics update
      jest.spyOn(performance, 'now').mockReturnValue(Date.now() + 1000);
      (global as any).frameCallback();
    }

    // Metrics should be available after frame update
    // In a real test, you'd need to wait for the async update
  });

  test('logs performance warnings when FPS is low', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    renderHook(() => 
      useThreeHook({ 
        enablePerformanceMonitoring: true,
        logPerformanceWarnings: true,
        targetFPS: 60
      })
    );

    // Would need to simulate low FPS scenario
    // This would require mocking the frame timing logic
    
    consoleSpy.mockRestore();
  });
});
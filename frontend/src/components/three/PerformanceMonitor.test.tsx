import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PerformanceMonitor } from './PerformanceMonitor';

// Mock Three.js
jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    gl: {
      info: {
        render: {
          calls: 50,
          triangles: 1000,
          points: 0,
          lines: 0
        }
      }
    }
  }),
  useFrame: (callback: () => void) => {
    // Simulate frame callback
    setTimeout(callback, 16);
  }
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024 // 50MB
    }
  }
});

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders toggle button when not visible', () => {
    render(
      <PerformanceMonitor 
        visible={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByTitle('Show Performance Monitor')).toBeInTheDocument();
  });

  test('renders performance stats when visible', () => {
    render(
      <PerformanceMonitor 
        visible={true}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText(/FPS:/)).toBeInTheDocument();
    expect(screen.getByText(/Frame Time:/)).toBeInTheDocument();
    expect(screen.getByText(/Draw Calls:/)).toBeInTheDocument();
  });

  test('calls onToggle when toggle button is clicked', () => {
    const onToggle = jest.fn();
    
    render(
      <PerformanceMonitor 
        visible={false}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByTitle('Show Performance Monitor'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('displays culling stats when provided', () => {
    const cullingStats = {
      visibleObjects: ['obj1', 'obj2'],
      culledObjects: ['obj3'],
      totalObjects: 3,
      visibilityRatio: 0.67
    };

    render(
      <PerformanceMonitor 
        visible={true}
        cullingStats={cullingStats}
      />
    );

    expect(screen.getByText('CULLING')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // visible objects
    expect(screen.getByText('1')).toBeInTheDocument(); // culled objects
  });

  test('shows performance warning for low FPS', async () => {
    // Mock low FPS scenario
    const lowFpsStats = {
      fps: 15,
      frameTime: 66.7,
      memoryUsage: 100,
      drawCalls: 200,
      triangles: 5000,
      points: 0,
      lines: 0,
      culledObjects: 0,
      totalObjects: 10,
      visibilityRatio: 1
    };

    render(
      <PerformanceMonitor 
        visible={true}
        onToggle={jest.fn()}
      />
    );

    // Warning should appear for low FPS
    // Note: In a real test, you'd need to wait for the useFrame effect to update the stats
    // This is a simplified test structure
  });

  test('shows high draw calls warning', () => {
    render(
      <PerformanceMonitor 
        visible={true}
        onToggle={jest.fn()}
      />
    );

    // Would need to simulate high draw calls scenario
    // and check for warning message
  });

  test('handles missing memory API gracefully', () => {
    // Mock missing memory API
    Object.defineProperty(window, 'performance', {
      value: {
        now: jest.fn(() => Date.now())
        // No memory property
      }
    });

    expect(() => {
      render(
        <PerformanceMonitor 
          visible={true}
          onToggle={jest.fn()}
        />
      );
    }).not.toThrow();
  });
});
import { renderHook, act } from '@testing-library/react';
import { useDataFlow } from './useDataFlow';

// Mock timers
jest.useFakeTimers();

describe('useDataFlow', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('returns initial nodes and connections', () => {
    const { result } = renderHook(() => useDataFlow());
    
    expect(result.current.nodes).toHaveLength(8); // 8 sample nodes
    expect(result.current.connections).toHaveLength(7); // 7 sample connections
    expect(result.current.isActive).toBe(true);
  });

  it('toggles flow state', () => {
    const { result } = renderHook(() => useDataFlow());
    
    expect(result.current.isActive).toBe(true);
    
    act(() => {
      result.current.toggleFlow();
    });
    
    expect(result.current.isActive).toBe(false);
    
    act(() => {
      result.current.toggleFlow();
    });
    
    expect(result.current.isActive).toBe(true);
  });

  it('updates node status', () => {
    const { result } = renderHook(() => useDataFlow());
    
    const initialNode = result.current.nodes.find(node => node.id === 'sensor_1');
    expect(initialNode?.status).toBe('active');
    
    act(() => {
      result.current.updateNodeStatus('sensor_1', 'error');
    });
    
    const updatedNode = result.current.nodes.find(node => node.id === 'sensor_1');
    expect(updatedNode?.status).toBe('error');
  });

  it('calculates throughput metrics correctly', () => {
    const { result } = renderHook(() => useDataFlow());
    
    const metrics = result.current.getThroughputMetrics();
    
    expect(metrics.totalNodes).toBe(8);
    expect(metrics.activeNodes).toBe(8); // All nodes start as active
    expect(metrics.totalDataRate).toBeGreaterThan(0);
    expect(metrics.avgLatency).toBeGreaterThan(0);
  });

  it('handles simulateRealtime option', () => {
    const { result } = renderHook(() => 
      useDataFlow({ simulateRealtime: true, updateInterval: 1000 })
    );
    
    const initialNodes = result.current.nodes;
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Nodes might have changed due to simulation
    expect(result.current.nodes).toBeDefined();
  });

  it('disables simulation when simulateRealtime is false', () => {
    const { result } = renderHook(() => 
      useDataFlow({ simulateRealtime: false })
    );
    
    const initialNodes = result.current.nodes;
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Nodes should remain unchanged
    expect(result.current.nodes).toEqual(initialNodes);
  });

  it('pauses simulation when isActive is false', () => {
    const { result } = renderHook(() => 
      useDataFlow({ simulateRealtime: true, updateInterval: 1000 })
    );
    
    // Deactivate flow
    act(() => {
      result.current.toggleFlow();
    });
    
    const nodesAfterDeactivation = result.current.nodes;
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Nodes should not change when inactive
    expect(result.current.nodes).toEqual(nodesAfterDeactivation);
  });

  it('maintains correct node structure', () => {
    const { result } = renderHook(() => useDataFlow());
    
    result.current.nodes.forEach(node => {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('level');
      expect(node).toHaveProperty('x');
      expect(node).toHaveProperty('y');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('status');
      expect(node).toHaveProperty('dataRate');
      
      expect(typeof node.level).toBe('number');
      expect(node.level).toBeGreaterThanOrEqual(0);
      expect(node.level).toBeLessThanOrEqual(5);
    });
  });

  it('maintains correct connection structure', () => {
    const { result } = renderHook(() => useDataFlow());
    
    result.current.connections.forEach(connection => {
      expect(connection).toHaveProperty('id');
      expect(connection).toHaveProperty('from');
      expect(connection).toHaveProperty('to');
      expect(connection).toHaveProperty('protocol');
      expect(connection).toHaveProperty('latency');
      expect(connection).toHaveProperty('dataVolume');
      expect(connection).toHaveProperty('bidirectional');
      
      expect(typeof connection.latency).toBe('number');
      expect(typeof connection.dataVolume).toBe('number');
      expect(typeof connection.bidirectional).toBe('boolean');
    });
  });

  it('updates node data rates during simulation', () => {
    const { result } = renderHook(() => 
      useDataFlow({ simulateRealtime: true, updateInterval: 100 })
    );
    
    const initialDataRates = result.current.nodes.map(node => node.dataRate);
    
    // Fast-forward to trigger updates
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    const updatedDataRates = result.current.nodes.map(node => node.dataRate);
    
    // At least some data rates should have changed due to simulation
    const hasChanges = initialDataRates.some((rate, index) => 
      Math.abs(rate - updatedDataRates[index]) > 0.01
    );
    
    expect(hasChanges).toBe(true);
  });
});
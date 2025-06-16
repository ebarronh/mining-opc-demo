import { renderHook, act } from '@testing-library/react';
import { useOpcUaCache, OpcUaNode } from './useOpcUaCache';

// Polyfill for structuredClone if not available in Jest environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock timers for cleanup intervals
jest.useFakeTimers();

describe('useOpcUaCache', () => {
  const mockNodes: OpcUaNode[] = [
    {
      nodeId: 'ns=1;s=Equipment.EX001',
      displayName: 'Excavator 001',
      nodeClass: 'Object',
      children: []
    },
    {
      nodeId: 'ns=1;s=Equipment.EX001.Status',
      displayName: 'Status',
      nodeClass: 'Variable',
      dataType: 'Boolean',
      value: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  test('initializes with empty cache', () => {
    const { result } = renderHook(() => useOpcUaCache());

    expect(result.current.cacheSize).toBe(0);
    expect(result.current.get('test')).toBeNull();
  });

  test('sets and gets cache entries', () => {
    const { result } = renderHook(() => useOpcUaCache());

    act(() => {
      result.current.set('test-node', mockNodes);
    });

    expect(result.current.cacheSize).toBe(1);
    
    const cached = result.current.get('test-node');
    expect(cached).toEqual(mockNodes);
  });

  test('returns null for expired entries', () => {
    const { result } = renderHook(() => useOpcUaCache({ defaultTTL: 100 }));

    act(() => {
      result.current.set('test-node', mockNodes, 100);
    });

    expect(result.current.get('test-node')).toEqual(mockNodes);

    // Fast forward past expiration
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.get('test-node')).toBeNull();
  });

  test('removes expired entries from cache', () => {
    const { result } = renderHook(() => useOpcUaCache({ defaultTTL: 100 }));

    act(() => {
      result.current.set('test-node', mockNodes, 100);
    });

    expect(result.current.cacheSize).toBe(1);

    // Fast forward past expiration
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Try to get expired entry (should remove it)
    act(() => {
      result.current.get('test-node');
    });
    
    expect(result.current.cacheSize).toBe(0);
  });

  test('enforces cache size limit using LRU', () => {
    const { result } = renderHook(() => useOpcUaCache({ maxCacheSize: 2 }));

    act(() => {
      result.current.set('node1', mockNodes);
    });
    act(() => {
      result.current.set('node2', mockNodes);
    });
    act(() => {
      result.current.set('node3', mockNodes); // Should evict node1
    });

    expect(result.current.cacheSize).toBe(2);
    expect(result.current.get('node1')).toBeNull(); // Should be evicted
    expect(result.current.get('node2')).toEqual(mockNodes);
    expect(result.current.get('node3')).toEqual(mockNodes);
  });

  test('removes specific entries', () => {
    const { result } = renderHook(() => useOpcUaCache());

    act(() => {
      result.current.set('node1', mockNodes);
      result.current.set('node2', mockNodes);
    });

    expect(result.current.cacheSize).toBe(2);

    act(() => {
      const removed = result.current.remove('node1');
      expect(removed).toBe(true);
    });

    expect(result.current.cacheSize).toBe(1);
    expect(result.current.get('node1')).toBeNull();
    expect(result.current.get('node2')).toEqual(mockNodes);
  });

  test('clears all cache entries', () => {
    const { result } = renderHook(() => useOpcUaCache());

    act(() => {
      result.current.set('node1', mockNodes);
      result.current.set('node2', mockNodes);
    });

    expect(result.current.cacheSize).toBe(2);

    act(() => {
      result.current.clear();
    });

    expect(result.current.cacheSize).toBe(0);
    expect(result.current.get('node1')).toBeNull();
    expect(result.current.get('node2')).toBeNull();
  });

  test('handles batch operations', () => {
    const { result } = renderHook(() => useOpcUaCache());

    const nodeIds = ['node1', 'node2', 'node3'];
    const batchEntries = nodeIds.map(nodeId => ({
      nodeId,
      data: mockNodes
    }));

    act(() => {
      result.current.setBatch(batchEntries);
    });

    expect(result.current.cacheSize).toBe(3);

    const batchResults = result.current.getBatch(nodeIds);
    expect(batchResults.node1).toEqual(mockNodes);
    expect(batchResults.node2).toEqual(mockNodes);
    expect(batchResults.node3).toEqual(mockNodes);
  });

  test('invalidates entries matching pattern', () => {
    const { result } = renderHook(() => useOpcUaCache());

    act(() => {
      result.current.set('equipment.ex001', mockNodes);
      result.current.set('equipment.ex002', mockNodes);
      result.current.set('conveyor.cv001', mockNodes);
    });

    expect(result.current.cacheSize).toBe(3);

    act(() => {
      const invalidated = result.current.invalidatePattern(/^equipment\./);
      expect(invalidated).toBe(2);
    });

    expect(result.current.cacheSize).toBe(1);
    expect(result.current.get('equipment.ex001')).toBeNull();
    expect(result.current.get('equipment.ex002')).toBeNull();
    expect(result.current.get('conveyor.cv001')).toEqual(mockNodes);
  });

  test('preloads missing nodes', async () => {
    const { result } = renderHook(() => useOpcUaCache());
    
    const mockFetchFn = jest.fn()
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockNodes);

    act(() => {
      result.current.set('node1', mockNodes); // Already cached
    });

    await act(async () => {
      const results = await result.current.preload(
        ['node1', 'node2', 'node3'], 
        mockFetchFn
      );
      
      expect(results).toHaveLength(2); // Only node2 and node3 needed fetching
      expect(mockFetchFn).toHaveBeenCalledTimes(2);
      expect(mockFetchFn).toHaveBeenCalledWith('node2');
      expect(mockFetchFn).toHaveBeenCalledWith('node3');
    });

    expect(result.current.cacheSize).toBe(3);
  });

  test('provides cache statistics', () => {
    const { result } = renderHook(() => useOpcUaCache());

    act(() => {
      result.current.set('node1', mockNodes);
      result.current.set('node2', mockNodes);
    });

    // Simulate cache hits and misses
    result.current.get('node1'); // hit
    result.current.get('node2'); // hit
    result.current.get('missing'); // miss

    const stats = result.current.getStats();
    expect(stats.totalEntries).toBe(2);
    expect(stats.hitRate).toBeGreaterThan(0);
    expect(stats.missRate).toBeGreaterThan(0);
    expect(stats.totalSize).toBeGreaterThan(0);
  });

  test('cleans up expired entries automatically', () => {
    const { result } = renderHook(() => 
      useOpcUaCache({ 
        defaultTTL: 100,
        cleanupInterval: 50
      })
    );

    act(() => {
      result.current.set('short-lived', mockNodes, 100);
      result.current.set('long-lived', mockNodes, 1000);
    });

    expect(result.current.cacheSize).toBe(2);

    // Fast forward past first entry expiration but not second
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.cacheSize).toBe(1);
    expect(result.current.get('short-lived')).toBeNull();
    expect(result.current.get('long-lived')).toEqual(mockNodes);
  });

  test('persists cache to localStorage when enabled', () => {
    const { result } = renderHook(() => 
      useOpcUaCache({ 
        enablePersistence: true,
        storageKey: 'test-cache'
      })
    );

    act(() => {
      result.current.set('node1', mockNodes);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-cache',
      expect.stringContaining('node1')
    );
  });

  test('loads cache from localStorage on initialization', () => {
    const cachedData = {
      'node1': {
        data: mockNodes,
        timestamp: Date.now(),
        expiresAt: Date.now() + 300000 // 5 minutes from now
      }
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));

    const { result } = renderHook(() => 
      useOpcUaCache({ 
        enablePersistence: true,
        storageKey: 'test-cache'
      })
    );

    expect(result.current.cacheSize).toBe(1);
    expect(result.current.get('node1')).toEqual(mockNodes);
  });

  test('handles localStorage errors gracefully', () => {
    // Suppress console.warn for this test
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      renderHook(() => 
        useOpcUaCache({ 
          enablePersistence: true,
          storageKey: 'test-cache'
        })
      );
    }).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});
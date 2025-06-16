'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface OpcUaNode {
  nodeId: string;
  displayName: string;
  nodeClass: string;
  dataType?: string;
  value?: any;
  children?: OpcUaNode[];
  parentNodeId?: string;
  lastUpdated?: number;
}

export interface CacheEntry {
  data: OpcUaNode[];
  timestamp: number;
  expiresAt: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // Approximate size in bytes
  hitRate: number;
  missRate: number;
  expiredEntries: number;
}

export interface UseOpcUaCacheOptions {
  maxCacheSize?: number; // Maximum number of entries
  defaultTTL?: number; // Time to live in milliseconds
  cleanupInterval?: number; // How often to clean expired entries
  enablePersistence?: boolean; // Store in localStorage
  storageKey?: string;
}

export function useOpcUaCache(options: UseOpcUaCacheOptions = {}) {
  const {
    maxCacheSize = 1000,
    defaultTTL = 5 * 60 * 1000, // 5 minutes
    cleanupInterval = 60 * 1000, // 1 minute
    enablePersistence = true,
    storageKey = 'opcua-tree-cache'
  } = options;

  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const statsRef = useRef({
    hits: 0,
    misses: 0,
    expiredCleanups: 0
  });

  const [cacheSize, setCacheSize] = useState(0);

  // Load cache from localStorage on mount
  useEffect(() => {
    if (enablePersistence && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedData = JSON.parse(stored);
          const now = Date.now();
          
          // Only restore non-expired entries
          Object.entries(parsedData).forEach(([key, entry]: [string, any]) => {
            if (entry.expiresAt > now) {
              cacheRef.current.set(key, entry);
            }
          });
          
          setCacheSize(cacheRef.current.size);
        }
      } catch (error) {
        console.warn('Failed to load OPC UA cache from localStorage:', error);
      }
    }
  }, [enablePersistence, storageKey]);

  // Persist cache to localStorage
  const persistCache = useCallback(() => {
    if (enablePersistence && typeof window !== 'undefined') {
      try {
        const cacheObject = Object.fromEntries(cacheRef.current);
        localStorage.setItem(storageKey, JSON.stringify(cacheObject));
      } catch (error) {
        console.warn('Failed to persist OPC UA cache to localStorage:', error);
      }
    }
  }, [enablePersistence, storageKey]);

  // Cleanup expired entries
  const cleanupExpiredEntries = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    const beforeSize = cache.size;

    for (const [key, entry] of cache.entries()) {
      if (entry.expiresAt <= now) {
        cache.delete(key);
        statsRef.current.expiredCleanups++;
      }
    }

    const cleanedCount = beforeSize - cache.size;
    if (cleanedCount > 0) {
      setCacheSize(cache.size);
      persistCache();
    }

    return cleanedCount;
  }, [persistCache]);

  // Set up cleanup interval
  useEffect(() => {
    const interval = setInterval(cleanupExpiredEntries, cleanupInterval);
    return () => clearInterval(interval);
  }, [cleanupInterval, cleanupExpiredEntries]);

  // Estimate cache entry size in bytes
  const estimateSize = useCallback((data: OpcUaNode[]): number => {
    return JSON.stringify(data).length * 2; // Rough estimate
  }, []);

  // Enforce cache size limit using LRU
  const enforceCacheLimit = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size <= maxCacheSize) return;

    // Convert to array and sort by timestamp (oldest first)
    const entries = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries until we're under the limit
    const removeCount = cache.size - maxCacheSize;
    for (let i = 0; i < removeCount; i++) {
      cache.delete(entries[i][0]);
    }

    setCacheSize(cache.size);
  }, [maxCacheSize]);

  // Get data from cache
  const get = useCallback((nodeId: string): OpcUaNode[] | null => {
    const cache = cacheRef.current;
    const entry = cache.get(nodeId);

    if (!entry) {
      statsRef.current.misses++;
      return null;
    }

    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      cache.delete(nodeId);
      setCacheSize(cache.size);
      statsRef.current.misses++;
      return null;
    }

    // Update access timestamp for LRU
    entry.timestamp = Date.now();
    statsRef.current.hits++;
    
    return entry.data;
  }, []);

  // Set data in cache
  const set = useCallback((nodeId: string, data: OpcUaNode[], ttl: number = defaultTTL) => {
    const cache = cacheRef.current;
    const now = Date.now();

    const entry: CacheEntry = {
      data: structuredClone ? structuredClone(data) : JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: now,
      expiresAt: now + ttl
    };

    cache.set(nodeId, entry);
    setCacheSize(cache.size);

    // Enforce size limit
    enforceCacheLimit();
    
    // Persist to localStorage
    persistCache();
  }, [defaultTTL, enforceCacheLimit, persistCache]);

  // Remove specific entry
  const remove = useCallback((nodeId: string): boolean => {
    const cache = cacheRef.current;
    const deleted = cache.delete(nodeId);
    
    if (deleted) {
      setCacheSize(cache.size);
      persistCache();
    }
    
    return deleted;
  }, [persistCache]);

  // Clear all cache
  const clear = useCallback(() => {
    cacheRef.current.clear();
    setCacheSize(0);
    statsRef.current = { hits: 0, misses: 0, expiredCleanups: 0 };
    
    if (enablePersistence && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [enablePersistence, storageKey]);

  // Get cache statistics
  const getStats = useCallback((): CacheStats => {
    const cache = cacheRef.current;
    const stats = statsRef.current;
    const totalRequests = stats.hits + stats.misses;
    
    // Calculate approximate total size
    let totalSize = 0;
    for (const entry of cache.values()) {
      totalSize += estimateSize(entry.data);
    }

    return {
      totalEntries: cache.size,
      totalSize,
      hitRate: totalRequests > 0 ? stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? stats.misses / totalRequests : 0,
      expiredEntries: stats.expiredCleanups
    };
  }, [estimateSize]);

  // Check if nodeId is cached and not expired
  const has = useCallback((nodeId: string): boolean => {
    const cache = cacheRef.current;
    const entry = cache.get(nodeId);
    
    if (!entry) return false;
    
    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      cache.delete(nodeId);
      setCacheSize(cache.size);
      return false;
    }
    
    return true;
  }, []);

  // Batch get multiple nodes
  const getBatch = useCallback((nodeIds: string[]): Record<string, OpcUaNode[] | null> => {
    const result: Record<string, OpcUaNode[] | null> = {};
    
    nodeIds.forEach(nodeId => {
      result[nodeId] = get(nodeId);
    });
    
    return result;
  }, [get]);

  // Batch set multiple nodes
  const setBatch = useCallback((entries: Array<{ nodeId: string; data: OpcUaNode[]; ttl?: number }>) => {
    entries.forEach(({ nodeId, data, ttl }) => {
      set(nodeId, data, ttl);
    });
  }, [set]);

  // Invalidate cache entries matching a pattern
  const invalidatePattern = useCallback((pattern: RegExp) => {
    const cache = cacheRef.current;
    const keysToDelete: string[] = [];
    
    for (const key of cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => cache.delete(key));
    setCacheSize(cache.size);
    
    if (keysToDelete.length > 0) {
      persistCache();
    }
    
    return keysToDelete.length;
  }, [persistCache]);

  // Preload commonly accessed nodes
  const preload = useCallback(async (
    nodeIds: string[], 
    fetchFn: (nodeId: string) => Promise<OpcUaNode[]>
  ) => {
    const missingNodes = nodeIds.filter(nodeId => !has(nodeId));
    
    if (missingNodes.length === 0) return;

    // Fetch missing nodes in parallel
    const promises = missingNodes.map(async (nodeId) => {
      try {
        const data = await fetchFn(nodeId);
        set(nodeId, data);
        return { nodeId, success: true };
      } catch (error) {
        return { nodeId, success: false, error };
      }
    });

    const results = await Promise.allSettled(promises);
    return results;
  }, [has, set]);

  return {
    get,
    set,
    remove,
    clear,
    has,
    getBatch,
    setBatch,
    invalidatePattern,
    preload,
    cleanupExpiredEntries,
    getStats,
    cacheSize
  };
}
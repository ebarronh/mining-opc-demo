'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useDebouncedApiCall } from './useDebounce';

export interface SubscriptionRequest {
  nodeId: string;
  action: 'subscribe' | 'unsubscribe';
  timestamp: number;
}

export interface BatchSubscriptionOptions {
  batchSize?: number;
  batchDelay?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface SubscriptionState {
  nodeId: string;
  isSubscribed: boolean;
  isPending: boolean;
  error?: string;
  lastUpdated: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useBatchedSubscriptions(options: BatchSubscriptionOptions = {}) {
  const {
    batchSize = 10,
    batchDelay = 500,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [subscriptions, setSubscriptions] = useState<Map<string, SubscriptionState>>(new Map());
  const [isProcessing, setBatching] = useState(false);
  
  const pendingRequestsRef = useRef<SubscriptionRequest[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef<Map<string, number>>(new Map());

  // API calls for batch operations
  const subscribeApiCall = useCallback(async (nodeIds: string[]) => {
    const response = await fetch(`${API_BASE_URL}/api/opcua/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeIds })
    });

    if (!response.ok) {
      throw new Error(`Subscribe failed: ${response.statusText}`);
    }

    return response.json();
  }, []);

  const unsubscribeApiCall = useCallback(async (nodeIds: string[]) => {
    const response = await fetch(`${API_BASE_URL}/api/opcua/subscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeIds })
    });

    if (!response.ok) {
      throw new Error(`Unsubscribe failed: ${response.statusText}`);
    }

    return response.json();
  }, []);

  const {
    call: debouncedSubscribe,
    isLoading: isSubscribing
  } = useDebouncedApiCall(subscribeApiCall, 100);

  const {
    call: debouncedUnsubscribe,
    isLoading: isUnsubscribing
  } = useDebouncedApiCall(unsubscribeApiCall, 100);

  // Process batch of subscription requests
  const processBatch = useCallback(async () => {
    if (pendingRequestsRef.current.length === 0) return;

    setBatching(true);
    
    try {
      // Group requests by action type and remove duplicates (keep latest)
      const requestMap = new Map<string, SubscriptionRequest>();
      pendingRequestsRef.current.forEach(request => {
        const existing = requestMap.get(request.nodeId);
        if (!existing || request.timestamp > existing.timestamp) {
          requestMap.set(request.nodeId, request);
        }
      });

      const uniqueRequests = Array.from(requestMap.values());
      const subscribeRequests = uniqueRequests.filter(r => r.action === 'subscribe');
      const unsubscribeRequests = uniqueRequests.filter(r => r.action === 'unsubscribe');

      // Update pending states
      setSubscriptions(prev => {
        const updated = new Map(prev);
        uniqueRequests.forEach(request => {
          const current = updated.get(request.nodeId) || {
            nodeId: request.nodeId,
            isSubscribed: false,
            isPending: false,
            lastUpdated: 0
          };
          updated.set(request.nodeId, {
            ...current,
            isPending: true,
            error: undefined
          });
        });
        return updated;
      });

      // Process subscription requests in batches
      const subscribePromises: Promise<any>[] = [];
      for (let i = 0; i < subscribeRequests.length; i += batchSize) {
        const batch = subscribeRequests.slice(i, i + batchSize);
        const nodeIds = batch.map(r => r.nodeId);
        subscribePromises.push(
          debouncedSubscribe(nodeIds).catch(error => ({ error, nodeIds }))
        );
      }

      // Process unsubscription requests in batches
      const unsubscribePromises: Promise<any>[] = [];
      for (let i = 0; i < unsubscribeRequests.length; i += batchSize) {
        const batch = unsubscribeRequests.slice(i, i + batchSize);
        const nodeIds = batch.map(r => r.nodeId);
        unsubscribePromises.push(
          debouncedUnsubscribe(nodeIds).catch(error => ({ error, nodeIds }))
        );
      }

      // Wait for all batches to complete
      const subscribeResults = await Promise.all(subscribePromises);
      const unsubscribeResults = await Promise.all(unsubscribePromises);

      // Update subscription states based on results
      setSubscriptions(prev => {
        const updated = new Map(prev);

        // Process subscribe results
        subscribeResults.forEach((result, batchIndex) => {
          const startIndex = batchIndex * batchSize;
          const batch = subscribeRequests.slice(startIndex, startIndex + batchSize);
          
          if (result.error) {
            // Handle batch failure
            batch.forEach(request => {
              const current = updated.get(request.nodeId);
              if (current) {
                updated.set(request.nodeId, {
                  ...current,
                  isPending: false,
                  error: result.error.message,
                  lastUpdated: Date.now()
                });
              }
            });
          } else {
            // Handle batch success
            batch.forEach(request => {
              const current = updated.get(request.nodeId);
              if (current) {
                updated.set(request.nodeId, {
                  ...current,
                  isSubscribed: true,
                  isPending: false,
                  error: undefined,
                  lastUpdated: Date.now()
                });
                retryCountRef.current.delete(request.nodeId);
              }
            });
          }
        });

        // Process unsubscribe results
        unsubscribeResults.forEach((result, batchIndex) => {
          const startIndex = batchIndex * batchSize;
          const batch = unsubscribeRequests.slice(startIndex, startIndex + batchSize);
          
          if (result.error) {
            // Handle batch failure
            batch.forEach(request => {
              const current = updated.get(request.nodeId);
              if (current) {
                updated.set(request.nodeId, {
                  ...current,
                  isPending: false,
                  error: result.error.message,
                  lastUpdated: Date.now()
                });
              }
            });
          } else {
            // Handle batch success
            batch.forEach(request => {
              const current = updated.get(request.nodeId);
              if (current) {
                updated.set(request.nodeId, {
                  ...current,
                  isSubscribed: false,
                  isPending: false,
                  error: undefined,
                  lastUpdated: Date.now()
                });
                retryCountRef.current.delete(request.nodeId);
              }
            });
          }
        });

        return updated;
      });

      // Clear processed requests
      pendingRequestsRef.current = [];

    } catch (error) {
      console.error('Batch processing failed:', error);
      
      // Mark all pending requests as failed
      setSubscriptions(prev => {
        const updated = new Map(prev);
        pendingRequestsRef.current.forEach(request => {
          const current = updated.get(request.nodeId);
          if (current) {
            updated.set(request.nodeId, {
              ...current,
              isPending: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              lastUpdated: Date.now()
            });
          }
        });
        return updated;
      });
      
      pendingRequestsRef.current = [];
    } finally {
      setBatching(false);
    }
  }, [batchSize, debouncedSubscribe, debouncedUnsubscribe]);

  // Schedule batch processing
  const scheduleBatch = useCallback(() => {
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(processBatch, batchDelay);
  }, [batchDelay, processBatch]);

  // Add subscription request to batch
  const addToBatch = useCallback((nodeId: string, action: 'subscribe' | 'unsubscribe') => {
    const request: SubscriptionRequest = {
      nodeId,
      action,
      timestamp: Date.now()
    };

    pendingRequestsRef.current.push(request);
    scheduleBatch();
  }, [scheduleBatch]);

  // Public API functions
  const subscribe = useCallback((nodeId: string) => {
    addToBatch(nodeId, 'subscribe');
  }, [addToBatch]);

  const unsubscribe = useCallback((nodeId: string) => {
    addToBatch(nodeId, 'unsubscribe');
  }, [addToBatch]);

  const toggleSubscription = useCallback((nodeId: string) => {
    const current = subscriptions.get(nodeId);
    const isCurrentlySubscribed = current?.isSubscribed ?? false;
    
    if (isCurrentlySubscribed) {
      unsubscribe(nodeId);
    } else {
      subscribe(nodeId);
    }
  }, [subscriptions, subscribe, unsubscribe]);

  // Batch operations
  const subscribeBatch = useCallback((nodeIds: string[]) => {
    nodeIds.forEach(nodeId => addToBatch(nodeId, 'subscribe'));
  }, [addToBatch]);

  const unsubscribeBatch = useCallback((nodeIds: string[]) => {
    nodeIds.forEach(nodeId => addToBatch(nodeId, 'unsubscribe'));
  }, [addToBatch]);

  // Get subscription state
  const getSubscriptionState = useCallback((nodeId: string): SubscriptionState | null => {
    return subscriptions.get(nodeId) || null;
  }, [subscriptions]);

  // Get all subscribed nodes
  const getSubscribedNodes = useCallback((): string[] => {
    const subscribed: string[] = [];
    subscriptions.forEach((state, nodeId) => {
      if (state.isSubscribed) {
        subscribed.push(nodeId);
      }
    });
    return subscribed;
  }, [subscriptions]);

  // Retry failed subscriptions
  const retryFailed = useCallback(() => {
    const failedRequests: SubscriptionRequest[] = [];
    
    subscriptions.forEach((state, nodeId) => {
      if (state.error && !state.isPending) {
        const retryCount = retryCountRef.current.get(nodeId) || 0;
        if (retryCount < maxRetries) {
          retryCountRef.current.set(nodeId, retryCount + 1);
          failedRequests.push({
            nodeId,
            action: state.isSubscribed ? 'subscribe' : 'unsubscribe',
            timestamp: Date.now()
          });
        }
      }
    });

    if (failedRequests.length > 0) {
      pendingRequestsRef.current.push(...failedRequests);
      setTimeout(scheduleBatch, retryDelay);
    }
  }, [subscriptions, maxRetries, retryDelay, scheduleBatch]);

  // Force process current batch immediately
  const flushBatch = useCallback(() => {
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = undefined;
    }
    processBatch();
  }, [processBatch]);

  // Clear all subscriptions
  const clearAll = useCallback(() => {
    const subscribedNodes = getSubscribedNodes();
    unsubscribeBatch(subscribedNodes);
  }, [getSubscribedNodes, unsubscribeBatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    subscribe,
    unsubscribe,
    toggleSubscription,
    subscribeBatch,
    unsubscribeBatch,
    getSubscriptionState,
    getSubscribedNodes,
    retryFailed,
    flushBatch,
    clearAll,
    subscriptions: Object.fromEntries(subscriptions),
    isProcessing: isProcessing || isSubscribing || isUnsubscribing,
    pendingCount: pendingRequestsRef.current.length
  };
}
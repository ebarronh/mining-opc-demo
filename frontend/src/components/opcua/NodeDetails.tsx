'use client';

import { useState, useEffect } from 'react';
import { OpcUaNode, OpcUaUpdate } from '@/types/websocket';
import { 
  Copy, 
  Check, 
  Bell, 
  BellOff,
  RefreshCw,
  Info,
  Activity
} from 'lucide-react';

interface NodeDetailsProps {
  node: OpcUaNode | null;
  isSubscribed?: boolean;
  onSubscribe?: (nodeId: string) => void;
  onUnsubscribe?: (nodeId: string) => void;
  realtimeValue?: any;
  lastUpdate?: OpcUaUpdate;
  className?: string;
}

// Format value based on data type
const formatValue = (value: any, dataType?: string): string => {
  if (value === null || value === undefined) return 'null';
  
  switch (dataType) {
    case 'Double':
    case 'Float':
      return typeof value === 'number' ? value.toFixed(2) : String(value);
    case 'DateTime':
      return new Date(value).toLocaleString();
    case 'Boolean':
      return value ? 'True' : 'False';
    case 'String':
      return String(value);
    default:
      return JSON.stringify(value);
  }
};

// Get status color based on value and node type
const getStatusColor = (node: OpcUaNode): string => {
  if (!node.value) return 'text-gray-400';
  
  if (node.browseName.toLowerCase().includes('status')) {
    const status = String(node.value).toLowerCase();
    if (status.includes('error') || status.includes('fault')) return 'text-red-400';
    if (status.includes('warning')) return 'text-yellow-400';
    if (status.includes('operating') || status.includes('ok')) return 'text-green-400';
  }
  
  return 'text-white';
};

// Get contextual information about the value
const getValueContext = (node: OpcUaNode, value: any): { description: string; quality: 'good' | 'average' | 'poor' | 'info'; details?: string } | null => {
  const browseName = node.browseName.toLowerCase();
  const displayName = node.displayName?.toLowerCase() || '';
  
  // Ore Grade context (g/t Au)
  if (browseName.includes('grade') || displayName.includes('grade')) {
    const gradeValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(gradeValue)) return null;
    
    if (gradeValue >= 8.0) {
      return {
        quality: 'good',
        description: 'High-grade ore',
        details: 'Excellent grade for underground mining. World-class deposits typically have 8-10 g/t Au.'
      };
    } else if (gradeValue >= 4.0) {
      return {
        quality: 'average',
        description: 'Medium-grade ore',
        details: 'Good grade for open-pit mining. Economically viable with efficient operations.'
      };
    } else if (gradeValue >= 1.0) {
      return {
        quality: 'average',
        description: 'Low-grade ore',
        details: 'Typical for large-scale open-pit operations. Requires high tonnage for profitability.'
      };
    } else {
      return {
        quality: 'poor',
        description: 'Below typical cutoff',
        details: 'Usually below economic cutoff grades (0.5-3.5 g/t depending on mining method).'
      };
    }
  }
  
  // Load/Payload Weight context (tonnes)
  if (browseName.includes('weight') || browseName.includes('load') || browseName.includes('payload')) {
    const weight = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(weight)) return null;
    
    if (browseName.includes('payload')) {
      // Haul truck payload
      if (weight >= 200) {
        return {
          quality: 'good',
          description: 'Near capacity',
          details: 'Ultra-class haul trucks typically carry 220-400 tonnes. Good utilization.'
        };
      } else if (weight >= 150) {
        return {
          quality: 'average',
          description: 'Standard load',
          details: 'Typical payload for large mining trucks. Room for optimization.'
        };
      } else {
        return {
          quality: 'poor',
          description: 'Underutilized',
          details: 'Below optimal payload. Check loading practices or material availability.'
        };
      }
    } else if (browseName.includes('load')) {
      // Excavator bucket load
      if (weight >= 40) {
        return {
          quality: 'good',
          description: 'Full bucket',
          details: 'Large excavator bucket (40-80 tonnes). Efficient digging.'
        };
      } else if (weight >= 20) {
        return {
          quality: 'average',
          description: 'Standard load',
          details: 'Medium excavator bucket. Normal operation.'
        };
      } else {
        return {
          quality: 'poor',
          description: 'Light load',
          details: 'Below optimal. May indicate hard digging conditions.'
        };
      }
    }
  }
  
  // Production/Tonnage context (t/h)
  if (browseName.includes('tonnage') || browseName.includes('production')) {
    const tonnage = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(tonnage)) return null;
    
    if (tonnage >= 500) {
      return {
        quality: 'good',
        description: 'High production',
        details: 'Excellent throughput. Large mines target 1000+ t/h.'
      };
    } else if (tonnage >= 300) {
      return {
        quality: 'average',
        description: 'Normal production',
        details: 'Standard rate for mid-size operations.'
      };
    } else {
      return {
        quality: 'poor',
        description: 'Low production',
        details: 'Below target. Check equipment availability and utilization.'
      };
    }
  }
  
  // Operational Mode context
  if (browseName.includes('mode') || browseName.includes('status')) {
    const status = String(value).toLowerCase();
    return {
      quality: 'info',
      description: 'Equipment status',
      details: `Current state: ${value}. Monitor for downtime and efficiency.`
    };
  }
  
  return null;
};

export default function NodeDetails({
  node,
  isSubscribed = false,
  onSubscribe,
  onUnsubscribe,
  realtimeValue,
  lastUpdate,
  className = ''
}: NodeDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [updateAnimation, setUpdateAnimation] = useState(false);
  
  // Trigger animation on value update
  useEffect(() => {
    if (lastUpdate) {
      setUpdateAnimation(true);
      const timer = setTimeout(() => setUpdateAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);
  
  const handleCopyNodeId = async () => {
    if (!node) return;
    
    try {
      await navigator.clipboard.writeText(node.nodeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  const handleToggleSubscription = () => {
    if (!node) return;
    
    if (isSubscribed && onUnsubscribe) {
      onUnsubscribe(node.nodeId);
    } else if (!isSubscribed && onSubscribe) {
      onSubscribe(node.nodeId);
    }
  };
  
  if (!node) {
    return (
      <div className={`bg-slate-800 border border-slate-600 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a node to view details</p>
        </div>
      </div>
    );
  }
  
  const displayValue = realtimeValue !== undefined ? realtimeValue : node.value;
  
  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {node.displayName || node.browseName}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {node.nodeClass} Node
            </p>
          </div>
          
          {node.nodeClass === 'Variable' && (
            <button
              onClick={handleToggleSubscription}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors
                ${isSubscribed 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }
              `}
            >
              {isSubscribed ? (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Node Information */}
      <div className="p-4 space-y-4">
        {/* NodeId */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide">Node ID</label>
          <div className="mt-1 flex items-start space-x-2">
            <code className="flex-1 text-sm text-blue-400 bg-slate-900 px-2 py-1 rounded font-mono break-all">
              {node.nodeId}
            </code>
            <button
              onClick={handleCopyNodeId}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
              title="Copy Node ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Browse Name */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide">Browse Name</label>
          <div className="mt-1 text-sm text-white">
            {node.browseName}
          </div>
        </div>
        
        {/* Data Type */}
        {node.dataType && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Data Type</label>
            <div className="mt-1 text-sm text-white">
              {node.dataType}
            </div>
          </div>
        )}
        
        {/* Current Value */}
        {node.nodeClass === 'Variable' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400 uppercase tracking-wide">Current Value</label>
              {isSubscribed && (
                <Activity 
                  className={`w-3 h-3 ${updateAnimation ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} 
                />
              )}
            </div>
            <div className={`
              text-lg font-mono ${getStatusColor(node)} 
              ${updateAnimation ? 'animate-pulse' : ''}
            `}>
              {formatValue(displayValue, node.dataType)}
              {/* Add unit if available */}
              {(() => {
                const browseName = node.browseName.toLowerCase();
                const description = node.description?.toLowerCase() || '';
                
                if (browseName.includes('grade') && description.includes('g/t')) {
                  return <span className="text-sm text-gray-400 ml-2">g/t Au</span>;
                } else if ((browseName.includes('weight') || browseName.includes('payload')) && description.includes('tonnes')) {
                  return <span className="text-sm text-gray-400 ml-2">tonnes</span>;
                } else if (browseName.includes('tonnage') && description.includes('t/h')) {
                  return <span className="text-sm text-gray-400 ml-2">t/h</span>;
                }
                return null;
              })()}
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Updated: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
              </p>
            )}
            
            {/* Value Context */}
            {(() => {
              const context = getValueContext(node, displayValue);
              if (!context) return null;
              
              const qualityColors = {
                good: 'bg-green-500/10 border-green-500/20 text-green-400',
                average: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                poor: 'bg-red-500/10 border-red-500/20 text-red-400',
                info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              };
              
              return (
                <div className={`mt-3 p-3 border rounded-md ${qualityColors[context.quality]}`}>
                  <p className="text-xs font-semibold">
                    {context.description}
                  </p>
                  {context.details && (
                    <p className="text-xs mt-1 opacity-90">
                      {context.details}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        
        {/* Description */}
        {node.description && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
            <div className="mt-1 text-sm text-gray-300">
              {node.description}
            </div>
          </div>
        )}
        
        {/* Live Update Indicator */}
        {isSubscribed && (
          <div className="flex items-center space-x-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Receiving live updates</span>
          </div>
        )}
      </div>
    </div>
  );
}
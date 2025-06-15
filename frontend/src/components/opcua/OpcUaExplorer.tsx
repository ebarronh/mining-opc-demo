'use client';

import { useState, useCallback, useMemo } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  Variable,
  Code2,
  Search,
  X,
  Loader2,
  HelpCircle,
  Info
} from 'lucide-react';
import { OpcUaNode } from '@/types/websocket';

interface OpcUaExplorerProps {
  nodes: OpcUaNode[];
  onNodeSelect?: (node: OpcUaNode) => void;
  selectedNodeId?: string;
  onSubscribe?: (nodeId: string) => void;
  onUnsubscribe?: (nodeId: string) => void;
  subscribedNodes?: Set<string>;
  className?: string;
}

// Node type icons
const getNodeIcon = (node: OpcUaNode, isExpanded: boolean) => {
  if (node.isFolder) {
    return isExpanded ? (
      <FolderOpen className="w-4 h-4 text-blue-400" />
    ) : (
      <Folder className="w-4 h-4 text-gray-400" />
    );
  }
  
  switch (node.nodeClass) {
    case 'Variable':
      return <Variable className="w-4 h-4 text-green-400" />;
    case 'Method':
      return <Code2 className="w-4 h-4 text-purple-400" />;
    default:
      return <Folder className="w-4 h-4 text-gray-400" />;
  }
};

// Highlight mining-specific nodes
const isMiningNode = (node: OpcUaNode): boolean => {
  const miningKeywords = ['equipment', 'excavator', 'truck', 'conveyor', 'grade', 'production', 'telemetry'];
  const nodeName = node.browseName.toLowerCase();
  return miningKeywords.some(keyword => nodeName.includes(keyword));
};

interface TreeNodeProps {
  node: OpcUaNode;
  level: number;
  onNodeSelect?: (node: OpcUaNode) => void;
  selectedNodeId?: string;
  searchTerm: string;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onLoadChildren?: (nodeId: string) => Promise<OpcUaNode[]>;
}

function TreeNode({ 
  node, 
  level, 
  onNodeSelect, 
  selectedNodeId,
  searchTerm,
  expandedNodes,
  onToggleExpand,
  onLoadChildren
}: TreeNodeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<OpcUaNode[]>(node.children || []);
  const isExpanded = expandedNodes.has(node.nodeId);
  const isSelected = selectedNodeId === node.nodeId;
  const isMining = isMiningNode(node);
  
  // Filter children based on search
  const filteredChildren = useMemo(() => {
    if (!searchTerm) return children;
    
    const searchLower = searchTerm.toLowerCase();
    return children.filter(child => 
      child.browseName.toLowerCase().includes(searchLower) ||
      child.displayName.toLowerCase().includes(searchLower)
    );
  }, [children, searchTerm]);
  
  const handleToggle = async () => {
    // Load children lazily if not loaded yet
    if (!isExpanded && node.isFolder && children.length === 0 && onLoadChildren) {
      setIsLoading(true);
      try {
        const loadedChildren = await onLoadChildren(node.nodeId);
        setChildren(loadedChildren);
      } catch (error) {
        console.error('Failed to load children:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    onToggleExpand(node.nodeId);
  };
  
  const handleClick = () => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };
  
  // Check if node matches search
  const matchesSearch = !searchTerm || 
    node.browseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.displayName.toLowerCase().includes(searchTerm.toLowerCase());
  
  if (!matchesSearch && filteredChildren.length === 0) {
    return null;
  }
  
  return (
    <div>
      <div
        className={`
          flex items-center space-x-1 py-1 px-2 rounded cursor-pointer
          hover:bg-slate-700/50 transition-colors
          ${isSelected ? 'bg-blue-500/20 border-l-2 border-blue-400' : ''}
          ${isMining ? 'text-yellow-400' : 'text-gray-300'}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {node.isFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="p-0.5 hover:bg-slate-600 rounded"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        
        {getNodeIcon(node, isExpanded)}
        
        <span className="text-sm truncate">
          {node.displayName || node.browseName}
        </span>
        
        {node.nodeClass === 'Variable' && node.value !== undefined && (
          <span className="ml-auto text-xs text-gray-500">
            {String(node.value)}
          </span>
        )}
      </div>
      
      {isExpanded && filteredChildren.length > 0 && (
        <Collapsible.Root open={isExpanded}>
          <Collapsible.Content>
            {filteredChildren.map(child => (
              <TreeNode
                key={child.nodeId}
                node={child}
                level={level + 1}
                onNodeSelect={onNodeSelect}
                selectedNodeId={selectedNodeId}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                onLoadChildren={onLoadChildren}
              />
            ))}
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
}

export default function OpcUaExplorer({
  nodes,
  onNodeSelect,
  selectedNodeId,
  onSubscribe,
  onUnsubscribe,
  subscribedNodes = new Set(),
  className = ''
}: OpcUaExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);
  
  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);
  
  // Mock function for lazy loading - will be replaced with actual API call
  const handleLoadChildren = useCallback(async (nodeId: string): Promise<OpcUaNode[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock children for demo
    return [
      {
        nodeId: `${nodeId}.Value`,
        browseName: 'Value',
        displayName: 'Current Value',
        nodeClass: 'Variable',
        dataType: 'Double',
        value: Math.random() * 100,
        isFolder: false
      },
      {
        nodeId: `${nodeId}.Status`,
        browseName: 'Status',
        displayName: 'Equipment Status',
        nodeClass: 'Variable',
        dataType: 'String',
        value: 'Operating',
        isFolder: false
      }
    ];
  }, []);
  
  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg ${className}`}>
      {/* Header with Search Bar and Help */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-3">
          <h3 className="text-sm font-semibold text-white flex-1">OPC UA Address Space</h3>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
            title="What is OPC UA?"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {/* Help Panel */}
        {showHelp && (
          <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>What is OPC UA?</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p>
                <strong>OPC UA (Unified Architecture)</strong> is the industry standard for secure, reliable data exchange in industrial automation.
              </p>
              <p>
                This explorer shows the <strong>address space</strong> - a hierarchical structure of all available data points in the mining operation:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Objects</strong> (folders) organize related data</li>
                <li><strong>Variables</strong> contain real-time values (grades, weights, status)</li>
                <li><strong>Methods</strong> are functions you can execute</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <p className="font-semibold mb-1">Color Legend:</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Mining-specific nodes (equipment, grade, production)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span>Standard OPC UA nodes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-600 rounded"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {/* Tree View */}
      <ScrollArea.Root className="h-[600px]">
        <ScrollArea.Viewport className="w-full h-full p-2">
          {nodes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No OPC UA nodes available</p>
              <p className="text-xs mt-1">Connect to server to browse nodes</p>
            </div>
          ) : (
            nodes.map(node => (
              <TreeNode
                key={node.nodeId}
                node={node}
                level={0}
                onNodeSelect={onNodeSelect}
                selectedNodeId={selectedNodeId}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
                onLoadChildren={handleLoadChildren}
              />
            ))
          )}
        </ScrollArea.Viewport>
        
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-slate-700 transition-colors duration-[160ms] ease-out hover:bg-slate-600 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-slate-500 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
        
        <ScrollArea.Corner className="bg-slate-800" />
      </ScrollArea.Root>
    </div>
  );
}
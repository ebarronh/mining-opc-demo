'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronRight, ChevronDown, Folder, FileText, Cog, Search, X } from 'lucide-react';

export interface TreeNode {
  id: string;
  nodeId: string;
  displayName: string;
  nodeClass: 'Object' | 'Variable' | 'Method' | 'ObjectType' | 'VariableType' | 'DataType';
  dataType?: string;
  value?: any;
  children?: TreeNode[];
  isLoaded?: boolean;
  isExpanded?: boolean;
  level?: number;
  parentId?: string;
}

interface VirtualizedTreeProps {
  nodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  onNodeExpand?: (nodeId: string) => Promise<TreeNode[]>;
  onNodeToggleSubscription?: (nodeId: string, subscribe: boolean) => void;
  selectedNodeId?: string;
  subscribedNodes?: Set<string>;
  height?: number;
  itemHeight?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface FlatTreeNode extends TreeNode {
  level: number;
  hasChildren: boolean;
  isVisible: boolean;
}

const NODE_ICONS = {
  Object: Folder,
  Variable: FileText,
  Method: Cog,
  ObjectType: Folder,
  VariableType: FileText,
  DataType: FileText,
};

const NODE_COLORS = {
  Object: 'text-blue-400',
  Variable: 'text-green-400',
  Method: 'text-purple-400',
  ObjectType: 'text-blue-300',
  VariableType: 'text-green-300',
  DataType: 'text-gray-400',
};

export function VirtualizedTree({
  nodes,
  onNodeSelect,
  onNodeExpand,
  onNodeToggleSubscription,
  selectedNodeId,
  subscribedNodes = new Set(),
  height = 600,
  itemHeight = 32,
  searchQuery = '',
  onSearchChange
}: VirtualizedTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const listRef = useRef<List>(null);

  // Update internal search query when prop changes
  useEffect(() => {
    setInternalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setInternalSearchQuery(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  // Clear search
  const clearSearch = useCallback(() => {
    handleSearchChange('');
  }, [handleSearchChange]);

  // Flatten tree structure for virtual scrolling
  const flattenedNodes = useMemo(() => {
    const flattened: FlatTreeNode[] = [];
    const searchLower = internalSearchQuery.toLowerCase();
    
    const flattenNode = (node: TreeNode, level: number = 0): void => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      
      // Check if node matches search
      const matchesSearch = !internalSearchQuery || 
        node.displayName.toLowerCase().includes(searchLower) ||
        node.nodeId.toLowerCase().includes(searchLower);
      
      // For search, expand all matching nodes and their parents
      const shouldShowDueToSearch = internalSearchQuery && matchesSearch;
      const isVisible = !internalSearchQuery || matchesSearch || shouldShowDueToSearch;
      
      if (isVisible) {
        flattened.push({
          ...node,
          level,
          hasChildren,
          isVisible,
          isExpanded
        });
      }
      
      // Recursively add children if expanded or if searching and node matches
      if (hasChildren && (isExpanded || shouldShowDueToSearch)) {
        node.children!.forEach(child => flattenNode(child, level + 1));
      }
    };

    nodes.forEach(node => flattenNode(node));
    return flattened;
  }, [nodes, expandedNodes, internalSearchQuery]);

  // Handle node expansion
  const handleNodeExpand = useCallback(async (node: FlatTreeNode) => {
    const newExpandedNodes = new Set(expandedNodes);
    
    if (expandedNodes.has(node.id)) {
      // Collapse
      newExpandedNodes.delete(node.id);
    } else {
      // Expand
      newExpandedNodes.add(node.id);
      
      // Load children if not already loaded
      if (!node.isLoaded && onNodeExpand) {
        try {
          await onNodeExpand(node.nodeId);
        } catch (error) {
          console.error('Failed to expand node:', error);
          return;
        }
      }
    }
    
    setExpandedNodes(newExpandedNodes);
  }, [expandedNodes, onNodeExpand]);

  // Handle node selection
  const handleNodeSelect = useCallback((node: FlatTreeNode) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  // Handle subscription toggle
  const handleSubscriptionToggle = useCallback((e: React.MouseEvent, node: FlatTreeNode) => {
    e.stopPropagation();
    const isSubscribed = subscribedNodes.has(node.nodeId);
    onNodeToggleSubscription?.(node.nodeId, !isSubscribed);
  }, [subscribedNodes, onNodeToggleSubscription]);

  // Row renderer for virtual list
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const node = flattenedNodes[index];
    if (!node) return null;

    const Icon = NODE_ICONS[node.nodeClass];
    const isSelected = selectedNodeId === node.id;
    const isSubscribed = subscribedNodes.has(node.nodeId);
    const hasChildren = node.hasChildren;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div
        style={style}
        className={`flex items-center w-full px-2 py-1 cursor-pointer hover:bg-slate-700/50 transition-colors ${
          isSelected ? 'bg-blue-500/20 border-l-2 border-blue-400' : ''
        }`}
        onClick={() => handleNodeSelect(node)}
        title={`${node.displayName} (${node.nodeId})`}
      >
        {/* Indentation */}
        <div style={{ width: node.level * 20 }} />
        
        {/* Expand/Collapse button */}
        <div className="w-5 h-5 flex items-center justify-center mr-1">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNodeExpand(node);
              }}
              className="p-0.5 hover:bg-slate-600 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </button>
          )}
        </div>

        {/* Node icon */}
        <Icon className={`w-4 h-4 mr-2 ${NODE_COLORS[node.nodeClass]}`} />

        {/* Node name */}
        <span className="text-white text-sm truncate flex-1 mr-2">
          {node.displayName}
        </span>

        {/* Node class badge */}
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded mr-2 hidden sm:inline">
          {node.nodeClass}
        </span>

        {/* Value display for variables */}
        {node.nodeClass === 'Variable' && node.value !== undefined && (
          <span className="text-xs text-green-300 bg-green-900/30 px-2 py-0.5 rounded mr-2 max-w-24 truncate">
            {String(node.value)}
          </span>
        )}

        {/* Subscription button for variables */}
        {node.nodeClass === 'Variable' && (
          <button
            onClick={(e) => handleSubscriptionToggle(e, node)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              isSubscribed
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          >
            {isSubscribed ? 'Sub' : 'Sub?'}
          </button>
        )}
      </div>
    );
  }, [
    flattenedNodes,
    selectedNodeId,
    subscribedNodes,
    expandedNodes,
    handleNodeSelect,
    handleNodeExpand,
    handleSubscriptionToggle
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 border-b border-slate-600">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={internalSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />
          {internalSearchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-slate-600 rounded transition-colors"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
        
        {/* Search results info */}
        {internalSearchQuery && (
          <div className="mt-2 text-xs text-slate-400">
            Found {flattenedNodes.length} node{flattenedNodes.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Virtual list */}
      <div className="flex-1">
        <List
          ref={listRef}
          height={height - 100} // Account for search bar
          itemCount={flattenedNodes.length}
          itemSize={itemHeight}
          width="100%"
          overscanCount={10} // Render extra items for smooth scrolling
        >
          {Row}
        </List>
      </div>

      {/* Status bar */}
      <div className="p-2 border-t border-slate-600 text-xs text-slate-400 bg-slate-800/50">
        <div className="flex justify-between">
          <span>
            {flattenedNodes.length} visible nodes
            {internalSearchQuery && ` (filtered)`}
          </span>
          <span>
            {subscribedNodes.size} subscribed
          </span>
        </div>
      </div>
    </div>
  );
}
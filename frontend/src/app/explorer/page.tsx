'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/components/layout/AppLayout';
import { Globe } from 'lucide-react';
import { OpcUaNode } from '@/types/websocket';
import { useWebSocket } from '@/hooks/useWebSocket';

// Dynamically import components to avoid SSR issues
const OpcUaExplorer = dynamic(() => import('@/components/opcua/OpcUaExplorer'), { 
  ssr: false,
  loading: () => (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-8 animate-pulse">
      <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  )
});

const NodeDetails = dynamic(() => import('@/components/opcua/NodeDetails'), { ssr: false });
const CodeExamples = dynamic(() => import('@/components/opcua/CodeExamples'), { ssr: false });

// Mock OPC UA nodes for development
const mockNodes: OpcUaNode[] = [
  {
    nodeId: 'ns=1;s=MiningSite_GoldRush',
    browseName: 'MiningSite_GoldRush',
    displayName: 'Gold Rush Mining Site',
    nodeClass: 'Object',
    isFolder: true,
    children: [
      {
        nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment',
        browseName: 'MiningEquipment',
        displayName: 'Mining Equipment',
        nodeClass: 'Object',
        isFolder: true,
        children: [
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators',
            browseName: 'Excavators',
            displayName: 'Excavators',
            nodeClass: 'Object',
            isFolder: true,
            children: [
              {
                nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators.EX001',
                browseName: 'Excavator_EX001',
                displayName: 'Excavator EX001',
                nodeClass: 'Object',
                isFolder: true,
                children: [
                  {
                    nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators.EX001.OreGrade',
                    browseName: 'OreGrade',
                    displayName: 'Ore Grade',
                    nodeClass: 'Variable',
                    dataType: 'Double',
                    value: 5.2,
                    isFolder: false,
                    description: 'Current ore grade being excavated (g/t Au)'
                  },
                  {
                    nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators.EX001.LoadWeight',
                    browseName: 'LoadWeight',
                    displayName: 'Load Weight',
                    nodeClass: 'Variable',
                    dataType: 'Double',
                    value: 35.0,
                    isFolder: false,
                    description: 'Current bucket load weight (tonnes)'
                  },
                  {
                    nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators.EX001.Status',
                    browseName: 'OperationalMode',
                    displayName: 'Operational Mode',
                    nodeClass: 'Variable',
                    dataType: 'String',
                    value: 'Digging',
                    isFolder: false,
                    description: 'Current operational mode of the excavator'
                  }
                ]
              },
              {
                nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Excavators.EX002',
                browseName: 'Excavator_EX002',
                displayName: 'Excavator EX002',
                nodeClass: 'Object',
                isFolder: true
              }
            ]
          },
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.HaulTrucks',
            browseName: 'HaulTrucks',
            displayName: 'Haul Trucks',
            nodeClass: 'Object',
            isFolder: true,
            children: [
              {
                nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.HaulTrucks.TR001',
                browseName: 'HaulTruck_TR001',
                displayName: 'Haul Truck TR001',
                nodeClass: 'Object',
                isFolder: true,
                children: [
                  {
                    nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.HaulTrucks.TR001.PayloadWeight',
                    browseName: 'PayloadWeight',
                    displayName: 'Payload Weight',
                    nodeClass: 'Variable',
                    dataType: 'Double',
                    value: 180.0,
                    isFolder: false,
                    description: 'Current payload weight (tonnes)'
                  },
                  {
                    nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.HaulTrucks.TR001.PayloadGrade',
                    browseName: 'PayloadGrade',
                    displayName: 'Payload Grade',
                    nodeClass: 'Variable',
                    dataType: 'Double',
                    value: 2.8,
                    isFolder: false,
                    description: 'Average grade of payload (g/t Au)'
                  }
                ]
              }
            ]
          },
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.MiningEquipment.Conveyors',
            browseName: 'Conveyors',
            displayName: 'Conveyor Systems',
            nodeClass: 'Object',
            isFolder: true
          }
        ]
      },
      {
        nodeId: 'ns=1;s=MiningSite_GoldRush.GradeControlSystem',
        browseName: 'GradeControlSystem',
        displayName: 'Grade Control System',
        nodeClass: 'Object',
        isFolder: true,
        children: [
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.GradeControlSystem.AverageGrade',
            browseName: 'AverageGrade',
            displayName: 'Average Grade',
            nodeClass: 'Variable',
            dataType: 'Double',
            value: 2.8,
            isFolder: false,
            description: 'Site-wide average ore grade (g/t Au)'
          },
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.GradeControlSystem.CutoffGrade',
            browseName: 'GradeCutoff',
            displayName: 'Grade Cutoff',
            nodeClass: 'Variable',
            dataType: 'Double',
            value: 1.5,
            isFolder: false,
            description: 'Economic cutoff grade (g/t Au) - minimum grade for profitable extraction'
          }
        ]
      },
      {
        nodeId: 'ns=1;s=MiningSite_GoldRush.ProductionMetrics',
        browseName: 'ProductionMetrics',
        displayName: 'Production Metrics',
        nodeClass: 'Object',
        isFolder: true,
        children: [
          {
            nodeId: 'ns=1;s=MiningSite_GoldRush.ProductionMetrics.HourlyTonnage',
            browseName: 'HourlyTonnage',
            displayName: 'Hourly Tonnage',
            nodeClass: 'Variable',
            dataType: 'Double',
            value: 450.0,
            isFolder: false,
            description: 'Current production rate (t/h)'
          }
        ]
      }
    ]
  },
  {
    nodeId: 'ns=1;s=DemoControls',
    browseName: 'DemoControls',
    displayName: 'Demo Controls',
    nodeClass: 'Object',
    isFolder: true,
    children: [
      {
        nodeId: 'ns=1;s=DemoControls.TriggerHighGrade',
        browseName: 'TriggerHighGradeDiscovery',
        displayName: 'Trigger High Grade Discovery',
        nodeClass: 'Method',
        isFolder: false,
        description: 'Simulate discovery of high-grade ore zone'
      }
    ]
  }
];

export default function ExplorerPage() {
  const { messageHistory, send } = useWebSocket();
  const [selectedNode, setSelectedNode] = useState<OpcUaNode | null>(null);
  const [subscribedNodes, setSubscribedNodes] = useState<Set<string>>(new Set());
  const [realtimeValues, setRealtimeValues] = useState<Map<string, any>>(new Map());
  
  // Process OPC UA updates from WebSocket
  useEffect(() => {
    const latestMessage = messageHistory[messageHistory.length - 1];
    if (!latestMessage || latestMessage.type !== 'opcua_updates') return;
    
    const updates = latestMessage.payload?.updates || [];
    updates.forEach((update: any) => {
      setRealtimeValues(prev => {
        const next = new Map(prev);
        next.set(update.nodeId, update.value);
        return next;
      });
    });
  }, [messageHistory]);
  
  const handleNodeSelect = (node: OpcUaNode) => {
    setSelectedNode(node);
  };
  
  const handleSubscribe = (nodeId: string) => {
    setSubscribedNodes(prev => new Set(prev).add(nodeId));
    
    // Send subscription request via WebSocket
    send({
      type: 'opcua_subscribe',
      nodeId,
      interval: 1000
    });
  };
  
  const handleUnsubscribe = (nodeId: string) => {
    setSubscribedNodes(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
    
    // Send unsubscribe request via WebSocket
    send({
      type: 'opcua_unsubscribe',
      nodeId
    });
  };
  
  return (
    <AppLayout>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Globe className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">OPC UA Explorer</h1>
            <p className="text-slate-400">Browse mining equipment nodes and explore the OPC UA address space</p>
          </div>
        </div>
        
        {/* Quick Introduction */}
        <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Getting Started:</strong> This explorer allows you to browse the real-time data structure of the mining operation. 
            Click on folders to expand them, select variables to see their current values, and subscribe to receive live updates. 
            Look for the <span className="text-yellow-400">yellow-highlighted mining equipment nodes</span> for the most relevant operational data.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OPC UA Tree Explorer (2 columns) */}
        <div className="lg:col-span-2">
          <OpcUaExplorer
            nodes={mockNodes}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedNode?.nodeId}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            subscribedNodes={subscribedNodes}
            className="h-full"
          />
        </div>
        
        {/* Right Panel (1 column) */}
        <div className="space-y-6">
          
          {/* Node Details */}
          <NodeDetails
            node={selectedNode}
            isSubscribed={selectedNode ? subscribedNodes.has(selectedNode.nodeId) : false}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            realtimeValue={selectedNode ? realtimeValues.get(selectedNode.nodeId) : undefined}
          />
          
          {/* Code Examples */}
          <CodeExamples
            node={selectedNode}
            serverUrl="opc.tcp://localhost:4840/mining-demo"
          />
          
          {/* Subscription Summary */}
          {subscribedNodes.size > 0 && (
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Active Subscriptions</h4>
              <div className="space-y-2">
                {Array.from(subscribedNodes).map(nodeId => (
                  <div key={nodeId} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <code className="text-xs text-blue-400 font-mono truncate flex-1">
                      {nodeId}
                    </code>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {subscribedNodes.size} node{subscribedNodes.size !== 1 ? 's' : ''} receiving live updates
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
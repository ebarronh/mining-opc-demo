import { useState, useEffect, useCallback } from 'react';
import { DataFlowNode, DataFlowConnection } from '@/types/integration';

// Sample ISA-95 nodes for data flow visualization
const SAMPLE_NODES: DataFlowNode[] = [
  // Level 0 - Field Level
  {
    id: 'sensor_1',
    level: 0,
    x: 100,
    y: 450,
    type: 'sensor',
    status: 'active',
    dataRate: 10
  },
  {
    id: 'sensor_2', 
    level: 0,
    x: 150,
    y: 470,
    type: 'sensor',
    status: 'active',
    dataRate: 15
  },
  // Level 1 - Control Level
  {
    id: 'plc_1',
    level: 1,
    x: 250,
    y: 380,
    type: 'controller',
    status: 'active',
    dataRate: 5
  },
  {
    id: 'plc_2',
    level: 1,
    x: 300,
    y: 400,
    type: 'controller', 
    status: 'active',
    dataRate: 8
  },
  // Level 2 - SCADA Level
  {
    id: 'scada_1',
    level: 2,
    x: 400,
    y: 300,
    type: 'controller',
    status: 'active',
    dataRate: 3
  },
  // Level 3 - MES Level
  {
    id: 'mes_1',
    level: 3,
    x: 500,
    y: 200,
    type: 'mes',
    status: 'active',
    dataRate: 1
  },
  // Level 4 - ERP Level
  {
    id: 'erp_1',
    level: 4,
    x: 600,
    y: 120,
    type: 'erp',
    status: 'active',
    dataRate: 0.5
  },
  // Level 5 - BI Level
  {
    id: 'bi_1',
    level: 5,
    x: 700,
    y: 50,
    type: 'bi',
    status: 'active',
    dataRate: 0.1
  }
];

// Sample connections showing ISA-95 data flow
const SAMPLE_CONNECTIONS: DataFlowConnection[] = [
  // Field to Control
  {
    id: 'conn_1',
    from: 'sensor_1',
    to: 'plc_1',
    protocol: 'OPC UA',
    latency: 10,
    dataVolume: 100,
    bidirectional: false
  },
  {
    id: 'conn_2',
    from: 'sensor_2',
    to: 'plc_2',
    protocol: 'Modbus',
    latency: 20,
    dataVolume: 150,
    bidirectional: false
  },
  // Control to SCADA
  {
    id: 'conn_3',
    from: 'plc_1',
    to: 'scada_1',
    protocol: 'OPC UA',
    latency: 50,
    dataVolume: 80,
    bidirectional: true
  },
  {
    id: 'conn_4',
    from: 'plc_2', 
    to: 'scada_1',
    protocol: 'Ethernet/IP',
    latency: 30,
    dataVolume: 120,
    bidirectional: true
  },
  // SCADA to MES
  {
    id: 'conn_5',
    from: 'scada_1',
    to: 'mes_1',
    protocol: 'REST API',
    latency: 500,
    dataVolume: 50,
    bidirectional: false
  },
  // MES to ERP
  {
    id: 'conn_6',
    from: 'mes_1',
    to: 'erp_1',
    protocol: 'SOAP',
    latency: 2000,
    dataVolume: 20,
    bidirectional: false
  },
  // ERP to BI
  {
    id: 'conn_7',
    from: 'erp_1',
    to: 'bi_1',
    protocol: 'ETL',
    latency: 10000,
    dataVolume: 5,
    bidirectional: false
  }
];

interface UseDataFlowOptions {
  simulateRealtime?: boolean;
  updateInterval?: number;
}

interface UseDataFlowReturn {
  nodes: DataFlowNode[];
  connections: DataFlowConnection[];
  isActive: boolean;
  toggleFlow: () => void;
  updateNodeStatus: (nodeId: string, status: DataFlowNode['status']) => void;
  getThroughputMetrics: () => {
    totalNodes: number;
    activeNodes: number;
    totalDataRate: number;
    avgLatency: number;
  };
}

export const useDataFlow = (options: UseDataFlowOptions = {}): UseDataFlowReturn => {
  const { simulateRealtime = true, updateInterval = 5000 } = options;
  
  const [nodes, setNodes] = useState<DataFlowNode[]>(SAMPLE_NODES);
  const [connections] = useState<DataFlowConnection[]>(SAMPLE_CONNECTIONS);
  const [isActive, setIsActive] = useState(true);

  // Simulate real-time node status changes
  useEffect(() => {
    if (!simulateRealtime || !isActive) return;

    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          // Randomly change node status occasionally
          if (Math.random() < 0.02) {
            const statuses: DataFlowNode['status'][] = ['active', 'inactive', 'error'];
            const currentIndex = statuses.indexOf(node.status);
            const newStatus = statuses[(currentIndex + 1) % statuses.length];
            return { ...node, status: newStatus };
          }
          
          // Simulate data rate fluctuations
          const baseRate = SAMPLE_NODES.find(n => n.id === node.id)?.dataRate || 1;
          const fluctuation = (Math.random() - 0.5) * 0.2;
          return {
            ...node,
            dataRate: Math.max(0.1, baseRate * (1 + fluctuation))
          };
        })
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [simulateRealtime, isActive, updateInterval]);

  const toggleFlow = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const updateNodeStatus = useCallback((nodeId: string, status: DataFlowNode['status']) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, status } : node
      )
    );
  }, []);

  const getThroughputMetrics = useCallback(() => {
    const activeNodes = nodes.filter(node => node.status === 'active');
    const totalDataRate = activeNodes.reduce((sum, node) => sum + node.dataRate, 0);
    const avgLatency = connections.reduce((sum, conn) => sum + conn.latency, 0) / connections.length;

    return {
      totalNodes: nodes.length,
      activeNodes: activeNodes.length,
      totalDataRate,
      avgLatency
    };
  }, [nodes, connections]);

  return {
    nodes,
    connections,
    isActive,
    toggleFlow,
    updateNodeStatus,
    getThroughputMetrics
  };
};
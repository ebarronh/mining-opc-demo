export interface EquipmentPosition {
  id: string;
  type: 'excavator' | 'truck' | 'conveyor';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  status: 'operating' | 'idle' | 'maintenance';
  telemetry?: {
    speed?: number;
    payload?: number;
    temperature?: number;
  };
}

export interface GradeData {
  timestamp: number;
  grid: number[][];
  gridSize: {
    rows: number;
    columns: number;
  };
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  statistics: {
    averageGrade: number;
    minGrade: number;
    maxGrade: number;
  };
}

export interface OpcUaUpdate {
  nodeId: string;
  value: any;
  timestamp: number | string;
  dataType: string;
  statusCode?: string;
}

export interface OpcUaNode {
  nodeId: string;
  browseName: string;
  displayName: string;
  nodeClass: string;
  dataType?: string;
  value?: any;
  children?: OpcUaNode[];
  isFolder: boolean;
  description?: string;
}

export interface WebSocketMessage {
  type: 'equipment_data' | 'equipment_positions' | 'grade_data' | 'opcua_updates' | 'system_health' | 'connection_established' | 'heartbeat' | 'pong' | 'system_status' | 'subscription_confirmed' | 'subscription_cancelled' | 'error';
  payload?: any;
  data?: any;
  timestamp: number | string;
}

export interface EquipmentPositionsMessage extends WebSocketMessage {
  type: 'equipment_positions';
  payload: {
    equipment: EquipmentPosition[];
  };
}

export interface GradeDataMessage extends WebSocketMessage {
  type: 'grade_data';
  payload: GradeData;
}

export interface OpcUaUpdatesMessage extends WebSocketMessage {
  type: 'opcua_updates';
  payload: {
    updates: OpcUaUpdate[];
  };
}

export interface SystemHealthMessage extends WebSocketMessage {
  type: 'system_health';
  payload: {
    status: 'healthy' | 'degraded' | 'error';
    message: string;
    details?: any;
  };
}

export interface EquipmentDataMessage extends WebSocketMessage {
  type: 'equipment_data';
  payload: {
    equipment: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      metrics: Record<string, number>;
      location?: string;
    }>;
  };
}

export type AllWebSocketMessages = 
  | EquipmentDataMessage 
  | EquipmentPositionsMessage 
  | GradeDataMessage 
  | OpcUaUpdatesMessage 
  | SystemHealthMessage;
// Mining Equipment Data Types for MineSensors OPC UA Demo

export interface ExcavatorData {
  // Mining-Specific Variables
  OreGrade: number;              // g/t Au (1.5 - 8.0 range)
  BucketPosition: {              // 3D coordinates in mine space
    X: number;                   // Easting (m)
    Y: number;                   // Northing (m)  
    Z: number;                   // Elevation (m)
  };
  LoadWeight: number;            // Tonnes in bucket (0-50t)
  CycleTime: number;             // Seconds for dig-swing-dump
  
  // Operational Status
  OperationalMode: 'Digging' | 'Loading' | 'Moving' | 'Maintenance';
  EngineRPM: number;            // 1200-2100 RPM
  HydraulicPressure: number;    // 200-350 bar
  FuelLevel: number;            // 0-100%
  
  // Safety & Compliance
  ExclusionZone: {              // Safety boundary around equipment
    Radius: number;             // Meters
    Active: boolean;
  };
  OperatorPresent: boolean;
  LastMaintenanceDate: Date;
}

export interface HaulTruckData {
  // Payload Management
  PayloadWeight: number;         // Current load (0-240t)
  PayloadGrade: number;          // Average ore grade if carrying ore
  Destination: 'Crusher' | 'WasteDump' | 'Stockpile_A' | 'Stockpile_B';
  
  // Navigation & Fleet
  GPSLocation: {
    Latitude: number;            // Mine coordinate system
    Longitude: number;
    Heading: number;             // Degrees (0-359)
  };
  Speed: number;                 // km/h
  RouteProgress: number;         // % complete to destination
  
  // Vehicle Status  
  EngineTemperature: number;     // °C
  TireStatus: string[];          // Pressure readings for 6 tires
  FuelEfficiency: number;        // L/100km
  LoadCycles: number;            // Total cycles today
}

export interface ConveyorData {
  // Material Flow
  ThroughputRate: number;        // Tonnes/hour
  BeltSpeed: number;             // m/s
  MaterialGrade: number;         // Average grade of material
  
  // Condition Monitoring
  BeltTension: number;           // kN
  VibrationLevel: number;        // mm/s RMS
  BearingTemperature: number;    // °C
  PowerConsumption: number;      // kW
  
  // Operational Control
  EmergencyStop: boolean;
  MaintenanceMode: boolean;
  RunHours: number;              // Total operating hours
}

export interface MineCoordinate {
  X: number;  // Easting
  Y: number;  // Northing
  Z: number;  // Elevation
}

export interface GradeDistribution {
  getGradeAtLocation(coord: MineCoordinate): number;
}

export interface MiningDataUpdate {
  timestamp: string;
  equipment: {
    excavators: ExcavatorData[];
    trucks: HaulTruckData[];
    conveyors: ConveyorData[];
  };
  siteMetrics: {
    hourlyTonnage: number;
    averageGrade: number;
    activeEquipment: number;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  opcua: {
    server_running: boolean;
    client_connections: number;
    data_updates_per_second: number;
  };
  websocket: {
    active_connections: number;
    messages_sent: number;
  };
  simulation: {
    equipment_count: number;
    scenarios_running: string[];
  };
}

export enum DigCycleState {
  Digging = 'Digging',
  Swinging = 'Swinging', 
  Dumping = 'Dumping',
  Returning = 'Returning',
  Moving = 'Moving'
}

export interface MiningScenario {
  name: string;
  description: string;
  active: boolean;
  startTime: Date;
  parameters: Record<string, any>;
}

// WebSocket Message Types
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
  status: 'operating' | 'idle' | 'error';
  telemetry: Record<string, any>;
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

export interface OpcUaNode {
  nodeId: string;
  browseName: string;
  displayName: string;
  nodeClass: string;
  dataType: string;
  value: any;
  hasChildren: boolean;
  description: string;
  namespace: number;
  category: string;
  accessLevel?: number;
  userAccessLevel?: number;
  writeMask?: number;
  userWriteMask?: number;
}

export interface WebSocketMessage {
  type: string;
  payload?: any;
  data?: any;
  timestamp: string;
}
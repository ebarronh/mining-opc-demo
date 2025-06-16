// TypeScript types for Phase 5 enterprise integration components

export interface ISA95Level {
  id: number;
  name: string;
  description: string;
  miningContext: string;
  dataTypes: string[];
  protocols: string[];
  latency: string;
  dataVolume: string;
  securityBoundary: boolean;
}

export interface DataFlowNode {
  id: string;
  level: number;
  x: number;
  y: number;
  type: 'sensor' | 'controller' | 'mes' | 'erp' | 'bi';
  status: 'active' | 'inactive' | 'error';
  dataRate: number;
}

export interface DataFlowConnection {
  id: string;
  from: string;
  to: string;
  protocol: string;
  latency: number;
  dataVolume: number;
  bidirectional: boolean;
}

export interface DataFlowParticle {
  id: string;
  connectionId: string;
  progress: number;
  data: any;
  timestamp: number;
}

export interface FleetManagementSystem {
  id: string;
  name: string;
  vendor: string;
  protocol: 'REST' | 'SOAP' | 'OPC_UA';
  status: 'connected' | 'pending' | 'configured' | 'error';
  apiEndpoint: string;
  features: string[];
  integration: {
    dataFormat: string;
    authMethod: string;
    rateLimit: number;
  };
}

export interface OracleCloudService {
  id: string;
  name: string;
  type: 'database' | 'function' | 'analytics' | 'apex' | 'ords';
  status: 'active' | 'inactive' | 'provisioning';
  endpoint?: string;
  description: string;
}

export interface DeltaShareDataset {
  id: string;
  name: string;
  provider: string;
  schema: string;
  tables: string[];
  permissions: ('read' | 'write' | 'share')[];
  lastUpdated: string;
  rowCount: number;
  sizeBytes: number;
}

export interface ERPSystem {
  id: string;
  name: string;
  vendor: 'SAP' | 'Oracle' | 'Microsoft';
  modules: string[];
  integrationEndpoints: string[];
  status: 'active' | 'maintenance' | 'error';
}

export interface EdgeComputingNode {
  id: string;
  name: string;
  location: string;
  capabilities: string[];
  status: 'online' | 'offline' | 'degraded';
  processing: {
    cpu: number;
    memory: number;
    storage: number;
  };
  environmentalRatings: {
    temperature: string;
    dustRating: string;
    vibrationResistance: string;
  };
}

export interface AnalyticsMetrics {
  kpi: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  timestamp: string;
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  examples: APIExample[];
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

export interface APIResponse {
  status: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface APIExample {
  language: string;
  code: string;
  description: string;
}

export interface IntegrationPattern {
  id: string;
  name: string;
  category: 'messaging' | 'data' | 'process' | 'security';
  description: string;
  diagram: string;
  pros: string[];
  cons: string[];
  useCase: string;
  implementation: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  category: 'connectivity' | 'performance' | 'security' | 'data';
  symptoms: string[];
  diagnosis: string;
  solution: string;
  prevention: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
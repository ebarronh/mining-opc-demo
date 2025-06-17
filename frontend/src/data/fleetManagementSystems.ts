// Fleet Management Systems data for mining operations
// Supports integration with major OEM vendors

export interface FleetManagementSystem {
  id: string
  name: string
  vendor: string
  color: string
  description: string
  features: string[]
  apiEndpoints: {
    vehicles: string
    routing: string
    status: string
    assignments: string
  }
  dataFormats: {
    input: string
    output: string
    protocol: string
  }
  integrationComplexity: 'Low' | 'Medium' | 'High'
  marketShare: number
  supportedEquipment: string[]
  deploymentRegions: string[]
  costProfile: {
    implementation: string
    maintenance: string
    licensing: string
  }
}

export const fleetManagementSystems: FleetManagementSystem[] = [
  {
    id: 'komatsu-fms',
    name: 'KOMTRAX Plus',
    vendor: 'Komatsu',
    color: '#FFD700', // Komatsu yellow
    description: 'Advanced fleet management with autonomous vehicle integration and comprehensive equipment monitoring.',
    features: [
      'Autonomous Haulage System (AHS) integration',
      'Real-time equipment monitoring',
      'Predictive maintenance alerts',
      'Fuel efficiency optimization',
      'Operator behavior analytics',
      'Collision avoidance systems'
    ],
    apiEndpoints: {
      vehicles: '/api/komatsu/vehicles',
      routing: '/api/komatsu/routes',
      status: '/api/komatsu/status',
      assignments: '/api/komatsu/assignments'
    },
    dataFormats: {
      input: 'JSON with Komatsu proprietary schemas',
      output: 'REST API with real-time WebSocket streams',
      protocol: 'HTTPS + WebSocket + Komatsu CAN Bus'
    },
    integrationComplexity: 'Medium',
    marketShare: 35,
    supportedEquipment: [
      '830E/930E Dump Trucks',
      'PC8000 Excavators',
      'WA800/WA900 Wheel Loaders',
      'D475A Dozers',
      'GD825 Motor Graders'
    ],
    deploymentRegions: ['Asia-Pacific', 'North America', 'South America', 'Africa'],
    costProfile: {
      implementation: '$2.5M - $5M',
      maintenance: '$500K/year',
      licensing: '$200K/year per 100 vehicles'
    }
  },
  {
    id: 'caterpillar-fms',
    name: 'Cat MineStar Fleet',
    vendor: 'Caterpillar',
    color: '#FFCD11', // Caterpillar yellow
    description: 'Comprehensive mining fleet management with integrated safety systems and production optimization.',
    features: [
      'Command for autonomous operations',
      'Fleet production optimization',
      'Dynamic route optimization',
      'Collision avoidance technology',
      'Operator assistance systems',
      'Equipment health monitoring'
    ],
    apiEndpoints: {
      vehicles: '/api/caterpillar/fleet',
      routing: '/api/caterpillar/dispatch',
      status: '/api/caterpillar/health',
      assignments: '/api/caterpillar/tasks'
    },
    dataFormats: {
      input: 'XML/JSON with Cat proprietary message formats',
      output: 'REST API with MineStar data schemas',
      protocol: 'HTTPS + Cat Link + VIMS Integration'
    },
    integrationComplexity: 'High',
    marketShare: 42,
    supportedEquipment: [
      '797F/798 Dump Trucks',
      '6060/6090 FS Excavators',
      '994K Wheel Loaders',
      'D11T Dozers',
      '24M Motor Graders'
    ],
    deploymentRegions: ['Global', 'North America', 'Australia', 'Chile', 'Africa'],
    costProfile: {
      implementation: '$3M - $8M',
      maintenance: '$750K/year',
      licensing: '$300K/year per 100 vehicles'
    }
  },
  {
    id: 'wenco-fms',
    name: 'Wenco Fleet Management',
    vendor: 'Wenco (Hitachi)',
    color: '#E60012', // Wenco/Hitachi red
    description: 'Vendor-agnostic fleet management solution with focus on multi-OEM integration and flexibility.',
    features: [
      'Multi-OEM equipment support',
      'Real-time dispatch optimization',
      'Production reporting and analytics',
      'Equipment utilization tracking',
      'Maintenance scheduling integration',
      'Custom KPI dashboards'
    ],
    apiEndpoints: {
      vehicles: '/api/wenco/equipment',
      routing: '/api/wenco/dispatch',
      status: '/api/wenco/monitoring',
      assignments: '/api/wenco/operations'
    },
    dataFormats: {
      input: 'Standardized JSON with configurable schemas',
      output: 'RESTful APIs with flexible data mapping',
      protocol: 'HTTPS + MQTT + OEM-specific adapters'
    },
    integrationComplexity: 'Low',
    marketShare: 18,
    supportedEquipment: [
      'Multi-OEM Trucks (Cat, Komatsu, Liebherr)',
      'Multi-OEM Excavators',
      'Multi-OEM Loaders',
      'Multi-OEM Support Equipment',
      'Third-party sensors and devices'
    ],
    deploymentRegions: ['Global', 'Flexible deployment options'],
    costProfile: {
      implementation: '$1.5M - $4M',
      maintenance: '$400K/year',
      licensing: '$150K/year per 100 vehicles'
    }
  }
]

// Performance metrics and benefits data
export interface PerformanceMetrics {
  diversionRate: {
    baseline: number
    optimized: number
    improvement: number
  }
  costSavings: {
    minAnnual: number
    maxAnnual: number
    avgPerTruck: number
  }
  efficiency: {
    fuelReduction: number
    cycleTimeReduction: number
    utilizationIncrease: number
  }
  safety: {
    incidentReduction: number
    collisionAvoidance: number
    operatorAlerts: number
  }
}

export const performanceMetrics: PerformanceMetrics = {
  diversionRate: {
    baseline: 12.3,
    optimized: 5.9,
    improvement: 6.4
  },
  costSavings: {
    minAnnual: 3000000, // $3M
    maxAnnual: 50000000, // $50M
    avgPerTruck: 75000 // $75K per truck annually
  },
  efficiency: {
    fuelReduction: 15.2, // percentage
    cycleTimeReduction: 8.7, // percentage
    utilizationIncrease: 12.4 // percentage
  },
  safety: {
    incidentReduction: 67, // percentage
    collisionAvoidance: 99.2, // percentage
    operatorAlerts: 2400 // alerts per month
  }
}

// Translation layer capabilities
export interface TranslationLayer {
  inputFormats: string[]
  outputFormats: string[]
  protocols: string[]
  transformations: string[]
  mappingRules: number
  processingLatency: string
}

export const translationLayer: TranslationLayer = {
  inputFormats: [
    'Komatsu CAN Bus messages',
    'Caterpillar VIMS data',
    'Wenco standard schemas',
    'OPC UA mining companion',
    'Custom JSON/XML formats'
  ],
  outputFormats: [
    'ISA-95 Level 2 schemas',
    'Standardized fleet events',
    'Equipment status messages',
    'Production metrics',
    'Maintenance alerts'
  ],
  protocols: [
    'OPC UA',
    'MQTT',
    'REST APIs',
    'WebSocket streams',
    'Delta Share'
  ],
  transformations: [
    'Unit conversions (metric/imperial)',
    'Coordinate system transformations',
    'Time zone normalization',
    'Equipment ID mapping',
    'Status code standardization'
  ],
  mappingRules: 847,
  processingLatency: '<50ms'
}

// Real-time truck data simulation
export interface TruckData {
  id: string
  type: string
  vendor: string
  position: { x: number; y: number; z: number }
  status: 'loading' | 'hauling' | 'dumping' | 'returning' | 'maintenance' | 'idle'
  load: {
    material: string
    grade: number
    weight: number
    capacity: number
  }
  destination: {
    type: 'crusher' | 'waste' | 'stockpile'
    id: string
    eta: number
  }
  route: {
    current: string
    alternative?: string
    diversionReason?: string
  }
  operator: {
    id: string
    name: string
    experience: number
    shift: string
  }
  telemetry: {
    fuel: number
    speed: number
    engineHours: number
    temperature: number
    pressure: number
  }
}

export const generateMockTruckData = (): TruckData[] => [
  {
    id: 'KOM-001',
    type: '830E',
    vendor: 'Komatsu',
    position: { x: 245, y: 120, z: 15 },
    status: 'hauling',
    load: {
      material: 'Iron Ore',
      grade: 58.7,
      weight: 185,
      capacity: 220
    },
    destination: {
      type: 'crusher',
      id: 'CR-001',
      eta: 12
    },
    route: {
      current: 'Route-A',
      alternative: 'Route-B-Express',
      diversionReason: 'Higher grade ore detected'
    },
    operator: {
      id: 'OP-001',
      name: 'Sarah Chen',
      experience: 7,
      shift: 'Day'
    },
    telemetry: {
      fuel: 78,
      speed: 28,
      engineHours: 12847,
      temperature: 87,
      pressure: 34
    }
  },
  {
    id: 'CAT-042',
    type: '797F',
    vendor: 'Caterpillar',
    position: { x: 180, y: 85, z: 22 },
    status: 'loading',
    load: {
      material: 'Waste Rock',
      grade: 12.1,
      weight: 0,
      capacity: 380
    },
    destination: {
      type: 'waste',
      id: 'WD-003',
      eta: 0
    },
    route: {
      current: 'Loading-Bay-2'
    },
    operator: {
      id: 'OP-042',
      name: 'Marcus Johnson',
      experience: 12,
      shift: 'Day'
    },
    telemetry: {
      fuel: 65,
      speed: 0,
      engineHours: 15230,
      temperature: 92,
      pressure: 38
    }
  },
  {
    id: 'WEN-128',
    type: 'Multi-OEM',
    vendor: 'Wenco',
    position: { x: 320, y: 200, z: 8 },
    status: 'returning',
    load: {
      material: 'Empty',
      grade: 0,
      weight: 0,
      capacity: 300
    },
    destination: {
      type: 'stockpile',
      id: 'SP-007',
      eta: 8
    },
    route: {
      current: 'Return-Route-C'
    },
    operator: {
      id: 'OP-128',
      name: 'Diana Rodriguez',
      experience: 5,
      shift: 'Day'
    },
    telemetry: {
      fuel: 42,
      speed: 35,
      engineHours: 9876,
      temperature: 85,
      pressure: 32
    }
  }
]
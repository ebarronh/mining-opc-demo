# Phase 2 – OPC UA Server MVP: Detailed Task Breakdown

## 🎯 Phase Objective
**Create an educational OPC UA mining demonstration server that showcases real-world mining operations and OPC UA standards compliance.**

This phase transforms our skeleton into a functional OPC UA server that mining professionals can connect to, explore, and understand. The server will simulate a realistic mining operation with live equipment data, demonstrating both OPC UA capabilities and mining industry applications.

---

## 📚 Educational Goals

### Primary Learning Outcomes
1. **OPC UA Fundamentals**: Demonstrate Address Space, Nodes, Variables, and Subscriptions in action
2. **Mining Equipment Integration**: Show how excavators, trucks, and conveyors expose operational data
3. **Real-Time Data Flows**: Illustrate how mining operations generate and consume live equipment data
4. **Industry Standards**: Prove OPC UA Mining Companion Specification compliance through practical examples

### Target Audience Understanding
- **Mining Engineers**: Recognize familiar equipment and operational parameters
- **OPC UA Developers**: See practical implementation of industrial automation standards
- **System Integrators**: Understand data models and integration patterns
- **Executives**: Grasp business value through realistic operational scenarios

---

## 🏗️ Technical Architecture

### OPC UA Server Foundation
```
MineSensors OPC UA Server (opc.tcp://localhost:4840/mining-demo)
├── Root Objects Folder
│   ├── MiningSite_GoldRush/              # Mining site instance
│   │   ├── MiningEquipment/              # Equipment container folder
│   │   │   ├── Excavators/
│   │   │   │   ├── Excavator_EX001/      # Hydraulic excavator instance
│   │   │   │   └── Excavator_EX002/      # Second excavator
│   │   │   ├── HaulTrucks/
│   │   │   │   ├── HaulTruck_TR001/      # Mining truck instance
│   │   │   │   ├── HaulTruck_TR002/
│   │   │   │   └── HaulTruck_TR003/
│   │   │   └── Conveyors/
│   │   │       ├── ConveyorBelt_CV001/   # Primary crusher feed
│   │   │       └── ConveyorBelt_CV002/   # Stockpile conveyor
│   │   ├── GradeControlSystem/           # Ore quality monitoring
│   │   └── ProductionMetrics/            # Site-wide KPIs
│   └── DemoControls/                     # Educational scenario triggers
```

### Mining Equipment Data Models

#### Excavator Data (HydraulicExcavatorType)
```typescript
interface ExcavatorData {
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
  OperationalMode: string;       // "Digging" | "Loading" | "Moving" | "Maintenance"
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
```

#### Truck Data (HaulTruckType)
```typescript
interface HaulTruckData {
  // Payload Management
  PayloadWeight: number;         // Current load (0-240t)
  PayloadGrade: number;          // Average ore grade if carrying ore
  Destination: string;           // "Crusher" | "WasteDump" | "Stockpile_A"
  
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
```

#### Conveyor Data (ConveyorSystemType)
```typescript
interface ConveyorData {
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
```

---

## 📋 Detailed Task Breakdown

### T-1: OPC UA Server Core Implementation
**Owner**: Backend Engineer  
**Effort**: 6-8 hours  
**Dependencies**: Phase 1 skeleton

#### T-1.1: Server Bootstrap & Configuration
- **File**: `backend/src/server.ts`
- **Task**: Replace skeleton with full OPC UA server
- **Details**:
  - Configure server with mining-appropriate buildInfo
  - Set up proper endpoint (`opc.tcp://localhost:4840/mining-demo`)
  - Enable SecurityPolicy.None for educational demo
  - Add comprehensive logging for demo purposes

```typescript
// Expected server configuration
const server = new OPCUAServer({
    port: 4840,
    resourcePath: "/mining-demo",
    buildInfo: {
        productName: "MineSensors Educational Mining Demo",
        buildNumber: "2.0.0",
        buildDate: new Date(),
        manufacturerName: "MineSensors Technologies"
    },
    serverInfo: {
        applicationName: { text: "Mining Operations OPC UA Demo" },
        applicationUri: "urn:MineSensors:Mining:Demo"
    }
});
```

#### T-1.2: Address Space Foundation
- **File**: `backend/src/addressSpace/mining-namespace.ts`
- **Task**: Create hierarchical mining address space
- **Details**:
  - Import OPC UA Mining Companion Specification types
  - Create MiningSite_GoldRush root object
  - Establish MiningEquipment folder structure
  - Add DemoControls for educational scenarios

### T-2: Mining Equipment Simulation Engine
**Owner**: Backend Engineer  
**Effort**: 8-10 hours  
**Dependencies**: T-1 (Server core)

#### T-2.1: Excavator Simulation
- **File**: `backend/src/simulation/excavator-simulator.ts`
- **Task**: Realistic excavator behavior simulation
- **Details**:
  - Implement dig cycle timing (30-45 second cycles)
  - Simulate ore grade discovery (geological variation)
  - GPS coordinate movement within defined dig areas
  - Engine and hydraulic parameter correlation

```typescript
class ExcavatorSimulator {
  private digCycle: DigCycleState;
  private currentLocation: MineCoordinate;
  private geologicalMap: GradeDistribution;
  
  // Simulate realistic mining operation
  updateCycle(deltaTime: number): ExcavatorData {
    // Progress through dig -> swing -> dump -> return cycle
    // Update ore grade based on geological model
    // Move GPS coordinates realistically
    // Correlate fuel consumption with cycle intensity
  }
}
```

#### T-2.2: Truck Fleet Simulation
- **File**: `backend/src/simulation/truck-simulator.ts`
- **Task**: Haul truck routing and payload simulation
- **Details**:
  - Route planning between excavators and destinations
  - Load/unload cycles with realistic timing
  - Fuel consumption and tire wear modeling
  - Fleet coordination (avoid multiple trucks at same excavator)

#### T-2.3: Conveyor System Simulation
- **File**: `backend/src/simulation/conveyor-simulator.ts`
- **Task**: Material handling system simulation
- **Details**:
  - Throughput based on upstream truck deliveries
  - Condition monitoring parameter drift
  - Maintenance scheduling simulation
  - Power consumption correlation with load

### T-3: Educational Data Storytelling
**Owner**: Product Engineer  
**Effort**: 4-6 hours  
**Dependencies**: T-2 (Simulation engine)

#### T-3.1: Realistic Mining Scenarios
- **File**: `backend/src/scenarios/mining-scenarios.ts`
- **Task**: Create compelling educational narratives
- **Details**:
  - **High-Grade Discovery**: Excavator EX001 discovers 5.8 g/t Au area
  - **Equipment Maintenance**: Conveyor CV001 shows increasing vibration
  - **Fleet Optimization**: Route trucks efficiently based on ore grade
  - **Production Targets**: Show daily tonnage and grade objectives

#### T-3.2: Grade Control Intelligence
- **Task**: Simulate ore grade decision-making
- **Details**:
  - Implement grade cutoff logic (>2.5 g/t to mill, <2.5 g/t to waste)
  - Show economic impact of routing decisions
  - Demonstrate real-time optimization
  - Educational tooltips explaining mining economics

### T-4: WebSocket Bridge for Real-Time Frontend
**Owner**: Full-Stack Engineer  
**Effort**: 4-5 hours  
**Dependencies**: T-2 (Simulation data available)

#### T-4.1: WebSocket Server Implementation
- **File**: `backend/src/websocket/ws-bridge.ts`
- **Task**: Bridge OPC UA data to web clients
- **Details**:
  - Subscribe to all mining equipment variables
  - Transform OPC UA data to JSON for web consumption
  - Implement efficient update batching (max 30 updates/second)
  - Add connection management and reconnection logic

```typescript
// Expected WebSocket message format
interface MiningDataUpdate {
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
```

### T-5: Metrics & Monitoring for Demo Validation
**Owner**: Backend Engineer  
**Effort**: 3-4 hours  
**Dependencies**: T-1, T-4

#### T-5.1: Performance Metrics API
- **File**: `backend/src/api/metrics.ts`
- **Task**: Expose demo performance data
- **Details**:
  - OPC UA client connection count
  - Data update frequency and latency
  - WebSocket client count and throughput
  - Equipment simulation health status

#### T-5.2: Demo Health Endpoint
- **Endpoint**: `GET /api/health`
- **Task**: Support Puppeteer validation
- **Response**:
```json
{
  "status": "healthy",
  "opcua": {
    "server_running": true,
    "client_connections": 2,
    "data_updates_per_second": 15
  },
  "websocket": {
    "active_connections": 1,
    "messages_sent": 1247
  },
  "simulation": {
    "equipment_count": 7,
    "scenarios_running": ["high_grade_discovery"]
  }
}
```

---

## 🧪 Testing & Quality Assurance

### Unit Testing Requirements
- **T-6.1**: Equipment simulator unit tests
- **T-6.2**: OPC UA server integration tests
- **T-6.3**: WebSocket message format validation
- **T-6.4**: Mining scenario correctness tests

### OPC UA Client Testing
- **T-6.5**: UA Expert browsing verification
- **T-6.6**: Data subscription performance testing
- **T-6.7**: Address space compliance validation

---

## 📊 Educational Documentation

### T-7: Mining Operations Guide
**File**: `docs/mining-demo-guide.md`
**Task**: Create educational content explaining the demo
**Content**:
- Mining operation overview for non-mining audiences
- OPC UA concepts demonstrated in practice
- Equipment data interpretation guide
- Scenario explanations and business impact

### T-8: OPC UA Implementation Notes
**File**: `docs/opcua-implementation.md` 
**Task**: Technical documentation for developers
**Content**:
- Mining Companion Specification compliance notes
- Address space design decisions
- Data modeling rationale
- Integration patterns demonstrated

---

## 🤖 Puppeteer MCP Validation Script

### T-9: Automated Demo Validation
**File**: `tests/puppeteer-phase2-validation.js`
**Task**: Comprehensive demo testing via Puppeteer MCP

#### Validation Steps:
1. **Docker Environment Setup**
   ```bash
   docker-compose up --build --detach
   # Wait for services to be healthy
   ```

2. **OPC UA Server Validation**
   - Verify endpoint `opc.tcp://localhost:4840/mining-demo` is accessible
   - Connect via UA Expert automation (if available)
   - Validate address space structure matches specification

3. **Backend Health Checks**
   ```javascript
   // Check server health endpoint
   const healthResponse = await fetch('http://localhost:3001/api/health');
   expect(healthResponse.status).toBe(200);
   
   const health = await healthResponse.json();
   expect(health.opcua.server_running).toBe(true);
   expect(health.simulation.equipment_count).toBeGreaterThan(0);
   ```

4. **WebSocket Data Flow Validation**
   ```javascript
   // Connect to WebSocket and verify data flow
   const ws = new WebSocket('ws://localhost:4841');
   
   // Validate mining data structure
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     expect(data.equipment.excavators).toBeDefined();
     expect(data.equipment.trucks).toBeDefined();
     expect(data.siteMetrics.hourlyTonnage).toBeGreaterThan(0);
   };
   ```

5. **Frontend Integration Test**
   ```javascript
   await page.goto('http://localhost:3000');
   
   // Verify Phase 1 skeleton still works
   await expect(page.locator('h1')).toContainText('MineSensors OPC UA');
   
   // Check system status shows Phase 2 completion
   const serverStatus = page.locator('[data-testid="server-status"]');
   await expect(serverStatus).toContainText('OPC UA Server: Online');
   ```

6. **Mining Data Validation**
   ```javascript
   // Validate realistic mining data ranges
   const excavatorData = await getWebSocketData('excavators');
   
   excavatorData.forEach(excavator => {
     expect(excavator.OreGrade).toBeGreaterThan(0.5);
     expect(excavator.OreGrade).toBeLessThan(12.0);
     expect(excavator.BucketPosition.Z).toBeLessThan(0); // Below surface
   });
   ```

7. **Screenshot Capture**
   ```javascript
   // Capture demo screenshots for validation
   await page.screenshot({ 
     path: 'phase2-frontend-skeleton.png',
     fullPage: true 
   });
   
   // Log key metrics for review
   console.log('Phase 2 Validation Summary:');
   console.log(`- OPC UA Server: ${health.opcua.server_running ? 'PASS' : 'FAIL'}`);
   console.log(`- Equipment Count: ${health.simulation.equipment_count}`);
   console.log(`- Data Update Rate: ${health.opcua.data_updates_per_second}/s`);
   ```

8. **Cleanup & Reporting**
   ```bash
   docker-compose down
   # Generate validation report
   ```

---

## ✅ Definition of Done

### Functional Requirements
- [ ] **OPC UA Server Accessible**: `opc.tcp://localhost:4840/mining-demo` responds to client connections
- [ ] **Mining Equipment Visible**: 7+ equipment nodes browsable via UA Expert or similar client
- [ ] **Realistic Data**: All equipment variables show plausible mining operation values
- [ ] **Live Updates**: Equipment data updates at 1-2 second intervals
- [ ] **WebSocket Bridge**: Real-time data available to frontend via WebSocket
- [ ] **Educational Value**: Mining professionals can recognize realistic operational scenarios

### Technical Requirements  
- [ ] **Mining Compliance**: Address space follows OPC UA Mining Companion Specification structure
- [ ] **Performance**: Server handles 5+ concurrent OPC UA client connections
- [ ] **Reliability**: Demo runs continuously for 30+ minutes without crashes
- [ ] **Observability**: Health endpoint provides demo status and metrics

### Quality Gates
- [ ] **Unit Tests**: 90%+ coverage on simulation and server logic
- [ ] **Integration Tests**: OPC UA client connection and data subscription tests pass
- [ ] **Puppeteer Validation**: Automated validation script passes on clean Docker environment
- [ ] **Documentation**: Educational guide explains mining concepts and OPC UA implementation

### Demo Readiness
- [ ] **UA Expert Screenshots**: Clear screenshots showing mining equipment hierarchy
- [ ] **Data Storytelling**: Excavator discovering high-grade ore zone creates compelling narrative
- [ ] **Professional Presentation**: Demo can be shown to mining industry professionals
- [ ] **Educational Impact**: Non-mining audience can understand basic mining operations through demo

---

## 🚀 Success Metrics

### Primary KPIs
1. **Educational Effectiveness**: Demo explains OPC UA + mining concepts clearly
2. **Technical Depth**: Shows real-world industrial automation patterns
3. **Industry Relevance**: Mining professionals recognize authentic operational data
4. **Standards Compliance**: Demonstrates proper OPC UA implementation

### Validation Metrics
- **OPC UA Connectivity**: 100% success rate connecting standard clients
- **Data Realism**: Equipment parameters within industry-standard ranges
- **Update Performance**: Data refreshes every 1-2 seconds consistently
- **System Stability**: Zero crashes during 30-minute demo sessions

---

## 🎓 Learning Outcomes Achieved

Upon completion of Phase 2, stakeholders will understand:

### For Mining Professionals
- How OPC UA enables equipment interoperability
- Real-time data integration patterns in mining operations
- Economic benefits of standards-based automation

### For OPC UA Developers  
- Practical implementation of Mining Companion Specification
- Industrial simulation and data modeling techniques
- WebSocket bridge patterns for modern web integration

### For System Integrators
- Mining industry data flows and equipment relationships
- OPC UA server deployment and configuration
- Performance considerations for real-time mining systems

**Phase 2 transforms our skeleton into a compelling educational demonstration that showcases both OPC UA capabilities and mining industry applications.**
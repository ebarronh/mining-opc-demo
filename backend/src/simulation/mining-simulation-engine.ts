import { OPCUAServer, Variant, DataType } from 'node-opcua';
import { ExcavatorData, HaulTruckData, ConveyorData, DigCycleState, MineCoordinate, MiningScenario, EquipmentPosition } from '../types/mining-types';
import { MessageHandlers } from '../websocket/messageHandlers';
import { GradeGenerator } from './gradeGenerator';

export class MiningSimulationEngine {
  private server: OPCUAServer;
  private updateInterval: NodeJS.Timeout | null = null;
  private startTime: Date;
  private updateCount = 0;
  private activeScenarios: MiningScenario[] = [];
  private messageHandlers: MessageHandlers | null = null;
  private gradeGenerator: GradeGenerator;
  
  // Equipment simulation state
  private excavators: Map<string, ExcavatorSimulationState> = new Map();
  private trucks: Map<string, TruckSimulationState> = new Map();
  private conveyors: Map<string, ConveyorSimulationState> = new Map();

  constructor(server: OPCUAServer, messageHandlers?: MessageHandlers) {
    this.server = server;
    this.messageHandlers = messageHandlers || null;
    this.gradeGenerator = new GradeGenerator();
    this.startTime = new Date();
    this.initializeEquipmentStates();
  }

  private initializeEquipmentStates(): void {
    // Initialize excavator states
    this.excavators.set('EX001', {
      id: 'EX001',
      cycleState: DigCycleState.Digging,
      cycleStartTime: Date.now(),
      position: { X: 1000, Y: 2000, Z: -15 },
      targetPosition: { X: 1005, Y: 2005, Z: -18 },
      oreGrade: 2.5,
      fuelLevel: 75,
      engineRPM: 1800,
      hydraulicPressure: 280,
      loadWeight: 0
    });

    this.excavators.set('EX002', {
      id: 'EX002',
      cycleState: DigCycleState.Moving,
      cycleStartTime: Date.now(),
      position: { X: 1200, Y: 1800, Z: -12 },
      targetPosition: { X: 1210, Y: 1805, Z: -15 },
      oreGrade: 3.2,
      fuelLevel: 68,
      engineRPM: 1650,
      hydraulicPressure: 250,
      loadWeight: 42
    });

    // Initialize truck states
    this.trucks.set('TR001', {
      id: 'TR001',
      position: { X: 1050, Y: 2020, Z: -15 },
      destination: 'Crusher',
      payloadWeight: 180,
      payloadGrade: 2.8,
      speed: 25,
      heading: 45,
      engineTemp: 95,
      loadCycles: 12,
      routeProgress: 0.65
    });

    this.trucks.set('TR002', {
      id: 'TR002', 
      position: { X: 800, Y: 1600, Z: 0 },
      destination: 'WasteDump',
      payloadWeight: 220,
      payloadGrade: 1.8,
      speed: 35,
      heading: 180,
      engineTemp: 88,
      loadCycles: 15,
      routeProgress: 0.30
    });

    this.trucks.set('TR003', {
      id: 'TR003',
      position: { X: 1400, Y: 2200, Z: -5 },
      destination: 'Stockpile_A',
      payloadWeight: 0,
      payloadGrade: 0,
      speed: 45,
      heading: 90,
      engineTemp: 82,
      loadCycles: 8,
      routeProgress: 0.85
    });

    // Initialize conveyor states
    this.conveyors.set('CV001', {
      id: 'CV001',
      throughputRate: 1200,
      beltSpeed: 3.5,
      materialGrade: 2.6,
      beltTension: 45,
      vibrationLevel: 2.1,
      powerConsumption: 850,
      runHours: 8750,
      emergencyStop: false
    });

    this.conveyors.set('CV002', {
      id: 'CV002',
      throughputRate: 800,
      beltSpeed: 2.8,
      materialGrade: 2.4,
      beltTension: 38,
      vibrationLevel: 1.8,
      powerConsumption: 620,
      runHours: 7200,
      emergencyStop: false
    });
  }

  async start(): Promise<void> {
    console.log("⚙️  Starting mining simulation engine...");
    
    // Update simulation every 2 seconds
    this.updateInterval = setInterval(() => {
      this.updateSimulation();
    }, 2000);

    console.log("✅ Simulation engine started with 2-second update cycle");
  }

  async stop(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log("⚙️  Simulation engine stopped");
  }

  private updateSimulation(): void {
    const currentTime = Date.now();
    this.updateCount++;

    // Update all equipment simulations
    this.updateExcavators(currentTime);
    this.updateTrucks(currentTime);
    this.updateConveyors(currentTime);

    // Update OPC UA variables with new data
    this.updateOPCUAVariables();

    // Process active scenarios
    this.processActiveScenarios(currentTime);

    // Broadcast updates via WebSocket if handlers are available
    if (this.messageHandlers) {
      this.broadcastUpdates();
    }
  }

  private updateExcavators(currentTime: number): void {
    for (const [id, state] of this.excavators) {
      // Update dig cycle progression
      const cycleDuration = this.getCycleDuration(state.cycleState);
      const cycleElapsed = currentTime - state.cycleStartTime;
      
      if (cycleElapsed >= cycleDuration) {
        // Move to next cycle state
        state.cycleState = this.getNextCycleState(state.cycleState);
        state.cycleStartTime = currentTime;
        
        // Update position and load based on cycle state
        this.updateExcavatorStateTransition(state);
      }

      // Simulate realistic parameter variations
      state.engineRPM = this.addVariation(state.engineRPM, 1800, 50);
      state.hydraulicPressure = this.addVariation(state.hydraulicPressure, 280, 20);
      state.fuelLevel = Math.max(0, state.fuelLevel - 0.01); // Gradual fuel consumption

      // Simulate ore grade discovery based on position
      state.oreGrade = this.getOreGradeAtPosition(state.position);
    }
  }

  private updateTrucks(currentTime: number): void {
    for (const [id, state] of this.trucks) {
      // Update route progression
      state.routeProgress += 0.02; // 2% progress per update
      
      if (state.routeProgress >= 1.0) {
        // Truck reached destination, assign new route
        this.assignNewTruckRoute(state);
        state.routeProgress = 0;
        state.loadCycles++;
      }

      // Update position along route
      this.updateTruckPosition(state);
      
      // Realistic parameter variations
      state.speed = this.addVariation(state.speed, 30, 10);
      state.engineTemp = this.addVariation(state.engineTemp, 90, 8);
      state.heading = this.updateTruckHeading(state);
    }
  }

  private updateConveyors(currentTime: number): void {
    for (const [id, state] of this.conveyors) {
      // Update throughput based on upstream feed
      const upstreamFeed = this.calculateUpstreamFeed(id);
      state.throughputRate = upstreamFeed * 0.95; // 95% efficiency
      
      // Update material grade as weighted average of incoming material
      state.materialGrade = this.calculateWeightedAverageGrade();
      
      // Condition monitoring simulation
      state.vibrationLevel = this.addVariation(state.vibrationLevel, 2.0, 0.3);
      state.beltTension = this.addVariation(state.beltTension, 45, 5);
      state.powerConsumption = state.throughputRate * 0.7; // Power correlates with load
      
      // Accumulate run hours
      state.runHours += 2 / 3600; // 2 seconds converted to hours
    }
  }

  private updateOPCUAVariables(): void {
    const addressSpace = this.server.engine.addressSpace!;
    const namespace = addressSpace.getOwnNamespace();

    // Update excavator variables
    for (const [id, state] of this.excavators) {
      const excavatorNode = addressSpace.findNode(`ns=1;s=Excavator_${id}`);
      if (excavatorNode) {
        this.updateVariableValue(namespace, `Excavator_${id}.OreGrade`, state.oreGrade);
        this.updateVariableValue(namespace, `Excavator_${id}.BucketPosition.X`, state.position.X);
        this.updateVariableValue(namespace, `Excavator_${id}.BucketPosition.Y`, state.position.Y);
        this.updateVariableValue(namespace, `Excavator_${id}.BucketPosition.Z`, state.position.Z);
        this.updateVariableValue(namespace, `Excavator_${id}.LoadWeight`, state.loadWeight);
        this.updateVariableValue(namespace, `Excavator_${id}.EngineRPM`, state.engineRPM);
        this.updateVariableValue(namespace, `Excavator_${id}.HydraulicPressure`, state.hydraulicPressure);
        this.updateVariableValue(namespace, `Excavator_${id}.FuelLevel`, state.fuelLevel);
        this.updateVariableValue(namespace, `Excavator_${id}.OperationalMode`, state.cycleState);
      }
    }

    // Update truck variables
    for (const [id, state] of this.trucks) {
      this.updateVariableValue(namespace, `HaulTruck_${id}.PayloadWeight`, state.payloadWeight);
      this.updateVariableValue(namespace, `HaulTruck_${id}.PayloadGrade`, state.payloadGrade);
      this.updateVariableValue(namespace, `HaulTruck_${id}.Destination`, state.destination);
      this.updateVariableValue(namespace, `HaulTruck_${id}.GPSLocation.Latitude`, -26.85 + (state.position.X / 100000));
      this.updateVariableValue(namespace, `HaulTruck_${id}.GPSLocation.Longitude`, 151.21 + (state.position.Y / 100000));
      this.updateVariableValue(namespace, `HaulTruck_${id}.GPSLocation.Heading`, state.heading);
      this.updateVariableValue(namespace, `HaulTruck_${id}.Speed`, state.speed);
      this.updateVariableValue(namespace, `HaulTruck_${id}.EngineTemperature`, state.engineTemp);
      this.updateVariableValue(namespace, `HaulTruck_${id}.LoadCycles`, state.loadCycles);
    }

    // Update conveyor variables
    for (const [id, state] of this.conveyors) {
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.ThroughputRate`, state.throughputRate);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.BeltSpeed`, state.beltSpeed);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.MaterialGrade`, state.materialGrade);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.BeltTension`, state.beltTension);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.VibrationLevel`, state.vibrationLevel);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.PowerConsumption`, state.powerConsumption);
      this.updateVariableValue(namespace, `ConveyorBelt_${id}.RunHours`, state.runHours);
    }

    // Update site-wide metrics
    const totalTonnage = Array.from(this.conveyors.values()).reduce((sum, c) => sum + c.throughputRate, 0);
    const avgGrade = this.calculateSiteAverageGrade();
    
    this.updateVariableValue(namespace, 'GradeControlSystem.AverageGrade', avgGrade);
    this.updateVariableValue(namespace, 'ProductionMetrics.HourlyTonnage', totalTonnage);
    this.updateVariableValue(namespace, 'ProductionMetrics.ActiveEquipmentCount', this.getEquipmentCount());
  }

  private updateVariableValue(namespace: any, browsePath: string, value: any): void {
    try {
      const variable = namespace.findNode(browsePath);
      if (variable && variable.setValueFromSource) {
        let variant: Variant;
        
        if (typeof value === 'number') {
          variant = new Variant({ dataType: DataType.Double, value });
        } else if (typeof value === 'string') {
          variant = new Variant({ dataType: DataType.String, value });
        } else if (typeof value === 'boolean') {
          variant = new Variant({ dataType: DataType.Boolean, value });
        } else {
          variant = new Variant({ dataType: DataType.String, value: String(value) });
        }
        
        variable.setValueFromSource(variant);
      }
    } catch (error) {
      // Silently handle missing variables during development
    }
  }

  // Utility methods for simulation logic
  private getCycleDuration(state: DigCycleState): number {
    switch (state) {
      case DigCycleState.Digging: return 15000; // 15 seconds
      case DigCycleState.Swinging: return 8000; // 8 seconds
      case DigCycleState.Dumping: return 5000; // 5 seconds
      case DigCycleState.Returning: return 12000; // 12 seconds
      default: return 10000;
    }
  }

  private getNextCycleState(current: DigCycleState): DigCycleState {
    switch (current) {
      case DigCycleState.Digging: return DigCycleState.Swinging;
      case DigCycleState.Swinging: return DigCycleState.Dumping;
      case DigCycleState.Dumping: return DigCycleState.Returning;
      case DigCycleState.Returning: return DigCycleState.Digging;
      default: return DigCycleState.Digging;
    }
  }

  private updateExcavatorStateTransition(state: ExcavatorSimulationState): void {
    switch (state.cycleState) {
      case DigCycleState.Digging:
        state.loadWeight = 0;
        break;
      case DigCycleState.Swinging:
        state.loadWeight = 30 + Math.random() * 20; // 30-50 tonnes
        break;
      case DigCycleState.Dumping:
        // Update position slightly for realistic movement
        state.position.X += (Math.random() - 0.5) * 5;
        state.position.Y += (Math.random() - 0.5) * 5;
        break;
      case DigCycleState.Returning:
        state.loadWeight = 0;
        break;
    }
  }

  private addVariation(value: number, target: number, range: number): number {
    const variation = (Math.random() - 0.5) * range;
    return Math.max(0, value + variation * 0.1); // Small gradual changes
  }

  private getOreGradeAtPosition(position: MineCoordinate): number {
    // Simulate geological variation based on position
    const baseGrade = 2.5;
    const variation = Math.sin(position.X / 100) * Math.cos(position.Y / 100) * 1.5;
    return Math.max(0.5, Math.min(8.0, baseGrade + variation));
  }

  private assignNewTruckRoute(state: TruckSimulationState): void {
    const destinations = ['Crusher', 'WasteDump', 'Stockpile_A', 'Stockpile_B'];
    state.destination = destinations[Math.floor(Math.random() * destinations.length)];
    
    // Assign payload based on destination
    if (state.destination === 'WasteDump') {
      state.payloadWeight = 200 + Math.random() * 40;
      state.payloadGrade = 0.5 + Math.random() * 1.8; // Low grade waste
    } else {
      state.payloadWeight = 150 + Math.random() * 50;
      state.payloadGrade = 2.5 + Math.random() * 2.0; // Higher grade ore
    }
  }

  private updateTruckPosition(state: TruckSimulationState): void {
    // Simulate movement along route based on progress
    const baseX = 1000;
    const baseY = 2000;
    
    state.position.X = baseX + state.routeProgress * 500 + Math.random() * 10;
    state.position.Y = baseY + state.routeProgress * 300 + Math.random() * 10;
    state.position.Z = -state.routeProgress * 20; // Elevation change
  }

  private updateTruckHeading(state: TruckSimulationState): number {
    // Calculate heading based on destination and route progress
    const targetHeadings = {
      'Crusher': 45,
      'WasteDump': 180,
      'Stockpile_A': 90,
      'Stockpile_B': 270
    };
    
    const targetHeading = targetHeadings[state.destination as keyof typeof targetHeadings] || 0;
    return targetHeading + (Math.random() - 0.5) * 30; // Add some variation
  }

  private calculateUpstreamFeed(conveyorId: string): number {
    // Simulate feed based on truck deliveries
    const baseFeed = conveyorId === 'CV001' ? 1200 : 800;
    return baseFeed + (Math.random() - 0.5) * 200;
  }

  private calculateWeightedAverageGrade(): number {
    let totalGrade = 0;
    let totalWeight = 0;
    
    for (const truck of this.trucks.values()) {
      if (truck.payloadWeight > 0) {
        totalGrade += truck.payloadGrade * truck.payloadWeight;
        totalWeight += truck.payloadWeight;
      }
    }
    
    return totalWeight > 0 ? totalGrade / totalWeight : 2.5;
  }

  private calculateSiteAverageGrade(): number {
    let totalGrade = 0;
    let count = 0;
    
    for (const excavator of this.excavators.values()) {
      totalGrade += excavator.oreGrade;
      count++;
    }
    
    return count > 0 ? totalGrade / count : 2.5;
  }

  private processActiveScenarios(currentTime: number): void {
    // Process any active educational scenarios
    for (const scenario of this.activeScenarios) {
      if (scenario.name === 'high_grade_discovery') {
        this.processHighGradeDiscoveryScenario(scenario, currentTime);
      }
    }
  }

  private broadcastUpdates(): void {
    if (!this.messageHandlers) return;

    // Broadcast equipment positions
    const equipmentPositions = this.getEquipmentPositions();
    this.messageHandlers.broadcastEquipmentPositions(equipmentPositions);

    // Broadcast grade data every other update (every 4 seconds)
    if (this.updateCount % 2 === 0) {
      const gradeData = this.gradeGenerator.generateGradeData();
      this.messageHandlers.broadcastGradeData(gradeData);
    }

    // Broadcast OPC UA updates
    const opcUaUpdates = this.getOpcUaValueUpdates();
    if (opcUaUpdates.length > 0) {
      this.messageHandlers.broadcastOpcUaUpdates(opcUaUpdates);
    }
  }

  private getEquipmentPositions(): EquipmentPosition[] {
    const positions: EquipmentPosition[] = [];

    // Add excavators
    for (const [id, state] of this.excavators) {
      positions.push({
        id,
        type: 'excavator',
        position: {
          x: state.position.X,
          y: state.position.Y, 
          z: state.position.Z
        },
        rotation: { x: 0, y: 0, z: 0 },
        status: this.getEquipmentStatus(state.fuelLevel),
        telemetry: {
          speed: 0,
          payload: state.loadWeight,
          temperature: 75,
          fuelLevel: state.fuelLevel,
          engineRPM: state.engineRPM,
          hydraulicPressure: state.hydraulicPressure,
          oreGrade: state.oreGrade,
          cycleState: state.cycleState
        }
      });
    }

    // Add trucks
    for (const [id, state] of this.trucks) {
      positions.push({
        id,
        type: 'truck',
        position: {
          x: state.position.X,
          y: state.position.Y,
          z: state.position.Z
        },
        rotation: { x: 0, y: state.heading * Math.PI / 180, z: 0 },
        status: this.getEquipmentStatus(95 - state.engineTemp), // Use temperature as health indicator
        telemetry: {
          speed: state.speed,
          payload: state.payloadWeight,
          temperature: state.engineTemp,
          destination: state.destination,
          payloadGrade: state.payloadGrade,
          loadCycles: state.loadCycles,
          routeProgress: state.routeProgress
        }
      });
    }

    // Add conveyors (stationary equipment)
    for (const [id, state] of this.conveyors) {
      const conveyorPositions = {
        'CV001': { x: 100, y: 0, z: 0 },
        'CV002': { x: -100, y: 100, z: 0 }
      };
      
      const position = conveyorPositions[id as keyof typeof conveyorPositions] || { x: 0, y: 0, z: 0 };
      
      positions.push({
        id,
        type: 'conveyor',
        position,
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        status: state.emergencyStop ? 'error' : 'operating',
        telemetry: {
          throughputRate: state.throughputRate,
          beltSpeed: state.beltSpeed,
          materialGrade: state.materialGrade,
          beltTension: state.beltTension,
          vibrationLevel: state.vibrationLevel,
          powerConsumption: state.powerConsumption,
          runHours: state.runHours
        }
      });
    }

    return positions;
  }

  private getEquipmentStatus(healthIndicator: number): 'operating' | 'idle' | 'error' {
    if (healthIndicator < 20) return 'error';
    if (healthIndicator < 50) return 'idle';
    return 'operating';
  }

  private getOpcUaValueUpdates(): Array<{ nodeId: string; value: any; dataType: string; timestamp: string }> {
    const updates: Array<{ nodeId: string; value: any; dataType: string; timestamp: string }> = [];
    const timestamp = new Date().toISOString();

    // Sample some key OPC UA values for broadcasting
    const avgGrade = this.calculateSiteAverageGrade();
    const totalTonnage = Array.from(this.conveyors.values()).reduce((sum, c) => sum + c.throughputRate, 0);

    updates.push(
      {
        nodeId: 'ns=1;s=GradeControlSystem.AverageGrade',
        value: avgGrade,
        dataType: 'Double',
        timestamp
      },
      {
        nodeId: 'ns=1;s=ProductionMetrics.HourlyTonnage',
        value: totalTonnage,
        dataType: 'Double',
        timestamp
      },
      {
        nodeId: 'ns=1;s=ProductionMetrics.ActiveEquipmentCount',
        value: this.getEquipmentCount(),
        dataType: 'Int32',
        timestamp
      }
    );

    // Add some equipment-specific updates
    for (const [id, state] of this.excavators) {
      if (Math.random() < 0.3) { // Randomly update some values
        updates.push({
          nodeId: `ns=1;s=Excavator_${id}.OreGrade`,
          value: state.oreGrade,
          dataType: 'Double',
          timestamp
        });
      }
    }

    return updates;
  }

  private processHighGradeDiscoveryScenario(scenario: MiningScenario, currentTime: number): void {
    const excavatorId = scenario.parameters.excavatorId || 'EX001';
    const excavator = this.excavators.get(excavatorId);
    
    if (excavator) {
      // Simulate high-grade discovery
      excavator.oreGrade = Math.max(excavator.oreGrade, 5.8);
    }
  }

  // Public methods for external access
  getUpdateRate(): number {
    const runTime = (Date.now() - this.startTime.getTime()) / 1000; // seconds
    return runTime > 0 ? this.updateCount / runTime : 0;
  }

  getEquipmentCount(): number {
    return this.excavators.size + this.trucks.size + this.conveyors.size;
  }

  getActiveScenarios(): string[] {
    return this.activeScenarios.map(s => s.name);
  }

  triggerScenario(scenarioName: string, parameters: any = {}): boolean {
    try {
      const scenario: MiningScenario = {
        name: scenarioName,
        description: `Educational scenario: ${scenarioName}`,
        active: true,
        startTime: new Date(),
        parameters
      };
      
      this.activeScenarios.push(scenario);
      console.log(`🎬 Triggered scenario: ${scenarioName}`);
      return true;
    } catch (error) {
      console.error(`Failed to trigger scenario ${scenarioName}:`, error);
      return false;
    }
  }
}

// Internal state interfaces
interface ExcavatorSimulationState {
  id: string;
  cycleState: DigCycleState;
  cycleStartTime: number;
  position: MineCoordinate;
  targetPosition: MineCoordinate;
  oreGrade: number;
  fuelLevel: number;
  engineRPM: number;
  hydraulicPressure: number;
  loadWeight: number;
}

interface TruckSimulationState {
  id: string;
  position: MineCoordinate;
  destination: string;
  payloadWeight: number;
  payloadGrade: number;
  speed: number;
  heading: number;
  engineTemp: number;
  loadCycles: number;
  routeProgress: number;
}

interface ConveyorSimulationState {
  id: string;
  throughputRate: number;
  beltSpeed: number;
  materialGrade: number;
  beltTension: number;
  vibrationLevel: number;
  powerConsumption: number;
  runHours: number;
  emergencyStop: boolean;
}
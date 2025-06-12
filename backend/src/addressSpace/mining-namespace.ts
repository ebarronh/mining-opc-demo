import {
  OPCUAServer,
  NodeClass,
  makeNodeId,
  DataType,
  VariantArrayType,
  makeAccessLevelFlag,
  standardUnits,
  Variant
} from 'node-opcua';

export async function createMiningAddressSpace(server: OPCUAServer): Promise<void> {
  const addressSpace = server.engine.addressSpace!;
  const namespace = addressSpace.getOwnNamespace();

  console.log("🏗️  Building MineSensors mining address space...");

  // Create root mining site object
  const miningSite = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "MiningSite_GoldRush",
    displayName: "Gold Rush Mining Site",
    description: "Educational mining site demonstrating OPC UA integration"
  });

  // Create main equipment container
  const miningEquipment = namespace.addObject({
    organizedBy: miningSite,
    browseName: "MiningEquipment",
    displayName: "Mining Equipment",
    description: "Container for all mining equipment instances"
  });

  // Create equipment category folders
  const excavatorsFolder = namespace.addObject({
    organizedBy: miningEquipment,
    browseName: "Excavators",
    displayName: "Hydraulic Excavators"
  });

  const trucksFolder = namespace.addObject({
    organizedBy: miningEquipment,
    browseName: "HaulTrucks", 
    displayName: "Haul Trucks"
  });

  const conveyorsFolder = namespace.addObject({
    organizedBy: miningEquipment,
    browseName: "Conveyors",
    displayName: "Conveyor Systems"
  });

  // Create excavator instances
  createExcavatorNode(namespace, excavatorsFolder, "EX001", "Excavator EX001");
  createExcavatorNode(namespace, excavatorsFolder, "EX002", "Excavator EX002");

  // Create truck instances  
  createHaulTruckNode(namespace, trucksFolder, "TR001", "Haul Truck TR001");
  createHaulTruckNode(namespace, trucksFolder, "TR002", "Haul Truck TR002");
  createHaulTruckNode(namespace, trucksFolder, "TR003", "Haul Truck TR003");

  // Create conveyor instances
  createConveyorNode(namespace, conveyorsFolder, "CV001", "Primary Crusher Feed");
  createConveyorNode(namespace, conveyorsFolder, "CV002", "Stockpile Conveyor");

  // Create grade control system
  const gradeControlSystem = namespace.addObject({
    organizedBy: miningSite,
    browseName: "GradeControlSystem",
    displayName: "Grade Control System",
    description: "Ore quality monitoring and classification system"
  });

  // Add site-wide grade control variables
  namespace.addVariable({
    componentOf: gradeControlSystem,
    browseName: "AverageGrade",
    displayName: "Site Average Grade (g/t Au)",
    dataType: DataType.Double,
    accessLevel: makeAccessLevelFlag("CurrentRead"),
    userAccessLevel: makeAccessLevelFlag("CurrentRead"),
    value: new Variant({ dataType: DataType.Double, value: 2.8 })
  });

  namespace.addVariable({
    componentOf: gradeControlSystem,
    browseName: "GradeCutoff", 
    displayName: "Economic Grade Cutoff (g/t Au)",
    dataType: DataType.Double,
    accessLevel: makeAccessLevelFlag("CurrentRead"),
    userAccessLevel: makeAccessLevelFlag("CurrentRead"),
    value: new Variant({ dataType: DataType.Double, value: 2.5 })
  });

  // Create production metrics
  const productionMetrics = namespace.addObject({
    organizedBy: miningSite,
    browseName: "ProductionMetrics",
    displayName: "Production Metrics",
    description: "Site-wide production KPIs and performance indicators"
  });

  namespace.addVariable({
    componentOf: productionMetrics,
    browseName: "HourlyTonnage",
    displayName: "Hourly Tonnage (t/h)",
    dataType: DataType.Double,
    accessLevel: makeAccessLevelFlag("CurrentRead"),
    userAccessLevel: makeAccessLevelFlag("CurrentRead"),
    value: new Variant({ dataType: DataType.Double, value: 450.0 })
  });

  namespace.addVariable({
    componentOf: productionMetrics,
    browseName: "ActiveEquipmentCount",
    displayName: "Active Equipment Count",
    dataType: DataType.UInt32,
    accessLevel: makeAccessLevelFlag("CurrentRead"),
    userAccessLevel: makeAccessLevelFlag("CurrentRead"),
    value: new Variant({ dataType: DataType.UInt32, value: 7 })
  });

  // Create demo controls for educational scenarios
  const demoControls = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "DemoControls",
    displayName: "Educational Demo Controls",
    description: "Controls for triggering educational mining scenarios"
  });

  // Add scenario trigger methods
  namespace.addMethod(demoControls, {
    browseName: "TriggerHighGradeDiscovery",
    displayName: "Trigger High Grade Discovery",
    description: "Simulates excavator discovering high-grade ore zone",
    
    inputArguments: [{
      name: "excavatorId",
      description: "ID of excavator to trigger scenario",
      dataType: DataType.String
    }],
    
    outputArguments: [{
      name: "success",
      description: "Whether scenario was triggered successfully", 
      dataType: DataType.Boolean
    }]
  });

  console.log("✅ Mining address space created with 7 equipment nodes");
  console.log("   - 2 Hydraulic Excavators (EX001, EX002)");
  console.log("   - 3 Haul Trucks (TR001, TR002, TR003)");
  console.log("   - 2 Conveyor Systems (CV001, CV002)");
  console.log("   - Grade Control System with site metrics");
  console.log("   - Educational demo controls");
}

function createExcavatorNode(namespace: any, parent: any, id: string, displayName: string): void {
  const excavator = namespace.addObject({
    organizedBy: parent,
    browseName: `Excavator_${id}`,
    displayName: displayName,
    description: `Hydraulic excavator ${id} for educational OPC UA mining demo`
  });

  // Mining-specific variables
  namespace.addVariable({
    componentOf: excavator,
    browseName: "OreGrade",
    displayName: "Ore Grade (g/t Au)",
    dataType: DataType.Double,
    accessLevel: makeAccessLevelFlag("CurrentRead"),
    userAccessLevel: makeAccessLevelFlag("CurrentRead"),
    value: new Variant({ dataType: DataType.Double, value: 2.5 })
  });

  // Bucket position (3D coordinates)
  const bucketPosition = namespace.addObject({
    componentOf: excavator,
    browseName: "BucketPosition",
    displayName: "Bucket Position"
  });

  namespace.addVariable({
    componentOf: bucketPosition,
    browseName: "X",
    displayName: "Easting (m)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 1000.0 })
  });

  namespace.addVariable({
    componentOf: bucketPosition,
    browseName: "Y", 
    displayName: "Northing (m)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 2000.0 })
  });

  namespace.addVariable({
    componentOf: bucketPosition,
    browseName: "Z",
    displayName: "Elevation (m)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: -15.0 })
  });

  // Operational variables
  namespace.addVariable({
    componentOf: excavator,
    browseName: "LoadWeight",
    displayName: "Load Weight (tonnes)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 35.0 })
  });

  namespace.addVariable({
    componentOf: excavator,
    browseName: "OperationalMode",
    displayName: "Operational Mode",
    dataType: DataType.String,
    value: new Variant({ dataType: DataType.String, value: "Digging" })
  });

  namespace.addVariable({
    componentOf: excavator,
    browseName: "EngineRPM",
    displayName: "Engine RPM",
    dataType: DataType.UInt32,
    value: new Variant({ dataType: DataType.UInt32, value: 1800 })
  });

  namespace.addVariable({
    componentOf: excavator,
    browseName: "HydraulicPressure",
    displayName: "Hydraulic Pressure (bar)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 280.0 })
  });

  namespace.addVariable({
    componentOf: excavator,
    browseName: "FuelLevel",
    displayName: "Fuel Level (%)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 75.0 })
  });
}

function createHaulTruckNode(namespace: any, parent: any, id: string, displayName: string): void {
  const truck = namespace.addObject({
    organizedBy: parent,
    browseName: `HaulTruck_${id}`,
    displayName: displayName,
    description: `Haul truck ${id} for educational OPC UA mining demo`
  });

  // Payload management
  namespace.addVariable({
    componentOf: truck,
    browseName: "PayloadWeight",
    displayName: "Payload Weight (tonnes)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 180.0 })
  });

  namespace.addVariable({
    componentOf: truck,
    browseName: "PayloadGrade",
    displayName: "Payload Grade (g/t Au)", 
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 2.8 })
  });

  namespace.addVariable({
    componentOf: truck,
    browseName: "Destination",
    displayName: "Destination",
    dataType: DataType.String,
    value: new Variant({ dataType: DataType.String, value: "Crusher" })
  });

  // GPS location
  const gpsLocation = namespace.addObject({
    componentOf: truck,
    browseName: "GPSLocation",
    displayName: "GPS Location"
  });

  namespace.addVariable({
    componentOf: gpsLocation,
    browseName: "Latitude",
    displayName: "Latitude",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: -26.8500 })
  });

  namespace.addVariable({
    componentOf: gpsLocation,
    browseName: "Longitude",
    displayName: "Longitude", 
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 151.2100 })
  });

  namespace.addVariable({
    componentOf: gpsLocation,
    browseName: "Heading",
    displayName: "Heading (degrees)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 45.0 })
  });

  // Vehicle status
  namespace.addVariable({
    componentOf: truck,
    browseName: "Speed",
    displayName: "Speed (km/h)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 25.0 })
  });

  namespace.addVariable({
    componentOf: truck,
    browseName: "EngineTemperature",
    displayName: "Engine Temperature (°C)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 95.0 })
  });

  namespace.addVariable({
    componentOf: truck,
    browseName: "LoadCycles",
    displayName: "Load Cycles Today",
    dataType: DataType.UInt32,
    value: new Variant({ dataType: DataType.UInt32, value: 12 })
  });
}

function createConveyorNode(namespace: any, parent: any, id: string, displayName: string): void {
  const conveyor = namespace.addObject({
    organizedBy: parent,
    browseName: `ConveyorBelt_${id}`,
    displayName: displayName,
    description: `Conveyor system ${id} for educational OPC UA mining demo`
  });

  // Material flow
  namespace.addVariable({
    componentOf: conveyor,
    browseName: "ThroughputRate",
    displayName: "Throughput Rate (t/h)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 1200.0 })
  });

  namespace.addVariable({
    componentOf: conveyor,
    browseName: "BeltSpeed",
    displayName: "Belt Speed (m/s)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 3.5 })
  });

  namespace.addVariable({
    componentOf: conveyor,
    browseName: "MaterialGrade",
    displayName: "Material Grade (g/t Au)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 2.6 })
  });

  // Condition monitoring
  namespace.addVariable({
    componentOf: conveyor,
    browseName: "BeltTension",
    displayName: "Belt Tension (kN)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 45.0 })
  });

  namespace.addVariable({
    componentOf: conveyor,
    browseName: "VibrationLevel",
    displayName: "Vibration Level (mm/s RMS)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 2.1 })
  });

  namespace.addVariable({
    componentOf: conveyor,
    browseName: "PowerConsumption",
    displayName: "Power Consumption (kW)",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 850.0 })
  });

  // Operational control
  namespace.addVariable({
    componentOf: conveyor,
    browseName: "EmergencyStop",
    displayName: "Emergency Stop",
    dataType: DataType.Boolean,
    value: new Variant({ dataType: DataType.Boolean, value: false })
  });

  namespace.addVariable({
    componentOf: conveyor,
    browseName: "RunHours",
    displayName: "Run Hours",
    dataType: DataType.Double,
    value: new Variant({ dataType: DataType.Double, value: 8750.0 })
  });
}
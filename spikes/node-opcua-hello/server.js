const {
    OPCUAServer,
    Variant,
    DataType,
    StatusCodes,
    standardUnits,
    makeAccessLevelFlag,
    ServerState
} = require("node-opcua");

async function main() {
    console.log("Starting OPC UA Mining Demo Server...");

    // Create OPC UA Server
    const server = new OPCUAServer({
        port: 4840,
        resourcePath: "/mining-demo",
        buildInfo: {
            productName: "MineSensors OPC UA Demo Server",
            buildNumber: "1.0.0",
            buildDate: new Date()
        }
    });

    // Initialize server
    await server.initialize();
    console.log("Server initialized");

    // Build address space
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    // Create Mining Equipment folder
    const miningFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: "MiningEquipment"
    });

    // Create Excavator object
    const excavator = namespace.addObject({
        organizedBy: miningFolder,
        browseName: "Excavator_001",
        displayName: "Hydraulic Excavator #001"
    });

    // Add excavator variables
    let currentGrade = 2.5; // Initial ore grade value

    const gradeVariable = namespace.addVariable({
        componentOf: excavator,
        browseName: "OreGrade",
        displayName: "Ore Grade (g/t)",
        dataType: DataType.Double,
        accessLevel: makeAccessLevelFlag("CurrentRead"),
        userAccessLevel: makeAccessLevelFlag("CurrentRead"),
        value: {
            get: function() {
                // Simulate changing ore grade values
                currentGrade = 1.5 + Math.random() * 3.0; // Range: 1.5 - 4.5 g/t
                return new Variant({
                    dataType: DataType.Double,
                    value: Math.round(currentGrade * 100) / 100
                });
            }
        }
    });

    const locationVariable = namespace.addVariable({
        componentOf: excavator,
        browseName: "Location",
        displayName: "GPS Location",
        dataType: DataType.String,
        accessLevel: makeAccessLevelFlag("CurrentRead"),
        userAccessLevel: makeAccessLevelFlag("CurrentRead"),
        value: {
            get: function() {
                // Simulate GPS coordinates
                const lat = -26.8500 + (Math.random() - 0.5) * 0.01;
                const lon = 151.2100 + (Math.random() - 0.5) * 0.01;
                return new Variant({
                    dataType: DataType.String,
                    value: `${lat.toFixed(6)}, ${lon.toFixed(6)}`
                });
            }
        }
    });

    const statusVariable = namespace.addVariable({
        componentOf: excavator,
        browseName: "OperationalStatus",
        displayName: "Operational Status",
        dataType: DataType.String,
        accessLevel: makeAccessLevelFlag("CurrentRead"),
        userAccessLevel: makeAccessLevelFlag("CurrentRead"),
        value: {
            get: function() {
                const statuses = ["Operating", "Loading", "Moving", "Maintenance"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return new Variant({
                    dataType: DataType.String,
                    value: randomStatus
                });
            }
        }
    });

    console.log("Address space built with mining equipment variables");

    // Start server
    await server.start();
    
    const endpointUrl = `opc.tcp://localhost:4840/mining-demo`;
    console.log("🚀 OPC UA Mining Demo Server is running!");
    console.log(`📡 Endpoint: ${endpointUrl}`);
    console.log("📊 Variables exposed:");
    console.log("   - MiningEquipment/Excavator_001/OreGrade (g/t)");
    console.log("   - MiningEquipment/Excavator_001/Location (GPS)");
    console.log("   - MiningEquipment/Excavator_001/OperationalStatus");
    console.log("\n💡 Connect using UA Expert or any OPC UA client");
    console.log("🔧 Use 'None' security policy for this demo");

    // Handle shutdown gracefully
    process.on("SIGINT", async () => {
        console.log("\n🛑 Shutting down OPC UA server...");
        await server.shutdown();
        console.log("✅ Server shutdown complete");
        process.exit(0);
    });
}

// Run the server
main().catch((err) => {
    console.error("❌ Failed to start OPC UA server:", err);
    process.exit(1);
});
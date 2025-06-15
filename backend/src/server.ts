import {
  OPCUAServer,
  Variant,
  DataType,
  StatusCodes,
  standardUnits,
  makeAccessLevelFlag,
  ServerState
} from 'node-opcua';
import express from 'express';
import cors from 'cors';
import { createMiningAddressSpace } from './addressSpace/mining-namespace';
import { startWebSocketBridge } from './websocket/ws-bridge';
import { createHealthEndpoint } from './api/metrics';
import { MiningSimulationEngine } from './simulation/mining-simulation-engine';
import { MessageHandlers } from './websocket/messageHandlers';
import { OpcUaApiController } from './api/opcua';

const PORT = process.env.PORT || 3001;
const OPC_UA_PORT = parseInt(process.env.OPC_UA_PORT || '4840');
const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '4841');

let opcuaServer: OPCUAServer;
let expressApp: express.Application;
let simulationEngine: MiningSimulationEngine;
let messageHandlers: MessageHandlers;
let opcUaApiController: OpcUaApiController;

async function startOPCUAServer(): Promise<void> {
  console.log("🚀 Starting MineSensors OPC UA Educational Mining Demo Server...");

  // Create OPC UA Server with mining-appropriate configuration
  opcuaServer = new OPCUAServer({
    port: OPC_UA_PORT,
    resourcePath: "/mining-demo",
    buildInfo: {
      productName: "MineSensors Educational Mining Demo",
      buildNumber: "2.0.0",
      buildDate: new Date(),
      manufacturerName: "MineSensors Technologies"
    },
    serverInfo: {
      applicationName: { text: "Mining Operations OPC UA Demo" },
      applicationUri: "urn:MineSensors:Mining:Demo",
      productUri: "MineSensors:MiningDemo"
    },
    isAuditing: false  // Disable for demo simplicity
  });

  // Initialize server
  await opcuaServer.initialize();
  console.log("📡 OPC UA server initialized");

  // Build mining address space
  await createMiningAddressSpace(opcuaServer);
  console.log("🏗️  Mining address space created");

  // Initialize message handlers
  messageHandlers = new MessageHandlers();
  console.log("📨 Message handlers initialized");

  // Start simulation engine with message handlers
  simulationEngine = new MiningSimulationEngine(opcuaServer, messageHandlers);
  await simulationEngine.start();
  console.log("⚙️  Mining simulation engine started");

  // Initialize OPC UA API controller
  opcUaApiController = new OpcUaApiController(opcuaServer);
  console.log("🔌 OPC UA API controller initialized");

  // Start OPC UA server
  await opcuaServer.start();
  console.log(`🌐 OPC UA server listening on opc.tcp://localhost:${OPC_UA_PORT}/mining-demo`);
}

async function startExpressAPI(): Promise<void> {
  // Create Express app for REST API and health endpoints
  expressApp = express();
  expressApp.use(cors());
  expressApp.use(express.json());

  // Add OPC UA API routes
  expressApp.get('/api/opcua/browse', (req, res) => opcUaApiController.browse(req, res));
  expressApp.get('/api/opcua/node/:nodeId', (req, res) => opcUaApiController.getNodeDetails(req, res));
  expressApp.post('/api/opcua/subscribe', (req, res) => opcUaApiController.subscribe(req, res));
  expressApp.delete('/api/opcua/subscribe', (req, res) => opcUaApiController.unsubscribe(req, res));
  expressApp.get('/api/opcua/subscriptions', (req, res) => opcUaApiController.getSubscriptions(req, res));
  expressApp.post('/api/opcua/write', (req, res) => opcUaApiController.writeNode(req, res));

  // Add health endpoint for Puppeteer validation
  createHealthEndpoint(expressApp, () => {
    return {
      opcua: {
        server_running: opcuaServer?.initialized === true,
        client_connections: opcuaServer?.currentChannelCount || 0,
        data_updates_per_second: simulationEngine?.getUpdateRate() || 0
      },
      websocket: {
        active_connections: messageHandlers?.getStats().connectedClients || 0,
        messages_sent: 0
      },
      simulation: {
        equipment_count: simulationEngine?.getEquipmentCount() || 0,
        scenarios_running: simulationEngine?.getActiveScenarios() || []
      }
    };
  });

  // Start Express server
  expressApp.listen(PORT, () => {
    console.log(`🔗 REST API server listening on port ${PORT}`);
    console.log(`📊 Health endpoint: http://localhost:${PORT}/api/health`);
  }).on('error', (error) => {
    console.error(`❌ Express server failed to start:`, error);
    throw error;
  });
}

async function startWebSocketServer(): Promise<void> {
  // Start WebSocket bridge for real-time data streaming with message handlers
  const wsStats = await startWebSocketBridge(WEBSOCKET_PORT, simulationEngine, messageHandlers);
  console.log(`🔄 WebSocket bridge listening on port ${WEBSOCKET_PORT}`);
  
  // Update health endpoint with WebSocket stats
  setInterval(() => {
    // This will be used by the health endpoint
  }, 1000);
}

async function main(): Promise<void> {
  try {
    console.log("=".repeat(60));
    console.log("🏭 MineSensors OPC UA Mining Integration Demo");
    console.log("📚 Educational demonstration of OPC UA + Mining Operations");
    console.log("=".repeat(60));

    // Start all services
    await startOPCUAServer();
    await startExpressAPI();
    await startWebSocketServer();

    console.log("\n✅ All services started successfully!");
    console.log("\n🎯 Demo Access Points:");
    console.log(`   OPC UA Server: opc.tcp://localhost:${OPC_UA_PORT}/mining-demo`);
    console.log(`   REST API:      http://localhost:${PORT}`);
    console.log(`   WebSocket:     ws://localhost:${WEBSOCKET_PORT}`);
    console.log(`   Health Check:  http://localhost:${PORT}/api/health`);
    
    console.log("\n🔧 Connect with UA Expert or similar OPC UA client");
    console.log("🌐 Frontend will connect via WebSocket for real-time data");
    console.log("🤖 Puppeteer validation can use health endpoint");

  } catch (error) {
    console.error("❌ Failed to start mining demo server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown(): Promise<void> {
  console.log("\n🛑 Shutting down MineSensors mining demo server...");
  
  try {
    if (simulationEngine) {
      await simulationEngine.stop();
      console.log("⚙️  Simulation engine stopped");
    }
    
    if (opcuaServer) {
      await opcuaServer.shutdown();
      console.log("📡 OPC UA server stopped");
    }
    
    console.log("✅ Shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
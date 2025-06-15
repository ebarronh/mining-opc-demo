import WebSocket from 'ws';
import { MiningSimulationEngine } from '../simulation/mining-simulation-engine';
import { MiningDataUpdate } from '../types/mining-types';
import { MessageHandlers } from './messageHandlers';

interface WebSocketStats {
  activeConnections: number;
  messagesSent: number;
  totalConnections: number;
  startTime: Date;
}

let wsStats: WebSocketStats = {
  activeConnections: 0,
  messagesSent: 0,
  totalConnections: 0,
  startTime: new Date()
};

export async function startWebSocketBridge(port: number, simulationEngine: MiningSimulationEngine, messageHandlers?: MessageHandlers): Promise<WebSocketStats> {
  console.log(`🔄 Starting WebSocket bridge on port ${port}...`);

  // Create WebSocket server
  const wss = new WebSocket.Server({ 
    port: port,
    path: '/ws'
  });

  console.log(`✅ WebSocket server listening on ws://localhost:${port}/ws`);

  // Handle new client connections
  wss.on('connection', (ws: WebSocket, request) => {
    wsStats.activeConnections++;
    wsStats.totalConnections++;
    
    console.log(`🔗 New WebSocket client connected from ${request.socket.remoteAddress}`);
    console.log(`📊 Active connections: ${wsStats.activeConnections}`);

    // Add client to message handlers if available
    if (messageHandlers) {
      messageHandlers.addClient(ws);
    }

    // Send welcome message with connection info
    const welcomeMessage = {
      type: 'connection',
      message: 'Connected to MineSensors OPC UA Mining Demo',
      timestamp: new Date().toISOString(),
      serverInfo: {
        productName: 'MineSensors Educational Mining Demo',
        version: '2.0.0',
        equipmentCount: simulationEngine.getEquipmentCount()
      }
    };

    ws.send(JSON.stringify(welcomeMessage));
    wsStats.messagesSent++;

    // Handle client messages
    ws.on('message', (message: WebSocket.Data) => {
      try {
        const data = JSON.parse(message.toString());
        if (messageHandlers) {
          messageHandlers.handleIncomingMessage(ws, data);
        }
        handleClientMessage(ws, data, simulationEngine);
      } catch (error) {
        console.error('Error parsing client message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON message format',
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      wsStats.activeConnections--;
      console.log(`🔌 WebSocket client disconnected. Active connections: ${wsStats.activeConnections}`);
      
      // Remove client from message handlers
      if (messageHandlers) {
        messageHandlers.removeClient(ws);
      }
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      wsStats.activeConnections--;
      
      // Remove client from message handlers
      if (messageHandlers) {
        messageHandlers.removeClient(ws);
      }
    });
  });

  // Note: Periodic data broadcasting is now handled by the simulation engine
  // through MessageHandlers, so we don't need the legacy broadcasting here

  // Handle server shutdown
  process.on('SIGTERM', () => {
    wss.close();
  });

  process.on('SIGINT', () => {
    wss.close();
  });

  return wsStats;
}

function handleClientMessage(ws: WebSocket, message: any, simulationEngine: MiningSimulationEngine): void {
  switch (message.type) {
    case 'subscribe':
      handleSubscriptionRequest(ws, message);
      break;
      
    case 'unsubscribe':
      handleUnsubscriptionRequest(ws, message);
      break;
      
    case 'trigger_scenario':
      handleScenarioTrigger(ws, message, simulationEngine);
      break;
      
    case 'get_equipment_list':
      handleEquipmentListRequest(ws);
      break;
      
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString()
      }));
      wsStats.messagesSent++;
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: `Unknown message type: ${message.type}`,
        timestamp: new Date().toISOString()
      }));
      wsStats.messagesSent++;
  }
}

function handleSubscriptionRequest(ws: WebSocket, message: any): void {
  console.log(`📺 Client subscribing to: ${message.equipment || 'all equipment'}`);
  
  // Store subscription preferences on the WebSocket object
  (ws as any).subscriptions = message.equipment || ['all'];
  
  ws.send(JSON.stringify({
    type: 'subscription_confirmed',
    equipment: message.equipment || ['all'],
    timestamp: new Date().toISOString()
  }));
  wsStats.messagesSent++;
}

function handleUnsubscriptionRequest(ws: WebSocket, message: any): void {
  console.log(`📺 Client unsubscribing from: ${message.equipment || 'all equipment'}`);
  
  // Remove subscriptions
  (ws as any).subscriptions = [];
  
  ws.send(JSON.stringify({
    type: 'unsubscription_confirmed',
    equipment: message.equipment || ['all'],
    timestamp: new Date().toISOString()
  }));
  wsStats.messagesSent++;
}

function handleScenarioTrigger(ws: WebSocket, message: any, simulationEngine: MiningSimulationEngine): void {
  console.log(`🎬 Client triggering scenario: ${message.scenario}`);
  
  const success = simulationEngine.triggerScenario(message.scenario, message.parameters || {});
  
  ws.send(JSON.stringify({
    type: 'scenario_response',
    scenario: message.scenario,
    success: success,
    message: success ? 'Scenario triggered successfully' : 'Failed to trigger scenario',
    timestamp: new Date().toISOString()
  }));
  wsStats.messagesSent++;
}

function handleEquipmentListRequest(ws: WebSocket): void {
  const equipmentList = {
    excavators: ['EX001', 'EX002'],
    trucks: ['TR001', 'TR002', 'TR003'],
    conveyors: ['CV001', 'CV002']
  };
  
  ws.send(JSON.stringify({
    type: 'equipment_list',
    equipment: equipmentList,
    total_count: 7,
    timestamp: new Date().toISOString()
  }));
  wsStats.messagesSent++;
}

// Legacy mining data broadcasting - now handled by MessageHandlers
// This function is kept for backwards compatibility with existing client messages
function broadcastMiningData(wss: WebSocket.Server, simulationEngine: MiningSimulationEngine): void {
  if (wsStats.activeConnections === 0) {
    return; // No clients to broadcast to
  }

  // Create legacy format mining data for backwards compatibility
  const miningData: MiningDataUpdate = {
    timestamp: new Date().toISOString(),
    equipment: {
      excavators: [],
      trucks: [],
      conveyors: []
    },
    siteMetrics: {
      hourlyTonnage: 1800 + Math.random() * 400,
      averageGrade: 2.5 + Math.random() * 1.0,
      activeEquipment: simulationEngine.getEquipmentCount()
    }
  };

  const performanceData = {
    type: 'mining_data',
    data: miningData,
    performance: {
      update_rate: simulationEngine.getUpdateRate(),
      active_scenarios: simulationEngine.getActiveScenarios(),
      server_uptime: Date.now() - wsStats.startTime.getTime()
    }
  };

  const message = JSON.stringify(performanceData);

  // Broadcast to all connected clients (legacy support)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        const subscriptions = (client as any).subscriptions || ['all'];
        
        if (subscriptions.includes('all') || shouldSendToClient(subscriptions, miningData)) {
          client.send(message);
          wsStats.messagesSent++;
        }
      } catch (error) {
        console.error('Error broadcasting to client:', error);
      }
    }
  });
}

function shouldSendToClient(subscriptions: string[], data: MiningDataUpdate): boolean {
  // Check if client is subscribed to any of the equipment types with data
  for (const subscription of subscriptions) {
    if (subscription.startsWith('excavator') && data.equipment.excavators.length > 0) {
      return true;
    }
    if (subscription.startsWith('truck') && data.equipment.trucks.length > 0) {
      return true;
    }
    if (subscription.startsWith('conveyor') && data.equipment.conveyors.length > 0) {
      return true;
    }
    if (subscription === 'metrics') {
      return true;
    }
  }
  return false;
}

// Export stats for health monitoring
export function getWebSocketStats(): WebSocketStats {
  return { ...wsStats };
}

// Reset stats (useful for testing)
export function resetWebSocketStats(): void {
  wsStats = {
    activeConnections: wsStats.activeConnections, // Keep current connections
    messagesSent: 0,
    totalConnections: 0,
    startTime: new Date()
  };
}
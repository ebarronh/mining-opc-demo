import { WebSocket } from 'ws';
import { GradeData, EquipmentPosition, OpcUaNode } from '../types/mining-types';

export interface WebSocketMessage {
  type: string;
  payload?: any;
  data?: any;
  timestamp: string;
}

// Message handlers for different types of WebSocket messages
export class MessageHandlers {
  private connectedClients: Set<WebSocket> = new Set();

  constructor() {
    this.setupHeartbeat();
  }

  // Register a new client connection
  addClient(ws: WebSocket): void {
    this.connectedClients.add(ws);
    console.log(`Client connected. Total clients: ${this.connectedClients.size}`);

    // Send initial data to new client
    this.sendInitialData(ws);

    // Handle client disconnect
    ws.on('close', () => {
      this.connectedClients.delete(ws);
      console.log(`Client disconnected. Total clients: ${this.connectedClients.size}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
      this.connectedClients.delete(ws);
    });
  }

  // Remove a client manually (for external cleanup)
  removeClient(ws: WebSocket): void {
    this.connectedClients.delete(ws);
    console.log(`Client manually removed. Total clients: ${this.connectedClients.size}`);
  }

  // Send initial data to a newly connected client
  private sendInitialData(ws: WebSocket): void {
    // Send welcome message
    this.sendToClient(ws, {
      type: 'connection_established',
      payload: {
        message: 'Connected to MineSensors OPC UA Server',
        serverTime: new Date().toISOString(),
        features: ['equipment_positions', 'grade_data', 'opcua_updates']
      },
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast equipment position updates
  broadcastEquipmentPositions(positions: EquipmentPosition[]): void {
    const message: WebSocketMessage = {
      type: 'equipment_positions',
      payload: {
        equipment: positions,
        timestamp: new Date().toISOString(),
        count: positions.length
      },
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  // Broadcast grade data updates
  broadcastGradeData(gradeData: GradeData): void {
    const message: WebSocketMessage = {
      type: 'grade_data',
      payload: gradeData,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  // Broadcast OPC UA node value updates
  broadcastOpcUaUpdates(updates: Array<{ nodeId: string; value: any; dataType: string; timestamp: string }>): void {
    const message: WebSocketMessage = {
      type: 'opcua_updates',
      payload: {
        updates,
        count: updates.length,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  // Broadcast system status updates
  broadcastSystemStatus(status: { status: string; message?: string; details?: any }): void {
    const message: WebSocketMessage = {
      type: 'system_status',
      payload: {
        ...status,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    this.broadcastToAll(message);
  }

  // Send message to specific client
  private sendToClient(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to client:', error);
        this.connectedClients.delete(ws);
      }
    } else {
      this.connectedClients.delete(ws);
    }
  }

  // Broadcast message to all connected clients
  private broadcastToAll(message: WebSocketMessage): void {
    const clientsToRemove: WebSocket[] = [];

    this.connectedClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error broadcasting to client:', error);
          clientsToRemove.push(ws);
        }
      } else {
        clientsToRemove.push(ws);
      }
    });

    // Clean up dead connections
    clientsToRemove.forEach(ws => {
      this.connectedClients.delete(ws);
    });

    if (clientsToRemove.length > 0) {
      console.log(`Cleaned up ${clientsToRemove.length} dead connections`);
    }
  }

  // Setup periodic heartbeat to keep connections alive
  private setupHeartbeat(): void {
    setInterval(() => {
      const heartbeat: WebSocketMessage = {
        type: 'heartbeat',
        payload: {
          serverTime: new Date().toISOString(),
          connectedClients: this.connectedClients.size
        },
        timestamp: new Date().toISOString()
      };

      this.broadcastToAll(heartbeat);
    }, 30000); // Send heartbeat every 30 seconds
  }

  // Handle incoming messages from clients
  handleIncomingMessage(ws: WebSocket, data: string): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'ping':
          this.sendToClient(ws, {
            type: 'pong',
            payload: { timestamp: new Date().toISOString() },
            timestamp: new Date().toISOString()
          });
          break;

        case 'subscribe_opcua':
          this.handleOpcUaSubscription(ws, message.payload);
          break;

        case 'unsubscribe_opcua':
          this.handleOpcUaUnsubscription(ws, message.payload);
          break;

        default:
          console.log('Unknown message type:', message.type);
          break;
      }
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  // Handle OPC UA subscription requests
  private handleOpcUaSubscription(ws: WebSocket, payload: { nodeId: string }): void {
    // TODO: Implement actual OPC UA subscription logic
    console.log(`Client requested subscription to node: ${payload.nodeId}`);
    
    this.sendToClient(ws, {
      type: 'subscription_confirmed',
      payload: {
        nodeId: payload.nodeId,
        status: 'subscribed',
        message: 'Subscription active'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Handle OPC UA unsubscription requests
  private handleOpcUaUnsubscription(ws: WebSocket, payload: { nodeId: string }): void {
    // TODO: Implement actual OPC UA unsubscription logic
    console.log(`Client requested unsubscription from node: ${payload.nodeId}`);
    
    this.sendToClient(ws, {
      type: 'subscription_cancelled',
      payload: {
        nodeId: payload.nodeId,
        status: 'unsubscribed',
        message: 'Subscription cancelled'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Get current connection stats
  getStats(): { connectedClients: number; uptime: number } {
    return {
      connectedClients: this.connectedClients.size,
      uptime: process.uptime()
    };
  }
}
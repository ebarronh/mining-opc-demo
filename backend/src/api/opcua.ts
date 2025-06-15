import { Request, Response } from 'express';
import { OPCUAServer, BrowseResult, NodeId, AttributeIds, DataValue } from 'node-opcua';
import { OpcUaNode } from '../types/mining-types';

export class OpcUaApiController {
  private server: OPCUAServer;
  private subscriptions: Map<string, Set<string>> = new Map(); // clientId -> Set of nodeIds

  constructor(server: OPCUAServer) {
    this.server = server;
  }

  // GET /api/opcua/browse - Browse the OPC UA address space
  async browse(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId = 'ns=0;i=85' } = req.query; // Default to Objects folder
      
      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) {
        res.status(500).json({ error: 'Address space not available' });
        return;
      }

      const rootNode = addressSpace.findNode(nodeId as string);
      if (!rootNode) {
        res.status(404).json({ error: `Node not found: ${nodeId}` });
        return;
      }

      // Browse children
      const children: OpcUaNode[] = [];
      const references = rootNode.allReferences();
      
      for (const reference of references) {
        if (reference.isForward && reference.referenceType && 
            (reference.referenceType as any).browseName?.name === 'HasChild') {
          const childNode = reference.node;
          if (childNode) {
            const browseName = (childNode as any).browseName?.name || '';
            const displayName = (childNode as any).displayName?.text || 
                              (Array.isArray((childNode as any).displayName) ? 
                                (childNode as any).displayName[0]?.text : '') || 
                              browseName || '';
            const description = (childNode as any).description?.text || 
                              (Array.isArray((childNode as any).description) ? 
                                (childNode as any).description[0]?.text : '') || '';
            
            children.push({
              nodeId: childNode.nodeId.toString(),
              browseName,
              displayName,
              nodeClass: this.getNodeClass(childNode),
              dataType: this.getDataType(childNode),
              value: await this.getNodeValue(childNode),
              hasChildren: this.hasChildren(childNode),
              description,
              namespace: childNode.nodeId.namespace,
              category: this.categorizeNode(childNode)
            });
          }
        }
      }

      // Sort children by browseName for consistent ordering
      children.sort((a, b) => a.browseName.localeCompare(b.browseName));

      const rootBrowseName = (rootNode as any).browseName?.name || '';
      const rootDisplayName = (rootNode as any).displayName?.text || 
                             (Array.isArray((rootNode as any).displayName) ? 
                               (rootNode as any).displayName[0]?.text : '') || 
                             rootBrowseName || '';

      res.json({
        nodeId: nodeId as string,
        browseName: rootBrowseName,
        displayName: rootDisplayName,
        children,
        total: children.length
      });

    } catch (error) {
      console.error('Error browsing OPC UA nodes:', error);
      res.status(500).json({ 
        error: 'Failed to browse OPC UA nodes',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/opcua/node/:nodeId - Get detailed information about a specific node
  async getNodeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId } = req.params;
      
      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) {
        res.status(500).json({ error: 'Address space not available' });
        return;
      }

      const node = addressSpace.findNode(nodeId);
      if (!node) {
        res.status(404).json({ error: `Node not found: ${nodeId}` });
        return;
      }

      const browseName = (node as any).browseName?.name || '';
      const displayName = (node as any).displayName?.text || 
                         (Array.isArray((node as any).displayName) ? 
                           (node as any).displayName[0]?.text : '') || 
                         browseName || '';
      const description = (node as any).description?.text || 
                         (Array.isArray((node as any).description) ? 
                           (node as any).description[0]?.text : '') || '';

      const nodeDetails: OpcUaNode = {
        nodeId: node.nodeId.toString(),
        browseName,
        displayName,
        nodeClass: this.getNodeClass(node),
        dataType: this.getDataType(node),
        value: await this.getNodeValue(node),
        hasChildren: this.hasChildren(node),
        description,
        namespace: node.nodeId.namespace,
        category: this.categorizeNode(node),
        // Additional details
        accessLevel: this.getAccessLevel(node),
        userAccessLevel: this.getUserAccessLevel(node),
        writeMask: this.getWriteMask(node),
        userWriteMask: this.getUserWriteMask(node)
      };

      res.json(nodeDetails);

    } catch (error) {
      console.error('Error getting node details:', error);
      res.status(500).json({ 
        error: 'Failed to get node details',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/opcua/subscribe - Subscribe to node value changes
  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId, clientId = 'default' } = req.body;

      if (!nodeId) {
        res.status(400).json({ error: 'NodeId is required' });
        return;
      }

      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) {
        res.status(500).json({ error: 'Address space not available' });
        return;
      }

      const node = addressSpace.findNode(nodeId);
      if (!node) {
        res.status(404).json({ error: `Node not found: ${nodeId}` });
        return;
      }

      // Add to subscriptions
      if (!this.subscriptions.has(clientId)) {
        this.subscriptions.set(clientId, new Set());
      }
      
      const clientSubscriptions = this.subscriptions.get(clientId)!;
      clientSubscriptions.add(nodeId);

      // TODO: Set up actual OPC UA subscription with monitoring
      // For now, we'll simulate it by tracking the subscription

      res.json({
        success: true,
        message: `Subscribed to ${nodeId}`,
        nodeId,
        clientId,
        subscriptionCount: clientSubscriptions.size
      });

    } catch (error) {
      console.error('Error subscribing to node:', error);
      res.status(500).json({ 
        error: 'Failed to subscribe to node',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/opcua/subscribe - Unsubscribe from node value changes
  async unsubscribe(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId, clientId = 'default' } = req.body;

      if (!nodeId) {
        res.status(400).json({ error: 'NodeId is required' });
        return;
      }

      const clientSubscriptions = this.subscriptions.get(clientId);
      if (clientSubscriptions) {
        clientSubscriptions.delete(nodeId);
        
        // Clean up empty client subscriptions
        if (clientSubscriptions.size === 0) {
          this.subscriptions.delete(clientId);
        }
      }

      res.json({
        success: true,
        message: `Unsubscribed from ${nodeId}`,
        nodeId,
        clientId,
        subscriptionCount: clientSubscriptions?.size || 0
      });

    } catch (error) {
      console.error('Error unsubscribing from node:', error);
      res.status(500).json({ 
        error: 'Failed to unsubscribe from node',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/opcua/subscriptions - Get all active subscriptions
  async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.query;

      if (clientId) {
        const clientSubscriptions = this.subscriptions.get(clientId as string);
        res.json({
          clientId,
          subscriptions: clientSubscriptions ? Array.from(clientSubscriptions) : [],
          count: clientSubscriptions?.size || 0
        });
      } else {
        const allSubscriptions: { [clientId: string]: string[] } = {};
        let totalCount = 0;

        for (const [client, nodeIds] of this.subscriptions) {
          allSubscriptions[client] = Array.from(nodeIds);
          totalCount += nodeIds.size;
        }

        res.json({
          subscriptions: allSubscriptions,
          totalCount,
          clientCount: this.subscriptions.size
        });
      }

    } catch (error) {
      console.error('Error getting subscriptions:', error);
      res.status(500).json({ 
        error: 'Failed to get subscriptions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/opcua/write - Write value to a node
  async writeNode(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId, value, dataType } = req.body;

      if (!nodeId || value === undefined) {
        res.status(400).json({ error: 'NodeId and value are required' });
        return;
      }

      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) {
        res.status(500).json({ error: 'Address space not available' });
        return;
      }

      const node = addressSpace.findNode(nodeId);
      if (!node) {
        res.status(404).json({ error: `Node not found: ${nodeId}` });
        return;
      }

      // TODO: Implement actual write operation
      // For now, simulate successful write
      
      res.json({
        success: true,
        message: `Value written to ${nodeId}`,
        nodeId,
        value,
        dataType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error writing to node:', error);
      res.status(500).json({ 
        error: 'Failed to write to node',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Helper methods
  private getNodeClass(node: any): string {
    if (node.nodeClass) {
      return node.nodeClass.toString();
    }
    return 'Unknown';
  }

  private getDataType(node: any): string {
    if (node.dataType) {
      return node.dataType.toString();
    }
    if (node.dataTypeDefinition) {
      return node.dataTypeDefinition.toString();
    }
    return 'Unknown';
  }

  private async getNodeValue(node: any): Promise<any> {
    try {
      if (node.readValue) {
        const dataValue = node.readValue();
        return dataValue.value?.value;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private hasChildren(node: any): boolean {
    try {
      const references = node.allReferences();
      return references.some((ref: any) => 
        ref.isForward && ref.referenceType?.browseName.name === 'HasChild'
      );
    } catch (error) {
      return false;
    }
  }

  private categorizeNode(node: any): string {
    const browseName = (node.browseName?.name || '').toLowerCase();
    
    if (browseName.includes('excavator')) return 'excavator';
    if (browseName.includes('truck') || browseName.includes('haul')) return 'truck';
    if (browseName.includes('conveyor') || browseName.includes('belt')) return 'conveyor';
    if (browseName.includes('grade') || browseName.includes('quality')) return 'quality';
    if (browseName.includes('production') || browseName.includes('metric')) return 'production';
    if (browseName.includes('alarm') || browseName.includes('alert')) return 'alarm';
    if (browseName.includes('system') || browseName.includes('control')) return 'system';
    
    return 'general';
  }

  private getAccessLevel(node: any): number {
    return node.accessLevel?.value || 0;
  }

  private getUserAccessLevel(node: any): number {
    return node.userAccessLevel?.value || 0;
  }

  private getWriteMask(node: any): number {
    return node.writeMask?.value || 0;
  }

  private getUserWriteMask(node: any): number {
    return node.userWriteMask?.value || 0;
  }

  // Get subscribed nodes for a client (used by WebSocket handlers)
  getClientSubscriptions(clientId: string): Set<string> {
    return this.subscriptions.get(clientId) || new Set();
  }

  // Clean up subscriptions for a disconnected client
  cleanupClient(clientId: string): void {
    this.subscriptions.delete(clientId);
  }
}
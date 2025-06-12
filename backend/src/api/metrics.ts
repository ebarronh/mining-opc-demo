import express from 'express';
import { HealthStatus } from '../types/mining-types';
import { getWebSocketStats } from '../websocket/ws-bridge';

export function createHealthEndpoint(app: express.Application, getStatusCallback: () => Partial<HealthStatus>): void {
  // Health check endpoint for Puppeteer validation and monitoring
  app.get('/api/health', (req, res) => {
    try {
      const baseStatus = getStatusCallback();
      const wsStats = getWebSocketStats();
      
      const healthStatus: HealthStatus = {
        status: determineOverallHealth(baseStatus),
        opcua: baseStatus.opcua || {
          server_running: false,
          client_connections: 0,
          data_updates_per_second: 0
        },
        websocket: {
          active_connections: wsStats.activeConnections,
          messages_sent: wsStats.messagesSent
        },
        simulation: baseStatus.simulation || {
          equipment_count: 0,
          scenarios_running: []
        }
      };

      res.json(healthStatus);
    } catch (error) {
      console.error('Error generating health status:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: 'Failed to generate health status',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Detailed metrics endpoint
  app.get('/api/metrics', (req, res) => {
    try {
      const baseStatus = getStatusCallback();
      const wsStats = getWebSocketStats();
      
      const detailedMetrics = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        opcua: {
          ...baseStatus.opcua,
          endpoint: 'opc.tcp://localhost:4840/mining-demo'
        },
        websocket: {
          ...wsStats,
          endpoint: 'ws://localhost:4841/ws'
        },
        simulation: {
          ...baseStatus.simulation,
          update_interval: '2 seconds'
        },
        system: {
          platform: process.platform,
          node_version: process.version,
          pid: process.pid
        }
      };

      res.json(detailedMetrics);
    } catch (error) {
      console.error('Error generating detailed metrics:', error);
      res.status(500).json({
        error: 'Failed to generate metrics',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Equipment status endpoint
  app.get('/api/equipment', (req, res) => {
    try {
      const equipmentStatus = {
        timestamp: new Date().toISOString(),
        equipment: {
          excavators: [
            {
              id: 'EX001',
              name: 'Excavator EX001',
              type: 'HydraulicExcavator',
              status: 'operational',
              location: { X: 1000, Y: 2000, Z: -15 }
            },
            {
              id: 'EX002', 
              name: 'Excavator EX002',
              type: 'HydraulicExcavator',
              status: 'operational',
              location: { X: 1200, Y: 1800, Z: -12 }
            }
          ],
          trucks: [
            {
              id: 'TR001',
              name: 'Haul Truck TR001',
              type: 'HaulTruck',
              status: 'operational',
              destination: 'Crusher'
            },
            {
              id: 'TR002',
              name: 'Haul Truck TR002', 
              type: 'HaulTruck',
              status: 'operational',
              destination: 'WasteDump'
            },
            {
              id: 'TR003',
              name: 'Haul Truck TR003',
              type: 'HaulTruck', 
              status: 'operational',
              destination: 'Stockpile_A'
            }
          ],
          conveyors: [
            {
              id: 'CV001',
              name: 'Primary Crusher Feed',
              type: 'ConveyorSystem',
              status: 'operational',
              throughput: '1200 t/h'
            },
            {
              id: 'CV002',
              name: 'Stockpile Conveyor',
              type: 'ConveyorSystem',
              status: 'operational', 
              throughput: '800 t/h'
            }
          ]
        },
        totals: {
          excavators: 2,
          trucks: 3,
          conveyors: 2,
          total_equipment: 7
        }
      };

      res.json(equipmentStatus);
    } catch (error) {
      console.error('Error generating equipment status:', error);
      res.status(500).json({
        error: 'Failed to generate equipment status',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Demo scenarios endpoint
  app.get('/api/scenarios', (req, res) => {
    try {
      const scenarios = {
        timestamp: new Date().toISOString(),
        available_scenarios: [
          {
            name: 'high_grade_discovery',
            description: 'Excavator discovers high-grade ore zone (>5.0 g/t Au)',
            parameters: ['excavatorId'],
            educational_value: 'Demonstrates economic impact of grade control'
          },
          {
            name: 'equipment_maintenance',
            description: 'Conveyor shows increasing vibration requiring maintenance',
            parameters: ['conveyorId'],
            educational_value: 'Shows predictive maintenance in mining operations'
          },
          {
            name: 'fleet_optimization',
            description: 'Optimize truck routing based on ore grade and destinations',
            parameters: [],
            educational_value: 'Illustrates fleet management and operational efficiency'
          }
        ],
        active_scenarios: getStatusCallback().simulation?.scenarios_running || []
      };

      res.json(scenarios);
    } catch (error) {
      console.error('Error generating scenarios:', error);
      res.status(500).json({
        error: 'Failed to generate scenarios',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Trigger scenario endpoint
  app.post('/api/scenarios/:scenarioName/trigger', (req, res) => {
    try {
      const scenarioName = req.params.scenarioName;
      const parameters = req.body || {};

      // This would trigger the scenario in the simulation engine
      // For now, we'll just return a success response
      
      res.json({
        success: true,
        scenario: scenarioName,
        parameters: parameters,
        message: `Scenario '${scenarioName}' triggered successfully`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error triggering scenario:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trigger scenario',
        timestamp: new Date().toISOString()
      });
    }
  });

  console.log('📊 Health and metrics endpoints configured:');
  console.log('   GET  /api/health     - System health status');
  console.log('   GET  /api/metrics    - Detailed performance metrics');
  console.log('   GET  /api/equipment  - Equipment status and inventory');
  console.log('   GET  /api/scenarios  - Available demo scenarios');
  console.log('   POST /api/scenarios/:name/trigger - Trigger educational scenarios');
}

function determineOverallHealth(status: Partial<HealthStatus>): 'healthy' | 'degraded' | 'unhealthy' {
  // Determine overall system health based on component status
  
  if (!status.opcua?.server_running) {
    return 'unhealthy';
  }
  
  if (!status.simulation?.equipment_count || status.simulation.equipment_count < 7) {
    return 'degraded';
  }
  
  if (status.opcua.data_updates_per_second === 0) {
    return 'degraded';
  }
  
  return 'healthy';
}
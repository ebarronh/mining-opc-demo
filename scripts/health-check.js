#!/usr/bin/env node

/**
 * Health Check Script for MineSensors OPC UA Mining Demo
 * Validates that all services are running correctly
 */

const http = require('http');
const https = require('https');
const { WebSocket } = require('ws');

class HealthChecker {
  constructor() {
    this.results = {
      frontend: { status: 'unknown', url: 'http://localhost:3000', error: null },
      backend: { status: 'unknown', url: 'http://localhost:3001', error: null },
      backendHealth: { status: 'unknown', url: 'http://localhost:3001/api/health', error: null },
      websocket: { status: 'unknown', url: 'ws://localhost:4841/ws', error: null }
    };
  }

  async checkHttp(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, { timeout }, (res) => {
        resolve({
          status: res.statusCode,
          headers: res.headers
        });
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });

      request.on('error', (err) => {
        reject(err);
      });
    });
  }

  async checkWebSocket(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      
      const timeoutId = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, timeout);

      ws.on('open', () => {
        clearTimeout(timeoutId);
        ws.close();
        resolve({ status: 'connected' });
      });

      ws.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
    });
  }

  async checkFrontend() {
    try {
      const response = await this.checkHttp(this.results.frontend.url);
      if (response.status === 200) {
        this.results.frontend.status = 'healthy';
      } else {
        this.results.frontend.status = 'unhealthy';
        this.results.frontend.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      this.results.frontend.status = 'offline';
      this.results.frontend.error = error.message;
    }
  }

  async checkBackend() {
    try {
      const response = await this.checkHttp(this.results.backend.url);
      if (response.status >= 200 && response.status < 400) {
        this.results.backend.status = 'healthy';
      } else {
        this.results.backend.status = 'unhealthy';
        this.results.backend.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      this.results.backend.status = 'offline';
      this.results.backend.error = error.message;
    }
  }

  async checkBackendHealth() {
    try {
      const response = await this.checkHttp(this.results.backendHealth.url);
      if (response.status === 200) {
        this.results.backendHealth.status = 'healthy';
      } else {
        this.results.backendHealth.status = 'unhealthy';
        this.results.backendHealth.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      this.results.backendHealth.status = 'offline';
      this.results.backendHealth.error = error.message;
    }
  }

  async checkWebSocketEndpoint() {
    try {
      await this.checkWebSocket(this.results.websocket.url);
      this.results.websocket.status = 'healthy';
    } catch (error) {
      this.results.websocket.status = 'offline';
      this.results.websocket.error = error.message;
    }
  }

  getStatusIcon(status) {
    switch (status) {
      case 'healthy': return '✅';
      case 'unhealthy': return '⚠️';
      case 'offline': return '❌';
      default: return '❓';
    }
  }

  async run() {
    console.log('🏥 MineSensors OPC UA Mining Demo - Health Check');
    console.log('='.repeat(60));
    console.log('');

    // Run all checks concurrently
    await Promise.all([
      this.checkFrontend(),
      this.checkBackend(),
      this.checkBackendHealth(),
      this.checkWebSocketEndpoint()
    ]);

    // Display results
    console.log('📊 Service Status:');
    console.log('');

    Object.entries(this.results).forEach(([service, result]) => {
      const icon = this.getStatusIcon(result.status);
      const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
      const url = result.url;
      const error = result.error ? ` (${result.error})` : '';
      
      console.log(`${icon} ${serviceName.padEnd(15)} ${result.status.toUpperCase().padEnd(10)} ${url}${error}`);
    });

    console.log('');

    // Overall status
    const allHealthy = Object.values(this.results).every(r => r.status === 'healthy');
    const hasUnhealthy = Object.values(this.results).some(r => r.status === 'unhealthy');
    
    if (allHealthy) {
      console.log('🎉 All services are healthy and ready for development!');
      console.log('');
      console.log('Next steps:');
      console.log('  • Frontend: http://localhost:3000');
      console.log('  • Backend Health: http://localhost:3001/api/health');
      console.log('  • Run Phase 3 validation: pnpm validate:phase3');
      process.exit(0);
    } else if (hasUnhealthy) {
      console.log('⚠️  Some services have issues but are reachable.');
      console.log('');
      console.log('Troubleshooting:');
      console.log('  • Check service logs for errors');
      console.log('  • Verify configuration and environment variables');
      process.exit(1);
    } else {
      console.log('❌ Some services are offline.');
      console.log('');
      console.log('To start services:');
      console.log('  • Frontend: pnpm dev:frontend');
      console.log('  • Backend: pnpm dev:backend');
      console.log('  • All services: pnpm dev');
      process.exit(1);
    }
  }
}

// Run health check if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.run().catch(console.error);
}

module.exports = HealthChecker;
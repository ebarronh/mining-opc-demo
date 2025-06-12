#!/usr/bin/env node

/**
 * Development Setup Script for MineSensors OPC UA Mining Demo
 * Automates the development environment setup process
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.frontendPath = path.join(this.projectRoot, 'frontend');
    this.backendPath = path.join(this.projectRoot, 'backend');
  }

  log(message, type = 'info') {
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'setup': '🔧'
    }[type] || '📋';
    
    console.log(`${prefix} ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkNodeVersion() {
    this.log('Checking Node.js version...', 'setup');
    
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        this.log(`Node.js ${nodeVersion} detected. Version 18+ required.`, 'error');
        process.exit(1);
      }
      
      this.log(`Node.js ${nodeVersion} ✓`, 'success');
    } catch (error) {
      this.log(`Failed to check Node.js version: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  checkPnpm() {
    this.log('Checking pnpm installation...', 'setup');
    
    try {
      const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
      this.log(`pnpm ${pnpmVersion} ✓`, 'success');
      return true;
    } catch (error) {
      this.log('pnpm not found. Installing...', 'warning');
      try {
        execSync('npm install -g pnpm', { stdio: 'inherit' });
        this.log('pnpm installed successfully', 'success');
        return true;
      } catch (installError) {
        this.log('Failed to install pnpm automatically', 'error');
        this.log('Please install pnpm manually: npm install -g pnpm', 'info');
        return false;
      }
    }
  }

  createEnvironmentFiles() {
    this.log('Setting up environment files...', 'setup');
    
    // Frontend environment file
    const frontendEnvPath = path.join(this.frontendPath, '.env.local');
    if (!fs.existsSync(frontendEnvPath)) {
      const frontendEnvContent = `# MineSensors OPC UA Mining Demo - Frontend Environment
# Phase 2 Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# WebSocket URL for real-time data
NEXT_PUBLIC_WS_URL=ws://localhost:4841/ws

# Development flags
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_PHASE=3
`;
      
      fs.writeFileSync(frontendEnvPath, frontendEnvContent);
      this.log('Created frontend/.env.local', 'success');
    } else {
      this.log('Frontend environment file already exists', 'info');
    }

    // Backend environment file (if backend exists)
    if (fs.existsSync(this.backendPath)) {
      const backendEnvPath = path.join(this.backendPath, '.env');
      if (!fs.existsSync(backendEnvPath)) {
        const backendEnvContent = `# MineSensors OPC UA Mining Demo - Backend Environment
# OPC UA Server Settings
OPCUA_PORT=4840
OPCUA_ENDPOINT=opc.tcp://localhost:4840

# WebSocket Settings
WS_PORT=4841

# API Settings
API_PORT=3001
API_HOST=localhost

# Simulation Settings
SIMULATION_ENABLED=true
EQUIPMENT_COUNT=7

# Mining Demo Settings
SITE_NAME=GoldRush_Mine
ORE_GRADE_CUTOFF=2.5
`;
        
        fs.writeFileSync(backendEnvPath, backendEnvContent);
        this.log('Created backend/.env', 'success');
      } else {
        this.log('Backend environment file already exists', 'info');
      }
    }
  }

  installDependencies() {
    this.log('Installing project dependencies...', 'setup');
    
    try {
      // Install root dependencies
      this.log('Installing root dependencies...', 'info');
      execSync('pnpm install', { cwd: this.projectRoot, stdio: 'inherit' });
      
      // Install frontend dependencies
      this.log('Installing frontend dependencies...', 'info');
      execSync('pnpm install', { cwd: this.frontendPath, stdio: 'inherit' });
      
      // Install backend dependencies if backend exists
      if (fs.existsSync(this.backendPath)) {
        this.log('Installing backend dependencies...', 'info');
        execSync('pnpm install', { cwd: this.backendPath, stdio: 'inherit' });
      }
      
      this.log('All dependencies installed successfully', 'success');
    } catch (error) {
      this.log(`Failed to install dependencies: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  createDirectories() {
    this.log('Creating necessary directories...', 'setup');
    
    const directories = [
      'validation',
      'scripts',
      'docs',
      'frontend/.next',
      'frontend/public/screenshots'
    ];
    
    directories.forEach(dir => {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`, 'success');
      }
    });
  }

  makeScriptsExecutable() {
    this.log('Making scripts executable...', 'setup');
    
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const scripts = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
      
      scripts.forEach(script => {
        const scriptPath = path.join(scriptsDir, script);
        try {
          execSync(`chmod +x "${scriptPath}"`, { stdio: 'ignore' });
          this.log(`Made executable: scripts/${script}`, 'success');
        } catch (error) {
          this.log(`Failed to make executable: scripts/${script}`, 'warning');
        }
      });
    }
  }

  showCompletionMessage() {
    console.log('');
    this.log('='.repeat(70), 'success');
    this.log('🎉 Development environment setup complete!', 'success');
    this.log('='.repeat(70), 'success');
    console.log('');
    
    console.log('📋 Next steps:');
    console.log('');
    console.log('  1. Start development servers:');
    console.log('     pnpm dev                    # Start both frontend and backend');
    console.log('     pnpm dev:frontend           # Start only frontend');
    console.log('     pnpm dev:backend            # Start only backend');
    console.log('');
    console.log('  2. Check service health:');
    console.log('     node scripts/health-check.js');
    console.log('');
    console.log('  3. Validate Phase 3 implementation:');
    console.log('     pnpm validate:phase3');
    console.log('');
    console.log('  4. Access applications:');
    console.log('     Frontend: http://localhost:3000');
    console.log('     Backend:  http://localhost:3001');
    console.log('     Health:   http://localhost:3001/api/health');
    console.log('');
    console.log('📖 For detailed documentation, see: CLAUDE.md');
    console.log('');
  }

  async run() {
    console.log('🚀 MineSensors OPC UA Mining Demo - Development Setup');
    console.log('='.repeat(70));
    console.log('');

    try {
      // Check prerequisites
      this.checkNodeVersion();
      
      if (!this.checkPnpm()) {
        process.exit(1);
      }

      // Setup environment
      this.createDirectories();
      this.createEnvironmentFiles();
      this.installDependencies();
      this.makeScriptsExecutable();

      // Show completion message
      this.showCompletionMessage();

    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DevSetup();
  setup.run().catch(console.error);
}

module.exports = DevSetup;
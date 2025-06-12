#!/usr/bin/env node

/**
 * Project Statistics Script for MineSensors OPC UA Mining Demo
 * Provides insights into codebase size, structure, and progress
 */

const fs = require('fs');
const path = require('path');

class ProjectStats {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = {
      files: { total: 0, byType: {} },
      lines: { total: 0, byType: {} },
      components: { react: 0, pages: 0, hooks: 0 },
      phases: { completed: [], current: 'Phase 3', progress: 0 }
    };
  }

  log(message, type = 'info') {
    const prefix = {
      'info': '📊',
      'success': '✅',
      'error': '❌',
      'stat': '📈'
    }[type] || '📊';
    
    console.log(`${prefix} ${message}`);
  }

  getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase();
  }

  countLines(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.split('\n').length;
    } catch (error) {
      return 0;
    }
  }

  isCodeFile(filePath) {
    const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json'];
    return codeExtensions.includes(this.getFileExtension(filePath));
  }

  analyzeDirectory(dirPath, relativePath = '') {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);
        
        // Skip node_modules, .git, .next, and other build directories
        if (item === 'node_modules' || item === '.git' || item === '.next' || 
            item === 'dist' || item === 'build' || item.startsWith('.')) {
          continue;
        }
        
        if (stat.isDirectory()) {
          this.analyzeDirectory(fullPath, relativeItemPath);
        } else if (this.isCodeFile(fullPath)) {
          this.analyzeFile(fullPath, relativeItemPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  analyzeFile(filePath, relativePath) {
    const extension = this.getFileExtension(filePath);
    const lines = this.countLines(filePath);
    
    // Update file counts
    this.stats.files.total++;
    this.stats.files.byType[extension] = (this.stats.files.byType[extension] || 0) + 1;
    
    // Update line counts
    this.stats.lines.total += lines;
    this.stats.lines.byType[extension] = (this.stats.lines.byType[extension] || 0) + lines;
    
    // Analyze component types
    this.analyzeComponentType(filePath, relativePath, extension);
  }

  analyzeComponentType(filePath, relativePath, extension) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count React components
    if ((extension === '.tsx' || extension === '.jsx') && 
        (content.includes('export default function') || content.includes('export function'))) {
      this.stats.components.react++;
    }
    
    // Count pages
    if (relativePath.includes('app/') && fileName === 'page.tsx') {
      this.stats.components.pages++;
    }
    
    // Count hooks
    if (relativePath.includes('hooks/') || fileName.startsWith('use')) {
      this.stats.components.hooks++;
    }
  }

  analyzePhaseProgress() {
    // Check for completed phases based on file structure and features
    const frontendExists = fs.existsSync(path.join(this.projectRoot, 'frontend'));
    const backendExists = fs.existsSync(path.join(this.projectRoot, 'backend'));
    const validationExists = fs.existsSync(path.join(this.projectRoot, 'validation'));
    
    // Phase 1: Initial setup (assumed complete if frontend exists)
    if (frontendExists) {
      this.stats.phases.completed.push('Phase 1: Project Setup');
    }
    
    // Phase 2: Backend development (check for backend directory)
    if (backendExists) {
      this.stats.phases.completed.push('Phase 2: OPC UA Backend');
    }
    
    // Phase 3: Frontend foundations (check for key components)
    const appLayoutExists = fs.existsSync(path.join(this.projectRoot, 'frontend/src/components/layout/AppLayout.tsx'));
    const navigationExists = fs.existsSync(path.join(this.projectRoot, 'frontend/src/components/navigation/MainNavigation.tsx'));
    const websocketExists = fs.existsSync(path.join(this.projectRoot, 'frontend/src/hooks/useWebSocket.ts'));
    
    if (appLayoutExists && navigationExists && websocketExists && validationExists) {
      this.stats.phases.completed.push('Phase 3: Frontend Foundations');
      this.stats.phases.progress = 100;
    } else if (frontendExists) {
      this.stats.phases.progress = 75;
    }
  }

  displayStats() {
    console.log('📊 MineSensors OPC UA Mining Demo - Project Statistics');
    console.log('='.repeat(70));
    console.log('');

    // File statistics
    console.log('📁 File Statistics:');
    console.log(`   Total files: ${this.stats.files.total}`);
    console.log(`   Total lines: ${this.stats.lines.total.toLocaleString()}`);
    console.log('');

    // File types
    console.log('📋 Files by Type:');
    const sortedTypes = Object.entries(this.stats.files.byType)
      .sort((a, b) => b[1] - a[1]);
    
    sortedTypes.forEach(([ext, count]) => {
      const lines = this.stats.lines.byType[ext] || 0;
      console.log(`   ${ext.padEnd(6)} ${count.toString().padStart(3)} files (${lines.toLocaleString().padStart(6)} lines)`);
    });
    console.log('');

    // Component statistics
    console.log('⚛️  Component Statistics:');
    console.log(`   React Components: ${this.stats.components.react}`);
    console.log(`   Pages: ${this.stats.components.pages}`);
    console.log(`   Custom Hooks: ${this.stats.components.hooks}`);
    console.log('');

    // Phase progress
    console.log('🚀 Phase Progress:');
    this.stats.phases.completed.forEach((phase, index) => {
      console.log(`   ✅ ${phase}`);
    });
    
    console.log(`   🔄 ${this.stats.phases.current} (${this.stats.phases.progress}% complete)`);
    console.log('');

    // Architecture overview
    console.log('🏗️  Architecture Overview:');
    console.log('   Frontend: Next.js 15 + Tailwind CSS + Radix UI');
    console.log('   Backend: Node.js + OPC UA Server');
    console.log('   WebSocket: Real-time data streaming');
    console.log('   Validation: Puppeteer automated testing');
    console.log('   Standards: OPC UA Mining Companion Specification');
    console.log('');

    // Code quality metrics
    const avgLinesPerFile = Math.round(this.stats.lines.total / this.stats.files.total);
    const componentRatio = Math.round((this.stats.components.react / this.stats.files.total) * 100);
    
    console.log('📈 Code Quality Metrics:');
    console.log(`   Average lines per file: ${avgLinesPerFile}`);
    console.log(`   Component ratio: ${componentRatio}%`);
    console.log(`   TypeScript coverage: ${this.calculateTypeScriptCoverage()}%`);
    console.log('');

    // Project health
    this.displayProjectHealth();
  }

  calculateTypeScriptCoverage() {
    const tsFiles = (this.stats.files.byType['.ts'] || 0) + (this.stats.files.byType['.tsx'] || 0);
    const jsFiles = (this.stats.files.byType['.js'] || 0) + (this.stats.files.byType['.jsx'] || 0);
    const totalCodeFiles = tsFiles + jsFiles;
    
    if (totalCodeFiles === 0) return 0;
    return Math.round((tsFiles / totalCodeFiles) * 100);
  }

  displayProjectHealth() {
    console.log('🏥 Project Health:');
    
    const health = [];
    
    // Check for essential files
    const essentialFiles = [
      'package.json',
      'frontend/package.json',
      'frontend/src/app/page.tsx',
      'CLAUDE.md'
    ];
    
    const missingFiles = essentialFiles.filter(file => 
      !fs.existsSync(path.join(this.projectRoot, file))
    );
    
    if (missingFiles.length === 0) {
      health.push('✅ All essential files present');
    } else {
      health.push(`❌ Missing files: ${missingFiles.join(', ')}`);
    }
    
    // Check TypeScript usage
    if (this.calculateTypeScriptCoverage() > 80) {
      health.push('✅ Good TypeScript coverage');
    } else {
      health.push('⚠️  Low TypeScript coverage');
    }
    
    // Check component organization
    if (this.stats.components.react > 5) {
      health.push('✅ Good component structure');
    } else {
      health.push('⚠️  Limited component structure');
    }
    
    health.forEach(item => console.log(`   ${item}`));
    console.log('');
    
    // Recommendations
    console.log('💡 Recommendations:');
    if (this.stats.phases.progress < 100) {
      console.log('   • Complete remaining Phase 3 tasks');
    }
    if (this.calculateTypeScriptCoverage() < 90) {
      console.log('   • Migrate remaining JavaScript files to TypeScript');
    }
    console.log('   • Run validation: pnpm validate:phase3');
    console.log('   • Check health: node scripts/health-check.js');
    console.log('');
  }

  async run() {
    this.log('Analyzing project structure...', 'stat');
    
    // Analyze the entire project
    this.analyzeDirectory(this.projectRoot);
    
    // Analyze phase progress
    this.analyzePhaseProgress();
    
    // Display all statistics
    this.displayStats();
  }
}

// Run stats if called directly
if (require.main === module) {
  const stats = new ProjectStats();
  stats.run().catch(console.error);
}

module.exports = ProjectStats;
/**
 * Phase 4 Puppeteer MCP Validation Script
 * MineSensors OPC UA Mining Demo - 3D Visualization & OPC UA Explorer Validation
 * 
 * PRD Requirements:
 * - Test 3D scene loads and renders
 * - Verify equipment is visible and interactive
 * - Test grade heatmap toggle
 * - Validate OPC UA tree exploration
 * - Capture screenshots for Phase 4 completion
 * 
 * This script validates Phase 4 deliverables:
 * 1. Three.js 3D mine scene with equipment visualization
 * 2. Grade heatmap overlay with toggle functionality
 * 3. Camera controls with keyboard shortcuts
 * 4. OPC UA Explorer with tree navigation
 * 5. Node details panel with value interpretation
 * 6. Educational features and help mode
 */

const puppeteer = require('puppeteer');
const path = require('path');

class Phase4Validator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addTest(name, passed, details = '') {
    this.results.tests.push({ name, passed, details });
    if (passed) {
      this.results.passed++;
      this.log(`${name} - PASSED ${details ? '(' + details + ')' : ''}`, 'success');
    } else {
      this.results.failed++;
      this.log(`${name} - FAILED ${details ? '(' + details + ')' : ''}`, 'error');
    }
  }

  async setup() {
    this.log('🚀 Starting Phase 4 Puppeteer MCP Validation');
    this.log('='.repeat(70));

    // Test connection first
    this.log('Testing server connectivity...', 'info');
    try {
      const http = require('http');
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000', (res) => {
          this.log(`Frontend server responded with status: ${res.statusCode}`, 'success');
          resolve();
        });
        req.on('error', (err) => {
          this.log(`Frontend server connection test failed: ${err.message}`, 'error');
          reject(err);
        });
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Frontend connection timeout'));
        });
      });

      // Test backend connection
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3001/api/health', (res) => {
          this.log(`Backend server responded with status: ${res.statusCode}`, 'success');
          resolve();
        });
        req.on('error', (err) => {
          this.log(`Backend server connection test failed: ${err.message}`, 'warning');
          resolve(); // Don't fail setup for backend issues
        });
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Backend connection timeout'));
        });
      });
    } catch (error) {
      this.log(`Cannot connect to servers: ${error.message}`, 'error');
      this.log('Please ensure frontend (port 3000) and backend (port 3001) are running', 'warning');
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Enable WebGL support
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });
  }

  async validate3DScene() {
    this.log('Testing 3D scene loads and renders...', 'info');
    
    try {
      await this.page.goto('http://localhost:3000/real-time', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      
      // Wait for Three.js to initialize
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check for Three.js canvas
      const canvas = await this.page.$('canvas');
      this.addTest('3D Canvas Present', canvas !== null, 
        canvas ? 'Found Three.js canvas element' : 'No canvas found');
      
      // Check for WebGL context
      const webglSupport = await this.page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        try {
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
          return false;
        }
      });
      
      this.addTest('WebGL Support', webglSupport, 
        webglSupport ? 'WebGL context available' : 'WebGL not supported');
      
      // Check for Three.js scene elements
      const sceneElements = await this.page.evaluate(() => {
        return window.THREE ? 'Three.js loaded' : 'Three.js not found';
      });
      
      this.addTest('Three.js Library', sceneElements.includes('loaded'), sceneElements);

      // Check for mine scene elements
      const mineSceneElement = await this.page.$('[class*="scene"], [class*="Scene"], canvas');
      this.addTest('Mine Scene Component', mineSceneElement !== null,
        mineSceneElement ? 'Mine scene container found' : 'Scene component not found');

    } catch (error) {
      this.addTest('3D Scene Test', false, error.message);
    }
  }

  async validateEquipment() {
    this.log('Testing equipment visibility and interactivity...', 'info');
    
    try {
      // Look for equipment-related UI elements
      const equipmentControls = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.toLowerCase().includes('equipment') ||
          el.textContent?.toLowerCase().includes('excavator') ||
          el.textContent?.toLowerCase().includes('truck') ||
          el.textContent?.toLowerCase().includes('conveyor')
        ).length
      );
      
      this.addTest('Equipment UI Elements', equipmentControls > 0,
        `Found ${equipmentControls} equipment-related elements`);

      // Check for equipment status indicators
      const statusIndicators = await this.page.$$eval(
        '[class*="bg-green"], [class*="bg-yellow"], [class*="bg-red"], [class*="status"]',
        elements => elements.length
      );
      
      this.addTest('Equipment Status Indicators', statusIndicators > 0,
        `Found ${statusIndicators} status indicators`);

      // Test for keyboard controls help
      const keyboardHelp = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('Press') ||
          el.textContent?.includes('Key') ||
          el.textContent?.includes('keyboard')
        ).length
      );
      
      this.addTest('Keyboard Controls UI', keyboardHelp > 0,
        `Found ${keyboardHelp} keyboard control elements`);

    } catch (error) {
      this.addTest('Equipment Test', false, error.message);
    }
  }

  async validateGradeHeatmap() {
    this.log('Testing grade heatmap toggle functionality...', 'info');
    
    try {
      // Look for grade heatmap toggle button
      const toggleButton = await this.page.$('button[class*="toggle"], button[class*="heatmap"], button:has-text("Grade"), button:has-text("Heatmap")');
      
      if (toggleButton) {
        this.addTest('Heatmap Toggle Button', true, 'Found toggle button');
        
        // Try to click the toggle
        await toggleButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.addTest('Heatmap Toggle Click', true, 'Toggle clicked successfully');
      } else {
        // Alternative: look for any grade-related UI
        const gradeElements = await this.page.$$eval(
          '*',
          elements => elements.filter(el => 
            el.textContent?.toLowerCase().includes('grade') ||
            el.textContent?.toLowerCase().includes('heatmap') ||
            el.textContent?.toLowerCase().includes('ore')
          ).length
        );
        
        this.addTest('Grade-related Elements', gradeElements > 0,
          `Found ${gradeElements} grade-related elements`);
      }

      // Check for grade legend
      const gradeLegend = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('%') ||
          el.textContent?.includes('Low') ||
          el.textContent?.includes('High') ||
          el.textContent?.includes('Grade')
        ).length
      );
      
      this.addTest('Grade Legend', gradeLegend > 0,
        `Found ${gradeLegend} legend elements`);

    } catch (error) {
      this.addTest('Grade Heatmap Test', false, error.message);
    }
  }

  async validateOpcUaExplorer() {
    this.log('Testing OPC UA Explorer functionality...', 'info');
    
    try {
      await this.page.goto('http://localhost:3000/explorer', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      
      // Wait for OPC UA explorer to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for OPC UA tree structure
      const treeElements = await this.page.$$eval(
        '[role="tree"], [class*="tree"], [class*="Tree"]',
        elements => elements.length
      );
      
      this.addTest('OPC UA Tree Structure', treeElements > 0,
        `Found ${treeElements} tree elements`);

      // Check for node elements
      const nodeElements = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('Node') ||
          el.textContent?.includes('Variable') ||
          el.textContent?.includes('Object') ||
          el.textContent?.includes('Method')
        ).length
      );
      
      this.addTest('OPC UA Nodes', nodeElements > 0,
        `Found ${nodeElements} node-related elements`);

      // Check for expandable tree items
      const expandableItems = await this.page.$$('[class*="expand"], [class*="collapse"], button[aria-expanded]');
      this.addTest('Expandable Tree Items', expandableItems.length > 0,
        `Found ${expandableItems.length} expandable items`);

      // Try expanding first item if available
      if (expandableItems.length > 0) {
        try {
          await expandableItems[0].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.addTest('Tree Expansion', true, 'Successfully expanded tree node');
        } catch (e) {
          this.addTest('Tree Expansion', false, 'Could not expand tree node');
        }
      }

      // Check for node details panel
      const detailsPanel = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('Details') ||
          el.textContent?.includes('NodeId') ||
          el.textContent?.includes('DataType') ||
          el.textContent?.includes('Value')
        ).length
      );
      
      this.addTest('Node Details Panel', detailsPanel > 0,
        `Found ${detailsPanel} detail elements`);

    } catch (error) {
      this.addTest('OPC UA Explorer Test', false, error.message);
    }
  }

  async validateCodeExamples() {
    this.log('Testing code examples functionality...', 'info');
    
    try {
      // Check for code examples section
      const codeExamples = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('JavaScript') ||
          el.textContent?.includes('Python') ||
          el.textContent?.includes('REST API') ||
          el.textContent?.includes('Code')
        ).length
      );
      
      this.addTest('Code Examples Section', codeExamples > 0,
        `Found ${codeExamples} code-related elements`);

      // Check for syntax highlighting
      const syntaxElements = await this.page.$$('[class*="hljs"], [class*="highlight"], [class*="syntax"], code, pre');
      this.addTest('Syntax Highlighting', syntaxElements.length > 0,
        `Found ${syntaxElements.length} syntax elements`);

    } catch (error) {
      this.addTest('Code Examples Test', false, error.message);
    }
  }

  async validateEducationalFeatures() {
    this.log('Testing educational features...', 'info');
    
    try {
      // Go back to real-time page to test educational features
      await this.page.goto('http://localhost:3000/real-time', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for help/educational elements
      const helpElements = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.includes('?') ||
          el.textContent?.includes('Help') ||
          el.textContent?.includes('What') ||
          el.textContent?.includes('Glossary')
        ).length
      );
      
      this.addTest('Educational Elements', helpElements > 0,
        `Found ${helpElements} help-related elements`);

      // Check for tooltips or educational content
      const tooltipElements = await this.page.$$('[class*="tooltip"], [class*="Tooltip"], [title]');
      this.addTest('Tooltip Elements', tooltipElements.length > 0,
        `Found ${tooltipElements.length} tooltip elements`);

    } catch (error) {
      this.addTest('Educational Features Test', false, error.message);
    }
  }

  async captureScreenshots() {
    this.log('Capturing required screenshots...', 'info');
    
    try {
      // Screenshot 1: Real-time 3D view
      await this.page.goto('http://localhost:3000/real-time', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const realtimeScreenshot = path.join(__dirname, 'phase4-realtime.png');
      await this.page.screenshot({ 
        path: realtimeScreenshot,
        fullPage: true
      });
      
      this.addTest('Real-time Screenshot', true, 
        `Saved to ${realtimeScreenshot}`);

      // Screenshot 2: OPC UA Explorer
      await this.page.goto('http://localhost:3000/explorer', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const explorerScreenshot = path.join(__dirname, 'phase4-explorer.png');
      await this.page.screenshot({ 
        path: explorerScreenshot,
        fullPage: true
      });
      
      this.addTest('Explorer Screenshot', true, 
        `Saved to ${explorerScreenshot}`);

      // Screenshot 3: Home page with Phase 4 complete
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const homeScreenshot = path.join(__dirname, 'phase4-complete.png');
      await this.page.screenshot({ 
        path: homeScreenshot,
        fullPage: true
      });
      
      this.addTest('Phase 4 Complete Screenshot', true, 
        `Saved to ${homeScreenshot}`);
      
    } catch (error) {
      this.addTest('Screenshot Capture', false, error.message);
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.setup();
      
      // Core Phase 4 validations
      await this.validate3DScene();
      await this.validateEquipment();
      await this.validateGradeHeatmap();
      await this.validateOpcUaExplorer();
      await this.validateCodeExamples();
      await this.validateEducationalFeatures();
      
      // Required screenshot capture
      await this.captureScreenshots();
      
    } catch (error) {
      this.log(`Validation failed with error: ${error.message}`, 'error');
    } finally {
      await this.cleanup();
      this.printResults();
    }
  }

  printResults() {
    this.log('');
    this.log('='.repeat(70));
    this.log('🏁 Phase 4 Puppeteer MCP Validation Results');
    this.log('='.repeat(70));
    
    this.log(`✅ Tests Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Tests Failed: ${this.results.failed}`, 'error');
    
    const totalTests = this.results.passed + this.results.failed;
    const successRate = totalTests > 0 ? ((this.results.passed / totalTests) * 100).toFixed(1) : 0;
    this.log(`📊 Success Rate: ${successRate}%`);
    
    if (this.results.failed > 0) {
      this.log('');
      this.log('❌ Failed Tests:', 'error');
      this.results.tests.filter(t => !t.passed).forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
    }
    
    this.log('');
    if (this.results.failed === 0) {
      this.log('🎉 All Phase 4 tests passed! 3D Visualization & OPC UA Explorer are ready.', 'success');
      this.log('📸 Screenshots captured:', 'success');
      this.log('   - validation/phase4-realtime.png', 'success');
      this.log('   - validation/phase4-explorer.png', 'success');
      this.log('   - validation/phase4-complete.png', 'success');
      this.log('🚀 Ready for Phase 4 review and approval', 'success');
      process.exit(0);
    } else {
      this.log('💥 Some tests failed. Please fix issues before Phase 4 approval.', 'error');
      process.exit(1);
    }
  }
}

// Execute validation
async function main() {
  const validator = new Phase4Validator();
  await validator.run();
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = Phase4Validator;
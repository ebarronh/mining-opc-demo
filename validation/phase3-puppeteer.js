/**
 * Phase 3 Puppeteer MCP Validation Script
 * MineSensors OPC UA Mining Demo - Frontend Foundations Validation
 * 
 * PRD Requirement: "Navigate to `/`, verify header text, take screenshot `phase3-shell.png`"
 * 
 * This script validates Phase 3 deliverables:
 * 1. Navigation shell with tabs (Real-time, Explorer, Integration, Compliance)
 * 2. Live system status integration
 * 3. WebSocket connection status
 * 4. Enhanced placeholder pages
 * 5. Executive-ready UI quality
 */

const puppeteer = require('puppeteer');
const path = require('path');

class Phase3Validator {
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
    this.log('🚀 Starting Phase 3 Puppeteer MCP Validation');
    this.log('='.repeat(70));

    // Test connection first
    this.log('Testing server connectivity...', 'info');
    try {
      const http = require('http');
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000', (res) => {
          this.log(`Server responded with status: ${res.statusCode}`, 'success');
          resolve();
        });
        req.on('error', (err) => {
          this.log(`Server connection test failed: ${err.message}`, 'error');
          reject(err);
        });
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Connection timeout'));
        });
      });
    } catch (error) {
      this.log(`Cannot connect to server: ${error.message}`, 'error');
      this.log('Please ensure frontend server is running on http://localhost:3000', 'warning');
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async validateNavigation() {
    this.log('Testing navigation to home page...', 'info');
    
    try {
      // Add extra wait and retry logic
      this.log('Attempting to connect to http://localhost:3000...', 'info');
      
      // First, try to navigate with more lenient settings
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      
      // Wait a bit more for the page to fully load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // PRD Requirement: Verify header text
      const headerText = await this.page.$eval('h1', el => el.textContent);
      const hasCorrectHeader = headerText.includes('MineSensors OPC UA');
      this.addTest('Header Text Verification', hasCorrectHeader, 
        `Found: "${headerText}"`);
      
      // Test navigation tabs presence
      const tabTexts = await this.page.$$eval('[role="tablist"] a, nav a', 
        elements => elements.map(el => el.textContent?.trim()).filter(Boolean)
      );
      
      const expectedTabs = ['Real-time Monitor', 'OPC UA Explorer', 'Integration Hub', 'Compliance'];
      const hasAllTabs = expectedTabs.every(tab => 
        tabTexts.some(text => text.includes(tab.split(' ')[0]))
      );
      
      this.addTest('Navigation Tabs Present', hasAllTabs, 
        `Found tabs: ${tabTexts.join(', ')}`);

    } catch (error) {
      this.addTest('Navigation Test', false, error.message);
    }
  }

  async validateSystemStatus() {
    this.log('Testing system status integration...', 'info');
    
    try {
      // Look for system status section
      const statusSection = await this.page.$('[class*="status"], [class*="Status"]');
      const hasStatusSection = statusSection !== null;
      this.addTest('System Status Section', hasStatusSection, 
        hasStatusSection ? 'Found status component' : 'Status section not found');
      
      // Check for status indicators
      const statusIndicators = await this.page.$$eval(
        '[class*="bg-green"], [class*="bg-yellow"], [class*="bg-red"]',
        elements => elements.length
      );
      
      this.addTest('Status Indicators Present', statusIndicators > 0, 
        `Found ${statusIndicators} status indicators`);
      
      // Wait for potential API calls to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      this.addTest('System Status Test', false, error.message);
    }
  }

  async validateWebSocketStatus() {
    this.log('Testing WebSocket status display...', 'info');
    
    try {
      // Look for WebSocket status elements
      const wsElements = await this.page.$$eval(
        '*',
        elements => elements.filter(el => 
          el.textContent?.toLowerCase().includes('websocket') ||
          el.textContent?.toLowerCase().includes('connection')
        ).length
      );
      
      this.addTest('WebSocket Status Display', wsElements > 0,
        `Found ${wsElements} WebSocket-related elements`);
      
    } catch (error) {
      this.addTest('WebSocket Status Test', false, error.message);
    }
  }

  async validateTabNavigation() {
    this.log('Testing tab navigation...', 'info');
    
    const testTabs = [
      { path: '/real-time', name: 'Real-time Monitor' },
      { path: '/explorer', name: 'OPC UA Explorer' },
      { path: '/integration', name: 'Integration Hub' },
      { path: '/compliance', name: 'Compliance' }
    ];

    for (const tab of testTabs) {
      try {
        await this.page.goto(`http://localhost:3000${tab.path}`, { 
          waitUntil: 'networkidle2',
          timeout: 8000 
        });
        
        // Check if page loaded successfully
        const pageTitle = await this.page.$eval('h1', el => el.textContent);
        const hasCorrectTitle = pageTitle.includes(tab.name) || 
                               pageTitle.includes(tab.name.split(' ')[0]);
        
        this.addTest(`${tab.name} Page Navigation`, hasCorrectTitle,
          `Page title: "${pageTitle}"`);
        
        // Check for "Coming in Phase X" indicators
        const phaseIndicators = await this.page.$$eval(
          '*',
          elements => elements.filter(el => 
            el.textContent?.includes('Coming in Phase') ||
            el.textContent?.includes('Phase 4') ||
            el.textContent?.includes('Phase 5')
          ).length
        );
        
        this.addTest(`${tab.name} Phase Indicators`, phaseIndicators > 0,
          `Found ${phaseIndicators} phase indicators`);
        
      } catch (error) {
        this.addTest(`${tab.name} Navigation`, false, error.message);
      }
    }
  }

  async validateUIQuality() {
    this.log('Testing UI quality and design...', 'info');
    
    try {
      // Go back to home page for screenshot
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      // Check for dark theme classes
      const darkThemeElements = await this.page.$$eval(
        '[class*="slate"], [class*="dark"]',
        elements => elements.length
      );
      
      this.addTest('Dark Theme Implementation', darkThemeElements > 0,
        `Found ${darkThemeElements} dark theme elements`);
      
      // Check for animations/transitions
      const animatedElements = await this.page.$$eval(
        '[class*="animate"], [class*="transition"]',
        elements => elements.length
      );
      
      this.addTest('Animations/Transitions', animatedElements > 0,
        `Found ${animatedElements} animated elements`);
      
      // Check for proper spacing and layout
      const layoutElements = await this.page.$$eval(
        '[class*="grid"], [class*="flex"], [class*="space"]',
        elements => elements.length
      );
      
      this.addTest('Layout System', layoutElements > 10,
        `Found ${layoutElements} layout elements`);

    } catch (error) {
      this.addTest('UI Quality Test', false, error.message);
    }
  }

  async captureScreenshot() {
    this.log('Capturing required screenshot...', 'info');
    
    try {
      // Navigate to home page for screenshot
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // PRD Requirement: Capture phase3-shell.png
      const screenshotPath = path.join(__dirname, 'phase3-shell.png');
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: true
      });
      
      this.addTest('Screenshot Capture', true, 
        `Saved to ${screenshotPath}`);
      
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
      
      // Core Phase 3 validations
      await this.validateNavigation();
      await this.validateSystemStatus();
      await this.validateWebSocketStatus();
      await this.validateTabNavigation();
      await this.validateUIQuality();
      
      // Required screenshot capture
      await this.captureScreenshot();
      
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
    this.log('🏁 Phase 3 Puppeteer MCP Validation Results');
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
      this.log('🎉 All Phase 3 tests passed! Frontend foundations are ready.', 'success');
      this.log('📸 Screenshot captured: validation/phase3-shell.png', 'success');
      this.log('🚀 Ready for Phase 3 review and approval', 'success');
      process.exit(0);
    } else {
      this.log('💥 Some tests failed. Please fix issues before Phase 3 approval.', 'error');
      process.exit(1);
    }
  }
}

// Execute validation
async function main() {
  const validator = new Phase3Validator();
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

module.exports = Phase3Validator;
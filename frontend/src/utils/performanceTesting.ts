'use client';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderCalls: number;
  triangles: number;
  timestamp: number;
}

export interface PerformanceTestResult {
  testName: string;
  duration: number;
  metrics: PerformanceMetrics[];
  averages: {
    avgFPS: number;
    avgFrameTime: number;
    minFPS: number;
    maxFPS: number;
    avgMemory: number;
    avgRenderCalls: number;
  };
  passed: boolean;
  issues: string[];
}

export interface PerformanceTestConfig {
  name: string;
  duration: number; // Test duration in milliseconds
  targetFPS: number; // Minimum acceptable FPS
  maxFrameTime: number; // Maximum acceptable frame time in ms
  maxMemoryIncrease: number; // Maximum memory increase in MB
  sampleInterval: number; // How often to sample metrics in ms
}

export class PerformanceTestRunner {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private isRunning: boolean = false;
  private sampleInterval: NodeJS.Timeout | null = null;
  private gl: WebGLRenderingContext | null = null;

  constructor(gl?: WebGLRenderingContext) {
    this.gl = gl || null;
  }

  // Set WebGL context for render metrics
  setWebGLContext(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  // Collect current performance metrics
  private collectMetrics(): PerformanceMetrics {
    const now = performance.now();
    
    // Calculate FPS from recent frame times
    const recentMetrics = this.metrics.slice(-10);
    let fps = 60; // Default assumption
    let frameTime = 16.67; // Default for 60fps
    
    if (recentMetrics.length > 1) {
      const timeDiffs = recentMetrics.slice(1).map((metric, i) => 
        metric.timestamp - recentMetrics[i].timestamp
      );
      const avgTimeDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
      frameTime = avgTimeDiff;
      fps = avgTimeDiff > 0 ? 1000 / avgTimeDiff : 60;
    }

    // Get memory usage if available
    let memoryUsage = 0;
    if ('memory' in performance && (performance as any).memory) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    // Get render metrics from WebGL
    let renderCalls = 0;
    let triangles = 0;
    if (this.gl && (this.gl as any).info) {
      const info = (this.gl as any).info.render;
      renderCalls = info.calls || 0;
      triangles = info.triangles || 0;
    }

    return {
      fps: Math.round(fps),
      frameTime: Math.round(frameTime * 100) / 100,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      renderCalls,
      triangles,
      timestamp: now
    };
  }

  // Start performance test
  async startTest(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    if (this.isRunning) {
      throw new Error('Performance test already running');
    }

    console.log(`🔬 Starting performance test: ${config.name}`);
    
    this.isRunning = true;
    this.metrics = [];
    this.startTime = performance.now();

    // Collect initial baseline metric
    this.metrics.push(this.collectMetrics());

    // Set up sampling interval
    this.sampleInterval = setInterval(() => {
      if (this.isRunning) {
        this.metrics.push(this.collectMetrics());
      }
    }, config.sampleInterval);

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, config.duration));

    // Stop test
    this.stopTest();

    // Analyze results
    return this.analyzeResults(config);
  }

  // Stop the current test
  stopTest() {
    this.isRunning = false;
    if (this.sampleInterval) {
      clearInterval(this.sampleInterval);
      this.sampleInterval = null;
    }
  }

  // Analyze test results
  private analyzeResults(config: PerformanceTestConfig): PerformanceTestResult {
    if (this.metrics.length < 2) {
      throw new Error('Insufficient metrics collected for analysis');
    }

    const fps = this.metrics.map(m => m.fps);
    const frameTimes = this.metrics.map(m => m.frameTime);
    const memoryUsages = this.metrics.map(m => m.memoryUsage);
    const renderCalls = this.metrics.map(m => m.renderCalls);

    const averages = {
      avgFPS: this.average(fps),
      avgFrameTime: this.average(frameTimes),
      minFPS: Math.min(...fps),
      maxFPS: Math.max(...fps),
      avgMemory: this.average(memoryUsages),
      avgRenderCalls: this.average(renderCalls)
    };

    // Detect performance issues
    const issues: string[] = [];
    let passed = true;

    // Check FPS requirements
    if (averages.avgFPS < config.targetFPS) {
      issues.push(`Average FPS (${averages.avgFPS.toFixed(1)}) below target (${config.targetFPS})`);
      passed = false;
    }

    if (averages.minFPS < config.targetFPS * 0.8) {
      issues.push(`Minimum FPS (${averages.minFPS}) critically low`);
      passed = false;
    }

    // Check frame time
    if (averages.avgFrameTime > config.maxFrameTime) {
      issues.push(`Average frame time (${averages.avgFrameTime.toFixed(2)}ms) exceeds limit (${config.maxFrameTime}ms)`);
      passed = false;
    }

    // Check memory usage increase
    const initialMemory = this.metrics[0].memoryUsage;
    const finalMemory = this.metrics[this.metrics.length - 1].memoryUsage;
    const memoryIncrease = finalMemory - initialMemory;

    if (memoryIncrease > config.maxMemoryIncrease) {
      issues.push(`Memory usage increased by ${memoryIncrease.toFixed(2)}MB (limit: ${config.maxMemoryIncrease}MB)`);
      passed = false;
    }

    // Check for frame time spikes
    const frameTimeSpikes = frameTimes.filter(ft => ft > config.maxFrameTime * 2);
    if (frameTimeSpikes.length > frameTimes.length * 0.05) { // More than 5% spikes
      issues.push(`Too many frame time spikes detected (${frameTimeSpikes.length})`);
      passed = false;
    }

    // Check FPS stability
    const fpsVariance = this.variance(fps);
    if (fpsVariance > 100) { // High variance indicates unstable framerate
      issues.push(`Unstable framerate detected (variance: ${fpsVariance.toFixed(2)})`);
      passed = false;
    }

    const result: PerformanceTestResult = {
      testName: config.name,
      duration: performance.now() - this.startTime,
      metrics: [...this.metrics],
      averages,
      passed,
      issues
    };

    // Log results
    console.log(`📊 Performance test "${config.name}" ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Average FPS: ${averages.avgFPS.toFixed(1)} (min: ${averages.minFPS}, max: ${averages.maxFPS})`);
    console.log(`   Average frame time: ${averages.avgFrameTime.toFixed(2)}ms`);
    console.log(`   Memory usage: ${averages.avgMemory.toFixed(2)}MB`);
    
    if (!passed) {
      console.log(`   Issues: ${issues.join(', ')}`);
    }

    return result;
  }

  // Utility functions
  private average(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private variance(values: number[]): number {
    const avg = this.average(values);
    const squaredDiffs = values.map(value => Math.pow(value - avg, 2));
    return this.average(squaredDiffs);
  }

  // Get current metrics (for real-time monitoring)
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  // Check if test is currently running
  isTestRunning(): boolean {
    return this.isRunning;
  }
}

// Predefined test configurations
export const PERFORMANCE_TEST_CONFIGS: Record<string, PerformanceTestConfig> = {
  // Test for Intel UHD 620 compatibility
  LOW_END_GRAPHICS: {
    name: 'Low-end Graphics Compatibility',
    duration: 30000, // 30 seconds
    targetFPS: 30,
    maxFrameTime: 33.33, // 30 FPS = 33.33ms per frame
    maxMemoryIncrease: 50, // 50MB
    sampleInterval: 100
  },

  // Test with many equipment pieces
  HIGH_EQUIPMENT_COUNT: {
    name: 'High Equipment Count (1000+ nodes)',
    duration: 60000, // 1 minute
    targetFPS: 30,
    maxFrameTime: 35,
    maxMemoryIncrease: 100,
    sampleInterval: 200
  },

  // Test initial load performance
  INITIAL_LOAD: {
    name: 'Initial Load Performance',
    duration: 10000, // 10 seconds
    targetFPS: 30,
    maxFrameTime: 50, // Allow higher frame times during loading
    maxMemoryIncrease: 30,
    sampleInterval: 100
  },

  // Test WebSocket reconnection handling
  WEBSOCKET_STRESS: {
    name: 'WebSocket Reconnection Stress',
    duration: 45000, // 45 seconds
    targetFPS: 25, // Slightly lower target during network stress
    maxFrameTime: 40,
    maxMemoryIncrease: 25,
    sampleInterval: 150
  },

  // Test real-time data updates
  REALTIME_UPDATES: {
    name: 'Real-time Data Updates',
    duration: 20000, // 20 seconds
    targetFPS: 30,
    maxFrameTime: 33.33,
    maxMemoryIncrease: 20,
    sampleInterval: 100
  }
};

// Performance test suite runner
export class PerformanceTestSuite {
  private runner: PerformanceTestRunner;
  private results: PerformanceTestResult[] = [];

  constructor(gl?: WebGLRenderingContext) {
    this.runner = new PerformanceTestRunner(gl);
  }

  // Run all predefined tests
  async runAllTests(): Promise<PerformanceTestResult[]> {
    console.log('🧪 Starting comprehensive performance test suite...');
    
    this.results = [];
    
    for (const [key, config] of Object.entries(PERFORMANCE_TEST_CONFIGS)) {
      try {
        const result = await this.runner.startTest(config);
        this.results.push(result);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to run test ${config.name}:`, error);
      }
    }

    this.generateSummaryReport();
    return this.results;
  }

  // Run specific test
  async runTest(testName: keyof typeof PERFORMANCE_TEST_CONFIGS): Promise<PerformanceTestResult> {
    const config = PERFORMANCE_TEST_CONFIGS[testName];
    if (!config) {
      throw new Error(`Unknown test: ${testName}`);
    }

    return this.runner.startTest(config);
  }

  // Generate summary report
  private generateSummaryReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n📈 PERFORMANCE TEST SUITE SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.testName}: ${result.issues.join(', ')}`);
      });
    }

    // Overall recommendations
    console.log('\n💡 Recommendations:');
    if (failedTests === 0) {
      console.log('  • All tests passed! Performance is excellent.');
    } else {
      console.log('  • Consider optimizing areas where tests failed');
      console.log('  • Review LOD settings and culling configuration');
      console.log('  • Check for memory leaks in failed tests');
    }
  }

  // Get test results
  getResults(): PerformanceTestResult[] {
    return [...this.results];
  }

  // Export results as JSON
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.length,
        passedTests: this.results.filter(r => r.passed).length,
        failedTests: this.results.filter(r => !r.passed).length
      },
      results: this.results
    }, null, 2);
  }
}
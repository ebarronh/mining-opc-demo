'use client';

import { useState, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { 
  Play, 
  Square, 
  Download, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { 
  PerformanceTestSuite, 
  PerformanceTestResult, 
  PERFORMANCE_TEST_CONFIGS,
  PerformanceTestRunner
} from '@/utils/performanceTesting';

interface PerformanceTestPanelProps {
  className?: string;
}

export function PerformanceTestPanel({ className = '' }: PerformanceTestPanelProps) {
  const { gl } = useThree();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [results, setResults] = useState<PerformanceTestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const testSuiteRef = useRef<PerformanceTestSuite | null>(null);
  const runnerRef = useRef<PerformanceTestRunner | null>(null);

  // Initialize test suite
  const getTestSuite = useCallback(() => {
    if (!testSuiteRef.current) {
      testSuiteRef.current = new PerformanceTestSuite(gl);
    }
    return testSuiteRef.current;
  }, [gl]);

  // Initialize test runner
  const getTestRunner = useCallback(() => {
    if (!runnerRef.current) {
      runnerRef.current = new PerformanceTestRunner(gl);
    }
    return runnerRef.current;
  }, [gl]);

  // Run all performance tests
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setCurrentTest(null);

    try {
      const testSuite = getTestSuite();
      const testConfigs = Object.entries(PERFORMANCE_TEST_CONFIGS);
      
      for (let i = 0; i < testConfigs.length; i++) {
        const [key, config] = testConfigs[i];
        setCurrentTest(config.name);
        setProgress((i / testConfigs.length) * 100);
        
        const result = await testSuite.runTest(key as keyof typeof PERFORMANCE_TEST_CONFIGS);
        setResults(prev => [...prev, result]);
      }
      
      setProgress(100);
      setCurrentTest(null);
    } catch (error) {
      console.error('Performance test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [getTestSuite]);

  // Run individual test
  const runSingleTest = useCallback(async (testKey: keyof typeof PERFORMANCE_TEST_CONFIGS) => {
    setIsRunning(true);
    setCurrentTest(PERFORMANCE_TEST_CONFIGS[testKey].name);

    try {
      const testSuite = getTestSuite();
      const result = await testSuite.runTest(testKey);
      setResults(prev => [...prev, result]);
    } catch (error) {
      console.error(`Performance test ${testKey} failed:`, error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  }, [getTestSuite]);

  // Stop current test
  const stopTest = useCallback(() => {
    const runner = getTestRunner();
    runner.stopTest();
    setIsRunning(false);
    setCurrentTest(null);
    setProgress(0);
  }, [getTestRunner]);

  // Export results
  const exportResults = useCallback(() => {
    const testSuite = getTestSuite();
    const exportData = testSuite.exportResults();
    
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-test-results-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getTestSuite]);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
    setProgress(0);
  }, []);

  // Calculate summary statistics
  const summary = {
    totalTests: results.length,
    passedTests: results.filter(r => r.passed).length,
    failedTests: results.filter(r => !r.passed).length,
    avgFPS: results.length > 0 ? results.reduce((sum, r) => sum + r.averages.avgFPS, 0) / results.length : 0,
    avgFrameTime: results.length > 0 ? results.reduce((sum, r) => sum + r.averages.avgFrameTime, 0) / results.length : 0
  };

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Performance Testing</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isRunning ? (
            <>
              <button
                onClick={runAllTests}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Run All Tests</span>
              </button>
              
              {results.length > 0 && (
                <>
                  <button
                    onClick={exportResults}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  
                  <button
                    onClick={clearResults}
                    className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm"
                  >
                    Clear
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={stopTest}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Test Progress */}
      {isRunning && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white">
              {currentTest || 'Preparing tests...'}
            </span>
            <span className="text-sm text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total Tests</span>
            </div>
            <div className="text-lg font-semibold text-white">{summary.totalTests}</div>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Passed</span>
            </div>
            <div className="text-lg font-semibold text-green-400">{summary.passedTests}</div>
          </div>
          
          <div className="bg-red-500/10 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400">Failed</span>
            </div>
            <div className="text-lg font-semibold text-red-400">{summary.failedTests}</div>
          </div>
          
          <div className="bg-purple-500/10 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Avg FPS</span>
            </div>
            <div className="text-lg font-semibold text-purple-400">
              {summary.avgFPS.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Individual Test Configs */}
      {!isRunning && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2">Individual Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(PERFORMANCE_TEST_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => runSingleTest(key as keyof typeof PERFORMANCE_TEST_CONFIGS)}
                className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="text-sm font-medium text-white">{config.name}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {config.duration / 1000}s • {config.targetFPS} FPS target
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Test Results</h4>
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.passed 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-white">{result.testName}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {(result.duration / 1000).toFixed(1)}s
                  </span>
                  <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                    {result.averages.avgFPS.toFixed(1)} FPS avg
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Min FPS:</span>
                  <span className="text-white ml-1">{result.averages.minFPS}</span>
                </div>
                <div>
                  <span className="text-slate-400">Max FPS:</span>
                  <span className="text-white ml-1">{result.averages.maxFPS}</span>
                </div>
                <div>
                  <span className="text-slate-400">Frame Time:</span>
                  <span className="text-white ml-1">{result.averages.avgFrameTime.toFixed(2)}ms</span>
                </div>
                <div>
                  <span className="text-slate-400">Memory:</span>
                  <span className="text-white ml-1">{result.averages.avgMemory.toFixed(1)}MB</span>
                </div>
              </div>
              
              {result.issues.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-300">
                      <div className="font-medium mb-1">Issues:</div>
                      <ul className="space-y-1">
                        {result.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {results.length === 0 && !isRunning && (
        <div className="text-center py-6 text-slate-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Run performance tests to evaluate 3D rendering efficiency</p>
          <p className="text-xs mt-1">Tests verify Intel UHD 620 compatibility and 30 FPS targets</p>
        </div>
      )}
    </div>
  );
}
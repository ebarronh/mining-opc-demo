'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

// Type definitions for flow scenarios
interface FlowScenario {
  id: string;
  name: string;
  description: string;
  upwardFlow: FlowStep[];
  downwardFlow: FlowStep[];
  trigger: string;
  outcome: string;
}

interface FlowStep {
  level: number;
  levelName: string;
  action: string;
  data: string;
  timing: number; // milliseconds from start
  duration: number; // how long this step takes
  color: string;
}

// Mining-specific bi-directional flow scenarios
const FLOW_SCENARIOS: FlowScenario[] = [
  {
    id: 'ore-grade-alert',
    name: 'High-Grade Ore Detection',
    description: 'XRF sensor detects premium ore, triggering automatic routing adjustments',
    trigger: 'High-grade ore detected (Fe: 68.5%)',
    outcome: 'Trucks automatically routed to premium stockpile',
    upwardFlow: [
      {
        level: 0,
        levelName: 'Field Sensors',
        action: 'XRF Detection',
        data: 'Fe: 68.5%, Grade: Premium',
        timing: 0,
        duration: 500,
        color: 'text-red-400'
      },
      {
        level: 1,
        levelName: 'Control Systems',
        action: 'Quality Validation',
        data: 'Grade confirmed, Alert raised',
        timing: 500,
        duration: 800,
        color: 'text-orange-400'
      },
      {
        level: 2,
        levelName: 'SCADA',
        action: 'Process Monitoring',
        data: 'High-grade alert displayed',
        timing: 1300,
        duration: 700,
        color: 'text-yellow-400'
      },
      {
        level: 3,
        levelName: 'MES',
        action: 'Routing Decision',
        data: 'Calculate optimal stockpile',
        timing: 2000,
        duration: 1200,
        color: 'text-green-400'
      }
    ],
    downwardFlow: [
      {
        level: 3,
        levelName: 'MES',
        action: 'Dispatch Command',
        data: 'Route to Stockpile A-Premium',
        timing: 3200,
        duration: 800,
        color: 'text-green-400'
      },
      {
        level: 2,
        levelName: 'SCADA',
        action: 'Route Update',
        data: 'Display new truck routes',
        timing: 4000,
        duration: 600,
        color: 'text-yellow-400'
      },
      {
        level: 1,
        levelName: 'Control Systems',
        action: 'Execute Routing',
        data: 'Update truck dispatch system',
        timing: 4600,
        duration: 900,
        color: 'text-orange-400'
      },
      {
        level: 0,
        levelName: 'Field Equipment',
        action: 'Route Adjustment',
        data: 'Trucks receive new destinations',
        timing: 5500,
        duration: 1000,
        color: 'text-red-400'
      }
    ]
  },
  {
    id: 'equipment-maintenance',
    name: 'Predictive Maintenance Alert',
    description: 'AI predicts equipment failure, triggering preventive maintenance workflow',
    trigger: 'Excavator vibration exceeds threshold',
    outcome: 'Maintenance scheduled, backup equipment deployed',
    upwardFlow: [
      {
        level: 0,
        levelName: 'Equipment Sensors',
        action: 'Vibration Detected',
        data: 'Excavator EX-001: 8.5Hz vibration',
        timing: 0,
        duration: 300,
        color: 'text-red-400'
      },
      {
        level: 1,
        levelName: 'Edge Analytics',
        action: 'Pattern Analysis',
        data: 'Anomaly detected, ML confidence: 89%',
        timing: 300,
        duration: 1200,
        color: 'text-orange-400'
      },
      {
        level: 2,
        levelName: 'SCADA',
        action: 'Alert Generation',
        data: 'Maintenance alert logged',
        timing: 1500,
        duration: 400,
        color: 'text-yellow-400'
      },
      {
        level: 3,
        levelName: 'CMMS',
        action: 'Work Order Creation',
        data: 'Auto-generate maintenance ticket',
        timing: 1900,
        duration: 1500,
        color: 'text-green-400'
      },
      {
        level: 4,
        levelName: 'ERP',
        action: 'Resource Planning',
        data: 'Schedule technician, order parts',
        timing: 3400,
        duration: 2000,
        color: 'text-blue-400'
      }
    ],
    downwardFlow: [
      {
        level: 4,
        levelName: 'ERP',
        action: 'Deployment Order',
        data: 'Deploy backup EX-002',
        timing: 5400,
        duration: 800,
        color: 'text-blue-400'
      },
      {
        level: 3,
        levelName: 'MES',
        action: 'Production Replan',
        data: 'Adjust production schedule',
        timing: 6200,
        duration: 1000,
        color: 'text-green-400'
      },
      {
        level: 2,
        levelName: 'SCADA',
        action: 'Status Update',
        data: 'Display equipment swap',
        timing: 7200,
        duration: 500,
        color: 'text-yellow-400'
      },
      {
        level: 1,
        levelName: 'Fleet Control',
        action: 'Equipment Switch',
        data: 'Activate backup excavator',
        timing: 7700,
        duration: 800,
        color: 'text-orange-400'
      },
      {
        level: 0,
        levelName: 'Field Operations',
        action: 'Equipment Swap',
        data: 'EX-002 operational, EX-001 shutdown',
        timing: 8500,
        duration: 1200,
        color: 'text-red-400'
      }
    ]
  },
  {
    id: 'safety-shutdown',
    name: 'Emergency Safety Response',
    description: 'Gas leak detected, triggering immediate area evacuation and equipment shutdown',
    trigger: 'Methane gas detected: 2.1% LEL',
    outcome: 'Area evacuated, equipment safely shutdown',
    upwardFlow: [
      {
        level: 0,
        levelName: 'Gas Detectors',
        action: 'Gas Detection',
        data: 'CH4: 2.1% LEL, Location: Tunnel B',
        timing: 0,
        duration: 200,
        color: 'text-red-400'
      },
      {
        level: 1,
        levelName: 'Safety Systems',
        action: 'Critical Alert',
        data: 'Emergency level threshold exceeded',
        timing: 200,
        duration: 300,
        color: 'text-orange-400'
      },
      {
        level: 2,
        levelName: 'Control Room',
        action: 'Emergency Protocol',
        data: 'Activate evacuation procedures',
        timing: 500,
        duration: 400,
        color: 'text-yellow-400'
      }
    ],
    downwardFlow: [
      {
        level: 2,
        levelName: 'Control Room',
        action: 'Shutdown Command',
        data: 'Emergency shutdown sequence',
        timing: 900,
        duration: 200,
        color: 'text-yellow-400'
      },
      {
        level: 1,
        levelName: 'Safety Interlocks',
        action: 'Equipment Lockout',
        data: 'Cut power to Tunnel B equipment',
        timing: 1100,
        duration: 500,
        color: 'text-orange-400'
      },
      {
        level: 0,
        levelName: 'Field Equipment',
        action: 'Safe Shutdown',
        data: 'All equipment stopped, area secured',
        timing: 1600,
        duration: 800,
        color: 'text-red-400'
      }
    ]
  }
];

interface BiDirectionalFlowProps {
  className?: string;
  selectedScenario?: string;
  autoStart?: boolean;
  onFlowComplete?: (scenarioId: string) => void;
}

export const BiDirectionalFlow: React.FC<BiDirectionalFlowProps> = ({
  className = '',
  selectedScenario,
  autoStart = false,
  onFlowComplete
}) => {
  const [currentScenario, setCurrentScenario] = useState<FlowScenario>(
    FLOW_SCENARIOS.find(s => s.id === selectedScenario) || FLOW_SCENARIOS[0]
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [activeFlow, setActiveFlow] = useState<'upward' | 'downward' | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const resetAnimation = useCallback(() => {
    setCurrentStep(-1);
    setActiveFlow(null);
    setCompletedSteps(new Set());
    setIsAnimating(false);
  }, []);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    resetAnimation();
    setIsAnimating(true);
    
    // Start the animation sequence
    animateFlow();
  }, [isAnimating, currentScenario, animationSpeed]);

  const animateFlow = useCallback(async () => {
    const allSteps = [
      ...currentScenario.upwardFlow.map(step => ({ ...step, direction: 'upward' as const })),
      ...currentScenario.downwardFlow.map(step => ({ ...step, direction: 'downward' as const }))
    ].sort((a, b) => a.timing - b.timing);

    setActiveFlow('upward');
    
    for (let i = 0; i < allSteps.length; i++) {
      const step = allSteps[i];
      const previousStep = allSteps[i - 1];
      
      // Wait for the appropriate timing
      const delay = previousStep 
        ? (step.timing - previousStep.timing) / animationSpeed
        : step.timing / animationSpeed;
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Update active flow direction
      if (step.direction !== activeFlow) {
        setActiveFlow(step.direction);
      }
      
      setCurrentStep(i);
      
      // Mark step as active, then complete after duration
      await new Promise(resolve => setTimeout(resolve, step.duration / animationSpeed));
      setCompletedSteps(prev => new Set([...prev, `${step.direction}-${step.level}-${i}`]));
    }
    
    setIsAnimating(false);
    setActiveFlow(null);
    onFlowComplete?.(currentScenario.id);
  }, [currentScenario, animationSpeed, activeFlow, onFlowComplete]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
  }, [autoStart, startAnimation]);

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = FLOW_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenario);
      resetAnimation();
    }
  };

  const getStepStatus = (step: FlowStep, stepIndex: number, direction: 'upward' | 'downward') => {
    const stepKey = `${direction}-${step.level}-${stepIndex}`;
    if (completedSteps.has(stepKey)) return 'completed';
    
    const allSteps = [
      ...currentScenario.upwardFlow.map(s => ({ ...s, direction: 'upward' as const })),
      ...currentScenario.downwardFlow.map(s => ({ ...s, direction: 'downward' as const }))
    ].sort((a, b) => a.timing - b.timing);
    
    const globalStepIndex = allSteps.findIndex(s => 
      s.level === step.level && s.direction === direction && s.timing === step.timing
    );
    
    if (globalStepIndex === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Bi-Directional Data Flow</span>
          </h3>
          <p className="text-sm text-slate-400">
            See how data and commands flow both up and down the ISA-95 hierarchy
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400">Speed:</label>
            <select 
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsAnimating(false)}
              disabled={!isAnimating}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
            
            <button
              onClick={resetAnimation}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Flow Scenario:</label>
        <select
          value={currentScenario.id}
          onChange={(e) => handleScenarioChange(e.target.value)}
          disabled={isAnimating}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          {FLOW_SCENARIOS.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-400">{currentScenario.description}</p>
      </div>

      {/* Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upward Flow */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <ArrowUp className={`w-5 h-5 transition-colors ${
              activeFlow === 'upward' ? 'text-green-400 animate-pulse' : 'text-slate-500'
            }`} />
            <h4 className="font-medium text-white">Data Collection & Analysis</h4>
            <span className="text-xs text-slate-500">(Bottom → Top)</span>
          </div>
          
          <div className="space-y-3">
            {currentScenario.upwardFlow.map((step, index) => {
              const status = getStepStatus(step, index, 'upward');
              
              return (
                <div
                  key={`upward-${index}`}
                  className={`
                    border-2 rounded-lg p-3 transition-all duration-500
                    ${status === 'active' ? 'border-green-400 bg-green-500/10 scale-105' : ''}
                    ${status === 'completed' ? 'border-green-600 bg-green-500/5' : 'border-slate-600'}
                    ${status === 'pending' ? 'opacity-50' : 'opacity-100'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                        ${status === 'active' ? 'bg-green-400 text-black animate-pulse' : ''}
                        ${status === 'pending' ? 'bg-slate-600 text-slate-400' : ''}
                      `}>
                        {status === 'completed' ? <CheckCircle className="w-3 h-3" /> : step.level}
                      </div>
                      <span className="font-medium text-white text-sm">{step.levelName}</span>
                    </div>
                    
                    {status === 'active' && (
                      <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
                    )}
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className="text-slate-300">
                      <span className="font-medium">Action:</span> {step.action}
                    </div>
                    <div className={`font-mono ${step.color}`}>
                      {step.data}
                    </div>
                    <div className="text-slate-500">
                      {step.timing}ms • {step.duration}ms duration
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downward Flow */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <ArrowDown className={`w-5 h-5 transition-colors ${
              activeFlow === 'downward' ? 'text-blue-400 animate-pulse' : 'text-slate-500'
            }`} />
            <h4 className="font-medium text-white">Control & Commands</h4>
            <span className="text-xs text-slate-500">(Top → Bottom)</span>
          </div>
          
          <div className="space-y-3">
            {currentScenario.downwardFlow.map((step, index) => {
              const status = getStepStatus(step, index, 'downward');
              
              return (
                <div
                  key={`downward-${index}`}
                  className={`
                    border-2 rounded-lg p-3 transition-all duration-500
                    ${status === 'active' ? 'border-blue-400 bg-blue-500/10 scale-105' : ''}
                    ${status === 'completed' ? 'border-blue-600 bg-blue-500/5' : 'border-slate-600'}
                    ${status === 'pending' ? 'opacity-50' : 'opacity-100'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${status === 'completed' ? 'bg-blue-500 text-white' : ''}
                        ${status === 'active' ? 'bg-blue-400 text-black animate-pulse' : ''}
                        ${status === 'pending' ? 'bg-slate-600 text-slate-400' : ''}
                      `}>
                        {status === 'completed' ? <CheckCircle className="w-3 h-3" /> : step.level}
                      </div>
                      <span className="font-medium text-white text-sm">{step.levelName}</span>
                    </div>
                    
                    {status === 'active' && (
                      <Settings className="w-4 h-4 text-blue-400 animate-spin" />
                    )}
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className="text-slate-300">
                      <span className="font-medium">Action:</span> {step.action}
                    </div>
                    <div className={`font-mono ${step.color}`}>
                      {step.data}
                    </div>
                    <div className="text-slate-500">
                      {step.timing}ms • {step.duration}ms duration
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scenario Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h5 className="font-medium text-white">Trigger Event</h5>
          </div>
          <p className="text-sm text-slate-300">{currentScenario.trigger}</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h5 className="font-medium text-white">Final Outcome</h5>
          </div>
          <p className="text-sm text-slate-300">{currentScenario.outcome}</p>
        </div>
      </div>

      {/* Help Text */}
      {!isAnimating && currentStep === -1 && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-300 mb-1">Understanding Bi-Directional Flow</h4>
              <p className="text-xs text-blue-200">
                ISA-95 systems communicate in both directions. Data flows upward for analysis and decision-making, 
                while commands flow downward to control equipment and processes. Select a scenario and click Play 
                to see how mining operations respond to real-world events.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiDirectionalFlow;
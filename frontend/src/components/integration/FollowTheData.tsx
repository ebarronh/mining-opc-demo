'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  ArrowDown, 
  Clock, 
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react';

// Type for a data point as it flows through the system
interface DataPoint {
  id: string;
  originalValue: any;
  transformedValue: any;
  timestamp: number;
  level: number;
  processingTime: number;
  status: 'processing' | 'complete' | 'error';
}

// Mock ore reading data that flows through the system
const SAMPLE_ORE_READING = {
  timestamp: Date.now(),
  sensorId: 'XRF_001',
  location: { x: 125.5, y: 89.2, z: 45.8 },
  elements: {
    Fe: 62.5,
    SiO2: 18.3,
    Al2O3: 5.2,
    CaO: 3.1,
    MgO: 2.4,
    S: 0.8,
    P: 0.05
  },
  gradeClass: 'High',
  confidence: 0.95
};

// Data transformations at each ISA-95 level
const DATA_TRANSFORMATIONS = [
  {
    level: 0,
    name: 'Field Level',
    description: 'Raw sensor reading from XRF analyzer',
    processingTime: 5,
    input: SAMPLE_ORE_READING,
    transformation: 'Direct sensor output',
    output: SAMPLE_ORE_READING
  },
  {
    level: 1,
    name: 'Control Level',
    description: 'PLC processing with control logic',
    processingTime: 15,
    input: SAMPLE_ORE_READING,
    transformation: 'Quality check, alarm evaluation, control decisions',
    output: {
      ...SAMPLE_ORE_READING,
      controlDecision: 'Route to high-grade stockpile',
      alarmStatus: 'Normal',
      qualityFlag: 'Pass'
    }
  },
  {
    level: 2,
    name: 'Supervision Level',
    description: 'SCADA aggregation and operator display',
    processingTime: 100,
    input: SAMPLE_ORE_READING,
    transformation: 'Trend calculation, operator graphics, alarm management',
    output: {
      batchId: 'BATCH_2024_001_125',
      averageGrade: 61.8,
      sampleCount: 24,
      trendDirection: 'Stable',
      operatorNotes: 'Grade consistent with geological model'
    }
  },
  {
    level: 3,
    name: 'MES Level',
    description: 'Production planning and quality management',
    processingTime: 2000,
    input: SAMPLE_ORE_READING,
    transformation: 'Production scheduling, inventory allocation, quality reporting',
    output: {
      productionOrder: 'PO_2024_HG_042',
      targetTonnage: 1250,
      qualityVariance: '+2.3% Fe',
      inventoryUpdate: 'High-grade stockpile +125t',
      scheduleAdjustment: 'None required'
    }
  },
  {
    level: 4,
    name: 'ERP Level',
    description: 'Business transaction and financial impact',
    processingTime: 10000,
    input: SAMPLE_ORE_READING,
    transformation: 'Cost allocation, sales planning, procurement decisions',
    output: {
      costPerTon: 28.45,
      revenueProjection: 89250,
      procurementTrigger: 'None',
      financialImpact: '+$2,250 vs. standard grade',
      maintenanceSchedule: 'XRF calibration due in 48hrs'
    }
  },
  {
    level: 5,
    name: 'Business Intelligence',
    description: 'Strategic analysis and predictive modeling',
    processingTime: 30000,
    input: SAMPLE_ORE_READING,
    transformation: 'Predictive analytics, market analysis, strategic insights',
    output: {
      predictiveModel: 'Grade trend suggests 15% increase next week',
      marketInsight: 'High-grade premium +$8.50/ton vs. benchmark',
      strategicRecommendation: 'Accelerate mining in Grid Section C',
      riskAssessment: 'Low risk - grade consistency high',
      kpiImpact: 'Recovery rate +1.2%, Profit margin +3.1%'
    }
  }
];

interface FollowTheDataProps {
  className?: string;
  autoStart?: boolean;
  onDataFlowComplete?: () => void;
  selectedLevel?: number | null;
}

export const FollowTheData: React.FC<FollowTheDataProps> = ({
  className = '',
  autoStart = false,
  onDataFlowComplete,
  selectedLevel
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  // Initialize animation
  const startDataFlow = useCallback(() => {
    setIsActive(true);
    setCurrentLevel(0);
    setDataPoints([]);
    
    const newDataPoint: DataPoint = {
      id: `data-${Date.now()}`,
      originalValue: SAMPLE_ORE_READING,
      transformedValue: SAMPLE_ORE_READING,
      timestamp: Date.now(),
      level: 0,
      processingTime: DATA_TRANSFORMATIONS[0].processingTime,
      status: 'processing'
    };
    
    setDataPoints([newDataPoint]);
  }, []);

  const pauseDataFlow = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetDataFlow = useCallback(() => {
    setIsActive(false);
    setCurrentLevel(-1);
    setDataPoints([]);
  }, []);

  // Handle level progression
  useEffect(() => {
    if (!isActive || currentLevel < 0 || currentLevel >= DATA_TRANSFORMATIONS.length) {
      return;
    }

    const transformation = DATA_TRANSFORMATIONS[currentLevel];
    const baseDelay = transformation.processingTime / animationSpeed;

    const timer = setTimeout(() => {
      setDataPoints(prev => {
        const updated = prev.map(dp => {
          if (dp.level === currentLevel && dp.status === 'processing') {
            return {
              ...dp,
              transformedValue: transformation.output,
              status: 'complete' as const
            };
          }
          return dp;
        });

        // Add next level if not at the end
        if (currentLevel < DATA_TRANSFORMATIONS.length - 1) {
          const nextTransformation = DATA_TRANSFORMATIONS[currentLevel + 1];
          const nextDataPoint: DataPoint = {
            id: `data-${Date.now()}-${currentLevel + 1}`,
            originalValue: transformation.output,
            transformedValue: transformation.output,
            timestamp: Date.now(),
            level: currentLevel + 1,
            processingTime: nextTransformation.processingTime,
            status: 'processing'
          };
          updated.push(nextDataPoint);
        }

        return updated;
      });

      if (currentLevel < DATA_TRANSFORMATIONS.length - 1) {
        setCurrentLevel(prev => prev + 1);
      } else {
        setIsActive(false);
        onDataFlowComplete?.();
      }
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [isActive, currentLevel, animationSpeed, onDataFlowComplete]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      startDataFlow();
    }
  }, [autoStart, startDataFlow]);

  const getLevelColor = (level: number) => {
    const colors = [
      'border-red-400 bg-red-500/10',      // Level 0
      'border-orange-400 bg-orange-500/10', // Level 1
      'border-yellow-400 bg-yellow-500/10', // Level 2
      'border-green-400 bg-green-500/10',   // Level 3
      'border-blue-400 bg-blue-500/10',     // Level 4
      'border-purple-400 bg-purple-500/10'  // Level 5
    ];
    return colors[level] || 'border-gray-400 bg-gray-500/10';
  };

  const formatTransformationData = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>Follow the Data</span>
          </h3>
          <p className="text-sm text-slate-400">
            Trace a single ore reading through all ISA-95 levels
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
              <option value={5}>5x</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              showDetails 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Details
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={startDataFlow}
              disabled={isActive}
              className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
            
            <button
              onClick={pauseDataFlow}
              disabled={!isActive}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
            
            <button
              onClick={resetDataFlow}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="space-y-4">
        {DATA_TRANSFORMATIONS.map((transformation, index) => {
          const dataPoint = dataPoints.find(dp => dp.level === index);
          const isActive = currentLevel === index;
          const isComplete = dataPoint?.status === 'complete';
          const isProcessing = dataPoint?.status === 'processing';
          const shouldHighlight = selectedLevel === index || isActive || isComplete;

          return (
            <div key={index}>
              {/* Level Card */}
              <div 
                className={`
                  border-2 rounded-lg p-4 transition-all duration-500
                  ${getLevelColor(index)}
                  ${shouldHighlight ? 'ring-2 ring-white/30 shadow-lg' : ''}
                  ${isActive ? 'animate-pulse' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {isProcessing && (
                        <div className="animate-spin">
                          <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                      )}
                      {isComplete && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {!dataPoint && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">
                        Level {index}: {transformation.name}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {transformation.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{transformation.processingTime}ms</span>
                    </div>
                    {dataPoint && (
                      <div className="mt-1 text-green-400">
                        {new Date(dataPoint.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="mt-3 bg-slate-700 rounded-full h-1 overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full animate-pulse w-3/4"></div>
                  </div>
                )}

                {/* Transformation Details */}
                {showDetails && dataPoint && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-white mb-2">
                          Transformation: {transformation.transformation}
                        </h5>
                        {isComplete && (
                          <div className="bg-slate-900 border border-slate-700 rounded p-3">
                            <h6 className="text-xs font-medium text-green-400 mb-1">Output Data:</h6>
                            <pre className="text-xs text-slate-300 overflow-x-auto">
                              {formatTransformationData(dataPoint.transformedValue)}
                            </pre>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-white mb-2">Processing Details</h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <span className={
                              dataPoint.status === 'complete' ? 'text-green-400' :
                              dataPoint.status === 'processing' ? 'text-yellow-400' :
                              'text-red-400'
                            }>
                              {dataPoint.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Processing Time:</span>
                            <span className="text-white">{dataPoint.processingTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Data Size:</span>
                            <span className="text-white">
                              {JSON.stringify(dataPoint.transformedValue).length} bytes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow to next level */}
              {index < DATA_TRANSFORMATIONS.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isComplete ? 'text-green-400' : 'text-slate-500'
                    }`} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {dataPoints.length > 0 && !isActive && currentLevel >= DATA_TRANSFORMATIONS.length - 1 && (
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
            <Database className="w-4 h-4 text-green-400" />
            <span>Data Journey Summary</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total Processing Time:</span>
              <div className="text-white font-medium">
                {DATA_TRANSFORMATIONS.reduce((sum, t) => sum + t.processingTime, 0)}ms
              </div>
            </div>
            
            <div>
              <span className="text-slate-400">Levels Traversed:</span>
              <div className="text-white font-medium">6 levels (0-5)</div>
            </div>
            
            <div>
              <span className="text-slate-400">Data Transformations:</span>
              <div className="text-white font-medium">
                {DATA_TRANSFORMATIONS.length} processing steps
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Original ore reading transformed from raw sensor data to strategic business insights
          </div>
        </div>
      )}

      {/* Help Text */}
      {!isActive && dataPoints.length === 0 && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-300 mb-1">How to Use</h4>
              <p className="text-xs text-blue-200">
                Click the Play button to start tracing an ore reading through all ISA-95 levels. 
                Watch how data gets transformed and enriched at each level, from raw sensor readings 
                to strategic business insights. Use the speed control to adjust animation timing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowTheData;
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Database, 
  Cpu, 
  BarChart3, 
  TrendingUp, 
  Filter,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';

interface DataTransformation {
  level: number;
  levelName: string;
  input: {
    format: string;
    example: any;
    frequency: string;
    size: string;
  };
  transformation: {
    process: string;
    algorithm: string;
    purpose: string;
  };
  output: {
    format: string;
    example: any;
    frequency: string;
    size: string;
  };
  miningContext: string;
}

const DATA_TRANSFORMATIONS: DataTransformation[] = [
  {
    level: 0,
    levelName: 'Field Level',
    input: {
      format: 'Raw Sensor Data',
      example: {
        timestamp: '2024-01-16T10:30:15.234Z',
        sensor_id: 'XRF_001',
        raw_voltage: 2.847,
        temperature: 23.4,
        vibration: 0.02
      },
      frequency: '100ms',
      size: '64 bytes'
    },
    transformation: {
      process: 'Signal Conditioning',
      algorithm: 'Analog-to-Digital Conversion',
      purpose: 'Convert physical measurements to digital values'
    },
    output: {
      format: 'Calibrated Readings',
      example: {
        timestamp: '2024-01-16T10:30:15.234Z',
        sensor_id: 'XRF_001',
        fe_percent: 58.3,
        al_percent: 12.7,
        si_percent: 15.2,
        status: 'valid'
      },
      frequency: '1s',
      size: '128 bytes'
    },
    miningContext: 'X-ray fluorescence analyzer measures ore composition in real-time as material passes on conveyor belt'
  },
  {
    level: 1,
    levelName: 'Control Level',
    input: {
      format: 'Calibrated Readings',
      example: {
        timestamp: '2024-01-16T10:30:15.234Z',
        sensor_id: 'XRF_001',
        fe_percent: 58.3,
        al_percent: 12.7,
        si_percent: 15.2,
        status: 'valid'
      },
      frequency: '1s',
      size: '128 bytes'
    },
    transformation: {
      process: 'Control Logic Processing',
      algorithm: 'PID Control + Rule Engine',
      purpose: 'Generate control commands based on sensor feedback'
    },
    output: {
      format: 'Control Commands',
      example: {
        timestamp: '2024-01-16T10:30:16.000Z',
        equipment_id: 'SORT_001',
        command: 'divert_high_grade',
        target_grade: 'fe_gt_55',
        confidence: 0.95,
        action: 'activate_pneumatic_pusher'
      },
      frequency: '5s',
      size: '256 bytes'
    },
    miningContext: 'PLC processes ore grade data and commands sorting equipment to separate high-grade ore from waste'
  },
  {
    level: 2,
    levelName: 'SCADA Level',
    input: {
      format: 'Control Commands',
      example: {
        timestamp: '2024-01-16T10:30:16.000Z',
        equipment_id: 'SORT_001',
        command: 'divert_high_grade',
        target_grade: 'fe_gt_55',
        confidence: 0.95,
        action: 'activate_pneumatic_pusher'
      },
      frequency: '5s',
      size: '256 bytes'
    },
    transformation: {
      process: 'Data Aggregation & Visualization',
      algorithm: 'Time-series Aggregation + Alarm Processing',
      purpose: 'Monitor operations and alert operators to issues'
    },
    output: {
      format: 'Operational Metrics',
      example: {
        timestamp: '2024-01-16T10:30:00.000Z',
        line_id: 'SORT_LINE_A',
        throughput_tph: 485.3,
        grade_recovery: 0.923,
        equipment_availability: 0.987,
        alarms: ['HIGH_VIBRATION_CONV_003'],
        trend: 'stable'
      },
      frequency: '1min',
      size: '1KB'
    },
    miningContext: 'HMI displays real-time sorting performance and alerts operators to equipment issues requiring attention'
  },
  {
    level: 3,
    levelName: 'MES Level',
    input: {
      format: 'Operational Metrics',
      example: {
        timestamp: '2024-01-16T10:30:00.000Z',
        line_id: 'SORT_LINE_A',
        throughput_tph: 485.3,
        grade_recovery: 0.923,
        equipment_availability: 0.987,
        alarms: ['HIGH_VIBRATION_CONV_003'],
        trend: 'stable'
      },
      frequency: '1min',
      size: '1KB'
    },
    transformation: {
      process: 'Production Analysis & Scheduling',
      algorithm: 'Statistical Process Control + Optimization',
      purpose: 'Optimize production schedules and quality control'
    },
    output: {
      format: 'Production Reports',
      example: {
        shift_id: 'DAY_2024-01-16',
        production_summary: {
          total_tons_processed: 11647,
          avg_fe_grade: 57.8,
          recovery_rate: 0.921,
          energy_consumption_kwh: 2847
        },
        quality_metrics: {
          grade_variance: 0.032,
          contamination_rate: 0.008,
          meets_spec: true
        },
        recommendations: ['increase_crusher_speed', 'schedule_conv_003_maintenance']
      },
      frequency: '8hrs',
      size: '5KB'
    },
    miningContext: 'MES analyzes shift performance, tracks quality metrics, and optimizes production parameters for next shift'
  },
  {
    level: 4,
    levelName: 'ERP Level',
    input: {
      format: 'Production Reports',
      example: {
        shift_id: 'DAY_2024-01-16',
        production_summary: {
          total_tons_processed: 11647,
          avg_fe_grade: 57.8,
          recovery_rate: 0.921,
          energy_consumption_kwh: 2847
        },
        quality_metrics: {
          grade_variance: 0.032,
          contamination_rate: 0.008,
          meets_spec: true
        },
        recommendations: ['increase_crusher_speed', 'schedule_conv_003_maintenance']
      },
      frequency: '8hrs',
      size: '5KB'
    },
    transformation: {
      process: 'Business Integration & Planning',
      algorithm: 'Financial Modeling + Supply Chain Optimization',
      purpose: 'Integrate operations with business planning and financials'
    },
    output: {
      format: 'Business Intelligence',
      example: {
        period: '2024-01-16',
        financial_metrics: {
          revenue_per_ton: 84.50,
          operating_cost_per_ton: 32.75,
          profit_margin: 0.612
        },
        inventory: {
          high_grade_stockpile_tons: 47320,
          low_grade_stockpile_tons: 23140,
          days_inventory: 12.3
        },
        planning: {
          next_week_target_tons: 82000,
          scheduled_maintenance_hours: 16,
          forecast_accuracy: 0.94
        }
      },
      frequency: '24hrs',
      size: '50KB'
    },
    miningContext: 'ERP system calculates costs, manages inventory, and integrates production data with financial planning'
  },
  {
    level: 5,
    levelName: 'Business Intelligence',
    input: {
      format: 'Business Intelligence',
      example: {
        period: '2024-01-16',
        financial_metrics: {
          revenue_per_ton: 84.50,
          operating_cost_per_ton: 32.75,
          profit_margin: 0.612
        },
        inventory: {
          high_grade_stockpile_tons: 47320,
          low_grade_stockpile_tons: 23140,
          days_inventory: 12.3
        },
        planning: {
          next_week_target_tons: 82000,
          scheduled_maintenance_hours: 16,
          forecast_accuracy: 0.94
        }
      },
      frequency: '24hrs',
      size: '50KB'
    },
    transformation: {
      process: 'Strategic Analytics & Insights',
      algorithm: 'Machine Learning + Predictive Modeling',
      purpose: 'Generate strategic insights for executive decision making'
    },
    output: {
      format: 'Executive Dashboard',
      example: {
        period: 'Q4_2024',
        strategic_kpis: {
          quarterly_production_mt: 1.23,
          cost_reduction_achieved: 0.087,
          safety_incidents: 0,
          environmental_compliance: 1.0
        },
        predictive_insights: {
          market_price_forecast: '+12% next quarter',
          equipment_failure_risk: 'low',
          optimal_production_rate: '485 tph',
          sustainability_score: 0.87
        },
        recommendations: [
          'Invest in additional sorting capacity',
          'Negotiate long-term supply contracts',
          'Implement predictive maintenance program'
        ]
      },
      frequency: 'Weekly',
      size: '500KB'
    },
    miningContext: 'Executive dashboard provides strategic insights, market forecasts, and recommendations for business planning'
  }
];

const getLevelIcon = (level: number) => {
  const iconProps = { className: "w-4 h-4" };
  switch (level) {
    case 0: return <Zap {...iconProps} />;
    case 1: return <Cpu {...iconProps} />;
    case 2: return <Database {...iconProps} />;
    case 3: return <BarChart3 {...iconProps} />;
    case 4: return <TrendingUp {...iconProps} />;
    case 5: return <Filter {...iconProps} />;
    default: return <Database {...iconProps} />;
  }
};

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

interface DataTransformationExamplesProps {
  selectedLevel?: number;
  className?: string;
}

export const DataTransformationExamples: React.FC<DataTransformationExamplesProps> = ({
  selectedLevel,
  className = ''
}) => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(selectedLevel || 0);
  const [animatingData, setAnimatingData] = useState(false);

  useEffect(() => {
    if (selectedLevel !== undefined) {
      setExpandedLevel(selectedLevel);
    }
  }, [selectedLevel]);

  const toggleLevel = (level: number) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const animateDataFlow = () => {
    setAnimatingData(true);
    setTimeout(() => setAnimatingData(false), 3000);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Data Transformation Examples
        </h2>
        <p className="text-slate-400 mb-4">
          See how raw sensor data transforms into business intelligence through each ISA-95 level
        </p>
        <button
          onClick={animateDataFlow}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Animate Data Flow</span>
        </button>
      </div>

      {/* Transformation Levels */}
      <div className="space-y-4">
        {DATA_TRANSFORMATIONS.map((transformation, index) => {
          const isExpanded = expandedLevel === transformation.level;
          const isAnimating = animatingData && index <= (Date.now() % 6);
          
          return (
            <div
              key={transformation.level}
              className={`
                border rounded-lg transition-all duration-300
                ${getLevelColor(transformation.level)}
                ${isExpanded ? 'ring-2 ring-white/20' : ''}
                ${isAnimating ? 'animate-pulse' : ''}
              `}
            >
              {/* Level Header */}
              <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleLevel(transformation.level)}
              >
                <div className="flex items-center space-x-3">
                  {getLevelIcon(transformation.level)}
                  <div>
                    <h3 className="text-white font-semibold">
                      Level {transformation.level}: {transformation.levelName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {transformation.transformation.process}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-slate-400">
                    {transformation.input.frequency} → {transformation.output.frequency}
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10">
                  {/* Mining Context */}
                  <div className="mb-6 p-3 bg-slate-800/50 rounded-lg">
                    <h4 className="text-white text-sm font-medium mb-2">Mining Context</h4>
                    <p className="text-slate-300 text-sm">{transformation.miningContext}</p>
                  </div>

                  {/* Data Flow */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                    {/* Input */}
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Input: {transformation.input.format}</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Frequency:</span>
                          <span className="text-white">{transformation.input.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Size:</span>
                          <span className="text-white">{transformation.input.size}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-slate-400 text-xs">Example Data:</span>
                          <pre className="mt-1 p-2 bg-slate-900 rounded text-xs text-green-300 overflow-x-auto">
                            {JSON.stringify(transformation.input.example, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Transformation */}
                    <div className="flex flex-col items-center space-y-3">
                      <ArrowRight className="w-6 h-6 text-blue-400" />
                      <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h5 className="text-white font-medium text-sm mb-1">
                          {transformation.transformation.algorithm}
                        </h5>
                        <p className="text-slate-400 text-xs">
                          {transformation.transformation.purpose}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-400" />
                    </div>

                    {/* Output */}
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Output: {transformation.output.format}</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Frequency:</span>
                          <span className="text-white">{transformation.output.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Size:</span>
                          <span className="text-white">{transformation.output.size}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-slate-400 text-xs">Example Data:</span>
                          <pre className="mt-1 p-2 bg-slate-900 rounded text-xs text-blue-300 overflow-x-auto">
                            {JSON.stringify(transformation.output.example, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
          <h4 className="text-white font-semibold mb-2">Data Volume Reduction</h4>
          <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
          <p className="text-slate-400 text-sm">From 64 bytes/100ms to 500KB/week</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
          <h4 className="text-white font-semibold mb-2">Value Enhancement</h4>
          <div className="text-2xl font-bold text-blue-400 mb-1">1000x</div>
          <p className="text-slate-400 text-sm">Raw sensor data to strategic insights</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
          <h4 className="text-white font-semibold mb-2">Processing Stages</h4>
          <div className="text-2xl font-bold text-purple-400 mb-1">6</div>
          <p className="text-slate-400 text-sm">Field sensors to executive dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default DataTransformationExamples;
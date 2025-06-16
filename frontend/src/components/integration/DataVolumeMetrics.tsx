'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ArrowDown, 
  ArrowUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Zap,
  Activity,
  Filter,
  Gauge,
  Info
} from 'lucide-react';

// Data volume metrics for each ISA-95 level
interface DataVolumeLevel {
  level: number;
  name: string;
  inputRate: string;
  outputRate: string;
  compressionRatio: number;
  dataTypes: string[];
  aggregationMethod: string;
  retentionPeriod: string;
  realTimeExample: {
    rawCount: number;
    processedCount: number;
    timeWindow: string;
    description: string;
  };
  businessValue: string;
}

const DATA_VOLUME_LEVELS: DataVolumeLevel[] = [
  {
    level: 0,
    name: 'Field Level',
    inputRate: 'N/A (Raw Source)',
    outputRate: '50-500 readings/second',
    compressionRatio: 1.0,
    dataTypes: ['XRF readings', 'GPS coordinates', 'Equipment sensors', 'Environmental data'],
    aggregationMethod: 'Raw data collection',
    retentionPeriod: '24 hours local buffer',
    realTimeExample: {
      rawCount: 0,
      processedCount: 450,
      timeWindow: 'per second',
      description: 'XRF analyzer scans ore every 2 seconds, GPS updates 10x/sec'
    },
    businessValue: 'Real-time operational control and safety monitoring'
  },
  {
    level: 1,
    name: 'Control Level',
    inputRate: '50-500 readings/second',
    outputRate: '5-50 control decisions/second',
    compressionRatio: 10.0,
    dataTypes: ['Control commands', 'Alarm states', 'Process variables', 'Safety interlocks'],
    aggregationMethod: 'Event-driven processing',
    retentionPeriod: '7 days in PLC memory',
    realTimeExample: {
      rawCount: 450,
      processedCount: 45,
      timeWindow: 'per second',
      description: 'PLCs process sensor data and generate control responses'
    },
    businessValue: 'Automated process optimization and safety enforcement'
  },
  {
    level: 2,
    name: 'Supervision Level',
    inputRate: '5-50 decisions/second',
    outputRate: '1-10 alerts/minute',
    compressionRatio: 30.0,
    dataTypes: ['Process graphics', 'Trend data', 'Alarm logs', 'Operator actions'],
    aggregationMethod: 'Time-based averaging',
    retentionPeriod: '30 days in SCADA historian',
    realTimeExample: {
      rawCount: 45,
      processedCount: 8,
      timeWindow: 'per minute',
      description: 'SCADA aggregates control data for operator displays'
    },
    businessValue: 'Operational visibility and human intervention capability'
  },
  {
    level: 3,
    name: 'MES Level',
    inputRate: '1-10 alerts/minute',
    outputRate: '1-5 reports/hour',
    compressionRatio: 100.0,
    dataTypes: ['Production orders', 'Quality results', 'Equipment effectiveness', 'KPIs'],
    aggregationMethod: 'Statistical summarization',
    retentionPeriod: '2 years in MES database',
    realTimeExample: {
      rawCount: 480,
      processedCount: 5,
      timeWindow: 'per hour',
      description: 'MES calculates hourly production metrics and quality summaries'
    },
    businessValue: 'Production optimization and quality assurance'
  },
  {
    level: 4,
    name: 'ERP Level',
    inputRate: '1-5 reports/hour',
    outputRate: '1-10 transactions/day',
    compressionRatio: 500.0,
    dataTypes: ['Financial transactions', 'Purchase orders', 'Maintenance schedules', 'Compliance reports'],
    aggregationMethod: 'Business logic aggregation',
    retentionPeriod: '7 years for compliance',
    realTimeExample: {
      rawCount: 120,
      processedCount: 8,
      timeWindow: 'per day',
      description: 'ERP processes daily production into business transactions'
    },
    businessValue: 'Financial planning and regulatory compliance'
  },
  {
    level: 5,
    name: 'Business Intelligence',
    inputRate: '1-10 transactions/day',
    outputRate: '1-5 insights/week',
    compressionRatio: 2000.0,
    dataTypes: ['KPI dashboards', 'Predictive models', 'Market analysis', 'Strategic reports'],
    aggregationMethod: 'Advanced analytics',
    retentionPeriod: 'Indefinite (data warehouse)',
    realTimeExample: {
      rawCount: 56,
      processedCount: 3,
      timeWindow: 'per week',
      description: 'BI systems generate strategic insights from accumulated data'
    },
    businessValue: 'Strategic decision making and competitive advantage'
  }
];

// Real-time data flow visualization
interface DataFlowMetric {
  fromLevel: number;
  toLevel: number;
  volumeReduction: number;
  latencyIncrease: string;
  transformationType: string;
}

const DATA_FLOW_METRICS: DataFlowMetric[] = [
  {
    fromLevel: 0,
    toLevel: 1,
    volumeReduction: 90,
    latencyIncrease: '5-15ms',
    transformationType: 'Event filtering'
  },
  {
    fromLevel: 1,
    toLevel: 2,
    volumeReduction: 83,
    latencyIncrease: '50-200ms',
    transformationType: 'Time aggregation'
  },
  {
    fromLevel: 2,
    toLevel: 3,
    volumeReduction: 88,
    latencyIncrease: '1-5 minutes',
    transformationType: 'Statistical summary'
  },
  {
    fromLevel: 3,
    toLevel: 4,
    volumeReduction: 80,
    latencyIncrease: '1-4 hours',
    transformationType: 'Business logic'
  },
  {
    fromLevel: 4,
    toLevel: 5,
    volumeReduction: 60,
    latencyIncrease: '1-7 days',
    transformationType: 'Analytics processing'
  }
];

interface DataVolumeMetricsProps {
  className?: string;
  selectedLevel?: number;
  showRealTimeFlow?: boolean;
  animated?: boolean;
}

export const DataVolumeMetrics: React.FC<DataVolumeMetricsProps> = ({
  className = '',
  selectedLevel,
  showRealTimeFlow = true,
  animated = true
}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect for real-time data flow
  useEffect(() => {
    if (!animated || !showRealTimeFlow) return;

    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % DATA_VOLUME_LEVELS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [animated, showRealTimeFlow]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getCompressionColor = (ratio: number): string => {
    if (ratio >= 1000) return 'text-purple-400';
    if (ratio >= 100) return 'text-blue-400';
    if (ratio >= 10) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getLevelIcon = (level: number) => {
    const iconProps = { className: "w-4 h-4" };
    switch (level) {
      case 0: return <Zap {...iconProps} />;
      case 1: return <Activity {...iconProps} />;
      case 2: return <Gauge {...iconProps} />;
      case 3: return <BarChart3 {...iconProps} />;
      case 4: return <Database {...iconProps} />;
      case 5: return <TrendingDown {...iconProps} />;
      default: return <Database {...iconProps} />;
    }
  };

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Filter className="w-6 h-6 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Data Volume Transformation</h3>
          <p className="text-sm text-slate-400">
            How data volume reduces and value increases through ISA-95 levels
          </p>
        </div>
      </div>

      {/* Data Flow Overview */}
      {showRealTimeFlow && (
        <div className="mb-8 bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Real-Time Data Flow</h4>
            <span className="text-xs text-slate-500">(Mining Example: Iron Ore Processing)</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            {DATA_VOLUME_LEVELS.map((level, index) => (
              <div
                key={level.level}
                className={`
                  text-center p-3 rounded-lg border-2 transition-all duration-500
                  ${animated && animationStep === index 
                    ? 'border-blue-400 bg-blue-500/10 scale-105' 
                    : 'border-slate-600 bg-slate-800/50'
                  }
                  ${selectedLevel === level.level ? 'ring-2 ring-white/30' : ''}
                `}
              >
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {getLevelIcon(level.level)}
                  <span className="text-xs font-medium text-white">L{level.level}</span>
                </div>
                
                <div className="text-lg font-bold text-white mb-1">
                  {formatNumber(level.realTimeExample.processedCount)}
                </div>
                
                <div className="text-xs text-slate-400 mb-1">
                  {level.realTimeExample.timeWindow}
                </div>
                
                <div className={`text-xs font-medium ${getCompressionColor(level.compressionRatio)}`}>
                  {level.compressionRatio > 1 ? `${level.compressionRatio}x` : 'Raw'}
                </div>

                {index < DATA_VOLUME_LEVELS.length - 1 && (
                  <div className="mt-2 flex justify-center">
                    <ArrowDown className={`
                      w-3 h-3 transition-colors
                      ${animated && animationStep === index ? 'text-blue-400' : 'text-slate-500'}
                    `} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Level Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {DATA_VOLUME_LEVELS.map((level) => (
          <div
            key={level.level}
            className={`
              border-2 rounded-xl p-4 transition-all duration-300
              ${selectedLevel === level.level 
                ? 'border-green-400 bg-green-500/5 scale-105' 
                : 'border-slate-600 hover:border-green-500/50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getLevelIcon(level.level)}
                <h4 className="font-semibold text-white">Level {level.level}: {level.name}</h4>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getCompressionColor(level.compressionRatio)} bg-slate-700`}>
                {level.compressionRatio > 1 ? `${level.compressionRatio}x compression` : 'Raw data'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-slate-400 font-medium">Input Rate</span>
                </div>
                <p className="text-sm text-white">{level.inputRate}</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <ArrowDown className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-slate-400 font-medium">Output Rate</span>
                </div>
                <p className="text-sm text-white">{level.outputRate}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Aggregation:</span>
                <span className="text-slate-300 ml-1">{level.aggregationMethod}</span>
              </div>
              
              <div>
                <span className="text-slate-400 font-medium">Retention:</span>
                <span className="text-slate-300 ml-1">{level.retentionPeriod}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-700">
                <span className="text-slate-400 font-medium">Business Value:</span>
                <p className="text-slate-300 mt-1">{level.businessValue}</p>
              </div>
            </div>

            {/* Real-time example */}
            <div className="mt-3 p-3 bg-slate-900 rounded-lg">
              <div className="text-xs text-blue-300 font-medium mb-1">Live Example:</div>
              <p className="text-xs text-slate-300">{level.realTimeExample.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Flow Transitions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-orange-400" />
          <h4 className="text-lg font-semibold text-white">Inter-Level Data Transformations</h4>
        </div>

        {DATA_FLOW_METRICS.map((flow) => (
          <div key={`${flow.fromLevel}-${flow.toLevel}`} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white">
                  Level {flow.fromLevel} → Level {flow.toLevel}
                </span>
                <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300">
                  {flow.transformationType}
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-red-400">
                  -{flow.volumeReduction}% volume
                </div>
                <div className="text-xs text-slate-400">
                  +{flow.latencyIncrease} latency
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-slate-800 rounded-full h-2 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${100 - flow.volumeReduction}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 min-w-0 whitespace-nowrap">
                {100 - flow.volumeReduction}% retained
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-1">Data Volume Transformation Summary</h4>
            <p className="text-xs text-blue-200">
              In mining operations, raw sensor data (450 readings/second) transforms into strategic insights 
              (3 insights/week) through progressive aggregation. Each level reduces volume while increasing 
              business value - from real-time safety control to executive decision making. The 2000x 
              compression ratio demonstrates how ISA-95 architecture efficiently manages the data pyramid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVolumeMetrics;
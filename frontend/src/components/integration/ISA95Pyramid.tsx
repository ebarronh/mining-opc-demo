'use client';

import React, { useState, useCallback } from 'react';
import { ISA95Level } from '@/types/integration';
import { DataFlowAnimator } from './DataFlowAnimator';
import { DataTransformationExamples } from './DataTransformationExamples';
import { LatencyMetrics } from './LatencyMetrics';
import { ProtocolTransition } from './ProtocolTransition';
import { FollowTheData } from './FollowTheData';
import ISA95LevelTooltip from './ISA95LevelTooltip';
import { BiDirectionalFlow } from './BiDirectionalFlow';
import { SecurityBoundaryHighlight } from './SecurityBoundaryHighlight';
import { DataVolumeMetrics } from './DataVolumeMetrics';
import { useDataFlow } from '@/hooks/useDataFlow';
import { 
  Cpu, 
  Database, 
  BarChart3, 
  Building, 
  TrendingUp, 
  Shield,
  Clock,
  HardDrive,
  Zap,
  ArrowUpDown,
  Info
} from 'lucide-react';

// ISA-95 levels with mining-specific context
const ISA95_LEVELS: ISA95Level[] = [
  {
    id: 0,
    name: 'Field Level',
    description: 'Physical mining equipment and sensors',
    miningContext: 'Ore analyzers, conveyors, excavators, trucks, environmental sensors',
    dataTypes: ['Raw sensor readings', 'Equipment status', 'Position data', 'Environmental conditions'],
    protocols: ['OPC UA', 'Modbus', 'Ethernet/IP', 'Serial'],
    latency: '1-10ms',
    dataVolume: '10-100 points/sec',
    securityBoundary: false,
    transitionLatencies: {
      toNext: '5-15ms',
      toEdge: '2-8ms',
      toCloud: 'N/A'
    }
  },
  {
    id: 1,
    name: 'Control Level',
    description: 'PLCs and control systems',
    miningContext: 'Conveyor controllers, crusher PLCs, pump stations, safety systems',
    dataTypes: ['Control commands', 'Alarm states', 'Process variables', 'Safety interlocks'],
    protocols: ['OPC UA', 'Ethernet/IP', 'Profinet', 'Modbus TCP'],
    latency: '10-50ms',
    dataVolume: '1-10 aggregates/sec',
    securityBoundary: true,
    transitionLatencies: {
      toPrevious: '5-15ms',
      toNext: '20-50ms',
      toEdge: '3-12ms',
      toCloud: 'N/A'
    }
  },
  {
    id: 2,
    name: 'Supervision Level',
    description: 'SCADA and HMI systems',
    miningContext: 'Control room displays, operator interfaces, alarm management, trend displays',
    dataTypes: ['Process graphics', 'Trend data', 'Alarm logs', 'Operator actions'],
    protocols: ['OPC UA', 'REST API', 'Database queries', 'Web services'],
    latency: '100ms-1s',
    dataVolume: '1 update/sec',
    securityBoundary: true,
    transitionLatencies: {
      toPrevious: '20-50ms',
      toNext: '100ms-1s',
      toEdge: '5-20ms',
      toCloud: '50-150ms'
    }
  },
  {
    id: 3,
    name: 'MES Level',
    description: 'Manufacturing Execution Systems',
    miningContext: 'Production scheduling, quality control, inventory tracking, shift management',
    dataTypes: ['Production orders', 'Quality results', 'Inventory levels', 'Shift reports'],
    protocols: ['REST API', 'SOAP', 'Database integration', 'Message queues'],
    latency: '1-10s',
    dataVolume: '1 batch/minute',
    securityBoundary: true,
    transitionLatencies: {
      toPrevious: '100ms-1s',
      toNext: '1-10s',
      toEdge: 'N/A',
      toCloud: '100-300ms'
    }
  },
  {
    id: 4,
    name: 'ERP Level',
    description: 'Enterprise Resource Planning',
    miningContext: 'Financial management, procurement, maintenance planning, regulatory reporting',
    dataTypes: ['Financial transactions', 'Purchase orders', 'Maintenance schedules', 'Compliance reports'],
    protocols: ['REST API', 'EDI', 'Database replication', 'File transfer'],
    latency: '10s-1min',
    dataVolume: '1 report/hour',
    securityBoundary: true,
    transitionLatencies: {
      toPrevious: '1-10s',
      toNext: '10s-5min',
      toEdge: 'N/A',
      toCloud: '200-500ms'
    }
  },
  {
    id: 5,
    name: 'Business Intelligence',
    description: 'Strategic planning and analytics',
    miningContext: 'Executive dashboards, predictive analytics, market analysis, strategic planning',
    dataTypes: ['KPI dashboards', 'Predictive models', 'Market data', 'Strategic reports'],
    protocols: ['Data lakes', 'ETL pipelines', 'API integration', 'Cloud services'],
    latency: '1min-1hour',
    dataVolume: '1 analysis/day',
    securityBoundary: true,
    transitionLatencies: {
      toPrevious: '10s-5min',
      toNext: 'N/A',
      toEdge: 'N/A',
      toCloud: '500ms-2s'
    }
  }
];

const getLevelIcon = (level: number) => {
  const iconProps = { className: "w-5 h-5" };
  switch (level) {
    case 0: return <Zap {...iconProps} />;
    case 1: return <Cpu {...iconProps} />;
    case 2: return <HardDrive {...iconProps} />;
    case 3: return <BarChart3 {...iconProps} />;
    case 4: return <Building {...iconProps} />;
    case 5: return <TrendingUp {...iconProps} />;
    default: return <Database {...iconProps} />;
  }
};

const getLevelColor = (level: number) => {
  const colors = [
    'from-red-500 to-red-600',      // Level 0 - Field
    'from-orange-500 to-orange-600', // Level 1 - Control
    'from-yellow-500 to-yellow-600', // Level 2 - SCADA
    'from-green-500 to-green-600',   // Level 3 - MES
    'from-blue-500 to-blue-600',     // Level 4 - ERP
    'from-purple-500 to-purple-600'  // Level 5 - BI
  ];
  return colors[level] || 'from-gray-500 to-gray-600';
};

const getLevelBorderColor = (level: number) => {
  const colors = [
    'border-red-400',    // Level 0
    'border-orange-400', // Level 1
    'border-yellow-400', // Level 2
    'border-green-400',  // Level 3
    'border-blue-400',   // Level 4
    'border-purple-400'  // Level 5
  ];
  return colors[level] || 'border-gray-400';
};

interface ISA95PyramidProps {
  className?: string;
  onLevelSelect?: (level: ISA95Level) => void;
  showDataFlow?: boolean;
  followDataMode?: boolean;
  showLatencyMetrics?: boolean;
  showProtocolTransition?: boolean;
  showFollowTheData?: boolean;
  showBiDirectionalFlow?: boolean;
  showSecurityBoundaries?: boolean;
  showDataVolumeMetrics?: boolean;
}

export const ISA95Pyramid: React.FC<ISA95PyramidProps> = ({
  className = '',
  onLevelSelect,
  showDataFlow = false,
  followDataMode = false,
  showLatencyMetrics = false,
  showProtocolTransition = false,
  showFollowTheData = false,
  showBiDirectionalFlow = false,
  showSecurityBoundaries = false,
  showDataVolumeMetrics = false
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  
  // Data flow animation
  const { nodes, connections, isActive, toggleFlow } = useDataFlow({
    simulateRealtime: true,
    updateInterval: 3000
  });

  const handleLevelClick = useCallback((level: ISA95Level) => {
    setSelectedLevel(level.id);
    onLevelSelect?.(level);
  }, [onLevelSelect]);

  const handleLevelHover = useCallback((levelId: number | null) => {
    setHoveredLevel(levelId);
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">ISA-95 Integration Pyramid</h2>
        <p className="text-slate-400">
          Interactive mining enterprise architecture with data flow visualization
        </p>
        {followDataMode && (
          <div className="mt-3 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg inline-block">
            <span className="text-blue-300 text-sm font-medium">
              Follow the Data Mode: Tracing ore reading through all levels
            </span>
          </div>
        )}
      </div>

      {/* Data Flow Animation */}
      {showDataFlow && (
        <div className="mb-8 bg-slate-900 border border-slate-700 rounded-xl p-4 h-64">
          <DataFlowAnimator
            nodes={nodes}
            connections={connections}
            isActive={isActive && showDataFlow}
            particleCount={15}
            animationSpeed={1}
            className="w-full h-full"
            onParticleComplete={(particleId, data) => {
              console.log('Particle completed:', particleId, data);
            }}
          />
        </div>
      )}

      {/* Pyramid Visualization */}
      <div className="relative">
        {/* Data Flow Arrows */}
        {showDataFlow && (
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={`flow-${level}`}
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ 
                  top: `${85 - (level * 14)}%`,
                  zIndex: 10
                }}
              >
                <ArrowUpDown className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Pyramid Levels */}
        <div className="space-y-2">
          {ISA95_LEVELS.slice().reverse().map((level, index) => {
            const actualLevel = 5 - index;
            const width = 20 + (actualLevel * 13); // Width increases as we go down
            const isSelected = selectedLevel === level.id;
            const isHovered = hoveredLevel === level.id;
            
            return (
              <div
                key={level.id}
                className="flex justify-center"
                style={{ 
                  transform: followDataMode && selectedLevel === level.id 
                    ? 'scale(1.05)' 
                    : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div
                  className={`
                    relative cursor-pointer transition-all duration-300 ease-in-out
                    bg-gradient-to-r ${getLevelColor(level.id)}
                    border-2 ${getLevelBorderColor(level.id)}
                    rounded-lg p-4 shadow-lg
                    ${isSelected ? 'ring-2 ring-white/50 shadow-xl' : ''}
                    ${isHovered ? 'shadow-xl scale-105' : ''}
                    ${level.securityBoundary ? 'border-dashed' : ''}
                  `}
                  style={{ width: `${width}%` }}
                  onClick={() => handleLevelClick(level)}
                  onMouseEnter={() => handleLevelHover(level.id)}
                  onMouseLeave={() => handleLevelHover(null)}
                >
                  {/* Security Boundary Indicator */}
                  {level.securityBoundary && (
                    <div className="absolute -top-2 -right-2">
                      <Shield className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getLevelIcon(level.id)}
                      </div>
                      <div>
                        <ISA95LevelTooltip level={level.id} placement="right">
                          <div className="flex items-center space-x-1 cursor-help">
                            <h3 className="font-semibold text-sm md:text-base border-b border-dotted border-transparent hover:border-blue-400 transition-colors">
                              Level {level.id}: {level.name}
                            </h3>
                            <Info className="w-3 h-3 text-blue-400 opacity-60 hover:opacity-100 transition-opacity" />
                          </div>
                        </ISA95LevelTooltip>
                        <p className="text-xs opacity-90 hidden md:block">
                          {level.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="text-right text-xs opacity-75 hidden lg:block">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{level.latency}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>{level.dataVolume}</span>
                      </div>
                      {showLatencyMetrics && level.transitionLatencies?.toNext && (
                        <div className="flex items-center space-x-1 mt-1">
                          <ArrowUpDown className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300">{level.transitionLatencies.toNext}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mining Context - shown on hover or selection */}
                  {(isHovered || isSelected) && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-white/90 mb-2">
                        <strong>Mining Context:</strong> {level.miningContext}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <strong className="text-white/90">Protocols:</strong>
                          <ul className="text-white/75 mt-1">
                            {level.protocols.slice(0, 2).map(protocol => (
                              <li key={protocol}>• {protocol}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-white/90">Data Types:</strong>
                          <ul className="text-white/75 mt-1">
                            {level.dataTypes.slice(0, 2).map(dataType => (
                              <li key={dataType}>• {dataType}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Transformation Examples */}
        <div className="mt-12">
          <DataTransformationExamples selectedLevel={selectedLevel ?? undefined} />
        </div>

        {/* Latency Metrics */}
        {showLatencyMetrics && (
          <div className="mt-12">
            <LatencyMetrics 
              selectedLevel={selectedLevel ?? undefined}
              showRealTime={showDataFlow}
            />
          </div>
        )}

        {/* Protocol Transition */}
        {showProtocolTransition && (
          <div className="mt-12">
            <ProtocolTransition 
              animateFlow={showDataFlow && isActive}
              showDetails={true}
            />
          </div>
        )}

        {/* Follow the Data */}
        {showFollowTheData && (
          <div className="mt-12">
            <FollowTheData 
              selectedLevel={selectedLevel ?? undefined}
              autoStart={followDataMode}
              onDataFlowComplete={() => {
                console.log('Data flow tracing complete');
              }}
            />
          </div>
        )}

        {/* Bi-Directional Flow */}
        {showBiDirectionalFlow && (
          <div className="mt-12">
            <BiDirectionalFlow 
              autoStart={followDataMode}
              onFlowComplete={(scenarioId) => {
                console.log('Bi-directional flow complete:', scenarioId);
              }}
            />
          </div>
        )}

        {/* Security Boundary Highlighting */}
        {showSecurityBoundaries && (
          <div className="mt-12">
            <SecurityBoundaryHighlight 
              selectedLevel={selectedLevel ?? undefined}
              showDetails={true}
              onBoundarySelect={(boundary) => {
                console.log('Security boundary selected:', boundary);
              }}
            />
          </div>
        )}

        {/* Data Volume Metrics */}
        {showDataVolumeMetrics && (
          <div className="mt-12">
            <DataVolumeMetrics 
              selectedLevel={selectedLevel ?? undefined}
              showRealTimeFlow={true}
              animated={showDataFlow}
            />
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Security Boundaries</span>
            </h4>
            <p className="text-slate-400 text-xs">
              Dashed borders indicate security boundaries between operational and business networks
            </p>
          </div>
          
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Latency Metrics</span>
            </h4>
            <p className="text-slate-400 text-xs">
              Response time requirements increase as we move up the pyramid hierarchy
            </p>
          </div>
          
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4 text-green-400" />
              <span>Data Volume</span>
            </h4>
            <p className="text-slate-400 text-xs">
              Data aggregation reduces volume while increasing business value up the pyramid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISA95Pyramid;
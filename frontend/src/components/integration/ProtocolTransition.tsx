'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Database, 
  Wifi, 
  Cloud, 
  Share2, 
  Lock,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Timer,
  BarChart3
} from 'lucide-react';

interface ProtocolStep {
  id: string;
  name: string;
  protocol: string;
  level: string;
  description: string;
  latency: string;
  throughput: string;
  security: 'low' | 'medium' | 'high';
  dataFormat: string;
  example: any;
  icon: 'database' | 'wifi' | 'cloud' | 'share';
}

const PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 'field-sensors',
    name: 'Field Sensors',
    protocol: 'OPC UA',
    level: 'Level 0-1',
    description: 'Real-time sensor data from XRF ore analyzers and equipment',
    latency: '5-15ms',
    throughput: '100 points/sec',
    security: 'medium',
    dataFormat: 'Binary + JSON',
    icon: 'database',
    example: {
      timestamp: '2024-01-16T10:30:15.234Z',
      nodeId: 'ns=2;s=XRF_001.Grade.Fe',
      value: 58.3,
      quality: 'Good',
      sourceTimestamp: '2024-01-16T10:30:15.234Z'
    }
  },
  {
    id: 'scada-gateway',
    name: 'SCADA Gateway',
    protocol: 'REST API',
    level: 'Level 2-3',
    description: 'Aggregated operational data for production systems',
    latency: '100ms-1s',
    throughput: '10 calls/sec',
    security: 'high',
    dataFormat: 'JSON over HTTPS',
    icon: 'wifi',
    example: {
      timestamp: '2024-01-16T10:30:00.000Z',
      equipment_id: 'XRF_001',
      readings: [
        { element: 'Fe', grade: 58.3, confidence: 0.95 },
        { element: 'Al', grade: 12.7, confidence: 0.92 },
        { element: 'Si', grade: 15.2, confidence: 0.89 }
      ],
      location: { x: 1250.5, y: 890.2, z: 45.8 },
      quality_score: 0.92
    }
  },
  {
    id: 'cloud-analytics',
    name: 'Cloud Analytics',
    protocol: 'Cloud Services',
    level: 'Level 4-5',
    description: 'Business intelligence and predictive analytics platform',
    latency: '200ms-2s',
    throughput: '1000 records/batch',
    security: 'high',
    dataFormat: 'Parquet + Delta Format',
    icon: 'cloud',
    example: {
      batch_id: 'batch_20240116_103000',
      processed_tons: 1247.5,
      avg_grade: {
        fe_percent: 57.8,
        recovery_rate: 0.923,
        contamination: 0.008
      },
      predictions: {
        next_hour_production: 485.3,
        quality_forecast: 'stable',
        maintenance_alert: false
      },
      ml_confidence: 0.87
    }
  },
  {
    id: 'delta-share',
    name: 'Delta Share',
    protocol: 'Delta Sharing',
    level: 'Enterprise',
    description: 'Secure data sharing with partners and customers',
    latency: '1-5s',
    throughput: '10TB/day',
    security: 'high',
    dataFormat: 'Delta Lake Tables',
    icon: 'share',
    example: {
      share_name: 'mining_operations_q4_2024',
      table: 'ore_quality_summary',
      recipient: 'steel_mill_partner',
      shared_columns: ['date', 'grade_category', 'volume_tons', 'avg_fe_percent'],
      access_level: 'read_only',
      expiration: '2025-01-31T23:59:59Z',
      audit_log: 'enabled'
    }
  }
];

const getProtocolIcon = (iconType: string) => {
  const iconProps = { className: "w-6 h-6" };
  switch (iconType) {
    case 'database': return <Database {...iconProps} />;
    case 'wifi': return <Wifi {...iconProps} />;
    case 'cloud': return <Cloud {...iconProps} />;
    case 'share': return <Share2 {...iconProps} />;
    default: return <Database {...iconProps} />;
  }
};

const getSecurityColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getLatencyColor = (latency: string) => {
  if (latency.includes('ms') && !latency.includes('100ms')) {
    return 'text-green-400';
  } else if (latency.includes('100ms') || latency.includes('1s')) {
    return 'text-yellow-400';
  } else {
    return 'text-orange-400';
  }
};

interface ProtocolTransitionProps {
  selectedStep?: string;
  animateFlow?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const ProtocolTransition: React.FC<ProtocolTransitionProps> = ({
  selectedStep,
  animateFlow = false,
  showDetails = true,
  className = ''
}) => {
  const [activeStep, setActiveStep] = useState<string | null>(selectedStep || null);
  const [flowAnimation, setFlowAnimation] = useState(false);
  const [dataFlowing, setDataFlowing] = useState<Record<string, boolean>>({});

  // Animate data flow between steps
  useEffect(() => {
    if (animateFlow) {
      const animateSequence = async () => {
        setFlowAnimation(true);
        
        for (let i = 0; i < PROTOCOL_STEPS.length - 1; i++) {
          const currentStep = PROTOCOL_STEPS[i].id;
          const nextStep = PROTOCOL_STEPS[i + 1].id;
          
          // Show data flowing from current to next step
          setDataFlowing(prev => ({ ...prev, [`${currentStep}-${nextStep}`]: true }));
          setActiveStep(currentStep);
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setActiveStep(nextStep);
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Clear the flow animation
          setDataFlowing(prev => ({ ...prev, [`${currentStep}-${nextStep}`]: false }));
        }
        
        setFlowAnimation(false);
        setActiveStep(null);
      };

      animateSequence();
    }
  }, [animateFlow]);

  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Protocol Transition Visualization
        </h2>
        <p className="text-slate-400 mb-4">
          See how mining data flows through different protocols from field sensors to enterprise sharing
        </p>
        
        {/* Animation Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setFlowAnimation(!flowAnimation)}
            disabled={flowAnimation}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${flowAnimation 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${flowAnimation ? 'animate-spin' : ''}`} />
            {flowAnimation ? 'Animating...' : 'Animate Data Flow'}
          </button>
        </div>
      </div>

      {/* Protocol Flow Diagram */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center space-x-8 w-full max-w-5xl">
            {PROTOCOL_STEPS.slice(0, -1).map((step, index) => {
              const nextStep = PROTOCOL_STEPS[index + 1];
              const flowKey = `${step.id}-${nextStep.id}`;
              const isFlowing = dataFlowing[flowKey];
              
              return (
                <div key={flowKey} className="flex-1 flex items-center">
                  <div className="flex-1" /> {/* Spacer */}
                  <div className="relative flex items-center">
                    <ArrowRight 
                      className={`
                        w-8 h-8 text-blue-400 transition-all duration-300
                        ${isFlowing ? 'animate-pulse scale-110 text-green-400' : ''}
                      `} 
                    />
                    {isFlowing && (
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1" /> {/* Spacer */}
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROTOCOL_STEPS.map((step, index) => {
            const isActive = activeStep === step.id;
            const isAnimating = flowAnimation && activeStep === step.id;
            
            return (
              <div
                key={step.id}
                className={`
                  relative bg-slate-800 border rounded-xl p-6 cursor-pointer
                  transition-all duration-300 hover:border-slate-500
                  ${isActive ? 'border-blue-400 ring-2 ring-blue-400/30' : 'border-slate-600'}
                  ${isAnimating ? 'ring-4 ring-green-400/50 border-green-400' : ''}
                `}
                onClick={() => handleStepClick(step.id)}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>

                {/* Protocol Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isAnimating ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                      {getProtocolIcon(step.icon)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{step.name}</h3>
                      <p className="text-slate-400 text-xs">{step.level}</p>
                    </div>
                  </div>
                  
                  {isAnimating && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                {/* Protocol Badge */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                    {step.protocol}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Latency:</span>
                    <span className={`font-mono ${getLatencyColor(step.latency)}`}>
                      {step.latency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Throughput:</span>
                    <span className="text-white font-mono">{step.throughput}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Security:</span>
                    <div className="flex items-center space-x-1">
                      <Lock className={`w-3 h-3 ${getSecurityColor(step.security)}`} />
                      <span className={`capitalize ${getSecurityColor(step.security)}`}>
                        {step.security}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs mb-4">{step.description}</p>

                {/* Data Format */}
                <div className="text-xs">
                  <span className="text-slate-500">Format: </span>
                  <span className="text-blue-300">{step.dataFormat}</span>
                </div>

                {/* Expanded Details */}
                {showDetails && isActive && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <h4 className="text-white text-sm font-semibold mb-2">Example Data:</h4>
                    <pre className="bg-slate-900 p-3 rounded text-xs text-green-300 overflow-x-auto">
                      {JSON.stringify(step.example, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol Comparison Matrix */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Protocol Comparison Matrix</h3>
        
        <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Protocol</th>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Use Case</th>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Latency</th>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Throughput</th>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Security</th>
                  <th className="px-4 py-3 text-left text-white text-sm font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {PROTOCOL_STEPS.map((step, index) => (
                  <tr key={step.id} className={index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getProtocolIcon(step.icon)}
                        <span className="text-white text-sm font-medium">{step.protocol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{step.level}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-mono ${getLatencyColor(step.latency)}`}>
                        {step.latency}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm font-mono">{step.throughput}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Lock className={`w-4 h-4 ${getSecurityColor(step.security)}`} />
                        <span className={`text-sm capitalize ${getSecurityColor(step.security)}`}>
                          {step.security}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{step.description.split(' ').slice(0, 5).join(' ')}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">End-to-End Latency</h4>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">~3.2s</div>
          <p className="text-slate-400 text-sm">Field sensor to Delta Share</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h4 className="text-white font-semibold">Data Transformation</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-400 mb-1">99.9%</div>
          <p className="text-slate-400 text-sm">Volume reduction through aggregation</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">Security Layers</h4>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">4</div>
          <p className="text-slate-400 text-sm">Authentication, encryption, authorization, audit</p>
        </div>
      </div>
    </div>
  );
};

export default ProtocolTransition;
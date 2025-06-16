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
  BarChart3,
  X,
  Copy,
  Eye
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
      sourceTimestamp: '2024-01-16T10:30:15.234Z',
      location: { pit: 'North', bench: 'B-45', x: 1250.5, y: 890.2 },
      elements: {
        Fe: 58.3,
        SiO2: 18.7,
        Al2O3: 12.4,
        CaO: 4.2,
        MgO: 3.1
      },
      confidence: 0.95,
      equipment: 'XRF_001'
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
      batch_info: {
        batch_id: 'BATCH_2024_001_125',
        start_time: '2024-01-16T10:00:00.000Z',
        sample_count: 24,
        total_weight: 1250.5
      },
      readings: [
        { element: 'Fe', grade: 58.3, confidence: 0.95, trend: 'stable' },
        { element: 'Al', grade: 12.7, confidence: 0.92, trend: 'increasing' },
        { element: 'Si', grade: 15.2, confidence: 0.89, trend: 'stable' }
      ],
      location: { x: 1250.5, y: 890.2, z: 45.8 },
      quality_score: 0.92,
      alerts: [],
      production_status: 'operational'
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
      processing_summary: {
        processed_tons: 1247.5,
        processing_time: '30min',
        efficiency: 0.923,
        cost_per_ton: 28.45
      },
      avg_grade: {
        fe_percent: 57.8,
        recovery_rate: 0.923,
        contamination: 0.008,
        grade_variance: 0.12
      },
      predictions: {
        next_hour_production: 485.3,
        quality_forecast: 'stable',
        maintenance_alert: false,
        optimal_blend_ratio: 0.75
      },
      ml_confidence: 0.87,
      business_impact: {
        revenue_per_ton: 89.50,
        profit_margin: 0.24,
        customer_satisfaction: 'high'
      }
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
      shared_data: {
        date_range: '2024-01-01 to 2024-01-31',
        total_records: 125000,
        avg_daily_volume: 1250.5,
        grade_distribution: {
          high_grade: 0.35,
          medium_grade: 0.45,
          low_grade: 0.20
        }
      },
      shared_columns: ['date', 'grade_category', 'volume_tons', 'avg_fe_percent', 'quality_score'],
      access_level: 'read_only',
      expiration: '2025-01-31T23:59:59Z',
      audit_log: 'enabled',
      cost_savings: '$2.3M vs traditional data transfer'
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
  const [showDataModal, setShowDataModal] = useState(false);
  const [modalStep, setModalStep] = useState<ProtocolStep | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);

  const handleStepClick = (step: ProtocolStep) => {
    setModalStep(step);
    setShowDataModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Trigger animation manually
  const startAnimation = () => {
    if (flowAnimation) return;
    
    setFlowAnimation(true);
    animateSequence();
  };

  // Animate data flow between steps
  const animateSequence = async () => {
    for (let i = 0; i < PROTOCOL_STEPS.length; i++) {
      const currentStep = PROTOCOL_STEPS[i];
      
      // Highlight current step
      setAnimatingStep(currentStep.id);
      
      // Show data flowing from current to next step
      if (i < PROTOCOL_STEPS.length - 1) {
        const nextStep = PROTOCOL_STEPS[i + 1];
        const flowKey = `${currentStep.id}-${nextStep.id}`;
        setDataFlowing(prev => ({ ...prev, [flowKey]: true }));
        
        // Wait for data flow animation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear the flow animation
        setDataFlowing(prev => ({ ...prev, [flowKey]: false }));
      } else {
        // Last step, just wait
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Clear current step highlight
      setAnimatingStep(null);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setFlowAnimation(false);
  };

  // Auto-animate if prop is set
  useEffect(() => {
    if (animateFlow && !flowAnimation) {
      startAnimation();
    }
  }, [animateFlow]);

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
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
            onClick={startAnimation}
            disabled={flowAnimation}
            className={`
              px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
              ${flowAnimation 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
              }
            `}
          >
            <RefreshCw className={`w-4 h-4 ${flowAnimation ? 'animate-spin' : ''}`} />
            <span>{flowAnimation ? 'Animating...' : 'Animate Data Flow'}</span>
          </button>
        </div>
      </div>

      {/* Protocol Flow Diagram - Enhanced Layout */}
      <div className="relative mb-12">
        {/* Connection Lines with Enhanced Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center justify-between w-full px-8">
            {PROTOCOL_STEPS.slice(0, -1).map((step, index) => {
              const nextStep = PROTOCOL_STEPS[index + 1];
              const flowKey = `${step.id}-${nextStep.id}`;
              const isFlowing = dataFlowing[flowKey];
              
              return (
                <div key={flowKey} className="flex-1 flex items-center justify-center mx-4">
                  <div className="relative flex items-center">
                    {/* Background arrow */}
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                    
                    {/* Animated arrow overlay */}
                    <ArrowRight 
                      className={`
                        absolute w-8 h-8 transition-all duration-500
                        ${isFlowing 
                          ? 'text-green-400 scale-125 animate-pulse' 
                          : 'text-blue-400 scale-100'
                        }
                      `} 
                    />
                    
                    {/* Data packet animation */}
                    {isFlowing && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-green-400 text-black px-2 py-1 rounded text-xs font-bold animate-bounce">
                            DATA
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol Steps - Wider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {PROTOCOL_STEPS.map((step, index) => {
            const isActive = activeStep === step.id;
            const isAnimating = animatingStep === step.id;
            
            return (
              <div
                key={step.id}
                className={`
                  relative bg-slate-800 border rounded-xl p-6 cursor-pointer
                  transition-all duration-500 hover:border-slate-500 hover:shadow-xl hover:scale-105
                  ${isActive ? 'border-blue-400 ring-2 ring-blue-400/30' : 'border-slate-600'}
                  ${isAnimating ? 'ring-4 ring-green-400/50 border-green-400 shadow-2xl scale-105' : ''}
                  min-h-[320px]
                `}
                onClick={() => handleStepClick(step)}
              >
                {/* Step Number */}
                <div className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                  transition-all duration-300
                  ${isAnimating ? 'bg-green-500 scale-125 animate-pulse' : 'bg-blue-600'}
                `}>
                  {index + 1}
                </div>

                {/* Protocol Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-3 rounded-lg transition-all duration-300
                      ${isAnimating ? 'bg-green-500/30 scale-110' : 'bg-blue-500/20'}
                    `}>
                      {getProtocolIcon(step.icon)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">{step.name}</h3>
                      <p className="text-slate-400 text-sm">{step.level}</p>
                    </div>
                  </div>
                  
                  {isAnimating && (
                    <div className="flex flex-col items-center">
                      <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
                      <span className="text-xs text-green-400 font-bold mt-1">ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Protocol Badge */}
                <div className="mb-4">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                    ${isAnimating ? 'bg-green-500/30 text-green-300' : 'bg-purple-500/20 text-purple-300'}
                  `}>
                    {step.protocol}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Latency:</span>
                    <span className={`font-mono font-bold ${getLatencyColor(step.latency)}`}>
                      {step.latency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Throughput:</span>
                    <span className="text-white font-mono font-bold">{step.throughput}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Security:</span>
                    <div className="flex items-center space-x-1">
                      <Lock className={`w-4 h-4 ${getSecurityColor(step.security)}`} />
                      <span className={`capitalize font-bold ${getSecurityColor(step.security)}`}>
                        {step.security}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>

                {/* Data Format */}
                <div className="text-sm">
                  <span className="text-slate-500">Format: </span>
                  <span className="text-blue-300 font-medium">{step.dataFormat}</span>
                </div>

                {/* Click to view data hint */}
                <div className="mt-4 pt-3 border-t border-slate-600">
                  <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                    <Eye className="w-3 h-3" />
                    <span>Click to view example data</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Modal */}
      {showDataModal && modalStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <div className="flex items-center space-x-3">
                {getProtocolIcon(modalStep.icon)}
                <div>
                  <h3 className="text-xl font-bold text-white">{modalStep.name}</h3>
                  <p className="text-slate-400">{modalStep.protocol} - {modalStep.level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(modalStep.example, null, 2))}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Copy data"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Protocol Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Protocol Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Latency:</span>
                      <span className={`font-mono ${getLatencyColor(modalStep.latency)}`}>
                        {modalStep.latency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Throughput:</span>
                      <span className="text-white font-mono">{modalStep.throughput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security:</span>
                      <div className="flex items-center space-x-1">
                        <Lock className={`w-4 h-4 ${getSecurityColor(modalStep.security)}`} />
                        <span className={`capitalize ${getSecurityColor(modalStep.security)}`}>
                          {modalStep.security}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Format:</span>
                      <span className="text-blue-300">{modalStep.dataFormat}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                  <p className="text-slate-300 leading-relaxed">{modalStep.description}</p>
                </div>
              </div>

              {/* Example Data */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Example Data</h4>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(modalStep.example, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Comparison Matrix */}
      <div className="mt-16">
        <h3 className="text-xl font-bold text-white mb-6">Protocol Comparison Matrix</h3>
        
        <div className="bg-slate-800 border border-slate-600 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Protocol</th>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Use Case</th>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Latency</th>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Throughput</th>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Security</th>
                  <th className="px-6 py-4 text-left text-white text-sm font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {PROTOCOL_STEPS.map((step, index) => (
                  <tr key={step.id} className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'} hover:bg-slate-700 transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getProtocolIcon(step.icon)}
                        <span className="text-white text-sm font-medium">{step.protocol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{step.level}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-mono font-bold ${getLatencyColor(step.latency)}`}>
                        {step.latency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm font-mono">{step.throughput}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Lock className={`w-4 h-4 ${getSecurityColor(step.security)}`} />
                        <span className={`text-sm capitalize ${getSecurityColor(step.security)}`}>
                          {step.security}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{step.description.split(' ').slice(0, 6).join(' ')}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Timer className="w-6 h-6 text-blue-400" />
            <h4 className="text-white font-semibold text-lg">End-to-End Latency</h4>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">~3.2s</div>
          <p className="text-slate-400">Field sensor to Delta Share</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <BarChart3 className="w-6 h-6 text-green-400" />
            <h4 className="text-white font-semibold text-lg">Data Transformation</h4>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
          <p className="text-slate-400">Volume reduction through aggregation</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Lock className="w-6 h-6 text-yellow-400" />
            <h4 className="text-white font-semibold text-lg">Security Layers</h4>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
          <p className="text-slate-400">Authentication, encryption, authorization, audit</p>
        </div>
      </div>
    </div>
  );
};

export default ProtocolTransition;
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  Wifi, 
  Cloud,
  Activity,
  Zap,
  Timer
} from 'lucide-react';

interface LatencyTransition {
  from: string;
  to: string;
  latency: string;
  protocol: string;
  description: string;
  type: 'vertical' | 'horizontal' | 'edge' | 'cloud';
}

const LATENCY_TRANSITIONS: LatencyTransition[] = [
  {
    from: 'Level 0 (Field)',
    to: 'Level 1 (Control)',
    latency: '5-15ms',
    protocol: 'OPC UA',
    description: 'Sensor readings to PLC processing',
    type: 'vertical'
  },
  {
    from: 'Level 1 (Control)',
    to: 'Level 2 (SCADA)',
    latency: '20-50ms',
    protocol: 'Ethernet/IP',
    description: 'Control commands to HMI displays',
    type: 'vertical'
  },
  {
    from: 'Level 2 (SCADA)',
    to: 'Level 3 (MES)',
    latency: '100ms-1s',
    protocol: 'REST API',
    description: 'Operational data to production systems',
    type: 'vertical'
  },
  {
    from: 'Level 3 (MES)',
    to: 'Level 4 (ERP)',
    latency: '1-10s',
    protocol: 'Database',
    description: 'Production reports to business systems',
    type: 'vertical'
  },
  {
    from: 'Level 4 (ERP)',
    to: 'Level 5 (BI)',
    latency: '10s-5min',
    protocol: 'ETL Pipeline',
    description: 'Business data to analytics platform',
    type: 'vertical'
  },
  {
    from: 'Level 0-2 (Operational)',
    to: 'Edge Gateway',
    latency: '2-8ms',
    protocol: 'Edge Computing',
    description: 'Real-time local processing',
    type: 'edge'
  },
  {
    from: 'Level 3-5 (Business)',
    to: 'Cloud Analytics',
    latency: '50-200ms',
    protocol: 'HTTPS/REST',
    description: 'Cloud-based analytics and ML',
    type: 'cloud'
  },
  {
    from: 'Control Room',
    to: 'Mobile Devices',
    latency: '100-500ms',
    protocol: 'WebSocket',
    description: 'Remote monitoring and alerts',
    type: 'horizontal'
  }
];

const getLatencyColor = (latency: string) => {
  const value = latency.toLowerCase();
  if (value.includes('ms') && !value.includes('100ms')) {
    return 'text-green-400'; // Fast - milliseconds
  } else if (value.includes('100ms') || value.includes('1s')) {
    return 'text-yellow-400'; // Medium - hundreds of ms to 1s
  } else if (value.includes('s') && !value.includes('ms')) {
    return 'text-orange-400'; // Slow - seconds
  } else {
    return 'text-red-400'; // Very slow - minutes
  }
};

const getTransitionIcon = (type: string) => {
  const iconProps = { className: "w-4 h-4" };
  switch (type) {
    case 'vertical': return <ArrowDown {...iconProps} />;
    case 'horizontal': return <ArrowRight {...iconProps} />;
    case 'edge': return <Zap {...iconProps} />;
    case 'cloud': return <Cloud {...iconProps} />;
    default: return <Activity {...iconProps} />;
  }
};

interface LatencyMetricsProps {
  selectedLevel?: number;
  showRealTime?: boolean;
  className?: string;
}

export const LatencyMetrics: React.FC<LatencyMetricsProps> = ({
  selectedLevel,
  showRealTime = false,
  className = ''
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<Record<string, number>>({});
  const [animating, setAnimating] = useState(false);

  // Simulate real-time latency updates
  useEffect(() => {
    if (!showRealTime) return;

    const interval = setInterval(() => {
      const newMetrics: Record<string, number> = {};
      LATENCY_TRANSITIONS.forEach((transition, index) => {
        // Simulate varying latencies within the specified range
        const baseLatency = parseFloat(transition.latency.split('-')[0]) || 1;
        const variation = Math.random() * 0.3 - 0.15; // ±15% variation
        newMetrics[`transition-${index}`] = baseLatency * (1 + variation);
      });
      setCurrentMetrics(newMetrics);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 200);
    }, 2000);

    return () => clearInterval(interval);
  }, [showRealTime]);

  const filteredTransitions = selectedLevel !== undefined 
    ? LATENCY_TRANSITIONS.filter(t => 
        t.from.includes(`Level ${selectedLevel}`) || 
        t.to.includes(`Level ${selectedLevel}`)
      )
    : LATENCY_TRANSITIONS;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <span>Latency Metrics</span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Real-time data flow latencies across ISA-95 levels
          </p>
        </div>
        {showRealTime && (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${animating ? 'bg-green-400' : 'bg-gray-500'} transition-colors`} />
            <span className="text-xs text-slate-400">Live Updates</span>
          </div>
        )}
      </div>

      {/* Latency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTransitions.map((transition, index) => {
          const currentLatency = currentMetrics[`transition-${index}`];
          const displayLatency = showRealTime && currentLatency 
            ? `${currentLatency.toFixed(1)}ms`
            : transition.latency;

          return (
            <div
              key={index}
              className={`
                bg-slate-800 border border-slate-600 rounded-lg p-4
                transition-all duration-200
                ${animating && currentLatency ? 'ring-2 ring-blue-400/30' : ''}
                hover:border-slate-500 hover:bg-slate-700/50
              `}
            >
              {/* Transition Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTransitionIcon(transition.type)}
                  <span className="text-slate-300 text-sm font-medium">
                    {transition.protocol}
                  </span>
                </div>
                <div className={`text-sm font-mono font-bold ${getLatencyColor(displayLatency)}`}>
                  {displayLatency}
                </div>
              </div>

              {/* Data Flow Path */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-xs text-slate-400 truncate">
                    {transition.from}
                  </span>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <ArrowDown className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">
                    {transition.description}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-slate-400 truncate">
                    {transition.to}
                  </span>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Performance</span>
                <div className="flex items-center space-x-1">
                  {transition.latency.includes('ms') && !transition.latency.includes('100ms') ? (
                    <>
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                      <span className="text-green-400">Excellent</span>
                    </>
                  ) : transition.latency.includes('100ms') || transition.latency.includes('1s') ? (
                    <>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                      <span className="text-yellow-400">Good</span>
                    </>
                  ) : transition.latency.includes('s') ? (
                    <>
                      <div className="w-1 h-1 bg-orange-400 rounded-full" />
                      <span className="text-orange-400">Acceptable</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1 h-1 bg-red-400 rounded-full" />
                      <span className="text-red-400">Review</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-center">
          <div className="text-green-400 text-lg font-bold">
            {LATENCY_TRANSITIONS.filter(t => t.latency.includes('ms') && !t.latency.includes('100ms')).length}
          </div>
          <div className="text-slate-400 text-xs">Sub-100ms Paths</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-center">
          <div className="text-yellow-400 text-lg font-bold">
            {LATENCY_TRANSITIONS.filter(t => t.latency.includes('100ms') || t.latency.includes('1s')).length}
          </div>
          <div className="text-slate-400 text-xs">Near Real-time</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-center">
          <div className="text-orange-400 text-lg font-bold">
            {LATENCY_TRANSITIONS.filter(t => t.latency.includes('s') && !t.latency.includes('ms')).length}
          </div>
          <div className="text-slate-400 text-xs">Batch Processing</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-center">
          <div className="text-blue-400 text-lg font-bold">
            {LATENCY_TRANSITIONS.length}
          </div>
          <div className="text-slate-400 text-xs">Total Paths</div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-6 bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-yellow-400" />
          <span>Optimization Tips</span>
        </h4>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>• Use edge computing for time-critical control loops (&lt;10ms)</li>
          <li>• Implement caching for frequently accessed operational data</li>
          <li>• Consider async processing for non-critical business intelligence</li>
          <li>• Monitor network latency and optimize protocol selection</li>
        </ul>
      </div>
    </div>
  );
};

export default LatencyMetrics;
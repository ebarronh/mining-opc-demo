'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Info } from 'lucide-react';
import { DataFlowNode, DataFlowConnection, DataFlowParticle } from '@/types/integration';

interface DataFlowAnimatorProps {
  nodes: DataFlowNode[];
  connections: DataFlowConnection[];
  isActive?: boolean;
  particleCount?: number;
  animationSpeed?: number;
  className?: string;
  onParticleComplete?: (particleId: string, data: any) => void;
}

interface AnimatedParticle {
  id: string;
  connectionId: string;
  progress: number;
  data: any;
  timestamp: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

const getParticleColor = (connectionId: string, progress: number) => {
  // Map progress to ISA-95 levels (0-5)
  const level = Math.floor(progress * 6);
  
  // Colors representing each ISA-95 level
  const levelColors = [
    '#ef4444', // Level 0: Red - Field sensors
    '#f97316', // Level 1: Orange - Control systems  
    '#eab308', // Level 2: Yellow - SCADA
    '#22c55e', // Level 3: Green - MES
    '#3b82f6', // Level 4: Blue - ERP
    '#8b5cf6'  // Level 5: Purple - Business Intelligence
  ];
  
  return levelColors[Math.min(level, 5)];
};

const getConnectionPath = (from: DataFlowNode, to: DataFlowNode) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    length: distance,
    angle: Math.atan2(dy, dx),
    controlPoints: [
      { x: from.x + dx * 0.3, y: from.y + dy * 0.1 },
      { x: from.x + dx * 0.7, y: to.y - dy * 0.1 }
    ]
  };
};

const interpolatePosition = (
  from: DataFlowNode, 
  to: DataFlowNode, 
  progress: number
): { x: number; y: number } => {
  // Use bezier curve for smooth animation
  const path = getConnectionPath(from, to);
  const t = Math.max(0, Math.min(1, progress));
  
  // Cubic bezier interpolation
  const p0 = { x: from.x, y: from.y };
  const p1 = path.controlPoints[0];
  const p2 = path.controlPoints[1];
  const p3 = { x: to.x, y: to.y };
  
  const x = Math.pow(1 - t, 3) * p0.x + 
           3 * Math.pow(1 - t, 2) * t * p1.x + 
           3 * (1 - t) * Math.pow(t, 2) * p2.x + 
           Math.pow(t, 3) * p3.x;
           
  const y = Math.pow(1 - t, 3) * p0.y + 
           3 * Math.pow(1 - t, 2) * t * p1.y + 
           3 * (1 - t) * Math.pow(t, 2) * p2.y + 
           Math.pow(t, 3) * p3.y;
           
  return { x, y };
};

export const DataFlowAnimator: React.FC<DataFlowAnimatorProps> = ({
  nodes,
  connections,
  isActive = true,
  particleCount = 20,
  animationSpeed = 1,
  className = '',
  onParticleComplete
}) => {
  const [particles, setParticles] = useState<AnimatedParticle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // Create node lookup map
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, DataFlowNode>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  // Initialize particles
  const createParticle = useCallback((connection: DataFlowConnection): AnimatedParticle => {
    const fromNode = nodeMap.get(connection.from);
    const toNode = nodeMap.get(connection.to);
    
    if (!fromNode || !toNode) {
      throw new Error(`Invalid connection: ${connection.from} -> ${connection.to}`);
    }

    return {
      id: `particle_${Date.now()}_${Math.random()}`,
      connectionId: connection.id,
      progress: 0,
      data: {
        type: fromNode.type,
        value: Math.random() * 100,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      x: fromNode.x,
      y: fromNode.y,
      vx: 0,
      vy: 0,
      color: getParticleColor(connection.id, 0),
      size: 3 + Math.random() * 2,
      opacity: 0.8 + Math.random() * 0.2,
      trail: []
    };
  }, [nodeMap]);

  // Update particle positions
  const updateParticles = useCallback((deltaTime: number) => {
    if (!isActive) return;

    setParticles(prevParticles => {
      const updatedParticles: AnimatedParticle[] = [];

      prevParticles.forEach(particle => {
        const connection = connections.find(c => c.id === particle.connectionId);
        if (!connection) return;

        const fromNode = nodeMap.get(connection.from);
        const toNode = nodeMap.get(connection.to);
        if (!fromNode || !toNode) return;

        // Update progress
        const speed = animationSpeed * (1 + connection.dataVolume / 1000);
        particle.progress += (deltaTime / 1000) * speed * 0.1;

        if (particle.progress >= 1) {
          // Particle completed journey
          onParticleComplete?.(particle.id, particle.data);
          return;
        }

        // Update position
        const newPos = interpolatePosition(fromNode, toNode, particle.progress);
        
        // Add to trail
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: particle.opacity * 0.5
        });

        // Limit trail length
        if (particle.trail.length > 8) {
          particle.trail.shift();
        }

        // Update particle
        particle.x = newPos.x;
        particle.y = newPos.y;
        particle.color = getParticleColor(connection.id, particle.progress);
        particle.opacity = Math.max(0.3, 1 - particle.progress * 0.3);

        updatedParticles.push(particle);
      });

      // Add new particles randomly
      if (updatedParticles.length < particleCount && Math.random() < 0.1) {
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        if (randomConnection) {
          try {
            updatedParticles.push(createParticle(randomConnection));
          } catch (error) {
            console.warn('Failed to create particle:', error);
          }
        }
      }

      return updatedParticles;
    });
  }, [isActive, connections, nodeMap, animationSpeed, particleCount, onParticleComplete, createParticle]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (deltaTime > 0) {
      updateParticles(deltaTime);
    }

    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [updateParticles, isActive]);

  // Start/stop animation
  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, animate]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw connection paths
    connections.forEach(connection => {
      const fromNode = nodeMap.get(connection.from);
      const toNode = nodeMap.get(connection.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      
      const path = getConnectionPath(fromNode, toNode);
      ctx.bezierCurveTo(
        path.controlPoints[0].x, path.controlPoints[0].y,
        path.controlPoints[1].x, path.controlPoints[1].y,
        toNode.x, toNode.y
      );
      
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw particles and trails
    particles.forEach(particle => {
      // Draw trail
      particle.trail.forEach((trailPoint, index) => {
        ctx.beginPath();
        ctx.arc(trailPoint.x, trailPoint.y, particle.size * 0.3, 0, Math.PI * 2);
        const hex = Math.floor(trailPoint.opacity * 255).toString(16);
        ctx.fillStyle = `${particle.color}${hex.length === 1 ? '0' + hex : hex}`;
        ctx.fill();
      });

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      
      // Gradient fill
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, particle.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    nodes.forEach(node => {
      const nodeColor = node.status === 'active' ? '#22c55e' : 
                       node.status === 'error' ? '#ef4444' : '#6b7280';
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [particles, connections, nodes, nodeMap, dimensions]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Canvas Label - moved to top center to be less intrusive */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur rounded-lg px-3 py-1 z-10 text-center">
        <div className="text-xs font-medium text-white">From Ore Sample to Business Decision</div>
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Animation controls - moved to top right corner */}
      <div className="absolute top-2 right-2 flex items-center space-x-2 bg-slate-800/90 backdrop-blur rounded-lg px-2 py-1">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs text-white">
          {particles.length} samples
        </span>
      </div>

      {/* Simple Legend - moved to bottom left, made smaller */}
      <div className="absolute bottom-2 left-2 bg-slate-800/90 backdrop-blur rounded-lg p-2 text-xs">
        <div className="text-white font-medium mb-1 text-xs">Quick Guide</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300 text-xs">Systems</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            <span className="text-slate-300 text-xs">Data</span>
          </div>
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Follow red→purple
        </div>
      </div>

      {/* Help Info - positioned in bottom right with full detailed tooltip */}
      <div className="absolute bottom-2 right-2 group">
        <div className="bg-slate-800/90 backdrop-blur rounded-full p-2 cursor-help">
          <Info className="w-4 h-4 text-slate-400 hover:text-blue-400 transition-colors" />
        </div>
        <div className="fixed bottom-12 right-0 w-96 p-4 bg-slate-900 border border-slate-600 rounded-lg text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none shadow-2xl">
          <div className="font-medium text-white mb-3 text-lg">Mining Data Flow Guide</div>
          
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
            <div className="font-medium text-blue-300 mb-2">What You're Watching:</div>
            <p className="text-sm text-blue-200">Moving dots represent ore sample readings traveling through different levels of mining information systems, demonstrating the ISA-95 data pyramid in action.</p>
          </div>

          <div className="mb-4">
            <div className="font-medium text-white mb-2">Complete Data Journey:</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Level 0: Ore Analyzer (XRF readings, GPS data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Level 1: Control Systems (PLCs, safety interlocks)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Level 2: SCADA (HMI displays, trend data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Level 3: Production (MES, quality control)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Level 4: Business (ERP, financial systems)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Level 5: Executive (BI, strategic planning)</span>
              </div>
            </div>
          </div>

          <div className="mb-4 border-t border-slate-700 pt-3">
            <div className="font-medium text-white mb-2">Visual Elements:</div>
            <div className="space-y-2 text-sm">
              <div><strong>Large Circles:</strong> Computer systems and databases at each level</div>
              <div><strong>Moving Dots:</strong> Data packets flowing between systems</div>
              <div><strong>Color Changes:</strong> Data transformation as it moves up the pyramid</div>
              <div><strong>Curved Paths:</strong> Network connections and data flow routes</div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-3">
            <div className="font-medium text-white mb-2">Real-World Context:</div>
            <p className="text-sm text-slate-400">
              This animation demonstrates how a single ore sample reading travels from field sensors 
              through multiple information systems, getting processed and aggregated at each level to 
              eventually inform executive decisions about mining operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowAnimator;
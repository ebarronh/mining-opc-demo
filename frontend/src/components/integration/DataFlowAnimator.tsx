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
  // Color based on data type and progress
  const colors = {
    sensor: '#ef4444', // red
    control: '#f97316', // orange  
    scada: '#eab308', // yellow
    mes: '#22c55e', // green
    erp: '#3b82f6', // blue
    bi: '#8b5cf6' // purple
  };
  
  // Animate color transition based on progress
  const baseColor = colors.sensor;
  const targetColor = colors.bi;
  
  // Simple color interpolation
  return progress < 0.5 ? baseColor : targetColor;
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
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Animation controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-800/80 backdrop-blur rounded-lg px-3 py-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs text-white">
          {isActive ? 'Data Flow Active' : 'Data Flow Paused'}
        </span>
        <span className="text-xs text-slate-400">
          {particles.length} particles
        </span>
      </div>

      {/* Data Flow Metrics */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur rounded-lg p-3 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-xs font-medium text-white">Real-time Data Flow</div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="group relative">
            <Info className="w-3 h-3 text-slate-400 hover:text-blue-400 cursor-help" />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-slate-900 border border-slate-600 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              <div className="font-medium text-white mb-1">Data Flow Animation</div>
              <p className="mb-2">Each particle represents sensor data flowing through ISA-95 levels:</p>
              <ul className="space-y-1 text-xs">
                <li><span className="text-red-400">Red:</span> Raw sensor data (Level 0)</li>
                <li><span className="text-orange-400">Orange:</span> Control signals (Level 1)</li>
                <li><span className="text-yellow-400">Yellow:</span> SCADA data (Level 2)</li>
                <li><span className="text-green-400">Green:</span> Production data (Level 3)</li>
                <li><span className="text-blue-400">Blue:</span> Business data (Level 4)</li>
                <li><span className="text-purple-400">Purple:</span> Analytics insights (Level 5)</li>
              </ul>
              <p className="mt-2 text-slate-400">Watch how data gets progressively aggregated and enriched!</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-green-400 font-mono text-sm">{particles.length}</div>
            <div className="text-slate-400">Data Packets</div>
            <div className="text-slate-500 text-xs">in transit</div>
          </div>
          <div>
            <div className="text-blue-400 font-mono text-sm">
              {(particles.reduce((sum, p) => sum + (p.data?.value || 45), 0) / particles.length || 45).toFixed(0)}
            </div>
            <div className="text-slate-400">Readings/sec</div>
            <div className="text-slate-500 text-xs">avg rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowAnimator;
'use client';

import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Monitor, Activity, Eye, Zap } from 'lucide-react';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  points: number;
  lines: number;
  culledObjects: number;
  totalObjects: number;
  visibilityRatio: number;
}

interface PerformanceMonitorProps {
  visible?: boolean;
  onToggle?: () => void;
  cullingStats?: {
    visibleObjects: string[];
    culledObjects: string[];
    totalObjects: number;
    visibilityRatio: number;
  };
}

export function PerformanceMonitor({ 
  visible = false, 
  onToggle,
  cullingStats 
}: PerformanceMonitorProps) {
  const { gl } = useThree();
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
    points: 0,
    lines: 0,
    culledObjects: 0,
    totalObjects: 0,
    visibilityRatio: 1
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const frameTimeHistoryRef = useRef<number[]>([]);

  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    // Update every 60 frames (roughly once per second at 60fps)
    if (frameCountRef.current % 60 === 0) {
      const fps = 1000 / deltaTime * 60; // Average FPS over 60 frames
      const frameTime = deltaTime / 60; // Average frame time

      // Update FPS history for smoothing
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      // Update frame time history
      frameTimeHistoryRef.current.push(frameTime);
      if (frameTimeHistoryRef.current.length > 10) {
        frameTimeHistoryRef.current.shift();
      }

      // Calculate smoothed values
      const smoothedFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      const smoothedFrameTime = frameTimeHistoryRef.current.reduce((a, b) => a + b, 0) / frameTimeHistoryRef.current.length;

      // Get render info
      const renderInfo = gl.info.render;
      
      // Get memory usage (if available)
      let memoryUsage = 0;
      if ('memory' in performance && performance.memory) {
        memoryUsage = (performance.memory as any).usedJSHeapSize / 1024 / 1024; // MB
      }

      setStats({
        fps: Math.round(smoothedFPS),
        frameTime: Math.round(smoothedFrameTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        drawCalls: renderInfo.calls,
        triangles: renderInfo.triangles,
        points: renderInfo.points,
        lines: renderInfo.lines,
        culledObjects: cullingStats?.culledObjects.length || 0,
        totalObjects: cullingStats?.totalObjects || 0,
        visibilityRatio: cullingStats?.visibilityRatio || 1
      });

      lastTimeRef.current = currentTime;
    }
  });

  // Performance classification
  const getPerformanceClass = (fps: number) => {
    if (fps >= 55) return { color: 'text-green-400', bg: 'bg-green-500/10', status: 'Excellent' };
    if (fps >= 30) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', status: 'Good' };
    if (fps >= 15) return { color: 'text-orange-400', bg: 'bg-orange-500/10', status: 'Poor' };
    return { color: 'text-red-400', bg: 'bg-red-500/10', status: 'Critical' };
  };

  const perfClass = getPerformanceClass(stats.fps);

  if (!visible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="p-2 bg-slate-800/90 hover:bg-slate-700/90 rounded-lg border border-slate-600 transition-colors"
          title="Show Performance Monitor"
        >
          <Activity className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-600 p-4 min-w-[280px] text-sm font-mono">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-blue-400" />
          <span className="text-white font-semibold">Performance</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Hide Performance Monitor"
        >
          <Eye className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* FPS and Frame Time */}
      <div className={`p-2 rounded mb-3 ${perfClass.bg}`}>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">FPS:</span>
          <span className={`font-bold ${perfClass.color}`}>{stats.fps}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Frame Time:</span>
          <span className="text-white">{stats.frameTime}ms</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Status: <span className={perfClass.color}>{perfClass.status}</span>
        </div>
      </div>

      {/* Render Stats */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center space-x-1 mb-2">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400 font-semibold text-xs">RENDER STATS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Draw Calls:</span>
          <span className="text-white">{stats.drawCalls.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Triangles:</span>
          <span className="text-white">{stats.triangles.toLocaleString()}</span>
        </div>
        {stats.points > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-300">Points:</span>
            <span className="text-white">{stats.points.toLocaleString()}</span>
          </div>
        )}
        {stats.lines > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-300">Lines:</span>
            <span className="text-white">{stats.lines.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Culling Stats */}
      {stats.totalObjects > 0 && (
        <div className="space-y-1 mb-3">
          <div className="flex items-center space-x-1 mb-2">
            <Eye className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 font-semibold text-xs">CULLING</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Visible:</span>
            <span className="text-green-400">{stats.totalObjects - stats.culledObjects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Culled:</span>
            <span className="text-red-400">{stats.culledObjects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Ratio:</span>
            <span className="text-white">{Math.round(stats.visibilityRatio * 100)}%</span>
          </div>
        </div>
      )}

      {/* Memory Usage */}
      {stats.memoryUsage > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-300">Memory:</span>
            <span className="text-white">{stats.memoryUsage} MB</span>
          </div>
        </div>
      )}

      {/* Performance Warnings */}
      {stats.fps < 30 && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
          <div className="text-red-400 font-semibold">Performance Warning</div>
          <div className="text-red-300">
            {stats.fps < 15 
              ? 'Critical: Consider reducing visual quality'
              : 'Low FPS: Check LOD settings and culling'
            }
          </div>
        </div>
      )}

      {stats.drawCalls > 100 && (
        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
          <div className="text-yellow-400 font-semibold">High Draw Calls</div>
          <div className="text-yellow-300">Consider using instanced rendering</div>
        </div>
      )}
    </div>
  );
}

// React Three Fiber integration helper
export function PerformanceStats() {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'p' || event.key === 'P') {
        setShowStats(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <PerformanceMonitor 
      visible={showStats}
      onToggle={() => setShowStats(!showStats)}
    />
  );
}
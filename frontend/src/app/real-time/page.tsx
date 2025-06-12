import { AppLayout } from '@/components/layout/AppLayout'
import { WebSocketStatus } from '@/components/websocket/WebSocketStatus'
import { Box, Activity, MapPin, Thermometer, BarChart3, Play } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real-time Monitor - MineSensors OPC UA',
  description: '3D mine pit visualization with live equipment tracking'
}

export default function RealTimePage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Real-time Monitor</h1>
            <p className="text-slate-400">3D mine pit visualization with live equipment tracking</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 font-medium">Coming in Phase 4</span>
          </div>
          <p className="text-blue-300 text-sm">
            Next phase will implement Three.js 3D visualization with real-time WebSocket data integration
          </p>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* 3D Visualization Preview */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Box className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">3D Mine Pit Visualization</h3>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <Box className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Three.js WebGL Canvas</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Interactive 3D mine pit model</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Camera controls and zoom</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Topographic elevation mapping</span>
            </li>
          </ul>
        </div>

        {/* Equipment Tracking Preview */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Live Equipment Tracking</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Excavator EX001</span>
              </div>
              <span className="text-green-400 text-xs">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Truck TR001</span>
              </div>
              <span className="text-blue-400 text-xs">Moving</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-sm">Conveyor CV001</span>
              </div>
              <span className="text-yellow-400 text-xs">Running</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>GPS positioning with 1m accuracy</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>Real-time status updates</span>
            </li>
          </ul>
        </div>

        {/* Grade Heatmap Preview */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Grade Heatmap Overlay</h3>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-8 gap-1 h-16">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    i % 4 === 0 ? 'bg-red-500/80' :
                    i % 4 === 1 ? 'bg-orange-500/60' :
                    i % 4 === 2 ? 'bg-yellow-500/40' :
                    'bg-green-500/30'
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>0.5 g/t</span>
              <span>8.0 g/t Au</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              <span>Grade visualization 0.5-8.0 g/t Au</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              <span>Economic cutoff indicators</span>
            </li>
          </ul>
        </div>

        {/* WebSocket Data Stream */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Real-time Data Stream</h3>
          </div>
          <WebSocketStatus showDetails={false} className="mb-4" />
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>WebSocket connection established</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>2-second update intervals</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Equipment telemetry streaming</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">3D Graphics</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Three.js WebGL</li>
              <li>• 60fps target</li>
              <li>• Intel UHD Graphics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Data Updates</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• &lt;2s latency</li>
              <li>• WebSocket streaming</li>
              <li>• 7 equipment nodes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Mining Data</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Ore grade (g/t Au)</li>
              <li>• GPS coordinates</li>
              <li>• Production metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Compliance</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• OPC UA Mining v1.0</li>
              <li>• ISA-95 hierarchy</li>
              <li>• Standards-based</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
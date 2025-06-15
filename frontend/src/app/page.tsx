'use client'


import { AppLayout } from '@/components/layout/AppLayout'
import { SystemStatus } from '@/components/status/SystemStatus'
import { WebSocketStatus } from '@/components/websocket/WebSocketStatus'
import { useWebSocketContext } from '@/providers/WebSocketProvider'
import Link from 'next/link'
import { BarChart3, Globe, Link as LinkIcon, CheckCircle, Pickaxe, Activity, Zap } from 'lucide-react'

function HomeContent() {
  const { 
    isConnected, 
    equipmentPositions, 
    gradeData, 
    opcUaUpdates 
  } = useWebSocketContext();

  const activeEquipmentCount = equipmentPositions.filter(eq => eq.status === 'operating').length;
  const averageGrade = gradeData?.statistics?.averageGrade || 0;
  const recentUpdatesCount = opcUaUpdates.length;

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12 fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-4 mining-gradient rounded-2xl pulse-glow shadow-2xl">
            <Pickaxe className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          MineSensors OPC UA
          <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
            Mining Demo
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
          Executive-ready, standards-based real-time ore intelligence platform showcasing 
          <span className="text-blue-400 font-semibold"> OPC UA Mining Companion Specification</span> 
          with enterprise-grade integration capabilities
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="w-1 h-4 bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3" />
            <span>{activeEquipmentCount} Active Equipment</span>
          </div>
          <div className="w-1 h-4 bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <span>{averageGrade.toFixed(1)}% Avg Grade</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link 
          href="/real-time" 
          className="group executive-card p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Real-time Monitor
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                3D mine pit visualization with live equipment tracking, grade heatmaps, and real-time data streaming
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-blue-400">Active Now →</span>
                {equipmentPositions.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{equipmentPositions.length} devices</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/explorer" 
          className="group executive-card p-8 transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                OPC UA Explorer
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Browse hierarchical mining equipment nodes, subscribe to live values, and explore the OPC UA address space
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-green-400">Active Now →</span>
                {recentUpdatesCount > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-green-400">
                    <Zap className="w-3 h-3" />
                    <span>{recentUpdatesCount} updates</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/integration" 
          className="group executive-card p-8 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <LinkIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Integration Hub
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                ISA-95 enterprise integration flow, FMS connectivity cards, and throughput performance metrics
              </p>
              <div className="mt-3 text-sm text-purple-400">
                Coming in Phase 5 →
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/compliance" 
          className="group executive-card p-8 transition-all duration-300 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
              <CheckCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                Compliance Dashboard
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                OPC UA Mining Companion Specification compliance tracking and regulatory audit capabilities
              </p>
              <div className="mt-3 text-sm text-yellow-400">
                Coming in Phase 5 →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Live Data Dashboard */}
      {isConnected && (equipmentPositions.length > 0 || gradeData || opcUaUpdates.length > 0) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Live Data Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Equipment Status */}
            <div className="executive-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Equipment</h3>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-white font-medium">{equipmentPositions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating:</span>
                  <span className="text-green-400 font-medium">{activeEquipmentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Idle:</span>
                  <span className="text-yellow-400 font-medium">{
                    equipmentPositions.filter(eq => eq.status === 'idle').length
                  }</span>
                </div>
              </div>
            </div>
            
            {/* Grade Data */}
            {gradeData && (
              <div className="executive-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Grade Data</h3>
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average:</span>
                    <span className="text-white font-medium">{gradeData.statistics.averageGrade.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max:</span>
                    <span className="text-green-400 font-medium">{gradeData.statistics.maxGrade.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min:</span>
                    <span className="text-red-400 font-medium">{gradeData.statistics.minGrade.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* OPC UA Updates */}
            <div className="executive-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">OPC UA</h3>
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recent Updates:</span>
                  <span className="text-white font-medium">{opcUaUpdates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                {opcUaUpdates.length > 0 && (
                  <div className="text-xs text-slate-500 mt-2">
                    Last: {new Date(opcUaUpdates[opcUaUpdates.length - 1]?.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStatus />
        </div>
        <div>
          <WebSocketStatus showDetails={true} />
        </div>
      </div>
    </>
  )
}

export default function Home() {
  return (
    <AppLayout>
      <HomeContent />
    </AppLayout>
  )
}

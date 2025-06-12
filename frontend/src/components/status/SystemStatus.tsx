'use client'

import { useSystemStatus } from '@/hooks/useSystemStatus'
import { Activity, Server, Wifi, Cpu, AlertTriangle, RefreshCw, Clock } from 'lucide-react'
import { useState } from 'react'

interface StatusIndicatorProps {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline'
  label: string
  description: string
  value?: string | number
  icon: React.ReactNode
}

function StatusIndicator({ status, label, description, value, icon }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-400'
      case 'degraded': return 'bg-yellow-400'
      case 'unhealthy': return 'bg-red-400'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'healthy': return 'Online'
      case 'degraded': return 'Degraded'
      case 'unhealthy': return 'Offline'
      case 'offline': return 'Disconnected'
      default: return 'Unknown'
    }
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
      <div className="flex-shrink-0">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${status === 'healthy' ? 'animate-pulse' : ''}`}></div>
      </div>
      <div className="flex-shrink-0 text-slate-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium truncate">{label}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'healthy' ? 'bg-green-400/20 text-green-400' :
            status === 'degraded' ? 'bg-yellow-400/20 text-yellow-400' :
            'bg-red-400/20 text-red-400'
          }`}>
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-slate-400 truncate">{description}</p>
        {value && (
          <p className="text-xs text-blue-400 mt-1">{value}</p>
        )}
      </div>
    </div>
  )
}

export function SystemStatus() {
  const { status, loading, error, lastUpdate, refetch } = useSystemStatus(5000)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    refetch()
    // Add a small delay to show the refresh animation
    setTimeout(() => setIsRefreshing(false), 500)
  }

  if (loading && !status) {
    return (
      <div className="executive-card p-6 fade-in system-status-section">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
          <h2 className="text-xl font-semibold text-white">System Status</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg animate-pulse">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <div className="w-5 h-5 bg-slate-600 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getOverallStatus = (): 'healthy' | 'degraded' | 'unhealthy' | 'offline' => {
    if (error) return 'offline'
    if (!status) return 'offline'
    return status.status
  }

  const getOpcUaStatus = (): 'healthy' | 'degraded' | 'unhealthy' | 'offline' => {
    if (error || !status) return 'offline'
    if (!status.opcua.server_running) return 'unhealthy'
    if (status.opcua.data_updates_per_second === 0) return 'degraded'
    return 'healthy'
  }

  const getWebSocketStatus = (): 'healthy' | 'degraded' | 'unhealthy' | 'offline' => {
    if (error || !status) return 'offline'
    if (status.websocket.active_connections > 0) return 'healthy'
    return 'degraded'
  }

  const getSimulationStatus = (): 'healthy' | 'degraded' | 'unhealthy' | 'offline' => {
    if (error || !status) return 'offline'
    if (status.simulation.equipment_count === 7) return 'healthy'
    if (status.simulation.equipment_count > 0) return 'degraded'
    return 'unhealthy'
  }

  return (
    <div className="executive-card p-6 fade-in system-status-section">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">System Status</h2>
          {error && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Connection Failed</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Unable to connect to backend</span>
          </div>
          <p className="text-sm text-red-300">
            {error}. Make sure the Phase 2 backend server is running on <code className="bg-slate-700 px-1 rounded">localhost:3001</code>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <StatusIndicator
            status={getOpcUaStatus()}
            icon={<Server className="w-5 h-5" />}
            label="OPC UA Server"
            description={status ? `${status.simulation.equipment_count} equipment nodes active` : 'Phase 2 Mining Simulation'}
            value={status ? `${status.opcua.data_updates_per_second.toFixed(1)} updates/sec` : undefined}
          />
          
          <StatusIndicator
            status={getWebSocketStatus()}
            icon={<Wifi className="w-5 h-5" />}
            label="WebSocket Bridge"
            description="Real-time data streaming foundation"
            value={status ? `${status.websocket.active_connections} active connections` : undefined}
          />
          
          <StatusIndicator
            status={getSimulationStatus()}
            icon={<Cpu className="w-5 h-5" />}
            label="Mining Simulation"
            description="Equipment simulation engine"
            value={status ? `${status.simulation.scenarios_running.length} scenarios running` : undefined}
          />
        </div>
      )}
    </div>
  )
}
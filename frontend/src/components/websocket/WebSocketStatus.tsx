'use client'

import { useWebSocketContext } from '@/providers/WebSocketProvider'
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Zap } from 'lucide-react'

interface WebSocketStatusProps {
  showDetails?: boolean
  className?: string
}

export function WebSocketStatus({ showDetails = false, className = '' }: WebSocketStatusProps) {
  const { 
    state, 
    isConnected, 
    connectionAttempts, 
    lastMessage, 
    messageHistory, 
    reconnect, 
    ping,
    equipmentPositions,
    gradeData,
    opcUaUpdates
  } = useWebSocketContext()

  const getStatusIcon = () => {
    switch (state) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-400" />
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'disconnected':
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (state) {
      case 'connected':
        return 'WebSocket Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return `Connection Failed (${connectionAttempts} attempts)`
      case 'disconnected':
      default:
        return 'WebSocket Disconnected'
    }
  }

  const getStatusColor = () => {
    switch (state) {
      case 'connected':
        return 'text-green-400'
      case 'connecting':
        return 'text-blue-400'
      case 'error':
        return 'text-red-400'
      case 'disconnected':
      default:
        return 'text-gray-400'
    }
  }

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    )
  }

  return (
    <div className={`executive-card p-4 fade-in ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <button
              onClick={ping}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Send ping"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={reconnect}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Reconnect"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Connection Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">URL:</span>
          <span className="text-white font-mono text-xs">ws://localhost:4841/ws</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">State:</span>
          <span className={getStatusColor()}>{state}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Connection Attempts:</span>
          <span className="text-white">{connectionAttempts}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Messages Received:</span>
          <span className="text-white">{messageHistory.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Equipment Positions:</span>
          <span className="text-white">{equipmentPositions.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Grade Data:</span>
          <span className="text-white">{gradeData ? 'Available' : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">OPC UA Updates:</span>
          <span className="text-white">{opcUaUpdates.length}</span>
        </div>
        {lastMessage && (
          <div className="flex justify-between">
            <span className="text-slate-400">Last Message:</span>
            <span className="text-blue-400">{lastMessage.type}</span>
          </div>
        )}
      </div>

      {/* Recent Messages */}
      {messageHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Messages</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {messageHistory.slice(0, 5).map((msg, index) => {
              const isNewType = ['equipment_positions', 'grade_data', 'opcua_updates'].includes(msg.type);
              return (
                <div key={index} className="flex justify-between text-xs">
                  <span className={`truncate ${
                    isNewType ? 'text-green-400 font-medium' : 'text-slate-400'
                  }`}>
                    {msg.type}
                  </span>
                  <span className="text-slate-500">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'now'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Data Status */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected && (equipmentPositions.length > 0 || gradeData || opcUaUpdates.length > 0)
              ? 'bg-green-400 animate-pulse' 
              : 'bg-slate-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            isConnected && (equipmentPositions.length > 0 || gradeData || opcUaUpdates.length > 0)
              ? 'text-green-400' 
              : 'text-slate-400'
          }`}>
            {isConnected && (equipmentPositions.length > 0 || gradeData || opcUaUpdates.length > 0)
              ? 'Live Data Active' 
              : 'Awaiting Data'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {isConnected 
            ? 'Real-time mining data streaming from OPC UA server'
            : 'Connect to see live equipment positions, grade data, and OPC UA updates'
          }
        </p>
      </div>
    </div>
  )
}
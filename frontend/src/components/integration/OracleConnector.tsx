'use client'

import React, { useState, useEffect } from 'react'
import { Database, Server, Cloud, Activity, CheckCircle, AlertCircle, Play, Pause, Code, Shield, Archive, HelpCircle } from 'lucide-react'

interface ConnectionStatus {
  database: 'connected' | 'connecting' | 'disconnected'
  ords: 'connected' | 'connecting' | 'disconnected'
  functions: 'connected' | 'connecting' | 'disconnected'
  analytics: 'connected' | 'connecting' | 'disconnected'
}

interface DatabaseMetrics {
  cpu: number
  storage: number
  connections: number
  throughput: number
}

export default function OracleConnector() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    database: 'disconnected',
    ords: 'disconnected',
    functions: 'disconnected',
    analytics: 'disconnected'
  })

  const [metrics, setMetrics] = useState<DatabaseMetrics>({
    cpu: 0,
    storage: 0,
    connections: 0,
    throughput: 0
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedService, setSelectedService] = useState<keyof ConnectionStatus>('database')
  const [activeTab, setActiveTab] = useState<'services' | 'apex' | 'architecture' | 'sql' | 'security' | 'retention' | 'troubleshooting'>('services')

  // Simulate connection process
  const connectToOracle = async () => {
    setIsConnecting(true)
    
    // Connect to Autonomous Database first
    setConnectionStatus(prev => ({ ...prev, database: 'connecting' }))
    await new Promise(resolve => setTimeout(resolve, 1500))
    setConnectionStatus(prev => ({ ...prev, database: 'connected' }))
    
    // Then ORDS
    setConnectionStatus(prev => ({ ...prev, ords: 'connecting' }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setConnectionStatus(prev => ({ ...prev, ords: 'connected' }))
    
    // Then OCI Functions
    setConnectionStatus(prev => ({ ...prev, functions: 'connecting' }))
    await new Promise(resolve => setTimeout(resolve, 800))
    setConnectionStatus(prev => ({ ...prev, functions: 'connected' }))
    
    // Finally Analytics Cloud
    setConnectionStatus(prev => ({ ...prev, analytics: 'connecting' }))
    await new Promise(resolve => setTimeout(resolve, 700))
    setConnectionStatus(prev => ({ ...prev, analytics: 'connected' }))
    
    setIsConnecting(false)
  }

  const disconnectFromOracle = () => {
    setConnectionStatus({
      database: 'disconnected',
      ords: 'disconnected',
      functions: 'disconnected',
      analytics: 'disconnected'
    })
  }

  // Simulate live metrics
  useEffect(() => {
    if (connectionStatus.database === 'connected') {
      const interval = setInterval(() => {
        setMetrics({
          cpu: Math.random() * 100,
          storage: 65 + Math.random() * 10,
          connections: Math.floor(Math.random() * 50) + 10,
          throughput: Math.random() * 1000 + 500
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [connectionStatus.database])

  const getStatusIcon = (status: ConnectionStatus[keyof ConnectionStatus]) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'connecting':
        return <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: ConnectionStatus[keyof ConnectionStatus]) => {
    switch (status) {
      case 'connected':
        return 'border-green-400/30 bg-green-400/10'
      case 'connecting':
        return 'border-yellow-400/30 bg-yellow-400/10'
      case 'disconnected':
        return 'border-red-400/30 bg-red-400/10'
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Cloud className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold text-white">Oracle Cloud Integration</h3>
        </div>
        <div className="flex items-center space-x-2">
          {!isConnecting && connectionStatus.database === 'disconnected' && (
            <button
              onClick={connectToOracle}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Connect</span>
            </button>
          )}
          {connectionStatus.database === 'connected' && (
            <button
              onClick={disconnectFromOracle}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedService === 'database' ? 'border-red-400' : 'border-slate-600'
          } ${getStatusColor(connectionStatus.database)}`}
          onClick={() => setSelectedService('database')}
        >
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-red-400" />
            {getStatusIcon(connectionStatus.database)}
          </div>
          <div className="text-sm font-medium text-white">Autonomous DB</div>
          <div className="text-xs text-slate-400 capitalize">{connectionStatus.database}</div>
        </div>

        <div 
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedService === 'ords' ? 'border-red-400' : 'border-slate-600'
          } ${getStatusColor(connectionStatus.ords)}`}
          onClick={() => setSelectedService('ords')}
        >
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-orange-400" />
            {getStatusIcon(connectionStatus.ords)}
          </div>
          <div className="text-sm font-medium text-white">ORDS APIs</div>
          <div className="text-xs text-slate-400 capitalize">{connectionStatus.ords}</div>
        </div>

        <div 
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedService === 'functions' ? 'border-red-400' : 'border-slate-600'
          } ${getStatusColor(connectionStatus.functions)}`}
          onClick={() => setSelectedService('functions')}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            {getStatusIcon(connectionStatus.functions)}
          </div>
          <div className="text-sm font-medium text-white">OCI Functions</div>
          <div className="text-xs text-slate-400 capitalize">{connectionStatus.functions}</div>
        </div>

        <div 
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedService === 'analytics' ? 'border-red-400' : 'border-slate-600'
          } ${getStatusColor(connectionStatus.analytics)}`}
          onClick={() => setSelectedService('analytics')}
        >
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-purple-400" />
            {getStatusIcon(connectionStatus.analytics)}
          </div>
          <div className="text-sm font-medium text-white">Analytics Cloud</div>
          <div className="text-xs text-slate-400 capitalize">{connectionStatus.analytics}</div>
        </div>
      </div>

      {/* Additional Oracle Features Tabs */}
      <div className="mt-6 border-b border-slate-600">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('apex')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'apex'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            APEX Apps
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'architecture'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sql'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            SQL Queries
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'retention'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Data Retention
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'troubleshooting'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Troubleshooting
          </button>
        </nav>
      </div>

      {/* Services Tab Content */}
      {activeTab === 'services' && (
        <>
      {/* Autonomous Database Visualization */}
      {selectedService === 'database' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Autonomous Database</h4>
          
          {connectionStatus.database === 'connected' ? (
            <div className="space-y-4">
              {/* Database Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{metrics.cpu.toFixed(1)}%</div>
                  <div className="text-sm text-slate-400">CPU Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{metrics.storage.toFixed(1)}%</div>
                  <div className="text-sm text-slate-400">Storage Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{metrics.connections}</div>
                  <div className="text-sm text-slate-400">Active Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{metrics.throughput.toFixed(0)}</div>
                  <div className="text-sm text-slate-400">Queries/sec</div>
                </div>
              </div>

              {/* Database Schema */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h5 className="text-md font-medium text-white mb-3">Mining Schema</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-900 p-3 rounded">
                    <div className="text-green-400 font-medium">ORE_GRADES</div>
                    <div className="text-slate-400 text-xs">1.2M records</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <div className="text-blue-400 font-medium">EQUIPMENT</div>
                    <div className="text-slate-400 text-xs">345 records</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <div className="text-purple-400 font-medium">PRODUCTION</div>
                    <div className="text-slate-400 text-xs">89K records</div>
                  </div>
                </div>
              </div>

              {/* Auto-scaling Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Auto-scaling Active</span>
                </div>
                <p className="text-green-300 text-sm">
                  Database automatically scales compute resources based on workload demands
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Connect to view Autonomous Database metrics</p>
            </div>
          )}
        </div>
      )}

      {/* ORDS API Demonstrations */}
      {selectedService === 'ords' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Oracle REST Data Services (ORDS)</h4>
          
          {connectionStatus.ords === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">ORDS APIs Active</span>
                </div>
                <p className="text-green-300 text-sm">
                  REST endpoints automatically generated from Autonomous Database mining schema
                </p>
              </div>

              {/* API Endpoints */}
              <div className="space-y-4">
                <h5 className="text-md font-medium text-white">Available Endpoints</h5>
                
                <div className="space-y-3">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-green-400 text-sm">GET /api/ore-grades</code>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">200 OK</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">Real-time ore grade data from XRF analyzers</p>
                    <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                      {`{
  "data": [
    {
      "id": 1247,
      "timestamp": "2024-01-16T15:42:30Z",
      "location": {"x": 245, "y": 120, "z": 15},
      "fe_percent": 58.3,
      "al_percent": 12.7,
      "si_percent": 15.2,
      "grade_classification": "high",
      "analyzer_id": "XRF_001"
    }
  ],
  "meta": {
    "count": 1247,
    "avg_grade": 52.1,
    "last_updated": "2024-01-16T15:42:30Z"
  }
}`}
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-blue-400 text-sm">GET /api/equipment</code>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">200 OK</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">Fleet equipment status and telemetry</p>
                    <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                      {`{
  "equipment": [
    {
      "id": "KOM-001",
      "type": "excavator",
      "model": "PC8000",
      "status": "operational",
      "location": {"x": 180, "y": 85},
      "fuel_level": 78,
      "operating_hours": 12450,
      "last_maintenance": "2024-01-10",
      "efficiency": 94.2
    }
  ],
  "summary": {
    "total_active": 23,
    "avg_efficiency": 91.5,
    "maintenance_due": 3
  }
}`}
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-purple-400 text-sm">GET /api/production</code>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">200 OK</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">Daily production metrics and KPIs</p>
                    <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                      {`{
  "daily_production": {
    "date": "2024-01-16",
    "total_tonnage": 47500,
    "avg_grade": 52.1,
    "target_tonnage": 50000,
    "efficiency": 95.0,
    "equipment_utilization": 87.3,
    "shift_breakdown": [
      {"shift": "day", "tonnage": 18500},
      {"shift": "afternoon", "tonnage": 16000},
      {"shift": "night", "tonnage": 13000}
    ]
  }
}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDS Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Auto-Generated APIs</h6>
                  <p className="text-slate-400 text-xs">
                    REST endpoints automatically created from database tables and views
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">OAuth 2.0 Security</h6>
                  <p className="text-slate-400 text-xs">
                    Industry-standard authentication and authorization
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Rate Limiting</h6>
                  <p className="text-slate-400 text-xs">
                    Built-in protection against excessive API usage
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">JSON/CSV Export</h6>
                  <p className="text-slate-400 text-xs">
                    Multiple format support for data integration
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Connect to view ORDS API demonstrations</p>
            </div>
          )}
        </div>
      )}

      {/* OCI Functions Visualization */}
      {selectedService === 'functions' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">OCI Functions - Serverless Processing</h4>
          
          {connectionStatus.functions === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Serverless Functions Active</span>
                </div>
                <p className="text-green-300 text-sm">
                  Event-driven processing scales automatically with mining workloads
                </p>
              </div>

              {/* Active Functions */}
              <div className="space-y-4">
                <h5 className="text-md font-medium text-white">Deployed Functions</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-white">grade-alert-processor</h6>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-2">Processes high-grade ore alerts and triggers routing decisions</p>
                    <div className="text-xs text-slate-500">
                      <div>Trigger: OPC UA grade events</div>
                      <div>Runtime: 45ms avg</div>
                      <div>Invocations: 1,247 today</div>
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-white">equipment-health-monitor</h6>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-2">Analyzes equipment telemetry for predictive maintenance</p>
                    <div className="text-xs text-slate-500">
                      <div>Trigger: Scheduled (5min)</div>
                      <div>Runtime: 180ms avg</div>
                      <div>Invocations: 288 today</div>
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-white">production-report-generator</h6>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-2">Generates daily/weekly production reports automatically</p>
                    <div className="text-xs text-slate-500">
                      <div>Trigger: Schedule + API</div>
                      <div>Runtime: 2.3s avg</div>
                      <div>Invocations: 24 today</div>
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-white">safety-compliance-checker</h6>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-2">Validates safety protocols and regulatory compliance</p>
                    <div className="text-xs text-slate-500">
                      <div>Trigger: Equipment events</div>
                      <div>Runtime: 95ms avg</div>
                      <div>Invocations: 567 today</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Function Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-400">100%</div>
                  <div className="text-xs text-slate-400">Auto-scaling</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-400">0ms</div>
                  <div className="text-xs text-slate-400">Cold start (mining workloads)</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-400">Pay-per-use</div>
                  <div className="text-xs text-slate-400">Cost model</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Connect to view OCI Functions</p>
            </div>
          )}
        </div>
      )}

      {/* Oracle Analytics Cloud Dashboard */}
      {selectedService === 'analytics' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Oracle Analytics Cloud</h4>
          
          {connectionStatus.analytics === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Analytics Dashboards Active</span>
                </div>
                <p className="text-green-300 text-sm">
                  Self-service business intelligence for mining operations
                </p>
              </div>

              {/* Sample Dashboards */}
              <div className="space-y-4">
                <h5 className="text-md font-medium text-white">Available Dashboards</h5>
                
                <div className="space-y-3">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="text-sm font-medium text-white">Production KPIs Dashboard</h6>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Executive</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">47.5K</div>
                        <div className="text-xs text-slate-400">Tonnes Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">95.0%</div>
                        <div className="text-xs text-slate-400">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">52.1%</div>
                        <div className="text-xs text-slate-400">Avg Grade</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-400">87.3%</div>
                        <div className="text-xs text-slate-400">Utilization</div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">Real-time production metrics with predictive forecasting</p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="text-sm font-medium text-white">Equipment Utilization Analysis</h6>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Operational</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">23</div>
                        <div className="text-xs text-slate-400">Active Equipment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">3</div>
                        <div className="text-xs text-slate-400">Maintenance Due</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">1</div>
                        <div className="text-xs text-slate-400">Critical Alerts</div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">Equipment health monitoring with predictive maintenance scheduling</p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="text-sm font-medium text-white">Grade Analysis & Optimization</h6>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Strategic</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">High</div>
                        <div className="text-xs text-slate-400">Grade Quality</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">$8.2M</div>
                        <div className="text-xs text-slate-400">Daily Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">+12%</div>
                        <div className="text-xs text-slate-400">vs Target</div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">Grade distribution analysis with ore blending optimization recommendations</p>
                  </div>
                </div>
              </div>

              {/* Analytics Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Self-Service Analytics</h6>
                  <p className="text-slate-400 text-xs">
                    Drag-and-drop interface for creating custom mining reports and visualizations
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Machine Learning</h6>
                  <p className="text-slate-400 text-xs">
                    Built-in ML algorithms for predictive maintenance and production optimization
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Mobile Access</h6>
                  <p className="text-slate-400 text-xs">
                    Native mobile apps for field supervisors and executives
                  </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-white mb-2">Real-time Alerts</h6>
                  <p className="text-slate-400 text-xs">
                    Automated notifications for production anomalies and equipment issues
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Connect to view Analytics Cloud</p>
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* APEX Apps Tab Content */}
      {activeTab === 'apex' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Oracle APEX Low-Code Applications</h4>
          
          {connectionStatus.database === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">APEX Applications Active</span>
                </div>
                <p className="text-green-300 text-sm">
                  Low-code development platform for rapid mining application creation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shift Dashboard App */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-md font-medium text-white">Shift Management Dashboard</h5>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Production</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3 rounded">
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-green-400 font-medium">Day Shift</div>
                          <div className="text-slate-400">18,500t | 95% target</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-medium">Evening Shift</div>
                          <div className="text-slate-400">16,000t | 89% target</div>
                        </div>
                        <div>
                          <div className="text-purple-400 font-medium">Night Shift</div>
                          <div className="text-slate-400">13,000t | 87% target</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <Code className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Features: Real-time production tracking, crew assignments, equipment allocation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Development time: 2 weeks (vs 6 months traditional)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance UI App */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-md font-medium text-white">Equipment Maintenance Portal</h5>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">Maintenance</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3 rounded">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scheduled Maintenance:</span>
                          <span className="text-green-400">3 completed today</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Emergency Repairs:</span>
                          <span className="text-yellow-400">1 in progress</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Parts Inventory:</span>
                          <span className="text-blue-400">94% stocked</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <Code className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Features: Work order management, parts tracking, technician scheduling</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Mobile-responsive for field technicians</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-400">75%</div>
                  <div className="text-xs text-slate-400">Faster Development</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-400">Zero</div>
                  <div className="text-xs text-slate-400">Infrastructure Setup</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-400">Drag & Drop</div>
                  <div className="text-xs text-slate-400">UI Builder</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Connect to Oracle Cloud to view APEX applications</p>
            </div>
          )}
        </div>
      )}

      {/* Architecture Tab Content */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Data Pipeline Architecture</h4>
          
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-md font-medium text-white mb-4">Mining Data Flow Architecture</h5>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">OPC UA Data Ingestion</div>
                    <div className="text-xs text-slate-400">Real-time sensor data from mining equipment → Autonomous Database</div>
                  </div>
                  <div className="text-xs text-green-400">5-15ms latency</div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">ORDS API Layer</div>
                    <div className="text-xs text-slate-400">RESTful API endpoints for application integration</div>
                  </div>
                  <div className="text-xs text-blue-400">Auto-generated</div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">OCI Functions Processing</div>
                    <div className="text-xs text-slate-400">Event-driven serverless processing for alerts and automation</div>
                  </div>
                  <div className="text-xs text-yellow-400">Auto-scaling</div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Analytics Cloud Visualization</div>
                    <div className="text-xs text-slate-400">Business intelligence dashboards and executive reporting</div>
                  </div>
                  <div className="text-xs text-purple-400">Self-service BI</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h6 className="text-sm font-medium text-white mb-2">High Availability</h6>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>• 99.95% uptime SLA</div>
                  <div>• Automatic failover</div>
                  <div>• Multi-region deployment</div>
                  <div>• Real-time backup</div>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h6 className="text-sm font-medium text-white mb-2">Scalability</h6>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>• Auto-scaling compute</div>
                  <div>• Elastic storage</div>
                  <div>• Serverless functions</div>
                  <div>• Load balancing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Queries Tab Content */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">SQL Query Examples</h4>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white mb-3">Daily Production Report</h5>
                <div className="bg-slate-950 p-3 rounded text-xs font-mono text-green-400 overflow-x-auto">
                  {`SELECT 
  DATE(timestamp) as production_date,
  COUNT(*) as total_readings,
  AVG(fe_percent) as avg_iron_grade,
  SUM(tonnage) as total_tonnage,
  COUNT(DISTINCT equipment_id) as active_equipment
FROM ore_grades 
WHERE timestamp >= TRUNC(SYSDATE)
GROUP BY DATE(timestamp)
ORDER BY production_date DESC;`}
                </div>
                <p className="text-xs text-slate-400 mt-2">Used for: Executive dashboards, shift handover reports</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white mb-3">Equipment Performance Analysis</h5>
                <div className="bg-slate-950 p-3 rounded text-xs font-mono text-blue-400 overflow-x-auto">
                  {`SELECT 
  e.equipment_id,
  e.model,
  AVG(e.efficiency) as avg_efficiency,
  COUNT(m.maintenance_id) as maintenance_events,
  MAX(e.operating_hours) as total_hours
FROM equipment e
LEFT JOIN maintenance_records m ON e.equipment_id = m.equipment_id
WHERE e.last_updated >= SYSDATE - 30
GROUP BY e.equipment_id, e.model
HAVING AVG(e.efficiency) < 90
ORDER BY avg_efficiency ASC;`}
                </div>
                <p className="text-xs text-slate-400 mt-2">Used for: Maintenance scheduling, performance optimization</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white mb-3">High-Grade Ore Detection</h5>
                <div className="bg-slate-950 p-3 rounded text-xs font-mono text-purple-400 overflow-x-auto">
                  {`SELECT 
  location_x,
  location_y,
  fe_percent,
  timestamp,
  analyzer_id
FROM ore_grades 
WHERE fe_percent > 60 
  AND timestamp >= SYSDATE - 1/24
ORDER BY fe_percent DESC, timestamp DESC
FETCH FIRST 50 ROWS ONLY;`}
                </div>
                <p className="text-xs text-slate-400 mt-2">Used for: Real-time routing decisions, premium ore tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h6 className="text-sm font-medium text-white mb-2">Query Performance</h6>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>• Automatic SQL tuning</div>
                  <div>• In-memory processing</div>
                  <div>• Columnar storage</div>
                  <div>• Intelligent indexing</div>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h6 className="text-sm font-medium text-white mb-2">SQL Development</h6>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>• Oracle SQL Developer Web</div>
                  <div>• Query optimization hints</div>
                  <div>• Execution plan analysis</div>
                  <div>• Performance monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab Content */}
      {activeTab === 'security' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Role-Based Access Control</h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <h5 className="text-sm font-medium text-white">Mine Operations</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-slate-400">Permissions:</div>
                  <div className="text-green-400">• Read real-time sensor data</div>
                  <div className="text-green-400">• Update equipment status</div>
                  <div className="text-green-400">• Generate shift reports</div>
                  <div className="text-red-400">• No financial data access</div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <h5 className="text-sm font-medium text-white">Maintenance Team</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-slate-400">Permissions:</div>
                  <div className="text-green-400">• Read equipment diagnostics</div>
                  <div className="text-green-400">• Update maintenance records</div>
                  <div className="text-green-400">• Schedule maintenance tasks</div>
                  <div className="text-red-400">• No production data modification</div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h5 className="text-sm font-medium text-white">Executive</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-slate-400">Permissions:</div>
                  <div className="text-green-400">• Read all dashboards</div>
                  <div className="text-green-400">• View financial reports</div>
                  <div className="text-green-400">• Access strategic analytics</div>
                  <div className="text-green-400">• System administration</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-white mb-3">Security Features</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <div className="text-green-400 font-medium">Authentication</div>
                  <div className="text-slate-400">• Multi-factor authentication (MFA)</div>
                  <div className="text-slate-400">• Single sign-on (SSO) integration</div>
                  <div className="text-slate-400">• Oracle Identity Cloud Service</div>
                  <div className="text-slate-400">• Session timeout controls</div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-blue-400 font-medium">Data Protection</div>
                  <div className="text-slate-400">• Transparent Data Encryption (TDE)</div>
                  <div className="text-slate-400">• Data masking for sensitive fields</div>
                  <div className="text-slate-400">• Database vault for critical data</div>
                  <div className="text-slate-400">• Audit trail for all access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Retention Tab Content */}
      {activeTab === 'retention' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Data Retention & Archival Policy</h4>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Archive className="w-5 h-5 text-green-400" />
                  <h5 className="text-sm font-medium text-white">Real-time Operations Data</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-green-400 font-medium">Hot Storage</div>
                    <div className="text-slate-400">30 days - Autonomous DB</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Warm Storage</div>
                    <div className="text-slate-400">12 months - Object Storage</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-medium">Cold Storage</div>
                    <div className="text-slate-400">7 years - Archive Storage</div>
                  </div>
                  <div>
                    <div className="text-orange-400 font-medium">Compliance</div>
                    <div className="text-slate-400">Regulatory requirements</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Archive className="w-5 h-5 text-blue-400" />
                  <h5 className="text-sm font-medium text-white">Financial & Compliance Data</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-green-400 font-medium">Production Reports</div>
                    <div className="text-slate-400">10 years retention</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Safety Records</div>
                    <div className="text-slate-400">Permanent retention</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-medium">Environmental Data</div>
                    <div className="text-slate-400">25 years retention</div>
                  </div>
                  <div>
                    <div className="text-orange-400 font-medium">Audit Logs</div>
                    <div className="text-slate-400">7 years minimum</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-white mb-3">Automated Lifecycle Management</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-slate-900 rounded">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">1</div>
                  <div className="text-xs text-slate-400">Automatic archival after 30 days to reduce storage costs</div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-slate-900 rounded">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</div>
                  <div className="text-xs text-slate-400">Intelligent compression for long-term storage efficiency</div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-slate-900 rounded">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">3</div>
                  <div className="text-xs text-slate-400">Automated deletion after retention period expires</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-400">90%</div>
                <div className="text-xs text-slate-400">Storage Cost Reduction</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-400">11 9's</div>
                <div className="text-xs text-slate-400">Data Durability</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-purple-400">Automated</div>
                <div className="text-xs text-slate-400">Lifecycle Management</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Troubleshooting Tab Content */}
      {activeTab === 'troubleshooting' && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Oracle Integration Troubleshooting Guide</h4>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-red-400" />
                  <h5 className="text-sm font-medium text-white">Connection Issues</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-red-400 font-medium">Problem: Database connection timeout</div>
                    <div className="text-slate-400">Solution: Check network connectivity, verify wallet configuration, ensure proper firewall rules</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-red-400 font-medium">Problem: ORDS endpoint returns 404</div>
                    <div className="text-slate-400">Solution: Verify REST service is enabled, check URL path, ensure proper authentication</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-yellow-400" />
                  <h5 className="text-sm font-medium text-white">Performance Issues</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-yellow-400 font-medium">Problem: Slow query performance</div>
                    <div className="text-slate-400">Solution: Enable automatic indexing, check SQL execution plans, consider data partitioning</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-yellow-400 font-medium">Problem: High CPU usage</div>
                    <div className="text-slate-400">Solution: Review concurrent users, optimize SQL queries, consider auto-scaling configuration</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  <h5 className="text-sm font-medium text-white">APEX Application Issues</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-blue-400 font-medium">Problem: Application won't load</div>
                    <div className="text-slate-400">Solution: Check workspace access, verify application ID, ensure proper authentication scheme</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-blue-400 font-medium">Problem: Data not updating</div>
                    <div className="text-slate-400">Solution: Verify DML operations, check triggers, review process flow logic</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-white mb-3">Monitoring & Diagnostics</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-green-400 font-medium">Built-in Monitoring</div>
                  <div className="text-slate-400">• Performance Hub for SQL analysis</div>
                  <div className="text-slate-400">• Real User Experience (RUE) monitoring</div>
                  <div className="text-slate-400">• Automatic Workload Repository (AWR)</div>
                  <div className="text-slate-400">• Database alerting and notifications</div>
                </div>
                <div className="space-y-2">
                  <div className="text-blue-400 font-medium">Integration Tools</div>
                  <div className="text-slate-400">• Oracle Enterprise Manager Cloud Control</div>
                  <div className="text-slate-400">• Application Performance Monitoring</div>
                  <div className="text-slate-400">• SQL Developer Web diagnostics</div>
                  <div className="text-slate-400">• OCI Logging and Metrics</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-400">24/7</div>
                <div className="text-xs text-slate-400">Oracle Support</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-400">Auto-Fix</div>
                <div className="text-xs text-slate-400">Self-Healing Features</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-purple-400">Proactive</div>
                <div className="text-xs text-slate-400">Issue Detection</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
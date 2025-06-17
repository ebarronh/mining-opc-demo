'use client'

import React, { useState, useEffect } from 'react'
import { Truck, Users, BarChart3, Settings, MapPin, Clock, Fuel, AlertTriangle, Navigation } from 'lucide-react'
import { fleetManagementSystems, performanceMetrics, generateMockTruckData } from '@/data/fleetManagementSystems'
import type { FleetManagementSystem, TruckData } from '@/data/fleetManagementSystems'
import TruckReroutingVisualization from './TruckReroutingVisualization'
import APICallDisplay from './APICallDisplay'
import PerformanceMetricsDashboard from './PerformanceMetricsDashboard'
import DataTranslationLayer from './DataTranslationLayer'

interface FleetIntegrationProps {
  className?: string
}

export default function FleetIntegration({ className = '' }: FleetIntegrationProps) {
  const [selectedVendor, setSelectedVendor] = useState<FleetManagementSystem>(fleetManagementSystems[0])
  const [truckData, setTruckData] = useState<TruckData[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'routing' | 'performance' | 'integration' | 'comparison'>('overview')

  // Simulate real-time truck data updates
  useEffect(() => {
    const updateTruckData = () => {
      setTruckData(generateMockTruckData())
    }
    
    updateTruckData()
    const interval = setInterval(updateTruckData, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading': return 'text-blue-400'
      case 'hauling': return 'text-green-400'
      case 'dumping': return 'text-orange-400'
      case 'returning': return 'text-purple-400'
      case 'maintenance': return 'text-red-400'
      case 'idle': return 'text-gray-400'
      default: return 'text-slate-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Truck className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Fleet Management Integration</h2>
        </div>
        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded text-sm text-green-300">
          Task 2.0 Active
        </span>
      </div>

      {/* Vendor Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Select Fleet Management System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fleetManagementSystems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedVendor(system)}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                selectedVendor.id === system.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: system.color }}
                ></div>
                <span className="font-medium text-white">{system.vendor}</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">{system.name}</p>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span>Market: {system.marketShare}%</span>
                <span>Complexity: {system.integrationComplexity}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-700 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'routing', label: 'Re-routing', icon: Navigation },
          { id: 'performance', label: 'Performance', icon: Users },
          { id: 'integration', label: 'Integration', icon: Settings },
          { id: 'comparison', label: 'Comparison', icon: MapPin }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Selected System Details */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">{selectedVendor.name}</h4>
            <p className="text-slate-300 mb-4">{selectedVendor.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{selectedVendor.marketShare}%</div>
                <div className="text-xs text-slate-400">Market Share</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedVendor.supportedEquipment.length}</div>
                <div className="text-xs text-slate-400">Equipment Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{selectedVendor.deploymentRegions.length}</div>
                <div className="text-xs text-slate-400">Global Regions</div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-white mb-2">Key Features</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedVendor.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Fleet Status */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Real-time Fleet Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live Data</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {truckData.map((truck) => (
                <div key={truck.id} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-white">{truck.id}</span>
                      <span className="text-sm text-slate-400">({truck.type})</span>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: selectedVendor.color + '20', color: selectedVendor.color }}
                      >
                        {truck.vendor}
                      </span>
                    </div>
                    <span className={`text-sm font-medium capitalize ${getStatusColor(truck.status)}`}>
                      {truck.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">Position:</span>
                      <span className="text-slate-300">{truck.position.x}, {truck.position.y}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">ETA:</span>
                      <span className="text-slate-300">{truck.destination.eta}min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">Fuel:</span>
                      <span className="text-slate-300">{truck.telemetry.fuel}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">Load:</span>
                      <span className="text-slate-300">{truck.load.weight}t</span>
                    </div>
                  </div>
                  
                  {truck.route.alternative && (
                    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Route Optimization: {truck.route.diversionReason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routing Tab */}
      {activeTab === 'routing' && (
        <div>
          <TruckReroutingVisualization 
            selectedVendor={{
              vendor: selectedVendor.vendor,
              color: selectedVendor.color,
              name: selectedVendor.name
            }}
          />
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <PerformanceMetricsDashboard selectedVendor={selectedVendor} />
        </div>
      )}

      {/* Integration Tab */}
      {activeTab === 'integration' && (
        <div className="space-y-8">
          <APICallDisplay selectedVendor={selectedVendor} />
          <DataTranslationLayer selectedVendor={selectedVendor} />
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-4">Vendor Comparison Matrix</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 text-slate-300">Vendor</th>
                    <th className="text-center py-2 text-slate-300">Market Share</th>
                    <th className="text-center py-2 text-slate-300">Complexity</th>
                    <th className="text-center py-2 text-slate-300">Equipment Types</th>
                    <th className="text-center py-2 text-slate-300">Global Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {fleetManagementSystems.map((system) => (
                    <tr key={system.id} className="border-b border-slate-700">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: system.color }}
                          ></div>
                          <span className="text-white font-medium">{system.vendor}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 text-slate-300">{system.marketShare}%</td>
                      <td className="text-center py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          system.integrationComplexity === 'Low' ? 'bg-green-500/20 text-green-300' :
                          system.integrationComplexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {system.integrationComplexity}
                        </span>
                      </td>
                      <td className="text-center py-3 text-slate-300">{system.supportedEquipment.length}</td>
                      <td className="text-center py-3 text-slate-300">{system.deploymentRegions.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
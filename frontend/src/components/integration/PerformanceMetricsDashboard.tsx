'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Fuel, Clock, Shield, BarChart3, Activity } from 'lucide-react'
import { performanceMetrics } from '@/data/fleetManagementSystems'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

interface PerformanceMetricsDashboardProps {
  selectedVendor: FleetManagementSystem
  className?: string
}

interface MetricCard {
  id: string
  title: string
  value: string | number
  previousValue?: string | number
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  description: string
  icon: React.ComponentType<any>
  color: string
  prefix?: string
  suffix?: string
}

interface TimeSeriesData {
  timestamp: string
  diversionRate: number
  costSavings: number
  fuelEfficiency: number
  safetyScore: number
}

export default function PerformanceMetricsDashboard({ selectedVendor, className = '' }: PerformanceMetricsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  // Generate mock time series data
  useEffect(() => {
    const generateTimeSeriesData = (): TimeSeriesData[] => {
      const data: TimeSeriesData[] = []
      const periods = {
        '1d': { points: 24, interval: 1 }, // hourly
        '7d': { points: 7, interval: 24 }, // daily
        '30d': { points: 30, interval: 24 }, // daily
        '90d': { points: 90, interval: 24 } // daily
      }
      
      const config = periods[selectedPeriod]
      const baseTime = new Date()
      
      for (let i = config.points - 1; i >= 0; i--) {
        const timestamp = new Date(baseTime.getTime() - (i * config.interval * 60 * 60 * 1000))
        data.push({
          timestamp: timestamp.toISOString(),
          diversionRate: 5.9 + (Math.random() - 0.5) * 2,
          costSavings: 47000 + (Math.random() - 0.5) * 10000,
          fuelEfficiency: 15.2 + (Math.random() - 0.5) * 3,
          safetyScore: 92 + (Math.random() - 0.5) * 8
        })
      }
      
      return data
    }

    setTimeSeriesData(generateTimeSeriesData())
  }, [selectedPeriod])

  // Animate metric values
  useEffect(() => {
    const targets = {
      diversionRate: performanceMetrics.diversionRate.optimized,
      costSavings: performanceMetrics.costSavings.minAnnual / 1000000,
      fuelReduction: performanceMetrics.efficiency.fuelReduction,
      safetyScore: performanceMetrics.safety.incidentReduction
    }

    const animateValues = () => {
      Object.entries(targets).forEach(([key, target]) => {
        setAnimatedValues(prev => {
          const current = prev[key] || 0
          const diff = target - current
          const step = diff * 0.1
          return {
            ...prev,
            [key]: Math.abs(step) < 0.1 ? target : current + step
          }
        })
      })
    }

    const interval = setInterval(animateValues, 50)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const metricCards: MetricCard[] = [
    {
      id: 'diversion-rate',
      title: 'Truck Diversion Rate',
      value: animatedValues.diversionRate?.toFixed(1) || '0.0',
      previousValue: performanceMetrics.diversionRate.baseline,
      trend: 'down',
      trendValue: `${performanceMetrics.diversionRate.improvement}% improvement`,
      description: 'Reduced diversions through intelligent ore grade routing',
      icon: TrendingDown,
      color: 'text-green-400',
      suffix: '%'
    },
    {
      id: 'cost-savings',
      title: 'Annual Cost Savings',
      value: animatedValues.costSavings?.toFixed(1) || '0.0',
      previousValue: '0',
      trend: 'up',
      trendValue: `Up to ${formatCurrency(performanceMetrics.costSavings.maxAnnual / 1000000)}M potential`,
      description: 'Direct savings from optimized routing and reduced fuel consumption',
      icon: DollarSign,
      color: 'text-blue-400',
      prefix: '$',
      suffix: 'M'
    },
    {
      id: 'fuel-efficiency',
      title: 'Fuel Efficiency Gain',
      value: animatedValues.fuelReduction?.toFixed(1) || '0.0',
      previousValue: '0',
      trend: 'up',
      trendValue: `${performanceMetrics.efficiency.cycleTimeReduction}% cycle time reduction`,
      description: 'Reduced fuel consumption through optimized routes and load management',
      icon: Fuel,
      color: 'text-purple-400',
      suffix: '%'
    },
    {
      id: 'safety-score',
      title: 'Safety Improvement',
      value: animatedValues.safetyScore?.toFixed(0) || '0',
      previousValue: '25',
      trend: 'up',
      trendValue: `${performanceMetrics.safety.collisionAvoidance}% collision avoidance`,
      description: 'Incident reduction through predictive routing and collision avoidance',
      icon: Shield,
      color: 'text-orange-400',
      suffix: '%'
    }
  ]

  const additionalMetrics = [
    {
      title: 'Average Haul Time',
      value: '18.5 min',
      change: '-12%',
      trend: 'down' as const,
      icon: Clock
    },
    {
      title: 'Equipment Utilization',
      value: '87.3%',
      change: '+12.4%',
      trend: 'up' as const,
      icon: Activity
    },
    {
      title: 'Load Factor Optimization',
      value: '94.2%',
      change: '+8.7%',
      trend: 'up' as const,
      icon: BarChart3
    },
    {
      title: 'Route Compliance',
      value: '96.8%',
      change: '+15.2%',
      trend: 'up' as const,
      icon: TrendingUp
    }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />
      case 'down': return <TrendingDown className="w-3 h-3" />
      default: return <Activity className="w-3 h-3" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Performance Metrics - {selectedVendor.vendor}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Real-time fleet optimization impact and cost savings analysis
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
          {[
            { id: '1d', label: '24H' },
            { id: '7d', label: '7D' },
            { id: '30d', label: '30D' },
            { id: '90d', label: '90D' }
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                selectedPeriod === period.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const IconComponent = metric.icon
          return (
            <div key={metric.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-white">{metric.title}</span>
                </div>
                <div className={`flex items-center space-x-1 text-xs ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-baseline space-x-1">
                  {metric.prefix && <span className="text-lg text-slate-400">{metric.prefix}</span>}
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </span>
                  {metric.suffix && <span className="text-sm text-slate-400">{metric.suffix}</span>}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {metric.trendValue}
                </div>
                <div className="text-xs text-slate-400">
                  {metric.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Metrics Grid */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <h4 className="text-lg font-medium text-white mb-4">Operational Efficiency Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {additionalMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-xs text-slate-400 mb-1">{metric.title}</div>
                <div className={`text-xs flex items-center justify-center space-x-1 ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cost Savings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Savings Breakdown */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">Cost Savings Breakdown</h4>
          <div className="space-y-4">
            {[
              { category: 'Fuel Optimization', amount: 18500000, percentage: 37 },
              { category: 'Route Efficiency', amount: 15200000, percentage: 30 },
              { category: 'Equipment Utilization', amount: 9800000, percentage: 20 },
              { category: 'Maintenance Reduction', amount: 6500000, percentage: 13 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{item.category}</span>
                    <span className="text-sm font-medium text-blue-400">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">ROI Analysis - {selectedVendor.vendor}</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Implementation Cost</span>
              <span className="text-sm text-white">{selectedVendor.costProfile.implementation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Annual Maintenance</span>
              <span className="text-sm text-white">{selectedVendor.costProfile.maintenance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Licensing (100 vehicles)</span>
              <span className="text-sm text-white">{selectedVendor.costProfile.licensing}</span>
            </div>
            <hr className="border-slate-600" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">Estimated Payback Period</span>
              <span className="text-sm font-bold text-green-400">8-14 months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">3-Year ROI</span>
              <span className="text-sm font-bold text-green-400">340-580%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends Summary */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <h4 className="text-lg font-medium text-white mb-4">Performance Trends Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1].diversionRate.toFixed(1) : '5.9'}%
            </div>
            <div className="text-sm text-slate-400">Current Diversion Rate</div>
            <div className="text-xs text-green-300 mt-1">Target: &lt;6%</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency((timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1].costSavings : 47000) * 365 / 1000000)}M
            </div>
            <div className="text-sm text-slate-400">Projected Annual Savings</div>
            <div className="text-xs text-blue-300 mt-1">Based on current trends</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1].fuelEfficiency.toFixed(1) : '15.2'}%
            </div>
            <div className="text-sm text-slate-400">Fuel Efficiency Improvement</div>
            <div className="text-xs text-purple-300 mt-1">Environmental benefit</div>
          </div>
        </div>
      </div>
    </div>
  )
}
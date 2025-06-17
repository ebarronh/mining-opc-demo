'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Navigation, MapPin, Clock, Zap, Route, AlertTriangle } from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface RoutePoint extends Position {
  id: string
  type: 'loading' | 'dumping' | 'crusher' | 'waste' | 'checkpoint'
  label: string
  gradeThreshold?: number
}

interface Truck {
  id: string
  position: Position
  currentRoute: string[]
  newRoute?: string[]
  speed: number
  load: {
    oreGrade: number // Actual ore grade (0.5-2.5%)
    classificationConfidence: number // AI confidence in grade reading (30-95%)
    weight: number
    material: string
  }
  reroutingStatus: 'normal' | 'analyzing' | 'rerouting' | 'completed'
  reroutingReason?: string
  estimatedSavings?: number
  fmsVendor: 'Komatsu' | 'Caterpillar' | 'Wenco'
}

interface TruckReroutingVisualizationProps {
  className?: string
  selectedVendor?: {
    vendor: string
    color: string
    name: string
  }
}

export default function TruckReroutingVisualization({ className = '', selectedVendor }: TruckReroutingVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null)
  const [animationFrame, setAnimationFrame] = useState(0)

  // Initialize route points and trucks
  useEffect(() => {
    const points: RoutePoint[] = [
      { id: 'loading-1', x: 50, y: 200, type: 'loading', label: 'Loading Bay 1' },
      { id: 'loading-2', x: 50, y: 150, type: 'loading', label: 'Loading Bay 2' },
      { id: 'checkpoint-1', x: 200, y: 175, type: 'checkpoint', label: 'Grade Check', gradeThreshold: 55 },
      { id: 'crusher-primary', x: 350, y: 100, type: 'crusher', label: 'Primary Crusher', gradeThreshold: 55 },
      { id: 'crusher-secondary', x: 350, y: 150, type: 'crusher', label: 'Secondary Crusher', gradeThreshold: 45 },
      { id: 'waste-dump', x: 350, y: 250, type: 'waste', label: 'Waste Dump' },
      { id: 'stockpile-high', x: 450, y: 100, type: 'dumping', label: 'High Grade Stockpile (>2.0%)', gradeThreshold: 85 },
      { id: 'stockpile-medium', x: 450, y: 175, type: 'dumping', label: 'Medium Grade Stockpile (1.0-2.0%)', gradeThreshold: 70 }
    ]

    // Generate vendor-specific trucks based on selected FMS
    const getVendorTrucks = () => {
      const baseVendor = selectedVendor?.vendor || 'Komatsu'
      
      return [
        {
          id: `${baseVendor.substring(0,3).toUpperCase()}-001`,
          position: { x: 50, y: 200 },
          currentRoute: ['loading-1', 'checkpoint-1', 'crusher-primary', 'stockpile-high'],
          speed: 2,
          load: { 
            oreGrade: 2.3, // High grade ore (2.3%)
            classificationConfidence: 89, // High confidence
            weight: 185, 
            material: 'Iron Ore' 
          },
          reroutingStatus: 'normal' as const,
          fmsVendor: baseVendor as 'Komatsu' | 'Caterpillar' | 'Wenco'
        },
        {
          id: `${baseVendor.substring(0,3).toUpperCase()}-002`,
          position: { x: 50, y: 150 },
          currentRoute: ['loading-2', 'checkpoint-1', 'waste-dump'],
          speed: 1.8,
          load: { 
            oreGrade: 0.7, // Low grade ore (0.7%)
            classificationConfidence: 34, // Low confidence - needs re-routing
            weight: 210, 
            material: 'Mixed Material' 
          },
          reroutingStatus: 'analyzing' as const,
          fmsVendor: baseVendor as 'Komatsu' | 'Caterpillar' | 'Wenco'
        },
        {
          id: `${baseVendor.substring(0,3).toUpperCase()}-003`,
          position: { x: 150, y: 175 },
          currentRoute: ['checkpoint-1', 'crusher-secondary', 'stockpile-medium'],
          newRoute: ['checkpoint-1', 'crusher-primary', 'stockpile-high'],
          speed: 2.2,
          load: { 
            oreGrade: 2.1, // High grade ore (2.1%)
            classificationConfidence: 92, // Very high confidence
            weight: 195, 
            material: 'Iron Ore' 
          },
          reroutingStatus: 'rerouting' as const,
          reroutingReason: 'High confidence grade reading - upgrading to primary crusher',
          estimatedSavings: 12500,
          fmsVendor: baseVendor as 'Komatsu' | 'Caterpillar' | 'Wenco'
        }
      ]
    }

    const initialTrucks = getVendorTrucks()

    setRoutePoints(points)
    setTrucks(initialTrucks)
  }, [selectedVendor?.vendor])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1)
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => {
          // Simple movement simulation
          const newX = truck.position.x + (Math.sin(animationFrame * 0.02) * 2)
          const newY = truck.position.y + (Math.cos(animationFrame * 0.015) * 1)
          
          return {
            ...truck,
            position: { x: newX, y: newY }
          }
        })
      )
    }

    const interval = setInterval(animate, 100)
    return () => clearInterval(interval)
  }, [animationFrame])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw route points
    routePoints.forEach(point => {
      const colors = {
        loading: '#3B82F6',    // Blue
        dumping: '#10B981',    // Green
        crusher: '#F59E0B',    // Yellow
        waste: '#EF4444',      // Red
        checkpoint: '#8B5CF6'   // Purple
      }

      ctx.fillStyle = colors[point.type]
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Label
      ctx.fillStyle = '#F9FAFB'
      ctx.font = '10px Arial'
      ctx.fillText(point.label, point.x + 12, point.y + 4)
    })

    // Draw routes
    trucks.forEach(truck => {
      const route = truck.newRoute || truck.currentRoute
      
      // Draw current route
      if (truck.currentRoute.length > 1) {
        ctx.strokeStyle = truck.reroutingStatus === 'rerouting' ? '#6B7280' : '#10B981'
        ctx.lineWidth = 2
        ctx.setLineDash(truck.reroutingStatus === 'rerouting' ? [5, 5] : [])
        
        ctx.beginPath()
        for (let i = 0; i < truck.currentRoute.length - 1; i++) {
          const start = routePoints.find(p => p.id === truck.currentRoute[i])
          const end = routePoints.find(p => p.id === truck.currentRoute[i + 1])
          
          if (start && end) {
            if (i === 0) ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
          }
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw new route if rerouting
      if (truck.newRoute && truck.newRoute.length > 1) {
        ctx.strokeStyle = '#EF4444'
        ctx.lineWidth = 3
        ctx.setLineDash([])
        
        ctx.beginPath()
        for (let i = 0; i < truck.newRoute.length - 1; i++) {
          const start = routePoints.find(p => p.id === truck.newRoute![i])
          const end = routePoints.find(p => p.id === truck.newRoute![i + 1])
          
          if (start && end) {
            if (i === 0) ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
          }
        }
        ctx.stroke()
      }
    })

    // Draw trucks
    trucks.forEach(truck => {
      const colors = {
        normal: '#10B981',
        analyzing: '#F59E0B',
        rerouting: '#EF4444',
        completed: '#8B5CF6'
      }

      ctx.fillStyle = colors[truck.reroutingStatus]
      ctx.beginPath()
      ctx.arc(truck.position.x, truck.position.y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Truck ID
      ctx.fillStyle = '#F9FAFB'
      ctx.font = '8px Arial'
      ctx.fillText(truck.id, truck.position.x - 15, truck.position.y - 10)

      // Status indicator
      if (truck.reroutingStatus === 'rerouting') {
        ctx.strokeStyle = '#EF4444'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(truck.position.x, truck.position.y, 12, 0, 2 * Math.PI)
        ctx.stroke()
      }
    })

  }, [trucks, routePoints, animationFrame])

  const getGradeColor = (grade: number) => {
    if (grade >= 2.0) return 'text-green-400'  // High grade ore
    if (grade >= 1.0) return 'text-yellow-400' // Medium grade ore
    if (grade >= 0.5) return 'text-orange-400' // Low grade ore
    return 'text-red-400'                      // Waste rock
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'   // High confidence
    if (confidence >= 60) return 'text-yellow-400'  // Medium confidence
    if (confidence >= 40) return 'text-orange-400'  // Low confidence
    return 'text-red-400'                           // Very low confidence
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400'
      case 'analyzing': return 'text-yellow-400'
      case 'rerouting': return 'text-red-400'
      case 'completed': return 'text-purple-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Navigation className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Real-time Truck Re-routing</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-400">Live Optimization</span>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Map */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-white mb-4">Mine Site Routes</h4>
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="w-full border border-slate-600 rounded"
              style={{ backgroundColor: '#1E293B' }}
            />
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Loading Bay</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Stockpile</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-300">Crusher</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">Waste Dump</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300">Checkpoint</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-red-500"></div>
                <span className="text-slate-300">New Route</span>
              </div>
            </div>
          </div>
        </div>

        {/* Truck Status Panel */}
        <div className="space-y-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-white mb-3">Active Trucks</h4>
            <div className="space-y-3">
              {trucks.map(truck => (
                <div
                  key={truck.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTruck === truck.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedTruck(selectedTruck === truck.id ? null : truck.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{truck.id}</span>
                    <span className={`text-xs capitalize ${getStatusColor(truck.reroutingStatus)}`}>
                      {truck.reroutingStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ore Grade:</span>
                      <span className={getGradeColor(truck.load.oreGrade)}>
                        {truck.load.oreGrade.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI Confidence:</span>
                      <span className={getConfidenceColor(truck.load.classificationConfidence)}>
                        {truck.load.classificationConfidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load Weight:</span>
                      <span className="text-slate-300">{truck.load.weight}t</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">FMS:</span>
                      <span className="text-slate-300">{truck.fmsVendor}</span>
                    </div>
                    {truck.estimatedSavings && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Savings:</span>
                        <span className="text-green-400">${truck.estimatedSavings.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {truck.reroutingReason && (
                    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{truck.reroutingReason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Stats */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-white mb-3">Optimization Impact</h4>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">18%</div>
                <div className="text-xs text-slate-400">Route Efficiency Gain</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">$47K</div>
                <div className="text-xs text-slate-400">Daily Savings</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">92%</div>
                <div className="text-xs text-slate-400">Grade Classification Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor-Specific Optimization Algorithms */}
      <div className="mt-6 bg-slate-700 rounded-lg p-4">
        <h4 className="text-md font-medium text-white mb-3">
          {selectedVendor?.vendor || 'Komatsu'} Optimization Algorithms
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {selectedVendor?.vendor === 'Komatsu' && (
            <>
              <div className="text-center">
                <Route className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">AHS Integration</div>
                <div className="text-xs text-slate-400">Autonomous haulage coordination</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-medium">KOMTRAX Analytics</div>
                <div className="text-xs text-slate-400">Real-time vehicle intelligence</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Production Optimization</div>
                <div className="text-xs text-slate-400">Yield maximization</div>
              </div>
            </>
          )}
          {selectedVendor?.vendor === 'Caterpillar' && (
            <>
              <div className="text-center">
                <Route className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">Command Integration</div>
                <div className="text-xs text-slate-400">Autonomous fleet coordination</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-medium">MineStar System</div>
                <div className="text-xs text-slate-400">Advanced fleet management</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Safety Integration</div>
                <div className="text-xs text-slate-400">Collision avoidance priority</div>
              </div>
            </>
          )}
          {selectedVendor?.vendor === 'Wenco' && (
            <>
              <div className="text-center">
                <Route className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">Hitachi Integration</div>
                <div className="text-xs text-slate-400">Mixed fleet optimization</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-medium">Real-time Dispatch</div>
                <div className="text-xs text-slate-400">Dynamic route adjustment</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Cost Optimization</div>
                <div className="text-xs text-slate-400">Operating expense reduction</div>
              </div>
            </>
          )}
          {!selectedVendor && (
            <>
              <div className="text-center">
                <Route className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-medium">Dijkstra's Algorithm</div>
                <div className="text-xs text-slate-400">Shortest path calculation</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">Real-time Heuristics</div>
                <div className="text-xs text-slate-400">Traffic & grade optimization</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Predictive Modeling</div>
                <div className="text-xs text-slate-400">Future state planning</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-6 bg-slate-700 rounded-lg p-4">
        <h4 className="text-md font-medium text-white mb-4">Understanding Fleet Management Integration</h4>
        <div className="space-y-4 text-sm">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="text-blue-400 font-medium mb-1">What is Ore Grade vs Classification Confidence?</h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong>Ore Grade</strong> (0.5-2.5%): Actual iron content in the ore. Industry standard: &gt;2.0% = high grade, 1.0-2.0% = medium grade, &lt;1.0% = low grade/waste.
              <br />
              <strong>AI Confidence</strong> (30-95%): How certain the classification system is about the grade reading. Low confidence triggers re-routing for verification.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="text-green-400 font-medium mb-1">How does FMS vendor selection affect re-routing?</h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              Different FMS vendors (Komatsu, Caterpillar, Wenco) have varying:
              <br />• Classification accuracy algorithms • Re-routing response times • Integration protocols
              <br />Switch vendors to see different truck IDs, confidence thresholds, and optimization strategies.
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h5 className="text-yellow-400 font-medium mb-1">When do trucks get re-routed?</h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              Triggers: • Low AI confidence (&lt;40%) in material classification • Higher grade ore detected than expected
              <br />• Traffic congestion at current destination • Equipment failures at planned routes
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="text-purple-400 font-medium mb-1">Why is this integration important?</h5>
            <p className="text-slate-300 text-xs leading-relaxed">
              Multi-vendor mining operations need unified systems. This demo shows how different FMS can share data in real-time, 
              enabling optimal decisions regardless of equipment manufacturer. Result: 18% efficiency gains, $47K daily savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
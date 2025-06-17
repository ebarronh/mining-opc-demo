'use client'

import React, { useState, useEffect } from 'react'
import { Code, Play, Copy, Check, Clock, Zap } from 'lucide-react'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

interface APICallDisplayProps {
  selectedVendor: FleetManagementSystem
  className?: string
}

interface APICall {
  id: string
  name: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  description: string
  requestFormat: string
  responseFormat: string
  responseTime: number
  status: 'success' | 'loading' | 'error'
}

export default function APICallDisplay({ selectedVendor, className = '' }: APICallDisplayProps) {
  const [selectedCall, setSelectedCall] = useState<string>('vehicles')
  const [apiCalls, setApiCalls] = useState<Record<string, APICall>>({})
  const [isExecuting, setIsExecuting] = useState<string | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  // Generate API call examples based on selected vendor
  useEffect(() => {
    const generateAPIExamples = (): Record<string, APICall> => {
      const baseExamples = {
        vehicles: {
          id: 'vehicles',
          name: 'Get Fleet Vehicles',
          endpoint: selectedVendor.apiEndpoints.vehicles,
          method: 'GET' as const,
          description: 'Retrieve all active vehicles in the fleet with current status and location',
          requestFormat: '',
          responseFormat: '',
          responseTime: Math.floor(Math.random() * 200) + 50,
          status: 'success' as const
        },
        routing: {
          id: 'routing',
          name: 'Route Optimization',
          endpoint: selectedVendor.apiEndpoints.routing,
          method: 'POST' as const,
          description: 'Request route optimization based on current ore grades and traffic conditions',
          requestFormat: '',
          responseFormat: '',
          responseTime: Math.floor(Math.random() * 500) + 100,
          status: 'success' as const
        },
        status: {
          id: 'status',
          name: 'Equipment Status',
          endpoint: selectedVendor.apiEndpoints.status,
          method: 'GET' as const,
          description: 'Get real-time equipment health and operational status',
          requestFormat: '',
          responseFormat: '',
          responseTime: Math.floor(Math.random() * 150) + 30,
          status: 'success' as const
        },
        assignments: {
          id: 'assignments',
          name: 'Task Assignments',
          endpoint: selectedVendor.apiEndpoints.assignments,
          method: 'PUT' as const,
          description: 'Update or create new task assignments for fleet vehicles',
          requestFormat: '',
          responseFormat: '',
          responseTime: Math.floor(Math.random() * 300) + 80,
          status: 'success' as const
        }
      }

      // Customize formats based on vendor
      if (selectedVendor.vendor === 'Komatsu') {
        baseExamples.vehicles.requestFormat = `GET ${selectedVendor.apiEndpoints.vehicles}
Headers:
  Authorization: Bearer <KOMTRAX_TOKEN>
  Content-Type: application/json
  X-API-Version: 2.1`

        baseExamples.vehicles.responseFormat = `{
  "vehicles": [
    {
      "vehicleId": "KOM-830E-001",
      "model": "830E-AC",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333,
        "elevation": 850,
        "heading": 127
      },
      "status": {
        "operational": "active",
        "engine": "running",
        "autonomousMode": true,
        "fuelLevel": 78.5
      },
      "payload": {
        "currentWeight": 185000,
        "capacity": 220000,
        "material": "iron_ore",
        "gradeEstimate": 62.3
      },
      "telemetry": {
        "engineHours": 12847,
        "speed": 28.5,
        "temperature": 87,
        "pressure": 34.2
      }
    }
  ],
  "metadata": {
    "timestamp": "2024-01-16T14:30:15Z",
    "total": 1,
    "responseTime": 85
  }
}`

        baseExamples.routing.requestFormat = `POST ${selectedVendor.apiEndpoints.routing}
Headers:
  Authorization: Bearer <KOMTRAX_TOKEN>
  Content-Type: application/json

{
  "vehicleId": "KOM-830E-001",
  "currentLocation": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "destination": {
    "type": "crusher",
    "id": "CR-001"
  },
  "payload": {
    "grade": 62.3,
    "weight": 185000
  },
  "optimizationCriteria": [
    "fuel_efficiency",
    "grade_optimization",
    "traffic_avoidance"
  ]
}`

        baseExamples.routing.responseFormat = `{
  "routeId": "RT-20240116-001",
  "optimizedRoute": [
    {
      "waypoint": 1,
      "location": {"lat": -23.5505, "lng": -46.6333},
      "instruction": "Continue on Haul Road A",
      "estimatedTime": 180
    },
    {
      "waypoint": 2,
      "location": {"lat": -23.5510, "lng": -46.6340},
      "instruction": "Turn right to Grade Check Station",
      "estimatedTime": 60
    }
  ],
  "metrics": {
    "estimatedTime": 720,
    "fuelConsumption": 12.5,
    "distanceKm": 2.8,
    "gradeBonus": 8500
  },
  "alternatives": [
    {
      "routeType": "fastest",
      "estimatedTime": 650,
      "fuelPenalty": 15
    }
  ]
}`
      } else if (selectedVendor.vendor === 'Caterpillar') {
        baseExamples.vehicles.requestFormat = `GET ${selectedVendor.apiEndpoints.vehicles}
Headers:
  Authorization: MineStar-API <API_KEY>
  Content-Type: application/xml
  X-MineStar-Version: 3.2`

        baseExamples.vehicles.responseFormat = `<?xml version="1.0" encoding="UTF-8"?>
<FleetResponse>
  <Equipment>
    <Vehicle id="CAT-797F-042">
      <Model>797F</Model>
      <Position>
        <GPS lat="-23.5505" lng="-46.6333" alt="850"/>
        <Heading>127</Heading>
        <Speed>28.5</Speed>
      </Position>
      <Status>
        <Operational>ACTIVE</Operational>
        <EngineState>RUNNING</EngineState>
        <CommandStatus>AUTONOMOUS</CommandStatus>
      </Status>
      <Payload>
        <CurrentWeight unit="kg">210000</CurrentWeight>
        <Capacity unit="kg">380000</Capacity>
        <Material>WASTE_ROCK</Material>
        <GradeAnalysis>38.7</GradeAnalysis>
      </Payload>
      <VIMS>
        <EngineHours>15230</EngineHours>
        <FuelLevel>65</FuelLevel>
        <Temperature>92</Temperature>
        <Pressure>38</Pressure>
      </VIMS>
    </Vehicle>
  </Equipment>
  <ResponseMetadata>
    <Timestamp>2024-01-16T14:30:15Z</Timestamp>
    <ProcessingTime>120</ProcessingTime>
  </ResponseMetadata>
</FleetResponse>`

        baseExamples.routing.requestFormat = `POST ${selectedVendor.apiEndpoints.routing}
Headers:
  Authorization: MineStar-API <API_KEY>
  Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<DispatchRequest>
  <Vehicle id="CAT-797F-042"/>
  <CurrentPosition lat="-23.5505" lng="-46.6333"/>
  <Destination type="WASTE_DUMP" id="WD-003"/>
  <LoadInfo>
    <Grade>38.7</Grade>
    <Weight>210000</Weight>
  </LoadInfo>
  <OptimizationFlags>
    <FuelEfficiency>true</FuelEfficiency>
    <TrafficAvoidance>true</TrafficAvoidance>
    <SafetyPriority>high</SafetyPriority>
  </OptimizationFlags>
</DispatchRequest>`

        baseExamples.routing.responseFormat = `<?xml version="1.0" encoding="UTF-8"?>
<DispatchResponse>
  <RouteID>MSR-20240116-042</RouteID>
  <OptimizedPath>
    <Waypoint sequence="1">
      <Position lat="-23.5505" lng="-46.6333"/>
      <Instruction>Proceed on Main Haul Road</Instruction>
      <EstimatedTime>240</EstimatedTime>
    </Waypoint>
    <Waypoint sequence="2">
      <Position lat="-23.5512" lng="-46.6345"/>
      <Instruction>Turn left to Waste Dump WD-003</Instruction>
      <EstimatedTime>180</EstimatedTime>
    </Waypoint>
  </OptimizedPath>
  <Metrics>
    <TotalTime>420</TotalTime>
    <FuelConsumption>18.5</FuelConsumption>
    <Distance>3.2</Distance>
  </Metrics>
</DispatchResponse>`
      } else { // Wenco
        baseExamples.vehicles.requestFormat = `GET ${selectedVendor.apiEndpoints.vehicles}
Headers:
  Authorization: Bearer <WENCO_JWT_TOKEN>
  Content-Type: application/json
  X-Wenco-API-Version: 4.0`

        baseExamples.vehicles.responseFormat = `{
  "success": true,
  "data": {
    "equipment": [
      {
        "equipmentId": "WEN-MO-128",
        "equipmentType": "HAUL_TRUCK",
        "oem": "MULTI_VENDOR",
        "model": "Generic-300T",
        "location": {
          "coordinates": [-46.6333, -23.5505],
          "elevation": 850,
          "heading": 127,
          "zone": "ACTIVE_MINING"
        },
        "operationalStatus": {
          "state": "RETURNING",
          "subState": "EMPTY_HAUL",
          "autonomousEnabled": false,
          "operatorPresent": true
        },
        "load": {
          "currentMass": 0,
          "capacity": 300000,
          "material": null,
          "gradeValue": null
        },
        "vitals": {
          "fuelLevel": 42,
          "engineHours": 9876,
          "speedKph": 35,
          "engineTemp": 85,
          "oilPressure": 32
        }
      }
    ]
  },
  "pagination": {
    "total": 1,
    "page": 1,
    "pageSize": 50
  },
  "timestamp": "2024-01-16T14:30:15.234Z",
  "responseTimeMs": 45
}`

        baseExamples.routing.requestFormat = `POST ${selectedVendor.apiEndpoints.routing}
Headers:
  Authorization: Bearer <WENCO_JWT_TOKEN>
  Content-Type: application/json

{
  "equipmentId": "WEN-MO-128",
  "routeRequest": {
    "origin": {
      "coordinates": [-46.6333, -23.5505],
      "locationName": "Current Position"
    },
    "destination": {
      "type": "STOCKPILE",
      "id": "SP-007",
      "coordinates": [-46.6350, -23.5520]
    },
    "loadParameters": {
      "expectedGrade": 0,
      "expectedMass": 0,
      "materialType": "EMPTY"
    },
    "optimizationSettings": {
      "criteria": ["SHORTEST_TIME", "FUEL_EFFICIENT"],
      "avoidConstraints": ["MAINTENANCE_ZONES"],
      "weatherConsiderations": true
    }
  }
}`

        baseExamples.routing.responseFormat = `{
  "success": true,
  "data": {
    "routeId": "WEN-RT-20240116-128",
    "route": {
      "segments": [
        {
          "segmentId": "S1",
          "path": [
            {"coordinates": [-46.6333, -23.5505], "elevation": 850},
            {"coordinates": [-46.6340, -23.5510], "elevation": 845}
          ],
          "instructions": "Follow Return Route C",
          "estimatedDuration": 480,
          "segmentType": "HAUL_ROAD"
        }
      ],
      "totalDistance": 2500,
      "estimatedDuration": 480,
      "estimatedFuelConsumption": 8.2
    },
    "alternatives": [
      {
        "routeType": "SHORTEST_DISTANCE",
        "duration": 520,
        "fuelSavings": 1.2
      }
    ],
    "optimization": {
      "applied": ["SHORTEST_TIME", "FUEL_EFFICIENT"],
      "estimatedSavings": {
        "timeMinutes": 3,
        "fuelLiters": 1.8,
        "costUSD": 15.50
      }
    }
  },
  "timestamp": "2024-01-16T14:30:15.567Z",
  "responseTimeMs": 78
}`
      }

      return baseExamples
    }

    setApiCalls(generateAPIExamples())
  }, [selectedVendor])

  const executeAPICall = async (callId: string) => {
    setIsExecuting(callId)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, apiCalls[callId]?.responseTime || 500))
    
    setIsExecuting(null)
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const selectedCallData = apiCalls[selectedCall]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* API Call Selector */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-4">API Endpoints</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(apiCalls).map((call) => (
            <button
              key={call.id}
              onClick={() => setSelectedCall(call.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedCall === call.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{call.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  call.method === 'GET' ? 'bg-green-500/20 text-green-300' :
                  call.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                  call.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {call.method}
                </span>
              </div>
              <div className="text-xs text-slate-400">{call.endpoint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* API Call Details */}
      {selectedCallData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Request Section */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Request</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => executeAPICall(selectedCallData.id)}
                  disabled={isExecuting === selectedCallData.id}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded text-sm text-white transition-colors"
                >
                  {isExecuting === selectedCallData.id ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Execute</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(selectedCallData.requestFormat, `request-${selectedCallData.id}`)}
                  className="flex items-center space-x-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-white transition-colors"
                >
                  {copiedStates[`request-${selectedCallData.id}`] ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-slate-300 mb-2">{selectedCallData.description}</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-600 rounded p-3">
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono overflow-x-auto">
                {selectedCallData.requestFormat || 'No request body required'}
              </pre>
            </div>
          </div>

          {/* Response Section */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Response</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{selectedCallData.responseTime}ms</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedCallData.responseFormat, `response-${selectedCallData.id}`)}
                  className="flex items-center space-x-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-white transition-colors"
                >
                  {copiedStates[`response-${selectedCallData.id}`] ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-600 rounded p-3">
              <pre className="text-xs text-blue-400 whitespace-pre-wrap font-mono overflow-x-auto">
                {selectedCallData.responseFormat}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Data Format Summary */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-4">
          {selectedVendor.vendor} Integration Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-400 mb-1">Input Format</div>
            <div className="text-sm text-slate-300">{selectedVendor.dataFormats.input}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Output Format</div>
            <div className="text-sm text-slate-300">{selectedVendor.dataFormats.output}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Protocol</div>
            <div className="text-sm text-slate-300">{selectedVendor.dataFormats.protocol}</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-600">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Integration Complexity</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              selectedVendor.integrationComplexity === 'Low' ? 'bg-green-500/20 text-green-300' :
              selectedVendor.integrationComplexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {selectedVendor.integrationComplexity}
            </span>
            <span className="text-xs text-slate-400">
              {selectedVendor.integrationComplexity === 'Low' ? 'Standardized APIs, minimal customization required' :
               selectedVendor.integrationComplexity === 'Medium' ? 'Some proprietary formats, moderate integration effort' :
               'Proprietary protocols, significant integration complexity'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
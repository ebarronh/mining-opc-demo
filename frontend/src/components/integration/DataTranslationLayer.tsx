'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, RefreshCw, CheckCircle, AlertCircle, Code, Database } from 'lucide-react'
import { translationLayer } from '@/data/fleetManagementSystems'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

interface DataTranslationLayerProps {
  selectedVendor: FleetManagementSystem
  className?: string
}

interface TransformationExample {
  id: string
  title: string
  description: string
  inputData: any
  outputData: any
  transformationRules: string[]
  processingTime: number
  status: 'pending' | 'processing' | 'completed' | 'error'
}

interface MappingRule {
  id: string
  sourceField: string
  targetField: string
  transformation: string
  dataType: string
  validation: string
  example: string
}

export default function DataTranslationLayer({ selectedVendor, className = '' }: DataTranslationLayerProps) {
  const [selectedExample, setSelectedExample] = useState<string>('vehicle-status')
  const [transformationExamples, setTransformationExamples] = useState<Record<string, TransformationExample>>({})
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Generate transformation examples based on selected vendor
  useEffect(() => {
    const generateExamples = (): Record<string, TransformationExample> => {
      const examples: Record<string, TransformationExample> = {
        'vehicle-status': {
          id: 'vehicle-status',
          title: 'Vehicle Status Translation',
          description: 'Transform vendor-specific vehicle status data into ISA-95 standardized format',
          inputData: {},
          outputData: {},
          transformationRules: [
            'Map vendor equipment ID to standardized format',
            'Convert location coordinates to standard GPS format',
            'Normalize status codes to ISA-95 equipment states',
            'Convert units to metric system',
            'Validate data integrity and completeness'
          ],
          processingTime: Math.floor(Math.random() * 30) + 20,
          status: 'completed'
        },
        'payload-data': {
          id: 'payload-data',
          title: 'Payload Data Harmonization',
          description: 'Standardize payload and material data across different vendor formats',
          inputData: {},
          outputData: {},
          transformationRules: [
            'Convert weight units to metric tons',
            'Standardize material classification codes',
            'Normalize grade percentage values',
            'Map load status to standard states',
            'Apply quality validation rules'
          ],
          processingTime: Math.floor(Math.random() * 25) + 15,
          status: 'completed'
        },
        'telemetry': {
          id: 'telemetry',
          title: 'Equipment Telemetry Normalization',
          description: 'Transform equipment telemetry data into standardized monitoring format',
          inputData: {},
          outputData: {},
          transformationRules: [
            'Normalize temperature units to Celsius',
            'Convert pressure values to standard units',
            'Standardize fuel level representations',
            'Map diagnostic codes to common format',
            'Apply outlier detection and filtering'
          ],
          processingTime: Math.floor(Math.random() * 20) + 10,
          status: 'completed'
        }
      }

      // Customize examples based on vendor
      if (selectedVendor.vendor === 'Komatsu') {
        examples['vehicle-status'].inputData = {
          "vehicleId": "KOM-830E-001",
          "model": "830E-AC",
          "position": {
            "lat": -23.5505,
            "lng": -46.6333,
            "elevation": 850,
            "heading": 127
          },
          "operationalStatus": "active",
          "engineState": "running",
          "autonomousMode": true,
          "fuelLevel": 78.5,
          "payload": {
            "weight": 185000,
            "capacity": 220000,
            "material": "iron_ore",
            "grade": 62.3
          }
        }

        examples['vehicle-status'].outputData = {
          "equipmentId": "FLEET-001",
          "equipmentType": "HAUL_TRUCK",
          "manufacturer": "Komatsu",
          "model": "830E-AC",
          "location": {
            "coordinates": {
              "latitude": -23.5505,
              "longitude": -46.6333,
              "elevation": 850.0
            },
            "heading": 127.0,
            "zone": "ACTIVE_MINING"
          },
          "operationalState": "OPERATIONAL",
          "controlMode": "AUTONOMOUS",
          "fuel": {
            "level": 78.5,
            "unit": "PERCENT"
          },
          "load": {
            "currentMass": 185.0,
            "capacity": 220.0,
            "material": {
              "type": "IRON_ORE",
              "grade": 62.3,
              "classification": "HIGH_GRADE"
            },
            "unit": "METRIC_TONS"
          },
          "timestamp": "2024-01-16T14:30:15.000Z",
          "dataQuality": "VALIDATED"
        }
      } else if (selectedVendor.vendor === 'Caterpillar') {
        examples['vehicle-status'].inputData = {
          "Equipment": {
            "VehicleID": "CAT-797F-042",
            "Model": "797F",
            "GPS": {
              "Latitude": -23.5505,
              "Longitude": -46.6333,
              "Altitude": 850,
              "Heading": 127
            },
            "Status": "ACTIVE",
            "EngineState": "RUNNING",
            "CommandMode": "AUTONOMOUS",
            "FuelPercent": 65,
            "LoadData": {
              "Weight_kg": 210000,
              "Capacity_kg": 380000,
              "MaterialType": "WASTE_ROCK",
              "GradeValue": 38.7
            }
          }
        }

        examples['vehicle-status'].outputData = {
          "equipmentId": "FLEET-002",
          "equipmentType": "HAUL_TRUCK",
          "manufacturer": "Caterpillar",
          "model": "797F",
          "location": {
            "coordinates": {
              "latitude": -23.5505,
              "longitude": -46.6333,
              "elevation": 850.0
            },
            "heading": 127.0,
            "zone": "ACTIVE_MINING"
          },
          "operationalState": "OPERATIONAL",
          "controlMode": "AUTONOMOUS",
          "fuel": {
            "level": 65.0,
            "unit": "PERCENT"
          },
          "load": {
            "currentMass": 210.0,
            "capacity": 380.0,
            "material": {
              "type": "WASTE_ROCK",
              "grade": 38.7,
              "classification": "LOW_GRADE"
            },
            "unit": "METRIC_TONS"
          },
          "timestamp": "2024-01-16T14:30:15.000Z",
          "dataQuality": "VALIDATED"
        }
      } else { // Wenco
        examples['vehicle-status'].inputData = {
          "equipmentId": "WEN-MO-128",
          "equipmentType": "HAUL_TRUCK",
          "oem": "MULTI_VENDOR",
          "location": {
            "coordinates": [-46.6333, -23.5505],
            "elevation": 850,
            "heading": 127
          },
          "operationalStatus": {
            "state": "RETURNING",
            "subState": "EMPTY_HAUL",
            "autonomousEnabled": false
          },
          "load": {
            "currentMass": 0,
            "capacity": 300000,
            "material": null
          },
          "vitals": {
            "fuelLevel": 42,
            "speedKph": 35
          }
        }

        examples['vehicle-status'].outputData = {
          "equipmentId": "FLEET-003",
          "equipmentType": "HAUL_TRUCK",
          "manufacturer": "Multi-OEM",
          "model": "Generic-300T",
          "location": {
            "coordinates": {
              "latitude": -23.5505,
              "longitude": -46.6333,
              "elevation": 850.0
            },
            "heading": 127.0,
            "zone": "ACTIVE_MINING"
          },
          "operationalState": "OPERATIONAL",
          "controlMode": "MANUAL",
          "fuel": {
            "level": 42.0,
            "unit": "PERCENT"
          },
          "load": {
            "currentMass": 0.0,
            "capacity": 300.0,
            "material": {
              "type": "EMPTY",
              "grade": 0.0,
              "classification": "NONE"
            },
            "unit": "METRIC_TONS"
          },
          "timestamp": "2024-01-16T14:30:15.000Z",
          "dataQuality": "VALIDATED"
        }
      }

      return examples
    }

    setTransformationExamples(generateExamples())
  }, [selectedVendor])

  // Generate mapping rules
  useEffect(() => {
    const generateMappingRules = (): MappingRule[] => {
      const baseRules = [
        {
          id: 'equipment-id',
          sourceField: selectedVendor.vendor === 'Komatsu' ? 'vehicleId' : 
                      selectedVendor.vendor === 'Caterpillar' ? 'Equipment.VehicleID' : 
                      'equipmentId',
          targetField: 'equipmentId',
          transformation: 'Normalize to FLEET-XXX format',
          dataType: 'string',
          validation: 'Required, alphanumeric',
          example: 'KOM-830E-001 → FLEET-001'
        },
        {
          id: 'coordinates',
          sourceField: selectedVendor.vendor === 'Komatsu' ? 'position.lat, position.lng' :
                      selectedVendor.vendor === 'Caterpillar' ? 'Equipment.GPS.Latitude, Equipment.GPS.Longitude' :
                      'location.coordinates[1], location.coordinates[0]',
          targetField: 'location.coordinates.latitude, location.coordinates.longitude',
          transformation: 'Convert to decimal degrees',
          dataType: 'number',
          validation: 'Range: -90 to 90, -180 to 180',
          example: '-23.5505, -46.6333'
        },
        {
          id: 'weight',
          sourceField: selectedVendor.vendor === 'Komatsu' ? 'payload.weight' :
                      selectedVendor.vendor === 'Caterpillar' ? 'Equipment.LoadData.Weight_kg' :
                      'load.currentMass',
          targetField: 'load.currentMass',
          transformation: 'Convert to metric tons',
          dataType: 'number',
          validation: 'Non-negative, max capacity',
          example: '185000 kg → 185.0 tons'
        },
        {
          id: 'fuel-level',
          sourceField: selectedVendor.vendor === 'Komatsu' ? 'fuelLevel' :
                      selectedVendor.vendor === 'Caterpillar' ? 'Equipment.FuelPercent' :
                      'vitals.fuelLevel',
          targetField: 'fuel.level',
          transformation: 'Normalize to percentage',
          dataType: 'number',
          validation: 'Range: 0-100',
          example: '78.5 → 78.5%'
        },
        {
          id: 'operational-status',
          sourceField: selectedVendor.vendor === 'Komatsu' ? 'operationalStatus' :
                      selectedVendor.vendor === 'Caterpillar' ? 'Equipment.Status' :
                      'operationalStatus.state',
          targetField: 'operationalState',
          transformation: 'Map to ISA-95 states',
          dataType: 'enum',
          validation: 'OPERATIONAL|MAINTENANCE|OFFLINE',
          example: 'active → OPERATIONAL'
        }
      ]

      return baseRules
    }

    setMappingRules(generateMappingRules())
  }, [selectedVendor])

  const processTransformation = async (exampleId: string) => {
    setIsProcessing(true)
    
    // Update example status
    setTransformationExamples(prev => ({
      ...prev,
      [exampleId]: {
        ...prev[exampleId],
        status: 'processing'
      }
    }))

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, transformationExamples[exampleId]?.processingTime || 1000))

    // Complete processing
    setTransformationExamples(prev => ({
      ...prev,
      [exampleId]: {
        ...prev[exampleId],
        status: 'completed'
      }
    }))

    setIsProcessing(false)
  }

  const selectedExampleData = transformationExamples[selectedExample]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">OEM-Agnostic Data Translation Layer</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-cyan-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Real-time Processing</span>
          </div>
        </div>
        
        <p className="text-slate-300 mb-4">
          Standardizes data from {selectedVendor.vendor} systems into ISA-95 compatible formats, 
          enabling seamless integration across multi-vendor mining operations.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">{translationLayer.mappingRules}</div>
            <div className="text-xs text-slate-400">Mapping Rules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{translationLayer.processingLatency}</div>
            <div className="text-xs text-slate-400">Processing Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{translationLayer.protocols.length}</div>
            <div className="text-xs text-slate-400">Supported Protocols</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{translationLayer.transformations.length}</div>
            <div className="text-xs text-slate-400">Transformations</div>
          </div>
        </div>
      </div>

      {/* Transformation Example Selector */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <h4 className="text-lg font-medium text-white mb-4">Data Transformation Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(transformationExamples).map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedExample === example.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{example.title}</span>
                <div className={`w-2 h-2 rounded-full ${
                  example.status === 'completed' ? 'bg-green-400' :
                  example.status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                  example.status === 'error' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
              </div>
              <p className="text-xs text-slate-400">{example.description}</p>
              <div className="mt-2 text-xs text-slate-500">
                Processing: {example.processingTime}ms
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Transformation Visualization */}
      {selectedExampleData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Data */}
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">
                Input Data ({selectedVendor.vendor} Format)
              </h4>
              <button
                onClick={() => processTransformation(selectedExample)}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 rounded text-sm text-white transition-colors"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3 h-3" />
                    <span>Transform</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-slate-900 border border-slate-600 rounded p-4">
              <pre className="text-xs text-orange-400 whitespace-pre-wrap font-mono overflow-x-auto">
                {JSON.stringify(selectedExampleData.inputData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Output Data */}
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Output Data (ISA-95 Standard)</h4>
              <div className="flex items-center space-x-2">
                {selectedExampleData.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
                {selectedExampleData.status === 'processing' && (
                  <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                )}
                {selectedExampleData.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-600 rounded p-4">
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono overflow-x-auto">
                {JSON.stringify(selectedExampleData.outputData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Transformation Rules */}
      {selectedExampleData && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">Transformation Rules Applied</h4>
          <div className="space-y-2">
            {selectedExampleData.transformationRules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-slate-800 rounded">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-cyan-400">{index + 1}</span>
                </div>
                <span className="text-sm text-slate-300">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field Mapping Table */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
        <h4 className="text-lg font-medium text-white mb-4">
          Field Mapping Rules - {selectedVendor.vendor}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 text-slate-300">Source Field</th>
                <th className="text-left py-2 text-slate-300">Target Field</th>
                <th className="text-left py-2 text-slate-300">Transformation</th>
                <th className="text-left py-2 text-slate-300">Data Type</th>
                <th className="text-left py-2 text-slate-300">Example</th>
              </tr>
            </thead>
            <tbody>
              {mappingRules.map((rule) => (
                <tr key={rule.id} className="border-b border-slate-700">
                  <td className="py-3">
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-orange-400">
                      {rule.sourceField}
                    </code>
                  </td>
                  <td className="py-3">
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-green-400">
                      {rule.targetField}
                    </code>
                  </td>
                  <td className="py-3 text-slate-300">{rule.transformation}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                      {rule.dataType}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-400 font-mono">{rule.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Transformations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Formats */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">Supported Input Formats</h4>
          <div className="space-y-2">
            {translationLayer.inputFormats.map((format, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-slate-800 rounded">
                <Code className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-slate-300">{format}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Output Formats */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h4 className="text-lg font-medium text-white mb-4">Standardized Output Formats</h4>
          <div className="space-y-2">
            {translationLayer.outputFormats.map((format, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-slate-800 rounded">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">{format}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
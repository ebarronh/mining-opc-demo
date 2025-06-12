import { AppLayout } from '@/components/layout/AppLayout'
import { Globe, TreePine, Eye, Database, ChevronRight, ChevronDown, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OPC UA Explorer - MineSensors OPC UA',
  description: 'Browse mining equipment nodes and explore the OPC UA address space'
}

// Mock OPC UA address space structure
const mockAddressSpace = {
  'Root': {
    'Objects': {
      'MiningSite_GoldRush': {
        'MiningEquipment': {
          'Excavators': {
            'Excavator_EX001': {
              'OreGrade': '2.5 g/t Au',
              'BucketPosition': {
                'X': '1000.0 m',
                'Y': '2000.0 m', 
                'Z': '-15.0 m'
              },
              'LoadWeight': '35.0 tonnes',
              'OperationalMode': 'Digging'
            },
            'Excavator_EX002': {
              'OreGrade': '3.2 g/t Au',
              'LoadWeight': '42.0 tonnes',
              'OperationalMode': 'Moving'
            }
          },
          'HaulTrucks': {
            'HaulTruck_TR001': {
              'PayloadWeight': '180.0 tonnes',
              'PayloadGrade': '2.8 g/t Au',
              'Destination': 'Crusher'
            },
            'HaulTruck_TR002': {
              'PayloadWeight': '220.0 tonnes',
              'Destination': 'WasteDump'
            },
            'HaulTruck_TR003': {
              'PayloadWeight': '0.0 tonnes',
              'Destination': 'Stockpile_A'
            }
          },
          'Conveyors': {
            'ConveyorBelt_CV001': {
              'ThroughputRate': '1200.0 t/h',
              'BeltSpeed': '3.5 m/s',
              'MaterialGrade': '2.6 g/t Au'
            },
            'ConveyorBelt_CV002': {
              'ThroughputRate': '800.0 t/h',
              'BeltSpeed': '2.8 m/s'
            }
          }
        },
        'GradeControlSystem': {
          'AverageGrade': '2.8 g/t Au',
          'GradeCutoff': '2.5 g/t Au'
        },
        'ProductionMetrics': {
          'HourlyTonnage': '450.0 t/h',
          'ActiveEquipmentCount': '7'
        }
      },
      'DemoControls': {
        'TriggerHighGradeDiscovery': '[Method]'
      }
    }
  }
}

function TreeNode({ name, data, level = 0, isLast = false }: { 
  name: string, 
  data: any, 
  level: number, 
  isLast?: boolean 
}) {
  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data)
  const isValue = typeof data === 'string'
  const isMethod = typeof data === 'string' && data.includes('[Method]')

  return (
    <div className="text-sm">
      <div className="flex items-center space-x-2 py-1 hover:bg-slate-700/50 rounded px-2">
        <div className="flex items-center" style={{ paddingLeft: `${level * 16}px` }}>
          {isObject ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
        
        {isObject ? (
          <Database className="w-4 h-4 text-blue-400" />
        ) : isMethod ? (
          <div className="w-4 h-4 bg-purple-400 rounded-sm flex items-center justify-center">
            <span className="text-xs text-white font-bold">M</span>
          </div>
        ) : (
          <div className="w-4 h-4 bg-green-400 rounded-sm flex items-center justify-center">
            <span className="text-xs text-white font-bold">V</span>
          </div>
        )}
        
        <span className="text-white font-mono">{name}</span>
        
        {isValue && (
          <>
            <span className="text-slate-400">:</span>
            <span className={`${
              isMethod ? 'text-purple-400' : 'text-green-400'
            } font-mono`}>
              {data}
            </span>
          </>
        )}
      </div>
      
      {isObject && Object.entries(data).map(([key, value], index, array) => (
        <TreeNode 
          key={key} 
          name={key} 
          data={value} 
          level={level + 1}
          isLast={index === array.length - 1}
        />
      ))}
    </div>
  )
}

export default function ExplorerPage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Globe className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">OPC UA Explorer</h1>
            <p className="text-slate-400">Browse mining equipment nodes and explore the OPC UA address space</p>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Coming in Phase 4</span>
          </div>
          <p className="text-green-300 text-sm">
            Interactive node browser with live value subscriptions and property inspection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Address Space Tree */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TreePine className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Mining Address Space</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search nodes..."
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white placeholder-slate-400 w-48"
              />
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="font-mono text-sm">
              {Object.entries(mockAddressSpace).map(([key, value]) => (
                <TreeNode key={key} name={key} data={value} level={0} />
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">Objects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">V</span>
                </div>
                <span className="text-slate-300">Variables</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-400 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">M</span>
                </div>
                <span className="text-slate-300">Methods</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Inspector */}
        <div className="space-y-6">
          
          {/* Selected Node Properties */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Node Properties</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Selected Node:</label>
                <p className="text-white font-mono text-sm">Excavator_EX001.OreGrade</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Node ID:</label>
                <p className="text-green-400 font-mono text-sm">ns=1;s=Excavator_EX001.OreGrade</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Data Type:</label>
                <p className="text-blue-400 text-sm">Double</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Current Value:</label>
                <p className="text-yellow-400 font-mono text-sm">2.5 g/t Au</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Last Updated:</label>
                <p className="text-slate-300 text-sm">2024-06-12 16:30:15</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Access Level:</label>
                <p className="text-green-400 text-sm">CurrentRead</p>
              </div>
            </div>
          </div>

          {/* Subscription Panel */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Live Subscriptions</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-mono">OreGrade Variables</p>
                  <p className="text-slate-400 text-xs">2 nodes subscribed</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-mono">Equipment Status</p>
                  <p className="text-slate-400 text-xs">7 nodes subscribed</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-mono">Production Metrics</p>
                  <p className="text-slate-400 text-xs">3 nodes subscribed</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Subscribe to Selected Node
            </button>
          </div>
          
          {/* OPC UA Standards Info */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Standards Compliance</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">OPC UA Mining Companion</span>
                <span className="text-green-400">v1.0 ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ISA-95 Hierarchy</span>
                <span className="text-green-400">Level 1-3 ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mining Equipment Types</span>
                <span className="text-green-400">Compliant ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Address Space Structure</span>
                <span className="text-green-400">Standards-based ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
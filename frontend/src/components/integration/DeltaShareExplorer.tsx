'use client'

import React, { useState, useEffect } from 'react'
import { 
  Share2, 
  Database, 
  Users, 
  Shield, 
  Clock, 
  TrendingDown, 
  Settings, 
  Eye, 
  Download,
  Server,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Calendar,
  DollarSign,
  UserPlus
} from 'lucide-react'

interface DeltaShareState {
  role: 'provider' | 'recipient'
  datasets: DeltaDataset[]
  shares: DeltaShare[]
  governance: GovernanceMetrics
  performance: PerformanceMetrics
}

interface DeltaDataset {
  id: string
  name: string
  description: string
  schema: string
  table: string
  size: string
  rows: number
  lastUpdated: string
  shared: boolean
  recipients?: number
}

interface DeltaShare {
  id: string
  name: string
  provider: string
  datasets: string[]
  status: 'active' | 'pending' | 'expired'
  expiresAt: string
  accessLevel: 'read' | 'restricted'
  usage: number
}

interface GovernanceMetrics {
  totalShares: number
  activeRecipients: number
  dataVolume: string
  auditEvents: number
}

interface PerformanceMetrics {
  zeroMovement: boolean
  costSavings: number
  accessTime: string
  bandwidth: string
}

export default function DeltaShareExplorer() {
  const [deltaState, setDeltaState] = useState<DeltaShareState>({
    role: 'provider',
    datasets: [],
    shares: [],
    governance: {
      totalShares: 0,
      activeRecipients: 0,
      dataVolume: '0 TB',
      auditEvents: 0
    },
    performance: {
      zeroMovement: true,
      costSavings: 0,
      accessTime: '0ms',
      bandwidth: '0 Gbps'
    }
  })

  const [activeTab, setActiveTab] = useState<'datasets' | 'shares' | 'governance' | 'performance' | 'security' | 'onboarding' | 'calculator'>('datasets')
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)

  // Initialize sample data
  useEffect(() => {
    const sampleDatasets: DeltaDataset[] = [
      {
        id: 'ore_grades_2024',
        name: 'Ore Grades 2024',
        description: 'Real-time ore grade measurements from XRF analyzers',
        schema: 'mining_production',
        table: 'ore_grades',
        size: '2.4 TB',
        rows: 50000000,
        lastUpdated: '2024-01-16T14:30:00Z',
        shared: true,
        recipients: 5
      },
      {
        id: 'equipment_telemetry',
        name: 'Equipment Telemetry',
        description: 'Haul truck and excavator operational data',
        schema: 'mining_operations',
        table: 'equipment_metrics',
        size: '1.8 TB',
        rows: 35000000,
        lastUpdated: '2024-01-16T14:25:00Z',
        shared: true,
        recipients: 3
      },
      {
        id: 'production_daily',
        name: 'Daily Production Reports',
        description: 'Aggregated daily production metrics and KPIs',
        schema: 'mining_analytics',
        table: 'production_summary',
        size: '156 GB',
        rows: 2500000,
        lastUpdated: '2024-01-16T08:00:00Z',
        shared: false,
        recipients: 0
      }
    ]

    const sampleShares: DeltaShare[] = [
      {
        id: 'share_mining_partners',
        name: 'Mining Partners Consortium',
        provider: 'GlobalMining Corp',
        datasets: ['ore_grades_2024', 'equipment_telemetry'],
        status: 'active',
        expiresAt: '2024-12-31T23:59:59Z',
        accessLevel: 'read',
        usage: 85
      },
      {
        id: 'share_regulatory',
        name: 'Regulatory Compliance Data',
        provider: 'MineOps Inc',
        datasets: ['production_daily'],
        status: 'active',
        expiresAt: '2024-06-30T23:59:59Z',
        accessLevel: 'restricted',
        usage: 45
      }
    ]

    setDeltaState(prev => ({
      ...prev,
      datasets: sampleDatasets,
      shares: sampleShares,
      governance: {
        totalShares: sampleShares.length,
        activeRecipients: 8,
        dataVolume: '4.2 TB',
        auditEvents: 1250
      },
      performance: {
        zeroMovement: true,
        costSavings: 125000,
        accessTime: '150ms',
        bandwidth: '10 Gbps'
      }
    }))
  }, [])

  const renderDatasetsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Available Datasets</h3>
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-400">{deltaState.datasets.filter(d => d.shared).length} shared</span>
        </div>
      </div>

      <div className="grid gap-4">
        {deltaState.datasets.map((dataset) => (
          <div 
            key={dataset.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedDataset === dataset.id 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
            onClick={() => setSelectedDataset(selectedDataset === dataset.id ? null : dataset.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{dataset.name}</h4>
                  <p className="text-sm text-slate-400">{dataset.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {dataset.shared && (
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">{dataset.recipients} recipients</span>
                  </div>
                )}
                <span className={`px-2 py-1 rounded text-xs ${
                  dataset.shared 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                }`}>
                  {dataset.shared ? 'Shared' : 'Private'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Size:</span>
                <div className="text-white font-medium">{dataset.size}</div>
              </div>
              <div>
                <span className="text-slate-400">Rows:</span>
                <div className="text-white font-medium">{dataset.rows.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-slate-400">Schema:</span>
                <div className="text-white font-medium">{dataset.schema}</div>
              </div>
              <div>
                <span className="text-slate-400">Updated:</span>
                <div className="text-white font-medium">
                  {new Date(dataset.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>

            {selectedDataset === dataset.id && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <h5 className="font-medium text-white mb-2">Cross-Platform Access</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Python</span>
                    </div>
                    <code className="text-xs text-slate-300">
                      delta_sharing.load_as_pandas("share#mining.{dataset.table}")
                    </code>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-white">Tableau</span>
                    </div>
                    <code className="text-xs text-slate-300">
                      Delta Share connector → {dataset.name}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderSharesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Active Shares</h3>
        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          <span className="text-sm">New Share</span>
        </button>
      </div>

      <div className="grid gap-4">
        {deltaState.shares.map((share) => (
          <div key={share.id} className="border border-slate-600 bg-slate-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{share.name}</h4>
                  <p className="text-sm text-slate-400">Provider: {share.provider}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  share.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : share.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {share.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-slate-400">Datasets:</span>
                <div className="text-white font-medium">{share.datasets.length}</div>
              </div>
              <div>
                <span className="text-slate-400">Usage:</span>
                <div className="text-white font-medium">{share.usage}%</div>
              </div>
              <div>
                <span className="text-slate-400">Access Level:</span>
                <div className="text-white font-medium capitalize">{share.accessLevel}</div>
              </div>
              <div>
                <span className="text-slate-400">Expires:</span>
                <div className="text-white font-medium">
                  {new Date(share.expiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGovernanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Data Governance Dashboard</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Total Shares</span>
          </div>
          <div className="text-2xl font-bold text-white">{deltaState.governance.totalShares}</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">Active Recipients</span>
          </div>
          <div className="text-2xl font-bold text-white">{deltaState.governance.activeRecipients}</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Data Volume</span>
          </div>
          <div className="text-2xl font-bold text-white">{deltaState.governance.dataVolume}</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-slate-400">Audit Events</span>
          </div>
          <div className="text-2xl font-bold text-white">{deltaState.governance.auditEvents}</div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h4 className="font-medium text-white mb-4">Recent Audit Log</h4>
        <div className="space-y-3">
          {[
            { time: '14:30', action: 'Dataset accessed', user: 'analytics@partner.com', dataset: 'Ore Grades 2024' },
            { time: '14:25', action: 'Share created', user: 'admin@mineops.com', dataset: 'Equipment Telemetry' },
            { time: '14:20', action: 'Permission granted', user: 'data@regulatory.gov', dataset: 'Production Daily' },
            { time: '14:15', action: 'Share expired', user: 'temp@contractor.com', dataset: 'Historical Data' }
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-400">{event.time}</span>
                <span className="text-sm text-white">{event.action}</span>
                <span className="text-sm text-blue-400">{event.dataset}</span>
              </div>
              <span className="text-sm text-slate-400">{event.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Share2 className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Delta Share Protocol</h2>
            <p className="text-sm text-slate-400">Secure data sharing without data movement</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDeltaState(prev => ({ ...prev, role: 'provider' }))}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              deltaState.role === 'provider' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Provider
          </button>
          <button 
            onClick={() => setDeltaState(prev => ({ ...prev, role: 'recipient' }))}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              deltaState.role === 'recipient' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Recipient
          </button>
          <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
            Task 4.0 Active
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
        {[
          { key: 'datasets', label: 'Datasets', icon: Database },
          { key: 'shares', label: 'Shares', icon: Users },
          { key: 'governance', label: 'Governance', icon: Shield },
          { key: 'performance', label: 'Performance', icon: TrendingDown },
          { key: 'security', label: 'Security', icon: Lock },
          { key: 'onboarding', label: 'Onboarding', icon: UserPlus },
          { key: 'calculator', label: 'Cost Calculator', icon: DollarSign }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-96">
        {activeTab === 'datasets' && renderDatasetsTab()}
        {activeTab === 'shares' && renderSharesTab()}
        {activeTab === 'governance' && renderGovernanceTab()}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Performance Benefits</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">Zero Data Movement</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Data stays in its original location. Recipients access via secure links.
                </p>
                <div className="text-2xl font-bold text-green-400">100% Efficient</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Cost Savings</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Eliminated data transfer and storage duplication costs.
                </p>
                <div className="text-2xl font-bold text-blue-400">
                  ${deltaState.performance.costSavings.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Incremental Data Updates</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <h5 className="font-medium text-white">Ore Grades Dataset</h5>
                      <p className="text-sm text-slate-400">Last update: 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">+2,485 new records</div>
                    <div className="text-xs text-slate-400">Auto-sync enabled</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <h5 className="font-medium text-white">Equipment Telemetry</h5>
                      <p className="text-sm text-slate-400">Last update: 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">+1,847 new records</div>
                    <div className="text-xs text-slate-400">Auto-sync enabled</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h5 className="font-medium text-white">Production Reports</h5>
                      <p className="text-sm text-slate-400">Last update: 8 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-400">Daily batch update</div>
                    <div className="text-xs text-slate-400">Next: 6:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">{deltaState.performance.accessTime}</div>
                <div className="text-sm text-slate-400">Average Access Time</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">{deltaState.performance.bandwidth}</div>
                <div className="text-sm text-slate-400">Peak Bandwidth</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-sm text-slate-400">Uptime SLA</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Row/Column Level Security</h3>
            
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Security Policies</h4>
              
              <div className="space-y-4">
                <div className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-white">Ore Grades Dataset</h5>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-slate-300 mb-2">Row-Level Filters</h6>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Mine Site = 'PARTNER_ACCESSIBLE'</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Grade > 0.5% Cu</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Date >= '2024-01-01'</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-medium text-slate-300 mb-2">Column Access</h6>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">ore_grade, timestamp</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">gps_coordinates</span>
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">equipment_id</span>
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-white">Equipment Telemetry</h5>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Restricted</span>
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    <p>• Fuel consumption data excluded</p>
                    <p>• Location data aggregated to 100m grid</p>
                    <p>• Maintenance schedules redacted</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Share Expiration Management</h4>
              
              <div className="space-y-4">
                {deltaState.shares.map((share) => (
                  <div key={share.id} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-white">{share.name}</h5>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-400">
                          Expires: {new Date(share.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                        Extend Access
                      </button>
                      <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors">
                        Modify Permissions
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'onboarding' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Recipient Onboarding Workflow</h3>
            
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Onboarding Steps</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h5 className="font-medium text-white">1. Identity Verification</h5>
                    <p className="text-sm text-slate-400">Recipient identity confirmed via enterprise SSO</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h5 className="font-medium text-white">2. Access Request</h5>
                    <p className="text-sm text-slate-400">Request submitted for mining consortium data access</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <div>
                    <h5 className="font-medium text-white">3. Legal Review</h5>
                    <p className="text-sm text-slate-400">Data sharing agreement under review (2-3 business days)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                  <div className="w-6 h-6 border-2 border-slate-500 rounded-full"></div>
                  <div>
                    <h5 className="font-medium text-white">4. Technical Setup</h5>
                    <p className="text-sm text-slate-400">Configure Delta Share client and credentials</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                  <div className="w-6 h-6 border-2 border-slate-500 rounded-full"></div>
                  <div>
                    <h5 className="font-medium text-white">5. Data Access</h5>
                    <p className="text-sm text-slate-400">Begin accessing shared mining datasets</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Quick Start Guide</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-slate-300 mb-2">1. Install Delta Sharing Client</h5>
                  <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300">
                    pip install delta-sharing
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-300 mb-2">2. Configure Profile</h5>
                  <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300">
                    {`{
  "shareCredentialsVersion": 1,
  "endpoint": "https://sharing.miningcorp.com/delta-sharing/",
  "bearerToken": "your_token_here"
}`}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-300 mb-2">3. Access Data</h5>
                  <div className="bg-slate-900 rounded p-3 font-mono text-sm text-slate-300">
                    import delta_sharing<br/>
                    df = delta_sharing.load_as_pandas("profile.share#mining.ore_grades")
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Cost Savings Calculator</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Traditional Data Sharing Costs</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Data Volume:</span>
                    <span className="text-white font-medium">4.2 TB</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cloud Egress (@$0.09/GB):</span>
                    <span className="text-white font-medium">$387/month</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duplicate Storage:</span>
                    <span className="text-white font-medium">$168/month</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Data Pipeline Maintenance:</span>
                    <span className="text-white font-medium">$2,500/month</span>
                  </div>
                  
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-white font-medium">Total Monthly Cost:</span>
                      <span className="text-red-400 font-bold">$3,055</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Delta Share Costs</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Data Volume:</span>
                    <span className="text-white font-medium">4.2 TB (zero movement)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cloud Egress:</span>
                    <span className="text-green-400 font-medium">$0/month</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duplicate Storage:</span>
                    <span className="text-green-400 font-medium">$0/month</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Delta Share Service:</span>
                    <span className="text-white font-medium">$50/month</span>
                  </div>
                  
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-white font-medium">Total Monthly Cost:</span>
                      <span className="text-green-400 font-bold">$50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <h4 className="text-xl font-bold text-white">Monthly Savings: $3,005</h4>
                  <p className="text-slate-300">Annual Savings: $36,060</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">98.4%</div>
                  <div className="text-sm text-slate-400">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">Zero</div>
                  <div className="text-sm text-slate-400">Data Movement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">Instant</div>
                  <div className="text-sm text-slate-400">Access</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Additional Benefits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Real-time data access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Reduced security risks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Simplified data governance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Faster time to insights</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
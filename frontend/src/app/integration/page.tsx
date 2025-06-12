import { AppLayout } from '@/components/layout/AppLayout'
import { LinkIcon, Building2, BarChart3, Workflow } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integration Hub - MineSensors OPC UA',
  description: 'ISA-95 enterprise integration and FMS connectivity'
}

export default function IntegrationPage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <LinkIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Integration Hub</h1>
            <p className="text-slate-400">ISA-95 enterprise integration and FMS connectivity</p>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-purple-400 font-medium">Coming in Phase 5</span>
          </div>
          <p className="text-purple-300 text-sm">
            Enterprise integration with ISA-95 flow diagrams and Fleet Management System connectivity
          </p>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* ISA-95 Flow Diagram */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Workflow className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ISA-95 Integration Flow</h3>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-4 h-40 flex items-center justify-center">
            <div className="text-center">
              <Workflow className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Enterprise Control Integration</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Level 1-5 hierarchy mapping</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Equipment to enterprise data flow</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Standards-based integration</span>
            </li>
          </ul>
        </div>

        {/* FMS Connectivity */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Fleet Management System</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Caterpillar MineStar</span>
                <span className="text-green-400 text-xs">Connected</span>
              </div>
              <p className="text-slate-400 text-xs">REST API integration</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Komatsu DISPATCH</span>
                <span className="text-yellow-400 text-xs">Pending</span>
              </div>
              <p className="text-slate-400 text-xs">SOAP web services</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Hexagon MineOperate</span>
                <span className="text-blue-400 text-xs">Configured</span>
              </div>
              <p className="text-slate-400 text-xs">OPC UA integration</p>
            </div>
          </div>
        </div>

        {/* Throughput Metrics */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Multi-Protocol Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">30+</div>
              <div className="text-sm text-slate-400">Messages/second</div>
              <div className="text-xs text-green-400 mt-1">REST API</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
              <div className="text-sm text-slate-400">SOAP calls/second</div>
              <div className="text-xs text-blue-400 mt-1">Web Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">45+</div>
              <div className="text-sm text-slate-400">OPC UA subscriptions</div>
              <div className="text-xs text-purple-400 mt-1">Real-time data</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Enterprise Standards</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• ISA-95 Levels 1-5</li>
              <li>• Enterprise Resource Planning</li>
              <li>• Manufacturing Execution</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Communication Protocols</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• OPC UA client/server</li>
              <li>• REST API interfaces</li>
              <li>• SOAP web services</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Fleet Management</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Caterpillar MineStar</li>
              <li>• Komatsu DISPATCH</li>
              <li>• Hexagon MineOperate</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Performance</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• &lt;2s data latency</li>
              <li>• 30+ msg/sec throughput</li>
              <li>• Enterprise scalability</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
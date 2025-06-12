import { AppLayout } from '@/components/layout/AppLayout'
import { SystemStatus } from '@/components/status/SystemStatus'
import { WebSocketStatus } from '@/components/websocket/WebSocketStatus'
import Link from 'next/link'
import { BarChart3, Globe, Link as LinkIcon, CheckCircle, Pickaxe } from 'lucide-react'

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="text-center mb-12 fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-4 mining-gradient rounded-2xl pulse-glow shadow-2xl">
            <Pickaxe className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          MineSensors OPC UA
          <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
            Mining Demo
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
          Executive-ready, standards-based real-time ore intelligence platform showcasing 
          <span className="text-blue-400 font-semibold"> OPC UA Mining Companion Specification</span> 
          with enterprise-grade integration capabilities
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Phase 3 Active</span>
          </div>
          <div className="w-1 h-4 bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <span>ISA-95 Compliant</span>
          </div>
          <div className="w-1 h-4 bg-slate-600"></div>
          <div className="flex items-center space-x-2">
            <span>Real-time Ready</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link 
          href="/real-time" 
          className="group executive-card p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Real-time Monitor
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                3D mine pit visualization with live equipment tracking, grade heatmaps, and real-time data streaming
              </p>
              <div className="mt-3 text-sm text-blue-400">
                Coming in Phase 4 →
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/explorer" 
          className="group executive-card p-8 transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                OPC UA Explorer
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Browse hierarchical mining equipment nodes, subscribe to live values, and explore the OPC UA address space
              </p>
              <div className="mt-3 text-sm text-green-400">
                Coming in Phase 4 →
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/integration" 
          className="group executive-card p-8 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <LinkIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Integration Hub
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                ISA-95 enterprise integration flow, FMS connectivity cards, and throughput performance metrics
              </p>
              <div className="mt-3 text-sm text-purple-400">
                Coming in Phase 5 →
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/compliance" 
          className="group executive-card p-8 transition-all duration-300 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 slide-up"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
              <CheckCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                Compliance Dashboard
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                OPC UA Mining Companion Specification compliance tracking and regulatory audit capabilities
              </p>
              <div className="mt-3 text-sm text-yellow-400">
                Coming in Phase 5 →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* System Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStatus />
        </div>
        <div>
          <WebSocketStatus showDetails={true} />
        </div>
      </div>
    </AppLayout>
  )
}

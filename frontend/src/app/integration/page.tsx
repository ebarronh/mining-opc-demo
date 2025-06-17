import { AppLayout } from '@/components/layout/AppLayout'
import ISA95Pyramid from '@/components/integration/ISA95Pyramid'
import FleetIntegration from '@/components/integration/FleetIntegration'
import { Building2, BarChart3, Workflow } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integration Hub - MineSensors OPC UA',
  description: 'ISA-95 enterprise integration and FMS connectivity'
}

export default function IntegrationPage() {
  return (
    <AppLayout>
      {/* Status Banner */}
      <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">Phase 5 Active</span>
        </div>
        <p className="text-green-300 text-sm">
          Interactive ISA-95 enterprise integration with real-time data flow visualization
        </p>
      </div>

      {/* ISA-95 Pyramid Visualization */}
      <div className="mb-8">
        <ISA95Pyramid 
          showDataFlow={true}
          showLatencyMetrics={true}
          showProtocolTransition={true}
          showFollowTheData={true}
          showBiDirectionalFlow={true}
          showSecurityBoundaries={true}
          showDataVolumeMetrics={true}
        />
      </div>

      {/* Integration Components Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Task 2.0: Fleet Management System Integration - ACTIVE */}
        <div className="lg:col-span-2 xl:col-span-3">
          <FleetIntegration />
        </div>

        {/* Task 3.0: Oracle Cloud Integration */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Oracle Cloud</h3>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              Task 3.0
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">OracleConnector Component</p>
              <p className="text-slate-600 text-xs mt-1">Coming in Phase 5.3</p>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Autonomous Database visualization</li>
            <li>• ORDS API endpoint demonstrations</li>
            <li>• Oracle APEX low-code examples</li>
          </ul>
        </div>

        {/* Task 4.0: Delta Share Protocol */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Workflow className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Delta Share</h3>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              Task 4.0
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <Workflow className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">DeltaShareExplorer Component</p>
              <p className="text-slate-600 text-xs mt-1">Coming in Phase 5.4</p>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Cross-platform data sharing (Python, Spark, Tableau)</li>
            <li>• Zero data movement architecture</li>
            <li>• Row/column level security</li>
          </ul>
        </div>

        {/* Task 5.0: ERP Integration & Edge Computing */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">ERP & Edge</h3>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              Task 5.0
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">ERPIntegration & EdgeComputing</p>
              <p className="text-slate-600 text-xs mt-1">Coming in Phase 5.5</p>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Multi-ERP connectors (SAP, Oracle, Dynamics)</li>
            <li>• Edge computing resilience scenarios</li>
            <li>• Environmental challenge simulations</li>
          </ul>
        </div>

        {/* Task 6.0: Analytics Dashboard & API Playground */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Analytics & APIs</h3>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              Task 6.0
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">AnalyticsDashboard & APIPlayground</p>
              <p className="text-slate-600 text-xs mt-1">Coming in Phase 5.6</p>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Predictive analytics with XGBoost models</li>
            <li>• Interactive API endpoint testing</li>
            <li>• Real-time KPI displays</li>
          </ul>
        </div>

        {/* Task 7.0: Educational Features */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Workflow className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Education</h3>
            </div>
            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
              Task 7.0
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <Workflow className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">Educational Components</p>
              <p className="text-slate-600 text-xs mt-1">Coming in Phase 5.7</p>
            </div>
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Integration pattern library</li>
            <li>• Interactive troubleshooting guide</li>
            <li>• Architecture decision records</li>
          </ul>
        </div>
      </div>

      {/* Task 1.0 Completion Summary */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h3 className="text-lg font-semibold text-white">Task 1.0: ISA-95 Integration System - COMPLETED</h3>
          <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
            ✅ Phase 5.1
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-400 font-bold">1.1-1.10</div>
            <div className="text-slate-400 text-xs">All Sub-tasks</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">6 Levels</div>
            <div className="text-slate-400 text-xs">ISA-95 Hierarchy</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">50+ Tests</div>
            <div className="text-slate-400 text-xs">Comprehensive Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">Live Data</div>
            <div className="text-slate-400 text-xs">Real-time Animation</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">Executive</div>
            <div className="text-slate-400 text-xs">Ready Presentation</div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
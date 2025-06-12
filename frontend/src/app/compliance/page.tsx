import { AppLayout } from '@/components/layout/AppLayout'
import { CheckCircle, Shield, FileText, Award, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compliance - MineSensors OPC UA',
  description: 'OPC UA Mining standards compliance and audit tracking'
}

export default function CompliancePage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
            <p className="text-slate-400">OPC UA Mining standards compliance and audit tracking</p>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-medium">Coming in Phase 5</span>
          </div>
          <p className="text-yellow-300 text-sm">
            Comprehensive standards compliance tracking and regulatory audit capabilities
          </p>
        </div>
      </div>

      {/* Compliance Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* OPC UA Mining Companion Spec */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">OPC UA Mining Companion v1.0</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Address Space Structure</span>
              <span className="text-green-400 text-xs">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Mining Equipment Types</span>
              <span className="text-green-400 text-xs">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Data Types & Variables</span>
              <span className="text-green-400 text-xs">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Method Implementations</span>
              <span className="text-yellow-400 text-xs">⚠ Partial</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">95%</div>
            <div className="text-sm text-slate-400">Compliance Score</div>
          </div>
        </div>

        {/* ISA-95 Standards */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ISA-95 Enterprise Integration</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Level 1: Physical Process</span>
              <span className="text-green-400 text-xs">✓ Implemented</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Level 2: Monitoring/Control</span>
              <span className="text-green-400 text-xs">✓ Implemented</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Level 3: Manufacturing Operations</span>
              <span className="text-green-400 text-xs">✓ Implemented</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Level 4: Business Planning</span>
              <span className="text-yellow-400 text-xs">⚠ In Progress</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
            <div className="text-sm text-slate-400">Implementation Coverage</div>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Regulatory Compliance</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">MSHA Safety Standards</span>
              <span className="text-green-400 text-xs">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Environmental Reporting</span>
              <span className="text-green-400 text-xs">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Data Privacy (GDPR)</span>
              <span className="text-yellow-400 text-xs">⚠ Review Required</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-white text-sm">Cybersecurity Framework</span>
              <span className="text-red-400 text-xs">✗ Action Needed</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">75%</div>
            <div className="text-sm text-slate-400">Regulatory Score</div>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Audit Trail & Certification</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Last OPC UA Audit</span>
                <span className="text-green-400 text-xs">2024-05-15</span>
              </div>
              <p className="text-slate-400 text-xs">Certification renewed</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Security Assessment</span>
                <span className="text-yellow-400 text-xs">2024-03-10</span>
              </div>
              <p className="text-slate-400 text-xs">Minor issues addressed</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm">Next Compliance Review</span>
                <span className="text-blue-400 text-xs">2024-12-01</span>
              </div>
              <p className="text-slate-400 text-xs">Scheduled quarterly review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Actions */}
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Required Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium text-sm">High Priority</span>
            </div>
            <p className="text-white text-sm mb-1">Cybersecurity Framework</p>
            <p className="text-slate-400 text-xs">Implement NIST security controls</p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium text-sm">Medium Priority</span>
            </div>
            <p className="text-white text-sm mb-1">GDPR Data Privacy</p>
            <p className="text-slate-400 text-xs">Review data handling procedures</p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">Low Priority</span>
            </div>
            <p className="text-white text-sm mb-1">OPC UA Method Extensions</p>
            <p className="text-slate-400 text-xs">Complete remaining method implementations</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
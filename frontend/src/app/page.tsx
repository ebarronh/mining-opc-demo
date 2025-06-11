import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            MineSensors OPC UA
            <span className="block text-blue-400">Mining Demo</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Standards-based, real-time ore intelligence platform showcasing OPC UA Mining Companion Specification
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link 
            href="/real-time" 
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-6 transition-all duration-200 hover:border-blue-400"
          >
            <div className="text-blue-400 text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitor</h3>
            <p className="text-slate-400 text-sm group-hover:text-slate-300">
              3D mine visualization with live equipment tracking and grade data
            </p>
          </Link>

          <Link 
            href="/explorer" 
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-6 transition-all duration-200 hover:border-green-400"
          >
            <div className="text-green-400 text-2xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">OPC UA Explorer</h3>
            <p className="text-slate-400 text-sm group-hover:text-slate-300">
              Browse and subscribe to mining equipment nodes and live values
            </p>
          </Link>

          <Link 
            href="/integration" 
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-6 transition-all duration-200 hover:border-purple-400"
          >
            <div className="text-purple-400 text-2xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold text-white mb-2">Integration Hub</h3>
            <p className="text-slate-400 text-sm group-hover:text-slate-300">
              ISA-95 flow and FMS connectivity with throughput metrics
            </p>
          </Link>

          <Link 
            href="/compliance" 
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-6 transition-all duration-200 hover:border-yellow-400"
          >
            <div className="text-yellow-400 text-2xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
            <p className="text-slate-400 text-sm group-hover:text-slate-300">
              OPC UA Mining standards compliance and audit tracking
            </p>
          </Link>
        </div>

        {/* Status Section */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Frontend: Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300">OPC UA Server: Phase 1</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300">WebSocket Bridge: Pending</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">OPC UA Explorer</h1>
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-8">
        <p className="text-slate-300 text-lg">
          🚧 Coming in Phase 4: Interactive OPC UA address space browser
        </p>
        <ul className="mt-4 text-slate-400 space-y-2">
          <li>• Tree view of mining equipment nodes</li>
          <li>• Live value subscription with badges</li>
          <li>• Browse MiningEquipmentType instances</li>
        </ul>
      </div>
    </div>
  )
}
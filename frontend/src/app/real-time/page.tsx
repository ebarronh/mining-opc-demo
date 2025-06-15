'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/components/layout/AppLayout';
import { WebSocketStatus } from '@/components/websocket/WebSocketStatus';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Box, Activity, MapPin, Thermometer, BarChart3, Eye, EyeOff, Tag } from 'lucide-react';
import type { EquipmentPosition, GradeData, EquipmentPositionsMessage, GradeDataMessage } from '@/types/websocket';

// Dynamically import Three.js components to avoid SSR issues
const MineScene = dynamic(() => import('@/components/three/MineScene'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Box className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
        <p className="text-slate-500 text-sm">Loading 3D Scene...</p>
      </div>
    </div>
  )
});

const Equipment = dynamic(() => import('@/components/three/Equipment'), { ssr: false });
const GradeHeatmap = dynamic(() => import('@/components/three/GradeHeatmap'), { ssr: false });
const CameraControls = dynamic(() => import('@/components/three/CameraControls'), { ssr: false });
const CameraControlsUI = dynamic(() => import('@/components/three/CameraControlsUI'), { ssr: false });

// Mock data for development (will be replaced by WebSocket data)
const mockEquipmentPositions: EquipmentPosition[] = [
  {
    id: 'EX001',
    type: 'excavator',
    position: { x: -100, y: 0, z: -50 },
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    status: 'operating',
    telemetry: { speed: 0, payload: 150, temperature: 75 }
  },
  {
    id: 'TR001',
    type: 'truck',
    position: { x: -80, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    status: 'operating',
    telemetry: { speed: 15, payload: 200, temperature: 80 }
  },
  {
    id: 'TR002',
    type: 'truck',
    position: { x: 50, y: 0, z: 80 },
    rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    status: 'idle',
    telemetry: { speed: 0, payload: 0, temperature: 60 }
  },
  {
    id: 'CV001',
    type: 'conveyor',
    position: { x: 100, y: 0, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    status: 'operating'
  }
];

// Generate mock grade data
const generateMockGradeData = (): GradeData => {
  const rows = 20;
  const columns = 20;
  const grid: number[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < columns; j++) {
      // Create realistic grade patterns
      const centerX = 10;
      const centerY = 10;
      const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
      const baseGrade = Math.max(0, 3 - distance * 0.2);
      const noise = Math.random() * 0.5;
      row.push(Math.max(0.1, Math.min(3.5, baseGrade + noise)));
    }
    grid.push(row);
  }
  
  return {
    timestamp: Date.now(),
    grid,
    gridSize: { rows, columns },
    bounds: {
      minX: -250,
      maxX: 250,
      minY: -250,
      maxY: 250
    },
    statistics: {
      averageGrade: 1.5,
      minGrade: 0.1,
      maxGrade: 3.5
    }
  };
};

export default function RealTimePage() {
  const { messageHistory: messages = [], state: connectionState } = useWebSocket();
  const [showGradeHeatmap, setShowGradeHeatmap] = useState(false);
  const [showEquipmentLabels, setShowEquipmentLabels] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentPosition | null>(null);
  const [equipmentPositions, setEquipmentPositions] = useState<EquipmentPosition[]>(mockEquipmentPositions);
  const [gradeData, setGradeData] = useState<GradeData | null>(null);
  
  // Process WebSocket messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;
    
    if (latestMessage.type === 'equipment_positions') {
      const positionsMessage = latestMessage as EquipmentPositionsMessage;
      setEquipmentPositions(positionsMessage.payload.equipment);
    } else if (latestMessage.type === 'grade_data') {
      const gradeMessage = latestMessage as GradeDataMessage;
      setGradeData(gradeMessage.payload);
    }
  }, [messages]);
  
  // Generate initial grade data
  useEffect(() => {
    setGradeData(generateMockGradeData());
  }, []);
  
  const handleEquipmentHover = useCallback((equipment: EquipmentPosition | null) => {
    // Could show tooltip on hover
  }, []);
  
  const handleEquipmentClick = useCallback((equipment: EquipmentPosition) => {
    setSelectedEquipment(equipment);
  }, []);
  
  const handleEquipmentDoubleClick = useCallback((equipment: EquipmentPosition) => {
    // Focus camera on equipment
    const event = new CustomEvent('focusOnEquipment', { detail: equipment });
    window.dispatchEvent(event);
  }, []);
  
  const handleGradeCellClick = useCallback((row: number, col: number, grade: number) => {
    console.log(`Grade at cell [${row}, ${col}]: ${grade.toFixed(2)}%`);
  }, []);
  
  const toggleGradeHeatmap = useCallback(() => {
    setShowGradeHeatmap(prev => !prev);
  }, []);
  
  const toggleEquipmentLabels = useCallback(() => {
    setShowEquipmentLabels(prev => !prev);
  }, []);
  
  const toggleHelp = useCallback(() => {
    setShowShortcuts(prev => !prev);
  }, []);
  
  return (
    <AppLayout>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Real-time Monitor</h1>
              <p className="text-slate-400">3D mine pit visualization with live equipment tracking</p>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleGradeHeatmap}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showGradeHeatmap 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {showGradeHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Grade Heatmap</span>
            </button>
            
            <button
              onClick={toggleEquipmentLabels}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showEquipmentLabels 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Tag className={`w-4 h-4 ${!showEquipmentLabels ? 'opacity-50' : ''}`} />
              <span>Labels</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 3D Visualization (3 columns) */}
        <div className="lg:col-span-3 bg-slate-800 border border-slate-600 rounded-xl p-4">
          <div className="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden">
            <MineScene className="w-full h-full">
              {/* Equipment */}
              {equipmentPositions.map(equipment => (
                <Equipment
                  key={equipment.id}
                  data={equipment}
                  onHover={handleEquipmentHover}
                  onClick={handleEquipmentClick}
                  onDoubleClick={handleEquipmentDoubleClick}
                  showLabel={showEquipmentLabels}
                />
              ))}
              
              {/* Grade Heatmap */}
              <GradeHeatmap
                data={gradeData}
                visible={showGradeHeatmap}
                onCellClick={handleGradeCellClick}
              />
              
              {/* Camera Controls - Inside Canvas */}
              <CameraControls
                equipmentPositions={equipmentPositions}
                onToggleGradeHeatmap={toggleGradeHeatmap}
                onToggleEquipmentLabels={toggleEquipmentLabels}
                onToggleHelp={toggleHelp}
              />
            </MineScene>
            
            {/* Camera Controls UI - Outside Canvas */}
            <CameraControlsUI
              showShortcuts={showShortcuts}
              onToggleShortcuts={toggleHelp}
            />
          </div>
        </div>
        
        {/* Status Panel (1 column) */}
        <div className="space-y-4">
          
          {/* WebSocket Status */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Connection Status</h3>
            <WebSocketStatus showDetails={true} />
          </div>
          
          {/* Equipment List */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Equipment Status</h3>
            <div className="space-y-2">
              {equipmentPositions.map(equipment => (
                <div
                  key={equipment.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedEquipment?.id === equipment.id
                      ? 'bg-blue-500/20 border border-blue-500/40'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                  onClick={() => handleEquipmentClick(equipment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        equipment.status === 'operating' ? 'bg-green-400' :
                        equipment.status === 'idle' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <span className="text-white text-sm font-medium">{equipment.id}</span>
                    </div>
                    <span className="text-xs text-slate-400 capitalize">{equipment.type}</span>
                  </div>
                  {equipment.telemetry && (
                    <div className="mt-2 text-xs text-slate-400">
                      {equipment.telemetry.speed !== undefined && (
                        <div>Speed: {equipment.telemetry.speed} km/h</div>
                      )}
                      {equipment.telemetry.payload !== undefined && (
                        <div>Payload: {equipment.telemetry.payload} tons</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Grade Statistics */}
          {gradeData && (
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Grade Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Grade:</span>
                  <span className="text-white font-medium">
                    {gradeData.statistics.averageGrade.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Grade:</span>
                  <span className="text-white font-medium">
                    {gradeData.statistics.minGrade.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Grade:</span>
                  <span className="text-white font-medium">
                    {gradeData.statistics.maxGrade.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-slate-700/50 rounded-lg p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">Controls:</p>
            <ul className="space-y-1">
              <li>• Left click + drag to rotate</li>
              <li>• Right click + drag to pan</li>
              <li>• Scroll to zoom</li>
              <li>• Press H for keyboard shortcuts</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
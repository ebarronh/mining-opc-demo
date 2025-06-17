'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  Activity,
  Truck,
  TrendingUp,
  Database,
  ArrowRight,
  ArrowDown,
  UserCheck,
  ClipboardList,
  Zap,
  Target
} from 'lucide-react';

interface ShiftInfo {
  id: string;
  name: string;
  supervisor: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'ending' | 'starting' | 'completed';
  equipmentCount: number;
  productionTarget: number;
  actualProduction: number;
  incidents: number;
}

interface HandoffData {
  id: string;
  timestamp: Date;
  fromShift: string;
  toShift: string;
  category: 'production' | 'equipment' | 'safety' | 'maintenance' | 'operations';
  dataType: string;
  status: 'pending' | 'transferring' | 'completed' | 'failed' | 'requires_attention';
  size: number; // in KB
  checksum: string;
  fmsSource: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  details: {
    description: string;
    equipmentIds?: string[];
    productionData?: {
      tonnage: number;
      gradeAchieved: number;
      cycleTime: number;
    };
    safetyData?: {
      incidentCount: number;
      nearMisses: number;
      complianceScore: number;
    };
    maintenanceData?: {
      scheduledTasks: number;
      completedTasks: number;
      criticalAlerts: number;
    };
  };
}

interface HandoffProgress {
  total: number;
  completed: number;
  inProgress: number;
  failed: number;
  estimatedCompletion: Date;
}

const mockShifts: ShiftInfo[] = [
  {
    id: 'day-shift',
    name: 'Day Shift',
    supervisor: 'Sarah Johnson',
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 30 * 60 * 1000),
    status: 'ending',
    equipmentCount: 24,
    productionTarget: 2800,
    actualProduction: 2645,
    incidents: 0
  },
  {
    id: 'night-shift',
    name: 'Night Shift',
    supervisor: 'Mike Rodriguez',
    startTime: new Date(Date.now() + 30 * 60 * 1000),
    endTime: new Date(Date.now() + 8.5 * 60 * 60 * 1000),
    status: 'starting',
    equipmentCount: 18,
    productionTarget: 2200,
    actualProduction: 0,
    incidents: 0
  }
];

const mockHandoffData: HandoffData[] = [
  {
    id: 'handoff-001',
    timestamp: new Date(Date.now() - 120000),
    fromShift: 'Day Shift',
    toShift: 'Night Shift',
    category: 'production',
    dataType: 'Production Summary Report',
    status: 'completed',
    size: 1250,
    checksum: 'a1b2c3d4e5f6',
    fmsSource: 'Komatsu FMS',
    priority: 'high',
    details: {
      description: 'Complete production data for day shift including tonnage, grade achievements, and cycle times',
      equipmentIds: ['TRK-001', 'TRK-002', 'EXC-001', 'EXC-002'],
      productionData: {
        tonnage: 2645,
        gradeAchieved: 62.8,
        cycleTime: 18.5
      }
    }
  },
  {
    id: 'handoff-002',
    timestamp: new Date(Date.now() - 90000),
    fromShift: 'Day Shift',
    toShift: 'Night Shift',
    category: 'equipment',
    dataType: 'Equipment Status & Maintenance Log',
    status: 'transferring',
    size: 850,
    checksum: 'f6e5d4c3b2a1',
    fmsSource: 'Caterpillar MineStar',
    priority: 'critical',
    details: {
      description: 'Current equipment status, maintenance schedules, and critical alerts',
      equipmentIds: ['TRK-003', 'TRK-004', 'CON-001'],
      maintenanceData: {
        scheduledTasks: 12,
        completedTasks: 8,
        criticalAlerts: 2
      }
    }
  },
  {
    id: 'handoff-003',
    timestamp: new Date(Date.now() - 60000),
    fromShift: 'Day Shift',
    toShift: 'Night Shift',
    category: 'safety',
    dataType: 'Safety Incident Report',
    status: 'completed',
    size: 320,
    checksum: 'x9y8z7w6v5u4',
    fmsSource: 'Wenco FMS',
    priority: 'medium',
    details: {
      description: 'Safety incidents, near misses, and compliance scores for day shift',
      safetyData: {
        incidentCount: 0,
        nearMisses: 3,
        complianceScore: 98.5
      }
    }
  },
  {
    id: 'handoff-004',
    timestamp: new Date(Date.now() - 30000),
    fromShift: 'Day Shift',
    toShift: 'Night Shift',
    category: 'operations',
    dataType: 'Route Optimization Data',
    status: 'requires_attention',
    size: 675,
    checksum: 'q1w2e3r4t5y6',
    fmsSource: 'Modular Mining',
    priority: 'medium',
    details: {
      description: 'Optimized routes and traffic patterns requiring supervisor review',
      equipmentIds: ['TRK-005', 'TRK-006', 'TRK-007']
    }
  },
  {
    id: 'handoff-005',
    timestamp: new Date(),
    fromShift: 'Day Shift',
    toShift: 'Night Shift',
    category: 'maintenance',
    dataType: 'Preventive Maintenance Schedule',
    status: 'pending',
    size: 425,
    checksum: 'p9o8i7u6y5t4',
    fmsSource: 'Hexagon Mining',
    priority: 'low',
    details: {
      description: 'Scheduled maintenance tasks for night shift',
      maintenanceData: {
        scheduledTasks: 6,
        completedTasks: 0,
        criticalAlerts: 0
      }
    }
  }
];

export default function ShiftChangeHandoff() {
  const [handoffData, setHandoffData] = useState<HandoffData[]>(mockHandoffData);
  const [shifts, setShifts] = useState<ShiftInfo[]>(mockShifts);
  const [selectedHandoff, setSelectedHandoff] = useState<string | null>(null);
  const [handoffProgress, setHandoffProgress] = useState<HandoffProgress>({
    total: mockHandoffData.length,
    completed: mockHandoffData.filter(h => h.status === 'completed').length,
    inProgress: mockHandoffData.filter(h => h.status === 'transferring').length,
    failed: mockHandoffData.filter(h => h.status === 'failed').length,
    estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000)
  });

  const updateHandoffProgress = useCallback(() => {
    setHandoffData(prev => prev.map(handoff => {
      if (handoff.status === 'transferring') {
        const rand = Math.random();
        if (rand < 0.3) {
          return { ...handoff, status: 'completed' };
        }
      } else if (handoff.status === 'pending') {
        const rand = Math.random();
        if (rand < 0.2) {
          return { ...handoff, status: 'transferring' };
        }
      }
      return handoff;
    }));

    setHandoffProgress(prev => ({
      ...prev,
      completed: handoffData.filter(h => h.status === 'completed').length,
      inProgress: handoffData.filter(h => h.status === 'transferring').length,
      failed: handoffData.filter(h => h.status === 'failed').length,
      estimatedCompletion: new Date(Date.now() + Math.random() * 10 * 60 * 1000)
    }));
  }, [handoffData]);

  useEffect(() => {
    const interval = setInterval(updateHandoffProgress, 3000);
    return () => clearInterval(interval);
  }, [updateHandoffProgress]);

  const getStatusIcon = (status: HandoffData['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'transferring':
        return <FileText className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'pending':
        return <Timer className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'requires_attention':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: HandoffData['status']): string => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'transferring': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'requires_attention': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: HandoffData['priority']): string => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: HandoffData['category']) => {
    switch (category) {
      case 'production':
        return <TrendingUp className="w-4 h-4" />;
      case 'equipment':
        return <Truck className="w-4 h-4" />;
      case 'safety':
        return <UserCheck className="w-4 h-4" />;
      case 'maintenance':
        return <ClipboardList className="w-4 h-4" />;
      case 'operations':
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    }
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const formatTimeRemaining = (endTime: Date): string => {
    const minutes = Math.floor((endTime.getTime() - Date.now()) / (1000 * 60));
    if (minutes <= 0) return 'Ending now';
    if (minutes < 60) return `${minutes}m remaining`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Shift Change Data Handoff
          </h2>
          <p className="text-gray-400 mt-1">
            Real-time monitoring of data transfer between mining shifts
          </p>
        </div>
      </div>

      {/* Shift Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shifts.map((shift) => (
          <div key={shift.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="text-lg font-medium text-white">{shift.name}</h3>
                  <p className="text-sm text-gray-400">Supervisor: {shift.supervisor}</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                shift.status === 'active' ? 'bg-green-900/50 text-green-400' :
                shift.status === 'ending' ? 'bg-orange-900/50 text-orange-400' :
                shift.status === 'starting' ? 'bg-blue-900/50 text-blue-400' :
                'bg-gray-900/50 text-gray-400'
              }`}>
                {shift.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Time Remaining:</span>
                <span className="text-white">{formatTimeRemaining(shift.endTime)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Equipment Count:</span>
                <span className="text-white">{shift.equipmentCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Production Target:</span>
                <span className="text-white">{shift.productionTarget.toLocaleString()} tons</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Actual Production:</span>
                <span className={`${shift.actualProduction >= shift.productionTarget ? 'text-green-400' : 'text-white'}`}>
                  {shift.actualProduction.toLocaleString()} tons
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Safety Incidents:</span>
                <span className={shift.incidents === 0 ? 'text-green-400' : 'text-red-400'}>
                  {shift.incidents}
                </span>
              </div>
            </div>
            
            {/* Production Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Production Progress</span>
                <span>{Math.round((shift.actualProduction / shift.productionTarget) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    shift.actualProduction >= shift.productionTarget ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(100, (shift.actualProduction / shift.productionTarget) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Handoff Progress Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Handoff Progress Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">{handoffProgress.total}</div>
            <div className="text-sm text-gray-400">Total Items</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-400">{handoffProgress.completed}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-400">{handoffProgress.inProgress}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-400">{handoffProgress.failed}</div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Estimated Completion:</span>
          <span className="text-white">{handoffProgress.estimatedCompletion.toLocaleTimeString()}</span>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${(handoffProgress.completed / handoffProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Handoff Data Items */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Transfer Items
        </h3>
        
        <div className="space-y-4">
          {handoffData.map((handoff) => (
            <div
              key={handoff.id}
              className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedHandoff === handoff.id
                  ? 'border-orange-500 ring-1 ring-orange-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedHandoff(
                selectedHandoff === handoff.id ? null : handoff.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(handoff.category)}
                    <div>
                      <h4 className="font-medium text-white">{handoff.dataType}</h4>
                      <p className="text-sm text-gray-400">
                        {handoff.fromShift} → {handoff.toShift}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(handoff.priority)}`}>
                    {handoff.priority.toUpperCase()}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{formatFileSize(handoff.size)}</div>
                    <div className="text-xs text-gray-500">{handoff.fmsSource}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(handoff.status)}
                    <span className={`text-sm capitalize ${getStatusColor(handoff.status)}`}>
                      {handoff.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedHandoff === handoff.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-orange-400 mb-3">Transfer Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Timestamp:</span>
                          <span className="text-white">{handoff.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Checksum:</span>
                          <span className="text-white font-mono">{handoff.checksum}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source System:</span>
                          <span className="text-white">{handoff.fmsSource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white capitalize">{handoff.category}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="text-sm font-medium text-gray-300 mb-2">Description</h6>
                        <p className="text-sm text-gray-400">{handoff.details.description}</p>
                      </div>
                      
                      {handoff.details.equipmentIds && (
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-gray-300 mb-2">
                            Affected Equipment ({handoff.details.equipmentIds.length})
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {handoff.details.equipmentIds.map((id, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300"
                              >
                                {id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-orange-400 mb-3">Data Summary</h5>
                      
                      {handoff.details.productionData && (
                        <div className="space-y-2 text-sm mb-4">
                          <h6 className="text-sm font-medium text-gray-300">Production Data</h6>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tonnage:</span>
                            <span className="text-white">{handoff.details.productionData.tonnage.toLocaleString()} tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Grade Achieved:</span>
                            <span className="text-white">{handoff.details.productionData.gradeAchieved}% Fe</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Cycle Time:</span>
                            <span className="text-white">{handoff.details.productionData.cycleTime} min</span>
                          </div>
                        </div>
                      )}
                      
                      {handoff.details.safetyData && (
                        <div className="space-y-2 text-sm mb-4">
                          <h6 className="text-sm font-medium text-gray-300">Safety Data</h6>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Incidents:</span>
                            <span className={handoff.details.safetyData.incidentCount === 0 ? 'text-green-400' : 'text-red-400'}>
                              {handoff.details.safetyData.incidentCount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Near Misses:</span>
                            <span className="text-white">{handoff.details.safetyData.nearMisses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Compliance Score:</span>
                            <span className="text-green-400">{handoff.details.safetyData.complianceScore}%</span>
                          </div>
                        </div>
                      )}
                      
                      {handoff.details.maintenanceData && (
                        <div className="space-y-2 text-sm">
                          <h6 className="text-sm font-medium text-gray-300">Maintenance Data</h6>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Scheduled Tasks:</span>
                            <span className="text-white">{handoff.details.maintenanceData.scheduledTasks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Completed Tasks:</span>
                            <span className="text-white">{handoff.details.maintenanceData.completedTasks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Critical Alerts:</span>
                            <span className={handoff.details.maintenanceData.criticalAlerts === 0 ? 'text-green-400' : 'text-red-400'}>
                              {handoff.details.maintenanceData.criticalAlerts}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShiftChangeHandoff;
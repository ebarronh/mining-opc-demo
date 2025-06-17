'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  Construction, 
  Zap,
  Wifi,
  WifiOff,
  ArrowRight,
  Database
} from 'lucide-react';

interface EquipmentStatus {
  equipmentId: string;
  name: string;
  type: 'truck' | 'excavator' | 'conveyor' | 'crusher';
  status: 'operational' | 'maintenance' | 'idle' | 'error';
  location: { x: number; y: number; zone: string };
  fuelLevel?: number;
  engineHours: number;
  lastUpdate: Date;
  fmsSource: string;
  syncStatus: 'synced' | 'syncing' | 'conflict' | 'offline';
  conflictSources?: string[];
}

interface FMSConnection {
  id: string;
  name: string;
  vendor: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  equipmentCount: number;
  latency: number;
}

const mockEquipment: EquipmentStatus[] = [
  {
    equipmentId: 'TRK-001',
    name: 'Haul Truck 001',
    type: 'truck',
    status: 'operational',
    location: { x: 1250, y: 850, zone: 'North Pit' },
    fuelLevel: 85,
    engineHours: 12450,
    lastUpdate: new Date(Date.now() - 5000),
    fmsSource: 'Komatsu FMS',
    syncStatus: 'synced'
  },
  {
    equipmentId: 'EXC-002',
    name: 'Excavator 002',
    type: 'excavator',
    status: 'maintenance',
    location: { x: 980, y: 1200, zone: 'Maintenance Bay' },
    engineHours: 8750,
    lastUpdate: new Date(Date.now() - 15000),
    fmsSource: 'Caterpillar MineStar',
    syncStatus: 'conflict',
    conflictSources: ['Komatsu FMS', 'Caterpillar MineStar']
  },
  {
    equipmentId: 'TRK-003',
    name: 'Haul Truck 003',
    type: 'truck',
    status: 'idle',
    location: { x: 750, y: 650, zone: 'Loading Point A' },
    fuelLevel: 62,
    engineHours: 15600,
    lastUpdate: new Date(Date.now() - 2000),
    fmsSource: 'Wenco FMS',
    syncStatus: 'syncing'
  },
  {
    equipmentId: 'CON-001',
    name: 'Conveyor Belt 1',
    type: 'conveyor',
    status: 'operational',
    location: { x: 1500, y: 400, zone: 'Processing Plant' },
    engineHours: 45200,
    lastUpdate: new Date(Date.now() - 1000),
    fmsSource: 'Modular Mining',
    syncStatus: 'synced'
  }
];

const mockFMSConnections: FMSConnection[] = [
  {
    id: 'komatsu-fms',
    name: 'Komatsu FMS',
    vendor: 'Komatsu',
    status: 'connected',
    lastSync: new Date(Date.now() - 3000),
    equipmentCount: 25,
    latency: 45
  },
  {
    id: 'caterpillar-minestar',
    name: 'Caterpillar MineStar',
    vendor: 'Caterpillar',
    status: 'syncing',
    lastSync: new Date(Date.now() - 8000),
    equipmentCount: 18,
    latency: 72
  },
  {
    id: 'wenco-fms',
    name: 'Wenco FMS',
    vendor: 'Wenco',
    status: 'connected',
    lastSync: new Date(Date.now() - 1500),
    equipmentCount: 12,
    latency: 38
  },
  {
    id: 'modular-mining',
    name: 'Modular Mining',
    vendor: 'Modular Mining',
    status: 'disconnected',
    lastSync: new Date(Date.now() - 120000),
    equipmentCount: 8,
    latency: 0
  }
];

export default function EquipmentStatusSync() {
  const [equipment, setEquipment] = useState<EquipmentStatus[]>(mockEquipment);
  const [fmsConnections, setFmsConnections] = useState<FMSConnection[]>(mockFMSConnections);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const updateEquipmentStatus = useCallback(() => {
    setEquipment(prev => prev.map(eq => {
      // Simulate status changes
      const rand = Math.random();
      let newStatus = eq.status;
      let newSyncStatus = eq.syncStatus;
      
      if (rand < 0.05) {
        const statuses: EquipmentStatus['status'][] = ['operational', 'maintenance', 'idle', 'error'];
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      if (rand < 0.1) {
        const syncStatuses: EquipmentStatus['syncStatus'][] = ['synced', 'syncing', 'conflict'];
        newSyncStatus = syncStatuses[Math.floor(Math.random() * syncStatuses.length)];
      }
      
      return {
        ...eq,
        status: newStatus,
        syncStatus: newSyncStatus,
        lastUpdate: new Date(),
        fuelLevel: eq.fuelLevel ? Math.max(0, eq.fuelLevel - Math.random() * 2) : undefined
      };
    }));
    
    setLastUpdateTime(new Date());
  }, []);

  const updateFMSConnections = useCallback(() => {
    setFmsConnections(prev => prev.map(fms => {
      const rand = Math.random();
      let newStatus = fms.status;
      let newLatency = fms.latency;
      
      if (rand < 0.1) {
        const statuses: FMSConnection['status'][] = ['connected', 'syncing'];
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      if (newStatus === 'connected') {
        newLatency = Math.floor(Math.random() * 100 + 30);
      }
      
      return {
        ...fms,
        status: newStatus,
        latency: newLatency,
        lastSync: newStatus !== 'disconnected' ? new Date() : fms.lastSync
      };
    }));
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      updateEquipmentStatus();
      updateFMSConnections();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, updateEquipmentStatus, updateFMSConnections]);

  const getStatusIcon = (status: EquipmentStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <Construction className="w-4 h-4 text-yellow-500" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSyncStatusIcon = (syncStatus: EquipmentStatus['syncStatus']) => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'conflict':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEquipmentIcon = (type: EquipmentStatus['type']) => {
    switch (type) {
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'excavator':
        return <Construction className="w-5 h-5" />;
      case 'conveyor':
        return <ArrowRight className="w-5 h-5" />;
      case 'crusher':
        return <Zap className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getFMSStatusIcon = (status: FMSConnection['status']) => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Equipment Status Synchronization</h2>
          <p className="text-gray-400 mt-1">
            Real-time equipment status across multiple Fleet Management Systems
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Last update: {formatTimeAgo(lastUpdateTime)}
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-300">Auto-refresh</span>
          </label>
          
          <button
            onClick={() => {
              updateEquipmentStatus();
              updateFMSConnections();
            }}
            className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* FMS Connection Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          FMS Connection Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fmsConnections.map((fms) => (
            <div key={fms.id} className="bg-gray-900 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getFMSStatusIcon(fms.status)}
                  <span className="text-sm font-medium text-white">{fms.name}</span>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`capitalize ${
                    fms.status === 'connected' ? 'text-green-400' :
                    fms.status === 'syncing' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {fms.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Equipment:</span>
                  <span className="text-white">{fms.equipmentCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className={fms.latency > 100 ? 'text-yellow-400' : 'text-green-400'}>
                    {fms.latency}ms
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span>{formatTimeAgo(fms.lastSync)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Status Grid */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Equipment Status Overview</h3>
        
        <div className="grid gap-4">
          {equipment.map((eq) => (
            <div
              key={eq.equipmentId}
              className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedEquipment === eq.equipmentId
                  ? 'border-orange-500 ring-1 ring-orange-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedEquipment(
                selectedEquipment === eq.equipmentId ? null : eq.equipmentId
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getEquipmentIcon(eq.type)}
                    <div>
                      <h4 className="font-medium text-white">{eq.name}</h4>
                      <p className="text-sm text-gray-400">{eq.equipmentId} • {eq.location.zone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* Equipment Status */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(eq.status)}
                    <span className="text-sm text-gray-300 capitalize">{eq.status}</span>
                  </div>
                  
                  {/* Sync Status */}
                  <div className="flex items-center space-x-2">
                    {getSyncStatusIcon(eq.syncStatus)}
                    <span className="text-sm text-gray-300 capitalize">{eq.syncStatus}</span>
                  </div>
                  
                  {/* FMS Source */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{eq.fmsSource}</div>
                    <div className="text-xs text-gray-400">{formatTimeAgo(eq.lastUpdate)}</div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedEquipment === eq.equipmentId && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-orange-400">Equipment Details</h5>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Engine Hours:</span>
                          <span className="text-white">{eq.engineHours.toLocaleString()}</span>
                        </div>
                        {eq.fuelLevel !== undefined && (
                          <div className="flex justify-between">
                            <span>Fuel Level:</span>
                            <span className={`${eq.fuelLevel < 20 ? 'text-red-400' : 'text-white'}`}>
                              {eq.fuelLevel.toFixed(1)}%
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="text-white">{eq.location.x}, {eq.location.y}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-orange-400">Synchronization</h5>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Source FMS:</span>
                          <span className="text-white">{eq.fmsSource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sync Status:</span>
                          <span className={`capitalize ${
                            eq.syncStatus === 'synced' ? 'text-green-400' :
                            eq.syncStatus === 'syncing' ? 'text-yellow-400' :
                            eq.syncStatus === 'conflict' ? 'text-red-400' :
                            'text-gray-400'
                          }`}>
                            {eq.syncStatus}
                          </span>
                        </div>
                        {eq.conflictSources && (
                          <div>
                            <span>Conflict Sources:</span>
                            <div className="mt-1">
                              {eq.conflictSources.map((source, index) => (
                                <div key={index} className="text-red-400 text-xs">
                                  • {source}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-orange-400">Status History</h5>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Operational (2h ago)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Maintenance (4h ago)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Idle (6h ago)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sync Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Equipment</p>
              <p className="text-2xl font-semibold text-white">{equipment.length}</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Synced</p>
              <p className="text-2xl font-semibold text-green-400">
                {equipment.filter(eq => eq.syncStatus === 'synced').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conflicts</p>
              <p className="text-2xl font-semibold text-red-400">
                {equipment.filter(eq => eq.syncStatus === 'conflict').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Latency</p>
              <p className="text-2xl font-semibold text-white">
                {Math.round(fmsConnections.reduce((acc, fms) => acc + fms.latency, 0) / fmsConnections.length)}ms
              </p>
            </div>
            <Wifi className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
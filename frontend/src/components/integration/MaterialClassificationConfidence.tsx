'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Settings,
  Layers,
  Target,
  Zap,
  Brain,
  Activity,
  PieChart
} from 'lucide-react';

interface MaterialClassification {
  id: string;
  timestamp: Date;
  location: { x: number; y: number; zone: string };
  truckId: string;
  classifications: {
    fmsSource: string;
    materialType: string;
    confidence: number;
    grade: number;
    properties: {
      ironContent: number;
      silicaContent: number;
      moistureContent: number;
      grainSize: string;
    };
    modelVersion: string;
    processingTime: number;
  }[];
  consensus: {
    agreed: boolean;
    finalClassification: string;
    averageConfidence: number;
    conflictLevel: 'none' | 'low' | 'medium' | 'high';
  };
}

interface ConfidenceThresholds {
  high: number;
  medium: number;
  low: number;
}

const materialTypes = [
  'High-Grade Iron Ore',
  'Medium-Grade Iron Ore', 
  'Low-Grade Iron Ore',
  'Waste Rock',
  'Gangue Material',
  'Overburden'
];

const fmsSystems = [
  'Komatsu KOMTRAX',
  'Caterpillar MineStar',
  'Wenco FMS',
  'Modular Mining DISPATCH'
];

const mockClassifications: MaterialClassification[] = [
  {
    id: 'class-001',
    timestamp: new Date(Date.now() - 30000),
    location: { x: 1200, y: 800, zone: 'North Pit - Bench 1' },
    truckId: 'TRK-001',
    classifications: [
      {
        fmsSource: 'Komatsu KOMTRAX',
        materialType: 'High-Grade Iron Ore',
        confidence: 0.92,
        grade: 64.5,
        properties: {
          ironContent: 64.5,
          silicaContent: 4.2,
          moistureContent: 2.1,
          grainSize: 'Medium'
        },
        modelVersion: 'v2.3.1',
        processingTime: 45
      },
      {
        fmsSource: 'Caterpillar MineStar',
        materialType: 'High-Grade Iron Ore',
        confidence: 0.89,
        grade: 63.8,
        properties: {
          ironContent: 63.8,
          silicaContent: 4.5,
          moistureContent: 2.3,
          grainSize: 'Medium'
        },
        modelVersion: 'v1.8.2',
        processingTime: 52
      },
      {
        fmsSource: 'Wenco FMS',
        materialType: 'Medium-Grade Iron Ore',
        confidence: 0.76,
        grade: 62.1,
        properties: {
          ironContent: 62.1,
          silicaContent: 5.1,
          moistureContent: 2.4,
          grainSize: 'Medium'
        },
        modelVersion: 'v3.1.0',
        processingTime: 38
      }
    ],
    consensus: {
      agreed: false,
      finalClassification: 'High-Grade Iron Ore',
      averageConfidence: 0.86,
      conflictLevel: 'low'
    }
  },
  {
    id: 'class-002',
    timestamp: new Date(Date.now() - 60000),
    location: { x: 950, y: 1100, zone: 'South Pit - Bench 2' },
    truckId: 'TRK-003',
    classifications: [
      {
        fmsSource: 'Komatsu KOMTRAX',
        materialType: 'Waste Rock',
        confidence: 0.95,
        grade: 18.2,
        properties: {
          ironContent: 18.2,
          silicaContent: 45.8,
          moistureContent: 3.2,
          grainSize: 'Coarse'
        },
        modelVersion: 'v2.3.1',
        processingTime: 41
      },
      {
        fmsSource: 'Caterpillar MineStar',
        materialType: 'Waste Rock',
        confidence: 0.93,
        grade: 17.9,
        properties: {
          ironContent: 17.9,
          silicaContent: 46.2,
          moistureContent: 3.1,
          grainSize: 'Coarse'
        },
        modelVersion: 'v1.8.2',
        processingTime: 48
      }
    ],
    consensus: {
      agreed: true,
      finalClassification: 'Waste Rock',
      averageConfidence: 0.94,
      conflictLevel: 'none'
    }
  },
  {
    id: 'class-003',
    timestamp: new Date(Date.now() - 90000),
    location: { x: 1450, y: 650, zone: 'East Pit - Bench 3' },
    truckId: 'TRK-005',
    classifications: [
      {
        fmsSource: 'Komatsu KOMTRAX',
        materialType: 'Medium-Grade Iron Ore',
        confidence: 0.67,
        grade: 52.3,
        properties: {
          ironContent: 52.3,
          silicaContent: 8.9,
          moistureContent: 4.1,
          grainSize: 'Fine'
        },
        modelVersion: 'v2.3.1',
        processingTime: 55
      },
      {
        fmsSource: 'Wenco FMS',
        materialType: 'Low-Grade Iron Ore',
        confidence: 0.71,
        grade: 51.8,
        properties: {
          ironContent: 51.8,
          silicaContent: 9.2,
          moistureContent: 4.3,
          grainSize: 'Fine'
        },
        modelVersion: 'v3.1.0',
        processingTime: 42
      },
      {
        fmsSource: 'Modular Mining DISPATCH',
        materialType: 'Gangue Material',
        confidence: 0.58,
        grade: 48.9,
        properties: {
          ironContent: 48.9,
          silicaContent: 12.1,
          moistureContent: 4.5,
          grainSize: 'Fine'
        },
        modelVersion: 'v4.2.3',
        processingTime: 61
      }
    ],
    consensus: {
      agreed: false,
      finalClassification: 'Low-Grade Iron Ore',
      averageConfidence: 0.65,
      conflictLevel: 'high'
    }
  }
];

const defaultThresholds: ConfidenceThresholds = {
  high: 0.85,
  medium: 0.70,
  low: 0.50
};

export default function MaterialClassificationConfidence() {
  const [classifications, setClassifications] = useState<MaterialClassification[]>(mockClassifications);
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [confidenceThresholds, setConfidenceThresholds] = useState<ConfidenceThresholds>(defaultThresholds);
  const [showSettings, setShowSettings] = useState(false);
  const [filterByFMS, setFilterByFMS] = useState<string>('all');
  const [filterByConfidence, setFilterByConfidence] = useState<string>('all');

  const updateClassifications = useCallback(() => {
    setClassifications(prev => prev.map(classification => ({
      ...classification,
      classifications: classification.classifications.map(c => ({
        ...c,
        confidence: Math.max(0.3, Math.min(0.99, c.confidence + (Math.random() - 0.5) * 0.1))
      }))
    })));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateClassifications, 5000);
    return () => clearInterval(interval);
  }, [updateClassifications]);

  const getConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
    if (confidence >= confidenceThresholds.high) return 'high';
    if (confidence >= confidenceThresholds.medium) return 'medium';
    return 'low';
  };

  const getConfidenceColor = (confidence: number): string => {
    const level = getConfidenceLevel(confidence);
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConflictLevelColor = (level: string): string => {
    switch (level) {
      case 'none': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConflictIcon = (level: string) => {
    switch (level) {
      case 'none':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredClassifications = classifications.filter(classification => {
    if (filterByFMS !== 'all') {
      const hasFMS = classification.classifications.some(c => c.fmsSource === filterByFMS);
      if (!hasFMS) return false;
    }
    
    if (filterByConfidence !== 'all') {
      const level = getConfidenceLevel(classification.consensus.averageConfidence);
      if (level !== filterByConfidence) return false;
    }
    
    return true;
  });

  const confidenceStats = {
    total: classifications.length,
    high: classifications.filter(c => getConfidenceLevel(c.consensus.averageConfidence) === 'high').length,
    medium: classifications.filter(c => getConfidenceLevel(c.consensus.averageConfidence) === 'medium').length,
    low: classifications.filter(c => getConfidenceLevel(c.consensus.averageConfidence) === 'low').length,
    conflicts: classifications.filter(c => c.consensus.conflictLevel !== 'none').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Material Classification Confidence
          </h2>
          <p className="text-gray-400 mt-1">
            Real-time material classification confidence scores across FMS systems
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Classification Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-orange-400 mb-3">Confidence Thresholds</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    High Confidence (≥ {(confidenceThresholds.high * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="0.95"
                    step="0.05"
                    value={confidenceThresholds.high}
                    onChange={(e) => setConfidenceThresholds(prev => ({ 
                      ...prev, 
                      high: parseFloat(e.target.value) 
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Medium Confidence (≥ {(confidenceThresholds.medium * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.8"
                    step="0.05"
                    value={confidenceThresholds.medium}
                    onChange={(e) => setConfidenceThresholds(prev => ({ 
                      ...prev, 
                      medium: parseFloat(e.target.value) 
                    }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Low Confidence (&lt; {(confidenceThresholds.medium * 100).toFixed(0)}%)
                  </label>
                  <div className="text-xs text-gray-400">
                    Automatically calculated based on medium threshold
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-orange-400 mb-3">Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Filter by FMS
                  </label>
                  <select
                    value={filterByFMS}
                    onChange={(e) => setFilterByFMS(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">All FMS Systems</option>
                    {fmsSystems.map(fms => (
                      <option key={fms} value={fms}>{fms}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Filter by Confidence
                  </label>
                  <select
                    value={filterByConfidence}
                    onChange={(e) => setFilterByConfidence(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">All Confidence Levels</option>
                    <option value="high">High Confidence</option>
                    <option value="medium">Medium Confidence</option>
                    <option value="low">Low Confidence</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Classifications</p>
              <p className="text-2xl font-semibold text-white">{confidenceStats.total}</p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">High Confidence</p>
              <p className="text-2xl font-semibold text-green-400">{confidenceStats.high}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Medium Confidence</p>
              <p className="text-2xl font-semibold text-yellow-400">{confidenceStats.medium}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Low Confidence</p>
              <p className="text-2xl font-semibold text-red-400">{confidenceStats.low}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conflicts</p>
              <p className="text-2xl font-semibold text-orange-400">{confidenceStats.conflicts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Classification Results */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Classification Results
        </h3>
        
        <div className="space-y-4">
          {filteredClassifications.map((classification) => (
            <div
              key={classification.id}
              className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedClassification === classification.id
                  ? 'border-orange-500 ring-1 ring-orange-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedClassification(
                selectedClassification === classification.id ? null : classification.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium text-white">{classification.truckId}</h4>
                    <p className="text-sm text-gray-400">{classification.location.zone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {classification.consensus.finalClassification}
                    </div>
                    <div className={`text-sm ${getConfidenceColor(classification.consensus.averageConfidence)}`}>
                      {(classification.consensus.averageConfidence * 100).toFixed(1)}% confidence
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getConflictIcon(classification.consensus.conflictLevel)}
                    <span className={`text-sm capitalize ${getConflictLevelColor(classification.consensus.conflictLevel)}`}>
                      {classification.consensus.conflictLevel} conflict
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedClassification === classification.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Individual FMS Classifications */}
                    <div>
                      <h5 className="text-sm font-medium text-orange-400 mb-3">
                        FMS Classifications ({classification.classifications.length})
                      </h5>
                      
                      <div className="space-y-3">
                        {classification.classifications.map((c, index) => (
                          <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">{c.fmsSource}</span>
                              <span className={`text-sm ${getConfidenceColor(c.confidence)}`}>
                                {(c.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                              <div>
                                <span className="text-gray-300">Material:</span>
                                <div className="text-white">{c.materialType}</div>
                              </div>
                              <div>
                                <span className="text-gray-300">Grade:</span>
                                <div className="text-white">{c.grade.toFixed(1)}% Fe</div>
                              </div>
                              <div>
                                <span className="text-gray-300">Model:</span>
                                <div className="text-white">{c.modelVersion}</div>
                              </div>
                              <div>
                                <span className="text-gray-300">Processing:</span>
                                <div className="text-white">{c.processingTime}ms</div>
                              </div>
                            </div>
                            
                            {/* Confidence Bar */}
                            <div className="mt-2">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    getConfidenceLevel(c.confidence) === 'high' ? 'bg-green-500' :
                                    getConfidenceLevel(c.confidence) === 'medium' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${c.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Material Properties */}
                    <div>
                      <h5 className="text-sm font-medium text-orange-400 mb-3">
                        Material Properties Analysis
                      </h5>
                      
                      <div className="space-y-4">
                        {/* Average Properties */}
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                          <h6 className="text-sm font-medium text-white mb-2">Average Properties</h6>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Iron Content:</span>
                              <span className="text-white">
                                {(classification.classifications.reduce((sum, c) => sum + c.properties.ironContent, 0) / classification.classifications.length).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Silica Content:</span>
                              <span className="text-white">
                                {(classification.classifications.reduce((sum, c) => sum + c.properties.silicaContent, 0) / classification.classifications.length).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Moisture:</span>
                              <span className="text-white">
                                {(classification.classifications.reduce((sum, c) => sum + c.properties.moistureContent, 0) / classification.classifications.length).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Grain Size:</span>
                              <span className="text-white">
                                {classification.classifications[0]?.properties.grainSize || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Consensus Information */}
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                          <h6 className="text-sm font-medium text-white mb-2">Consensus Analysis</h6>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Agreement:</span>
                              <span className={classification.consensus.agreed ? 'text-green-400' : 'text-red-400'}>
                                {classification.consensus.agreed ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Final Classification:</span>
                              <span className="text-white">{classification.consensus.finalClassification}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Average Confidence:</span>
                              <span className={getConfidenceColor(classification.consensus.averageConfidence)}>
                                {(classification.consensus.averageConfidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Conflict Level:</span>
                              <span className={getConflictLevelColor(classification.consensus.conflictLevel)}>
                                {classification.consensus.conflictLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Time Information */}
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                          <h6 className="text-sm font-medium text-white mb-2">Timing Information</h6>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Timestamp:</span>
                              <span className="text-white">
                                {classification.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Avg Processing Time:</span>
                              <span className="text-white">
                                {Math.round(classification.classifications.reduce((sum, c) => sum + c.processingTime, 0) / classification.classifications.length)}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredClassifications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No classifications match the current filters</p>
            <p className="text-sm">Try adjusting your filter settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
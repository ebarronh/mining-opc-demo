'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Save, X, CheckCircle, AlertCircle, Settings, Database, Wifi, Shield } from 'lucide-react';

interface FMSConfigurationData {
  id: string;
  name: string;
  vendor: string;
  apiEndpoint: string;
  authMethod: 'api-key' | 'oauth' | 'certificate';
  dataFormat: 'json' | 'xml' | 'protobuf';
  syncInterval: number;
  enabled: boolean;
  credentials: {
    apiKey?: string;
    clientId?: string;
    certificatePath?: string;
  };
  features: {
    realTimeTracking: boolean;
    routeOptimization: boolean;
    fuelMonitoring: boolean;
    maintenanceAlerts: boolean;
  };
}

const defaultFMSConfig: Omit<FMSConfigurationData, 'id'> = {
  name: '',
  vendor: '',
  apiEndpoint: '',
  authMethod: 'api-key',
  dataFormat: 'json',
  syncInterval: 30,
  enabled: true,
  credentials: {},
  features: {
    realTimeTracking: true,
    routeOptimization: true,
    fuelMonitoring: false,
    maintenanceAlerts: true,
  },
};

interface FMSConfigurationUIProps {
  existingConfigurations?: FMSConfigurationData[];
  onConfigurationSave?: (config: FMSConfigurationData) => void;
  onConfigurationDelete?: (id: string) => void;
}

export default function FMSConfigurationUI({
  existingConfigurations = [],
  onConfigurationSave,
  onConfigurationDelete
}: FMSConfigurationUIProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingConfig, setEditingConfig] = useState<FMSConfigurationData | null>(null);
  const [configurations, setConfigurations] = useState<FMSConfigurationData[]>(existingConfigurations);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateConfiguration = useCallback((config: Partial<FMSConfigurationData>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!config.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!config.vendor?.trim()) {
      errors.vendor = 'Vendor is required';
    }
    
    if (!config.apiEndpoint?.trim()) {
      errors.apiEndpoint = 'API endpoint is required';
    } else if (!/^https?:\/\/.+/.test(config.apiEndpoint)) {
      errors.apiEndpoint = 'Must be a valid HTTP/HTTPS URL';
    }
    
    if (config.syncInterval && (config.syncInterval < 5 || config.syncInterval > 3600)) {
      errors.syncInterval = 'Sync interval must be between 5 and 3600 seconds';
    }
    
    return errors;
  }, []);

  const handleSaveConfiguration = useCallback((config: FMSConfigurationData) => {
    const errors = validateConfiguration(config);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const updatedConfigs = editingConfig
        ? configurations.map(c => c.id === config.id ? config : c)
        : [...configurations, config];
      
      setConfigurations(updatedConfigs);
      onConfigurationSave?.(config);
      setIsAddingNew(false);
      setEditingConfig(null);
      setValidationErrors({});
    }
  }, [configurations, editingConfig, onConfigurationSave, validateConfiguration]);

  const handleDeleteConfiguration = useCallback((id: string) => {
    const updatedConfigs = configurations.filter(c => c.id !== id);
    setConfigurations(updatedConfigs);
    onConfigurationDelete?.(id);
  }, [configurations, onConfigurationDelete]);

  const ConfigurationForm = ({ 
    config, 
    onSave, 
    onCancel,
    isEditing = false
  }: { 
    config: FMSConfigurationData; 
    onSave: (config: FMSConfigurationData) => void; 
    onCancel: () => void; 
    isEditing?: boolean;
  }) => {
    const [formData, setFormData] = useState(config);

    const handleInputChange = (field: keyof FMSConfigurationData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCredentialChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        credentials: { ...prev.credentials, [field]: value }
      }));
    };

    const handleFeatureChange = (feature: keyof FMSConfigurationData['features'], value: boolean) => {
      setFormData(prev => ({
        ...prev,
        features: { ...prev.features, [feature]: value }
      }));
    };

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
{isEditing ? 'Edit FMS Configuration' : 'Add New FMS Configuration'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Basic Configuration
            </h4>
            
            <div>
              <label htmlFor="system-name" className="block text-sm font-medium text-gray-300 mb-2">
                System Name *
              </label>
              <input
                id="system-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="e.g., Komatsu FMS North Pit"
              />
              {validationErrors.name && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-300 mb-2">
                Vendor *
              </label>
              <select
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white ${
                  validationErrors.vendor ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="">Select Vendor</option>
                <option value="Komatsu">Komatsu</option>
                <option value="Caterpillar">Caterpillar</option>
                <option value="Wenco">Wenco</option>
                <option value="Modular Mining">Modular Mining</option>
                <option value="Hexagon">Hexagon</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.vendor && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.vendor}</p>
              )}
            </div>

            <div>
              <label htmlFor="api-endpoint" className="block text-sm font-medium text-gray-300 mb-2">
                API Endpoint *
              </label>
              <input
                id="api-endpoint"
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white ${
                  validationErrors.apiEndpoint ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="https://api.fms.example.com/v1"
              />
              {validationErrors.apiEndpoint && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.apiEndpoint}</p>
              )}
            </div>

            <div>
              <label htmlFor="sync-interval" className="block text-sm font-medium text-gray-300 mb-2">
                Sync Interval (seconds)
              </label>
              <input
                id="sync-interval"
                type="number"
                min="5"
                max="3600"
                value={formData.syncInterval}
                onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white ${
                  validationErrors.syncInterval ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {validationErrors.syncInterval && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.syncInterval}</p>
              )}
            </div>
          </div>

          {/* Authentication & Data Format */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Authentication & Format
            </h4>

            <div>
              <label htmlFor="auth-method" className="block text-sm font-medium text-gray-300 mb-2">
                Authentication Method
              </label>
              <select
                id="auth-method"
                value={formData.authMethod}
                onChange={(e) => handleInputChange('authMethod', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="api-key">API Key</option>
                <option value="oauth">OAuth 2.0</option>
                <option value="certificate">Client Certificate</option>
              </select>
            </div>

            {formData.authMethod === 'api-key' && (
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={formData.credentials.apiKey || ''}
                  onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Enter API key"
                />
              </div>
            )}

            {formData.authMethod === 'oauth' && (
              <div>
                <label htmlFor="client-id" className="block text-sm font-medium text-gray-300 mb-2">
                  Client ID
                </label>
                <input
                  id="client-id"
                  type="text"
                  value={formData.credentials.clientId || ''}
                  onChange={(e) => handleCredentialChange('clientId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Enter OAuth client ID"
                />
              </div>
            )}

            {formData.authMethod === 'certificate' && (
              <div>
                <label htmlFor="certificate-path" className="block text-sm font-medium text-gray-300 mb-2">
                  Certificate Path
                </label>
                <input
                  id="certificate-path"
                  type="text"
                  value={formData.credentials.certificatePath || ''}
                  onChange={(e) => handleCredentialChange('certificatePath', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="/path/to/certificate.pem"
                />
              </div>
            )}

            <div>
              <label htmlFor="data-format" className="block text-sm font-medium text-gray-300 mb-2">
                Data Format
              </label>
              <select
                id="data-format"
                value={formData.dataFormat}
                onChange={(e) => handleInputChange('dataFormat', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="protobuf">Protocol Buffers</option>
              </select>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-300">Enabled Features</h5>
              {Object.entries(formData.features).map(([feature, enabled]) => (
                <label key={feature} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleFeatureChange(feature as keyof FMSConfigurationData['features'], e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-300">
                    {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">FMS Configuration Manager</h2>
          <p className="text-gray-400 mt-1">
            Configure and manage Fleet Management System integrations
          </p>
        </div>
        
        {!isAddingNew && !editingConfig && (
          <button
            onClick={() => {
              setIsAddingNew(true);
            }}
            className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New FMS
          </button>
        )}
      </div>

      {isAddingNew && (
        <ConfigurationForm
          config={{ ...defaultFMSConfig, id: `fms-${Date.now()}` } as FMSConfigurationData}
          onSave={handleSaveConfiguration}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingConfig(null);
            setValidationErrors({});
          }}
          isEditing={false}
        />
      )}

      {editingConfig && !isAddingNew && (
        <ConfigurationForm
          config={editingConfig}
          onSave={handleSaveConfiguration}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingConfig(null);
            setValidationErrors({});
          }}
          isEditing={true}
        />
      )}

      {/* Existing Configurations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Configured Systems</h3>
        
        {configurations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No FMS configurations yet</p>
            <p className="text-sm">Add your first Fleet Management System to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {configurations.map((config) => (
              <div key={config.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <div>
                      <h4 className="font-medium text-white">{config.name}</h4>
                      <p className="text-sm text-gray-400">{config.vendor} • {config.dataFormat.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Wifi className="w-4 h-4" />
                      <span>{config.syncInterval}s</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {config.enabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <button
                      onClick={() => setEditingConfig(config)}
                      className="px-3 py-1 text-xs text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteConfiguration(config.id)}
                      className="px-3 py-1 text-xs text-red-300 bg-red-900/50 rounded hover:bg-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(config.features)
                    .filter(([, enabled]) => enabled)
                    .map(([feature]) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-orange-900/50 text-orange-300 rounded"
                      >
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
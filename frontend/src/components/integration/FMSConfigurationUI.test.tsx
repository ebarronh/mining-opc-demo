import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FMSConfigurationUI from './FMSConfigurationUI';

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Save: () => <div data-testid="save-icon" />,
  X: () => <div data-testid="x-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Database: () => <div data-testid="database-icon" />,
  Wifi: () => <div data-testid="wifi-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
}));

describe('FMSConfigurationUI', () => {
  const mockExistingConfigs = [
    {
      id: 'test-config-1',
      name: 'Test Komatsu FMS',
      vendor: 'Komatsu',
      apiEndpoint: 'https://api.komatsu.test/v1',
      authMethod: 'api-key' as const,
      dataFormat: 'json' as const,
      syncInterval: 30,
      enabled: true,
      credentials: { apiKey: 'test-key' },
      features: {
        realTimeTracking: true,
        routeOptimization: true,
        fuelMonitoring: false,
        maintenanceAlerts: true,
      },
    },
  ];

  it('renders the configuration manager header', () => {
    render(<FMSConfigurationUI />);
    
    expect(screen.getByText('FMS Configuration Manager')).toBeInTheDocument();
    expect(screen.getByText('Configure and manage Fleet Management System integrations')).toBeInTheDocument();
  });

  it('displays "Add New FMS" button when not adding or editing', () => {
    render(<FMSConfigurationUI />);
    
    expect(screen.getByText('Add New FMS')).toBeInTheDocument();
  });

  it('shows empty state when no configurations exist', () => {
    render(<FMSConfigurationUI existingConfigurations={[]} />);
    
    expect(screen.getByText('No FMS configurations yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first Fleet Management System to get started')).toBeInTheDocument();
  });

  it('displays existing configurations', () => {
    render(<FMSConfigurationUI existingConfigurations={mockExistingConfigs} />);
    
    expect(screen.getByText('Test Komatsu FMS')).toBeInTheDocument();
    expect(screen.getByText('Komatsu • JSON')).toBeInTheDocument();
    expect(screen.getByText('30s')).toBeInTheDocument();
  });

  it('opens configuration form when "Add New FMS" is clicked', () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    expect(screen.getByText('Add New FMS Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText('System Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Vendor *')).toBeInTheDocument();
    expect(screen.getByLabelText('API Endpoint *')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    // Try to save without filling required fields
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Vendor is required')).toBeInTheDocument();
      expect(screen.getByText('API endpoint is required')).toBeInTheDocument();
    });
  });

  it('validates API endpoint format', async () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    const apiEndpointInput = screen.getByLabelText('API Endpoint *');
    fireEvent.change(apiEndpointInput, { target: { value: 'invalid-url' } });
    
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Must be a valid HTTP/HTTPS URL')).toBeInTheDocument();
    });
  });

  it('validates sync interval range', async () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    const syncIntervalInput = screen.getByLabelText('Sync Interval (seconds)');
    fireEvent.change(syncIntervalInput, { target: { value: '1' } });
    
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Sync interval must be between 5 and 3600 seconds')).toBeInTheDocument();
    });
  });

  it('saves valid configuration', async () => {
    const mockOnSave = jest.fn();
    render(<FMSConfigurationUI onConfigurationSave={mockOnSave} />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('System Name *'), { target: { value: 'Test FMS' } });
    fireEvent.change(screen.getByLabelText('Vendor *'), { target: { value: 'Komatsu' } });
    fireEvent.change(screen.getByLabelText('API Endpoint *'), { target: { value: 'https://api.test.com/v1' } });
    
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test FMS',
          vendor: 'Komatsu',
          apiEndpoint: 'https://api.test.com/v1',
        })
      );
    });
  });

  it('changes authentication method and shows appropriate fields', () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    const authSelect = screen.getByLabelText('Authentication Method');
    
    // Test OAuth method
    fireEvent.change(authSelect, { target: { value: 'oauth' } });
    expect(screen.getByLabelText('Client ID')).toBeInTheDocument();
    
    // Test certificate method
    fireEvent.change(authSelect, { target: { value: 'certificate' } });
    expect(screen.getByLabelText('Certificate Path')).toBeInTheDocument();
    
    // Test API key method
    fireEvent.change(authSelect, { target: { value: 'api-key' } });
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
  });

  it('toggles feature checkboxes', () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    const fuelMonitoringCheckbox = screen.getByRole('checkbox', { name: /Fuel Monitoring/ });
    expect(fuelMonitoringCheckbox).not.toBeChecked();
    
    fireEvent.click(fuelMonitoringCheckbox);
    expect(fuelMonitoringCheckbox).toBeChecked();
  });

  it('cancels configuration form', () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    expect(screen.getByText('Add New FMS Configuration')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New FMS Configuration')).not.toBeInTheDocument();
  });

  it('edits existing configuration', () => {
    render(<FMSConfigurationUI existingConfigurations={mockExistingConfigs} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(screen.getByText('Edit FMS Configuration')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Komatsu FMS')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Komatsu')).toBeInTheDocument();
  });

  it('deletes configuration', () => {
    const mockOnDelete = jest.fn();
    render(<FMSConfigurationUI existingConfigurations={mockExistingConfigs} onConfigurationDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockOnDelete).toHaveBeenCalledWith('test-config-1');
  });

  it('displays configuration features as tags', () => {
    render(<FMSConfigurationUI existingConfigurations={mockExistingConfigs} />);
    
    expect(screen.getByText('Real Time Tracking')).toBeInTheDocument();
    expect(screen.getByText('Route Optimization')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Alerts')).toBeInTheDocument();
    expect(screen.queryByText('Fuel Monitoring')).not.toBeInTheDocument(); // Should not be displayed as it's disabled
  });

  it('shows correct status indicator for enabled/disabled configurations', () => {
    const disabledConfig = { ...mockExistingConfigs[0], enabled: false };
    render(<FMSConfigurationUI existingConfigurations={[disabledConfig]} />);
    
    // Should show alert circle for disabled config
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
  });

  it('displays data format options', () => {
    render(<FMSConfigurationUI />);
    
    fireEvent.click(screen.getByText('Add New FMS'));
    
    const dataFormatSelect = screen.getByLabelText('Data Format');
    expect(dataFormatSelect).toBeInTheDocument();
    
    // Check that options are available
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('XML')).toBeInTheDocument();
    expect(screen.getByText('Protocol Buffers')).toBeInTheDocument();
  });
});
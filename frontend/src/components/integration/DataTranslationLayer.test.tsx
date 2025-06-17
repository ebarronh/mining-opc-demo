import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import DataTranslationLayer from './DataTranslationLayer'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

// Mock the translation layer data
jest.mock('@/data/fleetManagementSystems', () => ({
  translationLayer: {
    inputFormats: [
      'Komatsu CAN Bus messages',
      'Caterpillar VIMS data',
      'Wenco standard schemas',
      'OPC UA mining companion',
      'Custom JSON/XML formats'
    ],
    outputFormats: [
      'ISA-95 Level 2 schemas',
      'Standardized fleet events',
      'Equipment status messages',
      'Production metrics',
      'Maintenance alerts'
    ],
    protocols: [
      'OPC UA',
      'MQTT',
      'REST APIs',
      'WebSocket streams',
      'Delta Share'
    ],
    transformations: [
      'Unit conversions (metric/imperial)',
      'Coordinate system transformations',
      'Time zone normalization',
      'Equipment ID mapping',
      'Status code standardization'
    ],
    mappingRules: 847,
    processingLatency: '<50ms'
  }
}))

const mockKomatsuVendor: FleetManagementSystem = {
  id: 'komatsu-fms',
  name: 'KOMTRAX Plus',
  vendor: 'Komatsu',
  color: '#FFD700',
  description: 'Advanced fleet management system',
  features: ['Feature 1', 'Feature 2'],
  apiEndpoints: {
    vehicles: '/api/komatsu/vehicles',
    routing: '/api/komatsu/routes',
    status: '/api/komatsu/status',
    assignments: '/api/komatsu/assignments'
  },
  dataFormats: {
    input: 'JSON',
    output: 'REST API',
    protocol: 'HTTPS'
  },
  integrationComplexity: 'Medium',
  marketShare: 35,
  supportedEquipment: ['Trucks', 'Excavators'],
  deploymentRegions: ['Global'],
  costProfile: {
    implementation: '$2.5M - $5M',
    maintenance: '$500K/year',
    licensing: '$200K/year per 100 vehicles'
  }
}

const mockCaterpillarVendor: FleetManagementSystem = {
  ...mockKomatsuVendor,
  vendor: 'Caterpillar',
  name: 'Cat MineStar Fleet'
}

describe('DataTranslationLayer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders data translation layer component with header', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('OEM-Agnostic Data Translation Layer')).toBeInTheDocument()
    expect(screen.getByText(/Standardizes data from Komatsu systems/)).toBeInTheDocument()
    expect(screen.getByText('Real-time Processing')).toBeInTheDocument()
  })

  it('displays translation layer statistics', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('847')).toBeInTheDocument()
    expect(screen.getByText('Mapping Rules')).toBeInTheDocument()
    expect(screen.getByText('<50ms')).toBeInTheDocument()
    expect(screen.getByText('Processing Time')).toBeInTheDocument()
    expect(screen.getAllByText('5')).toHaveLength(3) // Appears in multiple places
    expect(screen.getByText('Supported Protocols')).toBeInTheDocument()
  })

  it('shows transformation example selector', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Data Transformation Examples')).toBeInTheDocument()
    expect(screen.getByText('Vehicle Status Translation')).toBeInTheDocument()
    expect(screen.getByText('Payload Data Harmonization')).toBeInTheDocument()
    expect(screen.getByText('Equipment Telemetry Normalization')).toBeInTheDocument()
  })

  it('allows selection of different transformation examples', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Click on payload data example
    const payloadButton = screen.getByText('Payload Data Harmonization').closest('button')
    expect(payloadButton).toBeInTheDocument()
    
    fireEvent.click(payloadButton!)
    
    // Should show payload-related content
    expect(screen.getByText('Standardize payload and material data across different vendor formats')).toBeInTheDocument()
  })

  it('displays input and output data sections', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Input Data (Komatsu Format)')).toBeInTheDocument()
    expect(screen.getByText('Output Data (ISA-95 Standard)')).toBeInTheDocument()
  })

  it('shows transformation processing button', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    const transformButton = screen.getByText('Transform')
    expect(transformButton).toBeInTheDocument()
    expect(transformButton).not.toBeDisabled()
  })

  it('handles transformation processing simulation', async () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    const transformButton = screen.getByText('Transform')
    
    // Click the transform button
    fireEvent.click(transformButton)
    
    // Should show processing state immediately
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
    
    // Fast-forward time to complete processing
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // Should return to transform state
    await waitFor(() => {
      expect(screen.getByText('Transform')).toBeInTheDocument()
    })
  })

  it('displays transformation rules for selected example', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Transformation Rules Applied')).toBeInTheDocument()
    expect(screen.getByText('Map vendor equipment ID to standardized format')).toBeInTheDocument()
    expect(screen.getByText('Convert location coordinates to standard GPS format')).toBeInTheDocument()
    expect(screen.getByText('Normalize status codes to ISA-95 equipment states')).toBeInTheDocument()
  })

  it('shows field mapping table', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Field Mapping Rules - Komatsu')).toBeInTheDocument()
    expect(screen.getByText('Source Field')).toBeInTheDocument()
    expect(screen.getByText('Target Field')).toBeInTheDocument()
    expect(screen.getByText('Transformation')).toBeInTheDocument()
    expect(screen.getByText('Data Type')).toBeInTheDocument()
    expect(screen.getByText('Example')).toBeInTheDocument()
  })

  it('displays vendor-specific mapping rules', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should show Komatsu-specific field mappings
    expect(screen.getByText('vehicleId')).toBeInTheDocument()
    expect(screen.getByText('position.lat, position.lng')).toBeInTheDocument()
    expect(screen.getByText('payload.weight')).toBeInTheDocument()
    expect(screen.getByText('fuelLevel')).toBeInTheDocument()
  })

  it('adapts field mappings for different vendors', () => {
    const { rerender } = render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should show Komatsu mappings
    expect(screen.getByText('vehicleId')).toBeInTheDocument()
    
    // Switch to Caterpillar
    rerender(<DataTranslationLayer selectedVendor={mockCaterpillarVendor} />)
    
    // Should show Caterpillar mappings
    expect(screen.getByText('Equipment.VehicleID')).toBeInTheDocument()
  })

  it('shows supported input and output formats', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Supported Input Formats')).toBeInTheDocument()
    expect(screen.getByText('Komatsu CAN Bus messages')).toBeInTheDocument()
    expect(screen.getByText('Caterpillar VIMS data')).toBeInTheDocument()
    expect(screen.getByText('Wenco standard schemas')).toBeInTheDocument()
    
    expect(screen.getByText('Standardized Output Formats')).toBeInTheDocument()
    expect(screen.getByText('ISA-95 Level 2 schemas')).toBeInTheDocument()
    expect(screen.getByText('Standardized fleet events')).toBeInTheDocument()
    expect(screen.getByText('Equipment status messages')).toBeInTheDocument()
  })

  it('displays JSON input and output data correctly', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should show JSON formatted data
    expect(screen.getByText(/"vehicleId": "KOM-830E-001"/)).toBeInTheDocument()
    expect(screen.getByText(/"equipmentId": "FLEET-001"/)).toBeInTheDocument()
  })

  it('shows processing status indicators', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should have status indicators (completed by default)
    const statusIndicators = document.querySelectorAll('.bg-green-400')
    expect(statusIndicators.length).toBeGreaterThan(0)
  })

  it('applies custom className prop', () => {
    const { container } = render(
      <DataTranslationLayer selectedVendor={mockKomatsuVendor} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('generates different input data for different vendors', () => {
    const { rerender } = render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should show Komatsu format
    expect(screen.getByText(/"vehicleId": "KOM-830E-001"/)).toBeInTheDocument()
    
    // Switch to Caterpillar
    rerender(<DataTranslationLayer selectedVendor={mockCaterpillarVendor} />)
    
    // Should show Caterpillar format
    expect(screen.getByText(/"VehicleID": "CAT-797F-042"/)).toBeInTheDocument()
  })

  it('shows transformation numbered steps', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Should show numbered transformation steps (some numbers appear multiple times)
    expect(screen.getAllByText('1')).toHaveLength(1)
    expect(screen.getAllByText('2')).toHaveLength(1)
    expect(screen.getAllByText('3')).toHaveLength(1)
    expect(screen.getAllByText('4')).toHaveLength(1)
    expect(screen.getAllByText('5')).toHaveLength(3) // Appears in multiple contexts
  })

  it('handles telemetry transformation example', () => {
    render(<DataTranslationLayer selectedVendor={mockKomatsuVendor} />)
    
    // Click on telemetry example
    const telemetryButton = screen.getByText('Equipment Telemetry Normalization').closest('button')
    fireEvent.click(telemetryButton!)
    
    expect(screen.getByText('Transform equipment telemetry data into standardized monitoring format')).toBeInTheDocument()
  })
})
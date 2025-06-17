import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import APICallDisplay from './APICallDisplay'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

const mockKomatsuVendor: FleetManagementSystem = {
  id: 'komatsu-fms',
  name: 'KOMTRAX Plus',
  vendor: 'Komatsu',
  color: '#FFD700',
  description: 'Advanced fleet management with autonomous vehicle integration.',
  features: ['Autonomous Haulage System', 'Real-time monitoring'],
  apiEndpoints: {
    vehicles: '/api/komatsu/vehicles',
    routing: '/api/komatsu/routes',
    status: '/api/komatsu/status',
    assignments: '/api/komatsu/assignments'
  },
  dataFormats: {
    input: 'JSON with Komatsu proprietary schemas',
    output: 'REST API with real-time WebSocket streams',
    protocol: 'HTTPS + WebSocket + Komatsu CAN Bus'
  },
  integrationComplexity: 'Medium',
  marketShare: 35,
  supportedEquipment: ['830E Dump Trucks', 'PC8000 Excavators'],
  deploymentRegions: ['Asia-Pacific', 'North America'],
  costProfile: {
    implementation: '$2.5M - $5M',
    maintenance: '$500K/year',
    licensing: '$200K/year per 100 vehicles'
  }
}

const mockCaterpillarVendor: FleetManagementSystem = {
  id: 'caterpillar-fms',
  name: 'Cat MineStar Fleet',
  vendor: 'Caterpillar',
  color: '#FFCD11',
  description: 'Comprehensive mining fleet management with safety systems.',
  features: ['Command for autonomous operations', 'Fleet optimization'],
  apiEndpoints: {
    vehicles: '/api/caterpillar/fleet',
    routing: '/api/caterpillar/dispatch',
    status: '/api/caterpillar/health',
    assignments: '/api/caterpillar/tasks'
  },
  dataFormats: {
    input: 'XML/JSON with Cat proprietary message formats',
    output: 'REST API with MineStar data schemas',
    protocol: 'HTTPS + Cat Link + VIMS Integration'
  },
  integrationComplexity: 'High',
  marketShare: 42,
  supportedEquipment: ['797F Dump Trucks', '6060 Excavators'],
  deploymentRegions: ['Global', 'North America'],
  costProfile: {
    implementation: '$3M - $8M',
    maintenance: '$750K/year',
    licensing: '$300K/year per 100 vehicles'
  }
}

describe('APICallDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders API call display with endpoints', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('API Endpoints')).toBeInTheDocument()
    expect(screen.getByText('Get Fleet Vehicles')).toBeInTheDocument()
    expect(screen.getByText('Route Optimization')).toBeInTheDocument()
    expect(screen.getByText('Equipment Status')).toBeInTheDocument()
    expect(screen.getByText('Task Assignments')).toBeInTheDocument()
  })

  it('displays correct HTTP methods for each endpoint', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getAllByText('GET')).toHaveLength(2) // vehicles and status endpoints
    expect(screen.getByText('POST')).toBeInTheDocument()
    expect(screen.getByText('PUT')).toBeInTheDocument()
  })

  it('shows API endpoint URLs', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('/api/komatsu/vehicles')).toBeInTheDocument()
    expect(screen.getByText('/api/komatsu/routes')).toBeInTheDocument()
    expect(screen.getByText('/api/komatsu/status')).toBeInTheDocument()
    expect(screen.getByText('/api/komatsu/assignments')).toBeInTheDocument()
  })

  it('allows selection of different API calls', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Click on Route Optimization
    const routingButton = screen.getByText('Route Optimization').closest('button')
    expect(routingButton).toBeInTheDocument()
    
    fireEvent.click(routingButton!)
    
    // Should show routing-related content
    expect(screen.getByText('Request route optimization based on current ore grades and traffic conditions')).toBeInTheDocument()
  })

  it('displays request and response sections', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('shows execute button and handles API call simulation', async () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    const executeButton = screen.getByText('Execute')
    expect(executeButton).toBeInTheDocument()
    
    // Click execute
    fireEvent.click(executeButton)
    
    // Should show executing state
    expect(screen.getByText('Executing...')).toBeInTheDocument()
    
    // Fast-forward time to complete the simulated API call
    jest.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  it('displays copy buttons and handles clipboard operations', async () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    const copyButtons = screen.getAllByRole('button')
    const copyButton = copyButtons.find(button => 
      button.querySelector('svg') && button.textContent === ''
    )
    
    if (copyButton) {
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      })
    }
  })

  it('shows integration complexity and format information', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Komatsu Integration Summary')).toBeInTheDocument()
    expect(screen.getByText('JSON with Komatsu proprietary schemas')).toBeInTheDocument()
    expect(screen.getByText('REST API with real-time WebSocket streams')).toBeInTheDocument()
    expect(screen.getByText('HTTPS + WebSocket + Komatsu CAN Bus')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('generates different API formats for different vendors', () => {
    const { rerender } = render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Should show JSON format for Komatsu
    expect(screen.getByText(/Authorization: Bearer <KOMTRAX_TOKEN>/)).toBeInTheDocument()
    
    // Switch to Caterpillar
    rerender(<APICallDisplay selectedVendor={mockCaterpillarVendor} />)
    
    // Should show XML format for Caterpillar
    expect(screen.getByText(/Authorization: MineStar-API <API_KEY>/)).toBeInTheDocument()
  })

  it('displays response time information', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Should show response time (will be random but should end with 'ms')
    const responseTimeElements = screen.getAllByText(/\d+ms/)
    expect(responseTimeElements.length).toBeGreaterThan(0)
  })

  it('shows proper request format based on HTTP method', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Vehicles endpoint should show GET request
    expect(screen.getByText(/GET \/api\/komatsu\/vehicles/)).toBeInTheDocument()
    
    // Switch to POST endpoint (routing)
    const routingButton = screen.getByText('Route Optimization').closest('button')
    fireEvent.click(routingButton!)
    
    expect(screen.getByText(/POST \/api\/komatsu\/routes/)).toBeInTheDocument()
  })

  it('displays vendor-specific response formats', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Should show JSON response format for Komatsu
    expect(screen.getByText(/"vehicleId": "KOM-830E-001"/)).toBeInTheDocument()
    
    // Switch to Caterpillar vendor
    const { rerender } = render(<APICallDisplay selectedVendor={mockCaterpillarVendor} />)
    rerender(<APICallDisplay selectedVendor={mockCaterpillarVendor} />)
    
    // Should show XML response format for Caterpillar
    expect(screen.getByText(/<Vehicle id="CAT-797F-042">/)).toBeInTheDocument()
  })

  it('applies custom className prop', () => {
    const { container } = render(
      <APICallDisplay selectedVendor={mockKomatsuVendor} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('shows integration complexity color coding', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    // Medium complexity should have yellow styling
    const complexityBadge = screen.getByText('Medium')
    expect(complexityBadge).toHaveClass('bg-yellow-500/20', 'text-yellow-300')
  })

  it('handles high complexity vendor correctly', () => {
    render(<APICallDisplay selectedVendor={mockCaterpillarVendor} />)
    
    // High complexity should have red styling
    const complexityBadge = screen.getByText('High')
    expect(complexityBadge).toHaveClass('bg-red-500/20', 'text-red-300')
  })

  it('displays appropriate complexity description', () => {
    render(<APICallDisplay selectedVendor={mockKomatsuVendor} />)
    
    expect(screen.getByText('Some proprietary formats, moderate integration effort')).toBeInTheDocument()
  })
})
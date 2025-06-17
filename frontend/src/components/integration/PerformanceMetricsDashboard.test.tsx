import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import PerformanceMetricsDashboard from './PerformanceMetricsDashboard'
import type { FleetManagementSystem } from '@/data/fleetManagementSystems'

// Mock the performance metrics data
jest.mock('@/data/fleetManagementSystems', () => ({
  performanceMetrics: {
    diversionRate: {
      baseline: 12.3,
      optimized: 5.9,
      improvement: 6.4
    },
    costSavings: {
      minAnnual: 3000000,
      maxAnnual: 50000000,
      avgPerTruck: 75000
    },
    efficiency: {
      fuelReduction: 15.2,
      cycleTimeReduction: 8.7,
      utilizationIncrease: 12.4
    },
    safety: {
      incidentReduction: 67,
      collisionAvoidance: 99.2,
      operatorAlerts: 2400
    }
  }
}))

const mockVendor: FleetManagementSystem = {
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

describe('PerformanceMetricsDashboard', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('renders performance metrics dashboard with header', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Performance Metrics - Komatsu')).toBeInTheDocument()
    expect(screen.getByText('Real-time fleet optimization impact and cost savings analysis')).toBeInTheDocument()
  })

  it('displays period selector buttons', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('24H')).toBeInTheDocument()
    expect(screen.getByText('7D')).toBeInTheDocument()
    expect(screen.getByText('30D')).toBeInTheDocument()
    expect(screen.getByText('90D')).toBeInTheDocument()
  })

  it('allows period selection and updates data', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Default should be 7D
    const sevenDayButton = screen.getByText('7D')
    expect(sevenDayButton).toHaveClass('bg-blue-500')
    
    // Click on 30D
    const thirtyDayButton = screen.getByText('30D')
    fireEvent.click(thirtyDayButton)
    
    expect(thirtyDayButton).toHaveClass('bg-blue-500')
  })

  it('displays primary metric cards', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Truck Diversion Rate')).toBeInTheDocument()
    expect(screen.getByText('Annual Cost Savings')).toBeInTheDocument()
    expect(screen.getByText('Fuel Efficiency Gain')).toBeInTheDocument()
    expect(screen.getByText('Safety Improvement')).toBeInTheDocument()
  })

  it('shows animated metric values', async () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Fast-forward timers to trigger animation
    jest.advanceTimersByTime(1000)
    
    await waitFor(() => {
      // Should show percentage values (multiple exist)
      expect(screen.getAllByText(/\d+\.\d+%/)).toHaveLength(11)
    })
  })

  it('displays operational efficiency metrics', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Operational Efficiency Metrics')).toBeInTheDocument()
    expect(screen.getByText('Average Haul Time')).toBeInTheDocument()
    expect(screen.getAllByText('Equipment Utilization')).toHaveLength(2) // Appears in multiple sections
    expect(screen.getByText('Load Factor Optimization')).toBeInTheDocument()
    expect(screen.getByText('Route Compliance')).toBeInTheDocument()
  })

  it('shows cost savings breakdown', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Cost Savings Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Fuel Optimization')).toBeInTheDocument()
    expect(screen.getByText('Route Efficiency')).toBeInTheDocument()
    expect(screen.getAllByText('Equipment Utilization')).toHaveLength(2) // Appears in multiple sections
    expect(screen.getByText('Maintenance Reduction')).toBeInTheDocument()
  })

  it('displays ROI analysis with vendor-specific costs', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('ROI Analysis - Komatsu')).toBeInTheDocument()
    expect(screen.getByText('Implementation Cost')).toBeInTheDocument()
    expect(screen.getByText('$2.5M - $5M')).toBeInTheDocument()
    expect(screen.getByText('Annual Maintenance')).toBeInTheDocument()
    expect(screen.getByText('$500K/year')).toBeInTheDocument()
    expect(screen.getByText('Licensing (100 vehicles)')).toBeInTheDocument()
    expect(screen.getByText('$200K/year per 100 vehicles')).toBeInTheDocument()
  })

  it('shows estimated payback period and ROI', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Estimated Payback Period')).toBeInTheDocument()
    expect(screen.getByText('8-14 months')).toBeInTheDocument()
    expect(screen.getByText('3-Year ROI')).toBeInTheDocument()
    expect(screen.getByText('340-580%')).toBeInTheDocument()
  })

  it('displays performance trends summary', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('Performance Trends Summary')).toBeInTheDocument()
    expect(screen.getByText('Current Diversion Rate')).toBeInTheDocument()
    expect(screen.getByText('Projected Annual Savings')).toBeInTheDocument()
    expect(screen.getByText('Fuel Efficiency Improvement')).toBeInTheDocument()
  })

  it('formats currency values correctly', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Should show currency formatting - multiple currency values exist
    expect(screen.getAllByText(/\$\d+[,.]?\d*[KM]?/)).toHaveLength(9)
  })

  it('displays trend indicators with appropriate colors', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Should have trend indicators with colors
    const trendElements = document.querySelectorAll('.text-green-400, .text-red-400, .text-blue-400')
    expect(trendElements.length).toBeGreaterThan(0)
  })

  it('shows progress bars for cost savings breakdown', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Should have progress bars
    const progressBars = document.querySelectorAll('.bg-blue-400.h-2.rounded-full')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it('applies custom className prop', () => {
    const { container } = render(
      <PerformanceMetricsDashboard selectedVendor={mockVendor} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles different vendor data correctly', () => {
    const catVendor = {
      ...mockVendor,
      vendor: 'Caterpillar',
      costProfile: {
        implementation: '$3M - $8M',
        maintenance: '$750K/year',
        licensing: '$300K/year per 100 vehicles'
      }
    }
    
    render(<PerformanceMetricsDashboard selectedVendor={catVendor} />)
    
    expect(screen.getByText('Performance Metrics - Caterpillar')).toBeInTheDocument()
    expect(screen.getByText('ROI Analysis - Caterpillar')).toBeInTheDocument()
    expect(screen.getByText('$3M - $8M')).toBeInTheDocument()
  })

  it('updates time series data when period changes', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    // Change period
    fireEvent.click(screen.getByText('30D'))
    
    // Should update the display (data generation happens internally)
    expect(screen.getByText('Performance Trends Summary')).toBeInTheDocument()
  })

  it('shows improvement indicators', () => {
    render(<PerformanceMetricsDashboard selectedVendor={mockVendor} />)
    
    expect(screen.getByText('6.4% improvement')).toBeInTheDocument()
    expect(screen.getByText('Up to $50M potential')).toBeInTheDocument()
    expect(screen.getByText('8.7% cycle time reduction')).toBeInTheDocument()
    expect(screen.getByText('99.2% collision avoidance')).toBeInTheDocument()
  })
})
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProtocolTransition } from './ProtocolTransition';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  Wifi: () => <div data-testid="wifi-icon">Wifi</div>,
  Cloud: () => <div data-testid="cloud-icon">Cloud</div>,
  Share2: () => <div data-testid="share-icon">Share2</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
  AlertCircle: () => <div data-testid="alert-icon">AlertCircle</div>,
  Timer: () => <div data-testid="timer-icon">Timer</div>,
  BarChart3: () => <div data-testid="barchart-icon">BarChart3</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>
}));

describe('ProtocolTransition', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the component with header and protocol steps', () => {
    render(<ProtocolTransition />);
    
    // Check header
    expect(screen.getByText('Protocol Transition Visualization')).toBeInTheDocument();
    expect(screen.getByText(/See how mining data flows through different protocols/)).toBeInTheDocument();
    
    // Check animation button
    expect(screen.getByText('Animate Data Flow')).toBeInTheDocument();
  });

  it('displays all four protocol steps', () => {
    render(<ProtocolTransition />);
    
    // Check all protocol steps are present
    expect(screen.getByText('Field Sensors')).toBeInTheDocument();
    expect(screen.getByText('SCADA Gateway')).toBeInTheDocument();
    expect(screen.getByText('Cloud Analytics')).toBeInTheDocument();
    expect(screen.getByText('Delta Share')).toBeInTheDocument();
    
    // Check protocols (some appear multiple times due to table)
    expect(screen.getAllByText('OPC UA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('REST API').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cloud Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Delta Sharing').length).toBeGreaterThan(0);
  });

  it('shows step numbers and appropriate icons', () => {
    render(<ProtocolTransition />);
    
    // Should show step numbers 1-4 (some numbers may appear multiple times)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    
    // Should show appropriate icons
    expect(screen.getAllByTestId('database-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('wifi-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('cloud-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('share-icon').length).toBeGreaterThan(0);
  });

  it('displays latency and throughput metrics for each step', () => {
    render(<ProtocolTransition />);
    
    // Should show latency values (may appear multiple times due to table)
    expect(screen.getAllByText('5-15ms').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100ms-1s').length).toBeGreaterThan(0);
    expect(screen.getAllByText('200ms-2s').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1-5s').length).toBeGreaterThan(0);
    
    // Should show throughput values
    expect(screen.getAllByText('100 points/sec').length).toBeGreaterThan(0);
    expect(screen.getAllByText('10 calls/sec').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1000 records/batch').length).toBeGreaterThan(0);
    expect(screen.getAllByText('10TB/day').length).toBeGreaterThan(0);
  });

  it('shows security levels with appropriate icons', () => {
    render(<ProtocolTransition />);
    
    // Should show security levels (case insensitive due to CSS capitalization)
    expect(screen.getAllByText(/medium/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/high/i).length).toBeGreaterThan(0);
    
    // Should show lock icons for security
    expect(screen.getAllByTestId('lock-icon').length).toBeGreaterThan(0);
  });

  it('opens modal when step is clicked', async () => {
    render(<ProtocolTransition showDetails={true} />);
    
    // Click on the first step (Field Sensors)
    const fieldSensorsStep = screen.getByText('Field Sensors').closest('div');
    expect(fieldSensorsStep).toBeInTheDocument();
    
    if (fieldSensorsStep) {
      fireEvent.click(fieldSensorsStep);
      
      await waitFor(() => {
        // Should show modal with example data
        expect(screen.getByText('Example Data')).toBeInTheDocument();
        expect(screen.getByText(/timestamp/)).toBeInTheDocument();
        expect(screen.getByText(/XRF_001/)).toBeInTheDocument();
      });
    }
  });

  it('triggers animation when animate button is clicked', async () => {
    render(<ProtocolTransition />);
    
    const animateButton = screen.getByText('Animate Data Flow');
    expect(animateButton).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(animateButton);
    });
    
    // Button should be disabled during animation
    expect(screen.getByText('Animating...')).toBeInTheDocument();
    
    // Fast forward the animation
    await act(async () => {
      jest.advanceTimersByTime(15000);
    });
  });

  it('displays protocol comparison matrix', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getByText('Protocol Comparison Matrix')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Protocol')).toBeInTheDocument();
    expect(screen.getByText('Use Case')).toBeInTheDocument();
    expect(screen.getByText('Latency')).toBeInTheDocument();
    expect(screen.getByText('Throughput')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Best For')).toBeInTheDocument();
  });

  it('shows performance insights section', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getByText('End-to-End Latency')).toBeInTheDocument();
    expect(screen.getByText('~3.2s')).toBeInTheDocument();
    expect(screen.getByText('Field sensor to Delta Share')).toBeInTheDocument();
    
    expect(screen.getByText('Data Transformation')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('Volume reduction through aggregation')).toBeInTheDocument();
    
    expect(screen.getByText('Security Layers')).toBeInTheDocument();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0); // May appear in step number and insights
    expect(screen.getByText('Authentication, encryption, authorization, audit')).toBeInTheDocument();
  });

  it('displays data formats for each protocol', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getByText('Binary + JSON')).toBeInTheDocument();
    expect(screen.getByText('JSON over HTTPS')).toBeInTheDocument();
    expect(screen.getByText('Parquet + Delta Format')).toBeInTheDocument();
    expect(screen.getByText('Delta Lake Tables')).toBeInTheDocument();
  });

  it('shows level information for each step', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getAllByText('Level 0-1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Level 2-3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Level 4-5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Enterprise').length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const customClass = 'custom-protocol-class';
    const { container } = render(<ProtocolTransition className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('handles selectedStep prop correctly', () => {
    render(<ProtocolTransition selectedStep="field-sensors" showDetails={true} />);
    
    // Component should render without errors
    expect(screen.getByText('Protocol Transition Visualization')).toBeInTheDocument();
  });

  it('shows arrow transitions between steps', () => {
    render(<ProtocolTransition />);
    
    // Should show arrow icons for transitions (now includes both background and animated arrows)
    const arrowIcons = screen.getAllByTestId('arrow-right-icon');
    expect(arrowIcons.length).toBe(6); // 3 transitions x 2 arrows each (background + animated)
  });

  it('displays descriptions for each protocol step', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getByText(/Real-time sensor data from XRF ore analyzers/)).toBeInTheDocument();
    expect(screen.getAllByText(/Aggregated operational data for production systems/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Business intelligence and predictive analytics platform/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Secure data sharing with partners and customers/)).toBeInTheDocument();
  });

  it('shows JSON example data when step is clicked', async () => {
    render(<ProtocolTransition showDetails={true} />);
    
    // Click on SCADA Gateway step
    const scadaStep = screen.getByText('SCADA Gateway').closest('div');
    if (scadaStep) {
      fireEvent.click(scadaStep);
      
      await waitFor(() => {
        expect(screen.getByText('Example Data')).toBeInTheDocument();
        expect(screen.getByText(/equipment_id/)).toBeInTheDocument();
        expect(screen.getByText(/batch_info/)).toBeInTheDocument();
      });
    }
  });

  it('respects showDetails prop during rendering', () => {
    // Test with showDetails false
    const { rerender } = render(<ProtocolTransition showDetails={false} />);
    expect(screen.queryByText('Example Data')).not.toBeInTheDocument();
    
    // Test with showDetails true
    rerender(<ProtocolTransition showDetails={true} />);
    // Component should render without errors
    expect(screen.getByText('Protocol Transition Visualization')).toBeInTheDocument();
  });

  it('shows performance insights icons', () => {
    render(<ProtocolTransition />);
    
    expect(screen.getByTestId('timer-icon')).toBeInTheDocument();
    expect(screen.getByTestId('barchart-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('lock-icon').length).toBeGreaterThan(0);
  });

  it('shows click hints on step cards', () => {
    render(<ProtocolTransition />);
    
    const hints = screen.getAllByText('Click to view example data');
    expect(hints).toHaveLength(4); // One for each step
  });

  it('closes modal when X button is clicked', async () => {
    render(<ProtocolTransition />);
    
    // Click on a step to open modal
    const fieldSensorsStep = screen.getByText('Field Sensors').closest('div');
    if (fieldSensorsStep) {
      fireEvent.click(fieldSensorsStep);
      
      await waitFor(() => {
        expect(screen.getByText('Example Data')).toBeInTheDocument();
      });
      
      // Click X button to close modal
      const closeButton = screen.getByTestId('x-icon').closest('button');
      if (closeButton) {
        fireEvent.click(closeButton);
        
        await waitFor(() => {
          expect(screen.queryByText('Example Data')).not.toBeInTheDocument();
        });
      }
    }
  });

  it('shows copy button in modal', async () => {
    render(<ProtocolTransition />);
    
    // Click on a step to open modal
    const fieldSensorsStep = screen.getByText('Field Sensors').closest('div');
    if (fieldSensorsStep) {
      fireEvent.click(fieldSensorsStep);
      
      await waitFor(() => {
        expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
      });
    }
  });

  it('shows enhanced animation effects during data flow', async () => {
    render(<ProtocolTransition />);
    
    const animateButton = screen.getByText('Animate Data Flow');
    
    await act(async () => {
      fireEvent.click(animateButton);
    });
    
    // Should show enhanced animation elements
    expect(screen.getByText('Animating...')).toBeInTheDocument();
    
    // Fast forward to see animation effects
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should show DATA packet animation
    await waitFor(() => {
      const dataElements = screen.getAllByText('DATA');
      expect(dataElements.length).toBeGreaterThan(0);
    });
  });
});
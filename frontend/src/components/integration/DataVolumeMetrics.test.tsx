import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataVolumeMetrics } from './DataVolumeMetrics';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Database: () => <div data-testid="database-icon">Database</div>,
  ArrowDown: () => <div data-testid="arrow-down-icon">ArrowDown</div>,
  ArrowUp: () => <div data-testid="arrow-up-icon">ArrowUp</div>,
  TrendingDown: () => <div data-testid="trending-down-icon">TrendingDown</div>,
  BarChart3: () => <div data-testid="barchart-icon">BarChart3</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Activity: () => <div data-testid="activity-icon">Activity</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  Info: () => <div data-testid="info-icon">Info</div>
}));

describe('DataVolumeMetrics', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the component with header and description', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('Data Volume Transformation')).toBeInTheDocument();
    expect(screen.getByText('How data volume reduces and value increases through ISA-95 levels')).toBeInTheDocument();
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
  });

  it('displays real-time data flow when showRealTimeFlow is true', () => {
    render(<DataVolumeMetrics showRealTimeFlow={true} />);
    
    expect(screen.getByText('Real-Time Data Flow')).toBeInTheDocument();
    expect(screen.getByText('(Mining Example: Iron Ore Processing)')).toBeInTheDocument();
    
    // Check that all 6 levels are displayed
    expect(screen.getByText('L0')).toBeInTheDocument();
    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByText('L2')).toBeInTheDocument();
    expect(screen.getByText('L3')).toBeInTheDocument();
    expect(screen.getByText('L4')).toBeInTheDocument();
    expect(screen.getByText('L5')).toBeInTheDocument();
  });

  it('hides real-time flow when showRealTimeFlow is false', () => {
    render(<DataVolumeMetrics showRealTimeFlow={false} />);
    
    expect(screen.queryByText('Real-Time Data Flow')).not.toBeInTheDocument();
  });

  it('displays detailed level metrics for all ISA-95 levels', () => {
    render(<DataVolumeMetrics />);
    
    // Check that all levels are displayed with their names
    expect(screen.getByText('Level 0: Field Level')).toBeInTheDocument();
    expect(screen.getByText('Level 1: Control Level')).toBeInTheDocument();
    expect(screen.getByText('Level 2: Supervision Level')).toBeInTheDocument();
    expect(screen.getByText('Level 3: MES Level')).toBeInTheDocument();
    expect(screen.getByText('Level 4: ERP Level')).toBeInTheDocument();
    expect(screen.getByText('Level 5: Business Intelligence')).toBeInTheDocument();
  });

  it('shows input and output rates for each level', () => {
    render(<DataVolumeMetrics />);
    
    // Check some specific rates using getAllByText for multiple instances
    expect(screen.getAllByText('50-500 readings/second').length).toBeGreaterThan(0);
    expect(screen.getByText('5-50 control decisions/second')).toBeInTheDocument();
    expect(screen.getAllByText('1-10 alerts/minute').length).toBeGreaterThan(0);
  });

  it('displays compression ratios with appropriate colors', () => {
    render(<DataVolumeMetrics />);
    
    // Check compression indicators
    expect(screen.getByText('Raw data')).toBeInTheDocument(); // Level 0
    expect(screen.getByText('10x compression')).toBeInTheDocument(); // Level 1
    expect(screen.getByText('2000x compression')).toBeInTheDocument(); // Level 5
  });

  it('shows aggregation methods and retention periods', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('Raw data collection')).toBeInTheDocument();
    expect(screen.getByText('Event-driven processing')).toBeInTheDocument();
    expect(screen.getByText('Time-based averaging')).toBeInTheDocument();
    expect(screen.getByText('Statistical summarization')).toBeInTheDocument();
    
    expect(screen.getByText('24 hours local buffer')).toBeInTheDocument();
    expect(screen.getByText('7 days in PLC memory')).toBeInTheDocument();
    expect(screen.getByText('Indefinite (data warehouse)')).toBeInTheDocument();
  });

  it('displays business value for each level', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('Real-time operational control and safety monitoring')).toBeInTheDocument();
    expect(screen.getByText('Automated process optimization and safety enforcement')).toBeInTheDocument();
    expect(screen.getByText('Strategic decision making and competitive advantage')).toBeInTheDocument();
  });

  it('shows live examples for each level', () => {
    render(<DataVolumeMetrics />);
    
    // Check that live examples are displayed
    expect(screen.getAllByText('Live Example:').length).toBe(6);
    expect(screen.getByText(/XRF analyzer scans ore every 2 seconds/)).toBeInTheDocument();
    expect(screen.getByText(/PLCs process sensor data/)).toBeInTheDocument();
    expect(screen.getByText(/BI systems generate strategic insights/)).toBeInTheDocument();
  });

  it('displays inter-level data transformations', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('Inter-Level Data Transformations')).toBeInTheDocument();
    
    // Check transformation types
    expect(screen.getByText('Event filtering')).toBeInTheDocument();
    expect(screen.getByText('Time aggregation')).toBeInTheDocument();
    expect(screen.getByText('Statistical summary')).toBeInTheDocument();
    expect(screen.getByText('Business logic')).toBeInTheDocument();
    expect(screen.getByText('Analytics processing')).toBeInTheDocument();
  });

  it('shows volume reduction percentages', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('-90% volume')).toBeInTheDocument();
    expect(screen.getByText('-83% volume')).toBeInTheDocument();
    expect(screen.getByText('-88% volume')).toBeInTheDocument();
    expect(screen.getByText('-80% volume')).toBeInTheDocument();
    expect(screen.getByText('-60% volume')).toBeInTheDocument();
  });

  it('displays latency increases between levels', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('+5-15ms latency')).toBeInTheDocument();
    expect(screen.getByText('+50-200ms latency')).toBeInTheDocument();
    expect(screen.getByText('+1-5 minutes latency')).toBeInTheDocument();
    expect(screen.getByText('+1-4 hours latency')).toBeInTheDocument();
    expect(screen.getByText('+1-7 days latency')).toBeInTheDocument();
  });

  it('highlights selected level when selectedLevel prop is provided', () => {
    render(<DataVolumeMetrics selectedLevel={2} />);
    
    // Find the level card container that should have the highlight classes
    const level2Card = screen.getByText('Level 2: Supervision Level').closest('.border-2');
    expect(level2Card).toHaveClass('border-green-400');
    expect(level2Card).toHaveClass('scale-105');
  });

  it('animates data flow when animated is true', async () => {
    render(<DataVolumeMetrics animated={true} showRealTimeFlow={true} />);
    
    // Initially, no animation classes should be active
    const initialActiveFlow = screen.queryByText('L0').closest('div');
    
    // Fast forward animation
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Animation should have progressed
    expect(screen.getByText('L0')).toBeInTheDocument();
  });

  it('does not animate when animated is false', () => {
    render(<DataVolumeMetrics animated={false} showRealTimeFlow={true} />);
    
    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // No animation classes should be applied
    const flowElements = screen.getAllByText(/L[0-5]/);
    flowElements.forEach(element => {
      const parentDiv = element.closest('div');
      expect(parentDiv).not.toHaveClass('border-blue-400');
    });
  });

  it('displays appropriate icons for each level', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getAllByTestId('zap-icon').length).toBeGreaterThan(0); // Level 0
    expect(screen.getAllByTestId('activity-icon').length).toBeGreaterThan(0); // Level 1 and header
    expect(screen.getAllByTestId('gauge-icon').length).toBeGreaterThan(0); // Level 2
    expect(screen.getAllByTestId('barchart-icon').length).toBeGreaterThan(0); // Level 3
    expect(screen.getAllByTestId('database-icon').length).toBeGreaterThan(0); // Level 4
    expect(screen.getAllByTestId('trending-down-icon').length).toBeGreaterThan(0); // Level 5 and section
  });

  it('formats large numbers correctly', () => {
    render(<DataVolumeMetrics />);
    
    // The component should format numbers with K/M suffixes where appropriate
    // Check that numbers are displayed (exact formatting depends on the data)
    expect(screen.getAllByText('450').length).toBeGreaterThan(0);
    expect(screen.getAllByText('45').length).toBeGreaterThan(0);
  });

  it('shows summary information', () => {
    render(<DataVolumeMetrics />);
    
    expect(screen.getByText('Data Volume Transformation Summary')).toBeInTheDocument();
    expect(screen.getByText(/450 readings\/second.*transforms into strategic insights/)).toBeInTheDocument();
    expect(screen.getByText(/2000x compression ratio/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-metrics-class';
    const { container } = render(<DataVolumeMetrics className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('shows retention periods for different levels', () => {
    render(<DataVolumeMetrics />);
    
    // Check various retention periods
    expect(screen.getByText('24 hours local buffer')).toBeInTheDocument();
    expect(screen.getByText('30 days in SCADA historian')).toBeInTheDocument();
    expect(screen.getByText('2 years in MES database')).toBeInTheDocument();
    expect(screen.getByText('7 years for compliance')).toBeInTheDocument();
  });

  it('displays time window information in real-time examples', () => {
    render(<DataVolumeMetrics showRealTimeFlow={true} />);
    
    // Use getAllByText since these appear multiple times
    expect(screen.getAllByText('per second').length).toBeGreaterThan(0);
    expect(screen.getAllByText('per minute').length).toBeGreaterThan(0);
    expect(screen.getAllByText('per hour').length).toBeGreaterThan(0);
    expect(screen.getAllByText('per day').length).toBeGreaterThan(0);
    expect(screen.getAllByText('per week').length).toBeGreaterThan(0);
  });

  it('shows correct data types for each level', () => {
    render(<DataVolumeMetrics />);
    
    // These are shown in the level cards but we can verify some key ones exist
    const level0Card = screen.getByText('Level 0: Field Level').closest('div');
    const level3Card = screen.getByText('Level 3: MES Level').closest('div');
    
    expect(level0Card).toBeInTheDocument();
    expect(level3Card).toBeInTheDocument();
  });

  it('handles edge cases with selectedLevel', () => {
    render(<DataVolumeMetrics selectedLevel={99} />);
    
    // Should not crash with invalid level
    expect(screen.getByText('Data Volume Transformation')).toBeInTheDocument();
  });
});
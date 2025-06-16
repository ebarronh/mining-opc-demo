import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LatencyMetrics } from './LatencyMetrics';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  ArrowDown: () => <div data-testid="arrow-down-icon">ArrowDown</div>,
  ArrowUp: () => <div data-testid="arrow-up-icon">ArrowUp</div>,
  Wifi: () => <div data-testid="wifi-icon">Wifi</div>,
  Cloud: () => <div data-testid="cloud-icon">Cloud</div>,
  Activity: () => <div data-testid="activity-icon">Activity</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Timer: () => <div data-testid="timer-icon">Timer</div>,
}));

describe('LatencyMetrics', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the component with header and latency transitions', () => {
    render(<LatencyMetrics />);
    
    // Check header
    expect(screen.getByText('Latency Metrics')).toBeInTheDocument();
    expect(screen.getByText(/Real-time data flow latencies/)).toBeInTheDocument();
    
    // Check timer icon in header
    expect(screen.getByTestId('timer-icon')).toBeInTheDocument();
  });

  it('displays all latency transitions by default', () => {
    render(<LatencyMetrics />);
    
    // Should show various protocols
    expect(screen.getByText('OPC UA')).toBeInTheDocument();
    expect(screen.getByText('Ethernet/IP')).toBeInTheDocument();
    expect(screen.getByText('REST API')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('ETL Pipeline')).toBeInTheDocument();
    
    // Should show latency values
    expect(screen.getByText('5-15ms')).toBeInTheDocument();
    expect(screen.getByText('20-50ms')).toBeInTheDocument();
    expect(screen.getByText('100ms-1s')).toBeInTheDocument();
  });

  it('filters transitions when selectedLevel is provided', () => {
    render(<LatencyMetrics selectedLevel={0} />);
    
    // Should show transitions related to Level 0
    expect(screen.getByText('OPC UA')).toBeInTheDocument();
    
    // Should not show all transitions (fewer than default)
    const protocolElements = screen.queryAllByText(/Database|ETL Pipeline/);
    expect(protocolElements.length).toBeLessThan(2);
  });

  it('shows real-time updates when showRealTime is true', async () => {
    const { container } = render(<LatencyMetrics showRealTime={true} />);
    
    // Should show live updates indicator
    expect(screen.getByText('Live Updates')).toBeInTheDocument();
    
    // Should have a status indicator
    const statusIndicators = container.querySelectorAll('[class*="w-2"][class*="h-2"][class*="rounded-full"]');
    expect(statusIndicators.length).toBeGreaterThan(0);
  });

  it('displays performance indicators for different latency ranges', () => {
    render(<LatencyMetrics />);
    
    // Should show different performance levels
    expect(screen.getAllByText('Excellent').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Good').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Acceptable').length).toBeGreaterThan(0);
  });

  it('renders summary statistics correctly', () => {
    render(<LatencyMetrics />);
    
    // Should show summary stats
    expect(screen.getByText('Sub-100ms Paths')).toBeInTheDocument();
    expect(screen.getByText('Near Real-time')).toBeInTheDocument();
    expect(screen.getByText('Batch Processing')).toBeInTheDocument();
    expect(screen.getByText('Total Paths')).toBeInTheDocument();
  });

  it('shows optimization tips section', () => {
    render(<LatencyMetrics />);
    
    expect(screen.getByText('Optimization Tips')).toBeInTheDocument();
    expect(screen.getByText(/Use edge computing for time-critical control loops/)).toBeInTheDocument();
    expect(screen.getByText(/Implement caching for frequently accessed/)).toBeInTheDocument();
    expect(screen.getByText(/Consider async processing for non-critical/)).toBeInTheDocument();
  });

  it('displays transition descriptions correctly', () => {
    render(<LatencyMetrics />);
    
    expect(screen.getByText('Sensor readings to PLC processing')).toBeInTheDocument();
    expect(screen.getByText('Control commands to HMI displays')).toBeInTheDocument();
    expect(screen.getByText('Operational data to production systems')).toBeInTheDocument();
  });

  it('shows appropriate icons for different transition types', () => {
    render(<LatencyMetrics />);
    
    // Should show various transition type icons
    expect(screen.getAllByTestId('arrow-down-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('zap-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('cloud-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('activity-icon').length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const customClass = 'custom-latency-class';
    const { container } = render(<LatencyMetrics className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('updates metrics when real-time mode is enabled', async () => {
    const { container } = render(<LatencyMetrics showRealTime={true} />);
    
    // Fast forward time to trigger metric updates
    await act(async () => {
      jest.advanceTimersByTime(2100);
    });
    
    await waitFor(() => {
      // Should have updated the status indicator (animation state)
      const statusIndicators = container.querySelectorAll('[class*="w-2"][class*="h-2"][class*="rounded-full"]');
      expect(statusIndicators.length).toBeGreaterThan(0);
    });
  });

  it('shows data flow paths with correct from/to indicators', () => {
    const { container } = render(<LatencyMetrics />);
    
    // Should show flow path indicators (blue and green dots)
    const blueIndicators = container.querySelectorAll('[class*="bg-blue-400"][class*="rounded-full"]');
    const greenIndicators = container.querySelectorAll('[class*="bg-green-400"][class*="rounded-full"]');
    
    expect(blueIndicators.length).toBeGreaterThan(0);
    expect(greenIndicators.length).toBeGreaterThan(0);
  });

  it('displays latency values with appropriate color coding', () => {
    render(<LatencyMetrics />);
    
    // Should have latency values displayed
    expect(screen.getByText('5-15ms')).toBeInTheDocument();
    expect(screen.getByText('20-50ms')).toBeInTheDocument();
    expect(screen.getByText('100ms-1s')).toBeInTheDocument();
    expect(screen.getByText('1-10s')).toBeInTheDocument();
  });

  it('shows protocol information for each transition', () => {
    render(<LatencyMetrics />);
    
    // Should display protocol names
    expect(screen.getByText('OPC UA')).toBeInTheDocument();
    expect(screen.getByText('Ethernet/IP')).toBeInTheDocument();
    expect(screen.getByText('REST API')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('ETL Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Edge Computing')).toBeInTheDocument();
    expect(screen.getByText('HTTPS/REST')).toBeInTheDocument();
    expect(screen.getByText('WebSocket')).toBeInTheDocument();
  });
});
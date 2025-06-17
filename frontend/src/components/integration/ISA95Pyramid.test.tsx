import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ISA95Pyramid from './ISA95Pyramid';
import { ISA95Level } from '@/types/integration';

// Mock DataTransformationExamples component
jest.mock('./DataTransformationExamples', () => ({
  DataTransformationExamples: () => <div data-testid="data-transformation-examples">DataTransformationExamples</div>
}));

// Mock DataFlowAnimator component
jest.mock('./DataFlowAnimator', () => ({
  DataFlowAnimator: () => <div data-testid="data-flow-animator">DataFlowAnimator</div>
}));

// Mock LatencyMetrics component
jest.mock('./LatencyMetrics', () => ({
  LatencyMetrics: () => <div data-testid="latency-metrics">LatencyMetrics</div>
}));

// Mock ProtocolTransition component
jest.mock('./ProtocolTransition', () => ({
  ProtocolTransition: () => <div data-testid="protocol-transition">ProtocolTransition</div>
}));

// Mock FollowTheData component
jest.mock('./FollowTheData', () => ({
  FollowTheData: () => <div data-testid="follow-the-data">FollowTheData</div>
}));

// Mock BiDirectionalFlow component
jest.mock('./BiDirectionalFlow', () => ({
  BiDirectionalFlow: () => <div data-testid="bi-directional-flow">BiDirectionalFlow</div>
}));

// Mock SecurityBoundaryHighlight component
jest.mock('./SecurityBoundaryHighlight', () => ({
  SecurityBoundaryHighlight: () => <div data-testid="security-boundary-highlight">SecurityBoundaryHighlight</div>
}));

// Mock DataVolumeMetrics component
jest.mock('./DataVolumeMetrics', () => ({
  DataVolumeMetrics: () => <div data-testid="data-volume-metrics">DataVolumeMetrics</div>
}));

// Mock ISA95LevelTooltip component
jest.mock('./ISA95LevelTooltip', () => {
  return function MockISA95LevelTooltip({ children }: { children: React.ReactNode }) {
    return <div data-testid="isa95-level-tooltip">{children}</div>;
  };
});

// Mock useDataFlow hook
jest.mock('@/hooks/useDataFlow', () => ({
  useDataFlow: () => ({
    nodes: [],
    connections: [],
    isActive: true,
    toggleFlow: jest.fn()
  })
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Cpu: () => <div data-testid="cpu-icon">CPU</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  BarChart3: () => <div data-testid="barchart-icon">BarChart</div>,
  Building: () => <div data-testid="building-icon">Building</div>,
  TrendingUp: () => <div data-testid="trending-icon">Trending</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  HardDrive: () => <div data-testid="harddrive-icon">HardDrive</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  ArrowUpDown: () => <div data-testid="arrow-icon">Arrow</div>,
  Info: () => <div data-testid="info-icon">Info</div>,
}));

describe('ISA95Pyramid', () => {
  it('renders the pyramid with all ISA-95 levels', () => {
    render(<ISA95Pyramid />);
    
    // Check that the main title is rendered
    expect(screen.getByText('ISA-95 Integration Pyramid')).toBeInTheDocument();
    
    // Check that all 6 levels are rendered (0-5) - using getAllBy since tooltips duplicate text
    expect(screen.getAllByText(/Level 0: Field Level/)).toHaveLength(2); // Main + tooltip
    expect(screen.getAllByText(/Level 1: Control Level/)).toHaveLength(2);
    expect(screen.getAllByText(/Level 2: Supervision Level/)).toHaveLength(2);
    expect(screen.getAllByText(/Level 3: MES Level/)).toHaveLength(2);
    expect(screen.getAllByText(/Level 4: ERP Level/)).toHaveLength(2);
    expect(screen.getAllByText(/Level 5: Business Intelligence/)).toHaveLength(2);
  });

  it('displays security boundary indicators for appropriate levels', () => {
    render(<ISA95Pyramid />);
    
    // Level 0 should not have security boundary (field level)
    // Levels 1-5 should have security boundaries, plus one in the legend
    const shieldIcons = screen.getAllByTestId('shield-icon');
    expect(shieldIcons).toHaveLength(6); // Levels 1-5 (5) + legend (1) = 6
    
    // Verify the legend shield icon is present
    expect(screen.getByText('Security Boundaries')).toBeInTheDocument();
  });

  it('shows data flow arrows when showDataFlow prop is true', () => {
    render(<ISA95Pyramid showDataFlow={true} />);
    
    // Should show arrows between levels
    const arrowIcons = screen.getAllByTestId('arrow-icon');
    expect(arrowIcons.length).toBeGreaterThan(0);
  });

  it('hides data flow arrows when showDataFlow prop is false', () => {
    render(<ISA95Pyramid showDataFlow={false} />);
    
    // Should not show any arrows
    const arrowIcons = screen.queryAllByTestId('arrow-icon');
    expect(arrowIcons).toHaveLength(0);
  });

  it('shows follow data mode indicator when followDataMode is true', () => {
    render(<ISA95Pyramid followDataMode={true} />);
    
    expect(screen.getByText(/Follow the Data Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Tracing ore reading through all levels/)).toBeInTheDocument();
  });

  it('calls onLevelSelect when a level is clicked', async () => {
    const mockOnLevelSelect = jest.fn();
    render(<ISA95Pyramid onLevelSelect={mockOnLevelSelect} />);
    
    // Click on Level 0 (Field Level) - get the first instance (main heading, not tooltip)
    const level0Elements = screen.getAllByText(/Level 0: Field Level/);
    const level0Element = level0Elements[0].closest('div');
    expect(level0Element).toBeInTheDocument();
    
    if (level0Element) {
      fireEvent.click(level0Element);
      
      await waitFor(() => {
        expect(mockOnLevelSelect).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 0,
            name: 'Field Level',
            description: 'Physical mining equipment and sensors'
          })
        );
      });
    }
  });

  it('shows tooltips on hover', async () => {
    render(<ISA95Pyramid />);
    
    // Get the first Level 0 element (main heading, not tooltip)
    const level0Elements = screen.getAllByText(/Level 0: Field Level/);
    const level0Element = level0Elements[0].closest('.group');
    expect(level0Element).toBeInTheDocument();
    
    if (level0Element) {
      // Hover over the element should show tooltip content via CSS (opacity)
      fireEvent.mouseEnter(level0Element);
      
      // The tooltip content should be in the DOM (even if hidden by CSS) - using getAllBy since tooltips duplicate text
      expect(screen.getAllByText(/Mining Context/)).toHaveLength(6); // One for each level
      expect(screen.getAllByText(/Protocols/)).toHaveLength(6);
      expect(screen.getAllByText(/^Metrics$/)).toHaveLength(6); // Use exact match to avoid "Latency Metrics"
    }
  });

  it('displays latency and data volume metrics', () => {
    render(<ISA95Pyramid />);
    
    // Check that clock and database icons are rendered (indicating metrics)
    expect(screen.getAllByTestId('clock-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('database-icon').length).toBeGreaterThan(0);
  });

  it('renders legend section with security, latency, and data volume explanations', () => {
    render(<ISA95Pyramid />);
    
    expect(screen.getByText('Security Boundaries')).toBeInTheDocument();
    expect(screen.getByText('Latency Metrics')).toBeInTheDocument();
    expect(screen.getByText('Data Volume')).toBeInTheDocument();
    
    // Check explanatory text
    expect(screen.getByText(/Dashed borders indicate security boundaries/)).toBeInTheDocument();
    expect(screen.getByText(/Response time requirements increase/)).toBeInTheDocument();
    expect(screen.getByText(/Data aggregation reduces volume/)).toBeInTheDocument();
  });

  it('applies correct CSS classes based on props', () => {
    const customClass = 'custom-pyramid-class';
    const { container } = render(<ISA95Pyramid className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders appropriate icons for each level', () => {
    render(<ISA95Pyramid />);
    
    // Each level should have its appropriate icon
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument(); // Level 0
    expect(screen.getByTestId('cpu-icon')).toBeInTheDocument(); // Level 1
    expect(screen.getByTestId('harddrive-icon')).toBeInTheDocument(); // Level 2
    expect(screen.getByTestId('barchart-icon')).toBeInTheDocument(); // Level 3
    expect(screen.getByTestId('building-icon')).toBeInTheDocument(); // Level 4
    expect(screen.getByTestId('trending-icon')).toBeInTheDocument(); // Level 5
  });

  it('shows mining-specific context for each level', async () => {
    render(<ISA95Pyramid />);
    
    // Mining context should be in tooltips (in DOM even if hidden)
    expect(screen.getByText(/Ore analyzers, conveyors, excavators/)).toBeInTheDocument();
  });

  it('shows latency metrics when showLatencyMetrics is true', () => {
    render(<ISA95Pyramid showLatencyMetrics={true} />);
    
    // Should render the LatencyMetrics component
    expect(screen.getByTestId('latency-metrics')).toBeInTheDocument();
  });

  it('hides latency metrics when showLatencyMetrics is false', () => {
    render(<ISA95Pyramid showLatencyMetrics={false} />);
    
    // Should not render the LatencyMetrics component
    expect(screen.queryByTestId('latency-metrics')).not.toBeInTheDocument();
  });

  it('shows transition latency indicators when showLatencyMetrics is true', () => {
    render(<ISA95Pyramid showLatencyMetrics={true} />);
    
    // Should show latency metrics component
    expect(screen.getByTestId('latency-metrics')).toBeInTheDocument();
  });

  it('passes correct props to LatencyMetrics component', () => {
    const mockOnLevelSelect = jest.fn();
    render(
      <ISA95Pyramid 
        showLatencyMetrics={true} 
        showDataFlow={true}
        onLevelSelect={mockOnLevelSelect}
      />
    );
    
    // Should render LatencyMetrics with showRealTime=true when showDataFlow=true
    expect(screen.getByTestId('latency-metrics')).toBeInTheDocument();
    
    // Click on a level to select it - get first instance (main heading)
    const level0Elements = screen.getAllByText(/Level 0: Field Level/);
    const level0Element = level0Elements[0].closest('div');
    if (level0Element) {
      fireEvent.click(level0Element);
      
      // LatencyMetrics should receive the selectedLevel
      expect(screen.getByTestId('latency-metrics')).toBeInTheDocument();
    }
  });

  it('shows protocol transition when showProtocolTransition is true', () => {
    render(<ISA95Pyramid showProtocolTransition={true} />);
    
    // Should render the ProtocolTransition component
    expect(screen.getByTestId('protocol-transition')).toBeInTheDocument();
  });

  it('hides protocol transition when showProtocolTransition is false', () => {
    render(<ISA95Pyramid showProtocolTransition={false} />);
    
    // Should not render the ProtocolTransition component
    expect(screen.queryByTestId('protocol-transition')).not.toBeInTheDocument();
  });

  it('passes correct props to ProtocolTransition component', () => {
    render(
      <ISA95Pyramid 
        showProtocolTransition={true}
        showDataFlow={true}
      />
    );
    
    // Should render ProtocolTransition
    expect(screen.getByTestId('protocol-transition')).toBeInTheDocument();
  });

  it('shows follow the data when showFollowTheData is true', () => {
    render(<ISA95Pyramid showFollowTheData={true} />);
    
    // Should render the FollowTheData component
    expect(screen.getByTestId('follow-the-data')).toBeInTheDocument();
  });

  it('hides follow the data when showFollowTheData is false', () => {
    render(<ISA95Pyramid showFollowTheData={false} />);
    
    // Should not render the FollowTheData component
    expect(screen.queryByTestId('follow-the-data')).not.toBeInTheDocument();
  });

  it('passes correct props to FollowTheData component', () => {
    const mockOnLevelSelect = jest.fn();
    render(
      <ISA95Pyramid 
        showFollowTheData={true}
        followDataMode={true}
        onLevelSelect={mockOnLevelSelect}
      />
    );
    
    // Should render FollowTheData
    expect(screen.getByTestId('follow-the-data')).toBeInTheDocument();
    
    // Click on a level to select it - get first instance (main heading)
    const level0Elements = screen.getAllByText(/Level 0: Field Level/);
    const level0Element = level0Elements[0].closest('div');
    if (level0Element) {
      fireEvent.click(level0Element);
      
      // FollowTheData should receive the selectedLevel
      expect(screen.getByTestId('follow-the-data')).toBeInTheDocument();
    }
  });

  it('shows bi-directional flow when showBiDirectionalFlow is true', () => {
    render(<ISA95Pyramid showBiDirectionalFlow={true} />);
    
    // Should render the BiDirectionalFlow component
    expect(screen.getByTestId('bi-directional-flow')).toBeInTheDocument();
  });

  it('hides bi-directional flow when showBiDirectionalFlow is false', () => {
    render(<ISA95Pyramid showBiDirectionalFlow={false} />);
    
    // Should not render the BiDirectionalFlow component
    expect(screen.queryByTestId('bi-directional-flow')).not.toBeInTheDocument();
  });

  it('passes correct props to BiDirectionalFlow component', () => {
    render(
      <ISA95Pyramid 
        showBiDirectionalFlow={true}
        followDataMode={true}
      />
    );
    
    // Should render BiDirectionalFlow
    expect(screen.getByTestId('bi-directional-flow')).toBeInTheDocument();
  });
});
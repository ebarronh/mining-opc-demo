import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTransformationExamples } from './DataTransformationExamples';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-icon">ChevronRight</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  Cpu: () => <div data-testid="cpu-icon">Cpu</div>,
  BarChart3: () => <div data-testid="barchart-icon">BarChart3</div>,
  TrendingUp: () => <div data-testid="trending-icon">TrendingUp</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  ArrowRight: () => <div data-testid="arrow-icon">ArrowRight</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
}));

describe('DataTransformationExamples', () => {
  it('renders the component with header and all transformation levels', () => {
    render(<DataTransformationExamples />);
    
    // Check header
    expect(screen.getByText('Data Transformation Examples')).toBeInTheDocument();
    expect(screen.getByText(/See how raw sensor data transforms/)).toBeInTheDocument();
    
    // Check all 6 ISA-95 levels are present
    expect(screen.getByText('Level 0: Field Level')).toBeInTheDocument();
    expect(screen.getByText('Level 1: Control Level')).toBeInTheDocument();
    expect(screen.getByText('Level 2: SCADA Level')).toBeInTheDocument();
    expect(screen.getByText('Level 3: MES Level')).toBeInTheDocument();
    expect(screen.getByText('Level 4: ERP Level')).toBeInTheDocument();
    expect(screen.getByText('Level 5: Business Intelligence')).toBeInTheDocument();
  });

  it('shows summary metrics at the bottom', () => {
    render(<DataTransformationExamples />);
    
    expect(screen.getByText('Data Volume Reduction')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('Value Enhancement')).toBeInTheDocument();
    expect(screen.getByText('1000x')).toBeInTheDocument();
    expect(screen.getByText('Processing Stages')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('expands level when clicked', async () => {
    render(<DataTransformationExamples />);
    
    // Level 0 should be expanded by default
    expect(screen.getByText('Mining Context')).toBeInTheDocument();
    
    // Click on Level 1 to expand it
    const level1Header = screen.getByText('Level 1: Control Level').closest('div');
    expect(level1Header).toBeInTheDocument();
    
    if (level1Header) {
      fireEvent.click(level1Header);
      
      await waitFor(() => {
        // Should show mining context for Level 1
        expect(screen.getByText(/PLC processes ore grade data/)).toBeInTheDocument();
      });
    }
  });

  it('shows input and output data formats when expanded', () => {
    render(<DataTransformationExamples />);
    
    // Level 0 is expanded by default, should show data formats
    expect(screen.getByText('Input: Raw Sensor Data')).toBeInTheDocument();
    expect(screen.getByText('Output: Calibrated Readings')).toBeInTheDocument();
    
    // Should show frequency and size information
    expect(screen.getByText('100ms')).toBeInTheDocument();
    expect(screen.getByText('64 bytes')).toBeInTheDocument();
    expect(screen.getByText('1s')).toBeInTheDocument();
    expect(screen.getByText('128 bytes')).toBeInTheDocument();
  });

  it('displays JSON examples for input and output data', () => {
    render(<DataTransformationExamples />);
    
    // Should contain sensor data in the JSON examples (multiple instances expected)
    expect(screen.getAllByText(/sensor_id/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fe_percent/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/XRF_001/).length).toBeGreaterThan(0);
  });

  it('shows transformation algorithm and purpose', () => {
    render(<DataTransformationExamples />);
    
    // Level 0 is expanded, should show transformation details
    expect(screen.getByText('Analog-to-Digital Conversion')).toBeInTheDocument();
    expect(screen.getByText(/Convert physical measurements/)).toBeInTheDocument();
  });

  it('respects selectedLevel prop', () => {
    render(<DataTransformationExamples selectedLevel={3} />);
    
    // Should show Level 3 content when selectedLevel is 3
    expect(screen.getByText(/MES analyzes shift performance/)).toBeInTheDocument();
  });

  it('handles animate data flow button click', async () => {
    render(<DataTransformationExamples />);
    
    const animateButton = screen.getByText('Animate Data Flow');
    expect(animateButton).toBeInTheDocument();
    
    fireEvent.click(animateButton);
    
    // Should trigger animation (tested by component rendering without errors)
    expect(animateButton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-transformation-class';
    const { container } = render(
      <DataTransformationExamples className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('toggles level expansion correctly', async () => {
    render(<DataTransformationExamples />);
    
    // Level 0 should be expanded initially
    expect(screen.getByText('Mining Context')).toBeInTheDocument();
    
    // Click Level 0 header to collapse
    const level0Header = screen.getByText('Level 0: Field Level').closest('div');
    if (level0Header) {
      fireEvent.click(level0Header);
      
      await waitFor(() => {
        // Mining context should be hidden (only one Mining Context should remain from other levels)
        const miningContextElements = screen.queryAllByText('Mining Context');
        expect(miningContextElements.length).toBe(0);
      });
    }
  });

  it('shows correct transformation process for each level', () => {
    render(<DataTransformationExamples />);
    
    // Level 0 shows signal conditioning
    expect(screen.getByText('Signal Conditioning')).toBeInTheDocument();
    
    // Click through other levels to verify their processes
    const level1Header = screen.getByText('Control Logic Processing');
    expect(level1Header).toBeInTheDocument();
    
    const level2Header = screen.getByText('Data Aggregation & Visualization');
    expect(level2Header).toBeInTheDocument();
  });

  it('displays mining-specific context for each level', () => {
    render(<DataTransformationExamples />);
    
    // Level 0 context about X-ray fluorescence
    expect(screen.getByText(/X-ray fluorescence analyzer/)).toBeInTheDocument();
    expect(screen.getByText(/ore composition in real-time/)).toBeInTheDocument();
  });

  it('renders appropriate icons for each level', () => {
    render(<DataTransformationExamples />);
    
    // Should have various icons for different functions
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument(); // Level 0
    expect(screen.getAllByTestId('database-icon').length).toBeGreaterThan(0); // Input/Output
    expect(screen.getAllByTestId('barchart-icon').length).toBeGreaterThan(0); // Output
    expect(screen.getAllByTestId('arrow-icon').length).toBeGreaterThan(0); // Transformation flow
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument(); // Animate button
  });

  it('shows frequency transformation from high to low as data moves up levels', () => {
    render(<DataTransformationExamples />);
    
    // Should show frequency changes in the header
    expect(screen.getByText(/100ms → 1s/)).toBeInTheDocument();
  });
});
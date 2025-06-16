import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ISA95Pyramid } from './ISA95Pyramid';
import { ISA95Level } from '@/types/integration';

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
}));

describe('ISA95Pyramid', () => {
  it('renders the pyramid with all ISA-95 levels', () => {
    render(<ISA95Pyramid />);
    
    // Check that the main title is rendered
    expect(screen.getByText('ISA-95 Integration Pyramid')).toBeInTheDocument();
    
    // Check that all 6 levels are rendered (0-5)
    expect(screen.getByText(/Level 0: Field Level/)).toBeInTheDocument();
    expect(screen.getByText(/Level 1: Control Level/)).toBeInTheDocument();
    expect(screen.getByText(/Level 2: Supervision Level/)).toBeInTheDocument();
    expect(screen.getByText(/Level 3: MES Level/)).toBeInTheDocument();
    expect(screen.getByText(/Level 4: ERP Level/)).toBeInTheDocument();
    expect(screen.getByText(/Level 5: Business Intelligence/)).toBeInTheDocument();
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
    
    // Click on Level 0 (Field Level)
    const level0Element = screen.getByText(/Level 0: Field Level/).closest('div');
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

  it('shows additional details on hover', async () => {
    render(<ISA95Pyramid />);
    
    const level0Element = screen.getByText(/Level 0: Field Level/).closest('div');
    expect(level0Element).toBeInTheDocument();
    
    if (level0Element) {
      // Hover over the element
      fireEvent.mouseEnter(level0Element);
      
      await waitFor(() => {
        // Should show mining context
        expect(screen.getByText(/Mining Context:/)).toBeInTheDocument();
        expect(screen.getByText(/Protocols:/)).toBeInTheDocument();
        expect(screen.getByText(/Data Types:/)).toBeInTheDocument();
      });
      
      // Mouse leave should hide details
      fireEvent.mouseLeave(level0Element);
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
    
    // Hover over Level 0 to see mining context
    const level0Element = screen.getByText(/Level 0: Field Level/).closest('div');
    if (level0Element) {
      fireEvent.mouseEnter(level0Element);
      
      await waitFor(() => {
        expect(screen.getByText(/Ore analyzers, conveyors, excavators/)).toBeInTheDocument();
      });
    }
  });
});
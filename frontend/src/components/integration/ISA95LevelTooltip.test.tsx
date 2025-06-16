import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ISA95LevelTooltip from './ISA95LevelTooltip';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Info: () => <div data-testid="info-icon">Info</div>,
  Lightbulb: () => <div data-testid="lightbulb-icon">Lightbulb</div>,
  Wrench: () => <div data-testid="wrench-icon">Wrench</div>,
  BarChart3: () => <div data-testid="barchart-icon">BarChart3</div>,
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  DollarSign: () => <div data-testid="dollar-icon">DollarSign</div>,
}));

// Mock Tooltip component
jest.mock('@/components/ui/Tooltip', () => {
  return function MockTooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
    return (
      <div data-testid="tooltip-wrapper">
        {children}
        <div data-testid="tooltip-content">{content}</div>
      </div>
    );
  };
});

// Mock React Portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('ISA95LevelTooltip', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders children without tooltip for invalid level', () => {
    render(
      <ISA95LevelTooltip level={99}>
        <div>Test content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-wrapper')).not.toBeInTheDocument();
  });

  it('renders tooltip for valid level 0 (Field Level)', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Level 0 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByTestId('tooltip-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Level 0 Content')).toBeInTheDocument();
    
    // Check that tooltip content includes level 0 specific information
    expect(screen.getByText(/Field Level - Physical Mining Operations/)).toBeInTheDocument();
  });

  it('displays correct mining context for Level 1 (Control Level)', () => {
    render(
      <ISA95LevelTooltip level={1}>
        <div>Level 1 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/Control Level - Automated Mining Systems/)).toBeInTheDocument();
    expect(screen.getByText(/Automated control loops and safety systems/)).toBeInTheDocument();
  });

  it('displays correct mining context for Level 2 (Supervision Level)', () => {
    render(
      <ISA95LevelTooltip level={2}>
        <div>Level 2 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/Supervision Level - Operations Control Center/)).toBeInTheDocument();
    expect(screen.getByText(/Human-machine interface for monitoring/)).toBeInTheDocument();
  });

  it('displays correct mining context for Level 3 (MES Level)', () => {
    render(
      <ISA95LevelTooltip level={3}>
        <div>Level 3 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/MES Level - Mine Execution Systems/)).toBeInTheDocument();
    expect(screen.getByText(/Production planning, scheduling/)).toBeInTheDocument();
  });

  it('displays correct mining context for Level 4 (ERP Level)', () => {
    render(
      <ISA95LevelTooltip level={4}>
        <div>Level 4 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/ERP Level - Business Management Systems/)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise resource planning/)).toBeInTheDocument();
  });

  it('displays correct mining context for Level 5 (Business Intelligence)', () => {
    render(
      <ISA95LevelTooltip level={5}>
        <div>Level 5 Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/Business Intelligence - Strategic Decision Making/)).toBeInTheDocument();
    expect(screen.getByText(/Executive reporting, strategic planning/)).toBeInTheDocument();
  });

  it('displays key sections for all levels', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    // Check that all key sections are present
    expect(screen.getByText('Key Functions')).toBeInTheDocument();
    expect(screen.getByText('Mining Examples')).toBeInTheDocument();
    expect(screen.getByText('Key Challenges')).toBeInTheDocument();
    expect(screen.getByText('Business Impact')).toBeInTheDocument();
    expect(screen.getByText('Real-World Example')).toBeInTheDocument();
  });

  it('displays appropriate icons for each section', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByTestId('wrench-icon')).toBeInTheDocument(); // Key Functions
    expect(screen.getByTestId('barchart-icon')).toBeInTheDocument(); // Mining Examples
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument(); // Key Challenges
    expect(screen.getByTestId('dollar-icon')).toBeInTheDocument(); // Business Impact
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument(); // Real-World Example
    expect(screen.getByTestId('info-icon')).toBeInTheDocument(); // Footer hint
  });

  it('displays mining-specific examples for Level 0', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    // Check for specific Level 0 mining examples
    expect(screen.getByText(/XRF ore analyzers measuring Fe, SiO2, Al2O3/)).toBeInTheDocument();
    expect(screen.getByText(/Conveyor belt weighing systems/)).toBeInTheDocument();
  });

  it('displays business impact information', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText(/production efficiency, safety compliance/)).toBeInTheDocument();
  });

  it('displays real-world example in italics', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    const realWorldExample = screen.getByText(/XRF analyzer on a conveyor belt scans ore/);
    expect(realWorldExample.closest('p')).toHaveClass('italic');
  });

  it('shows footer hint about hovering', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText('Hover for detailed mining context')).toBeInTheDocument();
  });

  it('applies custom placement', () => {
    render(
      <ISA95LevelTooltip level={0} placement="left">
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    // Component should render without errors
    expect(screen.getByTestId('tooltip-wrapper')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ISA95LevelTooltip level={0} className="custom-class">
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    // Component should render without errors
    expect(screen.getByTestId('tooltip-wrapper')).toBeInTheDocument();
  });

  it('limits displayed items to prevent tooltip overflow', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    // Key Functions should show only first 3 items
    const keyFunctionBullets = screen.getAllByText('•');
    // Mining Examples (2) + Key Functions (3) + Key Challenges (2) = 7 bullet points
    expect(keyFunctionBullets).toHaveLength(7);
  });

  it('displays challenges section for levels that have challenges', () => {
    render(
      <ISA95LevelTooltip level={0}>
        <div>Content</div>
      </ISA95LevelTooltip>
    );
    
    expect(screen.getByText('Key Challenges')).toBeInTheDocument();
    expect(screen.getByText(/Harsh mining environment/)).toBeInTheDocument();
  });
});
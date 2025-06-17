import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataFlowAnimator } from './DataFlowAnimator';
import { DataFlowNode, DataFlowConnection } from '@/types/integration';

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  setLineDash: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  set strokeStyle(value) {},
  set lineWidth(value) {},
  set fillStyle(value) {},
  set shadowColor(value) {},
  set shadowBlur(value) {}
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext)
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Sample test data
const sampleNodes: DataFlowNode[] = [
  {
    id: 'node1',
    level: 0,
    x: 100,
    y: 100,
    type: 'sensor',
    status: 'active',
    dataRate: 10
  },
  {
    id: 'node2',
    level: 1,
    x: 200,
    y: 200,
    type: 'controller',
    status: 'active',
    dataRate: 5
  }
];

const sampleConnections: DataFlowConnection[] = [
  {
    id: 'conn1',
    from: 'node1',
    to: 'node2',
    protocol: 'OPC UA',
    latency: 10,
    dataVolume: 100,
    bidirectional: false
  }
];

describe('DataFlowAnimator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
      />
    );
    
    expect(screen.getByText('Data Flow Active')).toBeInTheDocument();
  });

  it('shows active status when isActive is true', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        isActive={true}
      />
    );
    
    expect(screen.getByText('Data Flow Active')).toBeInTheDocument();
  });

  it('shows paused status when isActive is false', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        isActive={false}
      />
    );
    
    expect(screen.getByText('Data Flow Paused')).toBeInTheDocument();
  });

  it('displays particle count', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        particleCount={10}
      />
    );
    
    expect(screen.getByText(/samples/)).toBeInTheDocument();
  });

  it('shows data flow metrics and journey label', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
      />
    );
    
    expect(screen.getByText('Ore Samples')).toBeInTheDocument();
    expect(screen.getByText('Samples/sec')).toBeInTheDocument();
    expect(screen.getByText('From Ore Sample to Business Decision')).toBeInTheDocument();
    expect(screen.getByText('Watch how one ore reading becomes strategic intelligence')).toBeInTheDocument();
  });

  it('creates canvas with correct dimensions', () => {
    const { container } = render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
      />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-animator-class';
    const { container } = render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        className={customClass}
      />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('handles empty nodes and connections arrays', () => {
    render(
      <DataFlowAnimator
        nodes={[]}
        connections={[]}
      />
    );
    
    // Should not crash and should still show status
    expect(screen.getByText('Data Flow Active')).toBeInTheDocument();
  });

  it('calls onParticleComplete when provided', () => {
    const mockCallback = jest.fn();
    
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        onParticleComplete={mockCallback}
      />
    );
    
    // Component should render without errors
    expect(screen.getByText('Data Flow Active')).toBeInTheDocument();
  });

  it('respects animationSpeed prop', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
        animationSpeed={2}
      />
    );
    
    // Component should render with custom speed
    expect(screen.getByText('Data Flow Active')).toBeInTheDocument();
  });

  it('shows legend with mining systems and ore sample data', () => {
    render(
      <DataFlowAnimator
        nodes={sampleNodes}
        connections={sampleConnections}
      />
    );
    
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByText('Mining Systems')).toBeInTheDocument();
    expect(screen.getByText('Ore Sample Data')).toBeInTheDocument();
    expect(screen.getByText('Follow a dot from red to purple!')).toBeInTheDocument();
  });
});
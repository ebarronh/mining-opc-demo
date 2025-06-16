import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NodeDetails from './NodeDetails';
import { OpcUaNode } from '@/types/websocket';

describe('NodeDetails', () => {
  const mockNode: OpcUaNode = {
    nodeId: 'ns=1;s=TestGrade',
    browseName: 'OreGrade',
    displayName: 'Ore Grade',
    nodeClass: 'Variable',
    dataType: 'Double',
    value: 5.2,
    isFolder: false,
    description: 'Current ore grade being excavated (g/t Au)'
  };

  it('should render empty state when no node selected', () => {
    render(<NodeDetails node={null} />);
    expect(screen.getByText('Select a node to view details')).toBeInTheDocument();
  });

  it('should display node information', () => {
    render(<NodeDetails node={mockNode} />);
    expect(screen.getByText('Ore Grade')).toBeInTheDocument();
    expect(screen.getByText('Variable Node')).toBeInTheDocument();
    expect(screen.getByText('ns=1;s=TestGrade')).toBeInTheDocument();
  });

  it('should display value with unit', () => {
    render(<NodeDetails node={mockNode} />);
    expect(screen.getByText('5.20')).toBeInTheDocument();
    expect(screen.getByText('g/t Au')).toBeInTheDocument();
  });

  it('should show value context for ore grade', () => {
    render(<NodeDetails node={mockNode} />);
    expect(screen.getByText('Medium-grade ore')).toBeInTheDocument();
  });

  it('should show subscribe button for variable nodes', () => {
    render(<NodeDetails node={mockNode} onSubscribe={jest.fn()} />);
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });

  it('should show subscription help when help button is clicked', () => {
    render(<NodeDetails node={mockNode} onSubscribe={jest.fn()} />);
    
    // Click the help button
    const helpButton = screen.getByTitle('How subscriptions work in production');
    fireEvent.click(helpButton);
    
    // Check that help content is visible
    expect(screen.getByText('Real-World OPC UA Subscriptions')).toBeInTheDocument();
    expect(screen.getByText(/Historian Database:/)).toBeInTheDocument();
    expect(screen.getByText(/Real-time Notifications:/)).toBeInTheDocument();
  });

  it('should hide subscription help when close button is clicked', () => {
    render(<NodeDetails node={mockNode} onSubscribe={jest.fn()} />);
    
    // Open help
    const helpButton = screen.getByTitle('How subscriptions work in production');
    fireEvent.click(helpButton);
    expect(screen.getByText('Real-World OPC UA Subscriptions')).toBeInTheDocument();
    
    // Close help
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Real-World OPC UA Subscriptions')).not.toBeInTheDocument();
  });
});
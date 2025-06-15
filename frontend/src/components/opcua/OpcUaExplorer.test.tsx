import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpcUaExplorer from './OpcUaExplorer';
import { OpcUaNode } from '@/types/websocket';

describe('OpcUaExplorer', () => {
  const mockNodes: OpcUaNode[] = [
    {
      nodeId: 'ns=1;s=TestNode',
      browseName: 'TestNode',
      displayName: 'Test Node',
      nodeClass: 'Object',
      isFolder: true,
      children: []
    }
  ];

  it('should render without errors', () => {
    const { container } = render(
      <OpcUaExplorer nodes={[]} />
    );
    expect(container).toBeTruthy();
  });

  it('should display empty state when no nodes', () => {
    render(<OpcUaExplorer nodes={[]} />);
    expect(screen.getByText('No OPC UA nodes available')).toBeInTheDocument();
  });

  it('should render nodes when provided', () => {
    render(<OpcUaExplorer nodes={mockNodes} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should show search input', () => {
    render(<OpcUaExplorer nodes={mockNodes} />);
    expect(screen.getByPlaceholderText('Search nodes...')).toBeInTheDocument();
  });

  it('should show help button', () => {
    render(<OpcUaExplorer nodes={mockNodes} />);
    expect(screen.getByTitle('What is OPC UA?')).toBeInTheDocument();
  });
});
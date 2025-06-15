import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeExamples from './CodeExamples';
import { OpcUaNode } from '@/types/websocket';

describe('CodeExamples', () => {
  const mockNode: OpcUaNode = {
    nodeId: 'ns=1;s=TestVariable',
    browseName: 'TestVariable',
    displayName: 'Test Variable',
    nodeClass: 'Variable',
    dataType: 'Double',
    value: 42,
    isFolder: false
  };

  it('should render empty state when no node selected', () => {
    render(<CodeExamples node={null} />);
    expect(screen.getByText('Select a node to view code examples')).toBeInTheDocument();
  });

  it('should display code examples section', () => {
    render(<CodeExamples node={mockNode} />);
    expect(screen.getByText('Code Examples')).toBeInTheDocument();
  });

  it('should show why this matters section', () => {
    render(<CodeExamples node={mockNode} />);
    expect(screen.getByText('Why this matters:')).toBeInTheDocument();
    expect(screen.getByText(/Real-time monitoring dashboards/)).toBeInTheDocument();
  });

  it('should render language options', () => {
    render(<CodeExamples node={mockNode} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('REST API')).toBeInTheDocument();
  });
});
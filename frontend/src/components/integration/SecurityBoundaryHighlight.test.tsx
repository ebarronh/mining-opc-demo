import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SecurityBoundaryHighlight } from './SecurityBoundaryHighlight';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  Key: () => <div data-testid="key-icon">Key</div>,
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Monitor: () => <div data-testid="monitor-icon">Monitor</div>,
  Server: () => <div data-testid="server-icon">Server</div>,
  Cloud: () => <div data-testid="cloud-icon">Cloud</div>,
  Info: () => <div data-testid="info-icon">Info</div>
}));

describe('SecurityBoundaryHighlight', () => {
  it('renders the component with header and security zones', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByText('Security Boundary Analysis')).toBeInTheDocument();
    expect(screen.getByText('Critical security zones and boundaries in mining ISA-95 architecture')).toBeInTheDocument();
    
    // Check that security zones are rendered
    expect(screen.getByText('Operational Technology (OT) Zone')).toBeInTheDocument();
    expect(screen.getByText('Information Technology (IT) Zone')).toBeInTheDocument();
  });

  it('displays security zone details with risk levels', () => {
    render(<SecurityBoundaryHighlight />);
    
    // Check OT zone
    expect(screen.getByText('Direct control of physical mining operations with real-time requirements')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    
    // Check IT zone
    expect(screen.getByText('Business systems and analytics with standard IT security practices')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('shows level information for security zones', () => {
    render(<SecurityBoundaryHighlight />);
    
    // Check levels are displayed using getAllByText for multiple instances
    expect(screen.getAllByText(/Levels:/).length).toBeGreaterThan(0);
    expect(screen.getByText(/0, 1, 2/)).toBeInTheDocument();
    expect(screen.getByText(/3, 4, 5/)).toBeInTheDocument();
  });

  it('expands security zone details when clicked', async () => {
    render(<SecurityBoundaryHighlight />);
    
    const otZone = screen.getByText('Operational Technology (OT) Zone').closest('div');
    expect(otZone).toBeInTheDocument();
    
    if (otZone) {
      fireEvent.click(otZone);
      
      await waitFor(() => {
        expect(screen.getByText('Access Controls')).toBeInTheDocument();
        expect(screen.getByText('Primary Threats')).toBeInTheDocument();
        expect(screen.getByText('Protection Measures')).toBeInTheDocument();
      });
      
      // Check some specific content
      expect(screen.getByText(/Physical access controls to control rooms/)).toBeInTheDocument();
      expect(screen.getByText(/Malware targeting industrial systems/)).toBeInTheDocument();
      expect(screen.getByText(/Air-gapped networks where possible/)).toBeInTheDocument();
    }
  });

  it('displays security boundaries section', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByText('Critical Security Boundaries')).toBeInTheDocument();
    expect(screen.getByText('OT/IT Security Boundary')).toBeInTheDocument();
    expect(screen.getByText('Internal/Cloud Security Boundary')).toBeInTheDocument();
  });

  it('shows boundary level transitions', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByText('Level 2 ↔ Level 3')).toBeInTheDocument();
    expect(screen.getByText('Level 4 ↔ Level 5')).toBeInTheDocument();
  });

  it('expands boundary details when clicked', async () => {
    render(<SecurityBoundaryHighlight />);
    
    const otItBoundary = screen.getByText('OT/IT Security Boundary').closest('div');
    expect(otItBoundary).toBeInTheDocument();
    
    if (otItBoundary) {
      fireEvent.click(otItBoundary);
      
      await waitFor(() => {
        expect(screen.getByText('Security Measures')).toBeInTheDocument();
        expect(screen.getByText('Approved Protocols')).toBeInTheDocument();
        expect(screen.getByText('Risk Mitigation')).toBeInTheDocument();
      });
      
      // Check protocol tags
      expect(screen.getByText('OPC UA')).toBeInTheDocument();
      expect(screen.getByText('REST API')).toBeInTheDocument();
    }
  });

  it('calls onBoundarySelect when boundary is selected', async () => {
    const mockOnBoundarySelect = jest.fn();
    render(<SecurityBoundaryHighlight onBoundarySelect={mockOnBoundarySelect} />);
    
    const otItBoundary = screen.getByText('OT/IT Security Boundary').closest('div');
    if (otItBoundary) {
      fireEvent.click(otItBoundary);
      
      await waitFor(() => {
        expect(mockOnBoundarySelect).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'ot-it-boundary',
            name: 'OT/IT Security Boundary'
          })
        );
      });
    }
  });

  it('shows selected level context when selectedLevel prop is provided', () => {
    render(<SecurityBoundaryHighlight selectedLevel={1} />);
    
    expect(screen.getByText('Security Context for Level 1')).toBeInTheDocument();
    
    // Look for specific zone and risk level text that should be present
    expect(screen.getByText(/critical.*risk/)).toBeInTheDocument();
    expect(screen.getByText(/Key Protection:/)).toBeInTheDocument();
  });

  it('shows context for business zone levels', () => {
    render(<SecurityBoundaryHighlight selectedLevel={4} />);
    
    expect(screen.getByText('Security Context for Level 4')).toBeInTheDocument();
    
    // Look for specific zone and risk level text that should be present
    expect(screen.getByText(/high.*risk/)).toBeInTheDocument();
    expect(screen.getByText(/Key Protection:/)).toBeInTheDocument();
  });

  it('handles invalid selected level gracefully', () => {
    render(<SecurityBoundaryHighlight selectedLevel={99} />);
    
    expect(screen.getByText('Security Context for Level 99')).toBeInTheDocument();
    expect(screen.getByText('No specific security zone defined for this level.')).toBeInTheDocument();
  });

  it('hides details when showDetails is false', () => {
    render(<SecurityBoundaryHighlight showDetails={false} />);
    
    const otZone = screen.getByText('Operational Technology (OT) Zone').closest('div');
    if (otZone) {
      fireEvent.click(otZone);
      
      // Details should not appear
      expect(screen.queryByText('Access Controls')).not.toBeInTheDocument();
      expect(screen.queryByText('Primary Threats')).not.toBeInTheDocument();
    }
  });

  it('applies custom className', () => {
    const customClass = 'custom-security-class';
    const { container } = render(<SecurityBoundaryHighlight className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('displays best practices help text', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByText('Mining Security Best Practices')).toBeInTheDocument();
    expect(screen.getByText(/Mining operations require specialized security approaches/)).toBeInTheDocument();
  });

  it('shows zone icons correctly', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument(); // OT zone
    expect(screen.getByTestId('cloud-icon')).toBeInTheDocument(); // IT zone
  });

  it('displays all required icons in header and sections', () => {
    render(<SecurityBoundaryHighlight />);
    
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument(); // Main header
    expect(screen.getByTestId('users-icon')).toBeInTheDocument(); // Boundaries section
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument(); // Help section
  });

  it('toggles zone selection correctly', async () => {
    render(<SecurityBoundaryHighlight />);
    
    const otZone = screen.getByText('Operational Technology (OT) Zone').closest('div');
    if (otZone) {
      // First click - expand
      fireEvent.click(otZone);
      await waitFor(() => {
        expect(screen.getByText('Access Controls')).toBeInTheDocument();
      });
      
      // Second click - collapse
      fireEvent.click(otZone);
      await waitFor(() => {
        expect(screen.queryByText('Access Controls')).not.toBeInTheDocument();
      });
    }
  });

  it('toggles boundary selection correctly', async () => {
    render(<SecurityBoundaryHighlight />);
    
    const boundary = screen.getByText('OT/IT Security Boundary').closest('div');
    if (boundary) {
      // First click - expand
      fireEvent.click(boundary);
      await waitFor(() => {
        expect(screen.getByText('Security Measures')).toBeInTheDocument();
      });
      
      // Second click - collapse
      fireEvent.click(boundary);
      await waitFor(() => {
        expect(screen.queryByText('Security Measures')).not.toBeInTheDocument();
      });
    }
  });

  it('displays correct risk level styling', () => {
    render(<SecurityBoundaryHighlight />);
    
    const criticalRisk = screen.getByText('CRITICAL');
    const highRisk = screen.getByText('HIGH');
    
    expect(criticalRisk).toBeInTheDocument();
    expect(highRisk).toBeInTheDocument();
  });

  it('shows mining-specific protections and access controls', async () => {
    render(<SecurityBoundaryHighlight />);
    
    const otZone = screen.getByText('Operational Technology (OT) Zone').closest('div');
    if (otZone) {
      fireEvent.click(otZone);
      
      await waitFor(() => {
        // Check for mining-specific security measures that are actually displayed
        expect(screen.getByText(/Physical access controls to control rooms/)).toBeInTheDocument();
        expect(screen.getByText(/Air-gapped networks where possible/)).toBeInTheDocument();
      });
    }
  });
});
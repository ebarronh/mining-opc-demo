import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the SystemStatus component to avoid API calls
jest.mock('@/components/status/SystemStatus', () => {
  return {
    SystemStatus: () => (
      <div>
        <h3>System Status</h3>
        <div>Frontend: Online</div>
        <div>Backend: Mocked</div>
      </div>
    )
  };
});

// Mock useSystemStatus hook
jest.mock('@/hooks/useSystemStatus', () => ({
  useSystemStatus: () => ({
    status: { healthy: true, version: '1.0.0' },
    loading: false,
    error: null,
    lastUpdate: new Date(),
    refetch: jest.fn()
  })
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders main heading and subtitle', () => {
    render(
      <WebSocketProvider>
        <Home />
      </WebSocketProvider>
    );
    
    // Check for the Mining Demo subtitle which is unique
    expect(screen.getByText('Mining Demo')).toBeInTheDocument();
    
    // Check for key words in the description
    expect(screen.getByText(/Executive-ready/i)).toBeInTheDocument();
  });

  test('renders navigation cards', () => {
    render(
      <WebSocketProvider>
        <Home />
      </WebSocketProvider>
    );
    
    // Use more flexible text matching due to formatting
    expect(screen.getByRole('heading', { name: /Real-time Monitor/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /OPC UA Explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Integration Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Compliance/i })).toBeInTheDocument();
  });

  test('renders system status section', async () => {
    render(
      <WebSocketProvider>
        <Home />
      </WebSocketProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('Frontend: Online')).toBeInTheDocument();
    });
  });
});
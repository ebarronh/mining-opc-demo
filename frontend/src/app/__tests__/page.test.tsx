import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Home Page', () => {
  test('renders main heading', () => {
    render(<Home />);
    
    const heading = screen.getByText('MineSensors OPC UA');
    expect(heading).toBeInTheDocument();
  });

  test('renders navigation cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Real-time Monitor')).toBeInTheDocument();
    expect(screen.getByText('OPC UA Explorer')).toBeInTheDocument();
    expect(screen.getByText('Integration Hub')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
  });

  test('renders system status section', () => {
    render(<Home />);
    
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Frontend: Online')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from './Tooltip';

// Mock React Portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('Tooltip', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders children without showing tooltip initially', () => {
    render(
      <Tooltip content="Test tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    // Should not show immediately
    expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
    
    // Advance timer past delay
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    
    // Show tooltip
    fireEvent.mouseEnter(trigger);
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });
    
    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={100}>
        <button>Focus me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Focus me');
    fireEvent.focus(trigger);
    
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={100}>
        <button>Focus me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Focus me');
    
    // Show tooltip
    fireEvent.focus(trigger);
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });
    
    // Hide tooltip
    fireEvent.blur(trigger);
    
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
    });
  });

  it('does not show tooltip when disabled', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={100} disabled={true}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
  });

  it('renders complex content correctly', async () => {
    const complexContent = (
      <div>
        <h4>Complex Title</h4>
        <p>Complex description</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    );
    
    render(
      <Tooltip content={complexContent} delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Complex Title')).toBeInTheDocument();
      expect(screen.getByText('Complex description')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  it('applies custom className', async () => {
    render(
      <Tooltip content="Test content" delay={100} className="custom-tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await act(async () => {
      jest.advanceTimersByTime(150);
    });
    
    await waitFor(() => {
      const tooltip = screen.getByText('Test content').closest('div');
      expect(tooltip).toHaveClass('custom-tooltip');
    });
  });

  it('handles different placements', async () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    
    for (const placement of placements) {
      const { unmount } = render(
        <Tooltip content={`Test ${placement}`} delay={100} placement={placement}>
          <button>{`Hover ${placement}`}</button>
        </Tooltip>
      );
      
      const trigger = screen.getByText(`Hover ${placement}`);
      fireEvent.mouseEnter(trigger);
      
      await act(async () => {
        jest.advanceTimersByTime(150);
      });
      
      await waitFor(() => {
        expect(screen.getByText(`Test ${placement}`)).toBeInTheDocument();
      });
      
      unmount();
    }
  });

  it('cancels delayed show when mouse leaves quickly', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={500}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    
    // Start showing tooltip
    fireEvent.mouseEnter(trigger);
    
    // Leave before delay completes
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    fireEvent.mouseLeave(trigger);
    
    // Complete the original delay
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    
    // Tooltip should not be shown
    expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
  });
});
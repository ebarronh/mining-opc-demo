import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FollowTheData } from './FollowTheData';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Play: () => <div data-testid="play-icon">Play</div>,
  Pause: () => <div data-testid="pause-icon">Pause</div>,
  RotateCcw: () => <div data-testid="rotate-icon">RotateCcw</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  ArrowDown: () => <div data-testid="arrow-down-icon">ArrowDown</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  AlertCircle: () => <div data-testid="alert-icon">AlertCircle</div>,
  CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>
}));

describe('FollowTheData', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the component with header and controls', () => {
    render(<FollowTheData />);
    
    // Check header
    expect(screen.getByText('Follow the Data')).toBeInTheDocument();
    expect(screen.getByText('Trace a single ore reading through all ISA-95 levels')).toBeInTheDocument();
    
    // Check controls
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    expect(screen.getByTestId('rotate-icon')).toBeInTheDocument();
    
    // Check speed control
    expect(screen.getByText('Speed:')).toBeInTheDocument();
    const speedSelect = screen.getByRole('combobox');
    expect(speedSelect).toHaveValue('1');
  });

  it('displays all ISA-95 levels', () => {
    render(<FollowTheData />);
    
    // Check all 6 levels are displayed
    expect(screen.getByText('Level 0: Field Level')).toBeInTheDocument();
    expect(screen.getByText('Level 1: Control Level')).toBeInTheDocument();
    expect(screen.getByText('Level 2: Supervision Level')).toBeInTheDocument();
    expect(screen.getByText('Level 3: MES Level')).toBeInTheDocument();
    expect(screen.getByText('Level 4: ERP Level')).toBeInTheDocument();
    expect(screen.getByText('Level 5: Business Intelligence')).toBeInTheDocument();
  });

  it('shows level descriptions', () => {
    render(<FollowTheData />);
    
    expect(screen.getByText('Raw sensor reading from XRF analyzer')).toBeInTheDocument();
    expect(screen.getByText('PLC processing with control logic')).toBeInTheDocument();
    expect(screen.getByText('SCADA aggregation and operator display')).toBeInTheDocument();
    expect(screen.getByText('Production planning and quality management')).toBeInTheDocument();
    expect(screen.getByText('Business transaction and financial impact')).toBeInTheDocument();
    expect(screen.getByText('Strategic analysis and predictive modeling')).toBeInTheDocument();
  });

  it('displays processing times for each level', () => {
    render(<FollowTheData />);
    
    expect(screen.getByText('5ms')).toBeInTheDocument();
    expect(screen.getByText('15ms')).toBeInTheDocument();
    expect(screen.getByText('100ms')).toBeInTheDocument();
    expect(screen.getByText('2000ms')).toBeInTheDocument();
    expect(screen.getByText('10000ms')).toBeInTheDocument();
    expect(screen.getByText('30000ms')).toBeInTheDocument();
  });

  it('starts data flow animation when play button is clicked', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    expect(playButton).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // First level should be processing
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    
    // Play button should be disabled
    expect(playButton).toBeDisabled();
  });

  it('pauses animation when pause button is clicked', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    const pauseButton = screen.getByTestId('pause-icon').closest('button');
    
    // Start animation
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Pause animation
    await act(async () => {
      fireEvent.click(pauseButton!);
    });
    
    // Pause button should be disabled after pausing
    expect(pauseButton).toBeDisabled();
  });

  it('resets animation when reset button is clicked', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    const resetButton = screen.getByTestId('rotate-icon').closest('button');
    
    // Start animation
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Reset animation
    await act(async () => {
      fireEvent.click(resetButton!);
    });
    
    // Play button should be enabled again
    expect(playButton).not.toBeDisabled();
  });

  it('changes animation speed when speed control is changed', () => {
    render(<FollowTheData />);
    
    const speedControl = screen.getByRole('combobox');
    
    fireEvent.change(speedControl, { target: { value: '2' } });
    
    expect(speedControl).toHaveValue('2');
  });

  it('toggles details view when details button is clicked', () => {
    render(<FollowTheData />);
    
    const detailsButton = screen.getByText('Details');
    
    // Details should be off initially
    expect(detailsButton).not.toHaveClass('bg-blue-500');
    
    fireEvent.click(detailsButton);
    
    // Details should be on after click
    expect(detailsButton).toHaveClass('bg-blue-500');
  });

  it('shows help text when no animation is running', () => {
    render(<FollowTheData />);
    
    expect(screen.getByText('How to Use')).toBeInTheDocument();
    expect(screen.getByText(/Click the Play button to start tracing/)).toBeInTheDocument();
  });

  it('progresses through levels during animation', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Should start with Level 0 processing
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    
    // Fast forward through first level (5ms)
    await act(async () => {
      jest.advanceTimersByTime(10);
    });
    
    // Should show completion for Level 0 and processing for Level 1
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('shows completion status when animation finishes', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Fast forward through all levels
    await act(async () => {
      jest.advanceTimersByTime(50000);
    });
    
    // Should show summary after animation completes
    await waitFor(() => {
      expect(screen.getByText('Data Journey Summary')).toBeInTheDocument();
    });
    expect(screen.getByText('Total Processing Time:')).toBeInTheDocument();
    expect(screen.getByText('47115ms')).toBeInTheDocument(); // Sum of all processing times
  });

  it('shows arrow indicators between levels', () => {
    render(<FollowTheData />);
    
    // Should show 5 arrows between 6 levels
    const arrows = screen.getAllByTestId('arrow-down-icon');
    expect(arrows).toHaveLength(5);
  });

  it('applies custom className', () => {
    const customClass = 'custom-follow-class';
    const { container } = render(<FollowTheData className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('auto-starts when autoStart prop is true', async () => {
    render(<FollowTheData autoStart={true} />);
    
    // Should automatically start processing
    await waitFor(() => {
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });
  });

  it('calls onDataFlowComplete when animation finishes', async () => {
    const mockCallback = jest.fn();
    render(<FollowTheData onDataFlowComplete={mockCallback} />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Fast forward through all levels
    await act(async () => {
      jest.advanceTimersByTime(50000);
    });
    
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('highlights selected level when selectedLevel prop is provided', () => {
    render(<FollowTheData selectedLevel={2} />);
    
    // Level 2 should be highlighted (check for specific styling)
    const level2Card = screen.getByText('Level 2: Supervision Level').closest('div');
    expect(level2Card).toHaveClass('ring-2', 'ring-white/30', 'shadow-lg');
  });

  it('shows detailed data when details view is enabled and animation runs', async () => {
    render(<FollowTheData />);
    
    // Enable details view
    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    
    // Start animation
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Fast forward to complete first level
    await act(async () => {
      jest.advanceTimersByTime(10);
    });
    
    // Should show transformation details after completion
    await waitFor(() => {
      expect(screen.getByText('Output Data:')).toBeInTheDocument();
    });
    expect(screen.getByText('Processing Details')).toBeInTheDocument();
  });

  it('shows processing status indicators correctly', async () => {
    render(<FollowTheData />);
    
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Should show processing indicator (spinning Zap icon)
    const zapIcon = screen.getByTestId('zap-icon');
    expect(zapIcon.closest('div')).toHaveClass('animate-spin');
    
    // Fast forward to completion
    await act(async () => {
      jest.advanceTimersByTime(10);
    });
    
    // Should show completion indicator
    await waitFor(() => {
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  it('displays correct transformation data for each level', async () => {
    render(<FollowTheData />);
    
    // Enable details view
    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    
    // Start animation
    const playButton = screen.getByTestId('play-icon').closest('button');
    
    await act(async () => {
      fireEvent.click(playButton!);
    });
    
    // Check that transformation descriptions are shown
    await waitFor(() => {
      expect(screen.getByText('Direct sensor output')).toBeInTheDocument();
    });
    
    // Fast forward to next level
    await act(async () => {
      jest.advanceTimersByTime(20);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Quality check, alarm evaluation, control decisions')).toBeInTheDocument();
    });
  });
});
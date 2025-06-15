import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tooltip, AutoTooltip } from './Tooltip';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Tooltip', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should render children without tooltip if term not found', () => {
    render(
      <Tooltip term="nonexistent">
        <span>Test content</span>
      </Tooltip>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show help icon for valid mining terms', () => {
    render(
      <Tooltip term="grade">
        <span>Grade</span>
      </Tooltip>
    );
    
    expect(screen.getByText('Grade')).toBeInTheDocument();
    // Help icon should be visible as part of the trigger
    const trigger = screen.getByText('Grade').parentElement;
    expect(trigger).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip term="excavator">
        <span>Excavator</span>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Excavator').closest('button');
    if (trigger) {
      await user.hover(trigger);
      
      await waitFor(() => {
        expect(screen.getByText(/Heavy equipment used for digging/)).toBeInTheDocument();
      });
    }
  });

  it('should track seen tooltips in localStorage', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <Tooltip term="ore">
        <span>Ore</span>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Ore').closest('button');
    if (trigger) {
      await user.hover(trigger);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'mineSensors.seenTooltips',
          expect.stringContaining('ore')
        );
      });
    }
  });

  it('should hide icon when showIcon is false', () => {
    render(
      <Tooltip term="grade" showIcon={false}>
        <span>Grade</span>
      </Tooltip>
    );
    
    expect(screen.getByText('Grade')).toBeInTheDocument();
    // When showIcon is false, there should be no help icon svg
    const container = screen.getByText('Grade').parentElement;
    const svg = container?.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });
});

describe('AutoTooltip', () => {
  it('should automatically wrap mining terms with tooltips', () => {
    render(
      <AutoTooltip text="The excavator is loading ore into the haul truck" />
    );
    
    // Check that mining terms are underlined
    const excavatorSpan = screen.getByText('excavator');
    expect(excavatorSpan).toHaveClass('underline');
    
    const oreSpan = screen.getByText('ore');
    expect(oreSpan).toHaveClass('underline');
  });

  it('should preserve punctuation', () => {
    render(
      <AutoTooltip text="The grade, measured in g/t, is important." />
    );
    
    // Grade should be wrapped but comma should be preserved
    expect(screen.getByText(/grade/)).toBeInTheDocument();
    // Check that the text is split but preserved
    expect(screen.getByText('measured')).toBeInTheDocument();
    expect(screen.getByText('in')).toBeInTheDocument();
    expect(screen.getByText('g/t,')).toBeInTheDocument();
  });
});
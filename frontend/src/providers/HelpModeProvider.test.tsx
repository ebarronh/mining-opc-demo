import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { HelpModeProvider, HelpModeToggle, useHelpMode } from './HelpModeProvider';

// Test component that uses the hook
function TestComponent() {
  const { isHelpMode, toggleHelpMode } = useHelpMode();
  
  return (
    <div>
      <p>Help mode: {isHelpMode ? 'active' : 'inactive'}</p>
      <button onClick={toggleHelpMode}>Toggle</button>
    </div>
  );
}

describe('HelpModeProvider', () => {
  it('should provide help mode context', () => {
    render(
      <HelpModeProvider>
        <TestComponent />
      </HelpModeProvider>
    );
    
    expect(screen.getByText('Help mode: inactive')).toBeInTheDocument();
  });

  it('should toggle help mode', async () => {
    const user = userEvent.setup();
    
    render(
      <HelpModeProvider>
        <TestComponent />
      </HelpModeProvider>
    );
    
    await user.click(screen.getByText('Toggle'));
    
    await waitFor(() => {
      expect(screen.getByText('Help mode: active')).toBeInTheDocument();
    });
    expect(screen.getByText(/Help Mode Active/)).toBeInTheDocument();
  });

  it('should toggle help mode with keyboard shortcut', async () => {
    const user = userEvent.setup();
    
    render(
      <HelpModeProvider>
        <TestComponent />
      </HelpModeProvider>
    );
    
    await user.keyboard('{Shift>}?{/Shift}');
    
    await waitFor(() => {
      expect(screen.getByText('Help mode: active')).toBeInTheDocument();
    });
  });

  it('should exit help mode with Escape key', async () => {
    const user = userEvent.setup();
    
    render(
      <HelpModeProvider>
        <TestComponent />
      </HelpModeProvider>
    );
    
    // Activate help mode
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByText('Help mode: active')).toBeInTheDocument();
    
    // Exit with Escape
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.getByText('Help mode: inactive')).toBeInTheDocument();
    });
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => render(<TestComponent />)).toThrow(
      'useHelpMode must be used within a HelpModeProvider'
    );
    
    consoleSpy.mockRestore();
  });
});

describe('HelpModeToggle', () => {
  it('should render toggle button', () => {
    render(
      <HelpModeProvider>
        <HelpModeToggle />
      </HelpModeProvider>
    );
    
    const button = screen.getByTitle('Enter Help Mode (Shift + ?)');
    expect(button).toBeInTheDocument();
  });

  it('should toggle help mode when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <HelpModeProvider>
        <HelpModeToggle />
        <TestComponent />
      </HelpModeProvider>
    );
    
    const button = screen.getByTitle('Enter Help Mode (Shift + ?)');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Help mode: active')).toBeInTheDocument();
    });
    expect(button).toHaveAttribute('title', 'Exit Help Mode');
  });
});
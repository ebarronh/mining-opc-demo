import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Glossary } from './Glossary';

describe('Glossary', () => {
  it('should render floating glossary button', () => {
    render(<Glossary />);
    
    const button = screen.getByTitle('Mining Glossary');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fixed bottom-6 right-6');
  });

  it('should open glossary dialog when button clicked', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    const button = screen.getByTitle('Mining Glossary');
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Mining Glossary')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search terms...')).toBeInTheDocument();
    });
  });

  it('should display all categories', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    await waitFor(() => {
      expect(screen.getByText('equipment')).toBeInTheDocument();
      expect(screen.getByText('process')).toBeInTheDocument();
      expect(screen.getByText('measurement')).toBeInTheDocument();
      expect(screen.getByText('safety')).toBeInTheDocument();
      expect(screen.getByText('geology')).toBeInTheDocument();
      expect(screen.getByText('technology')).toBeInTheDocument();
    });
  });

  it('should filter terms by search query', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    const searchInput = screen.getByPlaceholderText('Search terms...');
    await user.type(searchInput, 'excavator');
    
    await waitFor(() => {
      expect(screen.getByText('Excavator')).toBeInTheDocument();
      // Other terms should not be visible
      expect(screen.queryByText('Haul Truck')).not.toBeInTheDocument();
    });
  });

  it('should filter terms by category', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    // Click on equipment category
    const equipmentButton = screen.getByRole('button', { name: /equipment/i });
    await user.click(equipmentButton);
    
    await waitFor(() => {
      // Should show equipment terms
      expect(screen.getByText('Excavator')).toBeInTheDocument();
      expect(screen.getByText('Haul Truck')).toBeInTheDocument();
      // Should not show non-equipment terms
      expect(screen.queryByText('Blasting')).not.toBeInTheDocument();
    });
  });

  it('should show alphabetical navigation', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    await waitFor(() => {
      // Should have letter buttons
      expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'E' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'G' })).toBeInTheDocument();
    });
  });

  it('should expand term details when clicked', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    // Wait for glossary to open and find a term
    await waitFor(() => {
      expect(screen.getByText('Grade')).toBeInTheDocument();
    });
    
    // Click on the Grade term card to expand it
    const gradeCard = screen.getByText('Grade').closest('button');
    if (gradeCard) {
      await user.click(gradeCard);
      
      // Check that details are shown
      await waitFor(() => {
        // Grade has an example, so it should show example text
        expect(screen.getByText(/An ore grade of/)).toBeInTheDocument();
      });
    }
  });

  it('should close dialog when X button clicked', async () => {
    const user = userEvent.setup();
    render(<Glossary />);
    
    await user.click(screen.getByTitle('Mining Glossary'));
    
    await waitFor(() => {
      expect(screen.getByText('Mining Glossary')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Mining Glossary')).not.toBeInTheDocument();
    });
  });
});
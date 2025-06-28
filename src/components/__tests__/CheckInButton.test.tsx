import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInButton } from '../CheckInButton';

describe('CheckInButton', () => {
  it('should render the check in button', () => {
    const mockOnCheckIn = vi.fn();
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);
    
    expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location ID')).toBeInTheDocument();
  });

  it('should be disabled when no location is entered', () => {
    const mockOnCheckIn = vi.fn();
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);
    
    const button = screen.getByRole('button', { name: /check in/i });
    expect(button).toBeDisabled();
  });

  it('should call onCheckIn when clicked with location', async () => {
    const mockOnCheckIn = vi.fn();
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);
    
    const input = screen.getByPlaceholderText('Location ID');
    const button = screen.getByRole('button', { name: /check in/i });
    
    fireEvent.change(input, { target: { value: 'library' } });
    fireEvent.click(button);
    
    expect(mockOnCheckIn).toHaveBeenCalledWith('library');
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnCheckIn = vi.fn();
    render(<CheckInButton onCheckIn={mockOnCheckIn} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Location ID');
    const button = screen.getByRole('button', { name: /check in/i });
    
    fireEvent.change(input, { target: { value: 'library' } });
    
    expect(button).toBeDisabled();
  });
}); 
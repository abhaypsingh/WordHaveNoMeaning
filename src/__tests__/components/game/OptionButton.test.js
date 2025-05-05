import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OptionButton from '../../../components/game/OptionButton';

describe('OptionButton Component', () => {
  // Mock data
  const mockOption = {
    index: 0,
    text: 'A financial institution',
    isCorrect: true
  };

  it('should render with option text', () => {
    // Act
    render(<OptionButton option={mockOption} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('A financial institution');
    expect(button).toHaveClass('option-button');
  });

  it('should call onClick handler with option index when clicked', () => {
    // Arrange
    const handleClick = jest.fn();
    
    // Act
    render(<OptionButton option={mockOption} onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(0); // The option index
  });

  it('should be disabled when disabled prop is true', () => {
    // Act
    render(<OptionButton option={mockOption} disabled />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('option-button--disabled');
  });

  it('should not be disabled when disabled prop is false', () => {
    // Act
    render(<OptionButton option={mockOption} disabled={false} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveClass('option-button--disabled');
  });

  it('should not call onClick handler when disabled', () => {
    // Arrange
    const handleClick = jest.fn();
    
    // Act
    render(<OptionButton option={mockOption} onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply selected class when selected prop is true', () => {
    // Act
    render(<OptionButton option={mockOption} selected />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--selected');
  });

  it('should not apply selected class when selected prop is false', () => {
    // Act
    render(<OptionButton option={mockOption} selected={false} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('option-button--selected');
  });

  it('should apply correct class when showResult is true and option is correct', () => {
    // Arrange
    const correctOption = {
      ...mockOption,
      isCorrect: true
    };
    
    // Act
    render(<OptionButton option={correctOption} showResult />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--correct');
  });

  it('should apply incorrect class when showResult is true and option is incorrect', () => {
    // Arrange
    const incorrectOption = {
      ...mockOption,
      isCorrect: false
    };
    
    // Act
    render(<OptionButton option={incorrectOption} showResult />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--incorrect');
  });

  it('should not apply result classes when showResult is false', () => {
    // Act
    render(<OptionButton option={mockOption} showResult={false} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('option-button--correct');
    expect(button).not.toHaveClass('option-button--incorrect');
  });

  it('should apply custom className', () => {
    // Act
    render(<OptionButton option={mockOption} className="custom-option" />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button');
    expect(button).toHaveClass('custom-option');
  });

  it('should apply animation class when animated prop is true', () => {
    // Act
    render(<OptionButton option={mockOption} animated />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--animated');
  });

  it('should not apply animation class when animated prop is false', () => {
    // Act
    render(<OptionButton option={mockOption} animated={false} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('option-button--animated');
  });

  it('should render with different sizes', () => {
    // Act - Small size
    const { rerender } = render(<OptionButton option={mockOption} size="small" />);
    
    // Assert - Small size
    let button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--small');
    
    // Act - Large size
    rerender(<OptionButton option={mockOption} size="large" />);
    
    // Assert - Large size
    button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--large');
  });

  it('should render with option letter when showLetter prop is true', () => {
    // Act
    render(<OptionButton option={mockOption} showLetter />);
    
    // Assert
    const letterElement = screen.getByText('A.');
    expect(letterElement).toBeInTheDocument();
    expect(letterElement).toHaveClass('option-button__letter');
  });

  it('should not render option letter when showLetter prop is false', () => {
    // Act
    render(<OptionButton option={mockOption} showLetter={false} />);
    
    // Assert
    const letterElement = screen.queryByText('A.');
    expect(letterElement).not.toBeInTheDocument();
  });

  it('should use custom letter format when provided', () => {
    // Arrange
    const letterFormat = (index) => `Option ${index + 1}:`;
    
    // Act
    render(<OptionButton option={mockOption} showLetter letterFormat={letterFormat} />);
    
    // Assert
    const letterElement = screen.getByText('Option 1:');
    expect(letterElement).toBeInTheDocument();
  });

  it('should handle null or undefined option gracefully', () => {
    // Act & Assert - should not throw an error
    expect(() => render(<OptionButton option={null} />)).not.toThrow();
    
    // Check that a placeholder or empty state is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('option-button--empty');
    expect(button).toHaveTextContent('No option available');
  });

  it('should apply contradiction class when option is a contradiction', () => {
    // Arrange
    const contradictionOption = {
      ...mockOption,
      isContradiction: true
    };
    
    // Act
    render(<OptionButton option={contradictionOption} showContradiction />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveClass('option-button--contradiction');
  });

  it('should not apply contradiction class when showContradiction is false', () => {
    // Arrange
    const contradictionOption = {
      ...mockOption,
      isContradiction: true
    };
    
    // Act
    render(<OptionButton option={contradictionOption} showContradiction={false} />);
    
    // Assert
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('option-button--contradiction');
  });
});
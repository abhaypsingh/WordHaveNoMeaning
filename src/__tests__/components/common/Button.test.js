import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/common/Button';

describe('Button Component', () => {
  it('should render with default props', () => {
    // Act
    render(<Button>Click Me</Button>);
    
    // Assert
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button');
    expect(button).not.toHaveClass('button--primary');
    expect(button).not.toHaveClass('button--secondary');
    expect(button).not.toHaveClass('button--disabled');
    expect(button).not.toBeDisabled();
  });

  it('should render with primary variant', () => {
    // Act
    render(<Button variant="primary">Primary Button</Button>);
    
    // Assert
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('button--primary');
  });

  it('should render with secondary variant', () => {
    // Act
    render(<Button variant="secondary">Secondary Button</Button>);
    
    // Assert
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('button--secondary');
  });

  it('should be disabled when disabled prop is true', () => {
    // Act
    render(<Button disabled>Disabled Button</Button>);
    
    // Assert
    const button = screen.getByText('Disabled Button');
    expect(button).toHaveClass('button--disabled');
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    // Act
    render(<Button className="custom-class">Custom Button</Button>);
    
    // Assert
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should call onClick handler when clicked', () => {
    // Arrange
    const handleClick = jest.fn();
    
    // Act
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const button = screen.getByText('Clickable Button');
    fireEvent.click(button);
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    // Arrange
    const handleClick = jest.fn();
    
    // Act
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);
    
    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with fullWidth style when fullWidth prop is true', () => {
    // Act
    render(<Button fullWidth>Full Width Button</Button>);
    
    // Assert
    const button = screen.getByText('Full Width Button');
    expect(button).toHaveClass('button--full-width');
  });

  it('should render with icon when icon prop is provided', () => {
    // Arrange
    const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
    
    // Act
    render(<Button icon={<MockIcon />}>Button with Icon</Button>);
    
    // Assert
    const button = screen.getByText('Button with Icon');
    const icon = screen.getByTestId('mock-icon');
    expect(button).toContainElement(icon);
  });

  it('should apply size classes correctly', () => {
    // Act - Small
    const { rerender } = render(<Button size="small">Small Button</Button>);
    
    // Assert - Small
    let button = screen.getByText('Small Button');
    expect(button).toHaveClass('button--small');
    
    // Act - Large
    rerender(<Button size="large">Large Button</Button>);
    
    // Assert - Large
    button = screen.getByText('Large Button');
    expect(button).toHaveClass('button--large');
  });

  it('should pass additional props to the button element', () => {
    // Act
    render(<Button data-testid="test-button" aria-label="Test Button">Props Button</Button>);
    
    // Assert
    const button = screen.getByText('Props Button');
    expect(button).toHaveAttribute('data-testid', 'test-button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
  });
});
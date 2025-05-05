import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../../../components/common/ProgressBar';

describe('ProgressBar Component', () => {
  it('should render with default props', () => {
    // Act
    render(<ProgressBar value={50} />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    
    // Check the progress fill element
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveStyle('width: 50%');
  });

  it('should render with custom min and max values', () => {
    // Act
    render(<ProgressBar value={5} min={0} max={10} />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '5');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '10');
    
    // Check the progress fill element (5 out of 10 = 50%)
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveStyle('width: 50%');
  });

  it('should handle value less than min', () => {
    // Act
    render(<ProgressBar value={-10} min={0} max={100} />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '-10');
    
    // Check the progress fill element (should be 0%)
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  it('should handle value greater than max', () => {
    // Act
    render(<ProgressBar value={150} min={0} max={100} />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '150');
    
    // Check the progress fill element (should be 100%)
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveStyle('width: 100%');
  });

  it('should apply custom className', () => {
    // Act
    render(<ProgressBar value={50} className="custom-progress" />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('progress-bar');
    expect(progressBar).toHaveClass('custom-progress');
  });

  it('should display label when showLabel is true', () => {
    // Act
    render(<ProgressBar value={75} showLabel />);
    
    // Assert
    const label = screen.getByText('75%');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('progress-bar__label');
  });

  it('should not display label when showLabel is false', () => {
    // Act
    render(<ProgressBar value={75} showLabel={false} />);
    
    // Assert
    const label = screen.queryByText('75%');
    expect(label).not.toBeInTheDocument();
  });

  it('should use custom label format when provided', () => {
    // Arrange
    const labelFormat = (value, min, max) => `${value}/${max} completed`;
    
    // Act
    render(<ProgressBar value={30} min={0} max={100} showLabel labelFormat={labelFormat} />);
    
    // Assert
    const label = screen.getByText('30/100 completed');
    expect(label).toBeInTheDocument();
  });

  it('should apply different color variants', () => {
    // Act - Success variant
    const { rerender } = render(<ProgressBar value={50} variant="success" />);
    
    // Assert - Success variant
    let progressBar = screen.getByRole('progressbar');
    let progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveClass('progress-bar__fill--success');
    
    // Act - Warning variant
    rerender(<ProgressBar value={50} variant="warning" />);
    
    // Assert - Warning variant
    progressBar = screen.getByRole('progressbar');
    progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveClass('progress-bar__fill--warning');
    
    // Act - Danger variant
    rerender(<ProgressBar value={50} variant="danger" />);
    
    // Assert - Danger variant
    progressBar = screen.getByRole('progressbar');
    progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveClass('progress-bar__fill--danger');
  });

  it('should handle different sizes', () => {
    // Act - Small size
    const { rerender } = render(<ProgressBar value={50} size="small" />);
    
    // Assert - Small size
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('progress-bar--small');
    
    // Act - Large size
    rerender(<ProgressBar value={50} size="large" />);
    
    // Assert - Large size
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('progress-bar--large');
  });

  it('should handle animated progress bar', () => {
    // Act
    render(<ProgressBar value={50} animated />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveClass('progress-bar__fill--animated');
  });

  it('should handle striped progress bar', () => {
    // Act
    render(<ProgressBar value={50} striped />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    const progressFill = progressBar.querySelector('.progress-bar__fill');
    expect(progressFill).toHaveClass('progress-bar__fill--striped');
  });
});
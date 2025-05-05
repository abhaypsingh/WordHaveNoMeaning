import React from 'react';
import { render, screen } from '@testing-library/react';
import ContradictionDisplay from '../../../components/game/ContradictionDisplay';

describe('ContradictionDisplay Component', () => {
  // Mock data
  const mockContradictionData = {
    sentence: 'I went to the bank to deposit money.',
    highlightedSentence: 'I went to the <span class="highlight">bank</span> to deposit money.',
    meaning: 'A financial institution',
    explanation: 'In this context, "bank" means "A financial institution" rather than the meaning you selected.'
  };

  it('should render the contradiction sentence', () => {
    // Act
    render(<ContradictionDisplay contradictionData={mockContradictionData} />);
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).toBeInTheDocument();
    
    // The sentence should be rendered with HTML content
    const sentenceElement = container.querySelector('.contradiction-display__sentence');
    expect(sentenceElement).toBeInTheDocument();
    expect(sentenceElement.innerHTML).toContain('<span class="highlight">bank</span>');
  });

  it('should render the meaning', () => {
    // Act
    render(<ContradictionDisplay contradictionData={mockContradictionData} />);
    
    // Assert
    const meaningElement = screen.getByText('A financial institution');
    expect(meaningElement).toBeInTheDocument();
    expect(meaningElement).toHaveClass('contradiction-display__meaning');
  });

  it('should render the explanation', () => {
    // Act
    render(<ContradictionDisplay contradictionData={mockContradictionData} />);
    
    // Assert
    const explanationElement = screen.getByText('In this context, "bank" means "A financial institution" rather than the meaning you selected.');
    expect(explanationElement).toBeInTheDocument();
    expect(explanationElement).toHaveClass('contradiction-display__explanation');
  });

  it('should apply custom className', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        className="custom-contradiction"
      />
    );
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display');
    expect(container).toHaveClass('custom-contradiction');
  });

  it('should render with animation class when animated prop is true', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        animated
      />
    );
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--animated');
  });

  it('should not render with animation class when animated prop is false', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        animated={false}
      />
    );
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).not.toHaveClass('contradiction-display--animated');
  });

  it('should render with title when showTitle prop is true', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        showTitle
      />
    );
    
    // Assert
    const titleElement = screen.getByText('Contradiction Example');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('contradiction-display__title');
  });

  it('should not render title when showTitle prop is false', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        showTitle={false}
      />
    );
    
    // Assert
    const titleElement = screen.queryByText('Contradiction Example');
    expect(titleElement).not.toBeInTheDocument();
  });

  it('should render with custom title when provided', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        showTitle
        title="Different Context"
      />
    );
    
    // Assert
    const titleElement = screen.getByText('Different Context');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('contradiction-display__title');
  });

  it('should handle null or undefined contradictionData gracefully', () => {
    // Act & Assert - should not throw an error
    expect(() => render(<ContradictionDisplay contradictionData={null} />)).not.toThrow();
    
    // Check that a placeholder or empty state is rendered
    const container = screen.getByTestId('contradiction-display');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('contradiction-display--empty');
    
    const placeholderText = screen.getByText('No contradiction data available');
    expect(placeholderText).toBeInTheDocument();
  });

  it('should render with different themes', () => {
    // Act - Light theme
    const { rerender } = render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        theme="light"
      />
    );
    
    // Assert - Light theme
    let container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--light');
    
    // Act - Dark theme
    rerender(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        theme="dark"
      />
    );
    
    // Assert - Dark theme
    container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--dark');
  });

  it('should render with different sizes', () => {
    // Act - Compact size
    const { rerender } = render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        size="compact"
      />
    );
    
    // Assert - Compact size
    let container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--compact');
    
    // Act - Large size
    rerender(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        size="large"
      />
    );
    
    // Assert - Large size
    container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--large');
  });

  it('should render with border when bordered prop is true', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        bordered
      />
    );
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).toHaveClass('contradiction-display--bordered');
  });

  it('should not render with border when bordered prop is false', () => {
    // Act
    render(
      <ContradictionDisplay 
        contradictionData={mockContradictionData} 
        bordered={false}
      />
    );
    
    // Assert
    const container = screen.getByTestId('contradiction-display');
    expect(container).not.toHaveClass('contradiction-display--bordered');
  });
});
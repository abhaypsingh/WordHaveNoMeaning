import React from 'react';
import { render, screen } from '@testing-library/react';
import WordDisplay from '../../../components/game/WordDisplay';

describe('WordDisplay Component', () => {
  // Mock data
  const mockWord = {
    id: 'word1',
    text: 'bank',
    difficulty: 'easy',
    categories: ['noun', 'finance']
  };

  it('should render the word text', () => {
    // Act
    render(<WordDisplay word={mockWord} />);
    
    // Assert
    const wordElement = screen.getByText('bank');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveClass('word-display__text');
  });

  it('should apply the correct difficulty class', () => {
    // Act
    render(<WordDisplay word={mockWord} />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--easy');
  });

  it('should apply different difficulty classes', () => {
    // Arrange
    const mediumWord = { ...mockWord, difficulty: 'medium' };
    const hardWord = { ...mockWord, difficulty: 'hard' };
    
    // Act - Medium difficulty
    const { rerender } = render(<WordDisplay word={mediumWord} />);
    
    // Assert - Medium difficulty
    let container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--medium');
    expect(container).not.toHaveClass('word-display--easy');
    
    // Act - Hard difficulty
    rerender(<WordDisplay word={hardWord} />);
    
    // Assert - Hard difficulty
    container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--hard');
    expect(container).not.toHaveClass('word-display--medium');
  });

  it('should apply highlighted class when highlighted prop is true', () => {
    // Act
    render(<WordDisplay word={mockWord} highlighted />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--highlighted');
  });

  it('should not apply highlighted class when highlighted prop is false', () => {
    // Act
    render(<WordDisplay word={mockWord} highlighted={false} />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).not.toHaveClass('word-display--highlighted');
  });

  it('should apply custom className', () => {
    // Act
    render(<WordDisplay word={mockWord} className="custom-word-display" />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display');
    expect(container).toHaveClass('custom-word-display');
  });

  it('should render with animation class when animated prop is true', () => {
    // Act
    render(<WordDisplay word={mockWord} animated />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--animated');
  });

  it('should not render with animation class when animated prop is false', () => {
    // Act
    render(<WordDisplay word={mockWord} animated={false} />);
    
    // Assert
    const container = screen.getByTestId('word-display');
    expect(container).not.toHaveClass('word-display--animated');
  });

  it('should render with size classes', () => {
    // Act - Large size
    const { rerender } = render(<WordDisplay word={mockWord} size="large" />);
    
    // Assert - Large size
    let container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--large');
    
    // Act - Small size
    rerender(<WordDisplay word={mockWord} size="small" />);
    
    // Assert - Small size
    container = screen.getByTestId('word-display');
    expect(container).toHaveClass('word-display--small');
  });

  it('should render with part of speech when showPartOfSpeech is true', () => {
    // Arrange
    const wordWithPartOfSpeech = {
      ...mockWord,
      partOfSpeech: 'noun'
    };
    
    // Act
    render(<WordDisplay word={wordWithPartOfSpeech} showPartOfSpeech />);
    
    // Assert
    const partOfSpeech = screen.getByText('(noun)');
    expect(partOfSpeech).toBeInTheDocument();
    expect(partOfSpeech).toHaveClass('word-display__part-of-speech');
  });

  it('should not render part of speech when showPartOfSpeech is false', () => {
    // Arrange
    const wordWithPartOfSpeech = {
      ...mockWord,
      partOfSpeech: 'noun'
    };
    
    // Act
    render(<WordDisplay word={wordWithPartOfSpeech} showPartOfSpeech={false} />);
    
    // Assert
    const partOfSpeech = screen.queryByText('(noun)');
    expect(partOfSpeech).not.toBeInTheDocument();
  });

  it('should render with pronunciation when showPronunciation is true', () => {
    // Arrange
    const wordWithPronunciation = {
      ...mockWord,
      pronunciation: '/bæŋk/'
    };
    
    // Act
    render(<WordDisplay word={wordWithPronunciation} showPronunciation />);
    
    // Assert
    const pronunciation = screen.getByText('/bæŋk/');
    expect(pronunciation).toBeInTheDocument();
    expect(pronunciation).toHaveClass('word-display__pronunciation');
  });

  it('should not render pronunciation when showPronunciation is false', () => {
    // Arrange
    const wordWithPronunciation = {
      ...mockWord,
      pronunciation: '/bæŋk/'
    };
    
    // Act
    render(<WordDisplay word={wordWithPronunciation} showPronunciation={false} />);
    
    // Assert
    const pronunciation = screen.queryByText('/bæŋk/');
    expect(pronunciation).not.toBeInTheDocument();
  });

  it('should handle null or undefined word gracefully', () => {
    // Act & Assert - should not throw an error
    expect(() => render(<WordDisplay word={null} />)).not.toThrow();
    
    // Check that a placeholder or empty state is rendered
    const container = screen.getByTestId('word-display');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('word-display--empty');
  });
});
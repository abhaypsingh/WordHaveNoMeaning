import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--spacing-lg) 0;
  animation: ${fadeIn} 0.5s ease;
`;

const Word = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-family-heading);
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Instruction = styled.p`
  font-size: 1.1rem;
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
`;

/**
 * WordDisplay component for showing the current word
 * @param {Object} props - Component props
 * @param {string} props.word - The word to display
 * @param {string} props.instruction - Optional instruction text
 * @returns {JSX.Element} - Rendered component
 */
const WordDisplay = ({ word, instruction }) => {
  return (
    <Container>
      <Word aria-label={`The word is: ${word}`}>{word}</Word>
      {instruction && <Instruction>{instruction}</Instruction>}
    </Container>
  );
};

export default WordDisplay;
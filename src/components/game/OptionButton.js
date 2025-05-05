import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { playOptionSelect } from '../../services/soundService';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.button`
  display: block;
  width: 100%;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius-medium);
  background-color: white;
  border: 2px solid #e0e0e0;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
  animation-delay: ${props => props.index * 0.1}s;
  animation-fill-mode: both;
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.3);
  }
  
  ${props => props.selected && css`
    border-color: var(--color-primary);
    background-color: rgba(74, 111, 165, 0.1);
    animation: ${pulse} 0.3s ease;
  `}
  
  ${props => props.disabled && css`
    cursor: not-allowed;
    opacity: 0.7;
    
    &:hover {
      border-color: #e0e0e0;
      box-shadow: none;
    }
  `}
  
  ${props => props.correct && css`
    border-color: var(--color-success);
    background-color: rgba(76, 175, 80, 0.1);
    
    &::after {
      content: '✓';
      position: absolute;
      right: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-success);
      font-weight: bold;
    }
  `}
  
  ${props => props.incorrect && css`
    border-color: var(--color-error);
    background-color: rgba(214, 64, 69, 0.1);
    
    &::after {
      content: '✗';
      position: absolute;
      right: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-error);
      font-weight: bold;
    }
  `}
`;

const OptionText = styled.div`
  font-size: 1rem;
  color: var(--color-text);
  padding-right: var(--spacing-lg);
`;

/**
 * OptionButton component for selecting word meanings
 * @param {Object} props - Component props
 * @param {string} props.text - The option text
 * @param {number} props.index - The option index (for animation delay)
 * @param {boolean} props.selected - Whether the option is selected
 * @param {boolean} props.disabled - Whether the option is disabled
 * @param {boolean} props.correct - Whether the option is marked as correct
 * @param {boolean} props.incorrect - Whether the option is marked as incorrect
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} - Rendered component
 */
const OptionButton = ({ 
  text, 
  index = 0, 
  selected = false, 
  disabled = false, 
  correct = false, 
  incorrect = false, 
  onClick 
}) => {
  const handleClick = () => {
  
    if (!disabled && !selected) {
      
      playOptionSelect();
      if (onClick) {
        onClick();
      }
    } 
  };

  
  return (
    <Container
      index={index}
      selected={selected}
      disabled={disabled}
      correct={correct}
      incorrect={incorrect}
      onClick={handleClick}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      <OptionText>{text}</OptionText>
    </Container>
  );
};

export default OptionButton;
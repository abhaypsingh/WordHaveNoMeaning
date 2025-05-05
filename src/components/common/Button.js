import React from 'react';
import styled, { css } from 'styled-components';
import { playButtonClick } from '../../services/soundService';

// Button types
const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

// Button sizes
const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Styled button component
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  font-weight: 500;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
  border: none;
  margin: var(--spacing-xs);
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Button types */
  ${props => props.buttonType === BUTTON_TYPES.PRIMARY && css`
    background-color: var(--color-primary);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-secondary);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
      box-shadow: none;
    }
  `}
  
  ${props => props.buttonType === BUTTON_TYPES.SECONDARY && css`
    background-color: var(--color-secondary);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
      box-shadow: none;
    }
  `}
  
  ${props => props.buttonType === BUTTON_TYPES.TERTIARY && css`
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    
    &:hover:not(:disabled) {
      background-color: rgba(74, 111, 165, 0.1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      box-shadow: none;
    }
  `}
  
  /* Button sizes */
  ${props => props.buttonSize === BUTTON_SIZES.SMALL && css`
    font-size: var(--font-size-small);
    padding: var(--spacing-xs) var(--spacing-sm);
    height: 32px;
  `}
  
  ${props => props.buttonSize === BUTTON_SIZES.MEDIUM && css`
    font-size: var(--font-size-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    height: 40px;
  `}
  
  ${props => props.buttonSize === BUTTON_SIZES.LARGE && css`
    font-size: var(--font-size-large);
    padding: var(--spacing-md) var(--spacing-lg);
    height: 48px;
  `}
  
  /* Full width option */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

/**
 * Button component
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.type - Button type (primary, secondary, tertiary)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.ariaLabel - Accessibility label
 * @param {React.ReactNode} props.children - Button content (alternative to text)
 * @returns {JSX.Element} - Rendered component
 */
const Button = ({
  text,
  type = BUTTON_TYPES.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  onClick,
  disabled = false,
  fullWidth = false,
  ariaLabel,
  children,
  ...rest
}) => {
  const handleClick = (e) => {
    console.log("Button handleClick called, disabled:", disabled);
    if (!disabled) {
      console.log("Button not disabled, playing sound and calling onClick");
      playButtonClick();
      if (onClick) {
        onClick(e);
      }
    } else {
      console.log("Button is disabled, not calling onClick");
    }
  };
  
  return (
    <StyledButton
      buttonType={type}
      buttonSize={size}
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      aria-label={ariaLabel || text}
      {...rest}
    >
      {children || text}
    </StyledButton>
  );
};

// Export button types and sizes for use in other components
export { BUTTON_TYPES, BUTTON_SIZES };

export default Button;
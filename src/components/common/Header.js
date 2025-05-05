import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { playButtonClick } from '../../services/soundService';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
  flex-grow: 1;
  text-align: center;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

/**
 * Header component for the application
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display in the header
 * @param {boolean} props.showBackButton - Whether to show the back button
 * @param {boolean} props.showSettings - Whether to show the settings button
 * @param {Function} props.onSettingsClick - Function to call when settings button is clicked
 * @returns {JSX.Element} - Rendered component
 */
const Header = ({ title, showBackButton = false, showSettings = false, onSettingsClick }) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    playButtonClick();
    navigate(-1);
  };
  
  const handleSettingsClick = () => {
    playButtonClick();
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/settings');
    }
  };
  
  return (
    <HeaderContainer>
      {showBackButton ? (
        <BackButton 
          onClick={handleBackClick}
          aria-label="Go back"
        >
          ←
        </BackButton>
      ) : (
        <div style={{ width: '24px' }} /> // Placeholder for spacing
      )}
      
      <Title>{title}</Title>
      
      {showSettings ? (
        <SettingsButton 
          onClick={handleSettingsClick}
          aria-label="Settings"
        >
          ⚙️
        </SettingsButton>
      ) : (
        <div style={{ width: '24px' }} /> // Placeholder for spacing
      )}
    </HeaderContainer>
  );
};

export default Header;
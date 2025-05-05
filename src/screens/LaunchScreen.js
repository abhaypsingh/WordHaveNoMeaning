import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button, { BUTTON_TYPES } from '../components/common/Button';
import { initSoundService, playButtonClick } from '../services/soundService';
import { selectSoundEnabled } from '../store/slices/userSlice';

const LaunchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-lg);
  text-align: center;
  background-color: var(--color-background);
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  font-family: var(--font-family-heading);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  color: var(--color-secondary);
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 300px;
`;

/**
 * Launch screen component
 * @returns {JSX.Element} - Rendered component
 */
const LaunchScreen = () => {
  const navigate = useNavigate();
  const _dispatch = useDispatch();
  const soundEnabled = useSelector(selectSoundEnabled);
  
  // Initialize sound service
  useEffect(() => {
    initSoundService(soundEnabled);
  }, [soundEnabled]);
  
  const handleStartGame = () => {
    playButtonClick();
    navigate('/setup');
  };
  
  const handleHowToPlay = () => {
    playButtonClick();
    navigate('/how-to-play');
  };
  
  const handleSettings = () => {
    playButtonClick();
    navigate('/settings');
  };
  
  const handleAbout = () => {
    playButtonClick();
    navigate('/about');
  };
  
  return (
    <LaunchContainer>
      <Logo>🔤</Logo>
      <Title>Words Without Meaning</Title>
      <Subtitle>
        Discover how context shapes language in this educational word game
      </Subtitle>
      
      <ButtonContainer>
        <Button 
          text="Start Game" 
          type={BUTTON_TYPES.PRIMARY} 
          onClick={handleStartGame}
          fullWidth
        />
        
        <Button 
          text="How to Play" 
          type={BUTTON_TYPES.SECONDARY} 
          onClick={handleHowToPlay}
          fullWidth
        />
        
        <Button 
          text="Settings" 
          type={BUTTON_TYPES.SECONDARY} 
          onClick={handleSettings}
          fullWidth
        />
        
        <Button 
          text="About" 
          type={BUTTON_TYPES.TERTIARY} 
          onClick={handleAbout}
          fullWidth
        />
      </ButtonContainer>
    </LaunchContainer>
  );
};

export default LaunchScreen;
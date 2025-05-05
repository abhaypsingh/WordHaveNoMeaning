import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button, { BUTTON_TYPES } from '../components/common/Button';
import { initializeGame } from '../store/slices/gameSlice';
import { selectUserSettings } from '../store/slices/userSlice';
import { playButtonClick } from '../services/soundService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
`;

const Content = styled.div`
  flex: 1;
  padding: var(--spacing-md);
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--color-primary);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
`;

const SettingsSummary = styled.div`
  background-color: white;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-lg);
  width: 100%;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-weight: 500;
`;

const SettingValue = styled.span`
  color: var(--color-primary);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 300px;
`;

/**
 * Game setup screen component
 * @returns {JSX.Element} - Rendered component
 */
const GameSetupScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSettings = useSelector(selectUserSettings);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartGame = async () => {
    playButtonClick();
    setIsLoading(true);
    
    try {
      // Create game settings from user preferences
      const gameSettings = {
        difficulty: userSettings.defaultDifficulty,
        roundCount: userSettings.defaultRoundCount,
        timeLimit: userSettings.defaultTimeLimit,
        soundEnabled: userSettings.soundEnabled
      };
      
      // Initialize game
      await dispatch(initializeGame(gameSettings)).unwrap();
      
      // Navigate to gameplay screen
      navigate('/play');
    } catch (error) {
      console.error('Error starting game:', error);
      setIsLoading(false);
      // Could show an error message here
    }
  };
  
  const handleChangeSettings = () => {
    playButtonClick();
    navigate('/settings');
  };
  
  // Format time limit display
  const formatTimeLimit = (seconds) => {
    if (seconds === 0) {
      return 'No Limit';
    }
    return `${seconds} seconds`;
  };
  
  // Format difficulty with capitalized first letter
  const formatDifficulty = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };
  
  return (
    <Container>
      <Header title="Game Setup" showBackButton />
      
      <Content>
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Preparing your game...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            <SettingsSummary>
              <SettingItem>
                <SettingLabel>Difficulty:</SettingLabel>
                <SettingValue>{formatDifficulty(userSettings.defaultDifficulty)}</SettingValue>
              </SettingItem>
              <SettingItem>
                <SettingLabel>Rounds:</SettingLabel>
                <SettingValue>{userSettings.defaultRoundCount}</SettingValue>
              </SettingItem>
              <SettingItem>
                <SettingLabel>Time Limit:</SettingLabel>
                <SettingValue>{formatTimeLimit(userSettings.defaultTimeLimit)}</SettingValue>
              </SettingItem>
              <SettingItem>
                <SettingLabel>Sound:</SettingLabel>
                <SettingValue>{userSettings.soundEnabled ? 'On' : 'Off'}</SettingValue>
              </SettingItem>
            </SettingsSummary>
            
            <ButtonContainer>
              <Button 
                text="Change Settings" 
                type={BUTTON_TYPES.SECONDARY} 
                onClick={handleChangeSettings}
                fullWidth
              />
              
              <Button 
                text="Start Game" 
                type={BUTTON_TYPES.PRIMARY} 
                onClick={handleStartGame}
                fullWidth
              />
            </ButtonContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default GameSetupScreen;
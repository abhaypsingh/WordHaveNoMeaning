import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import WordDisplay from '../components/game/WordDisplay';
import OptionButton from '../components/game/OptionButton';
import TimerDisplay from '../components/game/TimerDisplay';
import ContradictionDisplay from '../components/game/ContradictionDisplay';
import {
  selectGameSession,
  selectCurrentRound,
  startNextRound,
  processUserSelection,
  completeGame,
  restoreSession,
  clearRoundSelection
} from '../store/slices/gameSlice';
import { fetchEducationalMessage } from '../store/slices/educationalSlice';
import { selectCurrentMessage } from '../store/slices/educationalSlice';
import {
  _playOptionSelect,
  playCorrectAnswer,
  playIncorrectAnswer,
  playContradictionReveal,
  playRoundComplete
} from '../services/soundService';
import { getContradictionSentence } from '../services/gameService';
import { saveCurrentGame, recoverGameSession } from '../services/storageService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
`;

const Content = styled.div`
  flex: 1;
  padding: var(--spacing-md);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
`;

const OptionsContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
`;

/**
 * GameplayScreen component for the main gameplay experience
 * @returns {JSX.Element} - Rendered component
 */
const GameplayScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameSession = useSelector(selectGameSession);
  const currentRound = useSelector(selectCurrentRound);
  const educationalMessage = useSelector(selectCurrentMessage);
  
  // Local state
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showContradiction, setShowContradiction] = useState(false);
  const [contradictionData, setContradictionData] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  

  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Check if game session exists and handle recovery
  useEffect(() => {
    if (!gameSession) {
      // Try to recover game session
      const recoveredSession = recoverGameSession();
      if (recoveredSession) {
        // If we recovered a session, dispatch an action to restore it
        dispatch(restoreSession(recoveredSession));
      } else {
        navigate('/setup');
      }
    } else if (gameSession.completed) {
      navigate('/results');
    } else if (gameSession.currentRound === 0) {
      // Start first round
      dispatch(startNextRound());
    } else {
      // Ensure the current round's selection is cleared when the component mounts
      // This helps fix the issue where options might be disabled initially
      dispatch(clearRoundSelection());
    }
    
    // Save game session on unmount
    return () => {
      isMounted.current = false;
      if (gameSession && !gameSession.completed) {
        saveCurrentGame(gameSession);
      }
    };
  }, [gameSession, navigate, dispatch]);
  
  // Ensure local state is synchronized with Redux state
  useEffect(() => {
    if (currentRound) {
      // Reset selectedOption when the round changes or if it's a new round
      if (!currentRound.completed) {
        setSelectedOption(null);
        setShowContradiction(false);
        setContradictionData(null);
      }
    }
  }, [currentRound]);
  
  // Periodically save game state during gameplay
  useEffect(() => {
    if (!gameSession) return;
    
    const saveInterval = setInterval(() => {
      if (gameSession && !gameSession.completed) {
        saveCurrentGame(gameSession);
      }
    }, 10000); // Save every 10 seconds
    
    return () => clearInterval(saveInterval);
  }, [gameSession]);
  
  // Set up timer when round changes
  useEffect(() => {
    if (currentRound && !currentRound.completed && gameSession?.settings?.timeLimit > 0) {
      setTimeRemaining(gameSession.settings.timeLimit);
      
      // Clear any existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Start new timer
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentRound, gameSession?.settings?.timeLimit]);
  
  // Handle timer expiration
  useEffect(() => {
    if (timeRemaining <= 0 && currentRound && !currentRound.completed && !selectedOption) {
      // Time expired, select a random option
      const randomIndex = Math.floor(Math.random() * currentRound.options.length);
      handleOptionSelect(randomIndex);
    }
  }, [timeRemaining, currentRound, selectedOption,useEffect]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval,useEffect]);
  
  // Handle option selection
  const handleOptionSelect = useCallback((optionIndex) => {
    
    
    if (currentRound && !currentRound.completed && selectedOption === null) {
      
      
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
      
      }
      
      // Set selected option
      setSelectedOption(optionIndex);
     
      
      // Process selection
      const timeSpent = gameSession.settings.timeLimit > 0
        ? gameSession.settings.timeLimit - timeRemaining
        : 0;
      
      
      dispatch(processUserSelection({ optionIndex, timeSpent }));
      
      // Play sound based on correctness
      const selectedOptionData = currentRound.options[optionIndex];
      if (selectedOptionData.isCorrect) {
        
        playCorrectAnswer();
      } else {
        
        playIncorrectAnswer();
      }
      
      // Show contradiction after a delay
      
      setTimeout(async () => {
        try {
         
          // Get contradiction data
          let data;
          try {
            data = await getContradictionSentence(gameSession);
         
          } catch (error) {
            console.error('Error getting contradiction data, using fallback:', error);
            // Create fallback data if getContradictionSentence fails
            data = {
              sentence: `This is an example where "${currentRound.word.text}" has a different meaning.`,
              highlightedSentence: `This is an example where "<span class="highlight">${currentRound.word.text}</span>" has a different meaning.`,
              meaning: currentRound.correctMeaning?.definition || "a different meaning",
              explanation: `In this context, "${currentRound.word.text}" means something different than the meaning you selected.`
            };
          }
          
          setContradictionData(data);
          
          // Get educational message
          
          try {
            dispatch(fetchEducationalMessage({
              word: currentRound.word,
              selectedMeaning: currentRound.options[optionIndex],
              contradictionMeaning: currentRound.correctMeaning
            }));
          } catch (error) {
            console.error('Error fetching educational message:', error);
          }
          
          // Show contradiction
          
          setShowContradiction(true);
          playContradictionReveal();
        } catch (error) {
          console.error('Error showing contradiction:', error);
          // Even if there's an error, still show the contradiction phase with a fallback message
          setContradictionData({
            sentence: "Error loading contradiction example.",
            highlightedSentence: "Error loading contradiction example.",
            meaning: "different meaning",
            explanation: "There was an error loading the contradiction example."
          });
          setShowContradiction(true);
        }
      }, 1000);
    } 
  }, [currentRound, selectedOption, gameSession, timeRemaining, timerInterval, dispatch]);
  
  // Handle next word button
  const handleNextWord = useCallback(() => {
   
    
    // Reset state
    setSelectedOption(null);
    setShowContradiction(false);
    setContradictionData(null);
    
    // Play sound
    playRoundComplete();
    
    // Check if this was the last round
    if (gameSession.currentRound >= gameSession.totalRounds) {
      
      // Complete game
      dispatch(completeGame());
      navigate('/results');
    } else {
      
      // Start next round
      dispatch(startNextRound());
    }
  }, [gameSession, dispatch, navigate]);
  
  // Handle pause/exit
  const handlePause = () => {
    // Implement pause functionality if needed
    // For now, just navigate back to setup
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    navigate('/setup');
  };
  
  // If no game session or current round, show loading
  if (!gameSession || !currentRound) {
    return (
      <Container>
        <Header title="Loading..." showBackButton />
        <Content>
          <div
            style={{ textAlign: 'center', marginTop: '2rem' }}
            role="status"
            aria-live="polite"
          >
            Loading game...
          </div>
        </Content>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header 
        title={`Round ${currentRound.roundNumber}/${gameSession.totalRounds}`} 
        showBackButton 
        onBackClick={handlePause}
      />
      
      <Content>
        <ProgressBar 
          current={currentRound.roundNumber} 
          total={gameSession.totalRounds} 
        />
        
        <ScoreDisplay>
          Score: {gameSession.score}
        </ScoreDisplay>
        
        <div role="region" aria-live="polite">
          {!showContradiction ? (
            // Word presentation phase
            <>
              <WordDisplay
                word={currentRound.word.text}
                instruction="Select the meaning of this word:"
              />
              
              {gameSession.settings.timeLimit > 0 && (
                <TimerDisplay
                  timeRemaining={timeRemaining}
                  timeLimit={gameSession.settings.timeLimit}
                  onTimeExpired={() => {
                    if (selectedOption === null && !currentRound.completed) {
                      const randomIndex = Math.floor(Math.random() * currentRound.options.length);
                      handleOptionSelect(randomIndex);
                    }
                  }}
                />
              )}
              
              <OptionsContainer role="radiogroup" aria-label="Word meaning options">
                {currentRound.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    text={option.text}
                    index={index}
                    selected={selectedOption === index}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionSelect(index)}
                    aria-checked={selectedOption === index}
                    role="radio"
                  />
                ))}
              </OptionsContainer>
            </>
          ) : (
            // Contradiction phase
            <>
              <WordDisplay word={currentRound.word.text} />
              
              <ContradictionDisplay
                contradictionData={contradictionData}
                selectedMeaning={selectedOption !== null && currentRound.options[selectedOption]
                  ? currentRound.options[selectedOption].text
                  : "selected meaning"}
                educationalMessage={educationalMessage?.text}
              />
              
              <ButtonContainer>
                <Button
                  text="Next Word"
                  onClick={() => {
                    
                    handleNextWord();
                  }}
                />
              </ButtonContainer>
            </>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default GameplayScreen;
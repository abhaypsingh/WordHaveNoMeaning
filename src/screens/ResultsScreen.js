import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button, { BUTTON_TYPES } from '../components/common/Button';
import { selectGameSession, resetGame } from '../store/slices/gameSlice';
import { fetchGameTakeaways } from '../store/slices/educationalSlice';
import { selectTakeaways } from '../store/slices/educationalSlice';
import { recordGamePlayed } from '../store/slices/userSlice';
import { playGameComplete } from '../services/soundService';

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

const ResultsCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-lg);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  text-align: center;
  font-family: var(--font-family-heading);
`;

const ScoreDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
`;

const PerformanceText = styled.p`
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-secondary);
`;

const Section = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
`;

const StatisticsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: rgba(74, 111, 165, 0.05);
  border-radius: var(--border-radius-small);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
`;

const TakeawaysSection = styled.div`
  background-color: rgba(243, 146, 55, 0.05);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  border-left: 4px solid var(--color-accent);
`;

const TakeawayItem = styled.div`
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-md);
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--color-accent);
  }
`;

const SuggestionText = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin: var(--spacing-lg) 0;
  font-style: italic;
  color: var(--color-secondary);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 300px;
  margin: 0 auto;
`;

/**
 * ResultsScreen component for showing game results
 * @returns {JSX.Element} - Rendered component
 */
const ResultsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gameSession = useSelector(selectGameSession);
  const takeaways = useSelector(selectTakeaways);
  const [gameResults, setGameResults] = useState(null);
  
  // Check if game session exists
  useEffect(() => {
    if (!gameSession || !gameSession.completed) {
      navigate('/setup');
      return;
    }
    
    // Play game complete sound
    playGameComplete();
    
    // Calculate results
    const correctAnswers = gameSession.rounds.filter(round => {
      if (round.selectedOption === null) return false;
      return round.options[round.selectedOption].isCorrect;
    }).length;
    
    const totalRounds = gameSession.totalRounds;
    const accuracyRate = (correctAnswers / totalRounds) * 100;
    
    // Generate performance feedback
    let performance = '';
    if (accuracyRate >= 90) {
      performance = "Excellent! You have a strong understanding of how context affects meaning.";
    } else if (accuracyRate >= 70) {
      performance = "Good job! You're developing a solid grasp of contextual meaning.";
    } else if (accuracyRate >= 50) {
      performance = "Nice effort! This game highlights how tricky language can be without context.";
    } else {
      performance = "Great start! This game demonstrates why context is so crucial for understanding language.";
    }
    
    // Generate next difficulty suggestion
    let suggestion = '';
    const difficulty = gameSession.settings.difficulty;
    
    if (difficulty === 'easy' && accuracyRate >= 80) {
      suggestion = "You did great! Try Medium difficulty next for more challenging words.";
    } else if (difficulty === 'medium' && accuracyRate >= 80) {
      suggestion = "Excellent work! Challenge yourself with Hard difficulty next time.";
    } else if (difficulty === 'hard' && accuracyRate >= 70) {
      suggestion = "Outstanding! You've mastered even the most challenging words.";
    } else if (accuracyRate < 40) {
      suggestion = "Language is tricky! Try an easier difficulty to build your confidence.";
    } else {
      suggestion = "Play again to discover more words and their contextual meanings!";
    }
    
    // Set results
    setGameResults({
      score: gameSession.score,
      correctAnswers,
      totalRounds,
      accuracyRate,
      performance,
      suggestion,
      difficulty: gameSession.settings.difficulty
    });
    
    // Fetch educational takeaways
    dispatch(fetchGameTakeaways(gameSession.encounteredConcepts));
    
    // Record game played for user statistics
    dispatch(recordGamePlayed({
      score: gameSession.score,
      difficulty: gameSession.settings.difficulty,
      wordsEncountered: gameSession.rounds.map(round => round.word.text),
      conceptsLearned: gameSession.encounteredConcepts
    }));
  }, [gameSession, navigate, dispatch]);
  
  const handlePlayAgain = () => {
    dispatch(resetGame());
    navigate('/setup');
  };
  
  const handleMainMenu = () => {
    dispatch(resetGame());
    navigate('/');
  };
  
  // If no game results, show loading
  if (!gameResults) {
    return (
      <Container>
        <Header title="Results" />
        <Content>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            Loading results...
          </div>
        </Content>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header title="Game Results" />
      
      <Content>
        <ResultsCard>
          <Title>Your Results</Title>
          
          <ScoreDisplay>{gameResults.score}</ScoreDisplay>
          
          <PerformanceText>{gameResults.performance}</PerformanceText>
          
          <StatisticsSection>
            <StatItem>
              <StatLabel>Difficulty</StatLabel>
              <StatValue>
                {gameResults.difficulty.charAt(0).toUpperCase() + gameResults.difficulty.slice(1)}
              </StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>Rounds Played</StatLabel>
              <StatValue>{gameResults.totalRounds}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>Correct Answers</StatLabel>
              <StatValue>{gameResults.correctAnswers}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>Accuracy</StatLabel>
              <StatValue>{Math.round(gameResults.accuracyRate)}%</StatValue>
            </StatItem>
          </StatisticsSection>
        </ResultsCard>
        
        <Section>
        <SectionTitle>{"What You've Learned"}</SectionTitle>
          <TakeawaysSection>
            {takeaways && takeaways.length > 0 ? (
              takeaways.map((takeaway, index) => (
                <TakeawayItem key={index}>{takeaway}</TakeawayItem>
              ))
            ) : (
              <TakeawayItem>
              Words have no inherent meaning without context. The same word can have completely 
              different meanings depending on how it&apos;s used.
            </TakeawayItem>
            )}
          </TakeawaysSection>
        </Section>
        
        <SuggestionText>{gameResults.suggestion}</SuggestionText>
        
        <ButtonContainer>
          <Button 
            text="Play Again" 
            type={BUTTON_TYPES.PRIMARY} 
            onClick={handlePlayAgain}
            fullWidth
          />
          
          <Button 
            text="Main Menu" 
            type={BUTTON_TYPES.SECONDARY} 
            onClick={handleMainMenu}
            fullWidth
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default ResultsScreen;
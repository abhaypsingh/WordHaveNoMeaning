import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button, { BUTTON_TYPES } from '../components/common/Button';
import { updateSettings, updateAccessibilitySettings, selectUserSettings, selectAccessibilitySettings } from '../store/slices/userSlice';
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const Section = styled.section`
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-small);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  input {
    margin-right: var(--spacing-sm);
  }
`;

const ToggleOption = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-small);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.checked ? 'var(--color-primary)' : '#ccc'};
  border-radius: 12px;
  transition: background-color 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-lg);
`;

/**
 * Settings screen component
 * @returns {JSX.Element} - Rendered component
 */
const SettingsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSettings = useSelector(selectUserSettings);
  const accessibilitySettings = useSelector(selectAccessibilitySettings);
  
  // Local state for form values
  const [difficulty, setDifficulty] = useState(userSettings.defaultDifficulty);
  const [roundCount, setRoundCount] = useState(userSettings.defaultRoundCount);
  const [timeLimit, setTimeLimit] = useState(userSettings.defaultTimeLimit);
  const [soundEnabled, setSoundEnabled] = useState(userSettings.soundEnabled);
  const [theme, _setTheme] = useState(userSettings.theme);
  const [highContrast, setHighContrast] = useState(accessibilitySettings.highContrast);
  const [largeText, setLargeText] = useState(accessibilitySettings.largeText);
  const [reducedMotion, setReducedMotion] = useState(accessibilitySettings.reducedMotion);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(accessibilitySettings.screenReaderOptimized);
  
  const handleSave = (e) => {
    e.preventDefault();
    playButtonClick();
    
    // Update user settings
    dispatch(updateSettings({
      defaultDifficulty: difficulty,
      defaultRoundCount: roundCount,
      defaultTimeLimit: timeLimit,
      soundEnabled,
      theme
    }));
    
    // Update accessibility settings
    dispatch(updateAccessibilitySettings({
      highContrast,
      largeText,
      reducedMotion,
      screenReaderOptimized
    }));
    
    // Navigate back
    navigate(-1);
  };
  
  const handleCancel = () => {
    playButtonClick();
    navigate(-1);
  };
  
  return (
    <Container>
      <Header title="Settings" showBackButton />
      
      <Content>
        <Form onSubmit={handleSave}>
          <Section>
            <SectionTitle>Difficulty</SectionTitle>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={difficulty === 'easy'}
                  onChange={() => setDifficulty('easy')}
                />
                Easy
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={difficulty === 'medium'}
                  onChange={() => setDifficulty('medium')}
                />
                Medium
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={difficulty === 'hard'}
                  onChange={() => setDifficulty('hard')}
                />
                Hard
              </RadioOption>
            </RadioGroup>
          </Section>
          
          <Section>
            <SectionTitle>Rounds per Game</SectionTitle>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="roundCount"
                  value="5"
                  checked={roundCount === 5}
                  onChange={() => setRoundCount(5)}
                />
                5 Rounds
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="roundCount"
                  value="10"
                  checked={roundCount === 10}
                  onChange={() => setRoundCount(10)}
                />
                10 Rounds
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="roundCount"
                  value="15"
                  checked={roundCount === 15}
                  onChange={() => setRoundCount(15)}
                />
                15 Rounds
              </RadioOption>
            </RadioGroup>
          </Section>
          
          <Section>
            <SectionTitle>Time Limit per Word</SectionTitle>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="timeLimit"
                  value="15"
                  checked={timeLimit === 15}
                  onChange={() => setTimeLimit(15)}
                />
                15 Seconds
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="timeLimit"
                  value="30"
                  checked={timeLimit === 30}
                  onChange={() => setTimeLimit(30)}
                />
                30 Seconds
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="timeLimit"
                  value="45"
                  checked={timeLimit === 45}
                  onChange={() => setTimeLimit(45)}
                />
                45 Seconds
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="timeLimit"
                  value="0"
                  checked={timeLimit === 0}
                  onChange={() => setTimeLimit(0)}
                />
                No Limit
              </RadioOption>
            </RadioGroup>
          </Section>
          
          <Section>
            <SectionTitle>Sound</SectionTitle>
            <ToggleOption>
              <span>Sound Effects</span>
              <ToggleSwitch 
                checked={soundEnabled}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                  style={{ opacity: 0, position: 'absolute' }}
                />
              </ToggleSwitch>
            </ToggleOption>
          </Section>
          
          <Section>
            <SectionTitle>Accessibility</SectionTitle>
            <ToggleOption>
              <span>High Contrast</span>
              <ToggleSwitch 
                checked={highContrast}
                onClick={() => setHighContrast(!highContrast)}
              >
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={() => setHighContrast(!highContrast)}
                  style={{ opacity: 0, position: 'absolute' }}
                />
              </ToggleSwitch>
            </ToggleOption>
            
            <ToggleOption>
              <span>Large Text</span>
              <ToggleSwitch 
                checked={largeText}
                onClick={() => setLargeText(!largeText)}
              >
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={() => setLargeText(!largeText)}
                  style={{ opacity: 0, position: 'absolute' }}
                />
              </ToggleSwitch>
            </ToggleOption>
            
            <ToggleOption>
              <span>Reduced Motion</span>
              <ToggleSwitch 
                checked={reducedMotion}
                onClick={() => setReducedMotion(!reducedMotion)}
              >
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={() => setReducedMotion(!reducedMotion)}
                  style={{ opacity: 0, position: 'absolute' }}
                />
              </ToggleSwitch>
            </ToggleOption>
            
            <ToggleOption>
              <span>Screen Reader Optimized</span>
              <ToggleSwitch 
                checked={screenReaderOptimized}
                onClick={() => setScreenReaderOptimized(!screenReaderOptimized)}
              >
                <input
                  type="checkbox"
                  checked={screenReaderOptimized}
                  onChange={() => setScreenReaderOptimized(!screenReaderOptimized)}
                  style={{ opacity: 0, position: 'absolute' }}
                />
              </ToggleSwitch>
            </ToggleOption>
          </Section>
          
          <ButtonContainer>
            <Button 
              type={BUTTON_TYPES.SECONDARY} 
              text="Cancel" 
              onClick={handleCancel} 
            />
            <Button 
              type={BUTTON_TYPES.PRIMARY} 
              text="Save" 
              onClick={handleSave} 
            />
          </ButtonContainer>
        </Form>
      </Content>
    </Container>
  );
};

export default SettingsScreen;
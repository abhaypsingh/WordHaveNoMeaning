import React from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
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
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
`;

const Text = styled.p`
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
`;

const InstructionList = styled.ol`
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-lg);
  
  li {
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
  }
`;

const ExampleCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
`;

const ExampleWord = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  text-align: center;
  color: var(--color-primary);
`;

const ExampleOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ExampleOption = styled.div`
  padding: var(--spacing-sm);
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius-small);
  background-color: ${props => props.selected ? 'rgba(74, 111, 165, 0.1)' : 'transparent'};
  border-color: ${props => props.selected ? 'var(--color-primary)' : '#e0e0e0'};
  font-weight: ${props => props.selected ? '500' : 'normal'};
`;

const ExampleContradiction = styled.div`
  padding: var(--spacing-md);
  background-color: rgba(243, 146, 55, 0.1);
  border-radius: var(--border-radius-small);
  border-left: 4px solid var(--color-accent);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
`;

/**
 * How to Play screen component
 * @returns {JSX.Element} - Rendered component
 */
const HowToPlayScreen = () => {
  const navigate = useNavigate();
  
  const handleGotIt = () => {
    playButtonClick();
    navigate('/');
  };
  
  return (
    <Container>
      <Header title="How to Play" showBackButton />
      
      <Content>
        <Section>
          <SectionTitle>Game Concept</SectionTitle>
          <Text>
  &quot;Words Without Meaning&quot; demonstrates how words have no inherent meaning without context. 
  The game challenges your assumptions about language by presenting words with multiple 
  potential meanings, then revealing how context dramatically changes interpretation.
</Text>
        </Section>
        
        <Section>
          <SectionTitle>Gameplay</SectionTitle>
          <InstructionList>
            <li>You&apos;ll be presented with a word without any context</li>
            <li>Select what you think is the correct meaning from four options</li>
            <li>See a sentence that uses the word differently than what you selected</li>
            <li>Learn about how context shapes meaning</li>
            <li>Continue through multiple rounds to explore different words and concepts</li>
          </InstructionList>
        </Section>
        
        <Section>
          <SectionTitle>Example</SectionTitle>
          <ExampleCard>
            <ExampleWord>bank</ExampleWord>
            
            <ExampleOptions>
              <ExampleOption selected>Financial institution</ExampleOption>
              <ExampleOption>River edge</ExampleOption>
              <ExampleOption>To tilt an aircraft</ExampleOption>
              <ExampleOption>To rely on</ExampleOption>
            </ExampleOptions>
            
            <ExampleContradiction>
              <Text><strong>But in this sentence:</strong></Text>
              <Text>
              &quot;After the heavy rain, the river <strong>bank</strong> was eroded significantly.&quot;
              </Text>
              <Text>
                <strong>The word means:</strong> The land alongside or sloping down to a river or lake
              </Text>
            </ExampleContradiction>
          </ExampleCard>
          
          <Text>
  This example shows how the word &quot;bank&quot; can have completely different meanings 
  depending on context. Without context, the word itself doesn&apos;t tell you which 
  meaning is intended.
</Text>
        </Section>
        
        <Section>
          <SectionTitle>Educational Value</SectionTitle>
          <Text>
  As you play, you&apos;ll learn about linguistic concepts like homonyms, polysemy, 
  and semantic shift. You&apos;ll develop a deeper understanding of how language works 
  and how context shapes meaning.
</Text>
        </Section>
        
        <ButtonContainer>
          <Button text="Got It!" onClick={handleGotIt} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default HowToPlayScreen;
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

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-family: var(--font-family-heading);
  text-align: center;
`;

const AppTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  font-family: var(--font-family-heading);
  text-align: center;
`;

const Version = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-secondary);
  font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
`;

/**
 * About screen component
 * @returns {JSX.Element} - Rendered component
 */
const AboutScreen = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    playButtonClick();
    navigate('/');
  };
  
  return (
    <Container>
      <Header title="About" showBackButton />
      
      <Content>
        <Logo>🔤</Logo>
        <AppTitle>Words Without Meaning</AppTitle>
        <Version>Version 1.0.0</Version>
        
        <Section>
          <SectionTitle>Educational Purpose</SectionTitle>
          <Text>
  &quot;Words Without Meaning&quot; is an educational game designed to demonstrate how words 
  derive their meaning from context rather than having inherent meaning on their own. 
  By presenting words with multiple potential meanings and then showing how context 
  completely changes interpretation, the game challenges players&apos; assumptions about 
  language and communication.
</Text>
<Text>
  This game was created to make linguistic concepts accessible and engaging, helping 
  players develop a deeper understanding of how language works and how meaning is 
  constructed through context.
</Text>
</Section>
        
        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <Text>
  The game presents words that have multiple meanings or usages. Players select what 
  they believe is the correct definition, then are shown a sentence that uses the word 
  in a completely different context, contradicting their selection. This experience 
  demonstrates that words themselves don&apos;t contain meaning - context determines everything.
</Text>
<Text>
  Throughout the game, players learn about linguistic concepts like homonyms, polysemy, 
  contronyms, and semantic shift, seeing concrete examples of how these phenomena work 
  in everyday language.
</Text>
        </Section>
        
        <Section>
          <SectionTitle>Educational Benefits</SectionTitle>
          <Text>
          Playing &quot;Words Without Meaning&quot; can help develop:
          </Text>
          <ul>
            <li>Critical thinking about language and communication</li>
            <li>Awareness of how context shapes meaning</li>
            <li>Understanding of basic linguistic concepts</li>
            <li>Appreciation for the complexity and flexibility of language</li>
            <li>Improved vocabulary and language comprehension</li>
          </ul>
        </Section>
        
        <Section>
          <SectionTitle>Credits</SectionTitle>
          <Text>
            This educational game was developed as a project to explore the relationship between 
            words, meaning, and context. It draws on linguistic research about semantics, 
            pragmatics, and the philosophy of language.
          </Text>
          <Text>
            Special thanks to the linguistic researchers and educators whose work on context-dependent 
            meaning has informed this project.
          </Text>
        </Section>
        
        <ButtonContainer>
          <Button text="Back to Game" onClick={handleBack} />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default AboutScreen;
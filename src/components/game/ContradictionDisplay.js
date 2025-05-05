import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Define a reduced animation for users who prefer reduced motion
// Changed from/to syntax to 0%/100% to fix parsing error
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  background-color: white;
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-lg);
  animation: ${fadeIn} 0.5s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Section = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-primary);
`;

const UserSelection = styled.div`
  padding: var(--spacing-sm);
  background-color: rgba(74, 111, 165, 0.1);
  border-radius: var(--border-radius-small);
  border-left: 4px solid var(--color-primary);
`;

const ContradictionSentence = styled.div`
  padding: var(--spacing-sm);
  background-color: rgba(243, 146, 55, 0.1);
  border-radius: var(--border-radius-small);
  border-left: 4px solid var(--color-accent);
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Highlight = styled.span`
  font-weight: 700;
  color: var(--color-accent);
`;

const Explanation = styled.div`
  padding: var(--spacing-sm);
  line-height: 1.5;
`;

const EducationalMessage = styled.div`
  padding: var(--spacing-md);
  background-color: rgba(74, 111, 165, 0.05);
  border-radius: var(--border-radius-small);
  border: 1px dashed var(--color-primary);
  margin-top: var(--spacing-md);
  font-style: italic;
  color: var(--color-secondary);
`;

/**
 * ContradictionDisplay component for showing the contradiction and educational content
 * @param {Object} props - Component props
 * @param {Object} props.contradictionData - Data about the contradiction
 * @param {string} props.selectedMeaning - The meaning selected by the user
 * @param {string} props.educationalMessage - Educational message to display
 * @returns {JSX.Element} - Rendered component
 */
const ContradictionDisplay = ({ contradictionData, selectedMeaning, educationalMessage }) => {
  // Create a ref for the container to manage focus - moved to the top level
  const containerRef = useRef(null);
  
  // Focus the container when it appears and announce to screen readers - moved to the top level
  useEffect(() => {
    // Only focus if we have both the ref and contradictionData
    if (containerRef.current && contradictionData) {
      containerRef.current.focus();
    }
  }, [contradictionData]);

  if (!contradictionData) {
    return null;
  }
  
  // Parse the highlighted sentence to render the highlight
  const renderHighlightedSentence = () => {
    if (!contradictionData.highlightedSentence) {
      return contradictionData.sentence;
    }
    
    // If the sentence contains HTML for highlighting
    if (contradictionData.highlightedSentence.includes('<span')) {
      const parts = contradictionData.highlightedSentence.split(/<span class="highlight">|<\/span>/);
      
      if (parts.length === 3) {
        return (
          <>
            {parts[0]}
            <Highlight>{parts[1]}</Highlight>
            {parts[2]}
          </>
        );
      }
    }
    
    return contradictionData.sentence;
  };

  return (
    <Container
      ref={containerRef}
      tabIndex="-1"
      role="region"
      aria-live="polite"
      aria-atomic="true"
      data-testid="contradiction-display"
    >
      <Section>
        <SectionTitle>You selected:</SectionTitle>
        <UserSelection aria-label={`Your selected meaning: ${selectedMeaning}`}>
          {selectedMeaning}
        </UserSelection>
      </Section>
      
      <Section>
        <SectionTitle>But in this sentence:</SectionTitle>
        <ContradictionSentence aria-label="Example sentence showing different meaning">
          {renderHighlightedSentence()}
        </ContradictionSentence>
      </Section>
      
      <Section>
        <SectionTitle>The word means:</SectionTitle>
        <Explanation aria-label={`Actual meaning in this context: ${contradictionData.meaning}`}>
          {contradictionData.meaning}
        </Explanation>
      </Section>
      
      {contradictionData.explanation && (
        <Section>
          <Explanation aria-label="Explanation of the contradiction">
            {contradictionData.explanation}
          </Explanation>
        </Section>
      )}
      
      {educationalMessage && (
        <EducationalMessage aria-label="Educational insight about language">
          {educationalMessage}
        </EducationalMessage>
      )}
    </Container>
  );
};

export default ContradictionDisplay;

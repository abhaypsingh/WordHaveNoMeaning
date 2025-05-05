import { educationalMessages, linguisticConcepts, educationalTakeaways } from '../data/educationalContent';

/**
 * Gets an educational message relevant to a word and its meanings
 * @param {Object} word - The word object
 * @param {Object} selectedMeaning - The meaning selected by the user
 * @param {Object} contradictionMeaning - The meaning used for contradiction
 * @returns {Promise<Object>} - A promise that resolves to an educational message
 */
export const getEducationalMessage = async (word, selectedMeaning, contradictionMeaning) => {
  try {
    // Identify the linguistic concept demonstrated by this contradiction
    const concept = identifyLinguisticConcept(word, selectedMeaning, contradictionMeaning);
    
    // Get messages relevant to this concept
    let relevantMessages = educationalMessages.filter(message => 
      message.category === concept || message.relatedWords.includes(word.text)
    );
    
    // If no specific messages, get generic ones about context and meaning
    if (relevantMessages.length === 0) {
      relevantMessages = educationalMessages.filter(message => 
        message.category === 'context' || message.category === 'meaning'
      );
    }
    
    // Filter to appropriate difficulty
    let filteredMessages = relevantMessages.filter(message => 
      message.difficulty === word.difficulty
    );
    
    // If none at right difficulty, use any relevant message
    if (filteredMessages.length === 0) {
      filteredMessages = relevantMessages;
    }
    
    // Select a random message
    const randomIndex = Math.floor(Math.random() * filteredMessages.length);
    const selectedMessage = filteredMessages[randomIndex] || {
      id: 'default_message',
      text: 'Words have no inherent meaning without context. The same word can have completely different meanings depending on how it\'s used.',
      category: 'context',
      difficulty: 'medium',
      relatedWords: []
    };
    
    return selectedMessage;
  } catch (error) {
    console.error('Error getting educational message:', error);
    throw new Error('Failed to get educational message');
  }
};

/**
 * Gets an explanation for a linguistic concept
 * @param {string} conceptId - The ID of the concept to explain
 * @returns {Promise<Object>} - A promise that resolves to a concept explanation
 */
export const getConceptExplanation = async (conceptId) => {
  try {
    const concept = linguisticConcepts.find(c => c.id === conceptId);
    
    if (!concept) {
      throw new Error(`Concept with ID ${conceptId} not found`);
    }
    
    return concept;
  } catch (error) {
    console.error('Error getting concept explanation:', error);
    throw new Error('Failed to get concept explanation');
  }
};

/**
 * Generates educational takeaways based on encountered concepts
 * @param {Array} encounteredConcepts - Array of concept IDs encountered during gameplay
 * @returns {Promise<Array>} - A promise that resolves to an array of takeaways
 */
export const getGameTakeaways = async (encounteredConcepts) => {
  try {
    // Add general takeaway about context and meaning
    const takeaways = [
      "Words have no inherent meaning without context. The same word can have completely different meanings depending on how it's used."
    ];
    
    // Add specific takeaways for each encountered concept
    if (encounteredConcepts && encounteredConcepts.length > 0) {
      for (const conceptId of encounteredConcepts) {
        const relevantTakeaways = educationalTakeaways.filter(takeaway => 
          takeaway.conceptId === conceptId
        );
        
        if (relevantTakeaways.length > 0) {
          // Add one takeaway per concept
          const randomIndex = Math.floor(Math.random() * relevantTakeaways.length);
          takeaways.push(relevantTakeaways[randomIndex].text);
        }
      }
    } else {
      // If no specific concepts encountered, add some general takeaways
      const generalTakeaways = [
        "Homonyms are words that sound the same but have different meanings, often with different etymological origins.",
        "Polysemes are words with multiple related meanings that evolved from the same original concept.",
        "Context is the primary determinant of meaning in language, which is why isolated words can be ambiguous or misleading."
      ];
      
      takeaways.push(...generalTakeaways);
    }
    
    return takeaways;
  } catch (error) {
    console.error('Error generating takeaways:', error);
    throw new Error('Failed to generate educational takeaways');
  }
};

/**
 * Identifies the linguistic concept demonstrated by a word and its meanings
 * @param {Object} word - The word object
 * @param {Object} selectedMeaning - The meaning selected by the user
 * @param {Object} contradictionMeaning - The meaning used for contradiction
 * @returns {string} - The identified concept
 */
function identifyLinguisticConcept(word, selectedMeaning, contradictionMeaning) {
  // Check if the word has specific categories that indicate a concept
  if (word.categories.includes('homonym')) {
    return 'homonym';
  } else if (word.categories.includes('polyseme')) {
    return 'polyseme';
  } else if (word.categories.includes('metonymy')) {
    return 'metonymy';
  } else if (word.categories.includes('semantic_shift')) {
    return 'semantic_shift';
  }
  
  // If no specific category, determine based on the relationship between meanings
  if (selectedMeaning && contradictionMeaning) {
    if (selectedMeaning.partOfSpeech !== contradictionMeaning.partOfSpeech) {
      return 'part_of_speech_variation';
    }
    
    // Check if one meaning is archaic
    if (selectedMeaning.isArchaic !== contradictionMeaning.isArchaic) {
      return 'semantic_shift';
    }
  }
  
  // Default to context dependency
  return 'context_dependency';
}

/**
 * Determines the user's current learning stage based on game progress
 * @param {Object} gameSession - The current game session
 * @returns {Promise<string>} - A promise that resolves to the learning stage
 */
export const determineUserLearningStage = async (gameSession) => {
  try {
    if (!gameSession) {
      return 'introduction';
    }
    
    const { currentRound, totalRounds, _encounteredConcepts } = gameSession;
    
    // Simple progression based on game completion percentage
    const completionPercentage = (currentRound / totalRounds) * 100;
    
    if (completionPercentage < 20) {
      return 'introduction';
    } else if (completionPercentage < 40) {
      return 'exploration';
    } else if (completionPercentage < 60) {
      return 'contradiction';
    } else if (completionPercentage < 80) {
      return 'conceptualization';
    } else if (completionPercentage < 100) {
      return 'application';
    } else {
      return 'synthesis';
    }
  } catch (error) {
    console.error('Error determining learning stage:', error);
    throw new Error('Failed to determine learning stage');
  }
};

/**
 * Records a concept exposure for spaced repetition
 * @param {string} conceptId - The ID of the concept exposed
 * @param {Object} gameSession - The current game session
 * @returns {Promise<void>} - A promise that resolves when the exposure is recorded
 */
export const recordConceptExposure = async (conceptId, gameSession) => {
  try {
    // In a real implementation, this would update a database or state
    // For now, we'll just log it
    console.log(`Concept exposure recorded: ${conceptId}`);
    
    // Add to encountered concepts if not already present
    if (gameSession && gameSession.encounteredConcepts && !gameSession.encounteredConcepts.includes(conceptId)) {
      gameSession.encounteredConcepts.push(conceptId);
    }
  } catch (error) {
    console.error('Error recording concept exposure:', error);
    throw new Error('Failed to record concept exposure');
  }
};
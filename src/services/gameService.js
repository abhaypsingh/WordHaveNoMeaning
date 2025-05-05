import { v4 as uuidv4 } from 'uuid';
import { selectWordsForGame, getDistractorsForWord } from './wordService';
import { recordConceptExposure } from './educationalService';

/**
 * Initializes a new game session
 * @param {Object} settings - Game settings (difficulty, roundCount, timeLimit, soundEnabled)
 * @returns {Promise<Object>} - A promise that resolves to a new game session
 */
export const initializeGame = async (settings) => {
  try {
    // Get words for the game based on difficulty and round count
    const selectedWords = await selectWordsForGame(settings.difficulty, settings.roundCount);
    
    // Create game session
    const gameSession = {
      id: uuidv4(),
      startTime: new Date(),
      endTime: null,
      settings,
      currentRound: 0,
      totalRounds: settings.roundCount,
      score: 0,
      rounds: [],
      completed: false,
      encounteredConcepts: [],
    };
    
    // Create rounds for each selected word
    const rounds = await Promise.all(selectedWords.map(async (word, index) => {
      // Generate options for this word
      const options = await generateMeaningOptions(word);
      
      // Select a contradiction meaning
      const correctMeaning = selectContradictionMeaning(word, options);
      
      // Mark the contradiction meaning in the options
      const markedOptions = options.map(option => ({
        ...option,
        isContradiction: option.text === correctMeaning.definition
      }));
      
      return {
        roundNumber: index + 1,
        word,
        correctMeaning,
        options: markedOptions,
        selectedOption: null,
        timeSpent: 0,
        score: 0,
        completed: false,
      };
    }));
    
    // Add rounds to game session
    gameSession.rounds = rounds;
    
    return gameSession;
  } catch (error) {
    console.error('Error initializing game:', error);
    throw new Error('Failed to initialize game');
  }
};

/**
 * Starts the next round in a game session
 * @param {Object} gameSession - The current game session
 * @returns {Promise<boolean>} - A promise that resolves to true if successful, false if no more rounds
 */
export const startNextRound = async (gameSession) => {
  try {
    if (!gameSession) {
      throw new Error('No active game session');
    }
    
    if (gameSession.currentRound >= gameSession.totalRounds) {
      return false; // No more rounds
    }
    
    gameSession.currentRound += 1;
    const currentRound = gameSession.rounds[gameSession.currentRound - 1];
    
    // Reset round state for new round
    if (currentRound) {
      currentRound.selectedOption = null;
      currentRound.timeSpent = 0;
      currentRound.score = 0;
      currentRound.completed = false;
    }
    
    return true; // Successfully started next round
  } catch (error) {
    console.error('Error starting next round:', error);
    throw new Error('Failed to start next round');
  }
};

/**
 * Gets the current round from a game session
 * @param {Object} gameSession - The current game session
 * @returns {Object|null} - The current round or null if no active round
 */
export const getCurrentRound = (gameSession) => {
  if (!gameSession || gameSession.currentRound === 0 || gameSession.currentRound > gameSession.totalRounds) {
    return null;
  }
  
  return gameSession.rounds[gameSession.currentRound - 1];
};

/**
 * Processes a user's selection in the current round
 * @param {Object} gameSession - The current game session
 * @param {number} optionIndex - The index of the selected option
 * @param {number} timeSpent - The time spent on this round
 * @returns {Promise<Object>} - A promise that resolves to the updated round
 */
export const processUserSelection = async (gameSession, optionIndex, timeSpent) => {
  try {
    if (!gameSession) {
      throw new Error('No active game session');
    }
    
    const currentRound = getCurrentRound(gameSession);
    
    if (!currentRound) {
      throw new Error('No active round');
    }
    
    if (currentRound.completed) {
      throw new Error('Round already completed');
    }
    
    // Record user's selection
    currentRound.selectedOption = optionIndex;
    currentRound.timeSpent = timeSpent;
    
    const selectedOption = currentRound.options[optionIndex];
    
    if (!selectedOption) {
      throw new Error('Invalid option selected');
    }
    
    // Calculate score
    const baseScore = calculateBaseScore(selectedOption.isCorrect);
    const timeBonus = calculateTimeBonus(timeSpent, gameSession.settings.timeLimit);
    const difficultyMultiplier = getDifficultyMultiplier(gameSession.settings.difficulty);
    
    const score = Math.round(baseScore * timeBonus * difficultyMultiplier);
    currentRound.score = score;
    
    // Update total score
    gameSession.score += score;
    
    // Mark round as completed
    currentRound.completed = true;
    
    // Record concept exposure
    if (currentRound.word.categories.length > 0) {
      // Use the first category as a concept for now
      // In a real implementation, this would be more sophisticated
      const conceptId = currentRound.word.categories[0];
      await recordConceptExposure(conceptId, gameSession);
    }
    
    return currentRound;
  } catch (error) {
    console.error('Error processing user selection:', error);
    throw new Error('Failed to process user selection');
  }
};

/**
 * Gets a contradiction sentence for the current round
 * @param {Object} gameSession - The current game session
 * @returns {Promise<Object>} - A promise that resolves to contradiction data
 */
export const getContradictionSentence = async (gameSession) => {
  try {
    const currentRound = getCurrentRound(gameSession);
    
    if (!currentRound || !currentRound.completed) {
      throw new Error('No completed round to get contradiction for');
    }
    
    // Get the contradiction meaning
    const contradictionMeaning = currentRound.correctMeaning;
    
    // Check if contradictionMeaning has contradictionSentences
    if (!contradictionMeaning || !contradictionMeaning.contradictionSentences || contradictionMeaning.contradictionSentences.length === 0) {
      
      // Fallback: create a generic contradiction sentence
      const word = currentRound.word.text;
      const fallbackSentence = `This is an example where "${word}" means "${contradictionMeaning.definition}".`;
      
      return {
        sentence: fallbackSentence,
        highlightedSentence: fallbackSentence.replace(word, `<span class="highlight">${word}</span>`),
        meaning: contradictionMeaning.definition,
        explanation: `In this context, "${word}" means "${contradictionMeaning.definition}" rather than the meaning you selected.`
      };
    }
    
    // Get a random contradiction sentence
    const sentences = contradictionMeaning.contradictionSentences;
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const selectedSentence = sentences[randomIndex];
    
    // Create highlighted sentence by wrapping the word in a span
    const word = currentRound.word.text;
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const highlightedSentence = selectedSentence.replace(regex, `<span class="highlight">${word}</span>`);
    
    return {
      sentence: selectedSentence,
      highlightedSentence,
      meaning: contradictionMeaning.definition,
      explanation: `In this context, "${word}" means "${contradictionMeaning.definition}" rather than the meaning you selected.`
    };
  } catch (error) {
    console.error('Error getting contradiction sentence:', error);
    throw new Error('Failed to get contradiction sentence');
  }
};

/**
 * Completes a game session and calculates final results
 * @param {Object} gameSession - The current game session
 * @returns {Promise<Object>} - A promise that resolves to the game results
 */
export const completeGame = async (gameSession) => {
  try {
    if (!gameSession) {
      throw new Error('No active game session');
    }
    
    if (gameSession.completed) {
      throw new Error('Game already completed');
    }
    
    // Set end time and mark as completed
    gameSession.endTime = new Date();
    gameSession.completed = true;
    
    // Calculate final statistics
    let totalTimeSpent = 0;
    let correctAnswers = 0;
    
    gameSession.rounds.forEach(round => {
      totalTimeSpent += round.timeSpent;
      
      if (round.selectedOption !== null) {
        const selectedOption = round.options[round.selectedOption];
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers += 1;
        }
      }
    });
    
    const averageTimePerRound = totalTimeSpent / gameSession.totalRounds;
    const accuracyRate = (correctAnswers / gameSession.totalRounds) * 100;
    
    // Generate performance feedback
    const performance = generatePerformanceFeedback(accuracyRate);
    
    // Generate next difficulty suggestion
    const suggestion = suggestNextDifficulty(gameSession, accuracyRate);
    
    return {
      score: gameSession.score,
      totalRounds: gameSession.totalRounds,
      correctAnswers,
      accuracyRate,
      averageTimePerRound,
      difficulty: gameSession.settings.difficulty,
      performance,
      suggestion,
    };
  } catch (error) {
    console.error('Error completing game:', error);
    throw new Error('Failed to complete game');
  }
};

/**
 * Generates meaning options for a word
 * @param {Object} word - The word to generate options for
 * @returns {Promise<Array>} - A promise that resolves to an array of options
 */
async function generateMeaningOptions(word) {
  try {
    // Include actual meanings (up to 3)
    const actualMeanings = word.meanings.slice(0, Math.min(3, word.meanings.length));
    
    const options = actualMeanings.map((meaning, index) => ({
      index,
      text: meaning.definition,
      isCorrect: true,
      isContradiction: false,
    }));
    
    // Fill remaining slots with distractors
    const neededDistractors = 4 - options.length;
    
    if (neededDistractors > 0) {
      const distractors = await getDistractorsForWord(word, neededDistractors);
      
      distractors.forEach((distractor, _index) => {
        options.push({
          index: options.length,
          text: distractor.definition,
          isCorrect: false,
          isContradiction: false,
        });
      });
    }
    
    // Shuffle options
    return shuffleArray(options);
  } catch (error) {
    console.error('Error generating meaning options:', error);
    throw new Error('Failed to generate meaning options');
  }
}

/**
 * Selects a contradiction meaning for a word
 * @param {Object} word - The word to select a contradiction meaning for
 * @param {Array} options - The options for this word
 * @returns {Object} - The selected contradiction meaning
 */
function selectContradictionMeaning(word, options) {
  // Filter to meanings that have contradiction sentences
  const validMeanings = word.meanings.filter(meaning => 
    meaning.contradictionSentences && meaning.contradictionSentences.length > 0 &&
    options.some(option => option.text === meaning.definition && option.isCorrect)
  );
  
  // If no valid meanings, fall back to any meaning with contradiction sentences
  if (validMeanings.length === 0) {
    const fallbackMeanings = word.meanings.filter(meaning => 
      meaning.contradictionSentences && meaning.contradictionSentences.length > 0
    );
    
    if (fallbackMeanings.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackMeanings.length);
      return fallbackMeanings[randomIndex];
    }
    
    // Last resort: just use the first meaning
    return word.meanings[0];
  }
  
  // Select a random meaning from valid options
  const randomIndex = Math.floor(Math.random() * validMeanings.length);
  return validMeanings[randomIndex];
}

/**
 * Calculates the base score for a selection
 * @param {boolean} isCorrect - Whether the selection was correct
 * @returns {number} - The base score
 */
function calculateBaseScore(isCorrect) {
  return isCorrect ? 100 : 25;
}

/**
 * Calculates the time bonus for a round
 * @param {number} timeSpent - The time spent on the round
 * @param {number} timeLimit - The time limit for the round
 * @returns {number} - The time bonus multiplier
 */
function calculateTimeBonus(timeSpent, timeLimit) {
  if (timeLimit === 0) {
    return 1.0; // No time bonus if no time limit
  }
  
  // Calculate bonus factor (1.0 to 1.5)
  const timeRatio = 1 - (timeSpent / timeLimit);
  const bonus = 1.0 + (timeRatio * 0.5);
  
  // Ensure bonus is within bounds
  return Math.max(1.0, Math.min(1.5, bonus));
}

/**
 * Gets the difficulty multiplier for scoring
 * @param {string} difficulty - The difficulty level
 * @returns {number} - The difficulty multiplier
 */
function getDifficultyMultiplier(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 1.0;
    case 'medium':
      return 1.25;
    case 'hard':
      return 1.5;
    default:
      return 1.0;
  }
}

/**
 * Generates performance feedback based on accuracy rate
 * @param {number} accuracyRate - The accuracy rate
 * @returns {string} - The performance feedback
 */
function generatePerformanceFeedback(accuracyRate) {
  if (accuracyRate >= 90) {
    return "Excellent! You have a strong understanding of how context affects meaning.";
  } else if (accuracyRate >= 70) {
    return "Good job! You're developing a solid grasp of contextual meaning.";
  } else if (accuracyRate >= 50) {
    return "Nice effort! This game highlights how tricky language can be without context.";
  } else {
    return "Great start! This game demonstrates why context is so crucial for understanding language.";
  }
}

/**
 * Suggests the next difficulty level based on performance
 * @param {Object} gameSession - The completed game session
 * @param {number} accuracyRate - The accuracy rate
 * @returns {string} - The suggestion
 */
function suggestNextDifficulty(gameSession, accuracyRate) {
  const currentDifficulty = gameSession.settings.difficulty;
  
  if (currentDifficulty === 'easy' && accuracyRate >= 80) {
    return "You did great! Try Medium difficulty next for more challenging words.";
  } else if (currentDifficulty === 'medium' && accuracyRate >= 80) {
    return "Excellent work! Challenge yourself with Hard difficulty next time.";
  } else if (currentDifficulty === 'hard' && accuracyRate >= 70) {
    return "Outstanding! You've mastered even the most challenging words.";
  } else if (accuracyRate < 40) {
    return "Language is tricky! Try an easier difficulty to build your confidence.";
  } else {
    return "Play again to discover more words and their contextual meanings!";
  }
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
function shuffleArray(array) {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}
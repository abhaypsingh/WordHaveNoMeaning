import { wordDatabase } from '../data/wordDatabase';

// Keep track of recently used words to prevent repetition
const recentlyUsedWords = new Set();
const MAX_RECENT_WORDS = 50; // Maximum number of words to track

/**
 * Selects words for a game based on difficulty and count
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
 * @param {number} count - The number of words to select
 * @returns {Promise<Array>} - A promise that resolves to an array of selected words
 */
export const selectWordsForGame = async (difficulty, count) => {
  try {
    // Get words of the requested difficulty
    let availableWords = wordDatabase.filter(word => word.difficulty === difficulty);
    
    // Filter out recently used words to prevent repetition
    let filteredWords = availableWords.filter(word => !recentlyUsedWords.has(word.id));
    
    // If not enough words after filtering, expand to adjacent difficulties
    if (filteredWords.length < count) {
      let additionalWords = [];
      
      if (difficulty === 'easy') {
        additionalWords = wordDatabase.filter(word =>
          word.difficulty === 'medium' && !recentlyUsedWords.has(word.id)
        );
      } else if (difficulty === 'hard') {
        additionalWords = wordDatabase.filter(word =>
          word.difficulty === 'medium' && !recentlyUsedWords.has(word.id)
        );
      } else {
        additionalWords = [
          ...wordDatabase.filter(word =>
            word.difficulty === 'easy' && !recentlyUsedWords.has(word.id)
          ),
          ...wordDatabase.filter(word =>
            word.difficulty === 'hard' && !recentlyUsedWords.has(word.id)
          )
        ];
      }
      
      filteredWords = [...filteredWords, ...additionalWords];
    }
    
    // If still not enough words, include some recently used words as a last resort
    if (filteredWords.length < count) {
      const remainingNeeded = count - filteredWords.length;
      const recentlyUsedArray = Array.from(recentlyUsedWords)
        .map(id => wordDatabase.find(word => word.id === id))
        .filter(word => word); // Filter out any undefined values
      
      // Prioritize words of the requested difficulty
      const prioritizedRecent = [
        ...recentlyUsedArray.filter(word => word.difficulty === difficulty),
        ...recentlyUsedArray.filter(word => word.difficulty !== difficulty)
      ];
      
      filteredWords = [...filteredWords, ...prioritizedRecent.slice(0, remainingNeeded)];
    }
    
    // Shuffle and select required number of words
    const shuffledWords = shuffleArray(filteredWords);
    const selectedWords = shuffledWords.slice(0, count);
    
    // Add selected words to recently used set
    selectedWords.forEach(word => {
      recentlyUsedWords.add(word.id);
      
      // If the set gets too large, remove the oldest entries
      if (recentlyUsedWords.size > MAX_RECENT_WORDS) {
        const oldestWord = recentlyUsedWords.values().next().value;
        recentlyUsedWords.delete(oldestWord);
      }
    });
    
    return selectedWords;
  } catch (error) {
    console.error('Error selecting words:', error);
    throw new Error('Failed to select words for the game');
  }
};

/**
 * Gets a word by its ID
 * @param {string} wordId - The ID of the word to retrieve
 * @returns {Promise<Object>} - A promise that resolves to the word object
 */
export const getWordById = async (wordId) => {
  try {
    const word = wordDatabase.find(w => w.id === wordId);
    
    if (!word) {
      throw new Error(`Word with ID ${wordId} not found`);
    }
    
    return word;
  } catch (error) {
    console.error('Error getting word:', error);
    throw new Error('Failed to get word');
  }
};

/**
 * Gets words by difficulty level
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
 * @returns {Promise<Array>} - A promise that resolves to an array of words
 */
export const getWordsByDifficulty = async (difficulty) => {
  try {
    const words = wordDatabase.filter(word => word.difficulty === difficulty);
    return words;
  } catch (error) {
    console.error('Error getting words by difficulty:', error);
    throw new Error('Failed to get words by difficulty');
  }
};

/**
 * Gets words by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} - A promise that resolves to an array of words
 */
export const getWordsByCategory = async (category) => {
  try {
    const words = wordDatabase.filter(word => word.categories.includes(category));
    return words;
  } catch (error) {
    console.error('Error getting words by category:', error);
    throw new Error('Failed to get words by category');
  }
};

/**
 * Gets distractors for a word
 * @param {Object} word - The word to get distractors for
 * @param {number} count - The number of distractors to get
 * @returns {Promise<Array>} - A promise that resolves to an array of distractors
 */
export const getDistractorsForWord = async (word, count) => {
  try {
    // Enhanced distractor generation
    // First, try to find semantically related but incorrect definitions from other words
    const relatedDistractors = [];
    
    // Look for words in the same categories but with different meanings
    const relatedWords = wordDatabase.filter(w =>
      w.id !== word.id && // Not the same word
      w.categories.some(cat => word.categories.includes(cat)) // Has at least one matching category
    );
    
    // Extract meanings from related words
    if (relatedWords.length > 0) {
      relatedWords.forEach(relatedWord => {
        relatedWord.meanings.forEach(meaning => {
          // Check if this meaning is sufficiently different from our word's meanings
          const isDifferentMeaning = word.meanings.every(m =>
            !areSimilarDefinitions(m.definition, meaning.definition)
          );
          
          if (isDifferentMeaning) {
            relatedDistractors.push({
              id: `distractor_${relatedWord.id}_${meaning.id}`,
              definition: meaning.definition,
              forWordTypes: [meaning.partOfSpeech],
              difficulty: word.difficulty,
              source: 'related_word'
            });
          }
        });
      });
    }
    
    // Fallback distractors if we don't have enough related ones
    const fallbackDistractors = [
      {
        id: 'distractor_001',
        definition: 'To prepare food by heating it in an oven',
        forWordTypes: ['noun', 'verb'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_002',
        definition: 'A small, round fruit with red or green skin',
        forWordTypes: ['noun'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_003',
        definition: 'A device used for measuring time',
        forWordTypes: ['noun'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_004',
        definition: 'A large, four-legged animal with a trunk',
        forWordTypes: ['noun'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_005',
        definition: 'To move quickly on foot',
        forWordTypes: ['verb'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_006',
        definition: 'A small, flying insect that produces honey',
        forWordTypes: ['noun'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_007',
        definition: 'A tall plant with a hard trunk and branches',
        forWordTypes: ['noun'],
        difficulty: word.difficulty,
        source: 'fallback'
      },
      {
        id: 'distractor_008',
        definition: 'To speak in a loud voice',
        forWordTypes: ['verb'],
        difficulty: word.difficulty,
        source: 'fallback'
      }
    ];
    
    // Combine related and fallback distractors
    const allDistractors = [...relatedDistractors, ...fallbackDistractors];
    
    // Filter distractors that are appropriate for this word's type
    const filteredDistractors = allDistractors.filter(distractor =>
      distractor.forWordTypes.some(type => word.categories.includes(type))
    );
    
    // Prioritize related distractors over fallback ones
    const prioritizedDistractors = [
      ...filteredDistractors.filter(d => d.source === 'related_word'),
      ...filteredDistractors.filter(d => d.source === 'fallback')
    ];
    
    // Shuffle and select required number of distractors
    const shuffledDistractors = shuffleArray(prioritizedDistractors);
    const selectedDistractors = shuffledDistractors.slice(0, count);
    
    return selectedDistractors;
  } catch (error) {
    console.error('Error getting distractors:', error);
    throw new Error('Failed to get distractors for word');
  }
};

/**
 * Checks if two definitions are similar
 * @param {string} def1 - First definition
 * @param {string} def2 - Second definition
 * @returns {boolean} - Whether the definitions are similar
 */
function areSimilarDefinitions(def1, def2) {
  // Simple implementation: check if definitions share significant words
  const words1 = def1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const words2 = def2.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  // Count shared significant words
  const sharedWords = words1.filter(w => words2.includes(w));
  
  // If more than 30% of words are shared, consider them similar
  return sharedWords.length > 0 &&
         (sharedWords.length / Math.min(words1.length, words2.length)) > 0.3;
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
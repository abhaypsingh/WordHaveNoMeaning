# Words Without Meaning: API & Function Reference

## Introduction

This document provides a comprehensive reference for the key APIs, services, and functions used in the "Words Without Meaning" game. It's intended for developers who want to understand, maintain, or extend the codebase.

## Core Services

### Game Service

The Game Service (`gameService.js`) handles the core game mechanics and logic.

#### Functions

##### `initializeGame(settings)`

Initializes a new game session with the specified settings.

```javascript
/**
 * Initialize a new game session
 * @param {Object} settings - Game settings
 * @param {string} settings.difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {number} settings.roundCount - Number of rounds to play
 * @param {number} settings.timeLimit - Time limit per round in seconds (0 for no limit)
 * @param {boolean} settings.soundEnabled - Whether sound effects are enabled
 * @returns {Object} New game session object
 */
function initializeGame(settings) {
  // Implementation details...
}
```

##### `processUserSelection(gameSession, optionIndex, timeSpent)`

Processes a user's selection of a meaning option.

```javascript
/**
 * Process user selection of a meaning option
 * @param {Object} gameSession - Current game session
 * @param {number} optionIndex - Index of the selected option
 * @param {number} timeSpent - Time spent making the selection in seconds
 * @returns {Object} Updated game session with selection results
 */
function processUserSelection(gameSession, optionIndex, timeSpent) {
  // Implementation details...
}
```

##### `startNextRound(gameSession)`

Advances the game to the next round.

```javascript
/**
 * Start the next round in the game session
 * @param {Object} gameSession - Current game session
 * @returns {Object} Updated game session with new round
 */
function startNextRound(gameSession) {
  // Implementation details...
}
```

##### `completeGame(gameSession)`

Completes the current game session and calculates final statistics.

```javascript
/**
 * Complete the current game session
 * @param {Object} gameSession - Current game session
 * @returns {Object} Completed game session with final statistics
 */
function completeGame(gameSession) {
  // Implementation details...
}
```

##### `getContradictionSentence(gameSession)`

Retrieves contradiction data for the current round.

```javascript
/**
 * Get contradiction sentence for the current round
 * @param {Object} gameSession - Current game session
 * @returns {Object} Contradiction data with sentence and explanation
 */
function getContradictionSentence(gameSession) {
  // Implementation details...
}
```

##### `calculateScore(isCorrect, timeSpent, difficulty)`

Calculates the score for a round based on correctness, time spent, and difficulty.

```javascript
/**
 * Calculate score for a round
 * @param {boolean} isCorrect - Whether the selection was correct
 * @param {number} timeSpent - Time spent making the selection in seconds
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {number} Score for the round
 */
function calculateScore(isCorrect, timeSpent, difficulty) {
  // Implementation details...
}
```

### Word Service

The Word Service (`wordService.js`) handles word selection and processing.

#### Functions

##### `getWordsByDifficulty(difficulty, count)`

Retrieves a set of words based on difficulty level.

```javascript
/**
 * Get words by difficulty level
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {number} count - Number of words to retrieve
 * @returns {Array} Array of word objects
 */
function getWordsByDifficulty(difficulty, count) {
  // Implementation details...
}
```

##### `generateMeaningOptions(word, count)`

Generates meaning options for a word, including correct and distractor options.

```javascript
/**
 * Generate meaning options for a word
 * @param {Object} word - Word object
 * @param {number} count - Number of options to generate
 * @returns {Array} Array of meaning option objects
 */
function generateMeaningOptions(word, count) {
  // Implementation details...
}
```

##### `selectContradictionMeaning(word, selectedMeaning)`

Selects a contradictory meaning for a word based on the selected meaning.

```javascript
/**
 * Select a contradictory meaning for a word
 * @param {Object} word - Word object
 * @param {Object} selectedMeaning - The meaning selected by the user
 * @returns {Object} Contradictory meaning object
 */
function selectContradictionMeaning(word, selectedMeaning) {
  // Implementation details...
}
```

### Educational Service

The Educational Service (`educationalService.js`) manages educational content and learning progression.

#### Functions

##### `getEducationalMessage(word, selectedMeaning, contradictionMeaning)`

Retrieves an educational message based on the current word and meanings.

```javascript
/**
 * Get educational message for the current word and meanings
 * @param {Object} word - Current word object
 * @param {Object} selectedMeaning - Meaning selected by the user
 * @param {Object} contradictionMeaning - Contradictory meaning
 * @returns {Object} Educational message object
 */
function getEducationalMessage(word, selectedMeaning, contradictionMeaning) {
  // Implementation details...
}
```

##### `getConceptExplanation(conceptId)`

Retrieves a detailed explanation of a linguistic concept.

```javascript
/**
 * Get explanation for a linguistic concept
 * @param {string} conceptId - ID of the linguistic concept
 * @returns {Object} Concept explanation object
 */
function getConceptExplanation(conceptId) {
  // Implementation details...
}
```

##### `recordConceptExposure(conceptId, gameSession)`

Records that a user has been exposed to a linguistic concept.

```javascript
/**
 * Record exposure to a linguistic concept
 * @param {string} conceptId - ID of the linguistic concept
 * @param {Object} gameSession - Current game session
 * @returns {Object} Updated game session with recorded concept exposure
 */
function recordConceptExposure(conceptId, gameSession) {
  // Implementation details...
}
```

##### `generateLearningTakeaways(gameSession)`

Generates educational takeaways based on the concepts encountered during gameplay.

```javascript
/**
 * Generate learning takeaways for the completed game
 * @param {Object} gameSession - Completed game session
 * @returns {Array} Array of takeaway objects
 */
function generateLearningTakeaways(gameSession) {
  // Implementation details...
}
```

### Storage Service

The Storage Service (`storageService.js`) handles data persistence.

#### Functions

##### `saveGameSession(gameSession)`

Saves a game session to persistent storage.

```javascript
/**
 * Save game session to storage
 * @param {Object} gameSession - Game session to save
 * @returns {Promise} Promise resolving to success status
 */
function saveGameSession(gameSession) {
  // Implementation details...
}
```

##### `loadGameSession(sessionId)`

Loads a game session from persistent storage.

```javascript
/**
 * Load game session from storage
 * @param {string} sessionId - ID of the game session to load
 * @returns {Promise} Promise resolving to game session object
 */
function loadGameSession(sessionId) {
  // Implementation details...
}
```

##### `getUserSettings()`

Retrieves user settings from persistent storage.

```javascript
/**
 * Get user settings from storage
 * @returns {Object} User settings object
 */
function getUserSettings() {
  // Implementation details...
}
```

##### `updateUserSettings(settings)`

Updates user settings in persistent storage.

```javascript
/**
 * Update user settings in storage
 * @param {Object} settings - Updated settings object
 * @returns {Promise} Promise resolving to success status
 */
function updateUserSettings(settings) {
  // Implementation details...
}
```

##### `getUserProgress()`

Retrieves user progress data from persistent storage.

```javascript
/**
 * Get user progress from storage
 * @returns {Object} User progress object
 */
function getUserProgress() {
  // Implementation details...
}
```

##### `updateUserProgress(progress)`

Updates user progress data in persistent storage.

```javascript
/**
 * Update user progress in storage
 * @param {Object} progress - Updated progress object
 * @returns {Promise} Promise resolving to success status
 */
function updateUserProgress(progress) {
  // Implementation details...
}
```

### Sound Service

The Sound Service (`soundService.js`) manages sound effects.

#### Functions

##### `initSoundService()`

Initializes the sound service and preloads sound assets.

```javascript
/**
 * Initialize sound service and preload sounds
 * @returns {Promise} Promise resolving when initialization is complete
 */
function initSoundService() {
  // Implementation details...
}
```

##### `playSound(soundId)`

Plays a sound effect.

```javascript
/**
 * Play a sound effect
 * @param {string} soundId - ID of the sound to play
 * @returns {void}
 */
function playSound(soundId) {
  // Implementation details...
}
```

##### `setSoundEnabled(enabled)`

Enables or disables sound effects.

```javascript
/**
 * Enable or disable sound effects
 * @param {boolean} enabled - Whether sound should be enabled
 * @returns {void}
 */
function setSoundEnabled(enabled) {
  // Implementation details...
}
```

## Redux Store

### Store Configuration

The Redux store (`store/index.js`) is configured with Redux Toolkit and Redux Persist.

```javascript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import reducers
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import educationalReducer from './slices/educationalSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'game'], // Only persist user and game state
};

const rootReducer = combineReducers({
  game: gameReducer,
  ui: uiReducer,
  user: userReducer,
  educational: educationalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
```

### Redux Slices

#### Game Slice

The Game Slice (`store/slices/gameSlice.js`) manages game state.

```javascript
// Key actions
export const { 
  startNextRound, 
  processUserSelection, 
  completeGame 
} = gameSlice.actions;

// Key selectors
export const selectGameSession = (state) => state.game.gameSession;
export const selectCurrentRound = (state) => {
  const session = state.game.gameSession;
  if (!session) return null;
  return session.rounds[session.currentRound - 1];
};
```

#### UI Slice

The UI Slice (`store/slices/uiSlice.js`) manages UI state.

```javascript
// Key actions
export const { 
  setScreen, 
  showModal, 
  hideModal, 
  setLoading, 
  setError 
} = uiSlice.actions;

// Key selectors
export const selectCurrentScreen = (state) => state.ui.currentScreen;
export const selectModal = (state) => state.ui.modal;
```

#### User Slice

The User Slice (`store/slices/userSlice.js`) manages user settings and progress.

```javascript
// Key actions
export const { 
  updateSettings, 
  updateProgress, 
  resetProgress 
} = userSlice.actions;

// Key selectors
export const selectUserSettings = (state) => state.user.settings;
export const selectUserProgress = (state) => state.user.progress;
```

#### Educational Slice

The Educational Slice (`store/slices/educationalSlice.js`) manages educational content.

```javascript
// Key actions
export const { 
  setCurrentMessage, 
  addEncounteredConcept, 
  setTakeaways 
} = educationalSlice.actions;

// Key selectors
export const selectCurrentMessage = (state) => state.educational.currentMessage;
export const selectTakeaways = (state) => state.educational.takeaways;
```

## Data Structures

### Word Database

The Word Database (`data/wordDatabase.js`) contains the word data used in the game.

```javascript
export const wordDatabase = [
  {
    id: "word_001",
    text: "bank",
    difficulty: "easy",
    categories: ["noun", "verb", "homonym"],
    meanings: [
      {
        id: "meaning_001",
        definition: "A financial institution...",
        partOfSpeech: "noun",
        exampleSentences: ["I need to go to the bank..."],
        contradictionSentences: ["After the heavy rain, the river bank..."],
        isArchaic: false,
        synonyms: ["financial institution", "credit union"]
      },
      // Additional meanings...
    ],
    notes: "Classic example of a homonym..."
  },
  // Additional words...
];
```

### Educational Content

The Educational Content (`data/educationalContent.js`) contains educational messages, concepts, and takeaways.

```javascript
export const educationalMessages = [
  {
    id: "edu_msg_001",
    text: "Words have no inherent meaning without context...",
    category: "context",
    difficulty: "easy",
    relatedWords: []
  },
  // Additional messages...
];

export const linguisticConcepts = [
  {
    id: "context_dependency",
    name: "Context Dependency",
    description: "The principle that words derive their meaning...",
    examples: ["The word 'bank' means something completely different..."],
    relatedConcepts: ["ambiguity", "polysemy", "homonymy"]
  },
  // Additional concepts...
];

export const educationalTakeaways = [
  {
    id: "takeaway_001",
    text: "Words have no inherent meaning without context...",
    conceptId: "context_dependency",
    difficulty: "easy"
  },
  // Additional takeaways...
];
```

## Component Props

### Common Components

#### Button

```javascript
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node
};
```

#### Header

```javascript
Header.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
  onBackClick: PropTypes.func,
  rightContent: PropTypes.node
};
```

#### ProgressBar

```javascript
ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'error']),
  showText: PropTypes.bool
};
```

### Game Components

#### WordDisplay

```javascript
WordDisplay.propTypes = {
  word: PropTypes.string.isRequired,
  instruction: PropTypes.string,
  highlighted: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};
```

#### OptionButton

```javascript
OptionButton.propTypes = {
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  correct: PropTypes.bool,
  incorrect: PropTypes.bool
};
```

#### TimerDisplay

```javascript
TimerDisplay.propTypes = {
  timeRemaining: PropTypes.number.isRequired,
  timeLimit: PropTypes.number.isRequired,
  onTimeExpired: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'warning', 'danger'])
};
```

#### ContradictionDisplay

```javascript
ContradictionDisplay.propTypes = {
  contradictionData: PropTypes.shape({
    sentence: PropTypes.string.isRequired,
    highlightedSentence: PropTypes.string.isRequired,
    meaning: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired
  }).isRequired,
  selectedMeaning: PropTypes.string.isRequired,
  educationalMessage: PropTypes.string
};
```

## Utility Functions

### String Utilities

```javascript
/**
 * Highlight a specific word in a sentence
 * @param {string} sentence - The full sentence
 * @param {string} word - The word to highlight
 * @returns {string} HTML string with highlighted word
 */
export function highlightWord(sentence, word) {
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  return sentence.replace(regex, `<span class="highlight">$&</span>`);
}
```

### Array Utilities

```javascript
/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
```

### Time Utilities

```javascript
/**
 * Format seconds as MM:SS
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
```

## Conclusion

This API reference provides a comprehensive overview of the key functions, components, and data structures used in the "Words Without Meaning" game. Developers can use this documentation to understand how the different parts of the application work together and how to extend or modify the functionality.
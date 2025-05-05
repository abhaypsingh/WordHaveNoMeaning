/**
 * Storage service for handling local storage operations
 */
import { manageStorage, optimizeStorage } from './storageManagementService';

// Keys for local storage
const STORAGE_KEYS = {
  USER_SETTINGS: 'words_without_meaning_user_settings',
  CURRENT_GAME: 'words_without_meaning_current_game',
  COMPLETED_GAMES: 'words_without_meaning_completed_games',
  USER_PROGRESS: 'words_without_meaning_user_progress',
  HAS_SEEN_TUTORIAL: 'words_without_meaning_has_seen_tutorial',
};

// Run storage management on service initialization
manageStorage();

/**
 * Gets user settings from local storage
 * @returns {Object} - The user settings or default settings if none found
 */
export const getUserSettings = () => {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    
    // Default settings
    const defaultSettings = {
      defaultDifficulty: 'medium',
      defaultRoundCount: 10,
      defaultTimeLimit: 30,
      soundEnabled: true,
      theme: 'default',
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReaderOptimized: false,
      },
    };
    
    // Save default settings
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(defaultSettings));
    
    return defaultSettings;
  } catch (error) {
    console.error('Error getting user settings:', error);
    
    // Return default settings on error
    return {
      defaultDifficulty: 'medium',
      defaultRoundCount: 10,
      defaultTimeLimit: 30,
      soundEnabled: true,
      theme: 'default',
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReaderOptimized: false,
      },
    };
  }
};

/**
 * Updates user settings in local storage
 * @param {Object} newSettings - The new settings to save
 * @returns {boolean} - True if successful, false otherwise
 */
export const updateUserSettings = (newSettings) => {
  try {
    const currentSettings = getUserSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updatedSettings));
    
    return true;
  } catch (error) {
    console.error('Error updating user settings:', error);
    return false;
  }
};

/**
 * Gets the current game session from local storage
 * @returns {Object|null} - The current game session or null if none found
 */
export const getCurrentGame = () => {
  try {
    const storedGame = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    
    if (storedGame) {
      const gameSession = JSON.parse(storedGame);
      
      // Convert date strings back to Date objects
      if (gameSession.startTime) {
        gameSession.startTime = new Date(gameSession.startTime);
      }
      
      if (gameSession.endTime) {
        gameSession.endTime = new Date(gameSession.endTime);
      }
      
      // Validate game session integrity
      if (!isValidGameSession(gameSession)) {
        console.warn('Invalid game session detected, clearing session');
        clearCurrentGame();
        return null;
      }
      
      return gameSession;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current game:', error);
    // Clear corrupted game data
    clearCurrentGame();
    return null;
  }
};

/**
 * Validates a game session object to ensure it has all required properties
 * @param {Object} gameSession - The game session to validate
 * @returns {boolean} - Whether the game session is valid
 */
const isValidGameSession = (gameSession) => {
  // Check for required properties
  if (!gameSession ||
      typeof gameSession !== 'object' ||
      !gameSession.id ||
      !gameSession.settings ||
      typeof gameSession.currentRound !== 'number' ||
      typeof gameSession.totalRounds !== 'number' ||
      !Array.isArray(gameSession.rounds)) {
    return false;
  }
  
  // Check if rounds array matches the expected length
  if (gameSession.rounds.length !== gameSession.totalRounds) {
    return false;
  }
  
  // Check if current round is valid
  if (gameSession.currentRound < 0 || gameSession.currentRound > gameSession.totalRounds) {
    return false;
  }
  
  return true;
};

/**
 * Saves the current game session to local storage
 * @param {Object} gameSession - The game session to save
 * @returns {boolean} - True if successful, false otherwise
 */
export const saveCurrentGame = (gameSession) => {
  try {
    if (!gameSession) {
      return false;
    }
    
    // Create a timestamp for the save
    const saveData = {
      ...gameSession,
      lastSaved: new Date()
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(saveData));
    
    // Create a backup copy for recovery
    localStorage.setItem(`${STORAGE_KEYS.CURRENT_GAME}_backup`, JSON.stringify(saveData));
    
    return true;
  } catch (error) {
    console.error('Error saving current game:', error);
    return false;
  }
};

/**
 * Clears the current game session from local storage
 * @returns {boolean} - True if successful, false otherwise
 */
export const clearCurrentGame = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
    localStorage.removeItem(`${STORAGE_KEYS.CURRENT_GAME}_backup`);
    
    return true;
  } catch (error) {
    console.error('Error clearing current game:', error);
    return false;
  }
};

/**
 * Attempts to recover a game session if the primary save is corrupted
 * @returns {Object|null} - The recovered game session or null if recovery failed
 */
export const recoverGameSession = () => {
  try {
    // Try to get the backup
    const backupGame = localStorage.getItem(`${STORAGE_KEYS.CURRENT_GAME}_backup`);
    
    if (backupGame) {
      const gameSession = JSON.parse(backupGame);
      
      // Convert date strings back to Date objects
      if (gameSession.startTime) {
        gameSession.startTime = new Date(gameSession.startTime);
      }
      
      if (gameSession.endTime) {
        gameSession.endTime = new Date(gameSession.endTime);
      }
      
      // Validate the backup
      if (isValidGameSession(gameSession)) {
        // Restore the backup to the primary save
        localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, backupGame);
        return gameSession;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error recovering game session:', error);
    return null;
  }
};

/**
 * Gets completed games from local storage
 * @returns {Array} - Array of completed game sessions
 */
export const getCompletedGames = () => {
  try {
    const storedGames = localStorage.getItem(STORAGE_KEYS.COMPLETED_GAMES);
    
    if (storedGames) {
      const games = JSON.parse(storedGames);
      
      // Convert date strings back to Date objects
      games.forEach(game => {
        if (game.startTime) {
          game.startTime = new Date(game.startTime);
        }
        
        if (game.endTime) {
          game.endTime = new Date(game.endTime);
        }
      });
      
      return games;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting completed games:', error);
    return [];
  }
};

/**
 * Saves a completed game to local storage
 * @param {Object} gameSession - The completed game session to save
 * @returns {boolean} - True if successful, false otherwise
 */
export const saveCompletedGame = (gameSession) => {
  try {
    if (!gameSession || !gameSession.completed) {
      return false;
    }
    
    // Run storage optimization before saving
    optimizeStorage();
    
    const completedGames = getCompletedGames();
    
    // Check if game already exists in completed games
    const existingIndex = completedGames.findIndex(game => game.id === gameSession.id);
    
    if (existingIndex >= 0) {
      // Update existing game
      completedGames[existingIndex] = gameSession;
    } else {
      // Add new game
      completedGames.push(gameSession);
    }
    
    // Limit to last 20 games
    const limitedGames = completedGames.slice(-20);
    
    localStorage.setItem(STORAGE_KEYS.COMPLETED_GAMES, JSON.stringify(limitedGames));
    
    return true;
  } catch (error) {
    console.error('Error saving completed game:', error);
    return false;
  }
};

/**
 * Gets user progress from local storage
 * @returns {Object} - The user progress or default progress if none found
 */
export const getUserProgress = () => {
  try {
    const storedProgress = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    
    if (storedProgress) {
      const progress = JSON.parse(storedProgress);
      
      // Convert date strings back to Date objects
      if (progress.lastPlayed) {
        progress.lastPlayed = new Date(progress.lastPlayed);
      }
      
      return progress;
    }
    
    // Default progress
    const defaultProgress = {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      wordsEncountered: [],
      conceptsLearned: [],
      difficultyProgression: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      lastPlayed: null,
    };
    
    // Save default progress
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(defaultProgress));
    
    return defaultProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    
    // Return default progress on error
    return {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      wordsEncountered: [],
      conceptsLearned: [],
      difficultyProgression: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      lastPlayed: null,
    };
  }
};

/**
 * Updates user progress in local storage
 * @param {Object} newProgress - The new progress to save
 * @returns {boolean} - True if successful, false otherwise
 */
export const updateUserProgress = (newProgress) => {
  try {
    const currentProgress = getUserProgress();
    const updatedProgress = { ...currentProgress, ...newProgress };
    
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updatedProgress));
    
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

/**
 * Checks if the user has seen the tutorial
 * @returns {boolean} - True if the user has seen the tutorial, false otherwise
 */
export const hasSeenTutorial = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_TUTORIAL);
    return value === 'true';
  } catch (error) {
    console.error('Error checking if user has seen tutorial:', error);
    return false;
  }
};

/**
 * Marks the tutorial as seen
 * @returns {boolean} - True if successful, false otherwise
 */
export const markTutorialSeen = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_TUTORIAL, 'true');
    return true;
  } catch (error) {
    console.error('Error marking tutorial as seen:', error);
    return false;
  }
};

/**
 * Clears all data from local storage
 * @returns {boolean} - True if successful, false otherwise
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      // Also remove any backup files
      localStorage.removeItem(`${key}_backup`);
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Initializes the storage service
 * This should be called when the application starts
 */
export const initializeStorageService = () => {
  try {
    // Run storage management
     manageStorage();
    
    // Log storage status
   
    
    return true;
  } catch (error) {
    console.error('Error initializing storage service:', error);
    return false;
  }
};
/**
 * Storage Management Service
 * 
 * This service provides utilities for managing localStorage usage,
 * preventing storage limits from being reached, and optimizing storage.
 */

// Constants
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB (typical localStorage limit)
const STORAGE_WARNING_THRESHOLD = 0.8; // 80% of max storage
const MAX_COMPLETED_GAMES = 20; // Maximum number of completed games to store

/**
 * Checks the current localStorage usage
 * @returns {Object} - Object containing usage information
 */
export const checkStorageUsage = () => {
  try {
    let totalSize = 0;
    let itemCount = 0;
    let largestItem = { key: null, size: 0 };
    
    // Calculate size of all items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const size = new Blob([value]).size;
      
      totalSize += size;
      itemCount++;
      
      if (size > largestItem.size) {
        largestItem = { key, size };
      }
    }
    
    return {
      totalSize,
      percentUsed: totalSize / MAX_STORAGE_SIZE,
      itemCount,
      largestItem,
      isNearLimit: totalSize > (STORAGE_WARNING_THRESHOLD * MAX_STORAGE_SIZE),
    };
  } catch (error) {
    console.error('Error checking storage usage:', error);
    return {
      totalSize: 0,
      percentUsed: 0,
      itemCount: 0,
      largestItem: { key: null, size: 0 },
      isNearLimit: false,
      error: error.message,
    };
  }
};

/**
 * Optimizes storage by removing oldest completed games if near limit
 * @returns {boolean} - True if optimization was performed, false otherwise
 */
export const optimizeStorage = () => {
  try {
    const usage = checkStorageUsage();
    
    // If we're near the limit, perform optimization
    if (usage.isNearLimit) {
      const completedGamesKey = 'words_without_meaning_completed_games';
      const completedGamesStr = localStorage.getItem(completedGamesKey);
      
      if (completedGamesStr) {
        let completedGames = JSON.parse(completedGamesStr);
        
        if (Array.isArray(completedGames) && completedGames.length > MAX_COMPLETED_GAMES) {
          // Sort by date (newest first)
          completedGames.sort((a, b) => {
            const dateA = a.endTime ? new Date(a.endTime) : new Date(0);
            const dateB = b.endTime ? new Date(b.endTime) : new Date(0);
            return dateB - dateA;
          });
          
          // Keep only the most recent games
          const trimmedGames = completedGames.slice(0, MAX_COMPLETED_GAMES);
          
          // Save back to storage
          localStorage.setItem(completedGamesKey, JSON.stringify(trimmedGames));
          
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error optimizing storage:', error);
    return false;
  }
};

/**
 * Cleans up old or corrupted data
 * @returns {boolean} - True if cleanup was performed, false otherwise
 */
export const cleanupStorage = () => {
  try {
    // Remove any backup files older than 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Find all backup keys
    const backupKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.endsWith('_backup')) {
        backupKeys.push(key);
      }
    }
    
    // Check each backup for age
    let cleanupPerformed = false;
    backupKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const data = JSON.parse(value);
          if (data.lastSaved) {
            const savedDate = new Date(data.lastSaved);
            if (savedDate < sevenDaysAgo) {
              localStorage.removeItem(key);
              cleanupPerformed = true;
            }
          }
        } catch (e) {
          // If we can't parse it, it's corrupted, so remove it
          localStorage.removeItem(key);
          cleanupPerformed = true;
        }
      }
    });
    
    return cleanupPerformed;
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    return false;
  }
};

/**
 * Performs a full storage management cycle
 * @returns {Object} - Results of the management operations
 */
export const manageStorage = () => {
  try {
    const initialUsage = checkStorageUsage();
    const optimized = optimizeStorage();
    const cleaned = cleanupStorage();
    const finalUsage = checkStorageUsage();
    
    return {
      initialUsage,
      finalUsage,
      optimized,
      cleaned,
      spaceFreed: initialUsage.totalSize - finalUsage.totalSize,
    };
  } catch (error) {
    console.error('Error managing storage:', error);
    return {
      error: error.message,
      initialUsage: null,
      finalUsage: null,
      optimized: false,
      cleaned: false,
      spaceFreed: 0,
    };
  }
};
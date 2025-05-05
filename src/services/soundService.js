/**
 * Sound service for handling sound effects
 */

// Sound effect URLs
const SOUND_EFFECTS = {
  BUTTON_CLICK: '/sounds/button-click.mp3',
  OPTION_SELECT: '/sounds/option-select.mp3',
  CORRECT_ANSWER: '/sounds/correct-answer.mp3',
  INCORRECT_ANSWER: '/sounds/incorrect-answer.mp3',
  CONTRADICTION_REVEAL: '/sounds/contradiction-reveal.mp3',
  ROUND_COMPLETE: '/sounds/round-complete.mp3',
  GAME_COMPLETE: '/sounds/game-complete.mp3',
  TIMER_TICK: '/sounds/timer-tick.mp3',
  TIMER_EXPIRE: '/sounds/timer-expire.mp3',
};

// Audio objects cache
const audioCache = {};

// Global sound settings
let soundEnabled = true;
let volume = 1.0;

/**
 * Initializes the sound service
 * @param {boolean} enabled - Whether sound is enabled
 * @param {number} initialVolume - Initial volume level (0.0 to 1.0)
 */
export const initSoundService = (enabled = true, initialVolume = 1.0) => {
  soundEnabled = enabled;
  volume = Math.max(0, Math.min(1, initialVolume));
  
  // Preload sound effects
  if (soundEnabled) {
    Object.values(SOUND_EFFECTS).forEach(url => {
      preloadSound(url);
    });
  }
};

/**
 * Preloads a sound effect
 * @param {string} url - URL of the sound effect
 */
const preloadSound = (url) => {
  if (!audioCache[url]) {
    try {
      const audio = new Audio(url);
      audio.load();
      audioCache[url] = audio;
    } catch (error) {
      console.error(`Error preloading sound: ${url}`, error);
    }
  }
};

/**
 * Plays a sound effect
 * @param {string} soundName - Name of the sound effect to play
 * @returns {Promise<void>} - A promise that resolves when the sound finishes playing
 */
export const playSound = (soundName) => {
  return new Promise((resolve) => {
    if (!soundEnabled) {
      resolve();
      return;
    }
    
    const url = SOUND_EFFECTS[soundName];
    
    if (!url) {
      console.error(`Sound effect not found: ${soundName}`);
      resolve();
      return;
    }
    
    try {
      let audio = audioCache[url];
      
      if (!audio) {
        // If not cached, create and cache it
        audio = new Audio(url);
        audioCache[url] = audio;
      } else {
        // Reset audio if it's already playing
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Set volume
      audio.volume = volume;
      
      // Play the sound
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Sound started playing successfully
            audio.onended = () => {
              resolve();
            };
          })
          .catch(error => {
            // Auto-play was prevented or there was another error
            console.error(`Error playing sound: ${soundName}`, error);
            resolve();
          });
      } else {
        // Older browsers might not return a promise
        audio.onended = () => {
          resolve();
        };
      }
    } catch (error) {
      console.error(`Error playing sound: ${soundName}`, error);
      resolve();
    }
  });
};

/**
 * Plays a button click sound
 */
export const playButtonClick = () => {
  playSound('BUTTON_CLICK');
};

/**
 * Plays an option select sound
 */
export const playOptionSelect = () => {
  playSound('OPTION_SELECT');
};

/**
 * Plays a correct answer sound
 */
export const playCorrectAnswer = () => {
  playSound('CORRECT_ANSWER');
};

/**
 * Plays an incorrect answer sound
 */
export const playIncorrectAnswer = () => {
  playSound('INCORRECT_ANSWER');
};

/**
 * Plays a contradiction reveal sound
 */
export const playContradictionReveal = () => {
  playSound('CONTRADICTION_REVEAL');
};

/**
 * Plays a round complete sound
 */
export const playRoundComplete = () => {
  playSound('ROUND_COMPLETE');
};

/**
 * Plays a game complete sound
 */
export const playGameComplete = () => {
  playSound('GAME_COMPLETE');
};

/**
 * Plays a timer tick sound
 */
export const playTimerTick = () => {
  playSound('TIMER_TICK');
};

/**
 * Plays a timer expire sound
 */
export const playTimerExpire = () => {
  playSound('TIMER_EXPIRE');
};

/**
 * Enables or disables sound
 * @param {boolean} enabled - Whether sound should be enabled
 */
export const enableSound = (enabled) => {
  soundEnabled = enabled;
};

/**
 * Sets the volume level
 * @param {number} level - Volume level (0.0 to 1.0)
 */
export const setVolume = (level) => {
  volume = Math.max(0, Math.min(1, level));
};

/**
 * Checks if sound is enabled
 * @returns {boolean} - Whether sound is enabled
 */
export const isSoundEnabled = () => {
  return soundEnabled;
};

/**
 * Gets the current volume level
 * @returns {number} - Current volume level (0.0 to 1.0)
 */
export const getVolume = () => {
  return volume;
};

/**
 * Stops all playing sounds
 */
export const stopAllSounds = () => {
  Object.values(audioCache).forEach(audio => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.error('Error stopping sound', error);
    }
  });
};
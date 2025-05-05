import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  settings: {
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
  },
  progress: {
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
  },
  hasSeenTutorial: false,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    updateAccessibilitySettings: (state, action) => {
      state.settings.accessibility = {
        ...state.settings.accessibility,
        ...action.payload,
      };
    },
    markTutorialSeen: (state) => {
      state.hasSeenTutorial = true;
    },
    recordGamePlayed: (state, action) => {
      const { score, difficulty, wordsEncountered, conceptsLearned } = action.payload;
      
      // Update games played
      state.progress.gamesPlayed += 1;
      
      // Update score
      state.progress.totalScore += score;
      state.progress.averageScore = state.progress.totalScore / state.progress.gamesPlayed;
      
      // Update difficulty progression
      if (difficulty && state.progress.difficultyProgression[difficulty] !== undefined) {
        state.progress.difficultyProgression[difficulty] += 1;
      }
      
      // Update words encountered
      if (wordsEncountered && Array.isArray(wordsEncountered)) {
        const newWords = wordsEncountered.filter(word => !state.progress.wordsEncountered.includes(word));
        state.progress.wordsEncountered = [...state.progress.wordsEncountered, ...newWords];
      }
      
      // Update concepts learned
      if (conceptsLearned && Array.isArray(conceptsLearned)) {
        const newConcepts = conceptsLearned.filter(concept => !state.progress.conceptsLearned.includes(concept));
        state.progress.conceptsLearned = [...state.progress.conceptsLearned, ...newConcepts];
      }
      
      // Update last played
      state.progress.lastPlayed = new Date().toISOString();
    },
    resetProgress: (state) => {
      state.progress = initialState.progress;
    },
  },
});

// Export actions and reducer
export const {
  updateSettings,
  updateAccessibilitySettings,
  markTutorialSeen,
  recordGamePlayed,
  resetProgress,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUserSettings = (state) => state.user.settings;
export const selectAccessibilitySettings = (state) => state.user.settings.accessibility;
export const selectDefaultDifficulty = (state) => state.user.settings.defaultDifficulty;
export const selectDefaultRoundCount = (state) => state.user.settings.defaultRoundCount;
export const selectDefaultTimeLimit = (state) => state.user.settings.defaultTimeLimit;
export const selectSoundEnabled = (state) => state.user.settings.soundEnabled;
export const selectUserTheme = (state) => state.user.settings.theme;
export const selectHasSeenTutorial = (state) => state.user.hasSeenTutorial;
export const selectUserProgress = (state) => state.user.progress;
export const selectGamesPlayed = (state) => state.user.progress.gamesPlayed;
export const selectTotalScore = (state) => state.user.progress.totalScore;
export const selectAverageScore = (state) => state.user.progress.averageScore;
export const selectWordsEncountered = (state) => state.user.progress.wordsEncountered;
export const selectConceptsLearned = (state) => state.user.progress.conceptsLearned;
export const selectDifficultyProgression = (state) => state.user.progress.difficultyProgression;
export const selectLastPlayed = (state) => state.user.progress.lastPlayed;
import userReducer, {
  setUserSettings,
  loadUserSettings,
  saveUserProgress,
  loadUserProgress,
  resetUserProgress,
  selectUserSettings,
  selectUserProgress,
  selectUserLoading,
  selectUserError
} from '../../../store/slices/userSlice';
import { getUserSettings, saveUserSettings, getUserProgress, saveUserProgress as saveProgress } from '../../../services/storageService';

// Mock dependencies
jest.mock('../../../services/storageService');

describe('userSlice', () => {
  // Mock data
  const mockSettings = {
    difficulty: 'medium',
    roundCount: 15,
    timeLimit: 20,
    soundEnabled: true,
    theme: 'dark'
  };

  const mockProgress = {
    completedGames: 2,
    totalScore: 350,
    highestScore: 200,
    averageScore: 175,
    conceptsEncountered: ['context_dependence', 'ambiguity'],
    lastPlayed: new Date(2023, 0, 1).toISOString()
  };

  // Initial state
  const initialState = {
    settings: {
      difficulty: 'easy',
      roundCount: 10,
      timeLimit: 30,
      soundEnabled: true,
      theme: 'light'
    },
    progress: {
      completedGames: 0,
      totalScore: 0,
      highestScore: 0,
      averageScore: 0,
      conceptsEncountered: [],
      lastPlayed: null
    },
    loading: false,
    error: null
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    getUserSettings.mockResolvedValue(mockSettings);
    saveUserSettings.mockResolvedValue(undefined);
    getUserProgress.mockResolvedValue(mockProgress);
    saveProgress.mockResolvedValue(undefined);
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle setUserSettings', () => {
      // Arrange
      const settings = {
        difficulty: 'hard',
        roundCount: 20
      };
      
      // Act
      const nextState = userReducer(initialState, setUserSettings(settings));
      
      // Assert
      expect(nextState.settings).toEqual({
        ...initialState.settings,
        ...settings
      });
    });
  });

  describe('async thunks', () => {
    describe('loadUserSettings', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: loadUserSettings.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set settings when fulfilled', () => {
        // Arrange
        const action = {
          type: loadUserSettings.fulfilled.type,
          payload: mockSettings
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.settings).toEqual(mockSettings);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to load settings';
        const action = {
          type: loadUserSettings.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('saveUserProgress', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: saveUserProgress.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should update progress when fulfilled', () => {
        // Arrange
        const gameResult = {
          score: 150,
          conceptsEncountered: ['context_dependence']
        };
        const updatedProgress = {
          completedGames: 1,
          totalScore: 150,
          highestScore: 150,
          averageScore: 150,
          conceptsEncountered: ['context_dependence'],
          lastPlayed: expect.any(String)
        };
        const action = {
          type: saveUserProgress.fulfilled.type,
          payload: updatedProgress
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.progress).toEqual(updatedProgress);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to save progress';
        const action = {
          type: saveUserProgress.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('loadUserProgress', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: loadUserProgress.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set progress when fulfilled', () => {
        // Arrange
        const action = {
          type: loadUserProgress.fulfilled.type,
          payload: mockProgress
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.progress).toEqual(mockProgress);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to load progress';
        const action = {
          type: loadUserProgress.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('resetUserProgress', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: resetUserProgress.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should reset progress when fulfilled', () => {
        // Arrange
        const action = {
          type: resetUserProgress.fulfilled.type
        };
        const state = {
          ...initialState,
          loading: true,
          progress: mockProgress
        };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.progress).toEqual(initialState.progress);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to reset progress';
        const action = {
          type: resetUserProgress.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = userReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });
  });

  describe('selectors', () => {
    it('selectUserSettings should return the user settings', () => {
      // Arrange
      const state = { user: { settings: mockSettings } };

      // Act
      const result = selectUserSettings(state);

      // Assert
      expect(result).toBe(mockSettings);
    });

    it('selectUserProgress should return the user progress', () => {
      // Arrange
      const state = { user: { progress: mockProgress } };

      // Act
      const result = selectUserProgress(state);

      // Assert
      expect(result).toBe(mockProgress);
    });

    it('selectUserLoading should return the loading state', () => {
      // Arrange
      const state = { user: { loading: true } };

      // Act
      const result = selectUserLoading(state);

      // Assert
      expect(result).toBe(true);
    });

    it('selectUserError should return the error state', () => {
      // Arrange
      const error = 'Some error';
      const state = { user: { error } };

      // Act
      const result = selectUserError(state);

      // Assert
      expect(result).toBe(error);
    });
  });
});
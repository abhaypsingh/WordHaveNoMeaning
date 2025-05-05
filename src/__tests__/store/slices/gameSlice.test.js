import gameReducer, {
  resetGame,
  initializeGame,
  startNextRound,
  processUserSelection,
  completeGame,
  selectGameSession,
  selectCurrentRound,
  selectGameLoading,
  selectGameError
} from '../../../store/slices/gameSlice';
import { selectWordsForGame } from '../../../services/wordService';

// Mock dependencies
jest.mock('../../../services/wordService');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

describe('gameSlice', () => {
  // Mock data
  const mockWord1 = {
    id: 'word1',
    text: 'bank',
    difficulty: 'easy',
    categories: ['noun', 'finance'],
    meanings: [
      {
        id: 'meaning1',
        definition: 'A financial institution',
        partOfSpeech: 'noun',
        contradictionSentences: ['I went to the bank to deposit money.']
      },
      {
        id: 'meaning2',
        definition: 'The land alongside a river',
        partOfSpeech: 'noun',
        contradictionSentences: ['We had a picnic on the river bank.']
      }
    ]
  };

  const mockWord2 = {
    id: 'word2',
    text: 'run',
    difficulty: 'medium',
    categories: ['verb', 'physical'],
    meanings: [
      {
        id: 'meaning3',
        definition: 'To move quickly on foot',
        partOfSpeech: 'verb',
        contradictionSentences: ['I run every morning to stay fit.']
      },
      {
        id: 'meaning4',
        definition: 'To operate or manage',
        partOfSpeech: 'verb',
        contradictionSentences: ['She runs a successful business.']
      }
    ]
  };

  const mockSettings = {
    difficulty: 'easy',
    roundCount: 2,
    timeLimit: 30,
    soundEnabled: true
  };

  // Initial state
  const initialState = {
    gameSession: null,
    loading: false,
    error: null,
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    selectWordsForGame.mockResolvedValue([mockWord1, mockWord2]);
    
    // Reset Math.random to be deterministic
    global.Math.random = jest.fn(() => 0.5);
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(gameReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle resetGame', () => {
      // Arrange
      const state = {
        gameSession: { id: 'session1' },
        loading: true,
        error: 'Some error'
      };

      // Act
      const nextState = gameReducer(state, resetGame());

      // Assert
      expect(nextState).toEqual(initialState);
    });
  });

  describe('async thunks', () => {
    describe('initializeGame', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: initializeGame.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set gameSession when fulfilled', () => {
        // Arrange
        const mockGameSession = { id: 'mock-uuid', settings: mockSettings };
        const action = {
          type: initializeGame.fulfilled.type,
          payload: mockGameSession
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.gameSession).toEqual(mockGameSession);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to initialize game';
        const action = {
          type: initializeGame.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
        expect(nextState.gameSession).toBeNull();
      });
    });

    describe('startNextRound', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: startNextRound.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should update currentRound when fulfilled', () => {
        // Arrange
        const nextRound = 2;
        const action = {
          type: startNextRound.fulfilled.type,
          payload: nextRound
        };
        const state = {
          ...initialState,
          loading: true,
          gameSession: { currentRound: 1 }
        };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.gameSession.currentRound).toBe(nextRound);
        expect(nextState.loading).toBe(false);
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to start next round';
        const action = {
          type: startNextRound.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('processUserSelection', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: processUserSelection.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should update round data when fulfilled', () => {
        // Arrange
        const roundData = {
          roundIndex: 0,
          optionIndex: 1,
          timeSpent: 15,
          score: 100
        };
        const action = {
          type: processUserSelection.fulfilled.type,
          payload: roundData
        };
        const state = {
          ...initialState,
          loading: true,
          gameSession: {
            score: 0,
            rounds: [
              {
                selectedOption: null,
                timeSpent: 0,
                score: 0,
                completed: false
              }
            ]
          }
        };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.gameSession.rounds[0].selectedOption).toBe(1);
        expect(nextState.gameSession.rounds[0].timeSpent).toBe(15);
        expect(nextState.gameSession.rounds[0].score).toBe(100);
        expect(nextState.gameSession.rounds[0].completed).toBe(true);
        expect(nextState.gameSession.score).toBe(100);
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to process selection';
        const action = {
          type: processUserSelection.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('completeGame', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: completeGame.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should mark game as completed when fulfilled', () => {
        // Arrange
        const completionData = {
          endTime: new Date().toISOString()
        };
        const action = {
          type: completeGame.fulfilled.type,
          payload: completionData
        };
        const state = {
          ...initialState,
          loading: true,
          gameSession: {
            completed: false
          }
        };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.gameSession.completed).toBe(true);
        expect(nextState.gameSession.endTime).toBe(completionData.endTime);
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to complete game';
        const action = {
          type: completeGame.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = gameReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });
  });

  describe('selectors', () => {
    it('selectGameSession should return the game session', () => {
      // Arrange
      const gameSession = { id: 'session1' };
      const state = { game: { gameSession } };

      // Act
      const result = selectGameSession(state);

      // Assert
      expect(result).toBe(gameSession);
    });

    it('selectCurrentRound should return the current round', () => {
      // Arrange
      const round = { roundNumber: 1, word: mockWord1 };
      const state = {
        game: {
          gameSession: {
            currentRound: 1,
            rounds: [round]
          }
        }
      };

      // Act
      const result = selectCurrentRound(state);

      // Assert
      expect(result).toBe(round);
    });

    it('selectCurrentRound should return null if no current round', () => {
      // Arrange
      const state = {
        game: {
          gameSession: {
            currentRound: 0,
            rounds: []
          }
        }
      };

      // Act
      const result = selectCurrentRound(state);

      // Assert
      expect(result).toBeNull();
    });

    it('selectGameLoading should return the loading state', () => {
      // Arrange
      const state = { game: { loading: true } };

      // Act
      const result = selectGameLoading(state);

      // Assert
      expect(result).toBe(true);
    });

    it('selectGameError should return the error state', () => {
      // Arrange
      const error = 'Some error';
      const state = { game: { error } };

      // Act
      const result = selectGameError(state);

      // Assert
      expect(result).toBe(error);
    });
  });
});
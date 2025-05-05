import {
  initializeGame,
  startNextRound,
  getCurrentRound,
  processUserSelection,
  getContradictionSentence,
  completeGame
} from '../../services/gameService';
import { selectWordsForGame, getDistractorsForWord } from '../../services/wordService';
import { recordConceptExposure } from '../../services/educationalService';

// Mock dependencies
jest.mock('../../services/wordService');
jest.mock('../../services/educationalService');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

describe('gameService', () => {
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

  const mockDistractors = [
    {
      id: 'distractor1',
      definition: 'To prepare food by heating it in an oven',
      forWordTypes: ['verb'],
      difficulty: 'easy'
    },
    {
      id: 'distractor2',
      definition: 'A small, round fruit with red or green skin',
      forWordTypes: ['noun'],
      difficulty: 'easy'
    }
  ];

  const mockSettings = {
    difficulty: 'easy',
    roundCount: 2,
    timeLimit: 30,
    soundEnabled: true
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    selectWordsForGame.mockResolvedValue([mockWord1, mockWord2]);
    getDistractorsForWord.mockResolvedValue(mockDistractors);
    recordConceptExposure.mockResolvedValue(undefined);
    
    // Reset Math.random to be deterministic
    global.Math.random = jest.fn(() => 0.5);
  });

  describe('initializeGame', () => {
    it('should initialize a game session with the provided settings', async () => {
      // Act
      const result = await initializeGame(mockSettings);

      // Assert
      expect(result).toHaveProperty('id', 'mock-uuid');
      expect(result).toHaveProperty('startTime');
      expect(result).toHaveProperty('settings', mockSettings);
      expect(result).toHaveProperty('currentRound', 0);
      expect(result).toHaveProperty('totalRounds', 2);
      expect(result).toHaveProperty('rounds');
      expect(result.rounds).toHaveLength(2);
      expect(selectWordsForGame).toHaveBeenCalledWith('easy', 2);
    });

    it('should create rounds with options for each word', async () => {
      // Act
      const result = await initializeGame(mockSettings);

      // Assert
      expect(result.rounds[0]).toHaveProperty('word', mockWord1);
      expect(result.rounds[0]).toHaveProperty('options');
      expect(result.rounds[0].options).toHaveLength(4); // 4 options per round
      expect(getDistractorsForWord).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if word selection fails', async () => {
      // Arrange
      selectWordsForGame.mockRejectedValue(new Error('Word selection failed'));

      // Act & Assert
      await expect(initializeGame(mockSettings)).rejects.toThrow('Failed to initialize game');
    });
  });

  describe('startNextRound', () => {
    it('should increment the current round', async () => {
      // Arrange
      const gameSession = {
        currentRound: 0,
        totalRounds: 2,
        rounds: [
          { roundNumber: 1, completed: false },
          { roundNumber: 2, completed: false }
        ]
      };

      // Act
      const result = await startNextRound(gameSession);

      // Assert
      expect(result).toBe(true);
      expect(gameSession.currentRound).toBe(1);
    });

    it('should reset round state for the new round', async () => {
      // Arrange
      const gameSession = {
        currentRound: 0,
        totalRounds: 2,
        rounds: [
          { 
            roundNumber: 1, 
            selectedOption: 2, 
            timeSpent: 15, 
            score: 100, 
            completed: true 
          },
          { roundNumber: 2, completed: false }
        ]
      };

      // Act
      await startNextRound(gameSession);

      // Assert
      expect(gameSession.rounds[0].selectedOption).toBeNull();
      expect(gameSession.rounds[0].timeSpent).toBe(0);
      expect(gameSession.rounds[0].score).toBe(0);
      expect(gameSession.rounds[0].completed).toBe(false);
    });

    it('should return false if no more rounds available', async () => {
      // Arrange
      const gameSession = {
        currentRound: 2,
        totalRounds: 2,
        rounds: [
          { roundNumber: 1, completed: true },
          { roundNumber: 2, completed: true }
        ]
      };

      // Act
      const result = await startNextRound(gameSession);

      // Assert
      expect(result).toBe(false);
    });

    it('should throw an error if no game session provided', async () => {
      // Act & Assert
      await expect(startNextRound(null)).rejects.toThrow('No active game session');
    });
  });

  describe('getCurrentRound', () => {
    it('should return the current round', () => {
      // Arrange
      const gameSession = {
        currentRound: 1,
        rounds: [
          { roundNumber: 1, word: mockWord1 }
        ]
      };

      // Act
      const result = getCurrentRound(gameSession);

      // Assert
      expect(result).toEqual({ roundNumber: 1, word: mockWord1 });
    });

    it('should return null if no active round', () => {
      // Arrange
      const gameSession = {
        currentRound: 0,
        rounds: []
      };

      // Act
      const result = getCurrentRound(gameSession);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if no game session', () => {
      // Act
      const result = getCurrentRound(null);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('processUserSelection', () => {
    it('should process user selection and calculate score', async () => {
      // Arrange
      const gameSession = {
        settings: { difficulty: 'easy', timeLimit: 30 },
        currentRound: 1,
        score: 0,
        rounds: [
          {
            word: mockWord1,
            options: [
              { index: 0, text: 'A financial institution', isCorrect: true },
              { index: 1, text: 'The land alongside a river', isCorrect: true },
              { index: 2, text: 'To prepare food', isCorrect: false },
              { index: 3, text: 'A small fruit', isCorrect: false }
            ],
            completed: false
          }
        ]
      };
      const optionIndex = 0;
      const timeSpent = 15;

      // Act
      const result = await processUserSelection(gameSession, optionIndex, timeSpent);

      // Assert
      expect(result).toEqual(gameSession.rounds[0]);
      expect(result.selectedOption).toBe(0);
      expect(result.timeSpent).toBe(15);
      expect(result.score).toBeGreaterThan(0);
      expect(result.completed).toBe(true);
      expect(gameSession.score).toBeGreaterThan(0);
    });

    it('should record concept exposure', async () => {
      // Arrange
      const gameSession = {
        settings: { difficulty: 'easy', timeLimit: 30 },
        currentRound: 1,
        score: 0,
        rounds: [
          {
            word: mockWord1, // has 'noun' and 'finance' categories
            options: [
              { index: 0, text: 'A financial institution', isCorrect: true }
            ],
            completed: false
          }
        ]
      };

      // Act
      await processUserSelection(gameSession, 0, 15);

      // Assert
      expect(recordConceptExposure).toHaveBeenCalledWith('noun', gameSession);
    });

    it('should throw an error if no game session provided', async () => {
      // Act & Assert
      await expect(processUserSelection(null, 0, 15)).rejects.toThrow('No active game session');
    });

    it('should throw an error if no active round', async () => {
      // Arrange
      const gameSession = {
        currentRound: 0,
        rounds: []
      };

      // Act & Assert
      await expect(processUserSelection(gameSession, 0, 15)).rejects.toThrow('No active round');
    });

    it('should throw an error if round already completed', async () => {
      // Arrange
      const gameSession = {
        currentRound: 1,
        rounds: [
          { completed: true }
        ]
      };

      // Act & Assert
      await expect(processUserSelection(gameSession, 0, 15)).rejects.toThrow('Round already completed');
    });
  });

  describe('getContradictionSentence', () => {
    it('should return contradiction data for the current round', async () => {
      // Arrange
      const gameSession = {
        currentRound: 1,
        rounds: [
          {
            word: mockWord1,
            correctMeaning: {
              definition: 'A financial institution',
              contradictionSentences: ['I went to the bank to deposit money.']
            },
            completed: true
          }
        ]
      };

      // Act
      const result = await getContradictionSentence(gameSession);

      // Assert
      expect(result).toHaveProperty('sentence', 'I went to the bank to deposit money.');
      expect(result).toHaveProperty('highlightedSentence');
      expect(result).toHaveProperty('meaning', 'A financial institution');
      expect(result).toHaveProperty('explanation');
      expect(result.highlightedSentence).toContain('<span class="highlight">bank</span>');
    });

    it('should throw an error if no completed round', async () => {
      // Arrange
      const gameSession = {
        currentRound: 1,
        rounds: [
          { completed: false }
        ]
      };

      // Act & Assert
      await expect(getContradictionSentence(gameSession)).rejects.toThrow('No completed round to get contradiction for');
    });
  });

  describe('completeGame', () => {
    it('should complete the game and calculate statistics', async () => {
      // Arrange
      const startTime = new Date(2023, 0, 1, 10, 0, 0);
      const gameSession = {
        startTime,
        completed: false,
        totalRounds: 2,
        settings: { difficulty: 'medium' },
        rounds: [
          {
            timeSpent: 15,
            selectedOption: 0,
            options: [{ isCorrect: true }]
          },
          {
            timeSpent: 20,
            selectedOption: 1,
            options: [{ isCorrect: false }, { isCorrect: false }]
          }
        ]
      };

      // Act
      const result = await completeGame(gameSession);

      // Assert
      expect(gameSession.endTime).toBeDefined();
      expect(gameSession.completed).toBe(true);
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('totalRounds', 2);
      expect(result).toHaveProperty('correctAnswers', 1);
      expect(result).toHaveProperty('accuracyRate', 50);
      expect(result).toHaveProperty('averageTimePerRound', 17.5);
      expect(result).toHaveProperty('performance');
      expect(result).toHaveProperty('suggestion');
    });

    it('should throw an error if no game session provided', async () => {
      // Act & Assert
      await expect(completeGame(null)).rejects.toThrow('No active game session');
    });

    it('should throw an error if game already completed', async () => {
      // Arrange
      const gameSession = {
        completed: true
      };

      // Act & Assert
      await expect(completeGame(gameSession)).rejects.toThrow('Game already completed');
    });
  });
});
import { 
  selectWordsForGame, 
  getWordById, 
  getWordsByDifficulty, 
  getWordsByCategory,
  getDistractorsForWord
} from '../../services/wordService';
import { wordDatabase } from '../../data/wordDatabase';

// Mock the wordDatabase
jest.mock('../../data/wordDatabase', () => ({
  wordDatabase: [
    {
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
    },
    {
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
    },
    {
      id: 'word3',
      text: 'light',
      difficulty: 'hard',
      categories: ['noun', 'adjective'],
      meanings: [
        {
          id: 'meaning5',
          definition: 'Electromagnetic radiation that is visible',
          partOfSpeech: 'noun',
          contradictionSentences: ['Turn on the light so I can see.']
        },
        {
          id: 'meaning6',
          definition: 'Having little weight',
          partOfSpeech: 'adjective',
          contradictionSentences: ['This backpack is very light.']
        }
      ]
    }
  ]
}));

describe('wordService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('selectWordsForGame', () => {
    it('should select words based on difficulty and count', async () => {
      // Arrange
      const difficulty = 'easy';
      const count = 1;

      // Act
      const result = await selectWordsForGame(difficulty, count);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('easy');
    });

    it('should expand to adjacent difficulties if not enough words', async () => {
      // Arrange
      const difficulty = 'easy';
      const count = 2; // More than available 'easy' words

      // Act
      const result = await selectWordsForGame(difficulty, count);

      // Assert
      expect(result).toHaveLength(2);
      // Should include words from 'medium' difficulty
      expect(result.some(word => word.difficulty === 'medium')).toBe(true);
    });

    it('should throw an error if selection fails', async () => {
      // Arrange
      // Mock implementation to throw an error
      const mockError = new Error('Database error');
      const originalFilter = Array.prototype.filter;
      Array.prototype.filter = jest.fn(() => { throw mockError; });

      // Act & Assert
      await expect(selectWordsForGame('easy', 1)).rejects.toThrow('Failed to select words for the game');

      // Cleanup
      Array.prototype.filter = originalFilter;
    });
  });

  describe('getWordById', () => {
    it('should return a word by its ID', async () => {
      // Act
      const result = await getWordById('word1');

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('word1');
      expect(result.text).toBe('bank');
    });

    it('should throw an error if word not found', async () => {
      // Act & Assert
      await expect(getWordById('nonexistent')).rejects.toThrow('Word with ID nonexistent not found');
    });
  });

  describe('getWordsByDifficulty', () => {
    it('should return words filtered by difficulty', async () => {
      // Act
      const result = await getWordsByDifficulty('medium');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('medium');
      expect(result[0].text).toBe('run');
    });

    it('should return empty array if no words match difficulty', async () => {
      // Act
      const result = await getWordsByDifficulty('unknown');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getWordsByCategory', () => {
    it('should return words filtered by category', async () => {
      // Act
      const result = await getWordsByCategory('noun');

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every(word => word.categories.includes('noun'))).toBe(true);
    });

    it('should return empty array if no words match category', async () => {
      // Act
      const result = await getWordsByCategory('unknown');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getDistractorsForWord', () => {
    it('should return distractors for a word', async () => {
      // Arrange
      const word = wordDatabase[0]; // 'bank'
      const count = 2;

      // Act
      const result = await getDistractorsForWord(word, count);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('definition');
      expect(result[0]).toHaveProperty('forWordTypes');
    });

    it('should filter distractors appropriate for word type', async () => {
      // Arrange
      const word = {
        id: 'testWord',
        text: 'test',
        difficulty: 'easy',
        categories: ['verb'],
        meanings: []
      };
      const count = 1;

      // Act
      const result = await getDistractorsForWord(word, count);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].forWordTypes).toContain('verb');
    });
  });
});
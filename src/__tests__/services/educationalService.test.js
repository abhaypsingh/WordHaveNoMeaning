import {
  getEducationalMessage,
  recordConceptExposure,
  getConceptExplanation,
  generateLearningTakeaways
} from '../../services/educationalService';
import { educationalContent } from '../../data/educationalContent';

// Mock the educationalContent
jest.mock('../../data/educationalContent', () => ({
  educationalContent: {
    concepts: [
      {
        id: 'context_dependence',
        name: 'Context Dependence',
        description: 'Words derive their meaning from context',
        levels: ['basic', 'intermediate', 'advanced'],
        relatedConcepts: ['ambiguity']
      },
      {
        id: 'ambiguity',
        name: 'Linguistic Ambiguity',
        description: 'Words can have multiple interpretations',
        levels: ['basic', 'intermediate', 'advanced'],
        relatedConcepts: ['context_dependence']
      }
    ],
    messages: [
      {
        id: 'msg1',
        text: 'Words have no inherent meaning without context.',
        conceptId: 'context_dependence',
        difficulty: 'easy',
        type: 'introduction'
      },
      {
        id: 'msg2',
        text: 'The same word can have contradictory meanings in different contexts.',
        conceptId: 'ambiguity',
        difficulty: 'easy',
        type: 'contradiction'
      },
      {
        id: 'msg3',
        text: 'Context provides the framework for interpreting language.',
        conceptId: 'context_dependence',
        difficulty: 'medium',
        type: 'explanation'
      }
    ],
    explanations: [
      {
        id: 'exp1',
        conceptId: 'context_dependence',
        level: 'basic',
        text: 'Words are just symbols that get their meaning from how they are used.'
      },
      {
        id: 'exp2',
        conceptId: 'ambiguity',
        level: 'basic',
        text: 'Many words have multiple meanings that can be very different from each other.'
      }
    ],
    takeaways: [
      {
        id: 'takeaway1',
        text: 'Always consider context when interpreting language.',
        conceptIds: ['context_dependence'],
        requiredExposureCount: 1
      },
      {
        id: 'takeaway2',
        text: 'Words can have contradictory meanings depending on their usage.',
        conceptIds: ['ambiguity'],
        requiredExposureCount: 1
      }
    ]
  }
}));

describe('educationalService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEducationalMessage', () => {
    it('should return a message for the specified concept and type', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const messageType = 'introduction';
      const difficulty = 'easy';

      // Act
      const result = await getEducationalMessage(conceptId, messageType, difficulty);

      // Assert
      expect(result).toEqual({
        id: 'msg1',
        text: 'Words have no inherent meaning without context.',
        conceptId: 'context_dependence',
        difficulty: 'easy',
        type: 'introduction'
      });
    });

    it('should return a message of appropriate difficulty', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const messageType = 'explanation';
      const difficulty = 'medium';

      // Act
      const result = await getEducationalMessage(conceptId, messageType, difficulty);

      // Assert
      expect(result.difficulty).toBe('medium');
    });

    it('should return a fallback message if exact match not found', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const messageType = 'nonexistent';
      const difficulty = 'easy';

      // Act
      const result = await getEducationalMessage(conceptId, messageType, difficulty);

      // Assert
      expect(result).toBeDefined();
      expect(result.conceptId).toBe('context_dependence');
    });

    it('should throw an error if no message found', async () => {
      // Arrange
      const conceptId = 'nonexistent';
      const messageType = 'introduction';
      const difficulty = 'easy';

      // Act & Assert
      await expect(getEducationalMessage(conceptId, messageType, difficulty))
        .rejects.toThrow('No educational message found');
    });
  });

  describe('recordConceptExposure', () => {
    it('should add concept to encounteredConcepts if not already present', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const gameSession = {
        encounteredConcepts: []
      };

      // Act
      await recordConceptExposure(conceptId, gameSession);

      // Assert
      expect(gameSession.encounteredConcepts).toContainEqual({
        conceptId: 'context_dependence',
        exposureCount: 1,
        firstEncountered: expect.any(Date),
        lastEncountered: expect.any(Date)
      });
    });

    it('should increment exposureCount if concept already encountered', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const now = new Date();
      const gameSession = {
        encounteredConcepts: [
          {
            conceptId: 'context_dependence',
            exposureCount: 1,
            firstEncountered: new Date(now.getTime() - 1000),
            lastEncountered: new Date(now.getTime() - 1000)
          }
        ]
      };

      // Act
      await recordConceptExposure(conceptId, gameSession);

      // Assert
      expect(gameSession.encounteredConcepts[0].exposureCount).toBe(2);
      expect(gameSession.encounteredConcepts[0].lastEncountered).not.toEqual(
        gameSession.encounteredConcepts[0].firstEncountered
      );
    });

    it('should throw an error if gameSession is not provided', async () => {
      // Act & Assert
      await expect(recordConceptExposure('context_dependence', null))
        .rejects.toThrow('Invalid game session');
    });
  });

  describe('getConceptExplanation', () => {
    it('should return an explanation for the specified concept and level', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const level = 'basic';

      // Act
      const result = await getConceptExplanation(conceptId, level);

      // Assert
      expect(result).toEqual({
        id: 'exp1',
        conceptId: 'context_dependence',
        level: 'basic',
        text: 'Words are just symbols that get their meaning from how they are used.'
      });
    });

    it('should return a fallback explanation if exact level not found', async () => {
      // Arrange
      const conceptId = 'context_dependence';
      const level = 'advanced'; // No advanced explanation in mock data

      // Act
      const result = await getConceptExplanation(conceptId, level);

      // Assert
      expect(result).toBeDefined();
      expect(result.conceptId).toBe('context_dependence');
    });

    it('should throw an error if no explanation found', async () => {
      // Arrange
      const conceptId = 'nonexistent';
      const level = 'basic';

      // Act & Assert
      await expect(getConceptExplanation(conceptId, level))
        .rejects.toThrow('No concept explanation found');
    });
  });

  describe('generateLearningTakeaways', () => {
    it('should generate takeaways based on encountered concepts', async () => {
      // Arrange
      const gameSession = {
        encounteredConcepts: [
          {
            conceptId: 'context_dependence',
            exposureCount: 2,
            firstEncountered: new Date(),
            lastEncountered: new Date()
          },
          {
            conceptId: 'ambiguity',
            exposureCount: 1,
            firstEncountered: new Date(),
            lastEncountered: new Date()
          }
        ]
      };

      // Act
      const result = await generateLearningTakeaways(gameSession);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Always consider context when interpreting language.');
      expect(result[1].text).toBe('Words can have contradictory meanings depending on their usage.');
    });

    it('should only include takeaways for concepts with sufficient exposure', async () => {
      // Arrange
      // Modify the mock to require higher exposure count
      const originalTakeaways = [...educationalContent.takeaways];
      educationalContent.takeaways[0].requiredExposureCount = 3;

      const gameSession = {
        encounteredConcepts: [
          {
            conceptId: 'context_dependence',
            exposureCount: 2, // Not enough for takeaway1 now
            firstEncountered: new Date(),
            lastEncountered: new Date()
          },
          {
            conceptId: 'ambiguity',
            exposureCount: 1,
            firstEncountered: new Date(),
            lastEncountered: new Date()
          }
        ]
      };

      // Act
      const result = await generateLearningTakeaways(gameSession);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Words can have contradictory meanings depending on their usage.');

      // Restore original mock
      educationalContent.takeaways = originalTakeaways;
    });

    it('should return empty array if no concepts encountered', async () => {
      // Arrange
      const gameSession = {
        encounteredConcepts: []
      };

      // Act
      const result = await generateLearningTakeaways(gameSession);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should throw an error if gameSession is not provided', async () => {
      // Act & Assert
      await expect(generateLearningTakeaways(null))
        .rejects.toThrow('Invalid game session');
    });
  });
});
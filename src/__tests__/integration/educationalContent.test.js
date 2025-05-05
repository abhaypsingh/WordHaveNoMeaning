import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../../App';
import { getEducationalMessage, recordConceptExposure, generateLearningTakeaways } from '../../services/educationalService';
import { educationalContent } from '../../data/educationalContent';

// Mock dependencies
jest.mock('../../services/soundService', () => ({
  initSoundService: jest.fn().mockResolvedValue(undefined),
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

jest.mock('../../services/educationalService', () => ({
  getEducationalMessage: jest.fn(),
  recordConceptExposure: jest.fn(),
  getConceptExplanation: jest.fn(),
  generateLearningTakeaways: jest.fn()
}));

// Create mock store with middleware
const mockStore = configureStore([thunk]);

describe('Educational Content Integration Tests', () => {
  let store;
  
  // Mock data
  const mockConcepts = [
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
  ];

  const mockMessages = [
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
    }
  ];

  const mockTakeaways = [
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
  ];

  const mockWord = {
    id: 'word1',
    text: 'bank',
    difficulty: 'easy',
    categories: ['noun', 'finance', 'context_dependence'],
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

  beforeEach(() => {
    // Initialize store with default state
    store = mockStore({
      ui: {
        currentScreen: 'gameplay',
        modal: {
          isVisible: false,
          type: null,
          data: null
        },
        theme: 'light',
        loading: false,
        error: null
      },
      game: {
        gameSession: {
          id: 'session1',
          currentRound: 1,
          totalRounds: 10,
          score: 0,
          rounds: [
            {
              roundNumber: 1,
              word: mockWord,
              options: [
                { index: 0, text: 'A financial institution', isCorrect: true },
                { index: 1, text: 'The land alongside a river', isCorrect: true },
                { index: 2, text: 'To prepare food by heating it', isCorrect: false },
                { index: 3, text: 'A small, round fruit', isCorrect: false }
              ],
              selectedOption: null,
              timeSpent: 0,
              score: 0,
              completed: false
            }
          ],
          encounteredConcepts: []
        },
        loading: false,
        error: null
      },
      user: {
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
      },
      educational: {
        concepts: mockConcepts,
        messages: mockMessages,
        explanations: [],
        takeaways: [],
        loading: false,
        error: null
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      return action;
    });

    // Set up mock implementations
    getEducationalMessage.mockImplementation((conceptId, messageType, difficulty) => {
      return Promise.resolve(mockMessages.find(msg => 
        msg.conceptId === conceptId && msg.type === messageType && msg.difficulty === difficulty
      ) || mockMessages[0]);
    });

    recordConceptExposure.mockImplementation((conceptId, gameSession) => {
      return Promise.resolve();
    });

    generateLearningTakeaways.mockImplementation((gameSession) => {
      return Promise.resolve(mockTakeaways);
    });
  });

  it('should display educational message during gameplay', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Words have no inherent meaning without context.')).toBeInTheDocument();
  });

  it('should record concept exposure when selecting an option', async () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Find and click an option button
    const optionButton = screen.getByText('A financial institution');
    fireEvent.click(optionButton);
    
    // Assert
    expect(recordConceptExposure).toHaveBeenCalled();
    expect(recordConceptExposure).toHaveBeenCalledWith(
      'context_dependence', 
      expect.objectContaining({ id: 'session1' })
    );
  });

  it('should show educational takeaways on results screen', () => {
    // Arrange - Results screen
    const resultsStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'results'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          completed: true,
          score: 750
        }
      },
      educational: {
        ...store.getState().educational,
        takeaways: mockTakeaways
      }
    });
    resultsStore.dispatch = jest.fn();
    
    // Mock generateLearningTakeaways to return our mock takeaways
    generateLearningTakeaways.mockResolvedValue(mockTakeaways);
    
    // Act
    render(
      <Provider store={resultsStore}>
        <App gameResults={{
          score: 750,
          totalRounds: 10,
          correctAnswers: 7,
          accuracyRate: 70
        }} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    mockTakeaways.forEach(takeaway => {
      expect(screen.getByText(takeaway.text)).toBeInTheDocument();
    });
  });

  it('should show different educational messages based on difficulty', () => {
    // Arrange - Medium difficulty
    const mediumDifficultyStore = mockStore({
      ...store.getState(),
      user: {
        ...store.getState().user,
        settings: {
          ...store.getState().user.settings,
          difficulty: 'medium'
        }
      }
    });
    mediumDifficultyStore.dispatch = jest.fn();
    
    // Mock getEducationalMessage to return different message for medium difficulty
    getEducationalMessage.mockImplementation((conceptId, messageType, difficulty) => {
      if (difficulty === 'medium') {
        return Promise.resolve({
          id: 'msg3',
          text: 'Context provides the framework for interpreting language.',
          conceptId: 'context_dependence',
          difficulty: 'medium',
          type: 'explanation'
        });
      }
      return Promise.resolve(mockMessages[0]);
    });
    
    // Act
    render(
      <Provider store={mediumDifficultyStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Context provides the framework for interpreting language.')).toBeInTheDocument();
  });

  it('should show different educational messages for different concepts', () => {
    // Arrange - Word with ambiguity concept
    const ambiguityStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          rounds: [
            {
              ...store.getState().game.gameSession.rounds[0],
              word: {
                ...mockWord,
                categories: ['noun', 'finance', 'ambiguity']
              }
            }
          ]
        }
      }
    });
    ambiguityStore.dispatch = jest.fn();
    
    // Mock getEducationalMessage to return different message for ambiguity concept
    getEducationalMessage.mockImplementation((conceptId, messageType, difficulty) => {
      if (conceptId === 'ambiguity') {
        return Promise.resolve(mockMessages[1]);
      }
      return Promise.resolve(mockMessages[0]);
    });
    
    // Act
    render(
      <Provider store={ambiguityStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('The same word can have contradictory meanings in different contexts.')).toBeInTheDocument();
  });

  it('should generate takeaways based on encountered concepts', () => {
    // Arrange - Completed game with encountered concepts
    const completedGameStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'results'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          completed: true,
          score: 750,
          encounteredConcepts: [
            {
              conceptId: 'context_dependence',
              exposureCount: 3,
              firstEncountered: new Date().toISOString(),
              lastEncountered: new Date().toISOString()
            },
            {
              conceptId: 'ambiguity',
              exposureCount: 2,
              firstEncountered: new Date().toISOString(),
              lastEncountered: new Date().toISOString()
            }
          ]
        }
      }
    });
    completedGameStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={completedGameStore}>
        <App gameResults={{
          score: 750,
          totalRounds: 10,
          correctAnswers: 7,
          accuracyRate: 70
        }} />
      </Provider>
    );
    
    // Assert
    expect(generateLearningTakeaways).toHaveBeenCalledWith(
      expect.objectContaining({
        encounteredConcepts: expect.arrayContaining([
          expect.objectContaining({ conceptId: 'context_dependence' }),
          expect.objectContaining({ conceptId: 'ambiguity' })
        ])
      })
    );
  });

  it('should adapt educational content based on user progress', () => {
    // Arrange - User with previous concept exposure
    const experiencedUserStore = mockStore({
      ...store.getState(),
      user: {
        ...store.getState().user,
        progress: {
          ...store.getState().user.progress,
          conceptsEncountered: ['context_dependence', 'ambiguity']
        }
      }
    });
    experiencedUserStore.dispatch = jest.fn();
    
    // Mock getEducationalMessage to return advanced message for experienced users
    getEducationalMessage.mockImplementation((conceptId, messageType, difficulty) => {
      if (conceptId === 'context_dependence' && 
          experiencedUserStore.getState().user.progress.conceptsEncountered.includes(conceptId)) {
        return Promise.resolve({
          id: 'msg4',
          text: 'Advanced: The meaning of words is negotiated through social and cultural contexts.',
          conceptId: 'context_dependence',
          difficulty: 'hard',
          type: 'advanced'
        });
      }
      return Promise.resolve(mockMessages[0]);
    });
    
    // Act
    render(
      <Provider store={experiencedUserStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Advanced: The meaning of words is negotiated through social and cultural contexts.')).toBeInTheDocument();
  });
});
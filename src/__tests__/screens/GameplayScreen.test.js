import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GameplayScreen from '../../screens/GameplayScreen';
import { processUserSelection, startNextRound } from '../../store/slices/gameSlice';
import { playSound } from '../../services/soundService';

// Mock dependencies
jest.mock('../../services/soundService', () => ({
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

// Create mock store
const mockStore = configureStore([thunk]);

describe('GameplayScreen Component', () => {
  let store;

  // Mock data
  const mockWord = {
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

  const mockOptions = [
    { index: 0, text: 'A financial institution', isCorrect: true },
    { index: 1, text: 'The land alongside a river', isCorrect: true },
    { index: 2, text: 'To prepare food by heating it', isCorrect: false },
    { index: 3, text: 'A small, round fruit', isCorrect: false }
  ];

  const mockRound = {
    roundNumber: 1,
    word: mockWord,
    options: mockOptions,
    selectedOption: null,
    timeSpent: 0,
    score: 0,
    completed: false
  };

  const mockContradictionData = {
    sentence: 'I went to the bank to deposit money.',
    highlightedSentence: 'I went to the <span class="highlight">bank</span> to deposit money.',
    meaning: 'A financial institution',
    explanation: 'In this context, "bank" means "A financial institution" rather than the meaning you selected.'
  };

  beforeEach(() => {
    // Initialize store with default state
    store = mockStore({
      game: {
        gameSession: {
          id: 'session1',
          currentRound: 1,
          totalRounds: 10,
          score: 0,
          rounds: [mockRound]
        },
        loading: false,
        error: null
      },
      ui: {
        theme: 'light'
      },
      user: {
        settings: {
          timeLimit: 30,
          soundEnabled: true
        }
      },
      educational: {
        messages: [
          {
            id: 'msg1',
            text: 'Words have no inherent meaning without context.',
            conceptId: 'context_dependence',
            difficulty: 'easy',
            type: 'introduction'
          }
        ]
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render the gameplay screen with word display', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('bank')).toBeInTheDocument();
    expect(screen.getByTestId('word-display')).toBeInTheDocument();
  });

  it('should render option buttons for each option', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    mockOptions.forEach(option => {
      expect(screen.getByText(option.text)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('button')).toHaveLength(4); // 4 option buttons
  });

  it('should render timer display', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('timer-display')).toBeInTheDocument();
  });

  it('should render progress indicator', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument();
  });

  it('should dispatch processUserSelection when an option is clicked', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Click on the first option
    fireEvent.click(screen.getByText('A financial institution'));
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function)); // Thunk action
    expect(playSound).toHaveBeenCalledWith('select');
  });

  it('should show contradiction display after selecting an option', () => {
    // Arrange
    const completedRoundStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          rounds: [{
            ...mockRound,
            selectedOption: 0,
            completed: true
          }]
        }
      }
    });
    completedRoundStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={completedRoundStore}>
        <GameplayScreen contradictionData={mockContradictionData} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('contradiction-display')).toBeInTheDocument();
    expect(screen.getByText('A financial institution')).toBeInTheDocument();
  });

  it('should show next button after displaying contradiction', () => {
    // Arrange
    const completedRoundStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          rounds: [{
            ...mockRound,
            selectedOption: 0,
            completed: true
          }]
        }
      }
    });
    completedRoundStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={completedRoundStore}>
        <GameplayScreen contradictionData={mockContradictionData} />
      </Provider>
    );
    
    // Assert
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();
  });

  it('should dispatch startNextRound when next button is clicked', () => {
    // Arrange
    const completedRoundStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        gameSession: {
          ...store.getState().game.gameSession,
          rounds: [{
            ...mockRound,
            selectedOption: 0,
            completed: true
          }]
        }
      }
    });
    completedRoundStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={completedRoundStore}>
        <GameplayScreen contradictionData={mockContradictionData} />
      </Provider>
    );
    
    // Click on the next button
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Assert
    expect(completedRoundStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // Thunk action
    expect(playSound).toHaveBeenCalledWith('next');
  });

  it('should show educational message', () => {
    // Act
    render(
      <Provider store={store}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Words have no inherent meaning without context.')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    // Arrange
    const loadingStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        loading: true
      }
    });
    loadingStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={loadingStore}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    // Arrange
    const errorStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        error: 'Something went wrong'
      }
    });
    errorStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={errorStore}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should handle null game session', () => {
    // Arrange
    const noSessionStore = mockStore({
      ...store.getState(),
      game: {
        ...store.getState().game,
        gameSession: null
      }
    });
    noSessionStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={noSessionStore}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('No active game session')).toBeInTheDocument();
  });

  it('should apply theme class based on current theme', () => {
    // Arrange
    const darkThemeStore = mockStore({
      ...store.getState(),
      ui: {
        theme: 'dark'
      }
    });
    darkThemeStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={darkThemeStore}>
        <GameplayScreen />
      </Provider>
    );
    
    // Assert
    const gameplayScreen = screen.getByTestId('gameplay-screen');
    expect(gameplayScreen).toHaveClass('gameplay-screen--dark');
  });
});
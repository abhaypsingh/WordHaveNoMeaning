import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../../App';
import { setScreen } from '../../store/slices/uiSlice';
import { initializeGame, processUserSelection, startNextRound, completeGame } from '../../store/slices/gameSlice';
import { playSound } from '../../services/soundService';

// Mock dependencies
jest.mock('../../services/soundService', () => ({
  initSoundService: jest.fn().mockResolvedValue(undefined),
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

// Create mock store with middleware
const mockStore = configureStore([thunk]);

describe('User Flow Integration Tests', () => {
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

  const mockContradictionData = {
    sentence: 'I went to the bank to deposit money.',
    highlightedSentence: 'I went to the <span class="highlight">bank</span> to deposit money.',
    meaning: 'A financial institution',
    explanation: 'In this context, "bank" means "A financial institution" rather than the meaning you selected.'
  };

  beforeEach(() => {
    // Initialize store with default state
    store = mockStore({
      ui: {
        currentScreen: 'launch',
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
        gameSession: null,
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
        concepts: [],
        messages: [
          {
            id: 'msg1',
            text: 'Words have no inherent meaning without context.',
            conceptId: 'context_dependence',
            difficulty: 'easy',
            type: 'introduction'
          }
        ],
        explanations: [],
        takeaways: [],
        loading: false,
        error: null
      }
    });

    // Mock dispatch to track actions and update state
    store.dispatch = jest.fn((action) => {
      // For thunk actions, execute them with dispatch and getState
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      return action;
    });
  });

  it('should navigate from launch screen to game setup', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Find and click the "Play" button on the launch screen
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('setup'));
    expect(playSound).toHaveBeenCalledWith('button');
  });

  it('should navigate from launch screen to how-to-play screen', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Find and click the "How to Play" button on the launch screen
    const howToPlayButton = screen.getByRole('button', { name: /how to play/i });
    fireEvent.click(howToPlayButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('how-to-play'));
    expect(playSound).toHaveBeenCalledWith('button');
  });

  it('should start a new game from setup screen', () => {
    // Arrange - Setup screen
    const setupStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'setup'
      }
    });
    setupStore.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(setupStore.dispatch, setupStore.getState);
      }
      return action;
    });
    
    // Act
    render(
      <Provider store={setupStore}>
        <App />
      </Provider>
    );
    
    // Find and click the "Start Game" button on the setup screen
    const startButton = screen.getByRole('button', { name: /start game/i });
    fireEvent.click(startButton);
    
    // Assert
    expect(setupStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // initializeGame thunk
    expect(setupStore.dispatch).toHaveBeenCalledWith(setScreen('gameplay'));
    expect(playSound).toHaveBeenCalledWith('button');
  });

  it('should select an option during gameplay', () => {
    // Arrange - Gameplay screen with active game session
    const gameplayStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'gameplay'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          id: 'session1',
          currentRound: 1,
          totalRounds: 10,
          score: 0,
          rounds: [
            {
              roundNumber: 1,
              word: mockWord,
              options: mockOptions,
              selectedOption: null,
              timeSpent: 0,
              score: 0,
              completed: false
            }
          ]
        }
      }
    });
    gameplayStore.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(gameplayStore.dispatch, gameplayStore.getState);
      }
      return action;
    });
    
    // Act
    render(
      <Provider store={gameplayStore}>
        <App />
      </Provider>
    );
    
    // Find and click an option button
    const optionButton = screen.getByText('A financial institution');
    fireEvent.click(optionButton);
    
    // Assert
    expect(gameplayStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // processUserSelection thunk
    expect(playSound).toHaveBeenCalledWith('select');
  });

  it('should show contradiction and proceed to next round', () => {
    // Arrange - Gameplay screen with completed round
    const completedRoundStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'gameplay'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          id: 'session1',
          currentRound: 1,
          totalRounds: 10,
          score: 100,
          rounds: [
            {
              roundNumber: 1,
              word: mockWord,
              options: mockOptions,
              selectedOption: 0,
              timeSpent: 5,
              score: 100,
              completed: true
            }
          ]
        }
      }
    });
    completedRoundStore.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(completedRoundStore.dispatch, completedRoundStore.getState);
      }
      return action;
    });
    
    // Act
    render(
      <Provider store={completedRoundStore}>
        <App contradictionData={mockContradictionData} />
      </Provider>
    );
    
    // Verify contradiction is shown
    expect(screen.getByTestId('contradiction-display')).toBeInTheDocument();
    
    // Find and click the "Next" button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Assert
    expect(completedRoundStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // startNextRound thunk
    expect(playSound).toHaveBeenCalledWith('next');
  });

  it('should complete game and show results screen', () => {
    // Arrange - Gameplay screen with final round completed
    const finalRoundStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'gameplay'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          id: 'session1',
          currentRound: 10,
          totalRounds: 10,
          score: 900,
          rounds: [
            {
              roundNumber: 10,
              word: mockWord,
              options: mockOptions,
              selectedOption: 0,
              timeSpent: 5,
              score: 100,
              completed: true
            }
          ]
        }
      }
    });
    finalRoundStore.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(finalRoundStore.dispatch, finalRoundStore.getState);
      }
      return action;
    });
    
    // Act
    render(
      <Provider store={finalRoundStore}>
        <App contradictionData={mockContradictionData} />
      </Provider>
    );
    
    // Find and click the "Next" button (which should complete the game)
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Assert
    expect(finalRoundStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // completeGame thunk
    expect(finalRoundStore.dispatch).toHaveBeenCalledWith(setScreen('results'));
    expect(playSound).toHaveBeenCalledWith('complete');
  });

  it('should navigate from results screen back to home', () => {
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
          id: 'session1',
          completed: true,
          score: 750
        }
      },
      educational: {
        ...store.getState().educational,
        takeaways: [
          {
            id: 'takeaway1',
            text: 'Always consider context when interpreting language.'
          }
        ]
      }
    });
    resultsStore.dispatch = jest.fn();
    
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
    
    // Find and click the "Back to Home" button
    const homeButton = screen.getByRole('button', { name: /back to home/i });
    fireEvent.click(homeButton);
    
    // Assert
    expect(resultsStore.dispatch).toHaveBeenCalledWith(setScreen('launch'));
  });

  it('should play again from results screen', () => {
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
          id: 'session1',
          completed: true,
          score: 750
        }
      },
      educational: {
        ...store.getState().educational,
        takeaways: [
          {
            id: 'takeaway1',
            text: 'Always consider context when interpreting language.'
          }
        ]
      }
    });
    resultsStore.dispatch = jest.fn();
    
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
    
    // Find and click the "Play Again" button
    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(playAgainButton);
    
    // Assert
    expect(resultsStore.dispatch).toHaveBeenCalledWith(setScreen('setup'));
  });

  it('should navigate to settings and back', () => {
    // Arrange - Launch screen
    const launchStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'launch'
      }
    });
    launchStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={launchStore}>
        <App />
      </Provider>
    );
    
    // Find and click the "Settings" button
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    // Assert - Should navigate to settings
    expect(launchStore.dispatch).toHaveBeenCalledWith(setScreen('settings'));
    
    // Reset mock
    launchStore.dispatch.mockClear();
    
    // Update store to settings screen
    const settingsStore = mockStore({
      ...launchStore.getState(),
      ui: {
        ...launchStore.getState().ui,
        currentScreen: 'settings'
      }
    });
    settingsStore.dispatch = jest.fn();
    
    // Re-render with settings screen
    const { rerender } = render(
      <Provider store={settingsStore}>
        <App />
      </Provider>
    );
    
    // Find and click the "Back" button
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    // Assert - Should navigate back to launch
    expect(settingsStore.dispatch).toHaveBeenCalledWith(setScreen('launch'));
  });

  it('should handle timer expiration during gameplay', () => {
    // Arrange - Gameplay screen with active game session
    const gameplayStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'gameplay'
      },
      game: {
        ...store.getState().game,
        gameSession: {
          id: 'session1',
          currentRound: 1,
          totalRounds: 10,
          score: 0,
          rounds: [
            {
              roundNumber: 1,
              word: mockWord,
              options: mockOptions,
              selectedOption: null,
              timeSpent: 0,
              score: 0,
              completed: false
            }
          ]
        }
      }
    });
    gameplayStore.dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(gameplayStore.dispatch, gameplayStore.getState);
      }
      return action;
    });
    
    // Mock timers
    jest.useFakeTimers();
    
    // Act
    render(
      <Provider store={gameplayStore}>
        <App />
      </Provider>
    );
    
    // Simulate timer expiration
    act(() => {
      // Find the timer component and trigger its onTimeUp callback
      const timerDisplay = screen.getByTestId('timer-display');
      const onTimeUp = timerDisplay.props.onTimeUp;
      if (onTimeUp) onTimeUp();
    });
    
    // Assert
    expect(gameplayStore.dispatch).toHaveBeenCalledWith(expect.any(Function)); // processUserSelection thunk with no selection
    expect(playSound).toHaveBeenCalledWith('timeout');
    
    // Cleanup
    jest.useRealTimers();
  });
});
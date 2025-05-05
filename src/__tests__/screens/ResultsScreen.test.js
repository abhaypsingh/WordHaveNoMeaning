import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ResultsScreen from '../../screens/ResultsScreen';
import { setScreen } from '../../store/slices/uiSlice';
import { resetGame } from '../../store/slices/gameSlice';
import { playSound } from '../../services/soundService';

// Mock dependencies
jest.mock('../../services/soundService', () => ({
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

// Create mock store
const mockStore = configureStore([thunk]);

describe('ResultsScreen Component', () => {
  let store;

  // Mock data
  const mockGameResults = {
    score: 750,
    totalRounds: 10,
    correctAnswers: 7,
    accuracyRate: 70,
    averageTimePerRound: 12.5,
    difficulty: 'medium',
    performance: 'Good job! You\'re developing a solid grasp of contextual meaning.',
    suggestion: 'Play again to discover more words and their contextual meanings!'
  };

  const mockTakeaways = [
    {
      id: 'takeaway1',
      text: 'Always consider context when interpreting language.',
      conceptIds: ['context_dependence']
    },
    {
      id: 'takeaway2',
      text: 'Words can have contradictory meanings depending on their usage.',
      conceptIds: ['ambiguity']
    }
  ];

  beforeEach(() => {
    // Initialize store with default state
    store = mockStore({
      game: {
        gameSession: {
          id: 'session1',
          completed: true,
          score: 750,
          settings: {
            difficulty: 'medium'
          }
        },
        loading: false,
        error: null
      },
      ui: {
        theme: 'light'
      },
      user: {
        settings: {
          soundEnabled: true
        },
        progress: {
          highestScore: 800
        }
      },
      educational: {
        takeaways: mockTakeaways
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render the results screen with score', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument();
  });

  it('should render accuracy and performance statistics', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('70%')).toBeInTheDocument(); // Accuracy rate
    expect(screen.getByText('7/10')).toBeInTheDocument(); // Correct answers
    expect(screen.getByText('12.5s')).toBeInTheDocument(); // Average time
  });

  it('should render performance feedback', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Good job! You\'re developing a solid grasp of contextual meaning.')).toBeInTheDocument();
  });

  it('should render suggestion for next game', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Play again to discover more words and their contextual meanings!')).toBeInTheDocument();
  });

  it('should render learning takeaways', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Key Takeaways')).toBeInTheDocument();
    mockTakeaways.forEach(takeaway => {
      expect(screen.getByText(takeaway.text)).toBeInTheDocument();
    });
  });

  it('should render play again button', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    expect(playAgainButton).toBeInTheDocument();
  });

  it('should render back to home button', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    const homeButton = screen.getByRole('button', { name: /back to home/i });
    expect(homeButton).toBeInTheDocument();
  });

  it('should dispatch resetGame and navigate to setup screen when play again button is clicked', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Click on the play again button
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(resetGame());
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('setup'));
    expect(playSound).toHaveBeenCalledWith('button');
  });

  it('should dispatch resetGame and navigate to launch screen when back to home button is clicked', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Click on the back to home button
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(resetGame());
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('launch'));
    expect(playSound).toHaveBeenCalledWith('button');
  });

  it('should show new high score message when score is higher than previous high score', () => {
    // Arrange
    const highScoreStore = mockStore({
      ...store.getState(),
      user: {
        ...store.getState().user,
        progress: {
          highestScore: 700 // Lower than current score (750)
        }
      }
    });
    highScoreStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={highScoreStore}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('New High Score!')).toBeInTheDocument();
  });

  it('should not show new high score message when score is lower than previous high score', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  it('should render difficulty level', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();
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
        <ResultsScreen />
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
        <ResultsScreen />
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
        <ResultsScreen />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('No completed game session')).toBeInTheDocument();
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
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    const resultsScreen = screen.getByTestId('results-screen');
    expect(resultsScreen).toHaveClass('results-screen--dark');
  });

  it('should render share button', () => {
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Assert
    const shareButton = screen.getByRole('button', { name: /share results/i });
    expect(shareButton).toBeInTheDocument();
  });

  it('should attempt to share results when share button is clicked', () => {
    // Arrange
    // Mock navigator.share
    const mockShare = jest.fn().mockResolvedValue(undefined);
    global.navigator.share = mockShare;
    
    // Act
    render(
      <Provider store={store}>
        <ResultsScreen gameResults={mockGameResults} />
      </Provider>
    );
    
    // Click on the share button
    fireEvent.click(screen.getByRole('button', { name: /share results/i }));
    
    // Assert
    expect(mockShare).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Words Without Meaning - Game Results',
      text: expect.stringContaining('750')
    }));
    expect(playSound).toHaveBeenCalledWith('button');
  });
});
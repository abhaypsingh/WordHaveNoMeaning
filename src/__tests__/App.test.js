import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';

// Mock dependencies
jest.mock('../services/soundService', () => ({
  initSoundService: jest.fn().mockResolvedValue(undefined),
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

// Create mock store
const mockStore = configureStore([thunk]);

describe('App Component', () => {
  let store;

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
        messages: [],
        explanations: [],
        takeaways: [],
        loading: false,
        error: null
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn();
  });

  it('should render the app container', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
    expect(appContainer).toHaveClass('app');
  });

  it('should apply theme class based on current theme', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--light');
  });

  it('should apply dark theme class when theme is dark', () => {
    // Arrange
    const darkThemeStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        theme: 'dark'
      }
    });
    darkThemeStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={darkThemeStore}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--dark');
  });

  it('should render the launch screen when currentScreen is launch', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('launch-screen')).toBeInTheDocument();
  });

  it('should render the setup screen when currentScreen is setup', () => {
    // Arrange
    const setupScreenStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'setup'
      }
    });
    setupScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={setupScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
  });

  it('should render the gameplay screen when currentScreen is gameplay', () => {
    // Arrange
    const gameplayScreenStore = mockStore({
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
          rounds: [
            {
              roundNumber: 1,
              word: {
                id: 'word1',
                text: 'bank',
                difficulty: 'easy'
              },
              options: []
            }
          ]
        }
      }
    });
    gameplayScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={gameplayScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('gameplay-screen')).toBeInTheDocument();
  });

  it('should render the results screen when currentScreen is results', () => {
    // Arrange
    const resultsScreenStore = mockStore({
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
      }
    });
    resultsScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={resultsScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('results-screen')).toBeInTheDocument();
  });

  it('should render the how-to-play screen when currentScreen is how-to-play', () => {
    // Arrange
    const howToPlayScreenStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'how-to-play'
      }
    });
    howToPlayScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={howToPlayScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('how-to-play-screen')).toBeInTheDocument();
  });

  it('should render the settings screen when currentScreen is settings', () => {
    // Arrange
    const settingsScreenStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'settings'
      }
    });
    settingsScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={settingsScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('settings-screen')).toBeInTheDocument();
  });

  it('should render the about screen when currentScreen is about', () => {
    // Arrange
    const aboutScreenStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        currentScreen: 'about'
      }
    });
    aboutScreenStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={aboutScreenStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('about-screen')).toBeInTheDocument();
  });

  it('should render modal when modal is visible', () => {
    // Arrange
    const modalVisibleStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        modal: {
          isVisible: true,
          type: 'confirmation',
          data: {
            title: 'Confirm Action',
            message: 'Are you sure you want to proceed?'
          }
        }
      }
    });
    modalVisibleStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={modalVisibleStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('should not render modal when modal is not visible', () => {
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render loading indicator when ui loading is true', () => {
    // Arrange
    const loadingStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        loading: true
      }
    });
    loadingStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={loadingStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should render error message when ui error is present', () => {
    // Arrange
    const errorStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        error: 'Something went wrong'
      }
    });
    errorStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={errorStore}>
        <App />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
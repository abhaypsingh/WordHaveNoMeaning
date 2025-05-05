import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import WordDisplay from '../components/game/WordDisplay';
import OptionButton from '../components/game/OptionButton';

// Create mock store
const mockStore = configureStore([thunk]);

// Mock dependencies
jest.mock('../services/soundService', () => ({
  initSoundService: jest.fn().mockResolvedValue(undefined),
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

// Mock window.matchMedia
function createMatchMedia(width) {
  return (query) => ({
    matches: query.includes(`${width}`),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}

describe('Responsive Design Tests', () => {
  let store;
  let originalMatchMedia;

  beforeEach(() => {
    // Save original matchMedia
    originalMatchMedia = window.matchMedia;
    
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

  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('App should apply mobile styles on small screens', () => {
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--mobile');
  });

  it('App should apply tablet styles on medium screens', () => {
    // Arrange - Mock medium screen (tablet)
    window.matchMedia = createMatchMedia(768);
    
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--tablet');
  });

  it('App should apply desktop styles on large screens', () => {
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--desktop');
  });

  it('Button should adjust size on different screen sizes', () => {
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(<Button>Responsive Button</Button>);
    
    // Assert - Mobile
    let button = screen.getByText('Responsive Button');
    expect(button).toHaveClass('button--mobile');
    
    // Arrange - Mock medium screen (tablet)
    window.matchMedia = createMatchMedia(768);
    
    // Act - Tablet
    rerender(<Button>Responsive Button</Button>);
    
    // Assert - Tablet
    button = screen.getByText('Responsive Button');
    expect(button).toHaveClass('button--tablet');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(<Button>Responsive Button</Button>);
    
    // Assert - Desktop
    button = screen.getByText('Responsive Button');
    expect(button).toHaveClass('button--desktop');
  });

  it('Header should adjust layout on different screen sizes', () => {
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(
      <Provider store={store}>
        <Header title="Responsive Header" subtitle="Subtitle text" />
      </Provider>
    );
    
    // Assert - Mobile
    let header = screen.getByRole('banner');
    expect(header).toHaveClass('header--mobile');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(
      <Provider store={store}>
        <Header title="Responsive Header" subtitle="Subtitle text" />
      </Provider>
    );
    
    // Assert - Desktop
    header = screen.getByRole('banner');
    expect(header).toHaveClass('header--desktop');
  });

  it('WordDisplay should adjust font size on different screen sizes', () => {
    // Arrange
    const mockWord = {
      id: 'word1',
      text: 'bank',
      difficulty: 'easy'
    };
    
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(<WordDisplay word={mockWord} />);
    
    // Assert - Mobile
    let wordDisplay = screen.getByTestId('word-display');
    expect(wordDisplay).toHaveClass('word-display--mobile');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(<WordDisplay word={mockWord} />);
    
    // Assert - Desktop
    wordDisplay = screen.getByTestId('word-display');
    expect(wordDisplay).toHaveClass('word-display--desktop');
  });

  it('OptionButton should adjust layout on different screen sizes', () => {
    // Arrange
    const mockOption = {
      index: 0,
      text: 'A financial institution',
      isCorrect: true
    };
    
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(<OptionButton option={mockOption} />);
    
    // Assert - Mobile
    let optionButton = screen.getByRole('button');
    expect(optionButton).toHaveClass('option-button--mobile');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(<OptionButton option={mockOption} />);
    
    // Assert - Desktop
    optionButton = screen.getByRole('button');
    expect(optionButton).toHaveClass('option-button--desktop');
  });

  it('App layout should adjust grid/flex structure on different screen sizes', () => {
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert - Mobile
    let appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--mobile');
    expect(appContainer).toHaveStyle('grid-template-columns: 1fr');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert - Desktop
    appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveClass('app--desktop');
    expect(appContainer).toHaveStyle('grid-template-columns: 1fr 3fr 1fr');
  });

  it('Font sizes should adjust on different screen sizes', () => {
    // Arrange - Mock small screen (mobile)
    window.matchMedia = createMatchMedia(480);
    
    // Act - Mobile
    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert - Mobile
    let appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveStyle('font-size: 14px');
    
    // Arrange - Mock medium screen (tablet)
    window.matchMedia = createMatchMedia(768);
    
    // Act - Tablet
    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert - Tablet
    appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveStyle('font-size: 16px');
    
    // Arrange - Mock large screen (desktop)
    window.matchMedia = createMatchMedia(1024);
    
    // Act - Desktop
    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Assert - Desktop
    appContainer = screen.getByTestId('app-container');
    expect(appContainer).toHaveStyle('font-size: 18px');
  });
});
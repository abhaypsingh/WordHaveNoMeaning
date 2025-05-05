import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Header from '../components/common/Header';
import WordDisplay from '../components/game/WordDisplay';
import OptionButton from '../components/game/OptionButton';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Create mock store
const mockStore = configureStore([thunk]);

// Mock dependencies
jest.mock('../services/soundService', () => ({
  initSoundService: jest.fn().mockResolvedValue(undefined),
  playSound: jest.fn(),
  isSoundEnabled: jest.fn(() => true)
}));

describe('Accessibility Tests', () => {
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

  it('Button component should have no accessibility violations', async () => {
    // Arrange
    const { container } = render(<Button>Accessible Button</Button>);
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
  });

  it('Button component should have appropriate ARIA attributes when disabled', async () => {
    // Act
    render(<Button disabled>Disabled Button</Button>);
    
    // Assert
    const button = screen.getByText('Disabled Button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('ProgressBar component should have appropriate ARIA attributes', async () => {
    // Act
    render(<ProgressBar value={50} min={0} max={100} />);
    
    // Assert
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('Header component should have appropriate heading structure', async () => {
    // Arrange
    const { container } = render(
      <Provider store={store}>
        <Header title="Accessible Header" subtitle="Subtitle text" />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
    
    const heading = screen.getByRole('heading', { name: 'Accessible Header' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('WordDisplay component should have appropriate text contrast', async () => {
    // Arrange
    const mockWord = {
      id: 'word1',
      text: 'bank',
      difficulty: 'easy'
    };
    
    const { container } = render(<WordDisplay word={mockWord} />);
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
  });

  it('OptionButton component should have appropriate focus indicators', async () => {
    // Arrange
    const mockOption = {
      index: 0,
      text: 'A financial institution',
      isCorrect: true
    };
    
    const { container } = render(<OptionButton option={mockOption} />);
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('App should have appropriate document structure', async () => {
    // Arrange
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
  });

  it('App should have appropriate color contrast in light theme', async () => {
    // Arrange
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
  });

  it('App should have appropriate color contrast in dark theme', async () => {
    // Arrange
    const darkThemeStore = mockStore({
      ...store.getState(),
      ui: {
        ...store.getState().ui,
        theme: 'dark'
      }
    });
    darkThemeStore.dispatch = jest.fn();
    
    const { container } = render(
      <Provider store={darkThemeStore}>
        <App />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
  });

  it('App should have appropriate keyboard navigation', async () => {
    // Arrange
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
    
    // Check for focusable elements
    const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('App should have appropriate screen reader announcements', async () => {
    // Arrange
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Act
    const results = await axe(container);
    
    // Assert
    expect(results).toHaveNoViolations();
    
    // Check for aria-live regions
    const liveRegions = container.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThan(0);
  });
});
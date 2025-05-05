import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from '../../../components/common/Header';
import { setScreen } from '../../../store/slices/uiSlice';

// Create mock store
const mockStore = configureStore([]);

describe('Header Component', () => {
  let store;

  beforeEach(() => {
    // Initialize store with default state
    store = mockStore({
      ui: {
        currentScreen: 'gameplay',
        theme: 'light'
      },
      user: {
        settings: {
          soundEnabled: true
        }
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn();
  });

  it('should render with title', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" />
      </Provider>
    );
    
    // Assert
    const titleElement = screen.getByText('Game Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('header__title');
  });

  it('should render with subtitle when provided', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" subtitle="Game Subtitle" />
      </Provider>
    );
    
    // Assert
    const subtitleElement = screen.getByText('Game Subtitle');
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement).toHaveClass('header__subtitle');
  });

  it('should render back button when showBackButton is true', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showBackButton />
      </Provider>
    );
    
    // Assert
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass('header__back-button');
  });

  it('should not render back button when showBackButton is false', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showBackButton={false} />
      </Provider>
    );
    
    // Assert
    const backButton = screen.queryByRole('button', { name: /back/i });
    expect(backButton).not.toBeInTheDocument();
  });

  it('should navigate to previous screen when back button is clicked', () => {
    // Arrange
    const previousScreen = 'setup';
    
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showBackButton previousScreen={previousScreen} />
      </Provider>
    );
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen(previousScreen));
  });

  it('should navigate to launch screen by default when previousScreen is not provided', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showBackButton />
      </Provider>
    );
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('launch'));
  });

  it('should render settings button when showSettingsButton is true', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showSettingsButton />
      </Provider>
    );
    
    // Assert
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton).toHaveClass('header__settings-button');
  });

  it('should not render settings button when showSettingsButton is false', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showSettingsButton={false} />
      </Provider>
    );
    
    // Assert
    const settingsButton = screen.queryByRole('button', { name: /settings/i });
    expect(settingsButton).not.toBeInTheDocument();
  });

  it('should navigate to settings screen when settings button is clicked', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showSettingsButton />
      </Provider>
    );
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('settings'));
  });

  it('should render help button when showHelpButton is true', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showHelpButton />
      </Provider>
    );
    
    // Assert
    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();
    expect(helpButton).toHaveClass('header__help-button');
  });

  it('should not render help button when showHelpButton is false', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showHelpButton={false} />
      </Provider>
    );
    
    // Assert
    const helpButton = screen.queryByRole('button', { name: /help/i });
    expect(helpButton).not.toBeInTheDocument();
  });

  it('should navigate to how-to-play screen when help button is clicked', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" showHelpButton />
      </Provider>
    );
    
    const helpButton = screen.getByRole('button', { name: /help/i });
    fireEvent.click(helpButton);
    
    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(setScreen('how-to-play'));
  });

  it('should apply custom className', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title" className="custom-header" />
      </Provider>
    );
    
    // Assert
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
    expect(header).toHaveClass('custom-header');
  });

  it('should apply theme class based on current theme', () => {
    // Arrange
    const darkThemeStore = mockStore({
      ui: {
        currentScreen: 'gameplay',
        theme: 'dark'
      },
      user: {
        settings: {
          soundEnabled: true
        }
      }
    });
    darkThemeStore.dispatch = jest.fn();
    
    // Act
    render(
      <Provider store={darkThemeStore}>
        <Header title="Game Title" />
      </Provider>
    );
    
    // Assert
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header--dark');
  });

  it('should render children when provided', () => {
    // Act
    render(
      <Provider store={store}>
        <Header title="Game Title">
          <div data-testid="custom-content">Custom Content</div>
        </Header>
      </Provider>
    );
    
    // Assert
    const customContent = screen.getByTestId('custom-content');
    expect(customContent).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});
import {
  saveGameSession,
  getGameSession,
  getAllGameSessions,
  deleteGameSession,
  saveUserSettings,
  getUserSettings,
  clearAllData
} from '../../services/storageService';

describe('storageService', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  // Replace global localStorage with mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  // Reset mocks and localStorage before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('saveGameSession', () => {
    it('should save a game session to localStorage', async () => {
      // Arrange
      const gameSession = {
        id: 'session1',
        startTime: new Date(2023, 0, 1).toISOString(),
        score: 100
      };

      // Act
      await saveGameSession(gameSession);

      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gameSession_session1',
        expect.any(String)
      );
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toEqual(gameSession);
    });

    it('should throw an error if game session has no ID', async () => {
      // Arrange
      const gameSession = {
        startTime: new Date(2023, 0, 1).toISOString(),
        score: 100
      };

      // Act & Assert
      await expect(saveGameSession(gameSession)).rejects.toThrow('Game session must have an ID');
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      const gameSession = {
        id: 'session1',
        startTime: new Date(2023, 0, 1).toISOString(),
        score: 100
      };

      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(saveGameSession(gameSession)).rejects.toThrow('Failed to save game session');
    });
  });

  describe('getGameSession', () => {
    it('should retrieve a game session from localStorage', async () => {
      // Arrange
      const gameSession = {
        id: 'session1',
        startTime: new Date(2023, 0, 1).toISOString(),
        score: 100
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(gameSession));

      // Act
      const result = await getGameSession('session1');

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('gameSession_session1');
      expect(result).toEqual(gameSession);
    });

    it('should return null if game session not found', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);

      // Act
      const result = await getGameSession('nonexistent');

      // Assert
      expect(result).toBeNull();
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(getGameSession('session1')).rejects.toThrow('Failed to retrieve game session');
    });
  });

  describe('getAllGameSessions', () => {
    it('should retrieve all game sessions from localStorage', async () => {
      // Arrange
      const gameSession1 = {
        id: 'session1',
        startTime: new Date(2023, 0, 1).toISOString(),
        score: 100
      };
      const gameSession2 = {
        id: 'session2',
        startTime: new Date(2023, 0, 2).toISOString(),
        score: 200
      };

      // Mock localStorage to contain multiple items
      const mockItems = {
        'gameSession_session1': JSON.stringify(gameSession1),
        'gameSession_session2': JSON.stringify(gameSession2),
        'userSettings': JSON.stringify({ difficulty: 'easy' }) // Non-game session item
      };

      // Override getItem to check the mock items
      localStorageMock.getItem.mockImplementation(key => mockItems[key] || null);

      // Mock Object.keys to return all keys
      const originalKeys = Object.keys;
      Object.keys = jest.fn(() => Object.keys(mockItems));

      // Act
      const result = await getAllGameSessions();

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(gameSession1);
      expect(result).toContainEqual(gameSession2);

      // Restore Object.keys
      Object.keys = originalKeys;
    });

    it('should return empty array if no game sessions found', async () => {
      // Arrange
      // Mock Object.keys to return non-game session keys
      const originalKeys = Object.keys;
      Object.keys = jest.fn(() => ['userSettings', 'otherData']);

      // Act
      const result = await getAllGameSessions();

      // Assert
      expect(result).toHaveLength(0);

      // Restore Object.keys
      Object.keys = originalKeys;
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      // Mock Object.keys to throw an error
      const originalKeys = Object.keys;
      Object.keys = jest.fn(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(getAllGameSessions()).rejects.toThrow('Failed to retrieve game sessions');

      // Restore Object.keys
      Object.keys = originalKeys;
    });
  });

  describe('deleteGameSession', () => {
    it('should delete a game session from localStorage', async () => {
      // Act
      await deleteGameSession('session1');

      // Assert
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('gameSession_session1');
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(deleteGameSession('session1')).rejects.toThrow('Failed to delete game session');
    });
  });

  describe('saveUserSettings', () => {
    it('should save user settings to localStorage', async () => {
      // Arrange
      const settings = {
        difficulty: 'medium',
        soundEnabled: true,
        theme: 'dark'
      };

      // Act
      await saveUserSettings(settings);

      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userSettings',
        expect.any(String)
      );
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toEqual(settings);
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      const settings = { difficulty: 'easy' };
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(saveUserSettings(settings)).rejects.toThrow('Failed to save user settings');
    });
  });

  describe('getUserSettings', () => {
    it('should retrieve user settings from localStorage', async () => {
      // Arrange
      const settings = {
        difficulty: 'medium',
        soundEnabled: true,
        theme: 'dark'
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(settings));

      // Act
      const result = await getUserSettings();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userSettings');
      expect(result).toEqual(settings);
    });

    it('should return default settings if no settings found', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);

      // Act
      const result = await getUserSettings();

      // Assert
      expect(result).toEqual({
        difficulty: 'easy',
        roundCount: 10,
        timeLimit: 30,
        soundEnabled: true,
        theme: 'light'
      });
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(getUserSettings()).rejects.toThrow('Failed to retrieve user settings');
    });
  });

  describe('clearAllData', () => {
    it('should clear all data from localStorage', async () => {
      // Act
      await clearAllData();

      // Assert
      expect(localStorageMock.clear).toHaveBeenCalled();
    });

    it('should throw an error if localStorage is not available', async () => {
      // Arrange
      localStorageMock.clear.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Act & Assert
      await expect(clearAllData()).rejects.toThrow('Failed to clear data');
    });
  });
});
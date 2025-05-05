import {
  initSoundService,
  playSound,
  setSoundEnabled,
  isSoundEnabled
} from '../../services/soundService';

describe('soundService', () => {
  // Mock Audio
  const mockAudio = {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    currentTime: 0
  };

  // Mock AudioContext
  const mockAudioContext = {
    createBufferSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    }),
    createGain: jest.fn().mockReturnValue({
      connect: jest.fn(),
      gain: { value: 1 }
    }),
    destination: {},
    decodeAudioData: jest.fn().mockResolvedValue({})
  };

  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0))
  });

  // Mock Audio constructor
  global.Audio = jest.fn(() => mockAudio);

  // Mock AudioContext constructor
  global.AudioContext = jest.fn(() => mockAudioContext);
  global.webkitAudioContext = jest.fn(() => mockAudioContext);

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initSoundService', () => {
    it('should initialize the sound service', async () => {
      // Act
      await initSoundService();

      // Assert
      expect(global.fetch).toHaveBeenCalledTimes(4); // For each sound type
      expect(mockAudioContext.decodeAudioData).toHaveBeenCalledTimes(4);
    });

    it('should handle initialization errors gracefully', async () => {
      // Arrange
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      // Act
      await expect(initSoundService()).resolves.not.toThrow();

      // Assert
      expect(global.fetch).toHaveBeenCalled();
      // Should continue loading other sounds even if one fails
      expect(mockAudioContext.decodeAudioData).toHaveBeenCalled();
    });
  });

  describe('playSound', () => {
    it('should play the specified sound if sound is enabled', async () => {
      // Arrange
      await initSoundService();
      setSoundEnabled(true);

      // Act
      await playSound('correct');

      // Assert
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
      const source = mockAudioContext.createBufferSource.mock.results[0].value;
      expect(source.connect).toHaveBeenCalled();
      expect(source.start).toHaveBeenCalled();
    });

    it('should not play sound if sound is disabled', async () => {
      // Arrange
      await initSoundService();
      setSoundEnabled(false);

      // Act
      await playSound('correct');

      // Assert
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled();
    });

    it('should handle unknown sound types gracefully', async () => {
      // Arrange
      await initSoundService();
      setSoundEnabled(true);

      // Act
      await playSound('nonexistent');

      // Assert
      // Should not throw an error
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled();
    });

    it('should handle playback errors gracefully', async () => {
      // Arrange
      await initSoundService();
      setSoundEnabled(true);
      
      // Mock createBufferSource to throw an error
      mockAudioContext.createBufferSource.mockImplementationOnce(() => {
        throw new Error('Audio error');
      });

      // Act
      await expect(playSound('correct')).resolves.not.toThrow();

      // Assert
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    });
  });

  describe('setSoundEnabled', () => {
    it('should enable sound', () => {
      // Act
      setSoundEnabled(true);

      // Assert
      expect(isSoundEnabled()).toBe(true);
    });

    it('should disable sound', () => {
      // Act
      setSoundEnabled(false);

      // Assert
      expect(isSoundEnabled()).toBe(false);
    });
  });

  describe('isSoundEnabled', () => {
    it('should return true when sound is enabled', () => {
      // Arrange
      setSoundEnabled(true);

      // Act
      const result = isSoundEnabled();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when sound is disabled', () => {
      // Arrange
      setSoundEnabled(false);

      // Act
      const result = isSoundEnabled();

      // Assert
      expect(result).toBe(false);
    });
  });
});
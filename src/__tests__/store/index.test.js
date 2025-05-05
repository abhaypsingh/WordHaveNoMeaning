import { store, persistor } from '../../store';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

// Mock dependencies
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  configureStore: jest.fn().mockReturnValue({ getState: jest.fn() })
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn().mockReturnValue({})
}));

describe('Redux Store Configuration', () => {
  it('should create a Redux store', () => {
    // Assert
    expect(store).toBeDefined();
    expect(configureStore).toHaveBeenCalled();
  });

  it('should create a persistor for the store', () => {
    // Assert
    expect(persistor).toBeDefined();
    expect(persistStore).toHaveBeenCalledWith(store);
  });

  it('should configure the store with the correct options', () => {
    // Assert
    expect(configureStore).toHaveBeenCalledWith(
      expect.objectContaining({
        reducer: expect.any(Object),
        middleware: expect.any(Array),
        devTools: expect.any(Boolean)
      })
    );
  });

  it('should include all required reducers', () => {
    // Get the reducer argument passed to configureStore
    const storeConfig = configureStore.mock.calls[0][0];
    const reducer = storeConfig.reducer;
    
    // Assert
    expect(reducer).toHaveProperty('game');
    expect(reducer).toHaveProperty('ui');
    expect(reducer).toHaveProperty('user');
    expect(reducer).toHaveProperty('educational');
  });
});
import uiReducer, {
  setScreen,
  showModal,
  hideModal,
  setTheme,
  setLoading,
  setError,
  clearError,
  selectCurrentScreen,
  selectModalState,
  selectTheme,
  selectIsLoading,
  selectError
} from '../../../store/slices/uiSlice';

describe('uiSlice', () => {
  // Initial state
  const initialState = {
    currentScreen: 'launch',
    modal: {
      isVisible: false,
      type: null,
      data: null
    },
    theme: 'light',
    loading: false,
    error: null
  };

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(uiReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle setScreen', () => {
      // Arrange
      const screen = 'gameplay';
      
      // Act
      const nextState = uiReducer(initialState, setScreen(screen));
      
      // Assert
      expect(nextState.currentScreen).toBe(screen);
    });

    it('should handle showModal', () => {
      // Arrange
      const modalData = {
        type: 'confirmation',
        data: { message: 'Are you sure?' }
      };
      
      // Act
      const nextState = uiReducer(initialState, showModal(modalData));
      
      // Assert
      expect(nextState.modal.isVisible).toBe(true);
      expect(nextState.modal.type).toBe('confirmation');
      expect(nextState.modal.data).toEqual({ message: 'Are you sure?' });
    });

    it('should handle hideModal', () => {
      // Arrange
      const state = {
        ...initialState,
        modal: {
          isVisible: true,
          type: 'confirmation',
          data: { message: 'Are you sure?' }
        }
      };
      
      // Act
      const nextState = uiReducer(state, hideModal());
      
      // Assert
      expect(nextState.modal.isVisible).toBe(false);
      expect(nextState.modal.type).toBeNull();
      expect(nextState.modal.data).toBeNull();
    });

    it('should handle setTheme', () => {
      // Arrange
      const theme = 'dark';
      
      // Act
      const nextState = uiReducer(initialState, setTheme(theme));
      
      // Assert
      expect(nextState.theme).toBe(theme);
    });

    it('should handle setLoading', () => {
      // Arrange
      const isLoading = true;
      
      // Act
      const nextState = uiReducer(initialState, setLoading(isLoading));
      
      // Assert
      expect(nextState.loading).toBe(isLoading);
    });

    it('should handle setError', () => {
      // Arrange
      const error = 'Something went wrong';
      
      // Act
      const nextState = uiReducer(initialState, setError(error));
      
      // Assert
      expect(nextState.error).toBe(error);
    });

    it('should handle clearError', () => {
      // Arrange
      const state = {
        ...initialState,
        error: 'Something went wrong'
      };
      
      // Act
      const nextState = uiReducer(state, clearError());
      
      // Assert
      expect(nextState.error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('selectCurrentScreen should return the current screen', () => {
      // Arrange
      const state = { ui: { currentScreen: 'gameplay' } };
      
      // Act
      const result = selectCurrentScreen(state);
      
      // Assert
      expect(result).toBe('gameplay');
    });

    it('selectModalState should return the modal state', () => {
      // Arrange
      const modalState = {
        isVisible: true,
        type: 'confirmation',
        data: { message: 'Are you sure?' }
      };
      const state = { ui: { modal: modalState } };
      
      // Act
      const result = selectModalState(state);
      
      // Assert
      expect(result).toBe(modalState);
    });

    it('selectTheme should return the theme', () => {
      // Arrange
      const state = { ui: { theme: 'dark' } };
      
      // Act
      const result = selectTheme(state);
      
      // Assert
      expect(result).toBe('dark');
    });

    it('selectIsLoading should return the loading state', () => {
      // Arrange
      const state = { ui: { loading: true } };
      
      // Act
      const result = selectIsLoading(state);
      
      // Assert
      expect(result).toBe(true);
    });

    it('selectError should return the error state', () => {
      // Arrange
      const error = 'Something went wrong';
      const state = { ui: { error } };
      
      // Act
      const result = selectError(state);
      
      // Assert
      expect(result).toBe(error);
    });
  });

  describe('action creators', () => {
    it('setScreen should create the correct action', () => {
      // Arrange
      const screen = 'gameplay';
      
      // Act
      const action = setScreen(screen);
      
      // Assert
      expect(action.type).toBe('ui/setScreen');
      expect(action.payload).toBe(screen);
    });

    it('showModal should create the correct action', () => {
      // Arrange
      const modalData = {
        type: 'confirmation',
        data: { message: 'Are you sure?' }
      };
      
      // Act
      const action = showModal(modalData);
      
      // Assert
      expect(action.type).toBe('ui/showModal');
      expect(action.payload).toEqual(modalData);
    });

    it('hideModal should create the correct action', () => {
      // Act
      const action = hideModal();
      
      // Assert
      expect(action.type).toBe('ui/hideModal');
    });

    it('setTheme should create the correct action', () => {
      // Arrange
      const theme = 'dark';
      
      // Act
      const action = setTheme(theme);
      
      // Assert
      expect(action.type).toBe('ui/setTheme');
      expect(action.payload).toBe(theme);
    });

    it('setLoading should create the correct action', () => {
      // Arrange
      const isLoading = true;
      
      // Act
      const action = setLoading(isLoading);
      
      // Assert
      expect(action.type).toBe('ui/setLoading');
      expect(action.payload).toBe(isLoading);
    });

    it('setError should create the correct action', () => {
      // Arrange
      const error = 'Something went wrong';
      
      // Act
      const action = setError(error);
      
      // Assert
      expect(action.type).toBe('ui/setError');
      expect(action.payload).toBe(error);
    });

    it('clearError should create the correct action', () => {
      // Act
      const action = clearError();
      
      // Assert
      expect(action.type).toBe('ui/clearError');
    });
  });
});
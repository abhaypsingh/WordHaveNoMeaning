import educationalReducer, {
  fetchConcepts,
  fetchMessages,
  fetchExplanations,
  recordConceptExposure,
  generateTakeaways,
  selectConcepts,
  selectMessages,
  selectExplanations,
  selectTakeaways,
  selectEducationalLoading,
  selectEducationalError
} from '../../../store/slices/educationalSlice';
import * as educationalService from '../../../services/educationalService';

// Mock dependencies
jest.mock('../../../services/educationalService');

describe('educationalSlice', () => {
  // Mock data
  const mockConcepts = [
    {
      id: 'context_dependence',
      name: 'Context Dependence',
      description: 'Words derive their meaning from context',
      levels: ['basic', 'intermediate', 'advanced'],
      relatedConcepts: ['ambiguity']
    },
    {
      id: 'ambiguity',
      name: 'Linguistic Ambiguity',
      description: 'Words can have multiple interpretations',
      levels: ['basic', 'intermediate', 'advanced'],
      relatedConcepts: ['context_dependence']
    }
  ];

  const mockMessages = [
    {
      id: 'msg1',
      text: 'Words have no inherent meaning without context.',
      conceptId: 'context_dependence',
      difficulty: 'easy',
      type: 'introduction'
    },
    {
      id: 'msg2',
      text: 'The same word can have contradictory meanings in different contexts.',
      conceptId: 'ambiguity',
      difficulty: 'easy',
      type: 'contradiction'
    }
  ];

  const mockExplanations = [
    {
      id: 'exp1',
      conceptId: 'context_dependence',
      level: 'basic',
      text: 'Words are just symbols that get their meaning from how they are used.'
    },
    {
      id: 'exp2',
      conceptId: 'ambiguity',
      level: 'basic',
      text: 'Many words have multiple meanings that can be very different from each other.'
    }
  ];

  const mockTakeaways = [
    {
      id: 'takeaway1',
      text: 'Always consider context when interpreting language.',
      conceptIds: ['context_dependence'],
      requiredExposureCount: 1
    },
    {
      id: 'takeaway2',
      text: 'Words can have contradictory meanings depending on their usage.',
      conceptIds: ['ambiguity'],
      requiredExposureCount: 1
    }
  ];

  // Initial state
  const initialState = {
    concepts: [],
    messages: [],
    explanations: [],
    takeaways: [],
    loading: false,
    error: null,
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    educationalService.getEducationalConcepts = jest.fn().mockResolvedValue(mockConcepts);
    educationalService.getEducationalMessages = jest.fn().mockResolvedValue(mockMessages);
    educationalService.getConceptExplanations = jest.fn().mockResolvedValue(mockExplanations);
    educationalService.recordConceptExposure = jest.fn().mockResolvedValue(undefined);
    educationalService.generateLearningTakeaways = jest.fn().mockResolvedValue(mockTakeaways);
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(educationalReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('async thunks', () => {
    describe('fetchConcepts', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: fetchConcepts.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set concepts when fulfilled', () => {
        // Arrange
        const action = {
          type: fetchConcepts.fulfilled.type,
          payload: mockConcepts
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.concepts).toEqual(mockConcepts);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to fetch concepts';
        const action = {
          type: fetchConcepts.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
        expect(nextState.concepts).toEqual([]);
      });
    });

    describe('fetchMessages', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: fetchMessages.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set messages when fulfilled', () => {
        // Arrange
        const action = {
          type: fetchMessages.fulfilled.type,
          payload: mockMessages
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.messages).toEqual(mockMessages);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to fetch messages';
        const action = {
          type: fetchMessages.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
        expect(nextState.messages).toEqual([]);
      });
    });

    describe('fetchExplanations', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: fetchExplanations.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set explanations when fulfilled', () => {
        // Arrange
        const action = {
          type: fetchExplanations.fulfilled.type,
          payload: mockExplanations
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.explanations).toEqual(mockExplanations);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to fetch explanations';
        const action = {
          type: fetchExplanations.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
        expect(nextState.explanations).toEqual([]);
      });
    });

    describe('recordConceptExposure', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: recordConceptExposure.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should update state when fulfilled', () => {
        // Arrange
        const action = {
          type: recordConceptExposure.fulfilled.type
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to record concept exposure';
        const action = {
          type: recordConceptExposure.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
      });
    });

    describe('generateTakeaways', () => {
      it('should set loading state while pending', () => {
        // Arrange
        const action = { type: generateTakeaways.pending.type };
        const state = { ...initialState };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
      });

      it('should set takeaways when fulfilled', () => {
        // Arrange
        const action = {
          type: generateTakeaways.fulfilled.type,
          payload: mockTakeaways
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.takeaways).toEqual(mockTakeaways);
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBeNull();
      });

      it('should set error state when rejected', () => {
        // Arrange
        const errorMessage = 'Failed to generate takeaways';
        const action = {
          type: generateTakeaways.rejected.type,
          payload: errorMessage
        };
        const state = { ...initialState, loading: true };

        // Act
        const nextState = educationalReducer(state, action);

        // Assert
        expect(nextState.loading).toBe(false);
        expect(nextState.error).toBe(errorMessage);
        expect(nextState.takeaways).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    it('selectConcepts should return the concepts', () => {
      // Arrange
      const state = { educational: { concepts: mockConcepts } };

      // Act
      const result = selectConcepts(state);

      // Assert
      expect(result).toBe(mockConcepts);
    });

    it('selectMessages should return the messages', () => {
      // Arrange
      const state = { educational: { messages: mockMessages } };

      // Act
      const result = selectMessages(state);

      // Assert
      expect(result).toBe(mockMessages);
    });

    it('selectExplanations should return the explanations', () => {
      // Arrange
      const state = { educational: { explanations: mockExplanations } };

      // Act
      const result = selectExplanations(state);

      // Assert
      expect(result).toBe(mockExplanations);
    });

    it('selectTakeaways should return the takeaways', () => {
      // Arrange
      const state = { educational: { takeaways: mockTakeaways } };

      // Act
      const result = selectTakeaways(state);

      // Assert
      expect(result).toBe(mockTakeaways);
    });

    it('selectEducationalLoading should return the loading state', () => {
      // Arrange
      const state = { educational: { loading: true } };

      // Act
      const result = selectEducationalLoading(state);

      // Assert
      expect(result).toBe(true);
    });

    it('selectEducationalError should return the error state', () => {
      // Arrange
      const error = 'Some error';
      const state = { educational: { error } };

      // Act
      const result = selectEducationalError(state);

      // Assert
      expect(result).toBe(error);
    });
  });
});
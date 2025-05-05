import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEducationalMessage, getConceptExplanation, getGameTakeaways } from '../../services/educationalService';

// Initial state
const initialState = {
  messages: [],
  concepts: [],
  takeaways: [],
  currentMessage: null,
  currentConcept: null,
  loading: false,
  error: null,
  conceptExposures: {}, // Track concept exposures for spaced repetition
  learningStage: 'introduction', // introduction, exploration, contradiction, conceptualization, application, synthesis
};

// Async thunks
export const fetchEducationalMessage = createAsyncThunk(
  'educational/fetchMessage',
  async ({ word, selectedMeaning, contradictionMeaning }, { rejectWithValue }) => {
    try {
      const message = await getEducationalMessage(word, selectedMeaning, contradictionMeaning);
      return message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchConceptExplanation = createAsyncThunk(
  'educational/fetchConcept',
  async (conceptId, { rejectWithValue }) => {
    try {
      const concept = await getConceptExplanation(conceptId);
      return concept;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGameTakeaways = createAsyncThunk(
  'educational/fetchTakeaways',
  async (encounteredConcepts, { rejectWithValue }) => {
    try {
      const takeaways = await getGameTakeaways(encounteredConcepts);
      return takeaways;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const educationalSlice = createSlice({
  name: 'educational',
  initialState,
  reducers: {
    recordConceptExposure: (state, action) => {
      const conceptId = action.payload;
      
      if (!state.conceptExposures[conceptId]) {
        state.conceptExposures[conceptId] = [];
      }
      
      state.conceptExposures[conceptId].push(new Date().toISOString());
    },
    setLearningStage: (state, action) => {
      state.learningStage = action.payload;
    },
    resetEducationalState: (state) => {
      state.currentMessage = null;
      state.currentConcept = null;
      state.takeaways = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch educational message
      .addCase(fetchEducationalMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationalMessage.fulfilled, (state, action) => {
        state.currentMessage = action.payload;
        
        // Add to messages if not already present
        if (!state.messages.some(msg => msg.id === action.payload.id)) {
          state.messages.push(action.payload);
        }
        
        state.loading = false;
      })
      .addCase(fetchEducationalMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch concept explanation
      .addCase(fetchConceptExplanation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConceptExplanation.fulfilled, (state, action) => {
        state.currentConcept = action.payload;
        
        // Add to concepts if not already present
        if (!state.concepts.some(concept => concept.id === action.payload.id)) {
          state.concepts.push(action.payload);
        }
        
        state.loading = false;
      })
      .addCase(fetchConceptExplanation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch game takeaways
      .addCase(fetchGameTakeaways.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameTakeaways.fulfilled, (state, action) => {
        state.takeaways = action.payload;
        state.loading = false;
      })
      .addCase(fetchGameTakeaways.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  recordConceptExposure,
  setLearningStage,
  resetEducationalState,
} = educationalSlice.actions;

export default educationalSlice.reducer;

// Selectors
export const selectCurrentMessage = (state) => state.educational.currentMessage;
export const selectCurrentConcept = (state) => state.educational.currentConcept;
export const selectTakeaways = (state) => state.educational.takeaways;
export const selectEducationalLoading = (state) => state.educational.loading;
export const selectEducationalError = (state) => state.educational.error;
export const selectConceptExposures = (state) => state.educational.conceptExposures;
export const selectLearningStage = (state) => state.educational.learningStage;

// Helper selector to determine if a concept should be reinforced
export const selectShouldReinforce = (state, conceptId) => {
  const exposures = state.educational.conceptExposures[conceptId];
  
  if (!exposures || exposures.length === 0) {
    return false; // No exposures yet, so no need to reinforce
  }
  
  // Get the last exposure time
  const lastExposure = new Date(exposures[exposures.length - 1]);
  const now = new Date();
  
  // Calculate time since last exposure in hours
  const hoursSinceLastExposure = (now - lastExposure) / (1000 * 60 * 60);
  
  // Simple spaced repetition algorithm:
  // - First reinforcement after 1 hour
  // - Second reinforcement after 3 hours
  // - Third reinforcement after 8 hours
  // - Fourth reinforcement after 24 hours
  
  switch (exposures.length) {
    case 1:
      return hoursSinceLastExposure >= 1;
    case 2:
      return hoursSinceLastExposure >= 3;
    case 3:
      return hoursSinceLastExposure >= 8;
    case 4:
      return hoursSinceLastExposure >= 24;
    default:
      return false; // Already reinforced enough
  }
};
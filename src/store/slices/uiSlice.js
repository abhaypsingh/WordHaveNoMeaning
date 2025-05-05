import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  theme: 'default',
  animations: true,
  soundEffects: true,
  modalOpen: false,
  modalContent: null,
  currentScreen: 'launch',
  showingContradiction: false,
  contradictionData: null,
  timeRemaining: 0,
  animationState: 'idle',
  selectedOptionIndex: null,
  educationalMessage: null,
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleAnimations: (state) => {
      state.animations = !state.animations;
    },
    toggleSoundEffects: (state) => {
      state.soundEffects = !state.soundEffects;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
    },
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    showContradiction: (state, action) => {
      state.showingContradiction = true;
      state.contradictionData = action.payload;
    },
    hideContradiction: (state) => {
      state.showingContradiction = false;
      state.contradictionData = null;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setAnimationState: (state, action) => {
      state.animationState = action.payload;
    },
    setSelectedOptionIndex: (state, action) => {
      state.selectedOptionIndex = action.payload;
    },
    setEducationalMessage: (state, action) => {
      state.educationalMessage = action.payload;
    },
    resetUiState: (state) => {
      state.showingContradiction = false;
      state.contradictionData = null;
      state.timeRemaining = 0;
      state.animationState = 'idle';
      state.selectedOptionIndex = null;
      state.educationalMessage = null;
    },
  },
});

// Export actions and reducer
export const {
  setTheme,
  toggleAnimations,
  toggleSoundEffects,
  openModal,
  closeModal,
  setCurrentScreen,
  showContradiction,
  hideContradiction,
  setTimeRemaining,
  setAnimationState,
  setSelectedOptionIndex,
  setEducationalMessage,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectAnimations = (state) => state.ui.animations;
export const selectSoundEffects = (state) => state.ui.soundEffects;
export const selectModalOpen = (state) => state.ui.modalOpen;
export const selectModalContent = (state) => state.ui.modalContent;
export const selectCurrentScreen = (state) => state.ui.currentScreen;
export const selectShowingContradiction = (state) => state.ui.showingContradiction;
export const selectContradictionData = (state) => state.ui.contradictionData;
export const selectTimeRemaining = (state) => state.ui.timeRemaining;
export const selectAnimationState = (state) => state.ui.animationState;
export const selectSelectedOptionIndex = (state) => state.ui.selectedOptionIndex;
export const selectEducationalMessage = (state) => state.ui.educationalMessage;
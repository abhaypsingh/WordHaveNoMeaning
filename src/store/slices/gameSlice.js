import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { selectWordsForGame } from '../../services/wordService';

// Initial state
const initialState = {
  gameSession: null,
  loading: false,
  error: null,
};

// Async thunks
export const initializeGame = createAsyncThunk(
  'game/initializeGame',
  async (settings, { rejectWithValue }) => {
    try {
      // Get words for the game based on difficulty and round count
      const selectedWords = await selectWordsForGame(settings.difficulty, settings.roundCount);
      
      // Create game session
      const gameSession = {
        id: uuidv4(),
        startTime: new Date(),
        endTime: null,
        settings,
        currentRound: 0,
        totalRounds: settings.roundCount,
        score: 0,
        rounds: [],
        completed: false,
        encounteredConcepts: [],
      };
      
      // Create rounds for each selected word
      const rounds = selectedWords.map((word, index) => {
        // Generate options for this word
        const options = generateMeaningOptions(word);
        
        // Select a contradiction meaning
        const correctMeaning = selectContradictionMeaning(word, options);
        
        // Mark the contradiction meaning in the options
        const markedOptions = options.map(option => ({
          ...option,
          isContradiction: option.text === correctMeaning.definition
        }));
        
        return {
          roundNumber: index + 1,
          word,
          correctMeaning,
          options: markedOptions,
          selectedOption: null,
          timeSpent: 0,
          score: 0,
          completed: false,
        };
      });
      
      // Add rounds to game session
      gameSession.rounds = rounds;
      
      return gameSession;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startNextRound = createAsyncThunk(
  'game/startNextRound',
  async (_, { getState, rejectWithValue }) => {
    try {
    
      const { game } = getState();
      const { gameSession } = game;
      
      
      
      if (!gameSession) {
        console.error("No active game session");
        throw new Error('No active game session');
      }
      
      if (gameSession.currentRound >= gameSession.totalRounds) {
        console.error("No more rounds available");
        throw new Error('No more rounds available');
      }
      
      const nextRound = gameSession.currentRound + 1;
      
      return nextRound;
    } catch (error) {
      console.error("Error in startNextRound:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const processUserSelection = createAsyncThunk(
  'game/processUserSelection',
  async ({ optionIndex, timeSpent }, { getState, rejectWithValue }) => {
    try {

      const { game } = getState();
      const { gameSession } = game;
      
  
      
      if (!gameSession) {
        console.error("No active game session");
        throw new Error('No active game session');
      }
      
      const currentRound = gameSession.rounds[gameSession.currentRound - 1];
      
      if (!currentRound) {
        console.error("Invalid round");
        throw new Error('Invalid round');
      }
      
  
      
      const selectedOption = currentRound.options[optionIndex];
      
      if (!selectedOption) {
        console.error("Invalid option selected");
        throw new Error('Invalid option selected');
      }
      
     
      
      // Calculate score
      const baseScore = selectedOption.isCorrect ? 100 : 25;
      const timeBonus = calculateTimeBonus(timeSpent, gameSession.settings.timeLimit);
      const difficultyMultiplier = getDifficultyMultiplier(gameSession.settings.difficulty);
      
      const score = Math.round(baseScore * timeBonus * difficultyMultiplier);
     
      
      return {
        roundIndex: gameSession.currentRound - 1,
        optionIndex,
        timeSpent,
        score,
      };
    } catch (error) {
      console.error("Error in processUserSelection:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const completeGame = createAsyncThunk(
  'game/completeGame',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { game } = getState();
      const { gameSession } = game;
      
      if (!gameSession) {
        throw new Error('No active game session');
      }
      
      // Calculate final statistics
      let totalTimeSpent = 0;
      let correctAnswers = 0;
      
      gameSession.rounds.forEach(round => {
        totalTimeSpent += round.timeSpent;
        
        if (round.selectedOption !== null) {
          const selectedOption = round.options[round.selectedOption];
          if (selectedOption && selectedOption.isCorrect) {
            correctAnswers += 1;
          }
        }
      });
      
      const averageTimePerRound = totalTimeSpent / gameSession.totalRounds;
      const accuracyRate = (correctAnswers / gameSession.totalRounds) * 100;
      
      return {
        endTime: new Date(),
        totalTimeSpent,
        correctAnswers,
        averageTimePerRound,
        accuracyRate,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper functions
function generateMeaningOptions(word) {
  // In a real implementation, this would generate options based on the word's meanings
  // and distractors from the database. For now, we'll create a simplified version.
  
  // Include actual meanings (up to 3)
  const actualMeanings = word.meanings.slice(0, Math.min(3, word.meanings.length));
  
  const options = actualMeanings.map((meaning, index) => ({
    index,
    text: meaning.definition,
    isCorrect: true,
    isContradiction: false,
  }));
  
  // Fill remaining slots with distractors
  const neededDistractors = 4 - options.length;
  
  if (neededDistractors > 0) {
    // In a real implementation, these would come from a distractor database
    const dummyDistractors = [
      "To prepare food by heating it in an oven",
      "A small, round fruit with red or green skin",
      "A device used for measuring time",
      "A large, four-legged animal with a trunk",
    ].slice(0, neededDistractors);
    
    dummyDistractors.forEach((distractor, _index) => {
      options.push({
        index: options.length,
        text: distractor,
        isCorrect: false,
        isContradiction: false,
      });
    });
  }
  
  // Shuffle options
  return shuffleArray(options);
}

function selectContradictionMeaning(word, options) {
  // In a real implementation, this would select a meaning that has contradiction sentences
  // For now, we'll just pick one of the correct meanings
  
  const correctOptions = options.filter(option => option.isCorrect);
  
  if (correctOptions.length === 0) {
    // Fallback to any meaning if no correct options
    return word.meanings[0];
  }
  
  const randomIndex = Math.floor(Math.random() * correctOptions.length);
  const selectedOption = correctOptions[randomIndex];
  
  // Find the corresponding meaning
  return word.meanings.find(meaning => meaning.definition === selectedOption.text) || word.meanings[0];
}

function calculateTimeBonus(timeSpent, timeLimit) {
  if (timeLimit === 0) {
    return 1.0; // No time bonus if no time limit
  }
  
  // Calculate bonus factor (1.0 to 1.5)
  const timeRatio = 1 - (timeSpent / timeLimit);
  const bonus = 1.0 + (timeRatio * 0.5);
  
  // Ensure bonus is within bounds
  return Math.max(1.0, Math.min(1.5, bonus));
}

function getDifficultyMultiplier(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 1.0;
    case 'medium':
      return 1.25;
    case 'hard':
      return 1.5;
    default:
      return 1.0;
  }
}

function shuffleArray(array) {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// Create slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.gameSession = null;
      state.loading = false;
      state.error = null;
    },
    restoreSession: (state, action) => {
      // When restoring a session, ensure the local state is properly initialized
      const session = action.payload;
      
      // If the session has a current round, ensure it's not marked as completed
      // unless the game itself is completed
      if (session && !session.completed && session.currentRound > 0 && session.rounds) {
        const currentRoundIndex = session.currentRound - 1;
        if (currentRoundIndex >= 0 && currentRoundIndex < session.rounds.length) {
          // Reset the current round's state to ensure options aren't disabled
          session.rounds[currentRoundIndex].selectedOption = null;
          session.rounds[currentRoundIndex].completed = false;
        }
      }
      
      state.gameSession = session;
      state.loading = false;
      state.error = null;
    },
    clearRoundSelection: (state) => {
      // Clear the selection for the current round
      if (state.gameSession && state.gameSession.currentRound > 0) {
        const currentRoundIndex = state.gameSession.currentRound - 1;
        if (currentRoundIndex >= 0 && currentRoundIndex < state.gameSession.rounds.length) {
          state.gameSession.rounds[currentRoundIndex].selectedOption = null;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize game
      .addCase(initializeGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.gameSession = action.payload;
        state.loading = false;
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start next round
      .addCase(startNextRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNextRound.fulfilled, (state, action) => {
       
        if (state.gameSession) {
          state.gameSession.currentRound = action.payload;
        
        } else {
          console.error("Cannot update currentRound: gameSession is null");
        }
        state.loading = false;
      })
      .addCase(startNextRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Process user selection
      .addCase(processUserSelection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processUserSelection.fulfilled, (state, action) => {
     
        if (state.gameSession) {
          const { roundIndex, optionIndex, timeSpent, score } = action.payload;
          const round = state.gameSession.rounds[roundIndex];
          
          if (round) {
          
            round.selectedOption = optionIndex;
            round.timeSpent = timeSpent;
            round.score = score;
            round.completed = true;
            
            // Update total score
            state.gameSession.score += score;
            
          } else {
            console.error("Cannot update round: round is null");
          }
        } else {
          console.error("Cannot update round: gameSession is null");
        }
        state.loading = false;
      })
      .addCase(processUserSelection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Complete game
      .addCase(completeGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeGame.fulfilled, (state, action) => {
        if (state.gameSession) {
          state.gameSession.endTime = action.payload.endTime;
          state.gameSession.completed = true;
        }
        state.loading = false;
      })
      .addCase(completeGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetGame, restoreSession, clearRoundSelection } = gameSlice.actions;
export default gameSlice.reducer;

// Selectors
export const selectGameSession = (state) => state.game.gameSession;
export const selectCurrentRound = (state) => {
  const { gameSession } = state.game;
  
  if (!gameSession || gameSession.currentRound === 0) {
    return null;
  }
  
  return gameSession.rounds[gameSession.currentRound - 1];
};
export const selectGameLoading = (state) => state.game.loading;
export const selectGameError = (state) => state.game.error;
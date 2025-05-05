import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import reducers
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import educationalReducer from './slices/educationalSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'game'], // Only persist user and game state
};

const rootReducer = combineReducers({
  game: gameReducer,
  ui: uiReducer,
  user: userReducer,
  educational: educationalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
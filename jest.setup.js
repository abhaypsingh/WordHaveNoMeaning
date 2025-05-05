// Add any global test setup here
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Suppress console errors during tests
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Mock random to make tests deterministic
global.Math.random = () => 0.5;
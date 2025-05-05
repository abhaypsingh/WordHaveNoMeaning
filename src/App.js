import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Screen components
import LaunchScreen from './screens/LaunchScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import SettingsScreen from './screens/SettingsScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import GameplayScreen from './screens/GameplayScreen';
import ResultsScreen from './screens/ResultsScreen';
import AboutScreen from './screens/AboutScreen';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<LaunchScreen />} />
          <Route path="/how-to-play" element={<HowToPlayScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/setup" element={<GameSetupScreen />} />
          <Route path="/play" element={<GameplayScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/about" element={<AboutScreen />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
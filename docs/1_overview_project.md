# Words Without Meaning: Project Overview

## Introduction

"Words Without Meaning" is an educational game that demonstrates how words have no inherent meaning without context. The game challenges users' assumptions about language by presenting words with multiple potential meanings, then revealing how context dramatically changes interpretation.

This interactive experience makes abstract linguistic concepts accessible and engaging, helping players understand fundamental principles of language and communication.

## Educational Objectives

1. Demonstrate that words are arbitrary symbols whose meanings are determined by context
2. Illustrate how the same word can have contradictory meanings in different contexts
3. Encourage critical thinking about language and communication
4. Provide an engaging, interactive experience that makes linguistic concepts accessible

## Core Game Mechanics

1. Present users with words without contextual information
2. Offer multiple potential meanings for each word
3. Have users select what they believe is the correct meaning
4. Show a contradictory sentence that uses the word differently
5. Provide educational messaging about linguistic concepts
6. Track progress and provide feedback on learning

## Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/words-without-meaning.git
   cd words-without-meaning
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage Guide

### Starting the Game

1. Launch the application by running `npm start`
2. Navigate to `http://localhost:3000` in your web browser
3. Click the "Play" button on the launch screen to begin

### Game Setup

1. Select difficulty level:
   - **Easy**: Simple words with clear distinctions between meanings
   - **Medium**: More nuanced words with related meanings
   - **Hard**: Complex words including contronyms (words with contradictory meanings)

2. Configure game settings:
   - **Round Count**: Number of words to play (5-20)
   - **Time Limit**: Optional time limit per word (0-60 seconds)
   - **Sound**: Enable/disable sound effects

3. Click "Start Game" to begin playing

### Gameplay

1. A word will be displayed without context
2. Select what you believe is the correct meaning from multiple options
3. After selection, the game will show a contradictory usage of the word
4. Read the educational message explaining the linguistic concept
5. Click "Next Word" to continue to the next round
6. Complete all rounds to see your results and educational takeaways

### Results and Learning

1. Review your score and performance statistics
2. Read educational takeaways based on the linguistic concepts encountered
3. Choose to play again or return to the home screen

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
src/
├── components/           # UI components
│   ├── common/           # Reusable UI elements
│   └── game/             # Game-specific components
├── screens/              # Full-screen components
├── services/             # Business logic services
├── store/                # Redux state management
│   └── slices/           # Redux slices for different domains
├── data/                 # Static data files
│   ├── wordDatabase.js   # Word database with meanings
│   └── educationalContent.js # Educational messages and concepts
├── styles/               # Global styles
└── __tests__/            # Test suite
```

## Technology Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Styled Components
- **Testing**: Jest with React Testing Library
- **Build Tools**: React Scripts (based on Webpack)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
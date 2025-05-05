# Words Without Meaning: Architecture & Technical Documentation

## System Architecture

"Words Without Meaning" follows a layered architecture with clear separation of concerns, designed to support the core educational objectives while providing an engaging, responsive user experience.

### Architectural Layers

```
┌─────────────────────────────────────────┐
│            User Interface Layer         │
│  (Screens, Components, UI Interactions) │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│            Game Logic Layer             │
│  (Game Session, Rounds, Word Selection) │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│        Educational Content Layer        │
│  (Messages, Concepts, Takeaways)        │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│            Data Access Layer            │
│  (Word Repository, Game State, Settings)│
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│             Storage Layer               │
│  (Local Storage, IndexedDB)             │
└─────────────────────────────────────────┘
```

### Architectural Principles

1. **Separation of Concerns**: Clear boundaries between UI, game logic, educational content, and data management
2. **Modularity**: Components with well-defined interfaces that can be developed and tested independently
3. **Scalability**: Architecture that supports growth in content and user base
4. **Offline-First**: Core functionality available without internet connectivity
5. **Accessibility**: Design that accommodates users with different abilities
6. **Educational Focus**: Architecture decisions prioritize educational effectiveness

## Code Organization

The codebase is organized into the following directory structure:

```
src/
├── components/           # UI components
│   ├── common/           # Reusable UI elements (Button, Header, etc.)
│   └── game/             # Game-specific components (WordDisplay, etc.)
├── screens/              # Full-screen components
│   ├── LaunchScreen.js   # Initial launch screen
│   ├── GameSetupScreen.js # Game configuration screen
│   ├── GameplayScreen.js # Main gameplay screen
│   └── ResultsScreen.js  # Results and takeaways screen
├── services/             # Business logic services
│   ├── gameService.js    # Game mechanics and logic
│   ├── wordService.js    # Word selection and processing
│   ├── educationalService.js # Educational content management
│   ├── storageService.js # Data persistence
│   └── soundService.js   # Sound effects management
├── store/                # Redux state management
│   ├── index.js          # Store configuration
│   └── slices/           # Redux slices
│       ├── gameSlice.js  # Game state management
│       ├── uiSlice.js    # UI state management
│       ├── userSlice.js  # User settings and progress
│       └── educationalSlice.js # Educational content state
├── data/                 # Static data files
│   ├── wordDatabase.js   # Word database with meanings
│   └── educationalContent.js # Educational messages and concepts
├── styles/               # Global styles
│   └── global.css        # Global CSS variables and styles
└── App.js                # Main application component
```

## Key Components

### User Interface Components

#### Common Components

- **Button**: Reusable button component with various styles
- **Header**: Page header with title and navigation
- **ProgressBar**: Visual indicator of game progress
- **Modal**: Popup dialog for notifications and confirmations

#### Game Components

- **WordDisplay**: Displays the current word and instructions
- **OptionButton**: Selectable option for word meanings
- **TimerDisplay**: Countdown timer for timed gameplay
- **ContradictionDisplay**: Shows contradictory usage of the word

### Screen Components

- **LaunchScreen**: Entry point with play, settings, and how-to-play options
- **HowToPlayScreen**: Instructions for playing the game
- **GameSetupScreen**: Configuration for difficulty, rounds, and time limit
- **GameplayScreen**: Main gameplay screen with word, options, and feedback
- **ResultsScreen**: Game results and educational takeaways
- **SettingsScreen**: User settings configuration
- **AboutScreen**: Information about the game and its educational purpose

## State Management

The application uses Redux Toolkit for state management, with the following slices:

### Game Slice

Manages the core game state:
- Game session data
- Current round information
- Word selection and options
- User selections and scoring

### UI Slice

Manages the user interface state:
- Current screen
- Modal visibility and content
- Loading states
- Error messages

### User Slice

Manages user-related state:
- User settings (difficulty, time limit, sound)
- User progress (completed games, scores)
- Learning progress (concepts encountered)

### Educational Slice

Manages educational content:
- Current educational messages
- Linguistic concepts
- Learning takeaways

## Data Flow

### Game Initialization Flow

1. User configures game settings on GameSetupScreen
2. Game session is initialized with settings
3. Words are selected based on difficulty
4. First round is created with the initial word and options
5. User is navigated to GameplayScreen

### Game Round Flow

1. Word is presented with multiple meaning options
2. User selects an option (or time expires)
3. Selection is processed and scored
4. Contradiction is displayed with educational message
5. User proceeds to next round or completes the game

### Game Completion Flow

1. Final round is completed
2. Game statistics are calculated
3. Educational takeaways are generated based on encountered concepts
4. Results are displayed on ResultsScreen
5. Game session is saved to user history

## Data Models

### Word Model

```javascript
{
  id: "word_001",
  text: "bank",
  difficulty: "easy",
  categories: ["noun", "verb", "homonym"],
  meanings: [
    {
      id: "meaning_001",
      definition: "A financial institution...",
      partOfSpeech: "noun",
      exampleSentences: ["I need to go to the bank..."],
      contradictionSentences: ["After the heavy rain, the river bank..."],
      isArchaic: false,
      synonyms: ["financial institution", "credit union"]
    },
    // Additional meanings...
  ],
  notes: "Classic example of a homonym..."
}
```

### Game Session Model

```javascript
{
  id: "session_123",
  settings: {
    difficulty: "medium",
    roundCount: 10,
    timeLimit: 30,
    soundEnabled: true
  },
  currentRound: 3,
  totalRounds: 10,
  score: 250,
  rounds: [
    // Round data...
  ],
  completed: false,
  startTime: "2025-05-04T09:30:00Z",
  endTime: null,
  encounteredConcepts: [
    // Concepts encountered during gameplay...
  ]
}
```

### Educational Content Model

```javascript
{
  messages: [
    {
      id: "edu_msg_001",
      text: "Words have no inherent meaning without context...",
      category: "context",
      difficulty: "easy",
      relatedWords: []
    },
    // Additional messages...
  ],
  concepts: [
    {
      id: "context_dependency",
      name: "Context Dependency",
      description: "The principle that words derive their meaning...",
      examples: [
        "The word 'bank' means something completely different..."
      ],
      relatedConcepts: ["ambiguity", "polysemy", "homonymy"]
    },
    // Additional concepts...
  ],
  takeaways: [
    {
      id: "takeaway_001",
      text: "Words have no inherent meaning without context...",
      conceptId: "context_dependency",
      difficulty: "easy"
    },
    // Additional takeaways...
  ]
}
```

## Technical Implementation Details

### Word Selection Algorithm

The word selection process:
1. Filters words based on difficulty level
2. Ensures variety of linguistic concepts
3. Avoids repetition of recently encountered words
4. Balances different word categories

### Scoring System

Scoring is calculated based on:
- Correctness of selection
- Time taken to respond (faster responses earn more points)
- Difficulty level (harder words are worth more points)
- Consistency across multiple rounds

### Educational Content Selection

Educational content is selected based on:
- Current word's linguistic categories
- User's learning progression
- Previously encountered concepts
- Difficulty level

## Performance Considerations

- Word database is loaded and processed at startup
- Game state is persisted to localStorage for session recovery
- Animations and transitions are optimized for smooth performance
- Educational content is loaded progressively as needed

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatibility
- Configurable time limits
- High contrast mode option
- Resizable text
- WCAG 2.1 AA compliance

## Browser Compatibility

The application is designed to work on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Android Chrome)
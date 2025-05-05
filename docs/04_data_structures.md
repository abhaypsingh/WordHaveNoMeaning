# Words Without Meaning: Data Structures

## Overview
This document defines the core data structures required for the "Words Without Meaning" game. These structures will store word data, manage game state, track user progress, and support the educational components of the application.

## 1. Word Database

### 1.1 Word Entity
The fundamental unit of the word database is the Word entity, which contains the word itself and its various meanings.

```typescript
interface Word {
  id: string;                 // Unique identifier for the word
  text: string;               // The word itself
  difficulty: DifficultyLevel; // Easy, Medium, or Hard
  categories: string[];       // Linguistic categories (e.g., "noun", "verb", "homonym")
  meanings: Meaning[];        // Array of different meanings for this word
  notes: string;              // Optional linguistic notes about the word
}

enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard"
}
```

// TEST: Verify that Word entities can be created with multiple meanings
// TEST: Ensure difficulty levels are properly assigned and queryable

### 1.2 Meaning Entity
Each word has multiple meanings, each with example sentences demonstrating usage.

```typescript
interface Meaning {
  id: string;                // Unique identifier for this meaning
  definition: string;        // Clear, concise definition
  partOfSpeech: string;      // Noun, verb, adjective, etc.
  exampleSentences: string[]; // Array of sentences using the word with this meaning
  contradictionSentences: string[]; // Sentences specifically designed to contradict other meanings
  isArchaic: boolean;        // Flag for archaic or uncommon usages
  synonyms: string[];        // Words with similar meanings
}
```

// TEST: Verify that contradictionSentences effectively demonstrate different usage from definition
// TEST: Ensure each meaning has at least one example and one contradiction sentence

### 1.3 Distractor Entity
For gameplay, we need plausible but incorrect meanings to serve as distractors in the multiple-choice interface.

```typescript
interface Distractor {
  id: string;               // Unique identifier for this distractor
  definition: string;       // Plausible but incorrect definition
  forWordTypes: string[];   // Types of words this distractor works well with
  difficulty: DifficultyLevel; // Indicates how challenging this distractor is
}
```

// TEST: Verify distractors are sufficiently plausible but clearly incorrect when analyzed
// TEST: Ensure distractors are appropriate for their assigned difficulty levels

## 2. Game State

### 2.1 Game Session
Represents an active game being played by a user.

```typescript
interface GameSession {
  id: string;                // Unique identifier for this game session
  startTime: Date;           // When the game session began
  endTime: Date | null;      // When the game session ended (null if in progress)
  settings: GameSettings;    // User-selected game settings
  currentRound: number;      // Current round number (1-based)
  totalRounds: number;       // Total number of rounds in this session
  score: number;             // Current cumulative score
  rounds: GameRound[];       // Array of round data
  completed: boolean;        // Whether the game session is complete
}

interface GameSettings {
  difficulty: DifficultyLevel;
  roundCount: 5 | 10 | 15;   // Number of rounds per game
  timeLimit: number;         // Seconds per word (0 for no limit)
  soundEnabled: boolean;     // Whether sound effects are enabled
}
```

// TEST: Verify game sessions properly track progress through rounds
// TEST: Ensure settings are correctly applied throughout the game session

### 2.2 Game Round
Represents a single round within a game session.

```typescript
interface GameRound {
  roundNumber: number;       // 1-based round number
  word: Word;                // The word being presented
  correctMeaning: Meaning;   // The meaning used for the contradiction
  options: MeaningOption[];  // Array of 4 options presented to the user
  selectedOption: number | null; // Index of user's selection (null if not yet selected)
  timeSpent: number;         // Seconds spent on this round
  score: number;             // Score for this specific round
  completed: boolean;        // Whether this round is complete
}

interface MeaningOption {
  index: number;             // Position in the options array (0-3)
  text: string;              // The definition text shown to the user
  isCorrect: boolean;        // Whether this is a correct meaning for the word
  isContradiction: boolean;  // Whether this is the meaning used in the contradiction
}
```

// TEST: Verify that each round has exactly 4 meaning options
// TEST: Ensure at least one option is correct and one is the contradiction meaning

### 2.3 Educational Content
Structures for the educational components of the game.

```typescript
interface EducationalMessage {
  id: string;                // Unique identifier for this message
  text: string;              // The educational message text
  category: string;          // Category of linguistic concept
  difficulty: DifficultyLevel; // Complexity level of the concept
  relatedWords: string[];    // Words that particularly demonstrate this concept
}

interface LinguisticConcept {
  id: string;                // Unique identifier for this concept
  name: string;              // Name of the linguistic concept
  description: string;       // Explanation of the concept
  examples: string[];        // Examples demonstrating the concept
  relatedConcepts: string[]; // IDs of related linguistic concepts
}
```

// TEST: Verify educational messages are appropriate for their difficulty levels
// TEST: Ensure linguistic concepts have clear explanations and relevant examples

## 3. User Data

### 3.1 User Profile
If the game implements user accounts, this structure tracks user information and progress.

```typescript
interface UserProfile {
  id: string;                // Unique identifier for this user
  username: string;          // User's chosen name
  settings: UserSettings;    // User's preferred settings
  statistics: UserStatistics; // User's gameplay statistics
  completedSessions: string[]; // IDs of completed game sessions
}

interface UserSettings {
  defaultDifficulty: DifficultyLevel;
  defaultRoundCount: 5 | 10 | 15;
  defaultTimeLimit: number;
  soundEnabled: boolean;
  theme: string;             // UI theme preference
  accessibility: AccessibilitySettings;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

interface UserStatistics {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  wordsEncountered: number;
  averageResponseTime: number;
  mostChallengedWords: string[]; // Words the user struggled with most
  strengthCategories: string[]; // Linguistic categories the user performs well in
  weaknessCategories: string[]; // Linguistic categories the user struggles with
}
```

// TEST: Verify user statistics are correctly updated after each game session
// TEST: Ensure accessibility settings are properly applied throughout the UI

## 4. Database Schema

### 4.1 Collections/Tables
For implementation, these data structures would be organized into the following collections or tables:

1. **words** - Contains all Word entities
2. **meanings** - Contains all Meaning entities, with references to their parent words
3. **distractors** - Contains all Distractor entities
4. **game_sessions** - Contains GameSession records
5. **game_rounds** - Contains GameRound records, with references to their parent sessions
6. **educational_messages** - Contains all EducationalMessage entities
7. **linguistic_concepts** - Contains all LinguisticConcept entities
8. **users** - Contains UserProfile records (if user accounts are implemented)

### 4.2 Relationships

```
Word (1) ---> (N) Meaning
GameSession (1) ---> (N) GameRound
GameRound (1) ---> (1) Word
GameRound (1) ---> (4) MeaningOption
UserProfile (1) ---> (N) GameSession
Word (N) <---> (N) LinguisticConcept
```

## 5. Data Storage Considerations

### 5.1 Local Storage
For offline functionality, the application should store:
- Current game session data
- A subset of the word database appropriate for the selected difficulty
- User settings and preferences
- Recent game history

### 5.2 Server Storage (if implemented)
For online functionality, the server would store:
- Complete word database
- User profiles and authentication data
- Comprehensive game history and statistics
- Global leaderboards and statistics

### 5.3 Data Synchronization
If both online and offline modes are supported:
- Local changes should be queued for synchronization when connectivity is restored
- Conflict resolution strategies should prioritize server data for word database
- Conflict resolution strategies should prioritize local data for game progress

## 6. Sample Data

### 6.1 Example Word with Multiple Meanings

```json
{
  "id": "word_001",
  "text": "bank",
  "difficulty": "medium",
  "categories": ["noun", "verb", "homonym"],
  "meanings": [
    {
      "id": "meaning_001",
      "definition": "A financial institution that accepts deposits and channels those deposits into lending activities",
      "partOfSpeech": "noun",
      "exampleSentences": [
        "I need to go to the bank to deposit my paycheck."
      ],
      "contradictionSentences": [
        "After the heavy rain, the river bank was eroded significantly."
      ],
      "isArchaic": false,
      "synonyms": ["financial institution", "credit union"]
    },
    {
      "id": "meaning_002",
      "definition": "The land alongside or sloping down to a river or lake",
      "partOfSpeech": "noun",
      "exampleSentences": [
        "We had a picnic on the grassy bank by the river."
      ],
      "contradictionSentences": [
        "The bank approved her loan application within a week."
      ],
      "isArchaic": false,
      "synonyms": ["shore", "riverside", "embankment"]
    },
    {
      "id": "meaning_003",
      "definition": "To tilt or incline an aircraft in a turn",
      "partOfSpeech": "verb",
      "exampleSentences": [
        "The pilot had to bank the plane sharply to avoid the storm."
      ],
      "contradictionSentences": [
        "I bank with a local credit union rather than a national chain."
      ],
      "isArchaic": false,
      "synonyms": ["tilt", "incline", "angle"]
    }
  ],
  "notes": "Classic example of a homonym with etymologically distinct meanings"
}
```

// TEST: Verify that the example word data can be properly loaded and used in gameplay
// TEST: Ensure contradictionSentences effectively demonstrate different meanings

### 6.2 Example Game Round

```json
{
  "roundNumber": 3,
  "word": {
    "id": "word_001",
    "text": "bank",
    "difficulty": "medium",
    "categories": ["noun", "verb", "homonym"]
  },
  "correctMeaning": {
    "id": "meaning_002",
    "definition": "The land alongside or sloping down to a river or lake",
    "partOfSpeech": "noun"
  },
  "options": [
    {
      "index": 0,
      "text": "A financial institution that accepts deposits",
      "isCorrect": true,
      "isContradiction": false
    },
    {
      "index": 1,
      "text": "The land alongside or sloping down to a river or lake",
      "isCorrect": true,
      "isContradiction": true
    },
    {
      "index": 2,
      "text": "A collection or store of something available for use",
      "isCorrect": true,
      "isContradiction": false
    },
    {
      "index": 3,
      "text": "To prepare food by heating it in an oven",
      "isCorrect": false,
      "isContradiction": false
    }
  ],
  "selectedOption": 0,
  "timeSpent": 12.5,
  "score": 75,
  "completed": true
}
```

// TEST: Verify that game rounds correctly track user selections and scoring
// TEST: Ensure the contradiction meaning is properly identified in the options array
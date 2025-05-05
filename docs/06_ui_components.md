# Words Without Meaning: UI Components

## Overview
This document outlines the user interface components for the "Words Without Meaning" game. It describes the structure, layout, and interactions of each screen and component, providing a blueprint for the visual and interactive elements of the application.

## 1. Common UI Elements

### 1.1 Header Component
The header appears on most screens and provides navigation and context.

```
COMPONENT Header(title, showBackButton, showSettings)
    RENDER:
        Container:
            IF showBackButton:
                BackButton (onClick: navigateBack)
            
            Title: title
            
            IF showSettings:
                SettingsButton (onClick: openSettings)
END COMPONENT
```

// TEST: Verify header displays correctly with various configuration options

### 1.2 Button Component
Standard button used throughout the application.

```
COMPONENT Button(text, type, onClick, disabled)
    // type can be: primary, secondary, tertiary
    
    RENDER:
        InteractiveElement:
            Text: text
            Style: based on type
            Disabled: disabled
            OnClick: onClick if not disabled
END COMPONENT
```

// TEST: Verify buttons render correctly in all states

### 1.3 Modal Component
Reusable modal dialog for settings, instructions, etc.

```
COMPONENT Modal(title, content, isOpen, onClose)
    RENDER:
        IF isOpen:
            Overlay (onClick: onClose)
            
            DialogContainer:
                HeaderBar:
                    Title: title
                    CloseButton (onClick: onClose)
                
                ContentArea:
                    content
END COMPONENT
```

// TEST: Verify modal opens and closes correctly

### 1.4 ProgressBar Component
Shows progress through the game rounds.

```
COMPONENT ProgressBar(current, total)
    percentage = (current / total) * 100
    
    RENDER:
        Container:
            ProgressTrack:
                ProgressFill (width: percentage%)
            
            Text: "${current}/${total}"
END COMPONENT
```

// TEST: Verify progress bar updates correctly as game progresses

## 2. Screen Components

### 2.1 LaunchScreen Component
The initial screen users see when starting the application.

```
COMPONENT LaunchScreen()
    RENDER:
        Container:
            Logo
            
            Title: "Words Without Meaning"
            
            Subtitle: "Discover how context shapes language"
            
            Button(text: "Start Game", type: primary, onClick: navigateToGameSetup)
            
            Button(text: "How to Play", type: secondary, onClick: openHowToPlay)
            
            Button(text: "Settings", type: secondary, onClick: openSettings)
            
            Button(text: "About", type: tertiary, onClick: openAbout)
END COMPONENT
```

// TEST: Verify all buttons navigate to the correct screens

### 2.2 HowToPlayScreen Component
Explains the game concept and instructions.

```
COMPONENT HowToPlayScreen()
    RENDER:
        Container:
            Header(title: "How to Play", showBackButton: true)
            
            ScrollableContent:
                Section:
                    Title: "Game Concept"
                    Text: "Words Without Meaning demonstrates how words have no inherent meaning without context."
                
                Section:
                    Title: "Gameplay"
                    InstructionList:
                        Item: "1. You'll be presented with a word without any context"
                        Item: "2. Select what you think is the correct meaning from four options"
                        Item: "3. See a sentence that uses the word differently than what you selected"
                        Item: "4. Learn about how context shapes meaning"
                
                Section:
                    Title: "Example"
                    ExampleCard:
                        Word: "bank"
                        Options: ["Financial institution", "River edge", "To tilt an aircraft", "To rely on"]
                        SelectedOption: "Financial institution"
                        ContradictionSentence: "After the heavy rain, the river bank was eroded significantly."
            
            Button(text: "Got It!", type: primary, onClick: navigateBack)
END COMPONENT
```

// TEST: Verify instructions are clear and understandable

### 2.3 SettingsScreen Component
Allows users to configure game settings.

```
COMPONENT SettingsScreen()
    // State for settings
    [difficulty, setDifficulty] = useState(getUserSettings().difficulty)
    [roundCount, setRoundCount] = useState(getUserSettings().roundCount)
    [timeLimit, setTimeLimit] = useState(getUserSettings().timeLimit)
    [soundEnabled, setSoundEnabled] = useState(getUserSettings().soundEnabled)
    
    FUNCTION saveSettings()
        newSettings = {
            difficulty: difficulty,
            roundCount: roundCount,
            timeLimit: timeLimit,
            soundEnabled: soundEnabled
        }
        
        updateUserSettings(newSettings)
        navigateBack()
    END FUNCTION
    
    RENDER:
        Container:
            Header(title: "Settings", showBackButton: true)
            
            Form:
                Section:
                    Title: "Difficulty"
                    RadioGroup(
                        options: [
                            { label: "Easy", value: "easy" },
### 2.4 GameSetupScreen Component
Prepares for a new game session.

```
COMPONENT GameSetupScreen()
    // State for game setup
    [isLoading, setIsLoading] = useState(false)
    
    ASYNC FUNCTION startGame()
        setIsLoading(true)
        
        settings = getUserSettings()
        gameSession = AWAIT initializeGame(settings)
        
        setIsLoading(false)
        navigateToGameplay(gameSession)
    END FUNCTION
    
    RENDER:
        Container:
            Header(title: "Game Setup", showBackButton: true)
            
            IF isLoading:
                LoadingIndicator
                Text: "Preparing your game..."
            ELSE:
                SettingsSummary:
                    Item: "Difficulty: ${getUserSettings().difficulty}"
                    Item: "Rounds: ${getUserSettings().roundCount}"
                    Item: "Time Limit: ${getUserSettings().timeLimit == 0 ? 'None' : getUserSettings().timeLimit + ' seconds'}"
                
                Button(text: "Change Settings", type: secondary, onClick: navigateToSettings)
                
                Button(text: "Start Game", type: primary, onClick: startGame)
END COMPONENT
```

// TEST: Verify game initialization works correctly

### 2.5 GameplayScreen Component
The main screen where the game is played.

```
COMPONENT GameplayScreen(gameSession)
    // State for gameplay
    [currentRound, setCurrentRound] = useState(null)
    [selectedOption, setSelectedOption] = useState(null)
    [timeRemaining, setTimeRemaining] = useState(0)
    [showContradiction, setShowContradiction] = useState(false)
    [contradictionData, setContradictionData] = useState(null)
    [timerInterval, setTimerInterval] = useState(null)
    
    FUNCTION componentDidMount()
        // Initialize first round
        startNextRound()
    END FUNCTION
    
    FUNCTION componentWillUnmount()
        // Clean up timer
        IF timerInterval != null:
            clearInterval(timerInterval)
    END FUNCTION
    
    FUNCTION startNextRound()
        success = startNextRound(gameSession)
        
        IF success:
            newRound = getCurrentRound(gameSession)
            setCurrentRound(newRound)
            setSelectedOption(null)
            setShowContradiction(false)
            setContradictionData(null)
            
            // Start timer if time limit is set
            IF gameSession.settings.timeLimit > 0:
                setTimeRemaining(gameSession.settings.timeLimit)
                interval = startTimer(gameSession, updateTimeRemaining)
                setTimerInterval(interval)
            END IF
        ELSE:
            // No more rounds, game complete
            navigateToResults(gameSession)
        END IF
    END FUNCTION
    
    FUNCTION handleOptionSelect(optionIndex)
        IF selectedOption == null AND NOT showContradiction:
            setSelectedOption(optionIndex)
            
            // Stop timer if running
            IF timerInterval != null:
                clearInterval(timerInterval)
                setTimerInterval(null)
            END IF
            
            // Process selection
            processUserSelection(gameSession, optionIndex)
            
            // Show contradiction after brief delay
            setTimeout(() => {
                contradictionData = presentContradiction(gameSession)
                setContradictionData(contradictionData)
                setShowContradiction(true)
            }, 1000)
        END IF
    END FUNCTION
    
    FUNCTION handleNextWord()
        startNextRound()
    END FUNCTION
    
    RENDER:
        Container:
            Header(title: "Round ${currentRound?.roundNumber || 0}/${gameSession.totalRounds}", showBackButton: true)
            
            ProgressBar(current: currentRound?.roundNumber || 0, total: gameSession.totalRounds)
            
            ScoreDisplay: "Score: ${gameSession.score}"
            
            IF currentRound != null:
                IF NOT showContradiction:
                    // Word presentation phase
                    WordDisplay:
                        WordText: currentRound.word.text
                    
                    IF gameSession.settings.timeLimit > 0:
                        TimerDisplay: timeRemaining
                    
                    OptionsContainer:
                        FOR EACH option IN currentRound.options:
                            OptionButton(
                                text: option.text,
                                selected: selectedOption == option.index,
                                onClick: () => handleOptionSelect(option.index)
                            )
                ELSE:
                    // Contradiction phase
                    WordDisplay:
                        WordText: currentRound.word.text
                    
                    UserSelectionDisplay:
                        Text: "You selected:"
                        SelectedMeaning: contradictionData.selectedMeaning.text
                    
                    ContradictionDisplay:
                        Text: "But in this sentence:"
                        Sentence: contradictionData.contradiction.sentence
                        Explanation: "The word means: ${contradictionData.contradiction.meaning}"
                    
                    EducationalMessage:
                        Text: contradictionData.educationalMessage
                    
                    Button(text: "Next Word", type: primary, onClick: handleNextWord)
            ELSE:
                LoadingIndicator
END COMPONENT
```

// TEST: Verify word presentation and option selection work correctly

### 2.6 ResultsScreen Component
Shows the final results after completing all rounds.

```
COMPONENT ResultsScreen(gameSession)
    // State for results
    [summaryData, setSummaryData] = useState(null)
    
    FUNCTION componentDidMount()
        // Get game summary data
        summary = presentGameSummary(gameSession)
        setSummaryData(summary)
    END FUNCTION
    
    FUNCTION handlePlayAgain()
        // Start a new game with same settings
        navigateToGameSetup()
    END FUNCTION
    
    FUNCTION handleMainMenu()
        // Return to main menu
        navigateToLaunchScreen()
    END FUNCTION
    
    RENDER:
        Container:
            Header(title: "Game Results", showBackButton: false)
            
            IF summaryData != null:
                ResultsCard:
                    Title: "Final Score: ${summaryData.score}"
                    
                    PerformanceText: summaryData.performance
                    
                    StatisticsSection:
                        Title: "Statistics"
                        Stat: "Difficulty: ${summaryData.difficulty}"
                        Stat: "Rounds Played: ${summaryData.roundsPlayed}"
                    
                    TakeawaysSection:
                        Title: "What You've Learned"
                        FOR EACH takeaway IN summaryData.educationalTakeaways:
                            TakeawayItem: takeaway
                    
                    SuggestionText: summaryData.suggestion
                
                ButtonGroup:
                    Button(text: "Play Again", type: primary, onClick: handlePlayAgain)
                    Button(text: "Main Menu", type: secondary, onClick: handleMainMenu)
            ELSE:
                LoadingIndicator
END COMPONENT
```

// TEST: Verify results display correctly after game completion

## 3. Component Interactions

### 3.1 Navigation Flow

```
FUNCTION navigateToGameSetup()
    // Navigate to game setup screen
    router.navigate("/setup")
END FUNCTION

FUNCTION navigateToGameplay(gameSession)
    // Navigate to gameplay screen with game session data
    router.navigate("/play", { state: { gameSession } })
END FUNCTION

FUNCTION navigateToResults(gameSession)
    // Navigate to results screen with game session data
    router.navigate("/results", { state: { gameSession } })
END FUNCTION

FUNCTION navigateToSettings()
    // Navigate to settings screen
    router.navigate("/settings")
END FUNCTION

FUNCTION navigateToHowToPlay()
    // Navigate to how to play screen
    router.navigate("/how-to-play")
END FUNCTION

FUNCTION navigateToAbout()
    // Navigate to about screen
    router.navigate("/about")
END FUNCTION

FUNCTION navigateToLaunchScreen()
    // Navigate to launch screen
    router.navigate("/")
END FUNCTION

FUNCTION navigateBack()
    // Navigate back to previous screen
    router.back()
END FUNCTION
```

// TEST: Verify all navigation functions correctly route to the appropriate screens

### 3.2 State Management

```
// User settings management
FUNCTION getUserSettings()
    // Get user settings from local storage
    storedSettings = localStorage.getItem("userSettings")
    
    IF storedSettings != null:
        RETURN JSON.parse(storedSettings)
    ELSE:
        // Default settings
        defaultSettings = {
            difficulty: "medium",
            roundCount: 10,
            timeLimit: 30,
            soundEnabled: true
        }
        
        localStorage.setItem("userSettings", JSON.stringify(defaultSettings))
        RETURN defaultSettings
    END IF
END FUNCTION

FUNCTION updateUserSettings(newSettings)
    // Update user settings in local storage
    localStorage.setItem("userSettings", JSON.stringify(newSettings))
END FUNCTION

// Game state management
FUNCTION startTimer(gameSession, updateCallback)
    // Start timer for current round
    timerInterval = setInterval(() => {
        currentRound = getCurrentRound(gameSession)
        
        IF currentRound != null AND NOT currentRound.completed:
            // Update time spent
            currentRound.timeSpent += 0.1 // Update every 100ms
            
            // Call update callback
            IF updateCallback != null:
                updateCallback()
            
            // Check if time limit reached
            IF gameSession.settings.timeLimit > 0 AND currentRound.timeSpent >= gameSession.settings.timeLimit:
                clearInterval(timerInterval)
                handleTimeExpired(gameSession)
            END IF
        ELSE:
            // Round completed or null, clear interval
            clearInterval(timerInterval)
        END IF
    }, 100)
    
    RETURN timerInterval
END FUNCTION
```

// TEST: Verify settings are properly stored and retrieved from local storage

## 4. Responsive Design Considerations

```
// Responsive layout adjustments based on screen size
FUNCTION getResponsiveLayout(screenWidth)
    IF screenWidth < 480:
        // Mobile portrait
        RETURN {
            optionsLayout: "vertical",
            fontSize: "small",
            padding: "compact"
        }
    ELSE IF screenWidth < 768:
        // Mobile landscape / small tablet
        RETURN {
            optionsLayout: "grid",
            fontSize: "medium",
            padding: "normal"
        }
    ELSE:
        // Tablet / desktop
        RETURN {
            optionsLayout: "grid",
            fontSize: "large",
            padding: "spacious"
        }
    END IF
END FUNCTION
```

// TEST: Verify UI adapts appropriately to different screen sizes

## 5. Accessibility Considerations

```
// Accessibility enhancements
FUNCTION enhanceAccessibility(component)
    // Add appropriate ARIA attributes
    IF component.type == "Button":
        component.setAttribute("role", "button")
        component.setAttribute("aria-pressed", component.selected)
    ELSE IF component.type == "OptionButton":
        component.setAttribute("role", "radio")
        component.setAttribute("aria-checked", component.selected)
    END IF
    
    // Ensure keyboard navigation
    IF component.isInteractive:
        component.setAttribute("tabindex", "0")
        
        // Add keyboard event handlers
        component.onKeyDown = (event) => {
            IF event.key == "Enter" OR event.key == " ":
                component.onClick()
                event.preventDefault()
            END IF
        }
    END IF
    
    RETURN component
END FUNCTION
```

// TEST: Verify components meet accessibility standards

## 6. Theme and Styling

```
// Theme definition
CONST theme = {
    colors: {
        primary: "#4A6FA5",
        secondary: "#166088",
        accent: "#F39237",
        background: "#F9F9F9",
        text: "#333333",
        error: "#D64045",
        success: "#4CAF50"
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        headingFont: "'Montserrat', sans-serif",
        fontSize: {
            small: "14px",
            medium: "16px",
            large: "18px"
        }
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px"
    },
    borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px"
    }
}
```

// TEST: Verify theme is consistently applied across all components
                            { label: "Medium", value: "medium" },
                            { label: "Hard", value: "hard" }
                        ],
                        selected: difficulty,
                        onChange: setDifficulty
                    )
                
                Section:
                    Title: "Rounds per Game"
                    RadioGroup(
                        options: [
                            { label: "5 Rounds", value: 5 },
                            { label: "10 Rounds", value: 10 },
                            { label: "15 Rounds", value: 15 }
                        ],
                        selected: roundCount,
                        onChange: setRoundCount
                    )
                
                Section:
                    Title: "Time Limit per Word"
                    RadioGroup(
                        options: [
                            { label: "15 Seconds", value: 15 },
                            { label: "30 Seconds", value: 30 },
                            { label: "45 Seconds", value: 45 },
                            { label: "No Limit", value: 0 }
                        ],
                        selected: timeLimit,
                        onChange: setTimeLimit
                    )
                
                Section:
                    Title: "Sound"
                    Toggle(
                        label: "Sound Effects",
                        checked: soundEnabled,
                        onChange: setSoundEnabled
                    )
            
            ButtonGroup:
                Button(text: "Cancel", type: secondary, onClick: navigateBack)
                Button(text: "Save", type: primary, onClick: saveSettings)
END COMPONENT
```

// TEST: Verify all settings options can be changed and saved
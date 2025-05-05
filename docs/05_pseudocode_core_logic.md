# Words Without Meaning: Core Game Logic Pseudocode

## Overview
This document provides pseudocode for the core logic of the "Words Without Meaning" game. It outlines the algorithms and processes that drive the game's functionality, from initialization to completion.

## 1. Game Initialization

```
FUNCTION initializeGame(settings)
    // Initialize a new game session based on user settings
    // TEST: Verify game initializes with correct settings
    
    gameSession = new GameSession()
    gameSession.id = generateUniqueId()
    gameSession.startTime = getCurrentTime()
    gameSession.settings = settings
    gameSession.currentRound = 0
    gameSession.totalRounds = settings.roundCount
    gameSession.score = 0
    gameSession.rounds = []
    gameSession.completed = false
    
    // Select words for this game session based on difficulty
    // TEST: Ensure selected words match the requested difficulty level
    selectedWords = selectWordsForGame(settings.difficulty, settings.roundCount)
    
    // Pre-generate all rounds to ensure no repetition
    // TEST: Verify no duplicate words appear in a single game session
    FOR EACH word IN selectedWords
        round = createGameRound(word, gameSession.rounds.length + 1)
        gameSession.rounds.push(round)
    END FOR
    
    RETURN gameSession
END FUNCTION

FUNCTION selectWordsForGame(difficulty, count)
    // Select appropriate words from the database
    // TEST: Verify word selection algorithm returns appropriate difficulty words
    
    availableWords = getWordsFromDatabase(difficulty)
    
    // If not enough words of exact difficulty, expand to adjacent difficulties
    IF availableWords.length < count THEN
        IF difficulty == EASY THEN
            additionalWords = getWordsFromDatabase(MEDIUM)
        ELSE IF difficulty == HARD THEN
            additionalWords = getWordsFromDatabase(MEDIUM)
        ELSE
            additionalWords = getWordsFromDatabase(EASY).concat(getWordsFromDatabase(HARD))
        END IF
        
        availableWords = availableWords.concat(additionalWords)
    END IF
    
    // Shuffle and select required number of words
    // TEST: Ensure randomization works correctly
    shuffledWords = shuffle(availableWords)
    selectedWords = shuffledWords.slice(0, count)
    
    RETURN selectedWords
END FUNCTION

FUNCTION createGameRound(word, roundNumber)
    // Create a new game round for the given word
    // TEST: Verify round creation includes correct word and options
    
    round = new GameRound()
    round.roundNumber = roundNumber
    round.word = word
    round.completed = false
    round.selectedOption = null
    round.timeSpent = 0
    round.score = 0
    
    // Select meanings and distractors for this round
    // TEST: Ensure each round has exactly 4 options
    round.options = generateMeaningOptions(word)
    
    // Select one meaning to use for the contradiction
    // TEST: Verify contradiction meaning is different from other meanings
    round.correctMeaning = selectContradictionMeaning(word, round.options)
    
    // Mark the contradiction meaning in the options
    FOR EACH option IN round.options
        IF option.text == round.correctMeaning.definition THEN
            option.isContradiction = true
        ELSE
            option.isContradiction = false
        END IF
    END FOR
    
    RETURN round
END FUNCTION

FUNCTION generateMeaningOptions(word)
    // Generate 4 options for the multiple-choice interface
    // TEST: Verify at least one option is correct for the word
    
    options = []
    
    // Include 2-3 actual meanings of the word (depending on how many exist)
    actualMeanings = word.meanings.slice(0, min(3, word.meanings.length))
    
    FOR EACH meaning IN actualMeanings
        option = new MeaningOption()
        option.text = meaning.definition
        option.isCorrect = true
        options.push(option)
    END FOR
    
    // Fill remaining slots with plausible distractors
    // TEST: Ensure distractors are appropriate for the word type
    neededDistractors = 4 - options.length
    distractors = getDistractorsForWord(word, neededDistractors)
    
    FOR EACH distractor IN distractors
        option = new MeaningOption()
        option.text = distractor.definition
        option.isCorrect = false
        options.push(option)
    END FOR
    
    // Shuffle options and assign indices
    // TEST: Verify options are properly randomized
    shuffledOptions = shuffle(options)
    
    FOR i = 0 TO shuffledOptions.length - 1
        shuffledOptions[i].index = i
    END FOR
    
    RETURN shuffledOptions
END FUNCTION

FUNCTION selectContradictionMeaning(word, options)
    // Select a meaning to use for the contradiction
    // TEST: Ensure selected meaning has appropriate contradiction sentences
    
    // Filter to only correct meanings that have contradiction sentences
    validMeanings = word.meanings.filter(meaning => 
        meaning.contradictionSentences.length > 0 &&
        options.some(option => option.text == meaning.definition && option.isCorrect)
    )
    
    // If no valid meanings, fall back to any meaning with contradiction sentences
    IF validMeanings.length == 0 THEN
        validMeanings = word.meanings.filter(meaning => 
            meaning.contradictionSentences.length > 0
        )
    END IF
    
    // Select a random meaning from valid options
    // TEST: Verify random selection works correctly
    selectedMeaning = validMeanings[randomInt(0, validMeanings.length - 1)]
    
    RETURN selectedMeaning
END FUNCTION

FUNCTION getDistractorsForWord(word, count)
    // Get plausible but incorrect distractors for a word
    // TEST: Ensure distractors are plausible but incorrect
    
    // Get distractors appropriate for this word's type
    allDistractors = getDistractorsFromDatabase(word.categories)
    
    // Filter to appropriate difficulty
    filteredDistractors = allDistractors.filter(d => d.difficulty == word.difficulty)
    
    // If not enough, include adjacent difficulties
    IF filteredDistractors.length < count THEN
        allDistractors = shuffle(allDistractors)
        filteredDistractors = allDistractors.slice(0, count)
    ELSE
        filteredDistractors = shuffle(filteredDistractors).slice(0, count)
    END IF
    
    RETURN filteredDistractors
END FUNCTION
```

## 2. Game Progression

```
FUNCTION startNextRound(gameSession)
    // Advance to the next round in the game
    // TEST: Verify round progression works correctly
    
    IF gameSession.currentRound >= gameSession.totalRounds THEN
        RETURN false // No more rounds
    END IF
    
    gameSession.currentRound += 1
    currentRound = gameSession.rounds[gameSession.currentRound - 1]
    
    // Reset round state for new round
    currentRound.selectedOption = null
    currentRound.timeSpent = 0
    currentRound.score = 0
    currentRound.completed = false
    
    RETURN true // Successfully started next round
END FUNCTION

FUNCTION getCurrentRound(gameSession)
    // Get the current active round
    // TEST: Ensure correct round is returned
    
    IF gameSession.currentRound == 0 OR gameSession.currentRound > gameSession.totalRounds THEN
        RETURN null
    END IF
    
    RETURN gameSession.rounds[gameSession.currentRound - 1]
END FUNCTION

FUNCTION startTimer(gameSession)
    // Start the timer for the current round
    // TEST: Verify timer starts correctly
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null OR currentRound.completed THEN
        RETURN false
    END IF
    
    startTime = getCurrentTime()
    
    // Set up timer that runs until time limit or user selection
    timerInterval = setInterval(() => {
        currentTime = getCurrentTime()
        elapsedTime = (currentTime - startTime) / 1000 // Convert to seconds
        
        currentRound.timeSpent = elapsedTime
        
        // Check if time limit reached
        IF gameSession.settings.timeLimit > 0 AND elapsedTime >= gameSession.settings.timeLimit THEN
            clearInterval(timerInterval)
            handleTimeExpired(gameSession)
        END IF
    }, 100) // Update every 100ms
    
    RETURN timerInterval
END FUNCTION

FUNCTION handleTimeExpired(gameSession)
    // Handle case where user didn't select an option in time
    // TEST: Verify timeout handling works correctly
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null OR currentRound.completed THEN
        RETURN
    END IF
    
    // Select a random option if user didn't select one
    IF currentRound.selectedOption == null THEN
        randomOption = randomInt(0, currentRound.options.length - 1)
        processUserSelection(gameSession, randomOption)
    END IF
END FUNCTION
```

## 3. User Interaction

```
FUNCTION processUserSelection(gameSession, selectedOptionIndex)
    // Process the user's selection of a meaning option
    // TEST: Verify user selections are correctly processed
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null OR currentRound.completed THEN
        RETURN false
    END IF
    
    // Record user's selection
    currentRound.selectedOption = selectedOptionIndex
    selectedOption = currentRound.options[selectedOptionIndex]
    
    // Calculate score based on correctness and time
    // TEST: Ensure scoring algorithm works correctly
    baseScore = calculateBaseScore(selectedOption.isCorrect)
    timeBonus = calculateTimeBonus(currentRound.timeSpent, gameSession.settings.timeLimit)
    difficultyMultiplier = getDifficultyMultiplier(gameSession.settings.difficulty)
    
    currentRound.score = Math.round(baseScore * timeBonus * difficultyMultiplier)
    gameSession.score += currentRound.score
    
    // Mark round as completed
    currentRound.completed = true
    
    RETURN true
END FUNCTION

FUNCTION calculateBaseScore(isCorrect)
    // Calculate base score based on correctness
    // TEST: Verify correct answers score higher than incorrect
    
    IF isCorrect THEN
        RETURN 100 // Base score for correct answer
    ELSE
        RETURN 25 // Base score for incorrect answer (still get points for learning)
    END IF
END FUNCTION

FUNCTION calculateTimeBonus(timeSpent, timeLimit)
    // Calculate time bonus - faster answers get higher bonus
    // TEST: Ensure faster responses receive higher bonuses
    
    IF timeLimit == 0 THEN
        RETURN 1.0 // No time bonus if no time limit
    END IF
    
    // Calculate bonus factor (1.0 to 1.5)
    timeRatio = 1 - (timeSpent / timeLimit)
    bonus = 1.0 + (timeRatio * 0.5)
    
    // Ensure bonus is within bounds
    RETURN max(1.0, min(1.5, bonus))
END FUNCTION

FUNCTION getDifficultyMultiplier(difficulty)
    // Get score multiplier based on difficulty
    // TEST: Verify higher difficulties receive higher multipliers
    
    SWITCH difficulty
        CASE EASY:
            RETURN 1.0
        CASE MEDIUM:
            RETURN 1.25
        CASE HARD:
            RETURN 1.5
        DEFAULT:
            RETURN 1.0
    END SWITCH
END FUNCTION

FUNCTION getContradictionSentence(gameSession)
    // Get a sentence that contradicts the user's selected meaning
    // TEST: Ensure contradiction sentence uses the word differently
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null OR NOT currentRound.completed THEN
        RETURN null
    END IF
    
    // Get the contradiction meaning
    contradictionMeaning = currentRound.correctMeaning
    
    // Get a random contradiction sentence
    sentences = contradictionMeaning.contradictionSentences
    selectedSentence = sentences[randomInt(0, sentences.length - 1)]
    
    RETURN {
        sentence: selectedSentence,
        meaning: contradictionMeaning
    }
END FUNCTION

FUNCTION getEducationalMessage(gameSession)
    // Get an educational message relevant to the current word
    // TEST: Verify educational messages are relevant to the word
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null THEN
        RETURN getGenericEducationalMessage()
    END IF
    
    word = currentRound.word
    
    // Get messages relevant to this word's categories
    relevantMessages = getEducationalMessagesFromDatabase(word.categories)
    
    // If no specific messages, get generic ones about context and meaning
    IF relevantMessages.length == 0 THEN
        relevantMessages = getEducationalMessagesFromDatabase(["context", "meaning"])
    END IF
    
    // Filter to appropriate difficulty
    filteredMessages = relevantMessages.filter(m => m.difficulty == gameSession.settings.difficulty)
    
    // If none at right difficulty, use any relevant message
    IF filteredMessages.length == 0 THEN
        filteredMessages = relevantMessages
    END IF
    
    // Select a random message
    selectedMessage = filteredMessages[randomInt(0, filteredMessages.length - 1)]
    
    RETURN selectedMessage
END FUNCTION
```

## 4. Game Completion

```
FUNCTION completeGame(gameSession)
    // Complete the game session and calculate final results
    // TEST: Verify game completion works correctly
    
    IF gameSession.completed THEN
        RETURN false
    END IF
    
    gameSession.endTime = getCurrentTime()
    gameSession.completed = true
    
    // Calculate final statistics
    totalTimeSpent = 0
    correctAnswers = 0
    
    FOR EACH round IN gameSession.rounds
        totalTimeSpent += round.timeSpent
        
        IF round.selectedOption != null THEN
            selectedOption = round.options[round.selectedOption]
            IF selectedOption.isCorrect THEN
                correctAnswers += 1
            END IF
        END IF
    END FOR
    
    averageTimePerRound = totalTimeSpent / gameSession.totalRounds
    accuracyRate = (correctAnswers / gameSession.totalRounds) * 100
    
    // Create results summary
    results = {
        score: gameSession.score,
        totalRounds: gameSession.totalRounds,
        correctAnswers: correctAnswers,
        accuracyRate: accuracyRate,
        averageTimePerRound: averageTimePerRound,
        difficulty: gameSession.settings.difficulty
    }
    
    // Save game results if user tracking is enabled
    IF userIsLoggedIn() THEN
        saveGameResults(getCurrentUser().id, gameSession.id, results)
    END IF
    
    RETURN results
END FUNCTION

FUNCTION getGameSummary(gameSession)
    // Generate a summary of the game session
    // TEST: Ensure summary contains all relevant information
    
    IF NOT gameSession.completed THEN
        completeGame(gameSession)
    END IF
    
    // Get educational takeaways based on game performance
    educationalTakeaways = generateEducationalTakeaways(gameSession)
    
    // Generate performance feedback
    performanceFeedback = generatePerformanceFeedback(gameSession)
    
    summary = {
        score: gameSession.score,
        performance: performanceFeedback,
        educationalTakeaways: educationalTakeaways,
        playAgainSuggestion: suggestNextDifficulty(gameSession)
    }
    
    RETURN summary
END FUNCTION

FUNCTION generateEducationalTakeaways(gameSession)
    // Generate educational takeaways based on game performance
    // TEST: Verify takeaways are relevant to game content
    
    takeaways = []
    
    // Add general takeaway about context and meaning
    takeaways.push("Words have no inherent meaning without context. The same word can have completely different meanings depending on how it's used.")
    
    // Add takeaways based on word categories encountered
    encounteredCategories = new Set()
    
    FOR EACH round IN gameSession.rounds
        FOR EACH category IN round.word.categories
            encounteredCategories.add(category)
        END FOR
    END FOR
    
    // Add specific takeaways for each category
    IF encounteredCategories.has("homonym") THEN
        takeaways.push("Homonyms are words that sound the same but have different meanings, often with different etymological origins.")
    END IF
    
    IF encounteredCategories.has("polyseme") THEN
        takeaways.push("Polysemes are words with multiple related meanings that evolved from the same original concept.")
    END IF
    
    // Add more category-specific takeaways as needed
    
    RETURN takeaways
END FUNCTION

FUNCTION generatePerformanceFeedback(gameSession)
    // Generate feedback based on user performance
    // TEST: Ensure feedback is appropriate for the score achieved
    
    correctAnswers = 0
    totalRounds = gameSession.totalRounds
    
    FOR EACH round IN gameSession.rounds
        IF round.selectedOption != null THEN
            selectedOption = round.options[round.selectedOption]
            IF selectedOption.isCorrect THEN
                correctAnswers += 1
            END IF
        END IF
    END FOR
    
    accuracyRate = (correctAnswers / totalRounds) * 100
    
    IF accuracyRate >= 90 THEN
        RETURN "Excellent! You have a strong understanding of how context affects meaning."
    ELSE IF accuracyRate >= 70 THEN
        RETURN "Good job! You're developing a solid grasp of contextual meaning."
    ELSE IF accuracyRate >= 50 THEN
        RETURN "Nice effort! This game highlights how tricky language can be without context."
    ELSE
        RETURN "Great start! This game demonstrates why context is so crucial for understanding language."
    END IF
END FUNCTION

FUNCTION suggestNextDifficulty(gameSession)
    // Suggest next difficulty based on performance
    // TEST: Verify suggestions are appropriate for performance level
    
    currentDifficulty = gameSession.settings.difficulty
    accuracyRate = (getCorrectAnswerCount(gameSession) / gameSession.totalRounds) * 100
    
    IF currentDifficulty == EASY AND accuracyRate >= 80 THEN
        RETURN "You did great! Try Medium difficulty next for more challenging words."
    ELSE IF currentDifficulty == MEDIUM AND accuracyRate >= 80 THEN
        RETURN "Excellent work! Challenge yourself with Hard difficulty next time."
    ELSE IF currentDifficulty == HARD AND accuracyRate >= 70 THEN
        RETURN "Outstanding! You've mastered even the most challenging words."
    ELSE IF accuracyRate < 40 THEN
        RETURN "Language is tricky! Try an easier difficulty to build your confidence."
    ELSE
        RETURN "Play again to discover more words and their contextual meanings!"
    END IF
END FUNCTION
```

## 5. Utility Functions

```
FUNCTION shuffle(array)
    // Shuffle an array using Fisher-Yates algorithm
    // TEST: Verify shuffle produces random but complete results
    
    result = array.slice() // Create a copy
    
    FOR i = result.length - 1 TO 1
        j = randomInt(0, i)
        temp = result[i]
        result[i] = result[j]
        result[j] = temp
    END FOR
    
    RETURN result
END FUNCTION

FUNCTION randomInt(min, max)
    // Generate a random integer between min and max (inclusive)
    // TEST: Ensure random numbers are within specified range
    
    RETURN Math.floor(Math.random() * (max - min + 1)) + min
END FUNCTION

FUNCTION getWordsFromDatabase(difficulty)
    // Get words from the database with the specified difficulty
    // TEST: Verify database queries return appropriate results
    
    // In a real implementation, this would query a database
    // For pseudocode, we assume this retrieves the appropriate words
    
    RETURN database.words.filter(word => word.difficulty == difficulty)
END FUNCTION

FUNCTION getDistractorsFromDatabase(categories)
    // Get distractors from the database appropriate for the given categories
    // TEST: Ensure distractors are appropriate for word categories
    
    // In a real implementation, this would query a database
    // For pseudocode, we assume this retrieves appropriate distractors
    
    RETURN database.distractors.filter(distractor => 
        distractor.forWordTypes.some(type => categories.includes(type))
    )
END FUNCTION

FUNCTION getEducationalMessagesFromDatabase(categories)
    // Get educational messages relevant to the given categories
    // TEST: Verify messages are relevant to specified categories
    
    // In a real implementation, this would query a database
    // For pseudocode, we assume this retrieves appropriate messages
    
    RETURN database.educationalMessages.filter(message => 
        categories.some(category => message.category == category || message.relatedWords.includes(category))
    )
END FUNCTION

FUNCTION getCorrectAnswerCount(gameSession)
    // Count the number of correct answers in a game session
    // TEST: Ensure correct counting of right answers
    
    correctCount = 0
    
    FOR EACH round IN gameSession.rounds
        IF round.selectedOption != null THEN
            selectedOption = round.options[round.selectedOption]
            IF selectedOption.isCorrect THEN
                correctCount += 1
            END IF
        END IF
    END FOR
    
    RETURN correctCount
END FUNCTION
```

## 6. Integration Points

```
// These functions represent key integration points with the UI layer
// They define how the core game logic interfaces with the presentation layer

FUNCTION presentWord(gameSession)
    // Prepare data needed to present a word to the user
    // TEST: Verify all necessary data is provided to UI
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null THEN
        RETURN null
    END IF
    
    presentationData = {
        word: currentRound.word.text,
        roundNumber: currentRound.roundNumber,
        totalRounds: gameSession.totalRounds,
        options: currentRound.options.map(option => ({
            index: option.index,
            text: option.text
        })),
        timeLimit: gameSession.settings.timeLimit
    }
    
    RETURN presentationData
END FUNCTION

FUNCTION presentContradiction(gameSession)
    // Prepare data needed to present the contradiction to the user
    // TEST: Verify contradiction data is properly formatted for UI
    
    currentRound = getCurrentRound(gameSession)
    
    IF currentRound == null OR NOT currentRound.completed THEN
        RETURN null
    END IF
    
    // Get user's selected meaning
    selectedOption = currentRound.options[currentRound.selectedOption]
    
    // Get contradiction data
    contradictionData = getContradictionSentence(gameSession)
    
    // Get educational message
    educationalMessage = getEducationalMessage(gameSession)
    
    presentationData = {
        word: currentRound.word.text,
        selectedMeaning: {
            text: selectedOption.text,
            isCorrect: selectedOption.isCorrect
        },
        contradiction: {
            sentence: contradictionData.sentence,
            meaning: contradictionData.meaning.definition
        },
        educationalMessage: educationalMessage.text,
        score: currentRound.score
    }
    
    RETURN presentationData
END FUNCTION

FUNCTION presentGameSummary(gameSession)
    // Prepare data needed to present the game summary to the user
    // TEST: Verify summary data includes all necessary information
    
    IF NOT gameSession.completed THEN
        completeGame(gameSession)
    END IF
    
    summary = getGameSummary(gameSession)
    
    presentationData = {
        score: summary.score,
        performance: summary.performance,
        educationalTakeaways: summary.educationalTakeaways,
        suggestion: summary.playAgainSuggestion,
        difficulty: gameSession.settings.difficulty,
        roundsPlayed: gameSession.totalRounds
    }
    
    RETURN presentationData
END FUNCTION
```

// TEST: Verify the entire game flow works correctly from initialization to completion
// TEST: Ensure all components integrate properly to create a cohesive experience
// TEST: Validate that educational content is effectively delivered throughout the game
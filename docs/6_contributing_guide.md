# Words Without Meaning: Contributing Guide

## Introduction

Thank you for your interest in contributing to the "Words Without Meaning" educational game! This guide will help you understand how to contribute effectively to the project, from setting up your development environment to submitting pull requests.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Environment](#development-environment)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation Guidelines](#documentation-guidelines)
9. [Pull Request Process](#pull-request-process)
10. [Adding Educational Content](#adding-educational-content)
11. [Community](#community)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. By participating in this project, you agree to abide by our Code of Conduct, which can be found in the [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) file.

## Getting Started

### Prerequisites

To contribute to this project, you'll need:

- Node.js (v14+)
- npm or yarn
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/words-without-meaning.git
   cd words-without-meaning
   ```

3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/words-without-meaning.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Development Environment

### Starting the Development Server

```bash
npm start
```

This will start the development server at `http://localhost:3000` with hot reloading enabled.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

### Building for Production

```bash
npm run build
```

## Project Structure

Understanding the project structure is essential for effective contributions:

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

## Development Workflow

We follow a feature branch workflow:

1. **Sync with upstream**: Before starting work, sync your fork with the upstream repository:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**: Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Use prefixes like `feature/`, `bugfix/`, `docs/`, or `refactor/` to categorize your work.

3. **Develop**: Make your changes, following the coding standards and testing guidelines.

4. **Commit**: Make small, focused commits with clear messages:
   ```bash
   git commit -m "feat: add new linguistic concept explanation"
   ```
   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

5. **Push**: Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Pull Request**: Open a pull request from your fork to the main repository.

## Coding Standards

We maintain high code quality through consistent standards:

### JavaScript/React

- Use modern JavaScript (ES6+) features
- Follow React best practices and hooks guidelines
- Use functional components with hooks rather than class components
- Keep components small and focused on a single responsibility
- Use PropTypes for component props validation

### Naming Conventions

- **Files**: Use PascalCase for components (e.g., `WordDisplay.js`) and camelCase for services and utilities (e.g., `gameService.js`)
- **Components**: Use PascalCase (e.g., `WordDisplay`)
- **Functions**: Use camelCase (e.g., `calculateScore`)
- **Variables**: Use camelCase (e.g., `userSettings`)
- **Constants**: Use UPPER_SNAKE_CASE for true constants (e.g., `MAX_ROUNDS`)
- **Redux Actions**: Use camelCase with domain/action format (e.g., `game/startNextRound`)

### Code Formatting

We use ESLint and Prettier for code formatting. The configuration is in `.eslintrc.js` and `.prettierrc`.

Key rules include:
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at the end of statements
- No trailing commas
- 80-character line length limit

## Testing Guidelines

We follow Test-Driven Development (TDD) principles:

1. **Write tests first**: Before implementing a feature, write tests that define the expected behavior
2. **Keep tests focused**: Each test should verify a single aspect of behavior
3. **Use descriptive test names**: Test names should clearly describe what is being tested
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Mock dependencies**: Use Jest's mocking capabilities to isolate components

### Test Coverage

We aim for high test coverage:
- Minimum 80% coverage for all code
- 90%+ coverage for critical paths

### Types of Tests

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test how components work together
- **Accessibility Tests**: Verify WCAG compliance
- **Responsive Tests**: Verify layout across different screen sizes

## Documentation Guidelines

Good documentation is crucial for the project's maintainability:

### Code Documentation

- Use JSDoc comments for functions and components
- Document parameters, return values, and side effects
- Explain complex logic or algorithms
- Include examples for non-obvious usage

Example:

```javascript
/**
 * Calculate score based on correctness, time spent, and difficulty
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {number} timeSpent - Time spent in seconds
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {number} Calculated score
 */
function calculateScore(isCorrect, timeSpent, difficulty) {
  // Implementation...
}
```

### README and Documentation Files

- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include examples and screenshots where helpful
- Structure documentation with headings and lists for readability

## Pull Request Process

1. **Create a focused PR**: Each PR should address a single feature, bugfix, or improvement
2. **Fill out the PR template**: Provide a clear description, related issues, and testing instructions
3. **Pass CI checks**: Ensure all tests pass and code meets quality standards
4. **Request review**: Assign reviewers who are familiar with the area of code
5. **Address feedback**: Respond to review comments and make requested changes
6. **Squash and merge**: Once approved, PRs are squashed and merged to maintain a clean history

### PR Review Criteria

PRs are evaluated based on:
- Code quality and adherence to standards
- Test coverage and quality
- Documentation completeness
- Performance and accessibility considerations
- Educational value (for content additions)

## Adding Educational Content

The educational aspect is central to this project. When adding new content:

### Adding Words to the Database

When adding new words to `wordDatabase.js`:

1. **Research thoroughly**: Ensure linguistic accuracy of meanings and examples
2. **Include multiple meanings**: Each word should have at least two distinct meanings
3. **Provide contradiction sentences**: Include sentences that demonstrate contradictory usage
4. **Categorize correctly**: Assign appropriate categories (homonym, polyseme, contronym, etc.)
5. **Set appropriate difficulty**: Assign 'easy', 'medium', or 'hard' based on complexity

Example word entry:

```javascript
{
  id: "word_011",
  text: "novel",
  difficulty: "medium",
  categories: ["noun", "adjective", "homonym"],
  meanings: [
    {
      id: "meaning_028",
      definition: "A fictional prose narrative of book length",
      partOfSpeech: "noun",
      exampleSentences: ["She is writing her first novel."],
      contradictionSentences: ["The scientist developed a novel approach to the problem."],
      isArchaic: false,
      synonyms: ["book", "story", "tale"]
    },
    {
      id: "meaning_029",
      definition: "New and original, not previously known",
      partOfSpeech: "adjective",
      exampleSentences: ["They proposed a novel solution to the crisis."],
      contradictionSentences: ["I just finished reading the novel in one sitting."],
      isArchaic: false,
      synonyms: ["new", "original", "innovative"]
    }
  ],
  notes: "Example of a homonym where the same spelling represents different parts of speech"
}
```

### Adding Educational Messages

When adding educational messages to `educationalContent.js`:

1. **Focus on clarity**: Explain concepts in accessible language
2. **Link to linguistic concepts**: Connect messages to specific linguistic phenomena
3. **Consider difficulty levels**: Create content appropriate for different learning stages
4. **Provide examples**: Include concrete examples that illustrate the concept

Example educational message:

```javascript
{
  id: "edu_msg_020",
  text: "Homographs are words that are spelled the same but have different pronunciations and meanings, like 'lead' (to guide) and 'lead' (the metal).",
  category: "homograph",
  difficulty: "medium",
  relatedWords: ["lead", "wind", "tear", "bow"]
}
```

## Community

### Communication Channels

- **GitHub Issues**: For bug reports, feature requests, and discussions
- **Pull Requests**: For code contributions and reviews
- **Project Board**: For tracking progress on planned features

### Recognition

All contributors are recognized in the [CONTRIBUTORS.md](../CONTRIBUTORS.md) file. We value every contribution, whether it's code, documentation, educational content, or bug reports.

## Conclusion

Thank you for contributing to "Words Without Meaning"! Your efforts help create an engaging educational tool that teaches important linguistic concepts. If you have any questions or need assistance, please don't hesitate to reach out through GitHub issues.

Happy contributing!
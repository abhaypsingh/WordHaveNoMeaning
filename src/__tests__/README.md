# Words Without Meaning - Test Suite

This directory contains a comprehensive test suite for the "Words Without Meaning" educational game. The tests follow Test-Driven Development (TDD) principles and cover all core components, services, and user flows.

## Testing Philosophy

Our testing approach follows the London School of Test-Driven Development:

1. **Write failing tests first** - Tests are written before implementation code
2. **Implement minimal code to pass** - Only enough code is written to make tests pass
3. **Refactor after passing** - Code is improved while maintaining test coverage
4. **Outside-in development** - Start with high-level tests and work inward
5. **Use test doubles** - Mock dependencies to isolate components

## Test Structure

The test suite is organized into the following directories:

```
src/__tests__/
├── components/            # Component unit tests
│   ├── common/            # Common UI component tests
│   └── game/              # Game-specific component tests
├── services/              # Service unit tests
├── store/                 # Redux store tests
│   └── slices/            # Redux slice tests
├── screens/               # Screen component tests
├── integration/           # Integration tests
│   ├── userFlows.test.js  # End-to-end user flow tests
│   └── educationalContent.test.js # Educational content integration tests
├── accessibility.test.js  # Accessibility compliance tests
├── responsive.test.js     # Responsive design tests
└── App.test.js            # Main App component tests
```

## Test Categories

### Unit Tests

Unit tests verify the behavior of individual components and services in isolation:

- **Component Tests**: Verify rendering, props handling, user interactions, and state changes
- **Service Tests**: Verify data fetching, processing, and business logic
- **Redux Tests**: Verify actions, reducers, selectors, and state management

### Integration Tests

Integration tests verify how components and services work together:

- **User Flows**: Test complete user journeys through the application
- **Educational Content**: Test the integration of educational content with gameplay

### Specialized Tests

- **Accessibility Tests**: Verify WCAG compliance and screen reader compatibility
- **Responsive Tests**: Verify layout and functionality across different screen sizes

## Running Tests

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running All Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Running Specific Tests

```bash
# Run a specific test file
npm test -- src/__tests__/components/common/Button.test.js

# Run tests matching a pattern
npm test -- -t "Button Component"

# Run tests in watch mode (re-run on file changes)
npm test -- --watch
```

## Test Coverage

The test suite aims for high coverage across all application components:

- **Target**: 90%+ coverage for critical paths
- **Minimum**: 80% coverage for all code

Coverage reports are generated in the `coverage/` directory after running tests with the `--coverage` flag.

## Mocking Strategy

The test suite uses Jest's mocking capabilities to isolate components:

- **Service Mocks**: External services are mocked to provide predictable responses
- **Redux Store Mocks**: A mock store is used to test component integration with Redux
- **Browser API Mocks**: Browser APIs like localStorage and matchMedia are mocked

## Continuous Integration

Tests are automatically run in the CI pipeline on every pull request and merge to main. The pipeline enforces:

1. All tests must pass
2. Coverage thresholds must be met
3. No accessibility violations are allowed

## Adding New Tests

When adding new features, follow these steps:

1. Write failing tests that describe the expected behavior
2. Implement the minimal code needed to make tests pass
3. Refactor the code while keeping tests green
4. Add integration tests for user flows involving the new feature

## Best Practices

- Keep tests focused on a single behavior or assertion
- Use descriptive test names that document behavior (Given-When-Then format)
- Maintain test independence (no shared mutable state)
- Mock external dependencies consistently
- Separate test setup, execution, and verification phases
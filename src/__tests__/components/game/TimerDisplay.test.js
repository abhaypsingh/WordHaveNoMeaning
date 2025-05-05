import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TimerDisplay from '../../../components/game/TimerDisplay';

describe('TimerDisplay Component', () => {
  // Mock timers
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with initial time', () => {
    // Act
    render(<TimerDisplay initialTime={30} />);
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toBeInTheDocument();
    expect(timerElement).toHaveTextContent('30');
  });

  it('should count down when running', () => {
    // Act
    render(<TimerDisplay initialTime={30} isRunning />);
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('29');
    
    // Advance timer by another 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Assert
    expect(timerElement).toHaveTextContent('27');
  });

  it('should not count down when not running', () => {
    // Act
    render(<TimerDisplay initialTime={30} isRunning={false} />);
    
    // Advance timer by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('30');
  });

  it('should stop at 0 and not go negative', () => {
    // Act
    render(<TimerDisplay initialTime={2} isRunning />);
    
    // Advance timer by 3 seconds (more than initialTime)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('0');
  });

  it('should call onTimeUp when time reaches 0', () => {
    // Arrange
    const handleTimeUp = jest.fn();
    
    // Act
    render(<TimerDisplay initialTime={2} isRunning onTimeUp={handleTimeUp} />);
    
    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Assert
    expect(handleTimeUp).toHaveBeenCalledTimes(1);
  });

  it('should not call onTimeUp when paused before reaching 0', () => {
    // Arrange
    const handleTimeUp = jest.fn();
    
    // Act
    const { rerender } = render(<TimerDisplay initialTime={3} isRunning onTimeUp={handleTimeUp} />);
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Pause the timer
    rerender(<TimerDisplay initialTime={3} isRunning={false} onTimeUp={handleTimeUp} />);
    
    // Advance timer by 5 more seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Assert
    expect(handleTimeUp).not.toHaveBeenCalled();
  });

  it('should reset when initialTime changes', () => {
    // Act
    const { rerender } = render(<TimerDisplay initialTime={10} isRunning />);
    
    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Assert
    let timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('8');
    
    // Change initialTime
    rerender(<TimerDisplay initialTime={20} isRunning />);
    
    // Assert
    timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('20');
  });

  it('should apply warning class when time is below warning threshold', () => {
    // Act
    render(<TimerDisplay initialTime={10} isRunning warningThreshold={5} />);
    
    // Advance timer to 6 seconds (above warning threshold)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    
    // Assert - No warning yet
    let timerElement = screen.getByTestId('timer-display');
    expect(timerElement).not.toHaveClass('timer-display--warning');
    
    // Advance timer to 5 seconds (at warning threshold)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Assert - Warning should be applied
    timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveClass('timer-display--warning');
  });

  it('should apply danger class when time is below danger threshold', () => {
    // Act
    render(<TimerDisplay initialTime={10} isRunning dangerThreshold={3} />);
    
    // Advance timer to 4 seconds (above danger threshold)
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    
    // Assert - No danger yet
    let timerElement = screen.getByTestId('timer-display');
    expect(timerElement).not.toHaveClass('timer-display--danger');
    
    // Advance timer to 3 seconds (at danger threshold)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Assert - Danger should be applied
    timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveClass('timer-display--danger');
  });

  it('should apply custom className', () => {
    // Act
    render(<TimerDisplay initialTime={30} className="custom-timer" />);
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveClass('timer-display');
    expect(timerElement).toHaveClass('custom-timer');
  });

  it('should format time with minutes and seconds when format is mm:ss', () => {
    // Act
    render(<TimerDisplay initialTime={65} format="mm:ss" />);
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('01:05');
  });

  it('should format time with only seconds when format is ss', () => {
    // Act
    render(<TimerDisplay initialTime={65} format="ss" />);
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('65');
  });

  it('should use custom time formatter when provided', () => {
    // Arrange
    const customFormatter = (seconds) => `${seconds} seconds remaining`;
    
    // Act
    render(<TimerDisplay initialTime={30} timeFormatter={customFormatter} />);
    
    // Assert
    const timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveTextContent('30 seconds remaining');
  });

  it('should call onTick callback on each second', () => {
    // Arrange
    const handleTick = jest.fn();
    
    // Act
    render(<TimerDisplay initialTime={5} isRunning onTick={handleTick} />);
    
    // Advance timer by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Assert
    expect(handleTick).toHaveBeenCalledTimes(3);
    expect(handleTick).toHaveBeenNthCalledWith(1, 4); // 5 -> 4
    expect(handleTick).toHaveBeenNthCalledWith(2, 3); // 4 -> 3
    expect(handleTick).toHaveBeenNthCalledWith(3, 2); // 3 -> 2
  });

  it('should render with different sizes', () => {
    // Act - Small size
    const { rerender } = render(<TimerDisplay initialTime={30} size="small" />);
    
    // Assert - Small size
    let timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveClass('timer-display--small');
    
    // Act - Large size
    rerender(<TimerDisplay initialTime={30} size="large" />);
    
    // Assert - Large size
    timerElement = screen.getByTestId('timer-display');
    expect(timerElement).toHaveClass('timer-display--large');
  });

  it('should render with label when showLabel is true', () => {
    // Act
    render(<TimerDisplay initialTime={30} showLabel />);
    
    // Assert
    const labelElement = screen.getByText('Time Remaining:');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('timer-display__label');
  });

  it('should not render label when showLabel is false', () => {
    // Act
    render(<TimerDisplay initialTime={30} showLabel={false} />);
    
    // Assert
    const labelElement = screen.queryByText('Time Remaining:');
    expect(labelElement).not.toBeInTheDocument();
  });

  it('should render with custom label text', () => {
    // Act
    render(<TimerDisplay initialTime={30} showLabel labelText="Time Left:" />);
    
    // Assert
    const labelElement = screen.getByText('Time Left:');
    expect(labelElement).toBeInTheDocument();
  });
});
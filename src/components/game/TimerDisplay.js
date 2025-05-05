import React, { useEffect, useState, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { playTimerTick, playTimerExpire } from '../../services/soundService';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
`;

const TimerCircle = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.warning && css`
    border-color: var(--color-accent);
  `}
  
  ${props => props.critical && css`
    border-color: var(--color-error);
    animation: ${pulse} 1s infinite;
  `}
`;

const TimerFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => {
    if (props.critical) return 'rgba(214, 64, 69, 0.2)';
    if (props.warning) return 'rgba(243, 146, 55, 0.2)';
    return 'rgba(74, 111, 165, 0.1)';
  }};
  clip-path: ${props => `polygon(50% 50%, 50% 0%, ${getCoordinatesForPercent(props.percent)} 50% 50%)`};
  transform: rotate(-90deg);
`;

const TimerText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => {
    if (props.critical) return 'var(--color-error)';
    if (props.warning) return 'var(--color-accent)';
    return 'var(--color-text)';
  }};
  z-index: 1;
`;

/**
 * Helper function to get coordinates for percent of circle
 * @param {number} percent - Percent of circle (0-1)
 * @returns {string} - Coordinates for clip-path
 */
function getCoordinatesForPercent(percent) {
  // Start at the top of the circle (0%)
  // Move clockwise around the circle
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  
  // Convert to coordinates in the 100x100 space
  const coordX = 50 + 50 * x;
  const coordY = 50 + 50 * y;
  
  return `${coordX}% ${coordY}%, `;
}

/**
 * TimerDisplay component for showing countdown timer
 * @param {Object} props - Component props
 * @param {number} props.timeRemaining - Time remaining in seconds
 * @param {number} props.timeLimit - Total time limit in seconds
 * @param {Function} props.onTimeExpired - Callback when timer expires
 * @returns {JSX.Element} - Rendered component
 */
const TimerDisplay = ({ timeRemaining, timeLimit, onTimeExpired }) => {
  const [playedWarningSound, setPlayedWarningSound] = useState(false);
  const [playedCriticalSound, setPlayedCriticalSound] = useState(false);
  const [internalTime, setInternalTime] = useState(timeRemaining);
  const lastUpdateTimeRef = useRef(Date.now());
  const requestRef = useRef(null);
  
  // Calculate percentage of time remaining
  const percent = timeLimit > 0 ? internalTime / timeLimit : 1;
  
  // Determine warning states
  const isWarning = percent <= 0.5 && percent > 0.25;
  const isCritical = percent <= 0.25;
  
  // Use requestAnimationFrame for more accurate timing
  const updateTimer = () => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateTimeRef.current) / 1000; // Convert to seconds
    lastUpdateTimeRef.current = now;
    
    setInternalTime(prevTime => {
      const newTime = Math.max(0, prevTime - deltaTime);
      return newTime;
    });
    
    requestRef.current = requestAnimationFrame(updateTimer);
  };
  
  // Initialize and clean up the animation frame
  useEffect(() => {
    setInternalTime(timeRemaining);
    lastUpdateTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(updateTimer);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [timeRemaining]);
  
  // Play sound effects at certain thresholds
  useEffect(() => {
    if (isWarning && !playedWarningSound) {
      playTimerTick();
      setPlayedWarningSound(true);
    }
    
    if (isCritical && !playedCriticalSound) {
      playTimerTick();
      setPlayedCriticalSound(true);
    }
    
    if (internalTime <= 0) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      playTimerExpire();
      if (onTimeExpired) {
        onTimeExpired();
      }
    }
  }, [internalTime, isWarning, isCritical, playedWarningSound, playedCriticalSound, onTimeExpired]);
  
  // Reset sound state when timer resets
  useEffect(() => {
    if (percent > 0.5) {
      setPlayedWarningSound(false);
      setPlayedCriticalSound(false);
    }
  }, [percent]);
  
  // Format time for screen readers
  const formatTimeForScreenReader = (seconds) => {
    const wholeSeconds = Math.ceil(seconds);
    return `${wholeSeconds} ${wholeSeconds === 1 ? 'second' : 'seconds'} remaining`;
  };

  return (
    <Container>
      <TimerCircle
        warning={isWarning}
        critical={isCritical}
        role="timer"
        aria-label={formatTimeForScreenReader(internalTime)}
        aria-live={isCritical ? "assertive" : "polite"}
      >
        <TimerFill
          percent={percent}
          warning={isWarning}
          critical={isCritical}
        />
        <TimerText
          warning={isWarning}
          critical={isCritical}
        >
          {Math.ceil(internalTime)}
        </TimerText>
      </TimerCircle>
    </Container>
  );
};

export default TimerDisplay;
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  margin: var(--spacing-sm) 0;
  position: relative;
`;

const ProgressBarTrack = styled.div`
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--border-radius-small);
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-small);
  margin-top: var(--spacing-xs);
  color: var(--color-text);
`;

const ProgressLabel = styled.span`
  font-weight: 500;
`;

const ProgressValue = styled.span`
  font-weight: 500;
`;

/**
 * Progress bar component
 * @param {Object} props - Component props
 * @param {number} props.current - Current value
 * @param {number} props.total - Total value
 * @param {string} props.label - Optional label for the progress bar
 * @param {boolean} props.showText - Whether to show the progress text
 * @returns {JSX.Element} - Rendered component
 */
const ProgressBar = ({ current, total, label, showText = true }) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  return (
    <div>
      <ProgressBarContainer aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage} role="progressbar">
        <ProgressBarTrack percentage={percentage} />
      </ProgressBarContainer>
      
      {showText && (
        <ProgressText>
          {label && <ProgressLabel>{label}</ProgressLabel>}
          <ProgressValue>{current}/{total}</ProgressValue>
        </ProgressText>
      )}
    </div>
  );
};

export default ProgressBar;
ProgressBar.propTypes = {
  current:  PropTypes.number.isRequired,
  total:    PropTypes.number.isRequired,
  label:    PropTypes.string,
  showText: PropTypes.bool,
};

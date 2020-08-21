import React, { useState, useEffect, useRef, Fragment } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
}

  body {
    color: #ffffff;
    opacity: 0.9;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    background-color: #ff7700;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23cc0000' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23aa0000' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23d6002b' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23b10022' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23d9004b' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23b2003d' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23d3006c' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23ac0057' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23c4008c' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%239e0071' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23aa00aa' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23880088' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
  }
  `;

const StyledButton = styled.button`
  background-color: white;
  padding: 1rem;
  border: none;
  text-transform: uppercase;
  font-size: ${({ fontsize }) => fontsize || '1rem'};
  border-radius: 3rem;
  user-select: none;
  padding-left: 2rem;
  padding-right: 2rem;

  &:hover {
    opacity: 0.9;
  }

  & + & {
    margin-left: 2rem;
  }

  ${({ primary }) =>
    primary &&
    css`
      background-color: #ef374e;
    `}
`;

const StopwatchWrapper = styled.div`
  width: '100%';
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`;

const StyledStopwatchDuration = styled.p`
  font-size: 5rem;
  line-height: 1;
  margin-bottom: 4rem;
`;

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Stopwatch = () => {
  const [timeStamp, setTimeStamp] = useState(0);
  const [durationTimestamp, setDurationTimestamp] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(0);
  const [isPaused, setPaused] = useState(false);

  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours() - 1;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
  };

  useInterval(() => {
    if (!isRunning && !isPaused) {
      setDurationTimestamp(0);
    }

    if (isRunning) {
      const timeDifference = Date.now() - timeStamp;
      setDurationTimestamp(timeDifference);
    }
  }, 1000);

  const startStopwatch = () => {
    setRunning(true);
    const notPaused = !isPaused;
    if (notPaused) {
      setTimeStamp(Date.now());
    }
  };

  const resumeStopwatch = () => {
    setRunning(true);
    setPaused(false);
    const pauseDuration = Date.now() - pauseStartTime;
    setTimeStamp(timeStamp + pauseDuration);
  };

  const pauseStopwatch = () => {
    setPauseStartTime(Date.now());
    setRunning(false);
    setPaused(true);
  };

  const resetStopwatch = () => {
    setRunning(false);
    setPaused(false);
    setTimeStamp(0);
  };

  const controlButton = () => {
    if (!isRunning && !isPaused) {
      return <StyledButton onClick={startStopwatch}> Start </StyledButton>;
    }

    if (isRunning && !isPaused) {
      return (
        <Fragment>
          <StyledButton onClick={pauseStopwatch}> Pause </StyledButton>
          <StyledButton onClick={resetStopwatch}> Reset </StyledButton>
        </Fragment>
      );
    }

    if (!isRunning && isPaused) {
      return (
        <Fragment>
          <StyledButton onClick={resumeStopwatch}> Resume </StyledButton>
          <StyledButton onClick={resetStopwatch}> Reset </StyledButton>
        </Fragment>
      );
    }
  };

  return (
    <StopwatchWrapper>
      <StyledStopwatchDuration>
        {formatTime(durationTimestamp)}
      </StyledStopwatchDuration>
      <div>{controlButton()}</div>
    </StopwatchWrapper>
  );
};

const App = () => {
  return (
    <Fragment>
      <GlobalStyle />
      <Stopwatch />
    </Fragment>
  );
};

export default App;

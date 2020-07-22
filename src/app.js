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
    background-color:#010101;
    color: #ffffff;
    opacity: 0.9;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
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

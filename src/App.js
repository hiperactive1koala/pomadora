import React, {useRef, useEffect, useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import './App.scss';


momentDurationFormatSetup(moment);


function App() {
  const audioRef = useRef(null)
  const [sessionType, setSessionType] = useState('Session');
  const [intervalID, setIntervalID] = useState(null);
  const [breakLength, setBreakLength] = useState(300);
  const [sessionLength, setSessionLength] = useState(60 * 25);
  const [timeLeft, setTimeLeft] = useState(sessionLength);

  
  useEffect(() => {
    if (sessionType === 'Session') {
      setTimeLeft(sessionLength)
    }
    else if (sessionType === 'Break') {
      setTimeLeft(breakLength)
    }
  }, [sessionLength, breakLength, sessionType])

  useEffect(() => {
    if (timeLeft <= 0) {
      switch(sessionType){
        case 'Session':
          audioRef.current.play()
          setSessionType('Break')
          break;
        case 'Break':
          audioRef.current.play()
          setSessionType('Session')
          break;
      }
      console.log(sessionType)
    }
  }, [timeLeft])

  const isStarted = intervalID != null;

  const handleStartButton = () =>{
    if (isStarted) {

      clearInterval(intervalID)
      setIntervalID(null)
    }else{

      const newIntervalID = setInterval(() =>{

        setTimeLeft( prevTime => {
          const newTime = prevTime - 1
          if (newTime >= 0) {
            return newTime;
          }
          if (sessionType ==='Session') {

            audioRef.current.play()
            return breakLength

          }else if(sessionType ==='Break'){
            
            audioRef.current.play()
            return sessionLength
          }

          return prevTime;
           })
      }, 10)  
      setIntervalID(newIntervalID)
    }

  }
  
  const handleResetButtonClick = () => {
    audioRef.current.load()
    clearInterval(intervalID)
    setIntervalID(null)
    setSessionType("Session")
    console.log(sessionType)
    setSessionLength(60 * 25)
    setBreakLength(60 * 5)
    setTimeLeft(60 * 25)
  }

  const decrementBreakLengthByOneMinute = () => {
    const newBreakLengthInSeconds = breakLength - 60;
    if (newBreakLengthInSeconds < 60) {
      setBreakLength(breakLength);
    }else {
      setBreakLength(newBreakLengthInSeconds);
    }
  };

  const incrementBreakLengthByOneMinute = () => {
    let newBreakLengthInSeconds = breakLength + 60;
    if (newBreakLengthInSeconds > 60 * 60) {
      setBreakLength(60 * 60)
    }
    setBreakLength(newBreakLengthInSeconds);
  }


  const decrementSessionLengthByOneMinute = () => {

    let newSessionLengthInSeconds = sessionLength - 60;

    if (newSessionLengthInSeconds < 60) {
      setSessionLength(60);
    } else {
      setSessionLength(newSessionLengthInSeconds);
    }
  };


  const incrementSessionLengthByOneMinute = () => {
    let newSessionLengthInSeconds = sessionLength + 60;

    if (newSessionLengthInSeconds > 60 * 60) {
      setSessionLength(60 * 60);
    } else {
      setSessionLength(newSessionLengthInSeconds);
    }
  };
  
    return (
      <div id="app">
        <h1>Pomodora Technique </h1>
        <Break
          breakLength={breakLength}
          incrementBreakLengthByOneMinute={incrementBreakLengthByOneMinute}
          decrementBreakLengthByOneMinute={decrementBreakLengthByOneMinute}
        />
        <TimeLeft
          sessionType={sessionType}
          timeLeft={timeLeft}
          intervalID={intervalID}
          handleStartButton={handleStartButton}
          breakLength={breakLength}
          sessionLength={sessionLength}
          startStopLabel={isStarted ? <i class="fas fa-pause"></i> : <i class="fas fa-play"></i>}
        />
        <Session
          sessionLength={sessionLength}
          incrementSessionLengthByOneMinute={incrementSessionLengthByOneMinute}
          decrementSessionLengthByOneMinute={decrementSessionLengthByOneMinute}
        />
        <button id='reset' onClick={handleResetButtonClick}><i class="fas fa-undo"></i></button>
        <audio id="beep" ref={audioRef}>
          <source src="http://soundbible.com/grab.php?id=535&type=mp3" type="audio/mp3" preload="auto" />
        </audio>
      </div>
    );
}


const Session = ({
  sessionLength, // this is where we accept the props
  incrementSessionLengthByOneMinute,
  decrementSessionLengthByOneMinute,
}) => {

  const sessionLengthInMinutes = moment.duration(sessionLength, 's').asMinutes();

  return (
    <div className="session">
      <button id="session-decrement" onClick={decrementSessionLengthByOneMinute}>
      <i class="fas fa-minus"></i>
      </button>

      <div className='session-label'>
      <p id="session-label">Session</p>
      <p id="session-length">{sessionLength >= 3600 ? "60" : sessionLengthInMinutes}</p>
      </div>

      <button id="session-increment" onClick={incrementSessionLengthByOneMinute}>
      <i class="fas fa-plus"></i>
      </button>
    </div>
  );
};


const Break = ({
  breakLength,
  incrementBreakLengthByOneMinute,
  decrementBreakLengthByOneMinute,
}) => {

  const breakLengthInMinutes = moment.duration(breakLength, 's').minutes();

  return (
    <div className="break">
      <button id="break-decrement" onClick={decrementBreakLengthByOneMinute}>
      <i class="fas fa-minus"></i>
      </button>
      <div className='session-label'>
        <p id="break-label">Break </p>
        <p id="break-length">{breakLength >= 3600 ? "60" : breakLengthInMinutes}</p>
      </div>

      <button id="break-increment" onClick={incrementBreakLengthByOneMinute}>
      <i class="fas fa-plus"></i>
      </button>
    </div>
  );
};


const TimeLeft = ({ 
  sessionType, 
  timeLeft, 
  startStopLabel, 
  handleStartButton}) => {

  const formattedTimeLeft = moment.duration(timeLeft, 's').format('mm:ss', {trim: false});

  return <div className="time-left">
    <div className='session-label'>
      <p id="time-left">{formattedTimeLeft}</p>
      <p id="timer-label">{sessionType}</p>
    </div>
    <button id="start_stop" onClick={handleStartButton}>{startStopLabel}</button>
  </div>
};


export default App;
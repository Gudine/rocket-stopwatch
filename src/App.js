import './App.css';
import React, { useState, useEffect, useReducer } from 'react';

function App() {
  const [status, toggleStatus] = useReducer((state) => !state, true);
  const [targetTime, setTargetTime] = useState(new Date(Date.now() + 180000));
  const [countdown, updateCountdown] = useReducer(
    () => new Date(targetTime.getTime() - Date.now()),
    new Date(0)
  );
  
  const countdownLoop = () => {
    if (status && countdown) {
      updateCountdown();
      setTimeout(countdownLoop, 50);
    } else if (status) {
      toggleStatus();
    }
  }

  useEffect(() => {
    countdownLoop();
  }, [])

  const hours = String(countdown.getUTCHours()).padStart(2, '0');
  const mins = String(countdown.getUTCMinutes()).padStart(2, '0');
  const secs = String(countdown.getUTCSeconds()).padStart(2, '0');
  const ms = String(countdown.getUTCMilliseconds()).padStart(3, '0');

  return (
    <main>
      <div className="rocket">
        <div className="padding" />
        <div className="logo" />
        <div className="countdown">
          <p>
            {`${hours}:${mins}:${secs}`}
            <span className="small">{`.${ms}`}</span>
          </p>
        </div>
        <div className="options" />
      </div>
    </main>
  );
}

export default App;

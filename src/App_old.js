import './App.css';
import React, { useState, useEffect, useReducer, useCallback } from 'react';

/* References:
https://css-tricks.com/snippets/svg/curved-text-along-path/
https://stackoverflow.com/questions/44860320/how-to-center-text-inside-an-svg-path */

function App() {
  const [status, changeStatus] = useReducer((state, value) => value ?? !state, true);
  const [timeInput, setTimeInput] = useState('');
  const [targetTime, setTargetTime] = useReducer((_, { hours, mins, secs }) => new Date(
    Date.now() + ((hours * 60 + mins) * 60 + secs) * 1000
  ), new Date(Date.now() + 5000));
  const [countdown, updateCountdown] = useReducer(
    () => {
      const delta = targetTime.getTime() - Date.now();
      if (delta <= 0) {
        changeStatus(false);
        return new Date(0);
      }
      return new Date(delta)
    },
    new Date(0)
  );
  
  const countdownLoop = useCallback(() => {
    /* console.log('is in countdownLoop'); */
    if (status) {
      /* console.log('is in countdownLoop if');
      console.log('status: ' + status); */
      updateCountdown();
      setTimeout(countdownLoop, 50);
    }
  }, [status]);

  useEffect(() => {
    console.log('is in useEffect');
    countdownLoop();
  }, [countdownLoop]);

  const updateInput = ({ target: { value } }) => {
    const padded = [...'00:00:00']
      .reduce((acc, char, index) => acc + (value[index] || char), '');
    if (value.length <= 8 && padded.match(/^(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/)) {
      const [ hours, mins, secs ] = padded.match(/(\d{2}):(\d{2}):(\d{2})/)
        .slice(1).map((match) => parseInt(match, 10));
      setTargetTime({ hours, mins, secs });
      if (
        timeInput.length <= value.length && value.length < 8 && value.length%3 === 2
      ) setTimeInput(value + ':');
      else setTimeInput(value);
    }
  };

  const hours = String(countdown.getUTCHours()).padStart(2, '0');
  const mins = String(countdown.getUTCMinutes()).padStart(2, '0');
  const secs = String(countdown.getUTCSeconds()).padStart(2, '0');
  const ms = String(countdown.getUTCMilliseconds()).padStart(3, '0');

  return (
    <main>
      <form className="inputs">
        <input
          type="text"
          value={ timeInput }
          placeholder="HH:MM:SS"
          onChange={ updateInput }
        />
        <button type="submit">Start</button>
      </form>
      <div className="rocket">
        <div className="padding" />
        <div className="logo" />
        <div className="countdown">
          <svg viewBox="0 0 600 100">
            <refs>
              <path
                id="curve"
                d="M 0,100 C 92.831542,67.70221 193.984,50 300,50 C 406.016,50 507.16846,67.70221 600,100"
              />
            </refs>
            <text width="600">
              <textPath
                startOffset="50%"
                textAnchor="middle"
                href="#curve"
              >
                {`${hours}:${mins}:${secs}`}
                <tspan className="ms">{`.${ms}`}</tspan>
              </textPath>
            </text>
          </svg>
        </div>
        <div className="options" />
      </div>
    </main>
  );
}

export default App;

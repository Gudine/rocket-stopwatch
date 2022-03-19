import React, { Component } from 'react';
import './App.css';
import AlarmRing from './components/AlarmRing';
// import React, { useState, useEffect, useReducer, useCallback } from 'react';

/* References:
https://css-tricks.com/snippets/svg/curved-text-along-path/
https://stackoverflow.com/questions/44860320/how-to-center-text-inside-an-svg-path */

class App extends Component {
  constructor() {
    super();

    this.state = {
      isOn: false,
      timeInput: '',
      inputHours: 0,
      inputMins: 0,
      inputSecs: 0,
      targetTime: new Date(Date.now()),
      pausedTime: null,
      alarms: Array(10).fill(false),
      checkpoints: [],
    };
  }

  startAlarm = () => {
    this.setState(({ alarms }) => {
      const index = alarms.findIndex((elem) => !elem);
      return { alarms: [...alarms.slice(0, index), true, ...alarms.slice(index + 1)] };
    });
  };

  stopAlarm = (index) => {
    this.setState(({ alarms }) => {
      return { alarms: [...alarms.slice(0, index), false, ...alarms.slice(index + 1)] };
    });
  };
  
  handleInput = ({ target: { value } }) => {
    const padded = [...'00:00:00']
      .reduce((acc, char, index) => acc + (value[index] || char), '');
  
    if (value.length <= 8 && padded.match(/^(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/)) {
      const [ hours, mins, secs ] = padded.match(/(\d{2}):(\d{2}):(\d{2})/)
        .slice(1).map((match) => parseInt(match, 10));
      this.setState((prevState) => ({
        timeInput: value + ((
          prevState.timeInput.length <= value.length && value.length < 8 && value.length%3 === 2
        ) ? ':' : ''),
        inputHours: hours,
        inputMins: mins,
        inputSecs: secs,
      }));
    }
  };

  startCountdown = (ev) => {
    ev.preventDefault();
    
    this.setState(({ inputHours, inputMins, inputSecs}) => {
      const finalTime = ((inputHours * 60 + inputMins) * 60 + inputSecs) * 1000;
      const checkpoints = [
        1000, 2000, 3000, 4000, 5000, 6000, 11000, 21000, 31000, 46000,
        ...Array.from({ length: Math.floor(finalTime/60000) }, (_, i) => (i + 1) * 60000 + 1000)
      ].filter((elem) => elem <= finalTime);

      return {
        isOn: true,
        timeInput: '',
        inputHours: 0,
        inputMins: 0,
        inputSecs: 0,
        targetTime: new Date(Date.now() + finalTime),
        alarms: Array(10).fill(false),
        checkpoints,
      };
    }, this.countdownLoop);
  };

  countdownLoop = () => {
    const delta = this.state.targetTime.getTime() - Date.now();
    if (this.state.isOn && delta > 0 && this.state.pausedTime === null) {
      if (delta <= this.state.checkpoints.slice(-1)[0]) {
        this.startAlarm();
        this.setState({ checkpoints: this.state.checkpoints.slice(0, -1) });
      }
      this.forceUpdate();
      setTimeout(this.countdownLoop, 50);
    } else if (this.state.isOn && this.state.pausedTime === null) {
      this.setState({
        isOn: false,
        targetTime: new Date(Date.now()),
        alarms: Array(10).fill(false),
        checkpoints: [],
      });
    }
  };

  resetForm = () => {
    this.setState({
      isOn: false,
      timeInput: '',
      inputHours: 0,
      inputMins: 0,
      inputSecs: 0,
      targetTime: new Date(Date.now()),
      pausedTime: null,
      alarms: Array(10).fill(false),
      checkpoints: [],
    });
  };

  pauseCountdown = () => {
    this.setState(({ targetTime }) => ({
      targetTime: new Date(0),
      pausedTime: targetTime.getTime() - Date.now(),
    }));
  }

  resumeCountdown = () => {
    this.setState(({ pausedTime }) => ({
      targetTime: new Date(Date.now() + pausedTime),
      pausedTime: null,
    }), this.countdownLoop);
  }

  render() {
    const {
      isOn, timeInput, inputHours, inputMins, inputSecs, targetTime, pausedTime, alarms,
    } = this.state;

    const time = pausedTime ?? targetTime.getTime() - Date.now();
    const countdown = (time > 0) ? (new Date(time)) : new Date(0);
    
    const hours = String(!isOn ? inputHours : countdown.getUTCHours()).padStart(2, '0');
    const mins = String(!isOn ? inputMins : countdown.getUTCMinutes()).padStart(2, '0');
    const secs = String(!isOn ? inputSecs : countdown.getUTCSeconds()).padStart(2, '0');
    const ms = String(!isOn ? 0 : countdown.getUTCMilliseconds()).padStart(3, '0');

    return (
      <main>
        <div className="rocket">
          <div className="padding" />
          <div className="logo" />
          <div className="countdown">
            <AlarmRing alarms={ alarms } stopAlarm={ this.stopAlarm } />
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
        </div>
        <form
          className="inputs"
          onSubmit={ this.startCountdown }
        >
          <input
            type="text"
            value={ timeInput }
            placeholder="HH:MM:SS"
            onChange={ this.handleInput }
            disabled={ isOn }
          />
          { !isOn
            ? <button type="submit" disabled={ !(inputHours || inputMins || inputSecs) }>Start</button>
            : ( pausedTime === null
                ? (<button type="button" onClick={ this.pauseCountdown }>Pause</button>)
                : (<button type="button" onClick={ this.resumeCountdown }>Resume</button>)
              )
          }
          <button
            type="button"
            disabled={ !isOn && !(inputHours || inputMins || inputSecs || timeInput.length) }
            onClick={ this.resetForm }
          >
            Reset
          </button>
        </form>
      </main>
    );
  }
}
 
export default App;

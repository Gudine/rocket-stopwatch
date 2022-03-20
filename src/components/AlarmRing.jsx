import React, { Component, createRef } from 'react';
import './AlarmRing.css';
import checkpointSnd from '../snd/checkpoint.wav';
import endSnd from '../snd/end.wav';

class AlarmRing extends Component {
  constructor() {
    super();

    this.alarmRefs = Array(10).fill().map(() => createRef());
    this.overlayRef = createRef();
  }

  componentDidUpdate(prevProps) {
    const { alarms, stopAlarm } = this.props;
    let overlay = false;
    prevProps.alarms.forEach((prev, index) => {
      const curr = alarms[index];
      if (prev !== curr && curr === true) {
        overlay = true;
        this.alarmRefs[index].current.children[0].play();
        this.alarmRefs[index].current.animate(
          [
            { opacity: 0, width: 0 },
            { opacity: 1, offset: 0.15 },
            { width: '150%' },
          ], {
            duration: 1500,
            easing: 'ease',
          }
        ).onfinish = () => stopAlarm(index);
      }
    });

    if (overlay) this.overlayRef.current.animate(
      [{ opacity: 1, offset: 0.35 }, { opacity: 1, offset: 0.65 }],
      { duration: 1500, easing: 'ease' },
    );
  }

  render() {
    

    return (
      <>
        <div className="red-fill" ref={ this.overlayRef } />
        {Array(10).fill().map((_, i) => (
          <div key={ i } ref={ this.alarmRefs[i] } className="alarm-ring">
            <audio src={ checkpointSnd }>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
        ))}
      </>
    );
  }
}
 
export default AlarmRing;

import React, { Component, createRef } from 'react';
import endSnd from '../snd/end.wav';
import './Ending.css';

class Ending extends Component {
  constructor() {
    super();

    this.mainRef = createRef();
  }

  handleButton = () => {
    const { confirmEnding } = this.props;

    this.mainRef.current.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 500, easing: 'ease' },
    );

    this.mainRef.current.children[0].animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.4)' }],
      { duration: 500, easing: 'ease' },
    ).onfinish = confirmEnding;
  };

  componentDidMount() {
    this.mainRef.current.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 500, easing: 'ease' },
    );

    this.mainRef.current.children[0].animate(
      [{ transform: 'scale(.4)' }, { transform: 'scale(1)' }],
      { duration: 500, easing: 'ease' },
    );

    this.mainRef.current.children[1].play();
  }

  render() {
    return (
      <div className="ending" ref={ this.mainRef }>
        <div className="ending-modal">
          Time's up!
          <button type="button" onClick={ this.handleButton }>
            OK
          </button>
        </div>
        <audio src={ endSnd }>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </div>
    );
  }
}

export default Ending;

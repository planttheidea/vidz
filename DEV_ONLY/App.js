import $ from 'jquery';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import vidz from '../src';

const delayVolumeDown = (instance, shouldDecrease = false, hasRun = false) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentVolume = instance.getVolume();

      if (hasRun && currentVolume === 1) {
        resolve()
      } else if (!shouldDecrease) {
        instance.setVolume(currentVolume + 0.1);

        resolve(delayVolumeDown(instance, false, true));
      } else {
        instance.setVolume(currentVolume - 0.1);

        resolve(delayVolumeDown(instance, currentVolume >= 0.1, true));
      }
    }, 250);
  });
};

class App extends Component {
  vidzInstance = null;

  componentDidMount() {
    let interval = null;

    const $div = $(this.refs.videoContainer);

    this.vidzInstance = vidz($div, {
      mp4: 'http://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4',
      muted: true,
      onProgress() {
        console.log(this.currentTime);
        console.log(this.duration);
      },
      poster: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150',
      swf: 'test.swf',
      webm: 'http://www.html5rocks.com/en/tutorials/video/basics/devstories.webm'
    });

    this.forceUpdate();
  }

  state = {
    isPlaying: false
  };

  onClickPlayPause = () => {
    const {
      isPlaying
    } = this.state;

    if (isPlaying) {
      this.vidzInstance.pause();
    } else {
      this.vidzInstance.play();
    }

    this.setState({
      isPlaying: !isPlaying
    });
  };

  render() {
    return (
      <div>
        App

        <div
          id="video-container"
          ref="videoContainer"
        />

        <div
          onClick={this.onClickPlayPause}
        >
          Toggle play / pause
        </div>
      </div>
    );
  }
}

const div = document.createElement('div');

div.id = 'app-container';

render((
  <App/>
), div);

document.body.appendChild(div);

import Blits from '@lightningjs/blits';
import App from './App.js';

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  renderMode: 'webgl',
  canvasColor: '#0b1420',
  defaultFont: 'Lato',
  fonts: [{ family: 'Lato', type: 'web', file: '/fonts/Lato-Regular.ttf' }],
  keymap: {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
    13: 'enter',
  },
});

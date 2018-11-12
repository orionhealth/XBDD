// eslint-disable-next-line
import PopperJs from 'popper.js';

// We need to mock popper.js as it is used by material-ui
// and it doesn't play nicely with jsdom

export default class Popper {
  static placements = PopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
    };
  }
}

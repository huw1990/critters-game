
import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key, config, state) {
    super(key);
    this.config = config;
    this.state = state;
  }

  create() {
  }
}

export default BaseScene;

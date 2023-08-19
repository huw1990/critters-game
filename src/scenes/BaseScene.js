
import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key, config, state) {
    super(key);
    this.config = config;
    this.state = state;
  }

  create() {
    const bg = this.add.image(0, 0, 'grass').setOrigin(0);
    bg.displayWidth = this.state.game.config.width;
    bg.displayHeight = this.state.game.config.height;
  }
}

export default BaseScene;

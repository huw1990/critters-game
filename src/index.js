
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  physics: {
    default: 'arcade'
  },
  scene: {
    preload: preload,
    create: create
  }
};

new Phaser.Game(config);

function preload () {
  this.load.image('bg', 'assets/bg.png');
}

function create () {
  this.add.image(0, 0, 'bg').setOrigin(0);
}


import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';
import PauseScene from './scenes/PauseScene';

/* An enum for the food smell speed - the number corresponds to how much of the width of the game the smell travels
per second */
var FoodSmellSpeed = Object.freeze({"SLOW":0.2, "MEDIUM":1, "FAST":10});
var gameOptions = {
  critters: 2,
  critterSpeed: 4,
  monsterSpeed: 2,
  critterSizePixels: 130,
  aspectRatio: 16/9,
  critterIdleAngleChangeTime: 500,
  objectTargetChangeInterval: 1000,
  scoreUpdateInterval: 1000,
  tweenSpeed: 100,
  foodSmellSpeed: FoodSmellSpeed.MEDIUM,
  colourPaletteSuffix: 'pastel' //Other option is "retro"
};
var width = gameOptions.critterSizePixels * 15;

var gameState = {
  critters:[],
  allFood:[],
  lastTimeScoreUpdated: 0,
  score: 0
};

const Scenes = [PreloadScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(gameOptions, gameState)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...gameOptions,
  pixelArt: true,
  parent: 'phaser',
	dom: {
		createContainer: true
	},
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: width * gameOptions.aspectRatio
  },
  physics: {
      default: "matter",
      matter: {
        debug: true
      }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  },
  scene: initScenes()
}

gameState.game = new Phaser.Game(config);

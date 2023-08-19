/** Scene used mainly for loading assets. */
import BaseScene from './BaseScene';

class PreloadScene extends BaseScene {

  constructor(config, state){
    super("PreloadScene", config, state);
  }
  
  preload() {
    this.load.image('grass', `assets/bg-${this.config.colourPaletteSuffix}.png`);
    this.load.image('wall', `assets/wall-${this.config.colourPaletteSuffix}.png`);
    this.load.image('food', `assets/food.png`);
    this.load.image('scorebox', `assets/score-box-${this.config.colourPaletteSuffix}.png`);
    this.load.image('critter', `assets/critter-${this.config.colourPaletteSuffix}.png`);
    this.load.image('monster', `assets/monster-${this.config.colourPaletteSuffix}.png`);
  }
  
  create(){
    console.log("Game is loading...");
    this.scene.start("PlayScene");
  }

}
  
export default PreloadScene;
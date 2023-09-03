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
    this.load.spritesheet('critter', 'assets/critter-sprite.png', { frameWidth: 16, frameHeight: 22 });
    this.load.spritesheet('monster', 'assets/monster-sprite.png', { frameWidth: 32, frameHeight: 34 });
    this.load.tilemapTiledJSON('map', 'assets/critters-map.json');
    this.load.image('map-tiles', 'assets/0x72_DungeonTilesetII_v1.6.png');
    this.load.image('menubutton', `assets/menu-button.png`);

  }
  
  create(){
    console.log("Game is loading...");
    this.scene.start("PlayScene");
  }

}
  
export default PreloadScene;
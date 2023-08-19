/** Scene used mainly for loading assets. */
import BaseScene from './BaseScene';

class PreloadScene extends BaseScene {

  constructor(config, state){
    super("PreloadScene", config, state);
  }
  
  preload() {
    this.load.image('logo', 'assets/logo.png');
    this.load.image('resumebutton', 'assets/resume-button.png');
    this.load.image('newgamebutton', 'assets/new-game-button.png');
    this.load.image('settingsbutton', 'assets/settings-button.png');
    this.load.image('helpbutton', 'assets/help-button.png');
    this.load.image('wallheight', 'assets/wallheight.png');
    this.load.image('wallwidth', 'assets/wallwidth.png');
    this.load.image('food', 'assets/food.png');
    this.load.image('menubutton', 'assets/in-game-menu-button.png');
    this.load.image('ingamemenuwatermark', 'assets/ingame-menu-watermark.png');
    this.load.image('ingamemenubg', 'assets/ingame-menu-background.png');
    this.load.image('pausemenutitle', 'assets/game-paused-text.png');
    this.load.image('backtomainmenubutton', 'assets/back-to-main-menu-button.png');
    this.load.image('resumegamebutton', 'assets/resume-button.png');
    this.load.image('newgamebutton', 'assets/new-game-button.png');
    this.load.image('scorebox', 'assets/score-box.png');
    this.load.spritesheet('critter', 'assets/critter.png', { frameWidth: 130, frameHeight: 150 });
    this.load.spritesheet('monster', 'assets/monster.png', { frameWidth: 340, frameHeight: 345 });
  }
  
  create(){
    console.log("Game is loading...");
    this.scene.start("MainMenuScene");
  }

}
  
export default PreloadScene;
import BaseScene from './BaseScene';

class InGameMenuScene extends BaseScene {

  constructor(config, state){
    super("InGameMenuScene", config, state);
    this.gameScene = null;
  }

  init(gameScene) {
    console.log("init, gameScene=" + gameScene);
    this.gameScene = gameScene;
  }
  
  create(){
    console.log("In-game Menu loading...");
    //Display a watermark outside the popup, to darken the actual game screen
    var menuWatermark = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height / 2, 'ingamemenuwatermark');
    menuWatermark.displayWidth = this.state.game.config.width;
    menuWatermark.displayHeight = this.state.game.config.height;

    //Put the popup menu on top of the watermark
    var menuBg = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height / 2, 'ingamemenubg');
    menuBg.displayWidth = this.state.game.config.width * 0.8;
    menuBg.displayHeight = this.state.game.config.height * 0.8;

    //Add a title for the popup
    var titleText = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height * 0.2, 'pausemenutitle');
    titleText.displayWidth = menuBg.displayWidth * 0.8;
    titleText.scaleY = titleText.scaleX;

    //Add the buttons for the various options
    var resumeButton = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height * 0.4, 'resumegamebutton');
    resumeButton.displayWidth = menuBg.displayWidth * 0.6;
    resumeButton.scaleY = resumeButton.scaleX;
    resumeButton.setInteractive({useHandCursor: true});
    resumeButton.on("pointerdown", function(){
      this.gameScene.resumeGameFromMenu();
    }, this);
    var newGameButton = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height * 0.55, 'newgamebutton');
    newGameButton.displayWidth = menuBg.displayWidth * 0.6;
    newGameButton.scaleY = newGameButton.scaleX;
    newGameButton.setInteractive({useHandCursor: true});
    newGameButton.on("pointerdown", function(){
      this.gameScene.startNewGameFromMenu();
    }, this);
    var mainMenuButton = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height * 0.7, 'backtomainmenubutton');
    mainMenuButton.displayWidth = menuBg.displayWidth * 0.6;
    mainMenuButton.scaleY = mainMenuButton.scaleX;
    mainMenuButton.setInteractive({useHandCursor: true});
    mainMenuButton.on("pointerdown", function(){
      this.gameScene.loadMainMenu();
    }, this);

    //Add an on-click listener to remove the popup when the user clicks outside the popup
    this.input.on('pointerdown', function(pointer){
      console.log("scene clicked on");
      var touchX = pointer.x;
      var touchY = pointer.y;
      if ((touchX < this.state.game.config.width * 0.1 || touchX > this.state.game.config.width * 0.9)
          ||  (touchY < this.state.game.config.height * 0.1 || touchY > this.state.game.config.height * 0.9)) {
            this.gameScene.resumeGameFromMenu();
      }
    }, this);
  }

}
  
export default InGameMenuScene;
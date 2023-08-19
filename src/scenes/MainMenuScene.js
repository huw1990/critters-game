import BaseScene from './BaseScene';

class MainMenuScene extends BaseScene {

  constructor(config, state){
    super("MainMenuScene", config, state);
  }
  
  create(){
    console.log("MainMenuScene create()");

    //Set the backgroun colour
    this.cameras.main.setBackgroundColor(0x220c22);

    //Add logo
    var logo = this.add.image(this.state.game.config.width / 2, this.state.game.config.height * 0.2, 'logo');
    logo.displayWidth = this.state.game.config.width * 0.6;
    logo.scaleY = logo.scaleX;

    //Add main buttons
    var resumeButton = this.add.sprite(this.state.game.config.width / 2, this.state.game.config.height /2, 'resumebutton');
    resumeButton.displayWidth = this.state.game.config.width * 0.5;
    resumeButton.scaleY = resumeButton.scaleX;
    resumeButton.setInteractive({useHandCursor: true});
    resumeButton.on("pointerdown", function(){
      //TODO: Only do something if there is a game to resume
      //TODO: Should be a greyed out version of the button if no game to resume
    });
    var newGameButton = this.add.sprite(this.state.game.config.width / 2, (this.state.game.config.height /2 + (resumeButton.displayHeight * 2)), 'newgamebutton');
    newGameButton.displayWidth = this.state.game.config.width * 0.5;
    newGameButton.scaleY = newGameButton.scaleX;
    newGameButton.setInteractive({useHandCursor: true});
    newGameButton.on("pointerdown", function(){
      this.scene.start("PlayScene");
    }, this);

    //Add icon buttons, e.g. settings and help
    const gapAroundButtons = this.state.game.config.width / 20;
    const gapInside = (resumeButton.displayHeight + gapAroundButtons) / 2
    const ycoord = this.state.game.config.height - gapInside;
    var helpButton = this.add.sprite(gapInside, ycoord, 'helpbutton');
    helpButton.displayWidth = resumeButton.displayHeight;
    helpButton.displayHeight = helpButton.displayWidth;
    helpButton.setInteractive({useHandCursor: true});
    helpButton.on("pointerdown", function(){
      //TODO
    }, this);
    var settingsButton = this.add.sprite(this.state.game.config.width - gapInside, ycoord, 'settingsbutton');
    settingsButton.displayWidth = resumeButton.displayHeight;
    settingsButton.displayHeight = settingsButton.displayWidth;
    settingsButton.setInteractive({useHandCursor: true});
    settingsButton.on("pointerdown", function(){
      //TODO
    }, this);
  }

}
  
export default MainMenuScene;
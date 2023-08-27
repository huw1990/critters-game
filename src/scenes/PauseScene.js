import BaseScene from './BaseScene';

class PauseScene extends BaseScene {

  constructor(config, state){
    super("PauseScene", config, state);
  }

  init(gameScene) {
    console.log("init, gameScene=" + gameScene);
    this.gameScene = gameScene;
  }
  
  create(){
    super.create();
    const menuWidth = this.state.game.config.width * 0.7;
    const menuHeight = this.state.game.config.height * 0.3;
    const menuTitleFont = this.state.game.config.width * 0.05;
    const menuButtonFont = this.state.game.config.width * 0.03;
    const padding = this.state.game.config.width * 0.02;

    const menuHtml = `<style>
      .menu {
        background-color: #A8D1D1; 
        width: ${menuWidth}px; 
        height: ${menuHeight}px; 
        padding: ${padding}px; 
        text-align: center
      }

      .menu h1 {
        font: ${menuTitleFont}px Arial; 
        font-weight: bold
      }

      .menu button {
        cursor: pointer; 
        margin: ${padding}px; 
        padding: ${padding * 2}px; 
        background-color: #FFDFA4; 
        width: ${menuWidth * 0.6}px; 
        font: ${menuButtonFont}px Arial;
      }

      .menu button:hover {
        background-color: #FDEAC3;
      }
    </style>
    <body>
    <div class="menu">
      <h1>Game Paused</h1>
      <button id="resume">Resume Game</button>
      <button id="newgame">New Game</button>
    </div>
    </body>`;

    const element = this.add.dom(this.state.game.config.width / 2, this.state.game.config.height /2).createFromHTML(menuHtml);

    element.addListener('click');

    element.on('click', (event) => {

      if (event.target.id === 'resume') {
        this.gameScene.resumeGameFromMenu();
      } else if (event.target.id === 'newgame') {
        this.gameScene.startNewGameFromMenu();
      }
    });

    this.input.on("pointerdown", function(pointer){
      this.gameScene.resumeGameFromMenu();
    }, this);
  }

}
  
export default PauseScene;
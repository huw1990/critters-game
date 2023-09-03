import HtmlMenuScene from './HtmlMenuScene';

class PauseScene extends HtmlMenuScene {

  constructor(config, state){
    super("PauseScene", config, state);
  }

  init(gameScene) {
    super.init(gameScene);
  }
  
  create(){
    super.create();
  }

  getGameScene() {
    return super.getGameScene();
  }

  getHtml() {
    return `<h1>Game Paused</h1>
    <button id="resume">Resume Game</button>
    <button id="newgame">New Game</button>`;
  }

  clickHandler(event) {
    if (event.target.id === 'resume') {
      this.getGameScene().resumeGameFromMenu();
    } else if (event.target.id === 'newgame') {
      this.getGameScene().startNewGameFromMenu();
    }
  }

  cancelHandler() {
    this.gameScene.resumeGameFromMenu();
  }

}
  
export default PauseScene;
import HtmlMenuScene from './HtmlMenuScene';

class GameOverScene extends HtmlMenuScene {

  constructor(config, state){
    super("GameOverScene", config, state);
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
    console.log(`score=${this.state.score}`);
    return `<h1>GAME OVER</h1>
    <h3>Score: ${this.state.score}</h3>
    <button id="newgame">New Game</button>`;
  }

  clickHandler(event) {
    if (event.target.id === 'newgame') {
      this.getGameScene().startNewGameAfterEnded();
    }
  }

  cancelHandler() {
    //Don't do anything, user must choose
  }

}
  
export default GameOverScene;
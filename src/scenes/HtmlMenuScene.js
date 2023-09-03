import BaseScene from './BaseScene';

class HtmlMenuScene extends BaseScene {

  constructor(name, config, state){
    super(name, config, state);
  }

  getHtml() {
    return ``;
  }

  clickHandler(event) {
    //Handled by subclass
  }

  cancelHandler() {
    //Handled by subclass
  }

  getGameScene() {
    return this.gameScene;
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
    const subMenuTitleFont = this.state.game.config.width * 0.04;
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

      .menu h3 {
        font: ${subMenuTitleFont}px Arial; 
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
      ${this.getHtml()}
    </div>
    </body>`;

    const element = this.add.dom(this.state.game.config.width / 2, this.state.game.config.height /2).createFromHTML(menuHtml);

    element.addListener('click');

    element.on('click', this.clickHandler, this);

    this.input.on("pointerdown", this.cancelHandler, this);
  }

}
  
export default HtmlMenuScene;
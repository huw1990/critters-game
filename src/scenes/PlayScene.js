import BaseScene from './BaseScene';
import Critter from './../gameobjects/Critter';
import Monster from './../gameobjects/Monster';
import Food from './../gameobjects/Food';

class PlayScene extends BaseScene {

  constructor(config, state){
    super("PlayScene", config, state);
  }
  
  preload() {

  }
  
  create(){
    console.log("playGame create()");
    console.log("width=" + this.state.game.config.width);
    console.log("height=" + this.state.game.config.height);

    //Clear any maps of state we have, in case this is not the first time we're creating this scene
    this.state.critters.length = 0;
    this.state.allFood.length = 0;
    this.state.score = 0;

    /* Set some values based on the game width and height (which is dynamic, depending on screen size). Used for
    placing walls and other objects in the screen, relative to the screen size. */
    const wallDepth = this.state.game.config.width / 30;
    const gapBetweenWallAndEdge = this.state.game.config.width / 60;
    const sizeOfTopBar = this.state.game.config.height * 0.05;

    //Create the top bar, showing the score, etc.
    const gapAroundMenuButton = sizeOfTopBar * 0.02;
    const menuButtonSize = sizeOfTopBar - (gapAroundMenuButton * 2);
    var menuButton = this.add.sprite(this.state.game.config.width - (menuButtonSize / 2) - (gapAroundMenuButton * 3), ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), 'menubutton');
    menuButton.displayWidth = menuButtonSize;
    menuButton.scaleY = menuButton.scaleX;
    menuButton.setInteractive({useHandCursor: true});
    menuButton.on("pointerdown", function(){
      console.log("launching in game menu");
      this.scene.pause();
      this.scene.launch("InGameMenuScene", this);
    }, this);
    var scoreBox = this.add.sprite(this.state.game.config.width / 2, ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), 'scorebox');
    scoreBox.displayHeight = menuButtonSize;
    scoreBox.scaleX = scoreBox.scaleY;
    const fontSize = menuButtonSize * 0.6;
    console.log("font size=" + fontSize);
    this.scoreText = this.add.text(this.state.game.config.width / 2, ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), "0", {fontSize: fontSize + 'px', fill: '#000', fontFamily: 'Verdana, Geneva, sans-serif'});
    this.scoreText.setOrigin(0.5);

    //Set the world bounds, the starting x and y, then the width and height
    var boundX = gapBetweenWallAndEdge + wallDepth;
    var boundY = sizeOfTopBar + gapBetweenWallAndEdge + wallDepth;
    this.matter.world.setBounds(boundX, boundY, this.state.game.config.width - boundX - boundX, this.state.game.config.height - boundY - boundX);
    this.matter.world.disableGravity();
    //Set world bound values
    this.state.worldBounds = {startX: boundX, startY: boundY, endX: this.state.game.config.width - boundX, endY: this.state.game.config.height - boundY};

    //Add the walls as just images, not as physics objects. We'll set the world bounds to be the edges of these walls
    //Left wall
    var leftWall = this.add.image((wallDepth / 2) + gapBetweenWallAndEdge, (this.state.game.config.height / 2) + (sizeOfTopBar / 2), 'wallheight');
    leftWall.displayWidth = wallDepth;
    leftWall.displayHeight = (this.state.game.config.height - sizeOfTopBar) - (((wallDepth / 2) + gapBetweenWallAndEdge) * 2);
    //Top wall
    var topWall = this.add.image(this.state.game.config.width /2, sizeOfTopBar + (wallDepth / 2) + gapBetweenWallAndEdge, 'wallwidth');
    topWall.displayWidth = this.state.game.config.width - (gapBetweenWallAndEdge * 2);
    topWall.displayHeight = wallDepth;
    //Right wall
    var rightWall = this.add.image(this.state.game.config.width - ((wallDepth / 2) + gapBetweenWallAndEdge), (this.state.game.config.height / 2) + (sizeOfTopBar / 2), 'wallheight');
    rightWall.displayWidth = wallDepth;
    rightWall.displayHeight = (this.state.game.config.height - sizeOfTopBar) - (((wallDepth / 2) + gapBetweenWallAndEdge) * 2);
    //Bottom wall
    var bottomWall = this.add.image(this.state.game.config.width /2, this.state.game.config.height - ((wallDepth / 2) + gapBetweenWallAndEdge), 'wallwidth');
    bottomWall.displayWidth = this.state.game.config.width - (gapBetweenWallAndEdge * 2);
    bottomWall.displayHeight = wallDepth;

    //Create the critters
    for (var i = 0; i < this.config.critters; i++) {
      console.log("creating critter");
      var critter = new Critter(this, this.state.game.config.width / 2, this.state.game.config.height / 4, i, (this.config.critterSpeed + i), this.config, this.state);
      critter.displayWidth = this.state.game.config.width / 20;
      critter.scaleY = critter.scaleX;
      this.state.critters.push(critter);
      //Add  a collision detector for when the critter "collides with" the food, i.e. eats it
      this.matterCollision.addOnCollideStart({
        objectA: critter,
        callback: eventData => {
          const { bodyB, gameObjectB } = eventData;
          console.log("Player touched something, bodyB=" + bodyB + ", gameObjectB=" + gameObjectB);
          if (gameObjectB !== null) {
            /* The 'critter' variable will be assigned to the last critter in the loop by the time a collision is
               detected, so use the eventData object to get the correct critter that the collision was detected on. */
            var shouldDelete = eventData.gameObjectA.collisionDetected(this, gameObjectB);
            if (shouldDelete) {
              gameObjectB.setVisible(false);
              this.matter.world.remove(gameObjectB);
            }
          }
        }
      });
    }

    //Add the monster
    console.log("creating monster");
    this.state.monster = new Monster(this, this.state.game.config.width / 2, this.state.game.config.height * 0.85, this.config, this.state);
    this.state.monster.displayWidth = this.state.game.config.width / 11;
    this.state.monster.scaleY = this.state.monster.scaleX;

    //Add  a collision detector for when the monster "collides with" the critter, i.e. eats it
    this.matterCollision.addOnCollideStart({
      objectA: this.state.monster,
      callback: eventData => {
        const { bodyB, gameObjectB } = eventData;
        console.log("Monster touched something, bodyB=" + bodyB + ", gameObjectB=" + gameObjectB);
        if (gameObjectB !== null) {
          this.state.monster.collisionDetected(this, gameObjectB, this.matter.world);
        }
      }
    });

    //The animation for critter movement
    this.anims.create({
        key: 'critter-moving',
        frames: this.anims.generateFrameNumbers('critter', { start: 0, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    //The animation for monster movement
    this.anims.create({
        key: 'monster-moving',
        frames: this.anims.generateFrameNumbers('monster', { start: 0, end: 5 }),
        frameRate: 7,
        repeat: -1
    });

    //Place the food wherever the mouse is clicked
    this.input.on("pointerdown", function(pointer){
      if (this.isWithinWorldBounds(pointer.x, pointer.y)) {
        var food = new Food(this, pointer.x, pointer.y, this.config, this.state);
        food.displayWidth = this.state.game.config.width / 100;
        food.scaleY = food.scaleX;
        this.state.allFood.push(food);
        console.log("food placed at (" + pointer.x + "," + pointer.y + ")");
      }
    }, this);
  }

  update() {
    //console.log("update");
    if (this.state.critters.length == 0) {
      //No more critters remaining, so GAME OVER
      console.log("GAME OVER");
      this.scene.pause();
    }
    for (var i = 0; i < this.state.critters.length; i++) {
      var critter = this.state.critters[i];
      if (typeof critter !== 'undefined') {
        //console.log("updating critter=" + critter);
        critter.update(this);
      }
    }
    this.state.monster.update();
    const now = new Date().getTime();
    if (now > (this.state.lastTimeScoreUpdated + this.config.scoreUpdateInterval)) {
      const numCritters = this.state.critters.length;
      this.state.score+=numCritters;
      this.scoreText.text = this.state.score.toString();
      this.state.lastTimeScoreUpdated = now;
    }
  }

  resumeGameFromMenu() {
    this.scene.stop("InGameMenuScene");
      console.log("resume game, resuming scene");
      this.scene.resume("PlayScene");
  }

  startNewGameFromMenu() {
    this.scene.stop("InGameMenuScene");
    this.scene.start("PlayScene");
  }

  loadMainMenu() {
    this.scene.stop("InGameMenuScene");
    this.scene.start("MainMenuScene");
  }
    
  /* Checks whether the provided coordinates are within the bounds of the walls of the game. Typically used for placing
     food on the screen on mouse click. */
  isWithinWorldBounds(x, y) {
    return (x > this.state.worldBounds.startX && x < this.state.worldBounds.endX && y > this.state.worldBounds.startY && y < this.state.worldBounds.endY);
  }

}
  
export default PlayScene;
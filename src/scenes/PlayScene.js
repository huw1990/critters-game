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

  create() {
    super.create();

    //Clear any maps of state we have, in case this is not the first time we're creating this scene
    this.state.critters.length = 0;
    this.state.allFood.length = 0;
    this.state.score = 0;

    //Create the map from the loaded tileset
    const map = this.createMap();
    const layers = this.createLayers(map);

    /* Set some values based on the game width and height (which is dynamic, depending on screen size). Used for
    placing walls and other objects in the screen, relative to the screen size. */
    const mapScale = this.state.game.config.width / 288;
    const sizeOfTopBar = 40 * mapScale;
    const gapBetweenWallAndEdge = this.state.game.config.width / 60;

    //Create the top bar, showing the score, etc.
    const gapAroundMenuButton = sizeOfTopBar * 0.1;

    const menuButtonSize = sizeOfTopBar - (gapAroundMenuButton * 2);
    var menuButton = this.add.sprite(this.state.game.config.width - (menuButtonSize / 2) - (gapAroundMenuButton * 3), ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), 'menubutton');
    menuButton.displayWidth = menuButtonSize;
    menuButton.scaleY = menuButton.scaleX;
    menuButton.setInteractive({useHandCursor: true});
    menuButton.on("pointerdown", function(){
      console.log("launching in game menu");
      this.scene.pause();
      this.scene.launch("PauseScene", this);
    }, this);

    var scoreBox = this.add.sprite(this.state.game.config.width / 2, ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), 'menubutton');
    const scoreButtonSize = sizeOfTopBar - (gapAroundMenuButton * 2);
    scoreBox.displayHeight = scoreButtonSize;
    scoreBox.displayWidth = this.state.game.config.width /3;
    const fontSize = scoreButtonSize * 0.6;
    console.log("font size=" + fontSize);
    this.scoreText = this.add.text(this.state.game.config.width / 2, ((sizeOfTopBar / 2) + (gapBetweenWallAndEdge / 2)), "0", {fontSize: fontSize + 'px', fill: '#000', fontFamily: 'Verdana, Geneva, sans-serif'});
    this.scoreText.setOrigin(0.5);

    //Set the world bounds, the starting x and y, then the width and height
    //internal dimensions: (17,65) to (271,490)
    this.matter.world.setBounds(17 * mapScale, 65 * mapScale, 271 * mapScale, 490 * mapScale);
    this.matter.world.disableGravity();
    //Set world bound values
    this.state.worldBounds = {startX: 17 * mapScale, startY: 65 * mapScale, endX: 271 * mapScale, endY: 490 * mapScale};

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
        frames: this.anims.generateFrameNumbers('critter', { start: 4, end: 8 }),
        frameRate: 7,
        repeat: -1
    });

    //The animation for monster movement
    this.anims.create({
        key: 'monster-moving',
        frames: this.anims.generateFrameNumbers('monster', { start: 4, end: 7 }),
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

  createMap() {
    const map = this.make.tilemap({key: 'map'});
    map.addTilesetImage('0x72_DungeonTilesetII_v1.6', 'map-tiles');
    return map;
  }

  createLayers(map) {
    const tileset = map.getTileset('0x72_DungeonTilesetII_v1.6');
    const floor = map.createLayer('floor', tileset);
    this.scaleMapLayer(floor);
    const walls = map.createLayer('walls', tileset);
    this.scaleMapLayer(walls);
    return { floor, walls };
  }

  scaleMapLayer(layer) {
    layer.displayWidth = this.state.game.config.width;
    layer.displayHeight = this.state.game.config.height;
  }

  update() {
    //console.log("update");
    if (this.state.critters.length == 0) {
      //No more critters remaining, so GAME OVER
      console.log("GAME OVER");
      this.scene.pause();
      this.scene.launch("GameOverScene", this);
    }
    let amountOfFoodEaten = 0;
    for (var i = 0; i < this.state.critters.length; i++) {
      var critter = this.state.critters[i];
      if (typeof critter !== 'undefined') {
        //console.log("updating critter=" + critter);
        critter.update(this);
        amountOfFoodEaten = amountOfFoodEaten + critter.getAmountOfFoodEaten();
      }
    }
    this.state.monster.update();
    const now = new Date().getTime();
    if (now > (this.state.lastTimeScoreUpdated + this.config.scoreUpdateInterval)) {
      // Score is the amount of food eaten by all critters, cumulatively
      this.state.score+=amountOfFoodEaten;
      this.scoreText.text = this.state.score.toString();
      this.state.lastTimeScoreUpdated = now;
    }
  }
    
  /* Checks whether the provided coordinates are within the bounds of the walls of the game. Typically used for placing
     food on the screen on mouse click. */
  isWithinWorldBounds(x, y) {
    return (x > this.state.worldBounds.startX && x < this.state.worldBounds.endX && y > this.state.worldBounds.startY && y < this.state.worldBounds.endY);
  }

  resumeGameFromMenu() {
    this.scene.stop("PauseScene");
    this.scene.resume("PlayScene");
  }

  startNewGameFromMenu() {
    this.scene.stop("PauseScene");
    this.scene.start("PlayScene");
  }

  startNewGameAfterEnded() {
    this.scene.stop("GameOverScene");
    this.scene.start("PlayScene");
  }

}
  
export default PlayScene;
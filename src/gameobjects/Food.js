import Phaser from 'phaser';

class Food  extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, gameConfig, gameState) {
      super(scene.matter.world, x, y, 'food');
      this.gameConfig = gameConfig;
      this.gameState = gameState;
      //Add to the display list of the scene, otherwise the texture won't be displayed
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.setFixedRotation();
      this.xVelo = 0;
      this.yVelo = 0;
      this.timeAdded = new Date().getTime();
    }
  
    canCritterSmellYet(now, critter) {
      const millisSinceFoodPlaced = now - this.timeAdded;
      const distanceOfCritterFromFood = Phaser.Math.Distance.Between(this.x, this.y, critter.x, critter.y);
      console.log("food was placed at distance of " + distanceOfCritterFromFood + " at time of " + millisSinceFoodPlaced + " millis ago");
      const smellableDistance = (this.gameConfig.foodSmellSpeed * this.gameState.game.config.width) * (millisSinceFoodPlaced / 1000);
      console.log("smellable distance=" + smellableDistance);
      if (smellableDistance >= distanceOfCritterFromFood) {
        return true;
      }
      return false;
    }
  }
  
export default Food;
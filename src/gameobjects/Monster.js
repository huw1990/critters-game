import Phaser from 'phaser';
import MoveableGameObject from './MoveableGameObject';

class Monster extends MoveableGameObject {
    constructor(scene, x, y, gameConfig, gameState) {
      super(scene, x, y, 'monster');
      this.gameConfig = gameConfig;
      this.gameState = gameState;
      this.lastTimeCheckingCritters = 0;
      this.lastTimeSettingAngle = 0;
      this.currentlyEating = false;
    }
  
    update() {
      if (this.currentlyEating) {
          this.setXVelo(0);
          this.setYVelo(0);
      } else {
        var now = new Date().getTime();
        if (this.gameState.critters.length > 0) {
          if (now > (this.lastTimeCheckingCritters + this.gameConfig.objectTargetChangeInterval)) {
            //Select one of the possible algorithms for moving towards food
            this.moveTowardsClosestCritter();
            this.lastTimeCheckingCritters = now;
          }
          if (this.xVelo !== 0 || this.yVelo !== 0) {
            this.anims.play('monster-moving', true);
          }
        } else {
          //TODO: game should be over now
        }
      }
      this.setVelocity(this.getXVelo(), this.getYVelo());
    }
  
    moveTowardsClosestCritter() {
      var closestDistance = -1;
      var closestCritter = null;
      for (var i = 0; i < this.gameState.critters.length; i++) {
        const critter = this.gameState.critters[i];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, critter.x, critter.y);
        if (closestDistance == -1 || distance < closestDistance) {
          closestCritter = critter;
          closestDistance = distance;
        }
      }
      super.moveToObj(closestCritter, this.gameConfig.monsterSpeed);
    }
  
    collisionDetected(scene, gameObjectB, physicsWorld) {
      //Check if the collided object was a critter
      for (var i = 0; i < this.gameState.critters.length; i++) {
        var critterFromArray = this.gameState.critters[i];
        if (critterFromArray == gameObjectB) {
          console.log("critter eaten, removing object from critter array at position=" + i);
          //TODO: should store the eaten critter to reuse the resource when adding a new critter later
          this.gameState.critters.splice(i, 1);
          this.eatCritter(scene, gameObjectB, physicsWorld);
        }
      }
    }
  
    eatCritter(scene, critter, physicsWorld) {
      console.log("eat critter");
      this.targetEaten();
      this.currentlyEating = true;
      this.anims.stop(null, true);
      this.setFrame(6);
      critter.eatenByMonster(scene, this, physicsWorld);
    }
  
    finishedEating() {
      this.currentlyEating = false;
    }
  }
  
export default Monster;